# Plan 009: Bring /play/'s text in line with the site, fix the thesis error, and update the QA scripts

> **Executor instructions**: Work ONLY in the worktree the orchestrator gives you (never the main checkout: another
> session commits there). Follow the steps and run every check. Make each text replacement with a small node or
> python script that asserts the exact number of matches before writing. On any STOP condition, stop and report.
> Do NOT commit and do NOT push.
>
> **Drift check (run first)**: `git diff --stat 45c02a5 -- public/play/index.html scripts/ideas-qa/axe.cjs scripts/ideas-qa/contrast.cjs`
> must print nothing.

## Status
- **Priority**: P2 · **Effort**: S · **Risk**: LOW-MED (one visible text change inside the game engine page)
- **Depends on**: 008 (DONE)
- **Category**: SEO text + factual fix + QA tooling
- **Planned at**: commit `45c02a5`, 2026-10-03

## Why this matters
1. **/play/ still says "Blockchain developer and researcher".** It's in the title, the meta, Open Graph and Twitter
   descriptions, the JSON-LD and two hidden summaries. The rest of the site now says "Software Engineer → Agentic
   Software Engineer". Search engines and LLMs reading /play/ get the old positioning.
2. **The MSc thesis is wrong in three places on /play/**, one of them visible in the game (the education plate,
   line 816). It says "graph embeddings for blockchain fraud detection". The AUTH repository record (DOI
   10.26262/heal.auth.ir.338875) gives **"Graph Embedding and Node Features for Drug-Target Interaction Prediction"**,
   and `scripts/ideas-qa/profile-facts.md` flags this exact error.
3. **The QA scripts still test the removed Easy read mode.** `d6dca22` removed `?read=easy`.
   - `axe.cjs` runs every page twice, the second time with an ignored `?read=easy`, and doesn't cover the new post.
   - `contrast.cjs` checked 7:1 (AAA) *in Easy read*. Run today on normal pages, it reports 64–66 tokens below 7:1 on
     the homepage, plus false 1.07:1 readings on the garden nav pills (it ignores background images).
   - The baseline axe run (12 real combinations at commit `45c02a5`) finds **0 violations**, so AA contrast already passes.

## Decision for the owner (default chosen; say if you want the other)
- **Default: delete `contrast.cjs`.** Its job (AAA in Easy read) no longer exists, and axe enforces AA correctly.
- Alternative: keep AAA (7:1) as a site-wide target. That's a design change: about 65 homepage tokens, including the
  deliberately dimmed heading halves at 5.25:1, would need to get brighter. It would be a separate plan.

## Touchpoints
| File | Change |
|---|---|
| `public/play/index.html` | text-only replacements (table below); delete 4 non-standard meta tags |
| `scripts/ideas-qa/axe.cjs` | drop the Easy read loop; add `/garden/built-by-agents/` |
| `scripts/ideas-qa/contrast.cjs` | delete (default decision) |

## Public Contracts
- /play/ URL, canonical, ids, classes and scripts are unchanged. Only text content and meta values change.
- The QA script CLIs stay the same (`node axe.cjs [baseURL]`).

## Blast Radius
- `public/play/index.html` is read by the minified engine (`dist/state.min.js`) through element ids. **Change no tag,
  id, class or attribute name. Change only the strings below.** The game font (frankfurter) may lack an en dash,
  so visible text uses an ASCII hyphen.
- The visible plate text gets 8 characters longer. It could wrap onto one more line inside `.edu-body`
  (`dist/thessaloniki-buildings.css:134`, 15px, width 92%). Step 4 checks this visually.

## Constants
- `TITLE` = `Ledger Run: George Michoulis's CV as a platformer` (49 chars)
- `DESC` = `Play George Michoulis's CV as a platformer. Software engineer in Thessaloniki, Greece, moving into agentic software engineering.` (128 chars)
- `DEF` = `George Michoulis is a software engineer based in Thessaloniki, Greece, moving into agentic software engineering. He builds full-stack and Web3 products and has published research on blockchain systems.`
  (the same sentence as `about.def` in `src/data/profile.ts`, so the entity description matches everywhere)

## Steps

### Step 1: Positioning text in `<head>` (expected match counts in brackets; anything else means STOP)
| Old | New |
|---|---|
| `<title>George Michoulis \| Blockchain · Full-Stack · Research, Thessaloniki</title>` [1] | `<title>` + TITLE + `</title>` |
| `George Michoulis — Blockchain · Full-Stack · Research, Thessaloniki` [2: og:title, twitter:title] | TITLE |
| `George Michoulis \| Blockchain · Full-Stack · Research, Thessaloniki` (literal backslash-u in the JSON-LD) [1] | TITLE |
| `Blockchain developer and researcher based in Thessaloniki. Smart contracts, graph-based ML, and full-stack Web3 systems. Interactive resume of George Michoulis.` [5] | DESC |
| the whole `<meta name=keywords …>`, `<meta name=subject …>`, `<meta name=classification …>`, `<meta name=category …>` lines [1 each] | delete the line (Google ignores these; they only repeat the old positioning) |

### Step 2: Hidden summaries and the hidden h1
| Old | New |
|---|---|
| `George Michoulis is a blockchain developer and researcher based in Thessaloniki · Remote. Smart contracts, graph-based ML, and full-stack Web3 systems.` [1, line 105] | DEF |
| `George Michoulis is a Thessaloniki-based blockchain developer and researcher. Smart contracts, graph-based ML, and full-stack Web3 systems.` [1, line 280] | DEF |
| `George Michoulis — Blockchain Developer, Full-Stack, Web3, Graph ML, Research, Thessaloniki` [1, hidden h1 line 126] | `George Michoulis: Software Engineer → Agentic Software Engineer, Thessaloniki. Ledger Run, his CV as a platformer.` |

### Step 3: Thesis fix
| Old | New |
|---|---|
| `graph-embedding methods for blockchain fraud detection` [2, lines 106 and 280] | `graph embeddings for drug-target interaction prediction` |
| `Graph embeddings for blockchain fraud detection.` [1, line 816, VISIBLE in game] | `Graph embeddings for drug-target interaction prediction.` |

Leave line 354 ("Research: … blockchain fraud detection …", an interests list) unchanged. Whether that was separate
work is an open question for the owner (profile-facts.md marks it unverified).

### Step 4: Check the education plate in the game
Build, serve `build/` on a free port (e.g. 4405), and walk the level with a copy of `scripts/play-qa/loop.mjs`
(untracked, main checkout only). Copy it to /tmp and change its hard-coded `http://localhost:4321/play/` to your port.
Run `node /tmp/loop.mjs <outdir> 1000 600` and find the frames where the EDUCATION station is on screen.
**Pass**: the MSc plate shows the full new sentence, nothing overlaps the BSc block below it, and the JSON summary shows
`errors: []`. Send the frame path(s). If the plate overflows, STOP and report with the frame. Don't change any CSS.

### Step 5: QA scripts
- `axe.cjs`: remove `READS` and its loop, and drop `read` from the result objects. Set
  `URLS = ['/', '/garden/', '/garden/one-stroke/', '/garden/built-by-agents/']`. Update the header comment
  (4 URLs × {light,dark} × {1440,390} = 16 combinations).
- `git rm scripts/ideas-qa/contrast.cjs` (default decision).
- `grep -rn "contrast.cjs\|read=easy" scripts src` must print nothing. Leave the historical mentions in `plans/001–007` alone.

## Verification Evidence
After `bun run build` (exit 0):
1. `grep -ci "blockchain developer and researcher" build/play/index.html` → 0
2. `grep -c "fraud detection" build/play/index.html` → 1 (only the line-354 interests list)
3. `grep -c "drug-target interaction prediction" build/play/index.html` → 3
4. A node check: every JSON-LD block in `build/play/index.html` passes `JSON.parse`; `<title>` = TITLE; the meta description = DESC.
5. `git diff --word-diff public/play/index.html` shows only the strings above changed and the 4 meta lines deleted.
6. `node scripts/ideas-qa/page-check.cjs http://localhost:<port>/play/` → ok:true, desktop and mobile.
7. `node scripts/ideas-qa/axe.cjs http://localhost:<port>` → 16 combinations, seriousOrCritical 0, exit 0.
8. The Step 4 plate frame(s).

## STOP conditions
- The drift check prints anything; any replacement count differs from its bracket.
- A replacement would touch a tag, id, class or attribute name.
- The plate overflows, or loop.mjs reports errors.

## Out of scope
- AAA contrast site-wide (see Decision).
- The line-354 research-interests wording (owner question).
- In-game role plates: the Sidroco and Cyberscope entries are correct as they are.

## Resume and Execution Handoff
- Execute anchor: `plans/009-play-text-and-qa-scripts.md`.
- The orchestrator creates a worktree on branch `plan-009` from master with `node_modules` symlinked, and dispatches
  `pi-delegate` there (`--provider deepseek --model deepseek-v4-pro`). It reviews the diff, reruns the checks,
  checks the plate frame visually, then moves the commit onto master (cherry-pick, files staged by name) and asks before pushing.

## Outcome (2026-10-03)
**DONE**, with the default decision (`contrast.cjs` deleted).
- **Checks.** The build passes. In the built `/play/` page: "blockchain developer and researcher" appears 0 times,
  "fraud detection" once (the line-354 interests list, kept on purpose), "drug-target interaction prediction" 3 times.
  JSON-LD parses; the title and the 128-character description match the Constants.
- **The game.** A headless walk (holding the right arrow) to the EDUCATION station shows the full new sentence on two
  lines. The text container has 0px of overflow, there's no overlap with the BSc block, and no console errors were logged.
- **QA scripts.** `page-check.cjs` is OK on `/play/` and `/`. `axe.cjs` ran 16 combinations with 0 violations.
- **Process.** Pi ran in a separate worktree (branch `plan-009`). Its relay hit the orchestrator's 10-minute
  background limit during Step 4, so the orchestrator finished Step 4 and the checks. Next time, give the relay a
  longer `timeout` (the Bash tool caps a background command at 10 min, so run it with `nohup` and wait for `result.json`).
- **Still open.** Is "blockchain fraud detection" on line 354 of /play/ separate real work? That's the owner's call.
