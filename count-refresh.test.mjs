import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

for (const file of ['./app.js', '../public/app.js']) {
  test(`${file}: counts share pending work, throttle focus, and skip hidden tabs`, async () => {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    const start = source.indexOf('let baseCountsFetched = false');
    const end = source.indexOf('export function detectBlogCategory', start);
    let now = 0, calls = 0, release, interval, focus;
    const context = vm.createContext({
      Date: { now: () => now }, Promise, URLSearchParams,
      path: '/', data: { counts: {} }, updateLiveJobCountUI() {},
      document: { visibilityState: 'visible' },
      window: { addEventListener: (_event, handler) => { focus = handler; } },
      setInterval: (handler, delay) => { interval = handler; assert.equal(delay, 60000); },
      fetch: () => { calls++; return new Promise(resolve => { release = () => resolve({ ok: true, json: async () => ({job_listing: 1}) }); }); }
    });
    vm.runInContext(source.slice(start, end), context);
    const first = context.loadCounts();
    assert.equal(context.loadCounts(), first);
    assert.equal(calls, 1);
    release(); await first;
    focus(); assert.equal(calls, 1);
    // Force a repeat base fetch so the timer's visibility guard is observable.
    vm.runInContext('baseCountsFetched = false', context);
    now = 60000;
    context.document.visibilityState = 'hidden'; interval();
    assert.equal(calls, 1);
    context.document.visibilityState = 'visible'; interval();
    assert.equal(calls, 2);
    release(); await context.loadCounts();
  });
}
