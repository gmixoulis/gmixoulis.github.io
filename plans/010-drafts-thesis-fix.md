# Plan 010: Correct the MSc thesis topic in the design drafts

> **Executor instructions**: Work ONLY in the worktree you are started in (never the main checkout: another
> session commits there). Change text only, in `public/drafts/**` only. On any STOP condition, stop and report.
> Do NOT commit and do NOT push. Do NOT run browsers or the build; the orchestrator does the visual checks.
>
> **Drift check (run first)**: `git diff --stat 02d7f62 -- public/drafts` must print nothing.

## Status
- **Priority**: P2 · **Effort**: M (50 files, 79 lines) · **Risk**: LOW (prototype pages, text only)
- **Depends on**: 009 (DONE) · **Category**: factual fix
- **Planned at**: commit `02d7f62`, 2026-10-03

## Why this matters
Plan 009 fixed the MSc thesis topic on /play/. The same error is live in 50 draft pages under `public/drafts/`
(`2026/`, `current/`, `ideas/`, `japan/`, `scroll-studies/`). They say the MSc was on graph embeddings for
**blockchain fraud detection**. The AUTH repository record (DOI 10.26262/heal.auth.ir.338875) gives
**"Graph Embedding and Node Features for Drug-Target Interaction Prediction"** (2022).
`scripts/ideas-qa/profile-facts.md` records this.

## Scope
- IN: every passage in `public/drafts/**` that states or implies the MSc / master's research was fraud detection.
- OUT (leave exactly as is, owner has not decided whether fraud detection was separate work):
  - `ideas/callouts.html:197` ("graph-based fraud detection" in a general bio line)
  - `ideas/typewindow.html:169` ("graph embeddings that catch fraud on chains" in a general bio line)
- OUT: the old "Blockchain developer and researcher" wording. Do not touch it.
- OUT: everything outside `public/drafts/`.

## Rules
1. Find the lines with `git grep -n -i fraud -- public/drafts` (79 lines in 50 files at `02d7f62`).
2. Rewrite only the words that carry the claim. Keep each page's voice, tense, person and sentence shape.
   Example: `Graph-embedding methods for detecting fraud on blockchains, funded by a DeepMind scholarship.`
   becomes `Graph-embedding methods for drug-target interaction prediction, funded by a DeepMind scholarship.`
   Example: `used graph embeddings to detect fraud on blockchains` becomes
   `used graph embeddings to predict drug-target interactions`.
3. Change no tag, id, class, attribute name, coordinate or script logic. String contents only (this includes
   strings inside JS arrays/objects and `data-*`/`aria-*` attribute values that hold the claim).
4. Keep each file's existing dash style: if the file already writes `drug–target` (en dash), use the en dash;
   otherwise write `drug-target` with an ASCII hyphen.
5. Where a page lists fraud detection AND drug-target prediction as two separate things, merge them into one
   true statement instead of repeating "drug-target" twice. The MSc thesis and the 2022 paper are the same
   line of work: the thesis led to the paper.
6. Remove follow-on sentences that only made sense for the blockchain claim, or rewrite them to fit.

## Special cases
| File | What to do |
|---|---|
| `ideas/graph.html` | Keep the node key `fraudT` and the ids `n-fraudT`, edge `auth-fraudT` (engine references them). Change only labels/text: node label `fraud detection` → `drug discovery`; its description → `The problem my MSc applied graph embeddings to.`; line 159 span text → `for <span class="t" id="n-fraudT">drug-target interaction prediction</span>` (drop the word "blockchain"); line 173 and the `auth` node description → drug-target interaction prediction. |
| `ideas/preprint.html` | Lines 210 and 253 (SVG): `Blockchain fraud detection` → `Drug–target prediction` (must not be longer than the old string); leave `graph embeddings, MSc thesis`. Lines 180, 189, 276, 302: the MSc thesis is on drug–target interaction prediction and led to paper [7]; do not describe two separate works. Keep the `[7]` reference link. |
| `ideas/sentence.html` | Line 120 phrase `research fraud on graphs` → `research graph embeddings` (keep the span and `data-k`). Line 121: research was on graph embeddings for drug–target interaction prediction, which also became a paper. |
| `ideas/syllabus.html`, `ideas/whos-asking.html`, `ideas/inline3d.html` | Rule 5: merge into one statement. |
| `ideas/magazine.html:206` | Also rewrite the next sentence ("A ledger is a graph of accounts and transactions…") to: `Drugs and the proteins they act on form a graph, and embeddings turn that graph into something a model can learn from.` |
| `scroll-studies/sumi-cinema.html`, `scroll-studies/terrarium.html` | Heading/lead → `Graph embeddings for drug-target interaction prediction` (keep the rest of the sentence). Chip `Fraud detection` → `Drug discovery`. Leave the other chips. |
| `2026/f-keynote.html:176`, `current/index.html:43` | Change only the `<p>` sentence, not the heading. |
| `ideas/film.html:315` | Caption string only; keep the two timestamps. |

## Checks (executor runs all)
1. `git grep -n -i fraud -- public/drafts` → exactly 2 lines: `ideas/callouts.html:197`, `ideas/typewindow.html:169`.
2. `git diff --stat` → only files under `public/drafts/`, 49 or 50 files.
3. `git diff | grep '^[-+]' | grep -v '^[-+][-+]' | grep -o '<[a-zA-Z/][^ >]*' | sort | uniq -c` → every tag count
   is even (same tags on removed and added lines).
4. `git grep -n -i "blockchain developer and researcher" -- public/drafts | wc -l` equals the count before the edits.

## STOP conditions
- The drift check prints anything.
- A passage needs a tag/id/attribute change to read correctly.
- A fraud mention is not about the MSc and is not one of the two OUT lines.

## Report contract
List every file changed, any passage where you made a judgement call (quote before/after), the output of the
four checks, and anything you left unchanged with the reason.

## Outcome (2026-10-03)
- DONE. 50 files, 76 lines changed, text only, all under `public/drafts/`. Executed by Pi (deepseek-v4-pro), reviewed by the orchestrator.
- **Deviation:** check 1 returns 5 lines, not 2. The extra 3 are the `fraudT` / `n-fraudT` / `auth-fraudT` identifiers in `ideas/graph.html`, kept on purpose. The plan's expected count was wrong.
- Visual check: `ideas/graph.html`, `ideas/preprint.html` and `ideas/sentence.html` render correctly in headless Chrome at 1280px.
- **Still open (owner's call):** whether blockchain fraud detection was separate real work. It decides `ideas/callouts.html:197`, `ideas/typewindow.html:169` and the /play/ interests line.
