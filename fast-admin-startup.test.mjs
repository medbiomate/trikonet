import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const source=html.match(/<script>\s*(if\(location.pathname==='\/admin'[\s\S]*?)<\/script>/)[1];
function run(pathname,hash){const requests=[],preloads=[];const window={};vm.runInNewContext(source,{window,location:{pathname,hash,hostname:'trikonet.com'},document:{createElement:()=>({}),head:{append:el=>preloads.push(el)}},fetch:(url,options)=>{requests.push({url,options});return Promise.resolve({ok:true});},AbortSignal});return{requests,preloads,window};}
test('default admin starts cookie-protected list and session requests before modules finish',()=>{const h=run('/admin','#jobs');assert.equal(h.requests.length,2);for(const r of h.requests){assert.equal(r.options.credentials,'include');assert.equal(r.options.cache,'no-store');}assert.match(h.requests[1].url,/period=today/);assert.match(h.preloads[0].href,/admin.js/);});
test('editor skips list download and public pages start neither private request',()=>{assert.equal(run('/admin','#job-new').requests.length,1);assert.equal(run('/jobs','').requests.length,0);});
test('admin routes skip advertising startup',()=>{assert.match(html,/if\(location.pathname.startsWith\('\/admin'\)\)return;/);});
