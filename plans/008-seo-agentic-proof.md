# Plan 008: Back "Agentic Software Engineer" with real evidence and remove stale SEO signals

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the
> expected result before moving on. If anything in "STOP conditions" happens, stop and report. Do not improvise.
> Do NOT commit and do NOT push. The orchestrator reviews and commits.
>
> **Drift check (run first)**: `git diff --stat 531e420 -- public/index.xml "public/%PUBLIC_URL%" public/play astro.config.mjs src/pages/garden/tags src/content/garden public/llms.txt`
> must print nothing. `src/data/profile.ts` has another session's uncommitted `activities` edit (lines 216–231).
> Leave that hunk alone. Touch only the `site`, `projects` and `person` blocks.

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: LOW (static content and meta, no runtime logic)
- **Depends on**: 001 and 002 (DONE)
- **Category**: SEO + GEO (answer-engine) content
- **Planned at**: commit `531e420`, 2026-10-03, from the RESEARCH audit in this session

## Why this matters
The site's technical SEO and AI-crawler setup are already strong. The gap is evidence. The title says
"Agentic Software Engineer", but the Person schema says `jobTitle: 'Software Engineer'`, `knowsAbout` has no
agent or LLM terms, and the only agentic content is one card under "Outside work". Search engines and LLMs
cite what a page shows, not what it claims, so the site needs one checkable piece of agentic work. The owner
chose **a case study of this site**, which is built by an agent pipeline: the orchestrator plans and reviews,
and Pi (DeepSeek v4 pro) implements numbered plans (`plans/README.md`). Every claim can be checked in this repo.

The audit also found stale files that contradict the new positioning and are still crawlable:
- `public/index.xml`: a 2023-era CV, "Blockchain & Web3 Developer", with skill percentages. Live, not linked.
- `public/%PUBLIC_URL%/manifest.json`: a leftover from Create React App. Live.
- `public/play/dist/llms.txt`: a second llms.txt that says "Blockchain developer", on the old domain. Live.
- `public/play/index.html`: **canonical points to `https://gmixoulis.github.io/play/`**, the old domain. Its
  JSON-LD `#person` @id doesn't match the homepage `https://george-michoulis.com/#person`, so the entity splits in two.
- `public/play/dist/{cv,about,404}.html`: redirect stubs whose canonicals point to the old domain.
- `public/play/dist/{robots,sitemap}.xml/txt`: ignored by crawlers (only root files count), and they name the old domain.
- The meta description is 172 characters, so Google cuts it off.
- Tag pages (`/garden/tags/*`, 1–2 posts each) are thin archives listed in the sitemap.

## Decisions (made by the owner in chat, 2026-10-03)
- Agentic proof: **case study post + a "This site" project card**. Not "move the Activities card" and not schema-only.
- Person `image`: **keep `og.png`**. Don't use the headshot.

## Touchpoints
| File | Change |
|---|---|
| `public/index.xml` | delete |
| `public/%PUBLIC_URL%/` | delete folder |
| `public/play/dist/llms.txt`, `public/play/dist/robots.txt`, `public/play/dist/sitemap.xml` | delete |
| `public/play/index.html`, `public/play/dist/{cv,about,404}.html`, `public/play/NOTICE.txt` | `https://gmixoulis.github.io` → `https://george-michoulis.com` (text replace only) |
| `src/data/profile.ts` | `site.description`; new `projects.items[1]`; `person.jobTitle`, `person.knowsAbout` |
| `astro.config.mjs` | sitemap filter also drops `/garden/tags/` |
| `src/pages/garden/tags/index.astro`, `src/pages/garden/tags/[tag].astro` | pass `noindex` |
| `src/content/garden/built-by-agents.md` | new post (orchestrator writes it) |
| `public/img/portfolio/george-michoulis.com.png` | new screenshot for the card |
| `public/llms.txt` | add the agentic line and the post link (orchestrator writes it) |
| `plans/README.md` | add the 008 row |

## Public Contracts
- URLs removed (404 afterwards): `/index.xml`, `/%PUBLIC_URL%/manifest.json`, `/play/dist/llms.txt`,
  `/play/dist/robots.txt`, `/play/dist/sitemap.xml`. None are linked from the site (checked with grep).
- New URL: `/garden/built-by-agents/` (in the sitemap and RSS).
- Tag pages stay reachable but get `noindex` (links are still followed) and leave the sitemap.
- JSON-LD `#person` `@id` doesn't change. `/play/` now joins the same entity.

## Blast Radius
- `public/play/**` is a game engine. **Change only URL strings in `<head>` meta, `<link>` and JSON-LD, plus
  NOTICE.txt.** Never touch element ids, classes or the minified engine JS (see memory: play-game-engine-gotchas).
- `profile.ts` is shared by every home section. Keep the `projects.items` type the same; the new item uses existing fields only.
- The CSP is unaffected (no new origins or scripts).

## Commands you will need
| Purpose | Command | Expected |
|---|---|---|
| Build (gate) | `bun run build` | exit 0, "Complete!" |
| Serve build | `python3 -m http.server 4402 --directory build` (background; kill it afterwards) | :4402 |
| Page check | `node scripts/ideas-qa/page-check.cjs <urls>` | every line `"ok":true`, exit 0 |

## Steps

### Step 1: Delete the stale public files (Pi)
`git rm public/index.xml public/play/dist/llms.txt public/play/dist/robots.txt public/play/dist/sitemap.xml`
and `git rm -r "public/%PUBLIC_URL%"`.
Before deleting, run `grep -rn "index.xml\|PUBLIC_URL\|dist/llms.txt\|dist/sitemap.xml\|dist/robots.txt" src public .github scripts`
(excluding `public/drafts`). Any hit outside the files being deleted means **STOP**.

### Step 2: Move /play/ to the canonical domain (Pi)
In `public/play/index.html`, `public/play/dist/cv.html`, `public/play/dist/about.html`,
`public/play/dist/404.html` and `public/play/NOTICE.txt`, replace `https://gmixoulis.github.io` with
`https://george-michoulis.com`. Plain string replacement, nothing else.
Check: `grep -rc "gmixoulis.github.io" public/play` prints 0 for every file.

### Step 3: Shorten the meta description (Pi)
`src/data/profile.ts`, `site.description` →
`'Software engineer in Thessaloniki, Greece, moving into agentic software engineering. Full-stack and Web3 products, plus published blockchain research.'`
(150 chars). Leave `shortDescription` and `about.def` alone.

### Step 4: Take tag pages out of the index (Pi)
- `astro.config.mjs` sitemap: `filter: (page) => !page.includes('/drafts/') && !page.includes('/garden/tags/')`.
- `src/pages/garden/tags/index.astro` and `src/pages/garden/tags/[tag].astro`: add `noindex` to `<GardenLayout …>`.
  `BaseLayout` already emits `<meta name="robots" content="noindex">`.

### Step 5: Write the case study post (orchestrator, not Pi)
`src/content/garden/built-by-agents.md`. Frontmatter follows `src/content.config.ts`: title ≤ 90 characters,
description 20–170, `tags: [agentic-ai, craft, meta]`, `date: 2026-10-03`. Kanji is optional.
- **Facts only from repo artifacts**: `plans/README.md` and plan headers 001–008, `git log` (commit count and dates),
  `scripts/ideas-qa/pi-brief-*.txt`, `scripts/ideas-qa/page-check.cjs`/`axe.cjs`, and the `astro.config.mjs` comments.
  The post covers: how the work is split (one agent plans and reviews, one implements), the plan format (drift check,
  STOP conditions, no commits by the executor), verification gates, and what went wrong and needed review.
- No secrets, keys, env names, provider config or personal paths. No invented metrics.
- Run the `humanizer` / `no-ai-slop` pass, because the owner rejects text that sounds generated.
- **Gate: the owner reads and edits the post before Step 8 commits anything.**

### Step 6: Add the "This site" project card (Pi)
- Screenshot the homepage hero at 1840×940 (puppeteer-core with local Chrome, dark theme, 1× scale) to
  `public/img/portfolio/george-michoulis.com.png`. Keep it under 400 KB; use WebP at the same size if PNG is larger.
- Insert at `projects.items[1]`, so it's among the 4 shown on the slider:
  `{ img: '/img/portfolio/george-michoulis.com.png', w: 1840, h: 940, alt: 'Homepage of george-michoulis.com with the name in large type over a dark glass-block scene', name: 'This site', host: 'george-michoulis.com', d: 'Built with an **agent pipeline**: one agent plans and reviews, another writes the code.', tag: 'Agentic' }`
  Fix `alt` to match what the screenshot actually shows.

### Step 7: Schema and llms.txt (Pi for profile.ts, orchestrator for llms.txt)
- `person.jobTitle: ['Software Engineer', 'Agentic Software Engineer']`.
- Put `'Agentic software engineering', 'AI coding agents', 'Multi-agent orchestration'` at the front of `person.knowsAbout`.
- `public/llms.txt`: under `## Work`, add one line that this site is built and maintained by an AI agent pipeline
  he designed and reviews, with a link to the post. Under `## On this site`, add the post.

### Step 8: Verify, then hand back
See Verification Evidence. The orchestrator reviews the diff against the `vc-clean-code` / `vc-research-reuse`
skills if they're installed (say so if they're missing), shows the post to the owner, and asks before committing.

## Verification Evidence
After `bun run build`:
1. `test ! -e build/index.xml && test ! -e "build/%PUBLIC_URL%" && test ! -e build/play/dist/llms.txt`
2. `grep -rc gmixoulis.github.io build/play | grep -v ':0$'` prints nothing.
3. `grep -c "/garden/tags/" build/sitemap-0.xml` = 0, and `grep -c built-by-agents build/sitemap-0.xml` = 1.
4. `grep -l 'name="robots" content="noindex"' build/garden/tags/*/index.html build/garden/tags/index.html` lists all of them.
5. A one-off node check on `build/index.html`: the meta description is ≤ 155 characters; every JSON-LD block runs through
   `JSON.parse`; the Person `jobTitle` includes "Agentic Software Engineer".
6. `page-check.cjs` on `/`, `/garden/`, `/garden/built-by-agents/`, `/garden/tags/meta/` and `/play/` from :4402: all `ok:true`.
7. Screenshot of the Projects slider showing the new card (puppeteer-core), sent to the owner.

## STOP conditions
- The drift check prints anything, or Step 1's grep finds a reference.
- Step 2 would change anything other than a URL string in `public/play`.
- The build fails, or page-check reports an error the plan didn't expect.

## Out of scope (with reasons)
- **Sitemap `lastmod`**: a flat build date is worse than none, and per-post dates need collection access inside
  `astro.config`. Revisit when the garden has more than ~10 posts.
- **Headshot in Person `image`**: the owner declined.
- **Moving the Activities "Agentic AI" card**: the owner didn't pick it, and another session is reordering Activities.
- **Off-site work** (Search Console and Bing reindex requests, GitHub/LinkedIn/ResearchGate profile updates): the owner does these after deploy.

## Resume and Execution Handoff
- Execute anchor: `plans/008-seo-agentic-proof.md` (this file only).
- Split: Steps 1–4 and 6, plus the profile.ts part of Step 7 → `pi-delegate` (`--provider deepseek --model deepseek-v4-pro`).
  Steps 5 and the llms.txt part of 7 → orchestrator.
- After deploy, the owner should: request indexing for `/` and `/garden/built-by-agents/` in Search Console;
  add the site to Bing Webmaster Tools; update the GitHub profile README to the current role.
