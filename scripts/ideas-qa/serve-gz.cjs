// Tiny static server with gzip, like GitHub Pages, so Lighthouse scores match production more closely.
// Usage: node scripts/ideas-qa/serve-gz.cjs <dir> <port>
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const [root = 'build', port = '4430'] = process.argv.slice(2);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const compressible = /^(text\/|application\/(json|xml)|image\/svg)/;
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(root, p);
  if (!f.startsWith(path.resolve(root)) && !path.resolve(f).startsWith(path.resolve(root))) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404).end('not found'); return; }
  const type = types[path.extname(f).toLowerCase()] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': 'max-age=600' };
  const body = fs.readFileSync(f);
  if (compressible.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' }).end(zlib.gzipSync(body));
  } else res.writeHead(200, headers).end(body);
}).listen(+port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
