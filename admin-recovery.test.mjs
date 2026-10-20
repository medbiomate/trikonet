import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {saveJobRecord} from '../backend/job-identity.mjs';
import {mergeStateChanges} from '../backend/state-changes.mjs';
const source=readFileSync(new URL('./admin-recovery.js',import.meta.url),'utf8').replace('export function','function');
function tab(storage,send){
 const events={},fields={};
 for(const [name,value] of Object.entries({title:'',description:'',id:'',originalSlug:''}))fields[name]={name,value,type:'text',id:name};
 const view={classList:{contains:()=>true},prepend(){},querySelector(selector){return selector.includes('title')?fields.title:selector.includes('content')?fields.description:null;},querySelectorAll(){return [];},addEventListener(name,fn){events[name]=fn;}};
 const form={elements:fields,closest:()=>view,querySelector:()=>fields.id,append(){}};
 const context=vm.createContext({AbortController,crypto:{randomUUID},document:{hidden:false,createElement:()=>({style:{},append(){}}),addEventListener(){}},window:{addEventListener(){}},setInterval(){},setTimeout:()=>1,clearTimeout(){},localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},FormData:class {constructor(){return Object.entries(fields).map(([key,value])=>[key,value.value]);}},fetch:async(url,options)=>url.includes('autosave')?send(JSON.parse(options.body)):{ok:true,json:async()=>({})}});
 vm.runInContext(source,context);
 const recovery=context.createFormRecovery(form,'job','same-account');
 return {recovery,fields,type(title){fields.title.value=title;fields.description.value=`Content for ${title}`;events.input();}};
}
test('three tabs with one account have independent recovery keys and stable publish IDs',async()=>{
 const storage=new Map([['trikonet-recovery:same-account:job:new',JSON.stringify({draftId:randomUUID(),values:[]})]]);
 const writes=[];
 const tabs=Array.from({length:3},()=>tab(storage,async body=>{writes.push(body);await new Promise(resolve=>setImmediate(resolve));return {ok:true,json:async()=>({id:body.record.id,slug:`autosave-job-${body.record.id}`,status:'draft'})};}));
 tabs.forEach((item,i)=>{item.recovery.open();item.type(`Job ${i+1}`);});
 await Promise.all(tabs.map(item=>item.recovery.flush()));
 assert.equal(new Set(writes.map(body=>body.draftId)).size,3);
 assert.equal(new Set(tabs.map(item=>item.fields.id.value)).size,3);
 assert.equal(storage.size,4);
 const before={jobs:writes.map(body=>({id:body.record.id,slug:`autosave-job-${body.record.id}`,title:body.record.title,status:'draft'}))};
 let current=structuredClone(before);
 const updates=tabs.map((item,i)=>{const next=structuredClone(before);saveJobRecord(next.jobs,{id:item.fields.id.value,originalSlug:item.fields.originalSlug.value,slug:`published-${i+1}`,title:item.fields.title.value,status:'publish'},randomUUID,'today');return next;});
 for(const next of updates)current=mergeStateChanges(current,before,next);
 assert.equal(current.jobs.length,3);
 for(let i=0;i<3;i++){const job=current.jobs.find(job=>job.id===tabs[i].fields.id.value);assert.equal(job.status,'publish');assert.equal(job.title,`Job ${i+1}`);}
 tabs[0].recovery.clear();assert.equal(storage.size,3);
});
test('autosave pauses during publishing and resumes on failure',async()=>{
 let requests=0;const item=tab(new Map(),async body=>{requests++;return {ok:true,json:async()=>({id:body.record.id,slug:'job',status:'draft'})};});
 item.recovery.open();item.type('Job');await item.recovery.flush();assert.equal(requests,1);
 item.recovery.pause();item.type('Updated');await item.recovery.flush();assert.equal(requests,1);
 item.recovery.resume();await item.recovery.flush();assert.equal(requests,2);
 item.recovery.clear();await item.recovery.flush();assert.equal(requests,2);
});
test('late autosave response cannot assign its ID to another open editor',async()=>{
 let release;const item=tab(new Map(),body=>new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>({id:body.record.id,slug:'old-draft',status:'draft'})});}));
 item.recovery.open();item.type('First');const pending=item.recovery.flush();
 item.recovery.open('different-job','different-id');release();await pending;
 assert.equal(item.fields.id.value,'different-id');assert.equal(item.fields.originalSlug.value,'');
});
test('publishing proceeds while an autosave has not answered',async()=>{
 let release;const item=tab(new Map(),body=>new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>({id:body.record.id,slug:'late',status:'draft'})});}));
 item.recovery.open();item.type('Ready');const pending=item.recovery.flush();
 await item.recovery.preparePublish();
 release();await pending;
 assert.equal(item.fields.originalSlug.value,'');
});
test('opening a fresh editor during autosave assigns a separate stable identity',async()=>{
 let release;const item=tab(new Map(),body=>new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>({id:body.record.id,slug:'old',status:'draft'})});}));
 item.recovery.open();item.type('Old');const first=item.fields.id.value;const pending=item.recovery.flush();
 item.recovery.open();assert.notEqual(item.fields.id.value,first);
 release();await pending;assert.equal(item.fields.originalSlug.value,'');
});
