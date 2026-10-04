# Plan 011: Light mode becomes a calm Aegean shore (no blocks)

> **Executor**: Claude, directly. It's a port of the approved prototype, and every step needs visual judgement, which pi can't give.
> Worktree `.claude/worktrees/light-shore`, branch `feat/light-shore` from master `cdf1c8f`. Don't commit to master or push
> until George approves the result.

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: MED (legibility over moving water; GPU cost) · **Category**: visual
- **Planned at**: 2026-10-04 · **State**: DONE, shipped 2026-10-04 (George: "after finishing shut down pc").

## Why
George rejected the light mode as "out of place, the blocks look shit". After three INNOVATE rounds he approved the
calm "Shallows + olives" prototype (scratchpad `light2/`: `dir-SO.js`, `lx.js`, `olive.js`, `theme2.css`). Brief: Aegean
sun and sea, red + yellow, no RGB highlight, 60-30-10, texts unchanged, dark mode untouched. The theme switch plays a veil
only when the toggle is clicked. He found the busy version overwhelming, so effects stay out from behind body text.

## Goal (light mode only)
1. **No cube**: in light the cube scene neither loads nor draws. three.js loads only when the page is (or becomes) dark.
2. **Shore stage** (`#shore`, WebGL 1, one fullscreen triangle). It draws sand everywhere, plus Voronoi-edge caustics and a
   turquoise wash around the four `[data-stage]` slots:
   - hero and Contact: full strength, each with a golden sun glint broken by the ripples;
   - Skills tile and Research: a faint wash (k .45) and no sun.
   The caustics and glints vanish inside the olive shade, using the shade canvas as a texture. Motion runs at 0.3×.
   The plain middle of the page stays still.
3. **Olive shade** (two canvas-2D layers, half resolution, CSS blur, `mix-blend-mode:multiply`, z 15). Three branches in
   the corners. They're visible only while the hero or Contact is on screen (`--olv`).
4. **Tokens (60 / 30 / 10)**:
   - 60 water-white sand (`#faf6ee`);
   - 30 turquoise water + blue olive shade, with teal type (`#0a2a33` / `#0c6f7e`);
   - 10 sun gold `#e9a62a` + coral `#c2401f`.
   - No RGB in light: solid coral primary button, sun-gradient accent (`--acc`), soft turquoise card shadows, slot borders
     hidden, a sun glyph on the toggle. `theme-color` becomes `#faf6ee`.
5. **Veil** on toggle click (every page, the blog too):
   - to light: a sand veil falls, a sun rises on it, then the page opens from the sun's centre;
   - to dark: a night veil rises, the sun sets, then the veil lifts.
   - Web Animations only. Reduced motion switches instantly. It never plays on load or on an OS theme change.
6. **Delete the cube's light-studio code** (now unreachable): `envL`, the `uLight` branches, the light BG, and the bloom,
   beam and dust toggles in `relight`.

## Touchpoints
- `src/scripts/home/shore.ts` (new): shore shader, olive shade, slot tracking, pause/resume.
- `src/scripts/home/main.ts`: stage loader only. It loads `scene` or `shore` per theme, on `gm-theme` too.
- `src/scripts/home/scene.ts`: delete the light branch; skip drawing while light.
- `src/scripts/home/nav.ts`: the veil, and the light `theme-color`.
- `src/components/home/Nav.astro`: the light tokens and the veil CSS (global, since the header is on every page).
- `src/styles/home.css`: light-only overrides (button, chain, card shadows, slots, toggle glyph, canvases).
- `src/pages/index.astro`: `<canvas id="shore">`.
- `scripts/ideas-qa/legibility.cjs`: restored from plan 007's branch to measure contrast against real pixels.

## Public contracts
- `gm-theme` localStorage key and `gm-theme` event: unchanged.
- `[data-stage]` anchors: unchanged, now read by both stages.
- CSP: no inline scripts are added. Modules are bundled; canvas and WebGL need no directive.

## Blast radius
- **Homepage, light**: new look.
- **Homepage, dark**: the cube must render as before (shader edit) and must keep the same frame under reduced motion.
- **Blog**: new light tokens on the Back pill and the toggle, plus the veil.
- `/play/` and the dark palette: untouched.

## Verification evidence (required)
- `bun run build` passes and `tsc --noEmit` is clean.
- `page-check.cjs`: 0 console errors and 0 CSP violations, desktop and mobile, home and blog.
- `legibility.cjs THEME=light` passes on the homepage (desktop and 390px). `THEME=dark` passes as before.
- Dark-mode regression: compare reduced-motion screenshots of the hero before and after.
- axe: 0 violations, light and dark.
- Frames: the light page scrolled top to bottom, the veil in both directions, and a 390px pass, all sent to George.
- Perf: no draw when the tab is hidden; the shore skips frames when no slot and no shade is on screen.

## Resume and execution handoff
- Anchor: this file.
- Prototype source of truth: the scratchpad `light2/` files. If it has been wiped, the values above and memory
  `home-redesign-2026-09` are enough to rebuild.
- After George approves, merge into master (which deploys live). Never add a Claude co-author line.

## Execution report (2026-10-04)
- Built as planned, plus one addition: on phones (≤860px) the Skills and Research slots fold away in light, because there
  they were only empty water. Also removed tokens nothing used (`--link`, `--ft`, `--fl`, `--fr`, `--beam`) and the
  unreferenced `#edge`/`#beam` SVG gradients.
- **Checks:**
  - `tsc` is clean and the build passes.
  - `page-check`: home and blog (2 posts), desktop and mobile, 0 errors, 0 CSP violations, no overflow.
  - axe: 0 violations in 16 combinations.
  - Legibility (light, 1440 and 390): 0 failures caused by the stage.
  - Dark: the legibility results are identical to master, including 5 failures from the cube that were already there (the hero note and
    footer over the beam).
  - Dark reduced-motion frames match master: Contact is pixel-identical, the hero differs only by the random dust.
  - The veil works in both directions on the homepage and the blog, and leaves nothing behind.
- In light, three.js is no longer downloaded until the visitor switches to dark.
