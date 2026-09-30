# Round-6 brief: the cube and the particles, in new layouts

Read, in `/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/scripts/ideas-qa/`: `brief.md` (real
Content, Assets, Output, Verify) and `brief-3.md` (tech stack, craft, performance, fallbacks, and no
pointer-driven camera). This file REPLACES brief-4 and brief-5: ignore "world as interface",
"physical process" and "Read as text".

## What George said
- His favourites so far are two round-3 pages: **`public/drafts/ideas/pro.html`** (the iridescent glass
  cube block) and **`public/drafts/ideas/particles.html`** (about 100k GPU particles forming his name, an ensō,
  and a paper nebula). Open both files and study them. **Match their visual language and quality:** dark,
  premium, precise, and the same rendering techniques. Reuse and adapt their shader and three.js code freely.
- The problem was ONLY the layout: "repetitive: left, right, then on background." Every section put text
  on one side and the 3D on the other, alternating, with the scene as a backdrop.
- **No game-like interactions for now:** no walking, no throwing objects, no cranks, no drawing machines.
  Interaction stays web-native: scroll, click, hover, keyboard.

## Banned layout patterns
1. A text column on one side with the 3D on the other side (or its mirror).
2. Alternating left/right sections.
3. The 3D as a full-page backdrop that sections scroll over.
4. The round-3 skeleton: a giant name hero + `[Contact →] [See work]`; the About / Experience / Papers /
   Certificates / Contact heading stack; dates-left rows; a huge-numeral citation list; a certificate
   grid + "See all 34"; a big-email finale + a socials row; the thin `About Work Papers Proof Contact` nav.
   Content has to take the form YOUR layout pattern gives it.
5. The stock intro line ("I'm a blockchain developer and researcher. I build smart contracts, graph-based ML…").

## Your job
Each designer gets ONE layout pattern (named in your prompt). Make that pattern the whole idea: the
composition is the signature. Present ALL the real content (roles, degrees, awards, papers with
citations, certificates, projects, contact), with its form coming from the pattern. Keep it scannable
and elegant. All text is real HTML (selectable, accessible), never baked into canvas textures.

## Copy and data (mandatory)
- After writing, run the installed `no-ai-slop` skill (Skill tool) in EDIT mode on all your copy, and apply
  it. Avoid colon reveals, explaining a metaphor more than once, repeated heading shapes, and vague
  filler ("multinational EU projects", "Large … applications").
- The bachelor's is **BSc Applied Informatics** (the scan's filename wrongly says Computer Science; never
  show that). Certificate titles go into sentence case, with truncated ones ended cleanly with "…" or left out.

## Verify (the machine is shared by 6 parallel designers)
Use one headless Chrome at a time, and short-lived. Iterate with your own lightweight puppeteer frames
at key states. Run the checker ONCE at the end:
`SETTLE=2500 FRAME=900 node /Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/scripts/ideas-qa/check.cjs <slug>`
Then also save one hero frame at 1440×900 as
`/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/public/drafts/ideas/thumbs/<slug>.png`, resized to 720×450.

## Report back
The same as brief.md, plus the layout pattern in one sentence, how you avoided the banned layouts, and the
no-ai-slop "What changed" list.
