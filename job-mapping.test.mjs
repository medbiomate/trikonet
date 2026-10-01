import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source = readFileSync(new URL('./app.js',import.meta.url),'utf8');
const mapping = source.slice(source.indexOf('function mapJob(record)'),source.indexOf('async function loadLocalJobs()'));
const mapJob = runInNewContext(`${mapping}; mapJob`, {
  resolveJobDate:record=>record.date, resolveJobDeadline:record=>record.deadline,
  fieldValues:()=>'', formatCompanyName:value=>value, decodeHtml:value=>value
});
test('local job cards retain the full formatted description and detail fields',()=>{
  const description='<p>Responsibilities</p><ol><li>First duty</li><li>Second duty</li></ol>';
  const job=mapJob({title:'Nursing Coordinator',company:'NMC',slug:'medical-transcriptionist-13',local:true,description,applyUrl:'https://example.com/apply',status:'publish'});
  assert.equal(job.description,description);
  assert.equal(job.applyUrl,'https://example.com/apply');
  assert.equal(job.status,'publish');
  assert.equal(job.local,true);
});
test('imported content remains available in both content and description',()=>{
  const html='<p>Full imported job description.</p>';
  const job=mapJob({title:{rendered:'Teacher'},content:{rendered:html},metas:{}});
  assert.equal(job.description,html);
  assert.equal(job.content.rendered,html);
  assert.equal(job.title,'Teacher');
});
