# Plan 015: One readable body font across the site

> **Executor**: Claude, working directly. Worktree `.claude/worktrees/type`, branch `fix/readable-type` from master `b54a44e`.
> George approved "PLAN with your recommendations and execute". Ship only on an explicit "yes".

## Status
- **Priority**: P2 · **Effort**: S · **Risk**: LOW · **Planned at**: 2026-10-13
- **State**: DONE, shipped 2026-10-13 (George: "y")

## Why
The audience includes readers with dyslexia and short attention spans. Fonts made specifically for dyslexia don't measurably
help (Wery & Diliberto 2017; Kuster et al. 2018). What helps is a plain sans-serif with distinct letters, enough size and
extra spacing (Rello & Baeza-Yates 2013; Zorzi et al. 2012). The homepage already uses Atkinson Hyperlegible Next, but the blog
body text is still in Source Sans 3, which is narrower and less distinct (rn/m, I/l). INNOVATE contact sheet: `shots-015/`.

## Findings that trimmed the INNOVATE set
- **Small text**: already handled. `home.css:274-285` sets body to 17px, cards and Activities to 16px and metadata to 14–15px.
  The mono dates stay small on purpose (one line). No change.
- **Heading spacing, Lexend, reader mode**: rejected in INNOVATE.
- **The blog**: no Greek text (Source Sans was loaded with `greek`), no italics, weights 400/600 only, so Atkinson
  (latin, latin-ext; 400–700) covers it.

## Changes
1. `src/styles/garden.css:31`: `--z-font-body: var(--font-atkinson), …` (was `--font-source-sans`).
2. `src/layouts/GardenLayout.astro`: load `--font-atkinson` in place of `--font-source-sans`. Keep the hand-picked single
   latin woff2 preload (the same reasoning applies: one file, not all of them), just pointed at Atkinson.
3. `astro.config.mjs`: remove the Source Sans 3 entry. Move its `display: 'optional'` + CLS comment to the Atkinson entry
   (the homepage preloads Atkinson too, so optional costs nothing there).
4. `src/components/home/Nav.astro:54`: drop the `--font-source-sans` fallback from `--ui`.
5. Slight letter spacing on running text: `letter-spacing:.01em` on `body` in `home.css:277` and on the garden body
   (`garden.css:43`). Word spacing on the homepage is already .04em. Add the same to the garden.

## Verification
- `astro build` passes, and `grep -ri "source sans" build/` is empty.
- Before/after contact sheet: one blog post, the blog index and the homepage, mobile and desktop, light and dark.
- CLS on a post: Chrome PerformanceObserver layout-shift total < 0.1 with cache disabled.
- No horizontal overflow at 390 px.
