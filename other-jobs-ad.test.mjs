import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('./display-ads.js', import.meta.url), 'utf8');
const helper = source.slice(source.indexOf('function initOtherJobsAd()'), source.indexOf('function initEmployerJobsAds()'));
for (const present of [true, false]) {
  test(present ? 'ad is inserted once above Other Jobs with deferred loading' : 'missing Other Jobs section creates no empty ad', () => {
    const placements = [], requests = [];
    const section = { before: value => placements.push(value) };
    const context = vm.createContext({ document: { querySelector: selector => selector.startsWith('.detail-exact') ? present ? section : null : placements[0], createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) }, initializeAd: (ad, lazy) => requests.push(lazy) });
    vm.runInContext(helper, context);
    context.initOtherJobsAd(); context.initOtherJobsAd();
    assert.equal(placements.length, present ? 1 : 0);
    assert.equal(requests.length, present ? 1 : 0);
    if (present) { assert.equal(requests[0], true); assert.match(placements[0].style.cssText, /order:1/); }
  });
}

const bottomHelper = source.slice(source.indexOf('function initJobBottomAd()'), source.indexOf('function initEmployerJobsAds()'));
for (const present of [true, false]) {
  test(present ? 'bottom ad is appended once to the end of job content' : 'bottom job ad is absent on other pages', () => {
    const placements = [], requests = [];
    const main = { querySelector: () => placements[0], append: value => placements.push(value) };
    const context = vm.createContext({ document: { querySelector: () => present ? main : null, createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) }, initializeAd: (ad, lazy) => requests.push(lazy) });
    vm.runInContext(bottomHelper, context);
    context.initJobBottomAd(); context.initJobBottomAd();
    assert.equal(placements.length, present ? 1 : 0);
    assert.equal(requests.length, present ? 1 : 0);
    if (present) assert.equal(requests[0], true);
  });
}
