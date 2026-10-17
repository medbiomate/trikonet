import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {injectInitialJob} from './job-ssr.mjs';
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
test('initial page has native navigation and search without a loader video',()=>{
 assert.match(html,/<form action="\/jobs" method="get"/);assert.match(html,/name="q"/);assert.ok(!html.includes('<video'));assert.ok(!html.includes("setAttribute('inert'"));
});
test('slow download keeps shell and does not reload or replace it',()=>{
 let timer,replaced=false;const status={textContent:''};
 const app={hasAttribute:()=>false,querySelector:()=>({}),replaceChildren:()=>{replaced=true;},removeAttribute(){}};
 const source=fs.readFileSync(new URL('./bootstrap.js',import.meta.url),'utf8').replace('export function','function').replace(/import\('\.\/app\.js[^\n]+/,'');
 const ctx=vm.createContext({console:{warn(){}},setTimeout:fn=>{timer=fn;},clearTimeout(){},document:{getElementById:id=>id==='app'?app:id==='initial-loading-status'?status:null,documentElement:{classList:{remove(){}}},createElement:()=>{throw Error('Must retain page');}}});
 vm.runInContext(source,ctx);timer();assert.match(status.textContent,/connection/);ctx.showLoadingRecovery(Error('offline'));assert.equal(replaced,false);
});
test('job SSR replaces the startup shell and keeps job text readable',()=>{
 const output=injectInitialJob(html,{id:1,slug:'nurse',title:{rendered:'Nurse'},description:'A real job description',metas:{}},'/job/nurse');
 assert.match(output,/data-server-rendered="job"/);assert.ok(!output.includes('initial-job-search'));assert.match(output,/A real job description/);
});
