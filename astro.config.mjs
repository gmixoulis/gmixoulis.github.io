// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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

export default defineConfig({
  site: 'https://george-michoulis.com',
  outDir: 'build',
  fonts: [
    // ponytail: Latin-only local files. The Google provider can't drop Shippori's 240 un-tagged
    // Japanese slices (subsets only filters tagged faces); CJK glyphs come from the Yuji Syuku text= subset.
    { provider: fontProviders.local(), name: 'Shippori Mincho', cssVariable: '--font-shippori',
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
    { provider: fontProviders.google(), name: 'Source Sans 3', cssVariable: '--font-source-sans',
      weights: [300, 400, 600], styles: ['normal', 'italic'], subsets: ['latin', 'latin-ext', 'greek'] },
  ],
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/drafts/'),
      customPages: ['https://george-michoulis.com/play/'],
    }),
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
