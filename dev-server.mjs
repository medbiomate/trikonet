import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = decodeURIComponent(requestUrl.pathname);

  let target = normalize(join(root, path === '/' ? 'index.html' : path.slice(1)));
  if (!target.startsWith(root)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  try {
    const s = await stat(target);
    if (s.isDirectory()) {
      target = join(target, 'index.html');
    }
  } catch {
    // SPA fallback: Route all non-file paths to index.html
    if (!extname(path)) {
      target = join(root, 'index.html');
    }
  }

  try {
    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': types[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Trikonet Frontend running at: http://localhost:${port}`);
  console.log(`Backend API target configured at: https://api.trikonet.com`);
});
