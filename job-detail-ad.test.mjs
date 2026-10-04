import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { isPrivatePage } from './indexing-policy.js';
const source = readFileSync(new URL('./display-ads.js', import.meta.url), 'utf8');
const helper = source.slice(source.indexOf('function initJobDetailAd()'), source.indexOf('function initAdditionalFeedAd()'));
function harness({ mobile = true, search = '', job = true } = {}) {
  const placements = [], requested = [];
  const ad = {};
  const style = {};
  const main = { querySelector: selector => selector.startsWith('.detail-grid') ? { before: value => placements.push(value) } : placements[0] };
  const context = vm.createContext({
    window: { matchMedia: () => ({ matches: mobile }) },
    location: { pathname: '/job/sample', search }, URLSearchParams, isPrivatePage,
    document: { querySelector: () => job ? main : null, createElement: () => ({ dataset: {}, style, setAttribute() {}, querySelector: () => ad }) },
    initializeAd: value => requested.push(value)
  });
  vm.runInContext(helper, context);
  return { run: () => context.initJobDetailAd(), placements, requested };
}
test('mobile job ad is inserted before overview content and requested only once', () => {
  const h = harness(); h.run(); h.run();
  assert.equal(h.placements.length, 1);
  assert.equal(h.requested.length, 1);
  assert.match(h.placements[0].innerHTML, /data-ad-slot="9017818388"/);
});
for (const [name, options] of [['preview', { search: '?preview=1' }], ['draft', { search: '?draft=1' }], ['other page', { job: false }]]) {
  test(`no job ad on ${name}`, () => {
    const h = harness(options); h.run();
    assert.equal(h.placements.length, 0);
    assert.equal(h.requested.length, 0);
  });
}

test('desktop job pages also receive a responsive display placement', () => {
  const h = harness({ mobile: false }); h.run();
  assert.equal(h.requested.length, 1);
  assert.match(h.placements[0].innerHTML, /data-ad-format="auto"/);
  assert.match(h.placements[0].innerHTML, /min-height:250px/);
});
