import test from 'node:test';
import assert from 'node:assert/strict';
import {jobWorkCredit} from './job-work-credit.js';
test('shows Sajna editing credit and preserves Hasna creation history',()=>{
 const j={createdBy:{id:'h',name:'Hasna'},createdAt:'2026-10-02T09:06:38Z',updatedBy:{id:'s',name:'Sajna',at:'2026-10-22T04:25:08Z'}};
 assert.deepEqual(jobWorkCredit(j),{primary:'Edited by: Sajna',original:'Originally created by: Hasna'});
 assert.equal(jobWorkCredit({...j,updatedBy:null}).primary,'Created by: Hasna');
 assert.equal(jobWorkCredit({...j,updatedBy:{...j.updatedBy,at:'invalid'}}).primary,'Created by: Hasna');
 assert.equal(jobWorkCredit({}).primary,'Creator not recorded');
});
