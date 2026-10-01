import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('./admin.js', import.meta.url), 'utf8');
const start = source.indexOf('  async function loadRemoteJobs()');
const loader = source.slice(start, source.indexOf('  // Load all data', start));
function harness(fetch) {
  const values = { '#admin-search': 'clinic', '#filter-by-type': 'Full Time', '#filter-by-category': 'Healthcare' };
  const context = vm.createContext({ fetch, URLSearchParams, AbortController, Set, console,
    currentPage: 3, pageSize: 20, currentStatus: 'publish', jobsRequest: 0, jobsController: null,
    jobsLoading: true, jobsLoadError: false, remoteJobs: [], pageJobs: [], jobTotal: 0,
    renderJobRows() {}, wordpressJob: job => job,
    document: { querySelector: selector => ({ value: values[selector] }) }
  });
  vm.runInContext(loader, context);
  return { context, load: () => vm.runInContext('loadRemoteJobs()', context) };
}
test('requests exactly the selected page with server-side filters', async () => {
  const calls = [];
  const h = harness(async url => { calls.push(url); return { ok: true, json: async () => ({ jobs: [{ slug: 'job-41' }], page: 3, total: 13846 }) }; });
  await h.load();
  assert.equal(calls.length, 1);
  const params = new URL(calls[0], 'http://localhost').searchParams;
  assert.equal(params.get('per_page'), '20');
  assert.equal(params.get('page'), '3');
  assert.equal(params.get('q'), 'clinic');
  assert.equal(params.get('status'), 'publish');
  assert.equal(h.context.jobTotal, 13846);
  assert.equal(h.context.pageJobs[0].slug, 'job-41');
});
test('a superseded page request cannot overwrite the newest page', async () => {
  const pending = [];
  const h = harness((url, options) => new Promise(resolve => pending.push({ url, signal: options.signal, resolve })));
  const old = h.load();
  h.context.currentPage = 4;
  const latest = h.load();
  assert.equal(pending[0].signal.aborted, true);
  pending[1].resolve({ ok: true, json: async () => ({ jobs: [{ slug: 'page-4' }], page: 4, total: 100 }) });
  await latest;
  pending[0].resolve({ ok: true, json: async () => ({ jobs: [{ slug: 'old-page-3' }], page: 3, total: 100 }) });
  await old;
  assert.equal(h.context.currentPage, 4);
  assert.equal(h.context.pageJobs[0].slug, 'page-4');
});
