# Round-5 brief: a physical process you can touch

Read, in `/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/scripts/ideas-qa/`: `brief.md` (real Content, Assets, Output, Verify), `brief-3.md` (tech stack, craft,
performance, fallbacks), and `brief-4.md` (banned patterns, "the 3D world IS the interface", "Read as
text", persistent corner email, no pointer-driven camera). All still apply. This file adds to them.

## Where we are
George loves immersive WebGL, but rejects anything predictable or AI-looking. Round 3's shared page
skeleton was the problem (see `round3-patterns.png`). Round 4 made the world the interface. Round 5 goes
further: **each page is a real-time simulation of a real physical process or instrument** that the
visitor operates. It's not a printed costume and not a demo effect. The process is the navigation.

## Also banned now (round-4 ideas, don't repeat them)
Zooming through scales · a torch/flashlight revealing things in the dark · objects falling into a
physics pile · a film with a timeline scrubber · a terrain/relief map · a single object morphing per section.

## Copy rules (new, mandatory)
The skill `no-ai-slop` is installed. After writing your page, run it in EDIT mode on every line of your
copy (load it with the Skill tool: `no-ai-slop`), then apply the edits. The scan of the round-4 terrain
page found these, so avoid them from the start:
- **Colon reveals:** "This relief is plotted from my record: each paper is a peak…". Write plain sentences.
- **Explaining the metaphor more than once:** do it once, in one place (a small key or legend).
- **Seven identical "Metaphor: literal" headings:** vary them, or drop the metaphor in the text view.
- **Vague filler that fails the portability test:** "multinational EU projects", "Large Next.js…
  applications", "inclusivity-first assessment". Use the specific fact or cut the phrase. Never invent
  specifics.
- **Data hygiene:** the bachelor's degree is **BSc Applied Informatics** (its scan's filename wrongly
  says "Computer Science"; never show that). Certificate titles come from filenames. Convert them to
  sentence case, and end truncated ones ("… How Is The", "… The Example Of") cleanly with "…" or leave
  them out.

## Verify (the machine is heavily loaded by parallel agents)
The checker's page-load timeout is now 240 s. Run `SETTLE=2500 FRAME=900 node /Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/scripts/ideas-qa/check.cjs <slug>` ONCE
near the end, not repeatedly. For iteration, use your own lightweight puppeteer frames (same launch
args as check.cjs) at a few key states. Keep headless Chrome instances to one at a time.

## Report back
The same as brief-4, plus: the no-ai-slop "What changed" list for your copy.
