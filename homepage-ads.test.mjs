import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const loader = html.match(/<script id="adsense-loader">([\s\S]*?)<\/script>/)[1];
const ads = readFileSync(new URL('./display-ads.js', import.meta.url), 'utf8').replace(/^import .*;$/m, '').replace('export function', 'function');
for (const pathname of ['/', '///', '/index.html', '/index.html/']) {
  test(`homepage ${pathname} loads no Google script and creates no manual ads`, () => {
    const context = vm.createContext({ location: { pathname }, window:{addEventListener:(_event,ready)=>ready()}, document: {} });
    vm.runInContext(loader, context);
    vm.runInContext(ads, context);
    context.initDisplayAds();
  });
}
test('job pages retain the Google loader', () => {
  const scripts = [];
  let ready;
  vm.runInNewContext(loader, { window:{addEventListener:(_event,callback)=>{ready=callback;}}, location: { pathname: '/job/sample' }, document: { createElement: () => ({}), head: { append: script => scripts.push(script) } } });
  assert.equal(scripts.length, 0, 'ads do not compete with page startup');
  ready();
  assert.equal(scripts.length, 1);
  assert.match(scripts[0].src, /adsbygoogle/);
  assert.equal(scripts[0].async, true);
});
test('production ad script starts with the early navigation core without waiting for bootstrap',()=>{
 const scripts=[];
 vm.runInNewContext(loader,{window:{TrikonetJobNavigation:{}},location:{pathname:'/job/sample',hostname:'www.trikonet.com'},document:{createElement:()=>({}),head:{append:script=>scripts.push(script)}}});
 assert.equal(scripts.length,1);
});
for(const hostname of ['api.trikonet.com','localhost','127.0.0.1'])test(`production ad requests are excluded on ${hostname}`,()=>{
 const context=vm.createContext({window:{TrikonetJobNavigation:{}},location:{pathname:'/job/sample',hostname},document:{createElement:()=>{throw Error('No ads outside public website')}}});
 vm.runInContext(loader,context);vm.runInContext(ads,context);context.initDisplayAds();
});

for(const pathname of ['/admin','/admin-login','/profile','/login','/saved-jobs'])test(`private route does not load ads: ${pathname}`,()=>{
 vm.runInNewContext(loader,{window:{TrikonetJobNavigation:{}},location:{pathname,hostname:'www.trikonet.com'},document:{createElement:()=>{throw Error('Private pages must not request ads')}}});
});
