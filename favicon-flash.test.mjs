import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const source=html.match(/<script>\s*(\(function\(\)\{\s*const path=location.pathname[\s\S]*?\}\)\(\);)\s*<\/script>/)[1];
function setup(path){const timers=new Map(),events={},added=[];let removed=0;const c={location:{pathname:path},clearTimeout:delay=>timers.delete(delay),setTimeout:(fn,delay)=>{timers.set(delay,fn);return delay;},window:{addEventListener:(name,fn)=>events[name]=fn},document:{body:{append:node=>added.push(node)},createElement:()=>({setAttribute(){},append(){},remove(){removed++;}})}};vm.runInNewContext(source,c);return{timers,events,added,get removed(){return removed}};}
for(const path of ['/','/jobs','/employers','/category/nurse-jobs'])test(`only slow directory pages display favicon ${path}`,()=>{const f=setup(path);assert.equal(f.added.length,0);f.timers.get(600)();assert.equal(f.added.length,1);f.events['trikonet:ready']();assert.equal(f.removed,1);});
for(const path of ['/jobs/nurse','/job/nurse','/employer/dr-scent','/login','/about'])test(`no loader on ${path}`,()=>assert.equal(setup(path).timers.size,0));
test('fast pages and failures never leave a loader',()=>{const f=setup('/jobs');f.events['trikonet:ready']();assert.equal(f.timers.size,0);assert.equal(f.added.length,0);const failed=setup('/');failed.timers.get(600)();failed.events['trikonet:failed']();assert.equal(failed.removed,1);});
test('hard deadline removes favicon without a ready event',()=>{const f=setup('/jobs');f.timers.get(600)();f.timers.get(8000)();assert.equal(f.removed,1);});
