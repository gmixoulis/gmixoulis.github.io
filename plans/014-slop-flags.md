# Plan 014: Clear the four slop-checker flags on the homepage

> **Executor**: Claude, working directly (the change is small and needs visual judgement). Worktree `.claude/worktrees/slop`,
> branch `fix/slop-flags` from master `f95f11c`. Ship only on George's explicit "yes".

## Status
- **Priority**: P3 · **Effort**: S · **Risk**: LOW · **Planned at**: 2026-10-12
- **State**: DONE, shipped 2026-10-13 (George: "yes ship")

## Why
A slop checker scored the homepage at 29%, based on Geist, the theme toggle's aria-label, 8 Lucide icons and "↗".
#3 and #4 already break MASTER.md:227 (sparse icons, "not decorative rows"). #1 and #2 are cheap to fix. The score itself is not the goal.

## Changes

### 1. Drop Geist and use Atkinson for UI, IBM Plex Mono for mono
- `astro.config.mjs:137-140`: remove both Geist entries. Add
  `{ provider: fontProviders.google(), name: 'IBM Plex Mono', cssVariable: '--font-plex-mono', weights: [400, 500], styles: ['normal'], subsets: ['latin', 'latin-ext'] }`.
- `astro.config.mjs` Atkinson entry: change weights `[400, 700]` → `[400, 500, 600, 700]`. The UI uses 500/600 (`.pill`, `.btn`, `.paper h3`).
- Fix the stale comment at `astro.config.mjs:134` ("UI keep … Geist").
- `src/components/home/Nav.astro:54`: `--ui:var(--font-atkinson,var(--font-source-sans,sans-serif))`,
  `--mono:var(--font-plex-mono,monospace)`.
- `src/pages/index.astro:116-117`: remove the two Geist `<Font>` tags and add `<Font cssVariable="--font-plex-mono" />`.
  The Atkinson preload (line 118) stays and now covers the UI as well.
- `src/styles/home.css:287` (`body{font-family:var(--font-atkinson,var(--ui))}`) is now redundant. Delete it.
- The garden pages are unaffected: they don't load Geist and already fall back to Source Sans.
- **Gate before shipping**: a contact sheet of before/after screenshots (nav pills, hero buttons, papers list with mono
  dates, contact block), light and dark, at desktop and 390 px. George approves the look before anything is pushed.

### 2. Toggle label names the scene
- `src/scripts/home/nav.ts:25`: `aria-label` → `next === 'dark' ? 'Turn to night' : 'Turn to day'`.
- `src/components/home/Nav.astro:21,33`: initial `aria-label="Switch to light theme"` → `"Turn to day"`.
- The visible text ("Light"/"Dark") stays the same.

### 3. Remove the Activities icon row
- `src/components/home/Activities.astro`: delete the lucide import, the `icons` map and the `<span class="ic">` element. Leave
  the `glyph` field in `@/data/profile` (harmless) or remove it if nothing else reads it (grep first).
- `src/styles/home.css:330` `.act .ic{…}`: delete. Line 331 `.act h3{margin:14px 0 4px}` existed for the icon. Remove it so
  the base rule (`margin:40px 0 4px`, line 194, and the mobile rule at 260) applies, then check the cards don't open with a big
  empty top. If they do, set the h3 top margin to 0.
- `package.json`: `npm uninstall @lucide/astro` (the only user).

### 4. Remove the "↗" character, keep the cue in CSS
- Delete the `↗` from `LinkedIn.astro:10,18`, `Contact.astro:11` and `Research.astro:18`, including the empty
  `<span aria-hidden>` wrappers.
- `src/styles/home.css`: add one rule, `#main a[target=_blank]:not(.btn)::after{content:'\2197';margin-left:.25em}`. CSS
  generated content isn't in the markup the scanner reads, and the rule covers future links too. Exclude buttons/pills
  if it looks wrong on them (check the LinkedIn pill).

## Verification
1. `astro build` passes with no Geist or Lucide in `dist/` (`grep -ri "geist\|lucide" dist/index.html` is empty).
2. Headless Chrome (puppeteer-core) screenshots for the contact sheet (see the gate in §1): no layout shift, no overflow at 390 px.
3. Theme button: click it and confirm the aria-label flips between "Turn to night" and "Turn to day" and the turn animation still runs.
4. External links still show the arrow, and the Activities cards read cleanly without icons.
5. Optional: re-run the slop checker on a preview to confirm the four flags are gone.

## Out of scope
- `public/drafts/**` still mention Geist. These are archived pitch drafts, noindexed. Leave them.
- `src/styles/global.css` Plex Sans tokens (garden/shadcn base) are unchanged.
