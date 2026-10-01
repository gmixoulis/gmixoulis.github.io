# Plan 006: "Easy read" mode (dyslexia, ADHD, short attention) and new soft skills

> **Executor instructions**: Follow this plan step by step and run every verification. If a STOP condition hits, stop
> and report. Do NOT commit or push.
> **Drift check (run first)**: `git status --porcelain src` must print nothing, and `git log -1 --format=%h` must be 3564abc
> or a descendant of it.

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: LOW-MED · **Depends on**: 005 (live) · **Category**: accessibility/content
- **Planned at**: 2026-10-02

## Why
George wants the site to work for dyslexic readers, people with ADHD and people with little time. It must also be
accessible. He asked for these soft skills instead of the current ones: leadership, ownership, critical thinking and similar.

## Design decisions (fixed; don't re-decide them)
- **A toggle, not a second site.** One URL and one set of content (SEO-safe). The default design stays as it is.
  "Easy read" is an opt-in mode that persists and also works on the garden.
- The guidance followed: the British Dyslexia Association style guide, W3C COGA ("Making content usable for people
  with cognitive and learning disabilities"), and WCAG 2.2 SC 1.4.8, 1.4.12, 2.2.2 and 2.3.3.

## Scope
**In scope**: `src/components/home/*.astro`, `src/data/profile.ts`, `src/scripts/home/nav.ts`, `src/scripts/home/main.ts`
(reveals and smooth scroll only), `src/styles/home.css`, `src/styles/easy-read.css` (new), `src/layouts/BaseLayout.astro`,
`src/layouts/GardenLayout.astro` (only to import the CSS), `astro.config.mjs` (`fonts` entry only), `package.json`/`bun.lock`
(the `axe-core` devDependency only), `scripts/ideas-qa/axe.cjs` (new).
**Out of scope (do NOT modify)**: `src/scripts/home/scene.ts` (another plan is changing it in parallel), `scripts/*.js`,
`.github/**`, `public/**`, `plans/**`.

## Steps

### Step 1: Replace the soft skills (content only; the bento layout stays)
In `src/data/profile.ts` `skills`: set the heading to `['How I work,', 'with proof for each.']` and replace the items with
exactly these 7. Keep the existing `area` grid mechanics: 7 cells plus the stage tile, as today.
Use this text verbatim. It is verified against `scripts/ideas-qa/profile-facts.md`; do not add claims.
1. **Leadership**: "I led the blockchain work at Sidroco, including an NFT marketplace for 5G networks, and the frontend work on large apps at the University of Nicosia, where I ran the agile sprints."
2. **Ownership**: "At Cyberscope I take products from the smart contract to the frontend and the Node services. VerDe went from my BSc thesis to a live system at verde.uom.gr."
3. **Critical thinking**: "I build audit workflows and security tooling for smart contracts, and as first author I benchmarked blockchain platforms for agricultural use."
4. **Communication**: "I taught three modules at the University of Derby and Mediterranean College, gave two flash talks at GEC'22 and presented EU project work at workshops."
5. **Collaboration**: "I contributed to Horizon Europe, MSCA and KA2 proposals that secured EU funding, and co-authored the NANCY D3.3 deliverable with partners across Europe."
6. **Problem solving**: "3rd place at the Infinitech hackathon in 2022, and 1st place in the University of Macedonia's Basic Research Awards for the VerDe dApp."
7. **Mentoring**: "I assessed students through oral exams, projects and personal feedback, so every student had a fair way to show what they had learned."
Also update any JSON-LD `knowsAbout`/skills list that mirrors the old soft-skill names, if there is one.

### Step 2: The toggle
- Add an "Easy read" button to `Nav.astro` next to the theme toggle: `<button type="button" aria-pressed>` with the visible
  text "Easy read", the same pill style, and an icon that is `aria-hidden`.
- Storage key `gm-read` with value `easy` or absent. Accept only `easy`; ignore anything else. Wrap storage in try/catch.
- BaseLayout's inline bootstrap, which already sets the theme, must also set `html[data-read="easy"]` before first paint
  (no flash). Also support `?read=easy` (sets and stores it) and `?read=off`.
- `nav.ts` toggles the attribute, aria-pressed and storage, and dispatches `document.dispatchEvent(new CustomEvent('gm:read'))`.
  The scene plan listens for that event, so don't touch scene.ts.

### Step 3: Easy read styles (`src/styles/easy-read.css`, imported by BaseLayout so garden pages get it too)
Everything is scoped under `html[data-read="easy"]`:
- **Font:** Atkinson Hyperlegible Next via the Astro fonts API (Google provider, `subsets: ['latin','latin-ext']`, weights
  400 and 700, NOT preloaded, so it's downloaded only when the mode is on). If the Google provider doesn't have
  "Atkinson Hyperlegible Next", use "Atkinson Hyperlegible" and report it. Body ≥ 19px, `line-height: 1.7`,
  `letter-spacing: .035em`, `word-spacing: .12em`, paragraph spacing ≥ 1.4em, `max-width: 64ch` for running text,
  `text-align: left` (never justify), no italics (`font-style: normal`), no `text-transform: uppercase`, no weights below 400.
  Headings bold, sized for clear hierarchy.
- **Colour:** light = background `#FAF6EC` (cream) with text `#1E2126`; dark = background `#1C1D21` with text `#E9E6DF`.
  Every text pair must be ≥ 7:1 (AAA). Links underlined (`text-underline-offset: .2em`), focus ring ≥ 3px.
- **No motion:** hide the WebGL canvas (`display:none`) and any decorative animation, make every `[data-rv]` reveal
  visible immediately, turn off Lenis smooth scroll (destroy it on toggle, recreate it when the mode is turned off),
  and set `scroll-behavior: auto`.
- **Simpler layout:**
  - One column; the bento becomes a list.
  - The certificate rail becomes a plain list: a "34 certificates" line, then each title as a link.
  - Projects become a list of name, short line and link.
  - Activity glyphs are hidden; their text stays.
  - The LinkedIn iframe is replaced by a "My LinkedIn posts →" link.
  - Decorative elements (kanji, petals, ink art on garden pages, chain glyphs) are hidden.
- **Garden:** `.z-prose` and the garden lists get the same font, size and spacing rules.

### Step 4: Help for short attention, shown in easy read mode only
- **"In 30 seconds" block**, right after the hero, `hidden` unless easy read is on. Five lines, with counts from the existing
  build-time data:
  "Now: Web3 full-stack developer at Cyberscope by TAC (since May 2026)." /
  "I build smart contracts, on-chain integrations and React/Next.js frontends." /
  "I research blockchain for credentials, governance and 5G networks: {N} papers, {total} citations." /
  "Based in Thessaloniki, Greece; I work remotely." / "Email me: gmixoulis@gmail.com".
- **"In short" line** under each section's h2 (class `tldr`, `hidden` unless easy read is on):
  - about: "Blockchain developer and researcher in Thessaloniki."
  - skills: "Seven ways I work, each with a real example."
  - experience: "Six roles since 2018; now at Cyberscope by TAC."
  - research: "{N} papers and {total} citations; the most cited one verifies degrees on a blockchain."
  - certificates: "{count} certificates, from Cisco networking to Rust."
  - projects: "Websites I built, most of them for universities."
  - activities: "Theatre, languages, hackathons and volunteering."
  - linkedin: "My latest LinkedIn posts."
  - contact: "Email gmixoulis@gmail.com."
  Don't hard-code the counts; compute them from the same data the page uses.
- **Reading progress:** a 3px bar at the top that follows scroll position, shown in BOTH modes. It's `aria-hidden`, has
  no transitions under reduced motion, and is pure CSS if possible (scroll-driven animation with a JS fallback only if needed).

### Step 5: Accessibility checks (both modes)
- `bun add -d axe-core`. Write `scripts/ideas-qa/axe.cjs` (puppeteer-core, the same launch args as `page-check.cjs`):
  inject `node_modules/axe-core/axe.min.js` and run `axe.run` with the tags wcag2a, wcag2aa, wcag21aa, wcag22aa. Print
  violations per URL and mode as JSON. Run it on `/`, `/garden/` and `/garden/one-stroke/` × {light, dark} × {normal, easy}
  (easy via `?read=easy`) × {1440, 390}. **Target: 0 serious or critical violations.**
- **WCAG 1.4.12 check:** with easy read OFF, inject the standard text-spacing CSS (line-height 1.5, paragraph spacing 2em,
  letter-spacing .12em, word-spacing .16em on `*`). Then verify there is no horizontal overflow and no text clipped by
  `overflow:hidden` ancestors. Use a heuristic: for each element with `overflow:hidden` and text, `scrollHeight <= clientHeight + 1`.
  Report offenders and fix them.
- Run `node scripts/ideas-qa/page-check.cjs` on the 3 URLs (0 CSP violations, 0 errors) and `bun run build` (exit 0).
- Contrast: compute the contrast of every easy-read text token pair with a small script; all must be ≥ 7:1.
- `grep -cE '>0 citations|\b0 citations' build/index.html` must be `0`.

## STOP conditions
- A change would need `scene.ts`, `public/**`, the data scripts or the workflows.
- axe shows a serious or critical violation you can't fix within scope.

## Report
Per-step status; files changed; the axe JSON summary per URL/mode; the 1.4.12 result; page-check output; the contrast
table; the font actually used; deviations.
