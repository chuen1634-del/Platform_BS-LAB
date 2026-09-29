import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8' };

createServer(async (request, response) => {
  const requested = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) { response.writeHead(403); response.end('Forbidden'); return; }
  try { const body = await readFile(filePath); response.writeHead(200, { 'Content-Type': types[extname(filePath)] ?? 'application/octet-stream' }); response.end(body); }
  catch { response.writeHead(404); response.end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('MVP running at http://127.0.0.1:4173'));
