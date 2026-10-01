# Brief 8: SEO, AI-agent discoverability (GEO) and security for a finalist page

Applies to `public/drafts/finalists/cube.html` and `ink.html`. George wants the final site to rank on
Google, be found and cited by LLM agents (ChatGPT, Gemini, Claude, Perplexity), and be hardened against XSS.
Site-wide files (robots.txt, sitemap.xml, llms.txt) are handled by the orchestrator; you do the PAGE.

## 0. Draft status
Include the full production `<head>`, plus ONE draft-only line, commented clearly:
`<meta name="robots" content="noindex, nofollow"> <!-- DRAFT ONLY: remove when promoted to / -->`
The canonical domain is **https://george-michoulis.com/** (github.io redirects there).

## 1. SEO (page level)
- `<html lang="en">`, a descriptive `<title>` of 60 characters or fewer: "George Michoulis · Blockchain developer and researcher, Thessaloniki"
  (tune it). A factual meta description of 155 characters or fewer, with no slogans.
- `<link rel="canonical" href="https://george-michoulis.com/">`
- Open Graph + Twitter: `og:type=profile`, `profile:first_name`, `profile:last_name`, `og:title`,
  `og:description`, `og:url`, `og:image` (1200×630), `og:image:alt`, `twitter:card=summary_large_image`,
  `twitter:creator=@GeorgeMicou`. Make the image yourself: a 1200×630 screenshot of your hero in
  the dark theme, saved as `public/drafts/finalists/og-<cube|ink>.png`, under 300 KB (compress with PIL).
  Reference it with an absolute URL as if it lived at `https://george-michoulis.com/og.png` (the orchestrator
  moves it on promotion), and add a comment.
- Exactly one `<h1>` (the name), a logical `h2`/`h3` outline per section, `<article>` for each role and each
  paper, `<time datetime>` for dates, and `<address>` for contact.
- **The LCP element is HTML text** (the h1), never the canvas. Defer WebGL init until after first paint.
  Add `preconnect` for fonts, `font-display: swap`, explicit `width`/`height` on every `<img>` (no CLS), and
  `loading="lazy"` + `decoding="async"` below the fold.
- Every image has a meaningful alt (`alt=""` only for decoration).

## 2. Structured data: JSON-LD (the most important thing for LLMs and Google's Knowledge Graph)
One `<script type="application/ld+json">` with an `@graph`:
- `WebSite` (url, name, inLanguage)
- `ProfilePage` (`mainEntity` → the Person, `dateModified`)
- `Person`, with `@id` "https://george-michoulis.com/#person": name, givenName, familyName, `alternateName`
  (ONLY name variants confirmed in `profile-facts.md`), url, email "mailto:gmixoulis@gmail.com", image (the OG
  image), jobTitle "Blockchain Developer and Researcher", description (one factual sentence),
  `homeLocation`/`address` (Thessaloniki, GR), `worksFor` (Cyberscope by TAC), `alumniOf` (both
  universities as `CollegeOrUniversity`), `hasCredential` (the BSc and MSc as
  `EducationalOccupationalCredential`), `award` (strings), `knowsAbout` (Ethereum, smart contracts,
  Solidity, TypeScript, graph embeddings, blockchain fraud detection, Hyperledger Fabric, NFTs, DeFi,
  5G network slicing…), `knowsLanguage`, and `sameAs` (EVERY verified profile URL: LinkedIn, GitHub,
  Google Scholar, X, plus ORCID/ResearchGate/DBLP/Semantic Scholar if `profile-facts.md` confirms them).
- One `ScholarlyArticle` per paper: headline/name, `datePublished`, `author` → the Person @id,
  `isPartOf`/`publisher` (the venue), url (the Scholar citation link or DOI if known).
- Validate the JSON (it must parse). Make sure every value matches the visible page: never put facts in
  JSON-LD that aren't on the page.

## 3. GEO: make LLM agents find, understand and cite George
- **All facts in crawlable HTML.** Nothing important only in canvas, only in the LinkedIn iframe, or only
  after interaction. Content that animates in must be in the DOM from the start.
- **One plain definitional sentence** near the top of the About section that an LLM can quote:
  "George Michoulis is a blockchain developer and researcher based in Thessaloniki, Greece, …"
  (third person is fine for this ONE sentence; the rest stays first person). Keep it factual, since LLMs
  lift this verbatim.
- Use consistent entity names everywhere (the same organisation and degree names as the JSON-LD).
- Add `<link rel="alternate" type="text/plain" href="https://george-michoulis.com/llms.txt" title="LLM-readable summary">`.
- Put the date in the footer ("Updated September 2026"). Freshness signals help AI answers.
- No hidden keyword stuffing, no visually-hidden duplicate text for bots (that's cloaking).

## 4. Security hardening (XSS and friends)
GitHub Pages can't set HTTP headers, so use what a page can do itself:
- **CSP** via `<meta http-equiv="Content-Security-Policy" content="…">`, as strict as works:
  - `default-src 'self'`
  - `script-src 'self' https://cdn.jsdelivr.net 'sha256-…'`: HASH every inline `<script>`, including the
    importmap and the JSON-LD. Don't use `'unsafe-inline'` or `'unsafe-eval'` for scripts. Recompute the
    hashes after your final edit (write a tiny node/python helper that extracts the inline scripts and
    prints their sha256 in base64).
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (inline styles allowed)
  - `font-src https://fonts.gstatic.com` · `img-src 'self' data: blob:` · `connect-src 'self' https://cdn.jsdelivr.net`
  - `frame-src https://widgets.sociablekit.com` · `worker-src 'self' blob:` · `object-src 'none'`
  - `base-uri 'none'` · `form-action 'none'` · `upgrade-insecure-requests`
  (`frame-ancestors` doesn't work in meta; note it in a comment for the future hosting headers.)
- **Subresource Integrity** on every CDN `<script src>` (`integrity="sha384-…" crossorigin="anonymous"`;
  compute with `curl -s URL | openssl dgst -sha384 -binary | openssl base64 -A`). Add an `"integrity"`
  map to the importmap for the three.js modules too (supported in current Chrome and Safari).
- **The LinkedIn iframe:** `sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"`,
  `referrerpolicy="strict-origin-when-cross-origin"`, `loading="lazy"`, and a title.
- All `target="_blank"` links get `rel="noopener noreferrer"`.
- **No XSS sinks:** no `innerHTML` / `insertAdjacentHTML` / `document.write` with anything that isn't a
  hard-coded constant. Anything from the URL (hash, query) or localStorage is WHITELISTED against known
  values before use, and written with `textContent`. Wrap localStorage in try/catch.
- `<meta name="referrer" content="strict-origin-when-cross-origin">`.

## 5. Testing without breaking CSP
CSP `'self'` behaves badly on `file://`, so test over HTTP. Start your own static server on YOUR port
(cube: 4391, ink: 4392): `python3 -m http.server <port> --directory /Users/gmixoulis/Desktop/my-projects/gmixoulis.github.io/public`
(run it in the background, and stop it when done). Then load `http://127.0.0.1:<port>/drafts/finalists/<slug>.html`.
The checker supports this: `URLBASE=http://127.0.0.1:<port> DIR=finalists SETTLE=2500 FRAME=900 node …/check.cjs <slug>`.
The console must show ZERO CSP violations (listen for `securitypolicyviolation` events in your puppeteer
script too). Third-party errors that come from inside the sociablekit iframe are acceptable; list them.

## Report back (in addition to brief-7)
The final CSP string, the list of SRI-protected URLs, a JSON-LD validation result (parsed OK plus the
node types), a Lighthouse-style self-check (title/description lengths, one h1, alt coverage), and
confirmation of zero CSP violations.
