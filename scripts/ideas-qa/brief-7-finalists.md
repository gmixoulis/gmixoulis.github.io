# Finalists brief: take one chosen page end to end

George picked two finalists from 37 prototypes and will choose between them after they are complete:
- `public/drafts/finalists/cube.html`, a copy of round 3's "Product-grade" page (the iridescent cube block)
- `public/drafts/finalists/ink.html`, a copy of round 3's "Ink in water" page (a live sumi-ink fluid simulation)

You own ONE of them. Edit that file in place. Keep everything he liked about it (the visual language, the
WebGL centrepiece, the polish) and apply ALL the changes below. Also read `brief.md` (content, assets,
accessibility) and `brief-3.md` (tech, performance, fallbacks, no pointer-driven camera) in this folder.
Where they conflict, this file wins.

## George's requests (all mandatory)
1. **Dark AND light mode.** Both fully designed (not an inverted afterthought). Default to
   `prefers-color-scheme`. Add a small, elegant theme toggle that is remembered in localStorage (wrapped
   in try/catch). The WebGL scene must be re-lit or re-coloured for each theme, not just the HTML.
2. **Remove the current-job badge above the name** (the "New · Web3 full-stack developer at Cyberscope
   by TAC →" pill, or its equivalent). Replace it with something else. A good option: a small
   "Latest on LinkedIn →" link that jumps to the LinkedIn section. The current role stays in the experience
   timeline only.
3. **The portfolio (projects) section is too big.** Make it compact: small thumbnails in a tight grid or a
   refined list. It should be about a third of its current height. Tighten the whole page, too: less dead
   space, shorter sections, nothing oversized.
4. **Soft skills**, presented beautifully (see the data below). Each skill is backed by evidence from his
   record: a short proof line. The presentation must fit the page's visual language. Avoid a generic
   three-card row, and avoid pills-with-icons.
5. **Extracurricular activities**, presented nicely (see the data below). Do NOT use the clip-art images in
   `img/gallery/*.png` (six clashing illustration styles, which look cheap). Draw each activity in the
   page's own visual language instead: for the cube page, small rendered cube/particle glyphs or crisp
   inline SVG; for the ink page, small sumi ink marks or brush glyphs (you may use the ink parts).
6. **LinkedIn: showcase his latest posts.** His old site embedded this SociableKit widget of his LinkedIn
   posts (verified live, HTTP 200): `https://widgets.sociablekit.com/linkedin-profile-posts/iframe/97069`.
   Embed it in a well-framed "Latest on LinkedIn" section:
   - `<iframe loading="lazy" title="George Michoulis on LinkedIn: latest posts">`, created only when the
     section nears the viewport (IntersectionObserver), with a sensible fixed height and inner scrolling.
   - A clear "Follow on LinkedIn" link to https://www.linkedin.com/in/george-michoulis/.
   - A graceful fallback if the embed is blocked or offline (a styled card linking to his profile).
   - A tiny note that it's a third-party embed (it loads from sociablekit.com).
   You can't restyle inside the iframe, so frame it so it looks intentional in BOTH themes.
7. **Cube page only: make it feel a bit more blockchain / network, but keep the cube.** For example: the
   hero cube block is the "genesis" block, linked by thin glowing hash-links to a short chain of smaller
   blocks, or with network edges pulsing between cubes. In the experience timeline, each role can be a
   block chained to the previous one ("prev" link). Tasteful and architectural, never crypto kitsch (no
   coins, no logos, no neon).
8. **Ink page only:** keep the fluid as the star. Blockchain/network is optional and subtle, if at all.
9. **Layout variety:** avoid strictly alternating "text left / 3D right" for every section. Vary the
   compositions (centred moments, full-width bands, asymmetric grids).

## Content data (real facts only; add these to the brief.md facts)
**Extra experience (include in the timeline):**
- 2018 – 2021 · Freelance WordPress developer. Built and maintained the MarLab (marlab.ode.uom.gr),
  CELC (celc.web.auth.gr) and EUDEM (eudem.polsci.auth.gr) sites. Met clients to plan each site's design and
  function, and made an introduction video for one organisation.
- 10/2018 · Volunteer web developer, MKI Hellas. Built a chatbot with Dialogflow, plus a web page and
  database with Vue.js and Firebase.

**Extra award:** 2014 – 2015 · Excellence Award, 1st Lyceum of Kalamaria, given for the highest score in the final year.

**His own words** (from his old site; use them nearly verbatim, lightly edited):
- "I enjoy building and breaking things to understand how they work." (He called it the hacker attitude.)
- "Lifelong learning is my way of life."

**Soft skills** (each with its evidence line; you may rephrase):
1. Teaching and explaining: lecturer in Networks & Security, Web Scripting and Application Development
   (University of Derby / Mediterranean College, 2023–2025); public talks on Web3 and edge tech.
2. Research and analysis: 8 papers; the most cited has 32 citations; studies how blockchains perform in
   real institutions.
3. Curiosity (the hacker attitude): his quote above.
4. Lifelong learning: his quote above, plus 34 certificates (CCNA, Rust, machine learning, cloud, security…).
5. Working with clients: freelance WordPress work, planning design and function with clients (2018–2021).
6. Working across teams and countries: EU projects and Erasmus+ work at Sidroco (2024–2026).
7. Languages: English (TOEIC and an English proficiency certificate), and he actively learns other languages.

**Extracurricular activities** (from his old site):
- Workouts and staying fit
- Keeping up with the news
- Learning foreign languages
- Watching anime
- Theatre: acting on stage and watching plays
- Active citizen: politically engaged
- Also: hackathons and bootcamps (3rd place at Infinitech 2022; the Move/Sui Bootcamp Thessaloniki award in 2025) and
  volunteering (MKI Hellas, above).

## Copy and data hygiene (mandatory)
- After editing, run the installed `no-ai-slop` skill (Skill tool) in EDIT mode on ALL page copy and apply it.
- BSc = **Applied Informatics** (never "Computer Science"). Certificate titles in sentence case; truncated
  ones end with "…" or are left out.
- Don't invent anything: no metrics, clients, dates or quotes beyond the above.

## Section order (a normal portfolio; George chose these pages for the look)
Hero → About (with his two quotes) → Soft skills → Experience (with freelance and volunteer) → Research →
Certificates → Projects (compact) → Activities → Latest on LinkedIn → Contact. You may merge or reorder
slightly if it reads better, but every item must be present and easy to find. Nav anchors must match.

## Verify
- One headless Chrome at a time. Iterate with your own short puppeteer frames (same launch args as check.cjs).
- Final: `DIR=finalists SETTLE=2500 FRAME=900 node /Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/scripts/ideas-qa/check.cjs <cube|ink>`.
  It must be clean, EXCEPT that console errors or failed requests from the third-party LinkedIn iframe are
  acceptable when they're clearly from sociablekit/linkedin. List them in your report.
- Take your own frames of BOTH themes for every section, plus mobile 390px in both themes.
  Look at every frame critically.
- Save a hero thumbnail (1440×900 → 720×450) to `public/drafts/finalists/thumbs/<cube|ink>-dark.png` and `-light.png`.

## Report back
What changed (by the 9 requests above), check results, the no-ai-slop "What changed" list, and anything
you couldn't do. End with a status footer.
