import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const loader = html.match(/<script id="adsense-loader">([\s\S]*?)<\/script>/)[1];
const ads = readFileSync(new URL('./display-ads.js', import.meta.url), 'utf8').replace(/^import .*;$/m, '').replace('export function', 'function');
for (const pathname of ['/', '///', '/index.html', '/index.html/']) {
  test(`homepage ${pathname} loads no Google script and creates no manual ads`, () => {
    const context = vm.createContext({ location: { pathname }, document: {} });
    vm.runInContext(loader, context);
    vm.runInContext(ads, context);
    context.initDisplayAds();
  });
}
test('job pages retain the Google loader', () => {
  const scripts = [];
  vm.runInNewContext(loader, { location: { pathname: '/job/sample' }, document: { createElement: () => ({}), head: { append: script => scripts.push(script) } } });
  assert.equal(scripts.length, 1);
  assert.match(scripts[0].src, /adsbygoogle/);
  assert.equal(scripts[0].async, true);
});
