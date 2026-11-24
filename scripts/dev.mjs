import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { build, root } from './build.mjs';

// Loopback-only static preview. The document demo has no inference endpoint.
await build();
const dist = path.join(root, 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.wasm': 'application/wasm', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8' };
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(dist, '.' + pathname);
    if (target !== dist && !target.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
    let file = target;
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch { res.writeHead(404, { 'content-type': mime['.html'] }); res.end(await readFile(path.join(dist, '404.html'))); return; }
    // Seeking in the recorded case should behave like static production hosting.
    if (path.extname(file) === '.mp4') {
      const { size } = await stat(file);
      const headers = { 'content-type': mime['.mp4'], 'cache-control': 'no-store', 'accept-ranges': 'bytes' };
      const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
      let start = 0, end = size - 1;
      if (req.headers.range) {
        if (!range || (!range[1] && !range[2])) { res.writeHead(416, { ...headers, 'content-range': `bytes */${size}` }).end(); return; }
        start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) { res.writeHead(416, { ...headers, 'content-range': `bytes */${size}` }).end(); return; }
        headers['content-range'] = `bytes ${start}-${end}/${size}`;
      }
      res.writeHead(req.headers.range ? 206 : 200, { ...headers, 'content-length': end - start + 1 });
      if (req.method === 'HEAD') res.end();
      else createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
      return;
    }
    res.writeHead(200, { 'content-type': mime[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(req.method === 'HEAD' ? null : await readFile(file));
  } catch { res.writeHead(500).end('Preview error'); }
});
const port = Number(process.env.PORT || 4178);
server.listen(port, '127.0.0.1', () => console.log('Local: http://127.0.0.1:' + port + '/'));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
