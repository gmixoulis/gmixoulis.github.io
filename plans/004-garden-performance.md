# Plan 004: Make the Zen Garden fast (self-hosted fonts, optimised images, small favicon)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the
> expected result. If a STOP condition occurs, stop and report. Do NOT commit and do NOT push.
>
> **Drift check (run first)**: `git diff --stat 3b6bebd -- astro.config.mjs src/layouts/GardenLayout.astro src/pages/garden src/styles/garden.css public/favicon.ico`
> must print nothing.

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: MED (visual regressions are possible, so every page is re-screenshotted)
- **Depends on**: plans 001–003 (committed)
- **Category**: perf
- **Planned at**: commit `3b6bebd`, 2026-10-01

## Why this matters
Lighthouse (mobile) scores the garden pages at **Performance 57–61**. Accessibility, Best Practices and SEO are
already 96–100. Measured causes on `/garden/`, served with gzip:
1. **Render-blocking Google Fonts CSS, 295 KB, blocking about 2.9 s.** `GardenLayout.astro` loads SIX families,
   including full Japanese fonts (Noto Sans JP, Shippori Mincho with CJK ranges, Yuji Syuku, Yuji Boku, Zen Kurenaido),
   but the garden only renders **18 CJK characters** in total.
2. **Unoptimised decorative images** from `public/`: great-wave.jpg 280 KB (below the fold), enso-sumi.png 134 KB,
   branch.png, crane.png, tree-right.png and others are served as-is (no WebP, no lazy loading, no intrinsic size).
3. **public/favicon.ico is 109 KB**, loaded on every page.
4. The tags page has too much text below 12px ("Document doesn't use legible font sizes").
The target is Performance **≥ 85** on the three garden pages, with no visual change beyond font rendering.

## Current state
- `src/layouts/GardenLayout.astro` head slot (lines ~37–43) loads:
  `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&family=Shippori+Mincho:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;1,400&family=Yuji+Boku&family=Yuji+Syuku&family=Zen+Kurenaido&display=swap`
  plus two `preconnect` links.
- `src/styles/garden.css` font variables (lines 29–33):
  ```css
  --z-font-display: "Shippori Mincho", "Hiragino Mincho ProN", "Times New Roman", serif;
  --z-font-brush: "Yuji Syuku", "Yuji Boku", "Hiragino Mincho ProN", serif;
  --z-font-hand: "Zen Kurenaido", "Yu Gothic", sans-serif;
  --z-font-body: "Source Sans 3", "Noto Sans JP", "Hiragino Sans", sans-serif;
  --z-font-meta: "IBM Plex Mono", ui-monospace, monospace;
  ```
  Usage: display (headings, blockquotes, weights 400 and 600), brush (kanji seals and wallpaper, CJK only), body (text,
  weights 300/400/600, italic 400), meta (IBM Plex Mono, already self-hosted via @fontsource in `src/styles/global.css`, so
  leave it). `.z-hand` / `--z-font-hand` is used by NO page (verified: 0 uses). Drop Zen Kurenaido.
- The complete set of CJK characters rendered anywhere in the garden (sources + posts, as of this plan):
  `・円和夢奈川庭心愛沖浪無神禅裏道静`. Some come from the kanji array in `GardenLayout.astro`, the hanko `禅庭`, the
  figcaption `神奈川沖浪裏`, and post frontmatter `kanji` (`庭`, `円`). New posts may add more `kanji`, so the subset must be
  computed at build time from the posts plus a constant list.
- `<img src="/img/…">` decorative images in garden files: `GardenLayout.astro`/`index.astro` (hero: branch.png,
  crane.png, sun-brush.png, dragonfly.png), `[...slug].astro` (tree-right.png, band-b.png in the header; swirl.png,
  calligraphy.png, koi.png in the footer plate). CSS `url()` in `garden.css`: `/img/ui/enso-sumi.png` (a mask, lines
  150–151 and 378–379), `/img/ui/tatami.jpg` (line 324, post header), `/img/ink/parts/great-wave.jpg` (line 394, index river band).
- **Astro 7.2.4 has a stable `fonts` config** (self-hosted at build, preloadable) and the `<Font />` component from
  `astro:assets`. Read its docs in `node_modules/astro/dist/types/public/config.d.ts` (search `@name fonts`, about line 2885
  onward: `provider`, `name`, `cssVariable`, `weights`, `styles`, `subsets`, `fallbacks`) BEFORE Step 1.
- CSP (from Plan 002, in `astro.config.mjs`): self-hosted fonts are `'self'`. Keep the Google origins in the CSP only
  if Step 2's small `text=` subset link remains. Inline `style="…"` attributes are allowed (style-src-attr).

## Commands
| Purpose | Command | Expected |
|---|---|---|
| Build (gate) | `bun run build` | exit 0 |
| gzip server | `node scripts/ideas-qa/serve-gz.cjs build 4431` (background; kill afterwards) | serves :4431 |
| Page check | `node scripts/ideas-qa/page-check.cjs http://127.0.0.1:4431/garden/ http://127.0.0.1:4431/garden/one-stroke/ http://127.0.0.1:4431/garden/tags/` | every line ok, csp [] |
| Lighthouse | `python3 scripts/ideas-qa/score.py lighthouse http://127.0.0.1:4431/garden/ http://127.0.0.1:4431/garden/one-stroke/ http://127.0.0.1:4431/garden/tags/` | prints scores |

## Scope
**In scope**: `astro.config.mjs` (add `fonts` only), `src/layouts/GardenLayout.astro`, `src/pages/garden/index.astro`,
`src/pages/garden/[...slug].astro`, `src/pages/garden/tags/*.astro` (only if they reference moved images),
`src/styles/garden.css`, `src/assets/ink/*` (create: copies of the used images), `public/favicon.ico`.
**Out of scope**: `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `src/components/**` (the React SiteNav
stays; its JS is a known remaining cost, deferred to the homepage port), the security directives in `astro.config.mjs`
(don't change them unless Step 2 removes Google entirely, in which case STOP and report instead of editing the CSP),
`public/img/**` (keep the originals; the homepage may use them), `public/drafts/**`, `public/play/**`.

## Steps
### Step 1: Self-host the two Latin text fonts with Astro's fonts API
In `astro.config.mjs`, `import { defineConfig, fontProviders } from 'astro/config'` and add:
```js
fonts: [
  { provider: fontProviders.google(), name: 'Shippori Mincho', cssVariable: '--font-shippori',
    weights: [400, 600], styles: ['normal'], subsets: ['latin', 'latin-ext'] },
  { provider: fontProviders.google(), name: 'Source Sans 3', cssVariable: '--font-source-sans',
    weights: [300, 400, 600], styles: ['normal', 'italic'], subsets: ['latin', 'latin-ext', 'greek'] },
],
```
(If the documented option names differ, use the documented equivalents. If `subsets` isn't supported, STOP.)
In `GardenLayout.astro`, `import { Font } from 'astro:assets'` and render in the head slot:
`<Font cssVariable="--font-shippori" preload />` and `<Font cssVariable="--font-source-sans" preload />`.
In `garden.css`, change the variables to put the self-hosted fonts first:
`--z-font-display: var(--font-shippori), "Hiragino Mincho ProN", "Times New Roman", serif;`
`--z-font-body: var(--font-source-sans), "Hiragino Sans", "Noto Sans JP", sans-serif;` (Noto stays as a system fallback name only).
**Verify**: `bun run build` → exit 0; `ls build/_astro/fonts 2>/dev/null || find build -name "*.woff2" | head` shows self-hosted woff2 files.

### Step 2: Load the CJK brush font as a tiny character subset
Remove the old six-family `<link>` completely. In `GardenLayout.astro` frontmatter, compute the characters actually rendered:
```ts
import { getPosts } from '@/lib/garden';
const BASE_CJK = '・円和夢奈川庭心愛沖浪無神禅裏道静';
const postKanji = (await getPosts()).map((p) => p.data.kanji ?? '').join('');
const cjk = [...new Set([...BASE_CJK, ...postKanji, ...kanji.map(([ch]) => ch).join('')])].join('');
const brushHref = `https://fonts.googleapis.com/css2?family=Yuji+Syuku&text=${encodeURIComponent(cjk)}&display=swap`;
```
(`kanji` is the existing array in the file.) Render `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
and `<link rel="stylesheet" href={brushHref} />`. Change `--z-font-brush` to `"Yuji Syuku", "Hiragino Mincho ProN", serif;`
and delete `--z-font-hand` and the unused `.z-hand` rule.
**Verify**: `bun run build` → exit 0; `grep -c "Noto+Sans+JP\|Zen+Kurenaido\|Yuji+Boku" build/garden/index.html` → `0`;
`grep -o 'family=Yuji+Syuku&amp;text=[^"&]*' build/garden/index.html | head -1` shows the encoded character list.

### Step 3: Optimise the decorative images
1. `mkdir -p src/assets/ink` and copy (don't move) these originals into it: `public/img/ink/parts/{branch,crane,sun-brush,dragonfly,tree-right,band-b,swirl,koi}.png`,
   `public/img/ink/calligraphy.png`, `public/img/ink/parts/great-wave.jpg`, `public/img/ui/tatami.jpg`, `public/img/ui/enso-sumi.png`.
2. Replace each garden `<img src="/img/…">` with `<Image src={importedAsset} alt="" … />` from `astro:assets`, keeping the
   exact classes, `style` attributes, `aria-hidden`, and `alt=""`. Add `loading="eager"` for the hero images (branch, crane,
   sun-brush, dragonfly, tree-right, band-b) and `loading="lazy"` for the footer plate (swirl, calligraphy, koi).
   Don't set `width`/`height` props: Astro infers them from the import.
3. CSS `url()` images: in the component that renders the element, compute `const wave = await getImage({ src: greatWave, format: 'webp', width: 1600 })`
   (similarly tatami → webp at width 1600, and enso-sumi → **png** at width 800, because it's a mask and needs alpha) and
   pass it through an inline style CSS variable, e.g. `style={`--z-wave: url(${wave.src})`}` on the `.z-river-band`
   element. In `garden.css`, replace the hard-coded `url("/img/…")` with `var(--z-wave)` (and `var(--z-tatami)`,
   `var(--z-enso)`). Keep every other CSS property unchanged.
**Verify**: `bun run build` → exit 0; `grep -c 'src="/img/ink' build/garden/index.html build/garden/one-stroke/index.html` → `0` for both;
`find build/_astro -name "great-wave*.webp" | head -1` prints a file under about 120 KB (`ls -la`).

### Step 4: Small favicon
Rebuild `public/favicon.ico` from the existing PNGs with Python/PIL:
`python3 -c "from PIL import Image; im=Image.open('public/favicon-32x32.png'); im.save('public/favicon.ico', sizes=[(16,16),(32,32),(48,48)])"`
**Verify**: `ls -la public/favicon.ico` → under 20 KB.

### Step 5: Legible font sizes on the tags pages
Find the rules in `garden.css` that set text below 12px on the tag and index lists (look at `.z-meta`, `.z-taglist`,
and any `font-size` below `0.75rem`). Raise them to at least `0.75rem`, keeping letter-spacing and other properties.
**Verify**: `bun run build` → exit 0.

### Step 6: Measure, and compare visually
1. Start `node scripts/ideas-qa/serve-gz.cjs build 4431` in the background.
2. Page check (Commands table) → every line `"ok":true`, `"csp":[]`.
3. Lighthouse (Commands table) → Performance **≥ 85** on all three URLs; Accessibility 100; Best Practices ≥ 96; SEO 100.
   If Performance is below 85, DON'T hack further. Report the top 3 opportunities from a Lighthouse JSON run and stop.
4. Screenshot `/garden/` and `/garden/one-stroke/` at 1280×900 in light and dark (puppeteer, like
   `scripts/ideas-qa/page-check.cjs`, emulating prefers-color-scheme; wait 3 s after adding the `is-in` class to all
   `.z-reveal,.z-cut` elements). Save them to `/tmp/garden-004-*.png` and list their paths in the report, so the reviewer
   can compare them with the previous look.
5. Kill the server.

## Done criteria
- [ ] `bun run build` exits 0
- [ ] No six-family Google Fonts link. Only the Yuji Syuku `text=` subset link remains.
- [ ] Self-hosted woff2 fonts in `build/`
- [ ] No `src="/img/ink` or `/img/ui/…` CSS urls remain in built garden pages
- [ ] `public/favicon.ico` < 20 KB
- [ ] The page check passes (0 CSP violations); Lighthouse Performance ≥ 85 on the 3 garden URLs (or a STOP report with data)
- [ ] `git status` shows only in-scope files changed

## STOP conditions
- The fonts API options differ from the docs and no documented equivalent exists.
- Any change seems to require editing BaseLayout, global.css, the CSP directives, or public/img originals.
- The page check shows CSP violations that can't be fixed within scope.
- Performance stays below 85 after Steps 1–5 (report the data and stop; don't hack).

## Maintenance notes
- Adding a post with a new `kanji` automatically extends the brush-font subset at build time.
- The React SiteNav (about 176 KB of JS) is the remaining big cost on garden pages. It goes away when the chosen homepage
  finalist's nav replaces it (the homepage port plan).
