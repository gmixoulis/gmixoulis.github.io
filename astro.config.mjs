// @ts-check
import { defineConfig } from 'astro/config';
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
