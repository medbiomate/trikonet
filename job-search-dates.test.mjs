import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./admin.js',import.meta.url),'utf8');
const start=source.indexOf('  function searchAllJobDates()');
const end=source.indexOf("  document.querySelector('#admin-search').addEventListener",start);
for(const mode of ['today','custom','all'])test(`search covers all dates from ${mode}`,()=>{
 let selected,requests=0;const context={currentPage:5,dayMode:{value:mode},document:{querySelector:()=>({value:'Physiotherapist'})},selectJobDay:value=>{selected=value;requests++;},renderJobRows:()=>{requests++;}};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);context.searchAllJobDates();
 assert.equal(context.currentPage,1);assert.equal(requests,1);assert.equal(selected,mode==='all'?undefined:'all');
});
test('empty search leaves the chosen date unchanged',()=>{
 let changed=false;const context={dayMode:{value:'today'},document:{querySelector:()=>({value:'  '})},selectJobDay:()=>{changed=true;},renderJobRows(){}};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);context.searchAllJobDates();assert.equal(changed,false);
});
