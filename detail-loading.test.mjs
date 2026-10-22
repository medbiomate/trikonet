import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {loadContentRecord} from './content-record.js';
test('authoritative saved record returns while imported source is still pending', async()=>{
 const saved={slug:'sample',title:'Saved job'};
 const calls=[];
 const result=await loadContentRecord(async url=>{calls.push(url);return url.includes('/local/')?{ok:true,json:async()=>saved}:new Promise(()=>{});},'','job_listing','sample');
 assert.equal(result,saved);assert.equal(calls.length,2);
});
test('local absence still resolves the imported record',async()=>{
 const imported={slug:'sample'};
 assert.equal(await loadContentRecord(async url=>url.includes('/local/')?{status:404}:{ok:true,json:async()=>[imported]},'','job_listing','sample'),imported);
});
test('embedded job renders without awaiting employer and related-job downloads',async()=>{
 const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');
 const start=source.indexOf('let jobExtrasReady;'),end=source.indexOf('const fieldValues=',start);
 const record={slug:'sample',title:'A job',company:'Example',status:'publish'};
 const calls=[];
 const context=vm.createContext({path:'/job/sample',wpRecord:null,wpEmployer:null,orgJobs:[],categoryJobs:[],profileJobs:[],URL,URLSearchParams,console,
 document:{getElementById:()=>({textContent:JSON.stringify(record)})},
 loadContentRecord(fetcher,base,type){assert.equal(type,'employer');calls.push('/employer?');return new Promise(()=>{});},fetch:url=>{calls.push(url);return new Promise(()=>{});}});
 await vm.runInContext(source.slice(start,end)+';loadWordPressRecord()',context);
 assert.equal(context.wpRecord.slug,'sample');assert.ok(calls.some(url=>url.includes('/employer?')));
});
test('WordPress employer slugs resolve from Unicode and stored percent escapes', async()=>{
 const stored='rentify-%f0%9f%87%a6%f0%9f%87%aa';
 for(const slug of [stored,decodeURIComponent(stored),stored.toUpperCase().replace('RENTIFY','rentify')]){
  const calls=[];
  const record={slug:stored};
  const result=await loadContentRecord(async url=>{
   calls.push(url);
   if(url.includes('/local/'))return {status:404};
   assert.equal(new URL(url,'https://example.com').searchParams.get('slug'),stored);
   return {ok:true,json:async()=>[record]};
  },'','employer',slug);
  assert.equal(result,record);
 }
});
test('middle dots in employer slugs retain their WordPress spelling',async()=>{
 const record={slug:'neue-world-ai-design-agency-uae-%c2%b7-eu-%c2%b7-usa'};
 const result=await loadContentRecord(async url=>url.includes('/local/')?{status:404}:{ok:true,json:async()=>new URL(url,'https://example.com').searchParams.get('slug')===record.slug?[record]:[]},'','employer',decodeURIComponent(record.slug));
 assert.equal(result,record);
});
test('guessed employer URL resolves only a unique exact company name and respects saved overrides',async()=>{
 const record={slug:'reemhospital',title:{rendered:'Reem Hospital'}};
 const lookup=async(url)=>url.includes('/local/')?{status:404}: {ok:true,json:async()=>url.includes('slug=reemhospital')||url.includes('?q=')?[record]:[]};
 assert.equal((await loadContentRecord(lookup,'','employer','reem-hospital')).slug,'reemhospital');
 const unrelated=async url=>url.includes('/local/')?{status:404}:{ok:true,json:async()=>url.includes('?q=')?[{slug:'al-reem',title:{rendered:'Al Reem Health Group'}}]:[]};
 assert.equal(await loadContentRecord(unrelated,'','employer','reem-hospital'),null);
 const ambiguous=async url=>url.includes('/local/')?{status:404}:{ok:true,json:async()=>url.includes('?q=')?[record,{...record,slug:'reem-hospital-2'}]:[]};
 assert.equal(await loadContentRecord(ambiguous,'','employer','reem-hospital'),null);
 const draft={...record,status:'draft'};
 assert.equal(await loadContentRecord(async url=>url.includes('/local/employers/reemhospital')?{ok:true,json:async()=>draft}:lookup(url),'','employer','reem-hospital'),draft);
});
