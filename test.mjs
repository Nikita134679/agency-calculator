import assert from 'node:assert/strict';
import {calculate,FEATURES} from './calculator.mjs';
assert.equal(calculate().total,40000);
assert.equal(calculate({type:'corporate',pages:5}).total,86000);
const shop=calculate({type:'shop',pages:10,features:['catalog','catalog']});
assert.equal(shop.total,156000);assert.equal(shop.days,31);
const full=calculate({type:'corporate',pages:5,features:Object.keys(FEATURES),urgency:'express'});
assert.equal(full.total,198900);assert.equal(full.days,21);assert.equal(full.maxDays,26);
for(const pages of [0,-1,101,NaN,1.5]) assert.throws(()=>calculate({pages}),RangeError);
assert.throws(()=>calculate({type:'unknown'}),RangeError);
assert.throws(()=>calculate({features:['unknown']}),RangeError);
let scenarios=0;
for(const type of ['landing','corporate','shop'])for(const pages of [1,5,100])for(let mask=0;mask<32;mask++){
 const features=Object.keys(FEATURES).filter((_,i)=>mask&(1<<i));
 const a=calculate({type,pages,features}), b=calculate({type,pages,features,urgency:'express'});
 assert.equal(a.total,a.lines.reduce((sum,l)=>sum+l.price,0));
 assert.equal(b.total,Math.round(a.total*1.3));assert.ok(b.days<=a.days);assert.ok(a.maxDays>=a.days);
 if(type==='shop')assert.equal(a.lines.filter(l=>l.name==='Каталог').length,1);
 if(type==='landing')assert.equal(a.pages,1);
 scenarios+=2;
}
console.log(`Passed: ${scenarios} calculation scenarios, known totals, invalid input, catalog deduplication and urgency.`);
