import { createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { brotliCompress, gzip, constants } from 'node:zlib';
const brotli = promisify(brotliCompress), gzipAsync = promisify(gzip);
const variants = new Map();
let cachedBytes = 0;
const MAX_CACHE_BYTES = 16 * 1024 * 1024;

export async function sendAsset(req, res, body, contentType, { html = false, versioned = false } = {}) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const digest = createHash('sha256').update(bytes).digest('base64url');
  const compressible = /^(text\/|application\/(javascript|json|xml))/.test(contentType) && bytes.length > 1024;
  const accepted = String(req.headers['accept-encoding'] || '').split(',').map(value => {
    const [name, ...params] = value.trim().split(';');
    const quality = params.find(param => param.trim().startsWith('q='));
    return { name, q: quality ? Number(quality.trim().slice(2)) : 1 };
  });
  const quality = name => accepted.find(item => item.name === name)?.q ?? accepted.find(item => item.name === '*')?.q ?? 0;
  const encoding = compressible ? (quality('br') > 0 && quality('br') >= quality('gzip') ? 'br' : quality('gzip') > 0 ? 'gzip' : '') : '';
  const etag = `"${digest}-${encoding || 'identity'}"`;
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': html ? 'no-cache' : versioned ? 'public, max-age=86400' : 'public, max-age=0, must-revalidate',
    'ETag': etag,
    'Vary': 'Accept-Encoding',
    'X-Content-Type-Options': 'nosniff'
  };
  if (String(req.headers['if-none-match'] || '').split(',').some(tag => tag.trim().replace(/^W\//, '') === etag || tag.trim() === '*')) {
    res.writeHead(304, headers);
    return res.end();
  }
  let payload = bytes;
  if (encoding) {
    const key = `${digest}:${encoding}`;
    payload = variants.get(key);
    if (!payload) {
      payload = encoding === 'br'
        ? await brotli(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } })
        : await gzipAsync(bytes);
      if (payload.length <= MAX_CACHE_BYTES) {
        while (cachedBytes + payload.length > MAX_CACHE_BYTES && variants.size) {
          const oldest = variants.keys().next().value;
          cachedBytes -= variants.get(oldest).length;
          variants.delete(oldest);
        }
        variants.set(key, payload);
        cachedBytes += payload.length;
      }
    }
    headers['Content-Encoding'] = encoding;
  }
  headers['Content-Length'] = payload.length;
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : payload);
}
