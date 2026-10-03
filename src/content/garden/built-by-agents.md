---
title: How a pipeline of agents builds this site
date: 2026-10-03
description: One agent plans and reviews, another writes the code, and I keep the taste. What worked, what broke, and the rules that came out of it.
tags: [agentic-ai, craft, meta]
kanji: 工
---

I didn't write most of the code on this site. Agents did. I decided what it should be,
read what they did, and said no a lot.

You can check everything below in the
[repository](https://github.com/gmixoulis/gmixoulis.github.io): the plans, the commits and
the test scripts are all there.

## Two agents and me

The orchestrator is Claude Code. It reads the code, writes a plan, sends the plan out and
reviews what comes back. It runs the checks again itself and commits only if they pass.

The executor is the Pi coding agent, running DeepSeek. It gets one plan and carries it out.
It never commits and never pushes.

I pick the direction, look at every visual change and approve each step. The design is mine,
and so is the call on when something is done.

I split it this way because a model checking its own work tends to agree with itself. A
second agent with a fresh context, plus checks that actually run, catches more.

## What a plan looks like

The work lives in numbered plans in [`plans/`](https://github.com/gmixoulis/gmixoulis.github.io/tree/master/plans).
At the time of writing there are eight, and each one has the same parts:

- A drift check: a `git diff` against the commit the plan was written at. If those files
  changed since then, the plan is out of date and the executor stops.
- The scope: which files to touch, and which never to touch.
- Steps, each with a command and the output it should give.
- STOP conditions, for when to stop and report instead of improvising.

The orchestrator doesn't take the executor's report on trust. It reads the diff and runs the
checks again.

## The checks

They are small scripts in `scripts/ideas-qa/`:

- `page-check.cjs` opens each page in headless Chrome. It fails on a console error, a CSP
  violation, a failed request, sideways scrolling, or anything other than exactly one `h1`.
- `axe.cjs` runs accessibility checks in light and dark mode, on desktop and phone widths.
- `contrast.cjs` measures the contrast of every piece of text and fails below 7:1.

On top of those, `bun run build` has to pass.

The orchestrator gets things wrong too. Plan 001 first required post descriptions of at least
40 characters, and one of my posts has 39. The plan was wrong, so we fixed the plan and left
the post alone.

## What broke

### The homepage design

I rejected sixteen homepage prototypes in two rounds. Some were "too plain", others "too
gimmicky". The next round, five WebGL pages, looked great but felt predictable, and the
reason was the brief: it had told all five to use the same page skeleton, so they came out
the same. An agent follows a brief very closely. Now the briefs describe the goal and leave
the layout open.

### The game

The playable CV under [`/play/`](/play/) runs an old minified game engine. One change deleted
an element that looked empty. The engine finds elements by id when it loads, so every trigger
after that one stopped firing, and nothing showed an error. Screenshots made it worse:
jumping straight to a spot in the level showed a layout that looked broken, because the
buildings only animate in as you walk past. Now the game gets tested the way a player plays
it. A script holds the right arrow key and takes a frame every 450 ms, and the frames are tiled
into contact sheets that get reviewed in full.

### A revert

One agent's change to the 3D cube was merged and reverted within the hour. The history shows
it, and I'm fine with that. Reverting is cheap when every step is small.

## Rules that came out of it

1. One plan, one task, one diff to review.
2. The executor never commits.
3. Every step has a check that can fail.
4. A report is a claim until the checks run again.
5. Visual work is checked by watching it, not by reading code.
6. The person who has to live with the site makes the taste calls.

This post went through the same process. It was planned as
[plan 008](https://github.com/gmixoulis/gmixoulis.github.io/blob/master/plans/008-seo-agentic-proof.md),
drafted by the orchestrator, and checked by me before it went live.
