import {calculate,TYPES} from './calculator.mjs';
const $=id=>document.getElementById(id);
const form=$('calculator'), pages=$('pages'), range=$('page-range');
const money=value=>new Intl.NumberFormat('ru-RU').format(value)+' ₽';
let result,previousType='landing';
function setError(message=''){$('pages-error').textContent=message;$('pages-error').hidden=!message;pages.setAttribute('aria-invalid',String(!!message));$('copy').disabled=!!message;$('print').disabled=!!message;}
function render(){
  const type=form.elements.type.value,urgency=form.elements.urgency.value;
  const features=[...form.querySelectorAll('[name="feature"]:checked')].map(input=>input.value);
  try{result=calculate({type,pages:Number(pages.value),features,urgency});setError();}catch(error){setError(error.message);return;}
  $('total').replaceChildren(document.createTextNode(new Intl.NumberFormat('ru-RU').format(result.total)+' '),Object.assign(document.createElement('span'),{textContent:'₽'}));
  $('days').textContent=`${result.days}–${result.maxDays} рабочих дней`;
  $('breakdown').replaceChildren(...result.lines.map(line=>{const row=document.createElement('div');row.className='line-item'+(line.surcharge?' surcharge':'');for(const value of [line.name,money(line.price)])row.append(Object.assign(document.createElement('span'),{textContent:value}));return row;}));
  range.value=pages.value;
  $('minus').disabled=type==='landing'||Number(pages.value)<=1;
  $('plus').disabled=type==='landing'||Number(pages.value)>=100;
  $('status').textContent='';
}
function syncType(){const type=form.elements.type.value;const landing=type==='landing';if(type!==previousType)pages.value=TYPES[type].pages;previousType=type;pages.disabled=landing;range.disabled=landing;
  $('pages-hint').textContent=landing?'Лендинг — одностраничный сайт.':'Первая страница включена. Каждая следующая — 4 000 ₽.';
  const catalog=form.querySelector('[value="catalog"]');
  if(type==='shop'){catalog.checked=true;catalog.disabled=true;catalog.closest('label').querySelector('small').textContent='Обязателен для интернет-магазина';}
  else{catalog.disabled=false;catalog.closest('label').querySelector('small').textContent='Товары, категории и фильтры';}
}
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('change',()=>{syncType();render();});
pages.addEventListener('input',render);
range.addEventListener('input',()=>{pages.value=range.value;render();});
$('minus').addEventListener('click',()=>{pages.value=Math.max(1,Number(pages.value)-1);render();});
$('plus').addEventListener('click',()=>{pages.value=Math.min(100,Number(pages.value)+1);render();});
form.addEventListener('reset',()=>{setTimeout(()=>{previousType='landing';syncType();render();},0);});
function summary(){return ['Предварительная оценка сайта',TYPES[result.type].name+' · страниц: '+result.pages,...result.lines.map(line=>line.name+': '+money(line.price)),'Итого: '+money(result.total),`Срок: ${result.days}–${result.maxDays} рабочих дней`,'Демонстрационные тарифы. Точная оценка — после согласования ТЗ.','Переводы, контент, домен, хостинг и комиссии сервисов не включены.'].join('\n');}
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary());$('status').textContent='Расчёт скопирован — можно отправить клиенту.';}catch{const text=document.createElement('textarea');text.value=summary();text.style.cssText='position:fixed;left:-9999px';document.body.append(text);text.select();let copied=false;try{copied=document.execCommand('copy');}catch{}text.remove();$('status').textContent=copied?'Расчёт скопирован.':'Копирование недоступно. Сохраните расчёт в PDF.';}});
$('print').addEventListener('click',()=>window.print());
syncType();render();
