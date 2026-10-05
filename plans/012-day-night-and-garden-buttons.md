# Plan 012: Day/night theme switch, brushed-ink blog buttons, blog light fixes

> **Executor**: Claude, directly (visual work; previews approved by George on 2026-10-06: "prefer b go").
> Worktree `.claude/worktrees/day-night`, branch `feat/day-night` from master `278ed37`.
> Ship only on an explicit "yes" after he sees the result (memory: ship-needs-explicit-yes).

## Status
- **Priority**: P2 · **Effort**: S–M · **Risk**: LOW · **Category**: visual
- **Planned at**: 2026-10-06 · **State**: DONE on `feat/day-night`, awaiting George's explicit OK to ship

## Goal
1. **Theme switch is a day/night turn (~4 s each way)**, played only on a toggle click:
   - **To dark:** a day veil rises over the page. The sun sets on an arc to the left (reddening) as the sky turns dusk,
     then night, with a warm horizon glow at the turn. Stars appear, the full moon rises on an arc from the right, holds,
     and the page opens from the moon.
   - **To light:** the mirror image. The moon sets left as night turns to dawn, the sun rises from the right, and the
     page opens from the sun.
   - **Sun:** must read as a sun, not an egg yolk. White-hot centre, yellow edge, wide warm glare, slow soft rays.
   - **Moon:** canvas, drawn once. Real maria in roughly their real places, shaded crater bowls, faint ray craters.
     Softer than a white disc.
   - Reduced motion: instant swap, as before.
2. **Blog buttons, option B ("brushed ink")**: the Back link and the theme toggle are real buttons. Each is ink with a
   rough brushed edge (the blog's own `#z-sumi` filter) and a red hanko seal: 家 Home, 庭 Blog, 月 in light (switch to
   dark), 日 in dark. It inverts to paper in dark. The homepage header is unchanged.
3. **Blog light fixes**: `--z-ink-faint` goes to `#737373` in light, so the dates and tags read at 4.75:1 instead of
   3.45:1. Remove the cream strip under the garden. Add 家月日 to the brush-font subset.

## Touchpoints
- `src/scripts/home/veil.ts` (new): the day/night turn.
- `src/scripts/home/nav.ts`: uses it.
- `src/components/home/Nav.astro`: garden markup (seal), button and veil CSS.
- `src/layouts/GardenLayout.astro`: the CJK subset.
- `src/styles/garden.css`: the faint token and the strip.

## Public contracts
- The `gm-theme` key and event are unchanged. No new inline scripts, so CSP is unchanged. The moon canvas never
  leaves the page.

## Verification evidence
- tsc and build pass.
- page-check (home and blog): 0 errors, 0 CSP violations.
- axe: 0 violations.
- Both switches recorded frame by frame, on the homepage and the blog. Reduced-motion swap is instant.
- Button screenshots in light and dark.
- The blog has no strip at the bottom.
