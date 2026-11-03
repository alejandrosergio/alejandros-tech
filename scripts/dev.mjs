import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from './build.mjs';

await build();
const dist = path.join(root, 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(dist, `.${pathname}`);
    if (target !== dist && !target.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
    let file = target;
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch { res.writeHead(404, { 'content-type': mime['.html'] }); res.end(await readFile(path.join(dist, '404.html'))); return; }
    res.writeHead(200, { 'content-type': mime[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(await readFile(file));
  } catch { res.writeHead(500).end('Preview error'); }
});
const port = Number(process.env.PORT || 4178);
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
