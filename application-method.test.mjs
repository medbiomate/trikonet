import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./admin.js',import.meta.url),'utf8');
const start=source.indexOf('  function updateApplicationMethodUI()');
const end=source.indexOf('\n  }',start)+4;
const functionSource=source.slice(start,end);
for(const method of ['External URL','By Email','WhatsApp','Walk-in','Internal Form'])test(`${method} shows and enables only its own fields`,()=>{
 const ids=['url','email','whatsapp'];const nodes={};
 for(const id of ids){nodes[`job-apply-${id}-wrap`]={style:{}};nodes[`job-apply-${id}`]={};}
 nodes['job-apply-walkin-wrap']={style:{}};nodes['job-walkin-details']={};
 const context=vm.createContext({jobForm:{elements:{applyType:{value:method}}},document:{getElementById:id=>nodes[id]}});
 vm.runInContext(functionSource+';updateApplicationMethodUI()',context);
 const inputs=['job-apply-url','job-apply-email','job-apply-whatsapp','job-walkin-details'];
 const wraps=['job-apply-url-wrap','job-apply-email-wrap','job-apply-whatsapp-wrap','job-apply-walkin-wrap'];
 const selected=['External URL','By Email','WhatsApp','Walk-in'].indexOf(method);
 inputs.forEach((id,i)=>{assert.equal(nodes[id].required,i===selected);assert.equal(nodes[id].disabled,i!==selected);assert.equal(nodes[wraps[i]].hidden,i!==selected);});
});
