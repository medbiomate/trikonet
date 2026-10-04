import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { isPrivatePage } from './indexing-policy.js';
const source = readFileSync(new URL('./display-ads.js', import.meta.url), 'utf8');
const helper = source.slice(source.indexOf('function initJobDetailAd()'), source.indexOf('function initAdditionalFeedAd()'));
function harness({ mobile = true, search = '', job = true } = {}) {
  const placements = [], requested = [], locations = [];
  const ad = {};
  const style = {};
  const main = { querySelector: selector => selector.startsWith('.detail-grid') ? { before: value => { placements.push(value); locations.push('above-grid'); } } : selector === '.job-description .job-desc-heading' ? { after: value => { placements.push(value); locations.push('below-heading'); } } : placements[0] };
  const context = vm.createContext({
    window: { matchMedia: () => ({ matches: mobile }) },
    location: { pathname: '/job/sample', search }, URLSearchParams, isPrivatePage,
    document: { querySelector: () => job ? main : null, createElement: () => ({ dataset: {}, style, setAttribute() {}, querySelector: () => ad }) },
    initializeAd: value => requested.push(value)
  });
  vm.runInContext(helper, context);
  return { run: () => context.initJobDetailAd(), placements, requested, locations };
}
test('mobile job ad is inserted before overview content and requested only once', () => {
  const h = harness(); h.run(); h.run();
  assert.equal(h.placements.length, 1);
  assert.equal(h.requested.length, 1);
  assert.deepEqual(h.locations, ['above-grid']);
  assert.match(h.placements[0].innerHTML, /data-ad-slot="9017818388"/);
});
for (const [name, options] of [['preview', { search: '?preview=1' }], ['draft', { search: '?draft=1' }], ['other page', { job: false }]]) {
  test(`no job ad on ${name}`, () => {
    const h = harness(options); h.run();
    assert.equal(h.placements.length, 0);
    assert.equal(h.requested.length, 0);
  });
}

test('desktop ad sits below Job Description without moving the sidebar', () => {
  const h = harness({ mobile: false }); h.run();
  assert.equal(h.requested.length, 1);
  assert.deepEqual(h.locations, ['below-heading']);
  assert.equal(h.placements[0].style.cssText.includes('width:100%'), true);
  assert.match(h.placements[0].innerHTML, /data-ad-format="auto"/);
  assert.match(h.placements[0].innerHTML, /min-height:250px/);
});

const additionalHelper = source.slice(source.indexOf('function initAdditionalFeedAd()'), source.indexOf('function initializeAd('));
for (const hasCompany of [true, false]) {
  test(hasCompany ? 'second job ad sits before the company card' : 'pages without a company card retain their bottom ad', () => {
    const inserted = [], appended = [], requested = [];
    const main = { querySelector: () => hasCompany ? { before: value => inserted.push(value) } : null, append: value => appended.push(value) };
    const context = vm.createContext({
      location: { pathname: '/job/sample', search: '' }, URLSearchParams, isPrivatePage,
      document: { title: 'Sample job', querySelector: selector => selector === '#app main' ? main : null,
        createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) },
      initializeAd: value => requested.push(value)
    });
    vm.runInContext(additionalHelper, context);
    context.initAdditionalFeedAd();
    assert.equal(inserted.length, hasCompany ? 1 : 0);
    assert.equal(appended.length, hasCompany ? 0 : 1);
    assert.equal(requested.length, 1);
    if (hasCompany) assert.equal(inserted[0].style.width, '100%');
  });
}

const employerHelper = source.slice(source.indexOf('function initEmployerJobsAds()'), source.indexOf('function initializeAd('));
for (const [count, expected] of [[5, []], [6, [4]], [12, [4, 9]]]) {
  test(`company list with ${count} jobs places ads between cards`, () => {
    const indices = [], ads = [];
    const list = { querySelector: () => ads[0], children: Array.from({ length: count }, (_, index) => ({ after: ad => { indices.push(index); ads.push(ad); } })) };
    const context = vm.createContext({
      document: { querySelector: () => list, createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) },
      initializeAd() {}
    });
    vm.runInContext(employerHelper, context);
    context.initEmployerJobsAds();
    context.initEmployerJobsAds();
    assert.deepEqual(indices, expected);
  });
}
test('company page ad is positioned above its tabs', () => {
  let inserted = 0;
  const main = { querySelector: selector => selector === '.emp-profile-tabs-strip' ? { before: () => inserted++ } : null, append: () => assert.fail('ad should be above tabs') };
  const context = vm.createContext({
    location: { pathname: '/employer/sample', search: '' }, URLSearchParams, isPrivatePage,
    document: { title: 'Company', querySelector: selector => selector === '#app main' ? main : null, createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) },
    initializeAd() {}
  });
  vm.runInContext(additionalHelper, context);
  context.initAdditionalFeedAd();
  assert.equal(inserted, 1);
});

for (const desktop of [true, false]) {
  test(desktop ? 'desktop company ad appears below About' : 'mobile company ad remains above tabs', () => {
    const positions = [];
    const main = { querySelector: selector => selector === '.emp-profile-tabs-strip' ? { before: () => positions.push('above-tabs') } : selector === '.emp-about-block' ? { after: () => positions.push('below-about') } : null };
    const context = vm.createContext({
      window: { matchMedia: () => ({ matches: desktop }) },
      location: { pathname: '/employer/sample', search: '' }, URLSearchParams, isPrivatePage,
      document: { title: 'Company', querySelector: selector => selector === '#app main' ? main : null, createElement: () => ({ dataset: {}, style: {}, setAttribute() {}, querySelector: () => ({}) }) }, initializeAd() {}
    });
    vm.runInContext(additionalHelper, context); context.initAdditionalFeedAd();
    assert.deepEqual(positions, [desktop ? 'below-about' : 'above-tabs']);
  });
}
