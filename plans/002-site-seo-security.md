# Plan 002: Canonical domain, sitemap, robots.txt, and a built-in CSP for the Astro site

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm
> the expected result before moving on. If anything in "STOP conditions" occurs, stop and report; do not
> improvise. Do NOT commit and do NOT push. The orchestrator reviews and commits.
>
> **Drift check (run first)**: `git diff --stat a43de13 -- astro.config.mjs public/robots.txt public/sitemap.xml package.json`
> On a mismatch with the excerpts below, STOP.

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: MED (a CSP can break pages if it's wrong; every page is checked)
- **Depends on**: plans/001-garden-blog.md (the CSP and sitemap must cover the new garden routes)
- **Category**: security + SEO
- **Planned at**: commit `a43de13`, 2026-09-30

## Why this matters
The live site is served at **https://george-michoulis.com** (GitHub Pages with a custom domain;
`gmixoulis.github.io` redirects there), but the config and sitemap still point at `gmixoulis.github.io`.
That splits search signals across two domains. `robots.txt` doesn't block `/drafts/`, where about 40
prototype pages with the owner's name live, which invites duplicate/thin-content indexing. It also doesn't
declare the sitemap. There's no Content-Security-Policy, which is the main browser-side defence against XSS.
GitHub Pages can't send HTTP headers, so the CSP has to be a `<meta>` tag, and Astro 7 can generate it
automatically, with hashes for every script and style it emits.

## Current state
- `astro.config.mjs` (excerpt):
```js
export default defineConfig({
  site: 'https://gmixoulis.github.io',
  outDir: 'build',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), publicDirIndex()],
  },
});
```
- `public/robots.txt` (whole file):
```
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
```
- `public/sitemap.xml`: a stale, hand-written sitemap listing `https://gmixoulis.github.io/` and `/index.xml`.
- `public/CNAME` contains `george-michoulis.com`.
- **Astro 7.2.4 has stable `security.csp`.** Read its documentation in
  `node_modules/astro/dist/types/public/config.d.ts` (search for `security.csp`, around lines 737–900) for the exact
  option shapes: `algorithm`, `directives`, `styleDirective`, `scriptDirective` (`resources`, `hashes`). Its
  limitations are documented there: not supported in `astro dev` (test with a build), and `'unsafe-inline'` is
  incompatible with the hashed `script-src`/`style-src`.
- The pages use these external origins:
  - Google Fonts in `src/layouts/GardenLayout.astro`: a `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">`
    that loads fonts from `https://fonts.gstatic.com`.
  - Inline `style="…"` ATTRIBUTES in garden markup (CSS custom properties like `style={`--i:${i}`}` in
    `src/pages/garden/*.astro` and `GardenLayout.astro`). A strict `style-src` blocks style attributes, so they
    need `style-src-attr 'unsafe-inline'`. That's a separate directive and doesn't weaken `script-src`.
  - `src/layouts/BaseLayout.astro` has an inline `<script is:inline>` theme bootstrap (reads localStorage `gm-theme`,
    toggles `html.dark`). Its hash must be present in `script-src`. Check whether Astro hashes `is:inline` scripts
    automatically; if not, add its hash through `security.csp.scriptDirective.hashes`.
  - React islands (`SiteNav`, homepage sections) are bundled scripts that Astro hashes.
  - JSON-LD `<script type="application/ld+json">` blocks (from Plan 001) are data blocks, so CSP doesn't execute or block them.
- Static files under `public/` (e.g. `public/play/`, `public/drafts/`) are copied verbatim and are NOT affected by
  Astro's CSP. That's expected: don't try to add a CSP to them in this plan.

## Commands you will need
| Purpose | Command | Expected |
|---|---|---|
| Add sitemap | `bun add @astrojs/sitemap@^3` | exit 0 |
| Build (gate) | `bun run build` | exit 0, "Complete!" |
| Serve build | `python3 -m http.server 4402 --directory build` (background; kill afterwards) | :4402 |
| Page check | `node scripts/ideas-qa/page-check.cjs <urls>` | every line `"ok":true` and `"cspMeta":true`, exit 0 |

## Scope
**In scope**: `astro.config.mjs`, `package.json`, `bun.lock`, `public/robots.txt`, `public/sitemap.xml` (delete),
`src/layouts/BaseLayout.astro` (only if a CSP fix needs it, e.g. moving the inline script's hash to config).
**Out of scope**: `public/play/**`, `public/drafts/**`, `public/index.xml`, any page content, `src/components/**`,
and `llms.txt` (the orchestrator writes it separately).

## Steps

### Step 1: Canonical domain
In `astro.config.mjs`, set `site: 'https://george-michoulis.com'`.
**Verify**: `bun run build` → exit 0; `grep -o 'https://george-michoulis.com/garden/one-stroke/' build/garden/one-stroke/index.html | head -1`
prints that URL (the canonical from Plan 001 now uses the new domain).

### Step 2: Generated sitemap (and delete the stale one)
`bun add @astrojs/sitemap@^3`, then `import sitemap from '@astrojs/sitemap'` and add
`sitemap({ filter: (page) => !page.includes('/drafts/'), customPages: ['https://george-michoulis.com/play/'] })`
to `integrations` (keep `react()` first). Delete `public/sitemap.xml`.
**Verify**: `bun run build` → exit 0; `build/sitemap-index.xml` exists; `cat build/sitemap-0.xml` contains
`https://george-michoulis.com/`, `/garden/`, `/garden/one-stroke/`, `/garden/tags/` and `/play/`, and no `gmixoulis.github.io`.

### Step 3: robots.txt
Replace `public/robots.txt` with:
```
# George Michoulis · https://george-michoulis.com
User-agent: *
Allow: /
Disallow: /drafts/

# AI assistants and answer engines are welcome to read and cite this site.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /
Disallow: /drafts/

Sitemap: https://george-michoulis.com/sitemap-index.xml
```
**Verify**: `bun run build` → `build/robots.txt` equals the file above (`diff public/robots.txt build/robots.txt` → no output).

### Step 4: Enable Astro's built-in CSP
In `astro.config.mjs` add (read the in-package docs to confirm the property names first):
```js
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
      "style-src-attr 'unsafe-inline'",
      "upgrade-insecure-requests",
    ],
    styleDirective: { resources: ["'self'", 'https://fonts.googleapis.com'] },
  },
},
```
If the build reports an unknown option, adjust it to the documented shape. If the documentation shows that
`style-src-attr` can't be expressed this way, STOP and report.
**Verify**: `bun run build` → exit 0; `grep -c 'http-equiv="content-security-policy"' build/index.html build/garden/index.html` → `1` each.

### Step 5: Prove nothing is blocked
Serve `build/` on :4402 and run:
`node scripts/ideas-qa/page-check.cjs http://127.0.0.1:4402/ http://127.0.0.1:4402/garden/ http://127.0.0.1:4402/garden/one-stroke/ http://127.0.0.1:4402/garden/tags/`
→ exit 0, every line `"ok":true` and `"cspMeta":true`, and `"csp":[]` everywhere.
If the theme bootstrap script in BaseLayout is blocked (`csp` shows `script-src … inline`), compute its SHA-256
and add it via `security.csp.scriptDirective.hashes` (format `'sha256-<base64>'`), rebuild and re-check.
If Google Fonts are blocked, fix `styleDirective.resources`/`font-src`. Don't add `'unsafe-inline'` to `script-src` or `style-src`.
Kill the server when done.

## Done criteria
- [ ] `bun run build` exits 0
- [ ] `astro.config.mjs` has `site: 'https://george-michoulis.com'`, the sitemap integration and `security.csp`
- [ ] `public/sitemap.xml` is deleted; `build/sitemap-index.xml` exists; no `gmixoulis.github.io` in `build/sitemap-0.xml`
- [ ] `build/robots.txt` disallows `/drafts/` and declares the sitemap
- [ ] The Step 5 page check exits 0 with `"cspMeta":true` and `"csp":[]` on every page and viewport
- [ ] `grep -rn "unsafe-inline" astro.config.mjs` matches ONLY the `style-src-attr` line

## STOP conditions
- The `security.csp` option shapes differ from this plan and the docs don't show an equivalent.
- The homepage (`/`) shows CSP violations from React islands that can't be fixed with documented options.
- Any fix would require `'unsafe-inline'` or `'unsafe-eval'` in `script-src`.

## Maintenance notes
- The CSP only covers Astro-rendered pages. When the chosen homepage finalist is ported into Astro, its WebGL CDN
  (`https://cdn.jsdelivr.net`) must be added to `scriptDirective.resources` (with SRI), or better, installed via
  npm (`three`, `gsap`) and bundled, so no external script origin is needed.
- `frame-ancestors`, `X-Content-Type-Options` and HSTS need real HTTP headers. GitHub Pages can't send them;
  a CDN in front (e.g. Cloudflare) could. That's the owner's decision.
- A later nice-to-have: self-host the garden fonts with Astro 7's `fonts` config and drop the Google origins
  from the CSP (privacy + performance).
