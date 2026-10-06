// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A local tool hook writes `receipts/` and `review-receipts/` logs into whatever folder it runs in,
 * including under `public/`, which Astro copies verbatim. Strip them from every build so they never deploy.
 * @returns {import('astro').AstroIntegration}
 */
function stripToolReceipts() {
  const walk = (/** @type {string} */ dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const p = join(dir, e.name);
      if (e.name === 'receipts' || e.name === 'review-receipts') rmSync(p, { recursive: true, force: true });
      else walk(p);
    }
  };
  return { name: 'strip-tool-receipts', hooks: { 'astro:build:done': ({ dir }) => walk(fileURLToPath(dir)) } };
}

/**
 * Vite/Astro do not auto-serve directory indexes for files in `public/`.
 * GitHub Pages redirects bare dir URLs to a trailing slash so relative
 * assets resolve; silently rewriting HTML while leaving the browser on
 * `/play` breaks `dist/*` and `image/*` (they resolve against `/`).
 * @returns {import('vite').Plugin}
 */
function publicDirIndex() {
  /** Bare paths → trailing-slash URL (browser must see the slash). */
  const redirects = new Map([
    ['/drafts/japan', '/drafts/japan/'],
    ['/play', '/play/'],
  ]);
  /** Trailing-slash dirs → index.html (internal rewrite only). */
  const indexes = new Map([
    ['/drafts/japan/', '/drafts/japan/index.html'],
    ['/play/', '/play/index.html'],
  ]);

  /** @param {import('vite').Connect.Server} middlewares */
  function mount(middlewares) {
    middlewares.use((req, res, next) => {
      const raw = req.url || '';
      const path = raw.split('?')[0];
      const qs = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';

      const redirectTo = redirects.get(path);
      if (redirectTo) {
        res.statusCode = 302;
        res.setHeader('Location', redirectTo + qs);
        res.end();
        return;
      }

      const target = indexes.get(path);
      if (target) {
        req.url = target + qs;
      }
      next();
    });
  }

  return {
    name: 'public-dir-index',
    configureServer(server) {
      mount(server.middlewares);
    },
    configurePreviewServer(server) {
      mount(server.middlewares);
    },
  };
}

/* Sitemap lastmod from the blog's front matter (updated ?? date): a post's own date, a tag page's newest post, the blog
   index's newest post. Pages without a content date (home, /play/) get none rather than a made-up one. */
/** @typedef {{ slug: string, date: string | undefined, tags: string[] }} Post */
function gardenDates() {
  const dir = './src/content/garden', /** @type {Post[]} */ posts = [];
  const walk = (/** @type {string} */ d) => readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) return walk(p);
    if (!e.name.endsWith('.md') || e.name.startsWith('_')) return;
    const fm = readFileSync(p, 'utf8').split('---')[1] ?? '';
    const get = (/** @type {string} */ k) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.trim();
    if (get('draft') === 'true') return;
    const slug = p.slice(dir.length + 1).replace(/(\/index)?\.md$/, '');
    posts.push({ slug, date: get('updated') ?? get('date'), tags: (get('tags') ?? '').replace(/[[\]]/g, '').split(',').map((t) => t.trim()).filter(Boolean) });
  });
  walk(dir);
  return posts;
}
const POSTS = gardenDates();
const newest = (/** @type {Post[]} */ ps) => ps.map((p) => p.date).sort().at(-1);
function lastmod(/** @type {string} */ url) {
  const path = new URL(url).pathname;
  if (path === '/garden/' || path === '/garden/tags/') return newest(POSTS);
  const tag = path.match(/^\/garden\/tags\/([^/]+)\/$/)?.[1];
  if (tag) return newest(POSTS.filter((p) => p.tags.includes(tag)));
  return POSTS.find((p) => path === `/garden/${p.slug}/`)?.date;
}

export default defineConfig({
  site: 'https://george-michoulis.com',
  outDir: 'build',
  // github-dark's comment colour is 3.05:1 on its background; the high-contrast variant passes AA.
  markdown: { shikiConfig: { theme: 'github-dark-high-contrast' } },
  fonts: [
    // ponytail: Latin-only local files. The Google provider can't drop Shippori's 240 un-tagged
    // Japanese slices (subsets only filters tagged faces); CJK glyphs come from the Yuji Syuku text= subset.
    // fallbacks: a serif face falls back to a metric-matched serif (Times New Roman), not Arial.
    { provider: fontProviders.local(), name: 'Shippori Mincho', cssVariable: '--font-shippori', fallbacks: ['serif'],
      options: { variants: [
        { src: ['./src/assets/fonts/shippori-mincho-400-latin.woff2'], weight: 400, style: 'normal',
          unicodeRange: ['U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'] },
        { src: ['./src/assets/fonts/shippori-mincho-400-latin-ext.woff2'], weight: 400, style: 'normal',
          unicodeRange: ['U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'] },
        { src: ['./src/assets/fonts/shippori-mincho-600-latin.woff2'], weight: 600, style: 'normal',
          unicodeRange: ['U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'] },
        { src: ['./src/assets/fonts/shippori-mincho-600-latin-ext.woff2'], weight: 600, style: 'normal',
          unicodeRange: ['U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'] },
      ] } },
    // Blog body text. display: optional: it's preloaded, so it's normally ready for the first paint; when it isn't (slow
    // first visit) the fallback stays for that view instead of swapping, which re-wrapped the post intro (CLS 0.14).
    { provider: fontProviders.google(), name: 'Source Sans 3', cssVariable: '--font-source-sans', display: 'optional',
      weights: [300, 400, 600], styles: ['normal', 'italic'], subsets: ['latin', 'latin-ext', 'greek'] },
    // Homepage (Cube). Latin fonts, so `subsets` filters the Google faces correctly.
    { provider: fontProviders.google(), name: 'Funnel Display', cssVariable: '--font-funnel',
      weights: [500, 600], styles: ['normal'], subsets: ['latin', 'latin-ext'] },
    // Body text: designed for legibility (distinct b/d/p/q); headings and UI keep Funnel Display / Geist.
    { provider: fontProviders.google(), name: 'Atkinson Hyperlegible Next', cssVariable: '--font-atkinson',
      weights: [400, 700], styles: ['normal'], subsets: ['latin', 'latin-ext'] },
    { provider: fontProviders.google(), name: 'Geist', cssVariable: '--font-geist',
      weights: [400, 500, 600], styles: ['normal'], subsets: ['latin', 'latin-ext'] },
    { provider: fontProviders.google(), name: 'Geist Mono', cssVariable: '--font-geist-mono',
      weights: [400, 500], styles: ['normal'], subsets: ['latin', 'latin-ext'] },
  ],
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/drafts/'),
      serialize: (item) => {
        const date = lastmod(item.url);
        return date ? { ...item, lastmod: date } : item;
      },
      customPages: ['https://george-michoulis.com/play/'],
    }),
    stripToolReceipts(),
  ],
  // CSP is emitted as a <meta> at the end of <head>; BaseLayout's inline theme bootstrap runs before it
  // (no-flash pattern), so it needs no hash. Keep that script above the meta, or add its hash to scriptDirective.
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self'",
        "frame-src https://widgets.sociablekit.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ],
      styleDirective: {
        resources: [
          "'self'",
          'https://fonts.googleapis.com',
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  vite: {
    plugins: [tailwindcss(), publicDirIndex()],
  },
});
