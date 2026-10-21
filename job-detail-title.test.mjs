import test from 'node:test';
import assert from 'node:assert/strict';
import {renderJobDetail} from './detail-pages.js';
import {renderInitialJob} from './job-ssr.mjs';
const job={slug:'medical-insurance-approval-executive',title:'MEDICAL INSURANCE APPROVAL EXECUTIVE',company:'Unicare Medical Centre',description:'Role details',status:'publish',metas:{}};
for(const [name,render] of [['browser',r=>renderJobDetail(r,null,'/job/'+r.slug)],['initial HTML',r=>renderInitialJob(r,'/job/'+r.slug)]]){
 test(`${name} renders title case for local and imported jobs`,()=>{
  for(const title of [job.title,{rendered:job.title}]){
   const html=render({...job,title});
   assert.match(html,/<h1>Medical Insurance Approval Executive<\/h1>/);
   assert.doesNotMatch(html,/<h1>MEDICAL INSURANCE/);
  }
 });
}
