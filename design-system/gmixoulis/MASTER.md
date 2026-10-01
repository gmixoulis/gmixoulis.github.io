# Design System Master — George Michoulis

**Audience:** hiring managers and research collaborators skim-reading a researcher–builder portfolio.  
**Identity:** quiet Japanese garden ink × projection-room dossiers × Neo-Tokyo-lite structure.  
**Not:** SaaS glow, cyberpunk kitsch, IBM ledger templates, crypto/NFT UI.

---

## North star (fused system)

Combine three prior directions into one coherent surface:

| Source | Keep | Drop |
|--------|------|------|
| **A Soft ink** | Bone/ink day, soft noir night, **name as brand**, quiet density, ma | Generic “academic paper” clutter |
| **B Projection room** | Letterbox dark, cream type, print-dossier light, **chapters as reels** | Over-theatrical film chrome |
| **C Neo-Tokyo lite** | Vertical experience rail, **thin vermilion** accent only | Neon, Blade Runner, glow orbs |

**Japan love (binding):** ink brushes and kanji used sparingly; whitest white ↔ darkest black with a full gray scale between; **ma / yohaku** (composed emptiness and intervals). Never sakura spam, neon Tokyo, glassmorphism, or purple gradients.

**Signature brand signal:** the name **George Michoulis** (and short **George** in chrome) is hero-level brand—not an eyebrow. If the first viewport could belong to another person after removing the nav, branding is too weak.

---

## Color tokens

### Core scale (garden grayscale)

Absolute poles with measured steps between. Prefer near-pure paper and ink over warm cream or cool “tech gray.”

| Token | Light (day) | Dark (soft noir) | Role |
|-------|-------------|------------------|------|
| `--bg` | `#FFFFFF` (whitest white) | `#0A0A0A` (darkest black) | Page ground |
| `--bg-elevated` | `#F5F5F5` | `#141414` | Soft planes, not cards-by-default |
| `--ink` | `#0A0A0A` | `#F2F0EB` (cream-ink, not pure white) | Primary type |
| `--ink-muted` | `#5C5C5C` | `#A3A3A3` | Secondary type |
| `--ink-faint` | `#8A8A8A` | `#6B6B6B` | Meta, captions, rail labels |
| `--rule` | `#D4D4D4` | `#2A2A2A` | Hairlines, letterbox bars |
| `--rule-strong` | `#0A0A0A` | `#E8E4DC` | Rare emphasis rules |

**Gray ladder (use freely):** at least 5–7 intermediate values between white and black for atmosphere, ink wash, and depth—never fill emptiness with color.

### Accent (optional, thin)

| Token | Value | Rules |
|-------|-------|-------|
| `--accent` | Vermilion / cinnabar ≈ `#C43C2C` | **Thin only:** 1–2px rules, underline ticks, active rail marker, focus ring. Never fills, never large blocks, never glow. |
| `--accent-soft` | `#C43C2C` at ≤12% opacity | Hover wash on interactive text/links only if needed |

**Links:** prefer `--ink` + underline or thin vermilion underline; do not hard-code random reds.

### Mode personalities

- **Light — print dossier / lab notebook:** paper white, black ink, gray washes, dossier chapter marks. Reads like a composed print layout with generous yohaku.
- **Dark — soft noir / projection room:** near-black ground, cream type (`--ink` dark), letterbox bars top/bottom optional on hero or chapter openers. Quiet cinema, not HUD.

Theme toggle is always available; both modes must hold the same hierarchy and spacing rhythm.

---

## Typography

### Pairing (expressive, not default stacks)

Avoid Inter, Roboto, Arial, system-ui as the voice of the site.

| Role | Direction | Notes |
|------|-----------|-------|
| **Display / brand** | High-contrast serif *or* refined grotesque with personality (e.g. news/editorial display) | Name lockup; large section titles. Tracking slightly tight on display. |
| **Body** | Humanist sans with clear academic readability | Thesis, about, dossier body. Comfortable measure (~60–72ch). |
| **Meta / data** | Narrow mono or quiet mono | Years, chapter indices, rail labels, “Fig.” captions—not walls of code. |

**Kanji / Japanese type:** if used, pair with a restrained Japanese face (or system JP fallback) at small sizes only—captions, chapter seals, one word max in hero. Never bilingual paragraph spam.

### Scale (guidance)

- Brand name: clamp large; must dominate first viewport.
- One headline under the name (short).
- Body: 1 rem base; muted captions smaller.
- Rail labels: small caps or mono, low contrast.

---

## Ink, brush, and kanji usage

**Allowed**

- One brush stroke or ink-wash vignette as atmospheric ground (very low contrast, never competing with type).
- A single kanji or short compound as a **chapter seal** (e.g. beside a section title)—decorative, not instructional.
- Hairline “sumi” rules that fade or stop short (ma as interrupted line).
- **Brush divider:** real sumi stroke raster (`public/drafts/japan/brush-stroke.png`, mirrored at `public/img/ui/brush-stroke.png`) via `.brush-divider` in `tokens.css` — dry-brush texture, `mix-blend-mode: multiply` (day) / invert+screen (noir). Never SVG path masks or dashed “fake brush” lines.
- **Enso** (Zen circle) as a signature mark — see below.

**Forbidden**

- Sakura petals, fans, torii, wave patterns as decoration spam.
- Brush calligraphy as the main headline font for English.
- Kanji wallpaper or repeating seal stamps.
- Neon katakana, cyberpunk JP signage pastiche.

**Principle:** if removing the brush/kanji leaves the layout equally clear, keep it; if the layout depends on “Japan costume,” remove it.

### Enso (Zen circle)

Enso is a circular form expressing Zen mind: one brushed, imperfect circle — often left incomplete, with dry-brush gaps acceptable. It is never a perfect geometric ring. Optional quiet inscription: “What is this?”  
Reference: [Lion’s Roar — What is an Enso?](https://www.lionsroar.com/what-is-an-enso/)

**Usage**

- Hero atmosphere (low contrast wash or mid-opacity stroke) or a small chapter/close mark.
- Soft ink (day): near-black stroke on white. Projection (noir): cream stroke on darkest black at **low opacity** so type stays readable. Neo-Tokyo lite: optional thin vermilion “tick” enso — accent only, not a fill.
- **Never** a glowing moon disc, breathing lunar pulse, or soft spotlight behind the enso. Atmosphere only.
- **Readability rule:** any ink/atmosphere under copy needs a scrim or enough contrast that body text stays ≥ WCAG AA against the effective background. Check cream-on-noir and black-on-wash after every visual change.
- **Asset:** sumi raster `public/drafts/japan/enso-sumi.png` (mirrored at `public/img/ui/enso-sumi.png`), mounted by `enso.js` (day / noir invert / vermilion mask). Never a stroked SVG ring, dashed circle, or `border-radius` fake. Do not force `position: relative` on atmosphere hosts.

### Kabuki (theater, not poster)

When “Kabuki” appears in drafts, it means **traditional Japanese theater aesthetic**: hanging scrolls, woodblock script texture, **shishi (獅子) lions**, bunraku/doll silhouettes — black / white / thin vermilion. It does **not** mean a red-and-black stage poster, kumadori face-paint spam, or cartoon mascots.

**福 brush reference:** `public/img/ui/fuku-brush.png` — optional small seal, never hero-scale.

**Brush stroke divider:** `public/img/ui/brush-stroke.png` — horizontal sumi stroke for section breaks; prefer intervals (ma) first, use sparingly.

### Brush type licensing (Kokuryu / Harukaze)

| Role | Intended face | License note | Free stand-in (drafts / until kit exists) |
|------|---------------|--------------|------------------------------------------|
| Brush display / seals (dragon energy) | **Kokuryu / KokuryuSou** (Adobe Fonts, Showashotai) | Do **not** pirate binaries. Load only via a licensed [Adobe Fonts](https://fonts.adobe.com/fonts/kokuryu) web project / Typekit ID. | **Yuji Boku** (Google Fonts) — label: *swap to KokuryuSou via Adobe Fonts web project* |
| Brush hand / short inscriptions | **Harukaze Brush** | Ship only if legally licensed/hosted; do not embed scraped files. | **Zen Kurenaido** (Google Fonts) — label: *swap to Harukaze Brush* |
| Brand / Latin+JP display | — | — | **Shippori Mincho** (Google Fonts) |
| Body / meta | — | — | **Source Sans 3** + **Noto Sans JP** |

This repo currently has **no** Adobe Typekit / Fonts kit ID. Static pitch drafts live at `/drafts/japan/` and document the swap path on every page.

---

## Space: ma / yohaku

- Prefer **intervals** over dividers: empty bands between sections beat boxed separators.
- Section padding: generous vertical rhythm; avoid stacking content to the fold.
- One job per section: one purpose, one headline, usually one short supporting sentence.
- Default: **no cards**. Cards only when they contain a real interaction (e.g. expandable dossier, media control). If border/shadow/radius can go without losing meaning, remove them.
- Radius: **0–2px** max (ink edge, not soft product UI). Prefer 0.

---

## Structure chrome

### Vertical experience rail (Neo-Tokyo lite)

- Fixed or sticky vertical rail (typically right or left edge) marking chapter progress.
- Thin vermilion tick for active chapter; gray ticks for others.
- Labels: short chapter names or indices—not a second nav of marketing pills.
- Must work with keyboard and screen readers; rail is progressive enhancement of in-page anchors.

### Letterbox (dark / projection)

- Optional top/bottom bars in dark mode on hero or chapter openers only.
- Cream type inside the letterbox frame; do not put floating badges on media.

### Chapters as reels × lab notebook

Narrative metaphor (pick labels in PLAN; keep dual reading):

| Chapter feel | Soft ink / notebook | Projection / dossier |
|--------------|---------------------|----------------------|
| Open | Lab plate / “Fig.” quiet | Reel slate / letterbox |
| Body | Notebook entries, timelines | Dossier pages, print columns |
| Close | Quiet rule + ma | Fade to black / cream |

Same content; chrome tone shifts with theme, not with different information architecture.

---

## Light + dark checklist

| Concern | Light | Dark |
|---------|-------|------|
| Ground | Whitest white | Darkest black |
| Type | Near-black ink | Cream ink |
| Accent | Thin vermilion | Same thin vermilion (no neon boost) |
| Media | Soft gray scrim if needed | Stronger scrim; letterbox OK |
| Rules | Light gray hairlines | Dark gray hairlines |
| Elevation | Rare gray wash | Rare raised black plane |

---

## Motion rules (for later PLAN / EXECUTE)

Intent: presence and hierarchy, not spectacle. Prior nausea from pointer-linked 3D → **banned**.

| Allowed | Spec |
|---------|------|
| Scroll-driven parallax | **2–3 layers**, low ratios (subtle depth only) |
| Content motion | Fade / slight translate on enter; staggered sparingly |
| Pin | **At most one** pinned beat site-wide |
| Reduced motion | `prefers-reduced-motion: reduce` → no parallax, no pin scrub, instant or fade-only |

| Banned |
|--------|
| Pointer-linked 3D, orbit cameras, follow-cursor tilt |
| Glow pulses, particle fields, endless loop noise |
| Motion that moves primary reading text while the user tracks it |

Ship **2–3 intentional motions** total for the main experience (e.g. hero depth + one chapter enter + rail tick), not a motion on every block.

---

## Section map (site-wide)

Canonical single-page order (home owns choreography detail in `pages/home.md`):

1. **Hero / brand plate** — name, one line, one CTA group; atmosphere only
2. **About / thesis** — who and why (notebook entry)
3. **Work / build** — selected work as dossier reels (not a card grid by default)
4. **Proof** — credentials, pubs, awards as print evidence
5. **Contact** — quiet close; email + socials

Nav mirrors chapters; experience rail tracks the same IDs.

---

## Interaction & components (design contracts)

- **Nav:** sticky, minimal; brand name or mark; theme toggle always present.
- **CTAs:** text or thin-outline; primary CTA on home = Contact (or equivalent quiet verb). No pill clusters.
- **Icons:** sparse; Phosphor or similar line icons only where they clarify (not decorative rows).
- **Images:** real work / context when possible; full-bleed only where the page asks for atmosphere (hero). No inset hero collage.
- **Focus:** visible thin vermilion or high-contrast ring; never remove outlines without replacement.

---

## Anti-patterns (hard ban)

- Sakura spam, neon Tokyo, Blade Runner / cyberpunk kitsch  
- Glow orbs, purple gradients, glassmorphism, frosted card stacks  
- IBM Plex ledger / austere “academic SaaS” template as the whole identity  
- Crypto / NFT marketplace UI patterns (token cards, floor prices, hex grids)  
- Dashboard first viewport (stat strips, trust logos, version badges, ticker)  
- Cards in the hero; floating badges / stickers on media  
- Amber candy, gradient text, grain-for-mood overload  
- Pointer physics / 3D follow  
- Hard-coded random reds outside `--accent`  
- Leaking `/play` pixel-game aesthetics into this system (see `pages/play-separate.md`)

---

## Related docs

- [`pages/home.md`](pages/home.md) — first viewport + section choreography  
- [`pages/play-separate.md`](pages/play-separate.md) — `/play` experiment isolation  
- [`/drafts/japan/`](../../public/drafts/japan/) — viewable static HTML pitch drafts (fusion recommended)

**Implementation note:** this folder is the design source of truth. App code must follow these contracts in PLAN/EXECUTE; do not invent a parallel visual language in `src/`.
