// Demonstration tariffs, in rubles and working days. No external service required.
export const TYPES = {
  landing: {name:'Лендинг', price:40000, days:7, pages:1},
  corporate: {name:'Корпоративный сайт', price:70000, days:12, pages:5},
  shop: {name:'Интернет-магазин', price:100000, days:18, pages:10}
};
export const FEATURES = {
  form: {name:'Форма заявки', price:5000, days:1},
  catalog: {name:'Каталог', price:20000, days:4},
  payment: {name:'Онлайн-оплата', price:15000, days:3},
  crm: {name:'Интеграция с CRM', price:12000, days:2},
  language: {name:'Второй язык', price:15000, days:3}
};
export function calculate({type='landing', pages=1, features=[], urgency='standard'}={}) {
  if (!Object.hasOwn(TYPES,type)) throw new RangeError('Неизвестный тип сайта');
  if (!Number.isInteger(pages)||pages<1||pages>100) throw new RangeError('Введите целое число страниц от 1 до 100');
  if (!['standard','express'].includes(urgency)) throw new RangeError('Неизвестная срочность');
  if (!Array.isArray(features)||features.some(key=>!Object.hasOwn(FEATURES,key))) throw new RangeError('Неизвестная функция');
  if(type==='landing') pages=1;
  const selected=new Set(features);
  if(type==='shop') selected.add('catalog');
  const base=TYPES[type];
  const lines=[{name:base.name+' · база',price:base.price}];
  let days=base.days;
  if(pages>1){lines.push({name:'Доп. страницы: '+(pages-1)+' × 4 000 ₽',price:(pages-1)*4000});days+=pages-1;}
  for(const key of Object.keys(FEATURES)) if(selected.has(key)) {lines.push({name:FEATURES[key].name,price:FEATURES[key].price});days+=FEATURES[key].days;}
  const subtotal=lines.reduce((sum,line)=>sum+line.price,0);
  const surcharge=urgency==='express'?Math.round(subtotal*.3):0;
  if(surcharge){lines.push({name:'Срочность + 30%',price:surcharge,surcharge:true});days=Math.ceil(days*.7);}
  return {type,pages,features:[...selected],urgency,lines,total:subtotal+surcharge,days,maxDays:Math.ceil(days*1.2)};
}
