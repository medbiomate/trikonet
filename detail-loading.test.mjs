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
 loadContentRecord(){assert.fail('must reuse the server record');},fetch:url=>{calls.push(url);return new Promise(()=>{});}});
 await vm.runInContext(source.slice(start,end)+';loadWordPressRecord()',context);
 assert.equal(context.wpRecord.slug,'sample');assert.ok(calls.some(url=>url.includes('/employer?')));
});
