import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./config.js', import.meta.url), 'utf8');
function setup(hostname = 'dev.trikonet.com') {
  const calls = [];
  const window = { location: { hostname }, fetch: (url, init) => { calls.push({ url, init }); } };
  vm.runInNewContext(source, { window, AbortSignal, Headers });
  return { window, calls };
}
test('routed résumé requests carry the same sign-in cookie as login', () => {
  const { window, calls } = setup();
  for (const method of ['GET', 'POST', 'DELETE']) {
    window.fetch('/api/resumes', { method, credentials: 'same-origin' });
  }
  assert.ok(calls.every(call => call.url === 'https://api.trikonet.com/api/resumes' && call.init.credentials === 'include'));
});
test('explicit anonymous requests and local requests retain their credential policy', () => {
  const routed = setup();
  routed.window.fetch('/api/jobs', { credentials: 'omit' });
  assert.equal(routed.calls[0].init.credentials, 'omit');
  const local = setup('localhost');
  local.window.fetch('/api/resumes', { credentials: 'same-origin' });
  assert.equal(local.calls[0].url, '/api/resumes');
  assert.equal(local.calls[0].init.credentials, 'same-origin');
});

test('simultaneous public reads share one download with separately consumable bodies', async () => {
 const calls=[];
 const window={location:{hostname:'www.trikonet.com'},fetch:async(url,init)=>{calls.push({url,init});return new Response(JSON.stringify({items:[1,2]}));}};
 vm.runInNewContext(source,{window,AbortSignal,Headers});
 const [first,second]=await Promise.all([window.fetch('/api/wp/taxonomies'),window.fetch('/api/wp/taxonomies')]);
 assert.equal(calls.length,1);
 assert.deepEqual(await first.json(),await second.json());
 assert.ok(calls[0].init.signal);
 await window.fetch('/api/wp/taxonomies');
 assert.equal(calls.length,2);
});
test('writes are neither deduplicated nor assigned a read timeout',async()=>{
 const calls=[];
 const window={location:{hostname:'www.trikonet.com'},fetch:async(url,init)=>{calls.push({url,init});return new Response('{}');}};
 vm.runInNewContext(source,{window,AbortSignal,Headers});
 await Promise.all([window.fetch('/api/wp/posts',{method:'POST'}),window.fetch('/api/wp/posts',{method:'POST'})]);
 assert.equal(calls.length,2);
 assert.ok(calls.every(call=>!call.init.signal));
});
