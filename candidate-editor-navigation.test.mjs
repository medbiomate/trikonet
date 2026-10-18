import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const base of ['.']){
 const source=readFileSync(new URL(`${base}/admin.js`,import.meta.url),'utf8');
 const start=source.indexOf("    } else if (hash === 'candidate-editor' || hash.startsWith('candidate-editor/')) {");
 const end=source.indexOf("    } else if (hash === 'candidate-categories')",start);
 const branch=source.slice(source.indexOf('\n',start)+1,end);
 test(`${base}: Edit opens before filling and reloads a missing candidate`,async()=>{
  const events=[];const record={id:'cand-101',name:'Candidate'};
  const context=vm.createContext({hash:'candidate-editor/cand-101',location:{hash:'#candidate-editor/cand-101'},candidates:[],switchView:name=>events.push(name),fillCandidate:record=>events.push(record),showAdminNotice:message=>assert.fail(message),fetch:async()=>({ok:true,json:async()=>[record]})});
  await vm.runInContext(`(async()=>{${branch}})()`,context);
  assert.deepEqual(events,['candidate-edit',record]);
 });
 test(`${base}: errors are displayed instead of silently leaving Edit inactive`,async()=>{
  const errors=[];const context=vm.createContext({hash:'candidate-editor/101',location:{hash:'#candidate-editor/101'},candidates:[{id:101}],switchView(){},fillCandidate(){throw Error('Editor failed');},showAdminNotice:message=>errors.push(message)});
  await vm.runInContext(`(async()=>{${branch}})()`,context);assert.deepEqual(errors,['Editor failed']);
 });
 test(`${base}: selecting Edit navigates without a cached-record dependency`,()=>{
  const start=source.indexOf("    const candEdit = e.target.closest('[data-candidate-edit]');");
  const block=source.slice(start,source.indexOf('\n    const candFeature',start));
  const context=vm.createContext({location:{hash:'#candidates'},e:{target:{closest:()=>({dataset:{candidateEdit:'cand-101'}})},preventDefault(){}},handleRoute(){assert.fail('should navigate first');}});
  vm.runInContext(`(()=>{${block}})()`,context);assert.equal(context.location.hash,'candidate-editor/cand-101');
 });
}
