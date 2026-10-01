# Plan 005: Make the Cube finalist the real Astro homepage

> **Executor instructions**: Follow this plan step by step. Run every verification command. If a STOP condition
> occurs, stop and report. Do NOT commit or push.
> **Drift check (run first)**: `git status --porcelain src/pages/index.astro src/components src/layouts src/styles astro.config.mjs`
> must print nothing (plan 004 is committed as 888da44). If it prints anything, STOP.

## Status
- **Priority**: P1 · **Effort**: L · **Risk**: MED · **Depends on**: 001–004 · **Category**: direction/feature
- **Planned at**: 2026-10-01

## Why this matters
George chose the "Cube" design: `public/drafts/finalists/cube.html`, a finished single-file prototype with an
iridescent glass cube "genesis block" chain in three.js, light and dark themes, full content, JSON-LD, a CSP and a
LinkedIn feed. It must become the production homepage `/`, rebuilt as proper Astro code. **The UI only:** the data
pipeline scripts stay untouched.

## Current state
- `src/pages/index.astro` renders old React sections (`src/components/site/HeroTurbo.tsx`, `AboutSection.tsx`, `WorkPan.tsx`,
  `ProofSection.tsx`, `ContactSection.tsx`) through `BaseLayout.astro`, which also renders `SiteNav.tsx` (React) and `ThemeToggle.tsx`.
- `BaseLayout.astro` accepts SEO props (canonical, ogType, ogImage, noindex, jsonLd, rss…). The garden (`GardenLayout.astro`)
  depends on BaseLayout and SiteNav.
- The prototype `public/drafts/finalists/cube.html` (about 117 KB) contains: its `<head>` (SEO meta, JSON-LD `@graph` with Person
  `@id` `https://george-michoulis.com/#person` and 7 ScholarlyArticles), inline CSS (design tokens for dark and light), the
  markup of every section, an importmap loading three@0.169.0 / gsap 3.12.5 / ScrollTrigger / lenis 1.1.13 from jsDelivr, and one
  module script (the WebGL scene, theme toggle, nav, LinkedIn IntersectionObserver, certificates dialog). **It is the visual
  and content source of truth. Reproduce it pixel-faithfully.**
- Data files that must keep working unchanged:
  - `public/publications.json` is rewritten monthly by `scripts/fetchPublications.js` (GitHub Action). Fields: title, link, year,
    publication, cited_by.value.
  - `public/img/renamed/*` is written by `scripts/rename_auto.js` (GitHub Action). Filenames are `<Kind>_<Title>.<ext>`.
- `astro.config.mjs` has `security.csp` (hashed scripts/styles, `default-src 'self'`) and `fonts`.

## Scope
**In scope**: `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, new `src/components/home/*.astro`,
new `src/scripts/home/*.ts`, new `src/styles/home.css`, `src/data/profile.ts` (content only), `package.json`/`bun.lock`
(adding `three` and `lenis`; `gsap` is already a dependency), deleting the obsolete React files listed in Step 7,
`public/og.png` (create), `astro.config.mjs` (CSP directives only if needed for the LinkedIn frame, which is already allowed).
**Out of scope (do NOT modify)**: `scripts/**` (including `fetchPublications.js` and `rename_auto.js`), `.github/**`,
`public/publications.json`, `public/img/**`, `public/play/**`, `public/drafts/**`, the garden pages, `plans/**`.

## Steps
### Step 1: Dependencies
`bun add three@^0.169 lenis@^1.1` (keep the existing gsap). Scripts are bundled by Astro; no CDN.
**Verify**: `bun run build` → exit 0.

### Step 2: Build-time data
- Publications: read `public/publications.json` at build time (`fs.readFileSync` + `JSON.parse`; it's an array of
  `{title, link, authors, publication, year, cited_by: {value} | null}`, 12 items today, rewritten monthly by CI).
  The prototype shows a curated set of papers with DOIs/venues. Keep that curated list in `profile.ts`; for each curated
  paper look up its citation count in publications.json by normalized title (lowercase, strip punctuation/whitespace;
  the 2026 DCOSS-IoT paper isn't in the JSON yet, so it has no count). Any JSON item that is neither curated nor in an
  explicit `hiddenPubs` title list in profile.ts (the conference booklet etc., i.e. whatever the prototype doesn't show
  today) is appended automatically using its JSON title/publication/year/link, so new papers appear after the monthly job.
  Compute the headline totals (total citations = sum of counts, h-index = largest h with h papers ≥ h citations) from
  the JSON too, so they update by themselves; don't hard-code "56" or "3". Sort by citations descending, then year.
  **Citations rule (George's explicit request): render the citation count ONLY when `cited_by.value > 0`. When it's 0 or
  missing, render nothing: no "0", no "0 citations", no placeholder.** Apply the same rule in the JSON-LD (omit it).
  Merge in the facts from the prototype that publications.json lacks (DOIs, venue labels, the 2026 DCOSS-IoT paper) by
  keeping a small `extras` map in `src/data/profile.ts` keyed by title; the auto-updated JSON stays the source for counts.
- Certificates: list `public/img/renamed` at build time with `node:fs` `readdirSync`, derive the title and kind from the filename
  exactly as the prototype shows them (sentence case; strip a leading "1"; the bachelor's degree is **BSc Applied Informatics**,
  not "Computer Science"; issuer/year labels from the prototype markup, via a map in profile.ts keyed by filename). Use `/img/renamed/<file>` URLs.
  New files added by the rename workflow must appear automatically (with a generic label).
- Move all the other text content from the prototype into `src/data/profile.ts` (roles, education, awards, soft skills, activities, projects).
**Verify**: `bun run build` → exit 0.

### Step 3: Components (zero JS by default)
Port each prototype section to an Astro component in `src/components/home/` (e.g. `Hero.astro`, `About.astro`, `Skills.astro`,
`Experience.astro`, `Research.astro`, `Certificates.astro`, `Projects.astro`, `Activities.astro`, `LinkedIn.astro`, `Contact.astro`,
`Nav.astro`, `Footer.astro`), rendering from `profile.ts` and the build-time data. Copy the prototype CSS into `src/styles/home.css`
(tokens for dark and light unchanged). Markup, classes, ids and anchors must match the prototype so the CSS applies unchanged.
All content is static HTML (crawlable).

### Step 4: Scripts
Move the prototype's module script into `src/scripts/home/*.ts` (the scene, theme, nav, LinkedIn loader, certificates dialog) and
include it with an Astro `<script>` in `index.astro` (bundled, so the CSP hashes it automatically). Import `three`,
`three/examples/jsm/...` addons, `gsap`, `gsap/ScrollTrigger` and `lenis` from npm. Remove the importmap and all CDN URLs.
Keep behaviour identical: WebGL starts after first paint, reduced motion gives a still frame, no WebGL gives the CSS fallback,
and the theme toggles live. **One theme source of truth:** BaseLayout's inline bootstrap reads localStorage key
`gm-theme` (`light`/`dark`/`system`) and toggles `html.dark`; the prototype uses key `theme` and `html[data-theme]`.
Extend BaseLayout's bootstrap to ALSO set `document.documentElement.dataset.theme = dark ? 'dark' : 'light'`, and make
the ported toggle read/write `gm-theme` and update both `html.dark` and `data-theme` (only ever accept `light`/`dark`/`system`
from storage). Then the prototype CSS (`[data-theme=light]` selectors) and the garden CSS (`.dark`) both keep working unchanged.

### Step 4b: Fonts
The prototype loads Funnel Display (500, 600), Geist (400, 500, 600) and Geist Mono (400, 500) from a Google Fonts `<link>`.
Add them to `fonts` in `astro.config.mjs` with `fontProviders.google()`, `subsets: ['latin', 'latin-ext']` (they are Latin
fonts, so `subsets` filters correctly; do NOT do this for CJK fonts, see the Shippori comment), and render `<Font>` for
them on the homepage only. Preload ONLY the two faces visible above the fold (the hero h1 weight of Funnel Display and
Geist 400 normal latin): `preload={[{ weight: …, style: 'normal', subset: 'latin' }]}`. Point the prototype's
font-family values at the fonts API CSS variables. No Google Fonts `<link>` on the homepage.
`@import "@fontsource/ibm-plex-mono…"` in `src/styles/global.css` stays (the garden uses IBM Plex Mono); remove
`@import "@fontsource-variable/ibm-plex-sans"` only if nothing references "IBM Plex Sans" after the port (grep first).

### Step 5: Layout and nav
Replace `SiteNav` in `BaseLayout.astro` with the new `Nav.astro` (Play button, Writing link to /garden/, theme toggle; on the
homepage the section anchors; on other pages link them as `/#section`). Keep BaseLayout's existing SEO props and bootstrap script.
The homepage passes: title/description from the prototype, `ogType="profile"`, `ogImage="https://george-michoulis.com/og.png"`, and
the JSON-LD `@graph` (built from the data, citations rule applied). **No noindex on `/`.** Copy
`public/drafts/finalists/og-cube.png` to `public/og.png`.

### Step 6: Garden compatibility
The garden must still build and look the same with the new nav. `GardenLayout` must keep working.
**Verify**: `bun run build` → exit 0, 8+ pages.

### Step 7: Delete the obsolete React homepage
Delete `src/components/site/{HeroTurbo,AboutSection,WorkPan,ProofSection,ContactSection,SiteNav,ThemeToggle}.tsx` and any `src/components/ui/*`
no longer imported (check with grep first). Remove `motion`/`radix-ui`/`lucide-react` from package.json ONLY if nothing imports them anymore.
**Verify**: `bun run build` → exit 0; `grep -rn "components/site" src` → no output.

### Step 8: Verify
1. `node scripts/ideas-qa/serve-gz.cjs build 4432` (background).
2. `node scripts/ideas-qa/page-check.cjs http://127.0.0.1:4432/ http://127.0.0.1:4432/garden/ http://127.0.0.1:4432/garden/one-stroke/` → every line ok (overflowX false, 0 CSP violations, 0 errors; ignore sociablekit third-party failures).
3. `python3 scripts/ideas-qa/score.py content build/index.html` → the content score is 100 EXCEPT the checks "draft noindex" (now intentionally absent) and "CSP meta" (Astro emits it as lowercase `content-security-policy`, which is fine). Report them.
4. `grep -c ">0<\|0 citations" build/index.html` → `0`.
5. `python3 scripts/ideas-qa/score.py lighthouse http://127.0.0.1:4432/` → report the scores (target: a11y 100, best ≥ 96, SEO 100).
6. Screenshot `/` at 1440×900 in dark and light at 6 scroll depths (the puppeteer args need `--use-angle=swiftshader --enable-unsafe-swiftshader`)
   into `/tmp/cube-005-*.png`, compare them against the prototype (served at `/drafts/finalists/cube.html`), and list any differences.
7. Kill the server.

## STOP conditions
- Any step requires editing `scripts/**`, `.github/**`, `public/publications.json` or `public/img/**`.
- The ported page shows CSP violations that can't be fixed with bundled scripts. (Allowed CSP edits: adding `blob:` to
  `img-src` or a `worker-src 'self' blob:` directive if three.js needs them. Nothing else, and never 'unsafe-eval'.)
- The garden breaks and can't be fixed within scope.
