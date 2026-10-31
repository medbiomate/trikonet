import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./admin.js',import.meta.url),'utf8');
const start=source.indexOf('  let jobSubmissionPending = false;');
const end=source.indexOf("  document.querySelector('#admin-clear')",start);
test('pre-request failure releases submit guard and replaces saving feedback',async()=>{
 let submit;const buttons=[{disabled:false,setAttribute(){},removeAttribute(){}},{disabled:false,setAttribute(){},removeAttribute(){}}];
 const feedback={dataset:{}};const status={textContent:''};let calls=0;
 const context={jobForm:{addEventListener:(name,fn)=>{submit=fn;}},document:{getElementById:id=>id==='publish-job-btn'?buttons[0]:buttons[1]},jobStatusState:status,publishFeedback:feedback,showJobPublishFeedback:(message,type)=>{feedback.dataset.type=type;},showAdminNotice(){},jobRecovery:{preparePublish:async()=>{calls++;throw Error('Preparation failed');},resume(){} }};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);
 await submit({preventDefault(){}});
 assert.equal(status.textContent,'Preparation failed');assert.equal(feedback.dataset.type,'error');assert.ok(buttons.every(b=>!b.disabled));
 await submit({preventDefault(){}});assert.equal(calls,2);
});
