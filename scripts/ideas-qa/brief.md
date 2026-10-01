# Shared brief: UI idea prototypes for George Michoulis's portfolio

You build ONE idea as ONE self-contained HTML page. Other designers are building other ideas in
parallel, so stick to your idea and make it unmistakably different.

## Why this exists
George's current site looks "too UI generated": IBM Plex everywhere, uppercase mono section labels, the
same hairline + label-left / content-right grid on every section, a stat strip in the hero, three equal
pillars, network-graph clip art, and filled-blue + ghost button pairs. He wants a site that looks
**authored**, with one memorable signature moment, not a template.

## Output
- Write exactly one file: `/Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/public/drafts/ideas/<slug>.html`
- Single file: inline `<style>` and inline `<script>` (CDN libraries only where a later brief allows).
- Google Fonts `<link>` is allowed. **Banned as the voice:** IBM Plex, Inter, Roboto, Arial, system-ui, Space Grotesk.
- Top-left, small and quiet: `<a href="index.html">← All ideas</a>`.
- `<title>`: "<Idea name> · George Michoulis"

## Assets: existing only, with relative paths from the page
Look at an image with the Read tool before using it.
- Ink art (transparent PNGs, sumi black, some red): `../../img/ink/parts/` → crane.png, branch.png,
  dragonfly.png, koi.png, bamboo.png, fuji-sun.png, sun-brush.png, seal-ko.png, splash-red.png,
  splat-black.png, swirl.png, disc.png, tree-left.png, tree-right.png, band-a/b/c.png, great-wave.jpg,
  yinyang.png, torii.png. More: `../../img/ink/calligraphy.png`, `../../img/ui/brush-stroke.png`,
  `../../img/ui/enso-sumi.png`, `../../img/ui/fuku-brush.png`, `../../img/ui/tatami.jpg`
- Certificates (34 real scans): `../../img/renamed/<file>`, named `<Kind>_<Title>.jpg|png` with
  dashes. List them: `ls /Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/public/img/renamed`
- Project screenshots (real sites he built): `../../img/portfolio/` → accelerate.png,
  bbf-gui.ddns.net.gif (a looping GIF, so freeze it or skip it), celc.web.auth.gr.PNG, eudem.polsci.auth.gr.PNG,
  marlab.ode.uom.gr.PNG, metau.unic.ac.cy.png, verde.uom.gr.PNG (VerDe, his credential verification
  system). Describe only what a screenshot visibly shows, plus its hostname.
- **Banned:** `img/gallery/*` and `img/background/*` (stock landscapes, not George). No hotlinked images.
  There are no photos of George, so don't fake one.

## Content: real facts only. Never invent metrics, clients, quotes or dates.
- **George Michoulis.** Thessaloniki, Greece; works remotely. gmixoulis@gmail.com
- Blockchain developer and researcher: smart contracts, graph-based ML, full-stack Web3 systems.
- BSc Applied Informatics, University of Macedonia, 2015–2020; thesis on Ethereum credential verification.
- MSc Data and Web Science, Aristotle University of Thessaloniki, 2020–2022, on graph-embedding methods
  for blockchain fraud detection, funded by a DeepMind scholarship.
- Research: publications and startup work on ledger effectiveness. Build: Web3 (NFTs, DeFi), data
  science with graph embeddings, Solidity, TypeScript, cloud. Teach: lecturer in networks, security and
  application development; public talks on Web3 and edge tech.
- Experience:
  - 05/2026 – present · Web3 Full-Stack Developer · Cyberscope by TAC: end-to-end Web3 products, contracts, on-chain integrations, React/Next frontends, security tooling.
  - 2024 – 2026 · Blockchain Developer & Researcher · Sidroco Holdings Ltd: NFT marketplace for 5G, Hyperledger Fabric prototypes, Erasmus+ LMS, EU projects.
  - 2023 – 2025 · Lecturer & Academic Partner · University of Derby / Mediterranean College: Networks & Security, Web Scripting, Application Development.
  - 2022 – 2024 · Blockchain & Full-Stack Developer · University of Nicosia / IFF: Next.js / NestJS / Docker apps and a Web3 NFT marketplace.
- Awards: DeepMind Scholarship (AUTH, 2020–2022) · 3rd place, Infinitech Hackathon (Crowdpolicy, 06/2022) ·
  Basic Research grant (University of Macedonia, 2020–2021) · Move/Sui Bootcamp Thessaloniki award (2025).
- Papers (year · citations · title · venue):
  1. 2022 · 32 · A process-aware approach for blockchain-based verification of academic qualifications · Simulation Modelling Practice and Theory 121, 102642
  2. 2020 · 11 · Verification of Academic Qualifications through Ethereum Blockchain: An Introduction to VerDe · XIV Balkan Conference on Operational Research
  3. 2023 · 7 · Exploring decentralized governance: a framework applied to Compound Finance · Intl. Conf. on Mathematical Research for Blockchain Economy
  4. 2024 · 1 · FraMark: A Blockchain Marketplace for 5G Network Management using Fractional NFTs · 7th World Symposium on Communication Engineering (WSCE)
  5. 2025 · 1 · Data security for smart cities
  6. 2025 · 0 · Unlocking 5G network slicing: a survey on blockchain marketplaces utilizing NFTs, AI, and advanced resource management · IEEE ICCE 2025
  7. 2022 · 0 · Graph Embedding and Node Features for Drug-Target Interaction Prediction · Aristotle University of Thessaloniki (MSc work)
  8. 2022 · 0 · Blockchain in Higher Education: permissioned and permissionless approaches · 4th Summit on Gender Equality in Computing
  (plus two Greek-language theses on academic-title verification with Ethereum, 2020 and 2021)
  Scholar: https://scholar.google.com/citations?user=nk0lq8YAAAAJ
- Links: LinkedIn https://www.linkedin.com/in/george-michoulis/ · GitHub https://github.com/gmixoulis · X https://twitter.com/GeorgeMicou
- Also on the site: `/garden/` (Zen Garden, notes) and `/play/` (Ledger Run, a platformer CV).

## Base accessibility
One `<h1>`, landmarks, alt text (`alt=""` for decoration), visible `:focus-visible`, AA contrast,
`prefers-reduced-motion` respected, and zero horizontal page overflow at 390px and 1440px.

## Verify before reporting
`SETTLE=2500 FRAME=900 node /Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/scripts/ideas-qa/check.cjs <slug>`
prints JSON (overflowX, h1, broken images, console errors per mode) and writes contact sheets to
`~/.cache/ideas-qa/`. Read them with the Read tool and fix anything broken, clipped, low-contrast or generic.

## Report back (short)
File path and slug · the concept and the signature moment (one sentence each) · a check summary ·
anything you couldn't do · a status footer: `**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED`
