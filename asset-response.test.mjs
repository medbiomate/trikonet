import test from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync, brotliDecompressSync } from 'node:zlib';
import { sendAsset } from './asset-response.mjs';
const body = 'const message = "hello world";\n'.repeat(1000);
async function response(headers = {}, options = {}, method = 'GET', contentType = 'text/javascript') {
  const res = { writeHead(status, headers) { this.status = status; this.headers = headers; }, end(bytes) { this.body = bytes; } };
  await sendAsset({ headers, method }, res, body, contentType, options);
  return res;
}
test('compressed assets round trip and respect encoding quality', async () => {
  for (const [accept, encoding, decode] of [['br, gzip','br',brotliDecompressSync],['br;q=0, gzip','gzip',gunzipSync]]) {
    const res = await response({'accept-encoding':accept}, {versioned:true});
    assert.equal(res.headers['Content-Encoding'],encoding);
    assert.equal(decode(res.body).toString(),body);
    assert.ok(res.body.length < Buffer.byteLength(body) / 5);
    assert.equal(res.headers['Cache-Control'],'public, max-age=86400');
  }
});
test('ETags revalidate the selected representation and HEAD omits body', async () => {
  const first = await response({'accept-encoding':'gzip'});
  const repeat = await response({'accept-encoding':'gzip','if-none-match':first.headers.ETag});
  assert.equal(repeat.status,304);
  assert.equal(repeat.body,undefined);
  const identity = await response({'if-none-match':first.headers.ETag});
  assert.equal(identity.status,200);
  const head = await response({'accept-encoding':'br'},{},'HEAD');
  assert.equal(head.body,undefined);
  assert.ok(head.headers['Content-Length'] > 0);
});
test('HTML revalidates and already compressed images are not recompressed', async () => {
  const html = await response({'accept-encoding':'br'},{html:true});
  assert.equal(html.headers['Cache-Control'],'no-cache');
  const image = await response({'accept-encoding':'br'},{},'GET','image/webp');
  assert.equal(image.headers['Content-Encoding'],undefined);
});
