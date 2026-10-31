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
test('job typing never saves recovery drafts or sends autosave requests',async()=>{
 const storage=new Map();let requests=0;
 const item=tab(storage,async()=>{requests++;throw Error('Autosave must be disabled');});
 item.recovery.open('existing-job','existing-id');item.type('Updated job');
 await item.recovery.flush();item.recovery.resume();await item.recovery.flush();
 assert.equal(requests,0);assert.equal(storage.size,0);
 assert.equal(item.fields.id.value,'existing-id');assert.equal(item.fields.originalSlug.value,'');
 await item.recovery.preparePublish();item.recovery.saved({id:'existing-id',slug:'existing-job'});
 assert.equal(item.fields.id.value,'existing-id');
});
test('manual new jobs have distinct stable IDs without automatic persistence',async()=>{
 const storage=new Map();const tabs=Array.from({length:3},()=>tab(storage,()=>assert.fail('No autosave')));
 for(const item of tabs){item.recovery.open();item.type('Job');await item.recovery.flush();}
 assert.equal(new Set(tabs.map(item=>item.fields.id.value)).size,3);
 assert.ok(tabs.every(item=>item.fields.id.value));assert.equal(storage.size,0);
});
