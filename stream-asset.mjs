import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {pipeline} from 'node:stream/promises';

// Binary assets need neither HTML injection nor compression. Stream them with
// backpressure instead of holding one whole-file buffer for every visitor.
export async function streamAsset(req,res,path,contentType,{immutable=false,versioned=false}={}) {
  const info=await stat(path);
  if(!info.isFile())throw Error('Asset is not a file');
  const etag=`W/"${info.size}-${info.mtimeMs}"`;
  const headers={'Content-Type':contentType,'Content-Length':info.size,'ETag':etag,
    'Cache-Control':immutable?'public, max-age=31536000, immutable':versioned?'public, max-age=86400':'public, max-age=0, must-revalidate',
    'X-Content-Type-Options':'nosniff'};
  if(String(req.headers['if-none-match']||'').split(',').some(tag=>tag.trim().replace(/^W\//,'')===etag.slice(2)||tag.trim()==='*')) {
    delete headers['Content-Length'];res.writeHead(304,headers);return res.end();
  }
  res.writeHead(200,headers);
  if(req.method==='HEAD')return res.end();
  await pipeline(createReadStream(path),res);
}
