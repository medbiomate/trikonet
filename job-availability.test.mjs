import test from 'node:test';
import assert from 'node:assert/strict';
import {isClosedJob,explicitDeadline} from './job-availability.js';
import {renderJobDetail,resolveJobDeadline} from './detail-pages.js';
test('only explicit expiration or filled state closes a job',()=>{
 const now=Date.parse('2026-10-19T10:00:00Z');
 assert.equal(isClosedJob({},now),false);assert.equal(explicitDeadline({}), '');
 assert.equal(isClosedJob({deadline:'2026-10-18'},now),true);
 assert.equal(isClosedJob({deadline:'2026-10-19'},now),false);
 assert.equal(isClosedJob({metas:{_filled:'1'}},now),true);
 assert.equal(isClosedJob({deadline:'not a date'},now),false);
 assert.equal(resolveJobDeadline({date:'2020-01-01'}),'');
});
test('expired jobs cannot offer a live apply action',()=>{
 const html=renderJobDetail({slug:'nurse',title:'Nurse',description:'Care',deadline:'2020-01-01',applyUrl:'https://example.com/apply'},null,'/job/nurse');
 assert.match(html,/Applications closed/);assert.doesNotMatch(html,/class="primary apply"/);
});
test('missing application targets are not fake hash links',()=>{
 const html=renderJobDetail({slug:'nurse',title:'Nurse',description:'Care'},null,'/job/nurse');
 assert.match(html,/Application details are unavailable/);assert.doesNotMatch(html,/class="primary apply" href="#"/);
});
