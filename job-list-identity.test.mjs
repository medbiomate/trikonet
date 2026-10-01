import test from 'node:test';
import assert from 'node:assert/strict';
import {uniqueJobs} from './job-list-identity.js';
test('same job URL renders once and uses latest changes',()=>{
 const old={slug:'junior-accountant',title:'Junior Accountant',updatedAt:'2026-10-01T08:00:00Z'};
 const latest={...old,location:'UAE',updatedAt:'2026-10-01T09:00:00Z'};
 assert.deepEqual(uniqueJobs([latest,old,latest]),[latest]);
});
test('same title with different URLs remains separate',()=>{
 const jobs=[{slug:'accountant-1',title:'Accountant'},{slug:'accountant-2',title:'Accountant'}];
 assert.deepEqual(uniqueJobs(jobs),jobs);
});
