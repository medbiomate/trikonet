import test from 'node:test';
import assert from 'node:assert/strict';
import {isPrivatePage,isPublishedRecord} from './indexing-policy.js';
test('admin and private member routes are noindex',()=>{for(const p of ['/admin','/admin-login','/admin/jobs','/trikonet-admin-access','/profile','/saved-jobs','/submit-job'])assert.equal(isPrivatePage(p),true);});
test('public listing routes stay indexable, previews do not',()=>{for(const p of ['/jobs','/job/nurse','/employer/nmc','/about'])assert.equal(isPrivatePage(p),false);assert.equal(isPrivatePage('/job/nurse',new URLSearchParams('preview=1')),true);});
test('drafts and autosaves never qualify as public records',()=>{for(const status of ['draft','pending','expired'])assert.equal(isPublishedRecord({status}),false);assert.equal(isPublishedRecord({status:'publish',autosaved:true}),false);assert.equal(isPublishedRecord({status:'publish'}),true);});
