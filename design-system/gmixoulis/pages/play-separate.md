# `/play` — separate experiment

**Status:** out of scope for the main portfolio design system.  
**Route:** `/play` (pixel / game experiment — existing or planned).

---

## Rule

The main site (`/`, and any pages governed by [`../MASTER.md`](../MASTER.md)) and `/play` are **different visual systems**.

| Surface | System |
|---------|--------|
| Portfolio home + dossier chapters | Soft ink × projection room × Neo-Tokyo lite + Japanese garden ma |
| `/play` | Its own experiment (pixel, game UI, playful chrome—as needed) |

**Do not leak** `/play` aesthetics into the main system:

- Pixel fonts, CRT scanlines, game HUDs, joystick chrome  
- Arcade color blocks, scoreboards, “press start” motifs  
- Shared component theming that forces vermilion garden tokens onto the game—or game tokens onto the portfolio  

**Do not leak** main-system constraints into `/play` as a hard requirement (e.g. forcing garden grayscale on a playful experiment), except for shared baseline a11y (focus, reduced motion where applicable).

---

## Shared infrastructure (allowed)

- Same repo / deploy host  
- Shared layout shell **only if** chrome is neutral and does not import portfolio ink/brush/rail language into the game canvas  
- Link from portfolio → `/play` as a quiet text link (“Play” / experiment) if desired—never a hero feature that rebrands the first viewport as a game

---

## PLAN / EXECUTE reminder

When implementing the fused portfolio redesign, treat `/play` as untouched unless a separate plan owns it. Visual QA of the main redesign must fail if pixel-game styling appears on `/`.
