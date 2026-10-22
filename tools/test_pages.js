// Headless checks: npm i jsdom@24 (outside repo, NODE_PATH ok) then node tools/test_pages.js
const {JSDOM}=require('jsdom'),fs=require('fs'),R=require('path').resolve(__dirname,'..')+'/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:(fail++,console.log('FAIL',m))};
function load(f){const d=new JSDOM(fs.readFileSync(R+f,'utf8'),{runScripts:'dangerously',resources:'usable',url:'file://'+R+f});
 return new Promise(r=>d.window.addEventListener('load',()=>r(d.window)));}
function set(w,el,v){el.value=v;el.dispatchEvent(new w.Event('input',{bubbles:true}));}
(async()=>{
 let w=await load('semi-monthly.html'),D=w.document,$=id=>D.getElementById(id);
 ok(!$('out').hidden && /\$/.test($('summary').textContent),'semi default shows');
 set(w,$('pay1'),''); ok($('out').hidden,'blank pay1 hides'); ok(!/15th/.test($('errors').textContent),'no 15th error when blank'); ok(!/-\$1,845/.test(D.body.textContent),'no -1845');
 set(w,$('pay1'),'1e15'); ok($('out').hidden && $('pay1').getAttribute('aria-invalid')==='true','1e15 rejected');
 set(w,$('pay1'),'1850'); ok(!$('out').hidden,'valid again'); ok(!D.querySelector('.field-err'),'errors cleared');
 set(w,$('pay2'),'-5'); ok($('out').hidden && /15th/.test($('errors').textContent),'neg pay2 error');
 set(w,$('pay2'),''); set(w,D.querySelector('.day'),'40'); ok($('out').hidden && /Row 1/.test($('errors').textContent),'bad day');
 $('reset').click(); ok(!$('out').hidden && D.querySelectorAll('#bills .list-row').length===8,'reset');
 w=await load('debt-compare.html');D=w.document;
 ok(!$('out').hidden && /Debt-free/.test($('summary').textContent),'debt default');
 set(w,D.querySelectorAll('.apr')[1],'150'); ok($('out').hidden && /Row 2 \(Credit card\) APR/.test($('errors').textContent),'bad apr row named');
 set(w,D.querySelectorAll('.apr')[1],'22.9'); set(w,D.querySelectorAll('.bal')[0],'abc');
 set(w,D.querySelectorAll('.bal')[0],''); ok($('out').hidden && /Row 1/.test($('errors').textContent),'blank bal');
 $('reset').click(); ok(!$('out').hidden,'debt reset');
 set(w,$('extra'),'1e15'); ok($('out').hidden,'extra max');
 const sim=w.SC_simulate([{name:'a',balance:1000,apr:12,min:100}],0,'snowball'); ok(sim.done&&sim.months===11,'sim '+sim.months);
 w=await load('three-paycheck.html');D=w.document;
 ok(/Example date/.test($('anchor-hint').textContent),'example label');
 set(w,$('net'),'-100'); ok(/Net pay/.test($('errors').textContent)&&$('months-title').hidden,'neg net');
 set(w,$('net'),''); ok(!$('months-title').hidden,'title back');
 set(w,$('year-input'),'99999'); ok($('months-title').hidden && !/99999/.test($('months-title').textContent+$('summary').textContent),'year invalid hides title');
 set(w,$('year-input'),'2027'); set(w,$('anchor'),'2027-01-01'); ok(/27/.test($('summary').textContent)&&/July/.test($('summary').textContent),'2027 calc');
 ok(!/Example date/.test($('anchor-hint').textContent),'hint changes');
 w=await load('payday-holidays.html');D=w.document;
 set(w,$('year-input'),'3000'); ok($('list-title').hidden,'ph year hides');
 set(w,$('year-input'),'2027'); ok(!$('list-title').hidden && /2027/.test($('list-title').textContent),'ph back');
 console.log(pass,'passed',fail,'failed');
})();
