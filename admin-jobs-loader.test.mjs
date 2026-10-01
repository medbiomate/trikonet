import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAdminJobs } from './admin-jobs-loader.js';
const pageRows = (page, count = 2) => Array.from({ length: count }, (_, i) => ({ id: (page - 1) * 2 + i + 1 }));

test('shows first page immediately and returns every page in order', async () => {
  const progress = [];
  let active = 0, maxActive = 0;
  const jobs = await loadAdminJobs({ batchSize: 2, concurrency: 2, fetchCount: async () => 7,
    fetchPage: async page => { active++; maxActive = Math.max(maxActive, active); await new Promise(resolve => setTimeout(resolve, page === 2 ? 10 : 1)); active--; return pageRows(page, page === 4 ? 1 : 2); },
    onProgress: jobs => progress.push(jobs.map(j => j.id)) });
  assert.deepEqual(progress[0], [1, 2]);
  assert.deepEqual(jobs.map(j => j.id), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(maxActive, 2);
});

test('retries transient errors without losing successfully loaded jobs', async () => {
  const attempts = new Map();
  const jobs = await loadAdminJobs({ batchSize: 2, fetchCount: async () => 5, fetchPage: async page => {
    attempts.set(page, (attempts.get(page) || 0) + 1);
    if (page === 2 && attempts.get(page) < 3) throw new Error('Temporary failure');
    return pageRows(page, page === 3 ? 1 : 2);
  } });
  assert.equal(attempts.get(2), 3);
  assert.equal(jobs.length, 5);
});

test('retains available jobs and reports a permanently failed page', async () => {
  const errors = [];
  const jobs = await loadAdminJobs({ batchSize: 2, fetchCount: async () => 5, fetchPage: async page => {
    if (page === 2) throw new Error('Network failure');
    return pageRows(page, page === 3 ? 1 : 2);
  }, onError: error => errors.push(error.message) });
  assert.deepEqual(jobs.map(j => j.id), [1, 2, 5]);
  assert.deepEqual(errors, ['Network failure']);
});

test('supports hosts without a count endpoint', async () => {
  const jobs = await loadAdminJobs({ batchSize: 2, fetchCount: async () => { throw new Error('Missing count'); }, fetchPage: async page => pageRows(page, page === 3 ? 1 : 2) });
  assert.equal(jobs.length, 5);
});

test('reports first page failure instead of silently claiming zero results', async () => {
  let error;
  const jobs = await loadAdminJobs({ fetchPage: async () => { throw new Error('Offline'); }, onError: e => { error = e; } });
  assert.equal(jobs.length, 0);
  assert.equal(error.message, 'Offline');
});
