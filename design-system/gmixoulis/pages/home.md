# Home page — fused system

Overrides and extends [`../MASTER.md`](../MASTER.md) for the single-page portfolio (`/`).

**Composition rule:** the first viewport is **one composition**, not a dashboard. Brand (name) first.

---

## First viewport (hero / brand plate)

### Must include (budget)

1. **Brand** — `George Michoulis` at hero scale (dominant signal)
2. **One headline** — short supporting claim (thesis-adjacent, not a second brand)
3. **One short sentence** — location or one-line role frame (optional if headline carries it)
4. **One CTA group** — primary **Contact**; optional secondary text link (e.g. Work / GitHub)—max two
5. **Atmosphere** — ink wash, letterbox (dark), or restrained full-bleed media with strong scrim

### Must not include

- Scroll cue, trust strip, version badge, “now · Role” ticker  
- Stat strips, schedules, promo chips, floating badges on media  
- Typed role carousel spam competing with the name  
- Cards, inset media panels, collage tiles  
- Kanji larger than a seal; sakura or neon chrome  

### Theme behavior

| Mode | Hero read |
|------|-----------|
| Light | Print dossier open: white field, black name, gray ma, thin vermilion CTA underline or rule |
| Dark | Soft noir projection: letterbox optional, cream type, thin vermilion active marks |

If video/media remains from legacy, treat it as **ground atmosphere** under a heavy scrim—never as a floating card. Name stays above the media plane.

### Brand test

Remove the nav. The viewport must still read as George’s site. If only a generic “developer portfolio” headline remains, fail.

---

## Section choreography

Order is fixed; each section = **one job**, one headline, usually one short support line. Prefer yohaku between chapters over boxed separators.

| # | Chapter | Notebook / dossier read | Content contract |
|---|---------|-------------------------|------------------|
| 1 | **Hero** | Brand plate / reel slate | See first viewport |
| 2 | **About** | Lab notebook entry | Thesis + short bio; asymmetric layout OK; no 3 equal cards |
| 3 | **Work** | Dossier reels | Selected projects as sequential “reels” or print spreads—not a SaaS card grid. One project focus at a time when possible |
| 4 | **Proof** | Evidence appendix | Pubs, awards, certs as print evidence / figures; hairlines and mono years; quiet gallery if needed |
| 5 | **Contact** | Closing plate | Email + socials; maximum quiet; thin vermilion only on interactive focus |

### Experience rail

- Vertical rail tracks `#hero` → `#about` → `#work` → `#proof` → `#contact` (IDs exact in PLAN).
- Active chapter: thin vermilion tick; inactive: gray.
- Labels: short (About, Work, Proof, Contact) or indices—never long marketing phrases.

### Nav

- Sticky; brand wordmark or name; section anchors; theme toggle always.
- No floating social rail that competes with the experience rail (pick one edge strategy in PLAN: socials in nav/footer vs. discreet rail).

---

## Motion on home (design intent)

Aligns with MASTER motion rules:

1. **Hero depth** — 2–3 parallax layers, low ratio (wash / type / media plane)
2. **Chapter enter** — content fade or slight rise on scroll into About / Work
3. **At most one pin** — e.g. Work reel opener or Proof figure; nowhere else

`prefers-reduced-motion`: disable parallax and pin; keep static ma and hierarchy.

No pointer-linked 3D anywhere on home.

---

## Copy & content notes

- Source of truth for strings: profile data (name, thesis, about, pillars, experience, etc.).
- Roles may appear **once** as a quiet secondary line or in About—not as a competing hero animation.
- CTAs: **Contact** primary label on home.

---

## Anti-patterns specific to home

- Dashboard hero (metrics, logos, badges)  
- Three equal “What I do” cards as the About solution (prefer asymmetric notebook layout)  
- Hard-coded red link colors outside `--accent`  
- Pixel-game, CRT, or `/play` motifs  
- IBM ledger full-page template  

---

## Handoff to PLAN

PLAN should specify: exact typefaces, token CSS names, rail edge (L/R), whether hero media stays video or becomes ink/static, and the single pinned beat (if any).
