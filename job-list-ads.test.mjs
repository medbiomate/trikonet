import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('./display-ads.js', import.meta.url), 'utf8');
const helper = source.slice(source.indexOf('function initJobListingAds('), source.indexOf('function initBlogAds('));
for (const [count, expected] of [[0, []], [1, ['top', 0, 'bottom']], [10, [3, 6, 'bottom']], [30, [9, 19, 'bottom']]]) {
  test(`${count} jobs get spaced ad spots with no duplicates`, () => {
    const positions = [], requests = [];
    const feed = { children: Array.from({ length: count }, (_, index) => ({ after: () => positions.push(index) })), before: () => positions.push('top'), after: () => positions.push('bottom') };
    const jobs = { querySelector: selector => selector.startsWith('[data-') ? positions.length ? {} : null : feed };
    const context = vm.createContext({ document: { createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) }, initializeAd: (ad, lazy) => requests.push(lazy) });
    vm.runInContext(helper, context);
    context.initJobListingAds(jobs); context.initJobListingAds(jobs);
    assert.deepEqual(positions, expected);
    assert.equal(requests.length, count ? 3 : 0);
    assert.ok(requests.every(Boolean));
  });
}
