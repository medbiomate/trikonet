import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('./app.js', import.meta.url), 'utf8');
const loaders = source.slice(source.indexOf('async function loadAccount()'), source.indexOf('const fieldValues='));
function harness(path, responses) {
  const calls = [];
  const context = vm.createContext({
    path, wpRecord: null, wpEmployer: null, currentUser: null, emailCampaigns: [],
    orgJobs: [], categoryJobs: [], profileJobs: [], URL, URLSearchParams,
    fetch: async url => {
      calls.push(url);
      const payload = responses[url];
      return { ok: payload !== undefined, json: async () => payload };
    }
  });
  vm.runInContext(loaders, context);
  return { context, calls };
}
test('public signed-in visitors do not wait for campaign data', async () => {
  const h = harness('/jobs', { '/api/auth/me': { user: { id: 1 } } });
  await h.context.loadAccount();
  assert.deepEqual(h.calls, ['/api/auth/me']);
  assert.equal(h.context.currentUser.id, 1);
});
test('admin pages retain campaign loading', async () => {
  const h = harness('/admin', { '/api/auth/me': { user: { id: 1 } }, '/api/email-campaigns': [{ id: 2 }] });
  await h.context.loadAccount();
  assert.equal(h.context.emailCampaigns[0].id, 2);
});
test('a saved job remains authoritative without fetching its imported original', async () => {
  const record = { slug: 'sample', title: 'Edited title', status: 'publish' };
  const h = harness('/job/sample', { '/api/local/jobs/sample': record });
  await h.context.loadWordPressRecord();
  assert.equal(h.context.wpRecord.title, 'Edited title');
  assert.deepEqual(h.calls, ['/api/local/jobs/sample']);
});
test('imported jobs still load when no saved override exists', async () => {
  const h = harness('/job/sample', { '/api/wp/job_listing?slug=sample': [{ slug: 'sample', title: 'Imported title' }] });
  await h.context.loadWordPressRecord();
  assert.equal(h.context.wpRecord.title, 'Imported title');
  assert.deepEqual(h.calls, ['/api/local/jobs/sample', '/api/wp/job_listing?slug=sample']);
});
test('a missing job does not repeat the same saved-record request', async () => {
  const h = harness('/job/missing', { '/api/wp/job_listing?slug=missing': [] });
  await h.context.loadWordPressRecord();
  assert.equal(h.context.wpRecord, null);
  assert.equal(h.calls.length, 2);
});
