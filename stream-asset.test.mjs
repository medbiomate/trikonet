import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {streamAsset} from './stream-asset.mjs';

test('streamed binary bytes, HEAD and conditional caching retain their HTTP contracts',async t=>{
  const dir=await mkdtemp(join(tmpdir(),'trikonet-stream-'));
  const path=join(dir,'media.bin'),body=Buffer.alloc(2*1024*1024,147);
  await writeFile(path,body);
  const server=http.createServer((req,res)=>{streamAsset(req,res,path,'image/png',{versioned:true}).catch(()=>res.destroy());});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true});});
  const url=`http://127.0.0.1:${server.address().port}/media.bin`;
  const response=await fetch(url);assert.equal(response.status,200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),body);
  const etag=response.headers.get('etag');assert.match(etag,/^W\//);
  const cached=await fetch(url,{headers:{'If-None-Match':etag}});assert.equal(cached.status,304);assert.equal((await cached.arrayBuffer()).byteLength,0);
  const head=await fetch(url,{method:'HEAD'});assert.equal(Number(head.headers.get('content-length')),body.length);assert.equal((await head.arrayBuffer()).byteLength,0);
  assert.equal(head.headers.get('cache-control'),'public, max-age=86400');
});
