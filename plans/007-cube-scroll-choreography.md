# Plan 007: Keep the cube present through the whole scroll (behind the content)

> **Executor instructions**: Follow the plan. Verify visually, frame by frame. Do NOT commit or push. Report at the end.
> **Drift check**: start from master 3564abc, or a descendant of it.

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: MED (legibility and performance) · **Category**: visual/motion
- **Planned at**: 2026-10-02

## Why
George: "the cubes are not so useful anymore, maybe use them more during the scroll down? from behind etc? because they
are not as it used to be." Today the scene state table `KD` in `src/scripts/home/scene.ts` sets `dim = 0` (the 13th value)
for about, experience, certificates, projects, activities and LinkedIn. The block switches off for six of ten sections and
only shows at the four `[data-stage]` anchors. The round-3 prototype he loved kept the block on screen all the way down,
staged differently per section. Compare with the original: `git show cv-design-ideas:public/drafts/ideas/pro.html > /tmp/pro.html`
(it's untracked on master) and the finalist `public/drafts/finalists/cube.html`. Run `bun install` first in a fresh worktree.

## Goal
The block (and its chain) stays alive the whole way down: it is never fully off between hero and contact, and it reacts
to the scroll itself, not only at section boundaries.
- **Front stagings** (unchanged in spirit): hero (genesis block + chain, centred), skills tile, research (sticky beside the
  papers), contact (final, brightest, chain lit).
- **"Behind" stagings for text-heavy sections**: the block sits BEHIND the content. It is larger, further back, lower in
  brightness and bloom, and offset to the side of the viewport where the section has less text, so it frames the text
  rather than competing with it.
- **Scroll-scrubbed motion inside each section**, not just between sections. Ideas, to be judged by eye:
  - About: the block slowly separates into its 8 cubes ("explode") as you read, then reassembles.
  - Experience: the hash-chain grows. One chain block lights per role as each role crosses the reading line, so six roles = six links.
  - Certificates: the block turns face by face, with the faces catching the light like pages.
  - Projects and activities: it drifts low, far back, at the bottom edge.
  - LinkedIn: it rises toward the contact staging.
  Keep the motion slow, continuous and tied to scroll position (no autoplay loops beyond the existing gentle bob).
- The two-way scroll must look right both downward and upward.

## Hard constraints
1. **Legibility, measured:** body text must keep ≥ 4.5:1 contrast and large text ≥ 3:1 against the actual pixels behind
   it, in BOTH themes. Build a checker (`scripts/ideas-qa/legibility.cjs`, puppeteer-core with the launch args from
   `page-check.cjs` plus `--use-angle=swiftshader --enable-unsafe-swiftshader`):
   1. For each scroll stop, take a screenshot with text hidden (`color: transparent !important` on text elements) and
      one normal.
   2. For each visible text element's box, take the 95th-percentile background luminance (and the 5th, for light text
      on dark).
   3. Compute contrast with the element's computed colour, and report every failure.
   Fix failures by moving or dimming the block, or with a soft local scrim. A visible panel behind the text is fine,
   but don't add opaque panels everywhere.
2. **No new draw cost**: same geometry, same passes. Rendering still pauses when the tab is hidden. The existing "slow
   GPU → lower DPR" adaptation stays.
3. **Easy read mode (from a parallel plan)**: when `html[data-read="easy"]` is set, the scene must not run. Check it at
   init (skip WebGL entirely), and listen for `document` event `gm:read`: stop the RAF loop and release nothing heavy
   when turned on; resume when turned off. That plan hides the canvas with CSS; you own the stopping. You may touch
   only the scene-loading part of `src/scripts/home/main.ts`; another plan edits its reveal and Lenis parts.
4. **Reduced motion**: keep a still, well-placed frame per section (no scrubbing).
5. **Mobile (390px)**: the block stays behind the text but smaller and dimmer, centred or edge-anchored, and must pass
   the legibility checker. If it can't pass on mobile for a section, dim it further there.
6. **Theme**: works in dark (bloom and beam) and light (studio, no bloom).

## Scope
**In scope**: `src/scripts/home/scene.ts`, the scene-loading part of `src/scripts/home/main.ts`, `[data-stage]` anchors
in `src/components/home/*.astro` (add or move anchors only), `src/styles/home.css` (canvas or scrim rules only), and the
new `scripts/ideas-qa/legibility.cjs`.
**Out of scope**: content and copy, `nav.ts`, `easy-read.css`, `profile.ts`, the data scripts, `.github/**`, `public/**`.

## Verification (all required)
1. `bun run build` exits 0.
2. `node scripts/ideas-qa/page-check.cjs` on `/`: 0 CSP violations, 0 errors, no overflow (desktop and mobile).
3. **Frame-by-frame**: scroll from top to bottom in ~60 even steps at 1440×900, in dark and in light, and at 390×844 in
   dark. Wait for the damping to settle at each step. Build contact sheets (6 per row) and LOOK at them: the block must
   be visible in every frame between hero and contact, and the motion should read as one continuous choreography.
   Also do the same scroll upward for desktop dark.
4. The legibility checker passes on every text element at those stops (report the worst 5 contrasts).
5. Easy read: load `/?read=easy` and confirm the scene never initialises (no WebGL context is created). Toggle mode
   off and on via the event and confirm the loop stops and resumes.
6. Reduced motion frames, both themes.
Put screenshots and sheets in
`/private/tmp/claude-501/-Users-gmixoulis-Desktop-my-projects-gmixoulis-github-io/fdd35276-8ec0-4e84-ba4a-b5615ff2a455/scratchpad/p007/`.

## Report (under 400 words)
The new choreography in one line per section; files changed; legibility results (worst 5); the sheet paths;
anything you couldn't make pass; deviations.
