import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('./display-ads.js', import.meta.url), 'utf8');
const helper = source.slice(source.indexOf('function initBlogAds('), source.indexOf('function initJobDetailAd('));
for (const count of [0, 3, 20]) {
  test(`blog with ${count} content blocks receives five placements without duplicates`, () => {
    const positions = [], requests = [];
    const article = { children: Array.from({ length: count }, (_, index) => ({ tagName: 'P', textContent: 'Content '.repeat(20), classList: { contains: () => false }, after: () => positions.push(index) })), before: () => positions.push('top'), after: () => positions.push('bottom'), append: () => positions.push('inside') };
    const context = vm.createContext({ document: { querySelector: () => positions.length ? {} : null, createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) }, initializeAd: (ad, lazy) => requests.push(lazy) });
    vm.runInContext(helper, context);
    context.initBlogAds(article); context.initBlogAds(article);
    assert.equal(positions.length, 5);
    assert.equal(positions[0], 'top');
    assert.equal(positions[4], 'bottom');
    assert.equal(requests.length, 5);
    assert.ok(requests.every(Boolean));
    if (count === 20) assert.deepEqual(positions, ['top', 4, 9, 14, 'bottom']);
  });
}
test('blog ad requests wait until their placement approaches the viewport', () => {
  let enterViewport, measure, resizeCount = 0;
  const queue = [];
  class IntersectionObserver { constructor(callback) { enterViewport = callback; } observe() {} disconnect() {} }
  class ResizeObserver { constructor(callback) { measure = callback; resizeCount++; } observe() {} disconnect() {} }
  const context = vm.createContext({ IntersectionObserver, ResizeObserver, window: { adsbygoogle: queue }, console });
  vm.runInContext(source.slice(source.indexOf('function initializeAd(')), context);
  context.initializeAd({ isConnected: true, getBoundingClientRect: () => ({ width: 320 }) }, true);
  assert.equal(resizeCount, 0);
  enterViewport([{ isIntersecting: false }]);
  assert.equal(resizeCount, 0);
  enterViewport([{ isIntersecting: true }]); measure();
  assert.equal(queue.length, 1);
});
