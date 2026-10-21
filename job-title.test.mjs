import test from 'node:test';
import assert from 'node:assert/strict';
import {formatJobTitle} from './company-name.js';
test('job titles normalize casing while retaining professional abbreviations',()=>{
  assert.equal(formatJobTitle('MEDICAL INSURANCE APPROVAL EXECUTIVE'),'Medical Insurance Approval Executive');
  assert.equal(formatJobTitle('recruitment specialist cum hr'),'Recruitment Specialist Cum HR');
  assert.equal(formatJobTitle('senior qa/qc engineer - hvac'),'Senior QA/QC Engineer - HVAC');
  assert.equal(formatJobTitle('devops and IT specialist'),'DevOps And IT Specialist');
});
