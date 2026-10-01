# Plan 003: Delete dead game/UI code and make "Play" a real button in the site nav

> **Executor instructions**: Follow this plan step by step. Run every verification command. If anything in
> "STOP conditions" occurs, stop and report. Do NOT commit and do NOT push.
>
> **Drift check (run first)**: `git diff --stat a43de13 -- src/components src/styles/game-pixel.css src/data/game-world.ts`

## Status
- **Priority**: P2 · **Effort**: S · **Risk**: LOW
- **Depends on**: none (it can run before or after 001/002)
- **Category**: tech-debt + direction
- **Planned at**: commit `a43de13`, 2026-09-30

## Why this matters
About 700 lines of code are never imported: an abandoned in-React game (the real game lives as static files
in `public/play/`) and five shadcn components that nothing uses. Dead code misleads future edits and slows
reviews. Separately, the owner wants his game, Ledger Run (at `/play/`), reachable through a visible
"Play" button. Today it's a dim text link in `src/components/site/SiteNav.tsx`.

## Current state
- Unused files (verified with grep at `a43de13`: no imports outside their own folders):
  `src/components/game/ResumeQuest.tsx`, `src/components/game/index.ts`, `src/styles/game-pixel.css`,
  `src/data/game-world.ts`, `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`,
  `src/components/ui/separator.tsx`, `src/components/ui/switch.tsx`, `src/components/ui/tooltip.tsx`.
- **Still used, keep:** `src/components/ui/button.tsx`, `src/components/ui/sheet.tsx`.
- `src/components/site/SiteNav.tsx` (excerpt), with the desktop Play link:
```tsx
/** Secondary experiment — kept out of the primary section anchors. */
const playLink = { href: '/play/', label: 'Play' };
...
          <a
            href={playLink.href}
            className="font-mono text-xs text-muted-foreground/70 uppercase transition-colors hover:text-foreground"
            title="Ledger Run — experimental platformer resume"
          >
            {playLink.label}
          </a>
```
  and there's a similar anchor inside the mobile `<SheetContent>`. Buttons elsewhere in the same file use
  `<Button asChild size="sm" className="hidden rounded-none sm:inline-flex"><a href="/#contact">Contact</a></Button>`.

## Commands
| Purpose | Command | Expected |
|---|---|---|
| Build (gate) | `bun run build` | exit 0 |
| Dead-reference check | `grep -rn "components/game\|game-world\|game-pixel\|ui/badge\|ui/card\|ui/separator\|ui/switch\|ui/tooltip" src` | no output |

## Scope
**In scope**: delete the 9 files listed above; edit `src/components/site/SiteNav.tsx`.
**Out of scope**: `public/play/**` (the real game; never touch it), `button.tsx`, `sheet.tsx`, and every other nav item.

## Steps
### Step 1: Delete the dead files
`git rm` the 9 files. If `src/components/game/` is empty afterwards, it disappears with them.
**Verify**: the dead-reference grep → no output; `bun run build` → exit 0.

### Step 2: The Play button
In `SiteNav.tsx`, render the desktop Play link as
`<Button asChild size="sm" variant="outline" className="rounded-none"><a href="/play/" aria-label="Play Ledger Run, my CV as a platformer">▶ Play</a></Button>`,
placed right before the theme toggle. In the mobile sheet, make the Play link the same `Button` (full width) at the
top of the list. Remove the now-unused `title` attribute and keep `playLink` as the single source of the href.
**Verify**: `bun run build` → exit 0; `grep -c 'aria-label="Play Ledger Run' build/index.html` → `1` or more.

## Done criteria
- [ ] The 9 files are gone; the dead-reference grep returns nothing
- [ ] `bun run build` exits 0
- [ ] The built homepage contains the Play button with its aria-label
- [ ] `git status` shows only the deletions and `SiteNav.tsx`

## STOP conditions
- Any of the 9 files is imported somewhere (grep finds a reference): report it, don't delete.
- The build fails after deletion.

## Maintenance notes
When the homepage is rebuilt from the chosen finalist, the finalist's own Play button replaces this nav. Keep the
same aria-label wording for consistency.
