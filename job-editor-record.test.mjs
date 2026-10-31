import test from 'node:test';
import assert from 'node:assert/strict';
import {jobEditorRecord} from './job-editor-record.js';
const map=r=>({title:r.title?.rendered||'',description:r.content?.rendered||'',company:r.metas?._job_employer_name||'',categories:['Imported category']});
test('locally saved WordPress record opens with actual title and description',()=>{
 const result=jobEditorRecord({local:true,id:12,slug:'nurse',title:{rendered:'Registered Nurse'},content:{rendered:'<p>Care</p>'},metas:{_job_employer_name:'DOCIB'}},map);
 assert.equal(result.title,'Registered Nurse');assert.equal(result.description,'<p>Care</p>');assert.equal(result.company,'DOCIB');assert.equal(result.id,12);
});
test('plain editor values and saved company selection override imported metadata',()=>{
 const result=jobEditorRecord({title:'Edited Nurse',description:'<p>New</p>',company:'New Clinic',categories:['Nursing'],metas:{_job_employer_name:'Old Clinic'}},map);
 assert.equal(result.title,'Edited Nurse');assert.equal(result.description,'<p>New</p>');assert.equal(result.company,'New Clinic');assert.deepEqual(result.categories,['Nursing']);
});
test('unexpected title objects cannot turn into object Object',()=>{
 assert.equal(jobEditorRecord({title:{unexpected:'title'}},map).title,'');
 assert.equal(jobEditorRecord({title:{raw:'Raw title'},description:{rendered:'Body'}},map).title,'Raw title');
});
