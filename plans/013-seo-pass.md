# Plan 013: SEO pass (audit of the 18-point list, then only the real gaps)

> **Executor**: Claude orchestrates. The mechanical code goes to pi when the relay is up; the copy, the OG image and the
> CLS fixes are done by Claude (they need judgement or eyes). Worktree `.claude/worktrees/seo`, branch `feat/seo` from
> master `893a4be`. Ship only on George's explicit "yes".

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: LOW (play engine: MED, see its gotchas memory) · **Planned at**: 2026-10-06
- **State**: DONE, shipped 2026-10-06 (George: "yes")

## Audit (live site, 2026-10-06)
| # | Item | Now | Action |
|---|---|---|---|
| 1 | sitemap.xml | 6 URLs, no lastmod | Add `lastmod` (post dates and build date). Add tag pages once they're indexable. |
| 2 | robots.txt | OK, with AI crawlers allowed and the sitemap linked | None |
| 3 | noindex | Only the 4 tag pages (deliberate: thin lists). `/drafts/` is noindexed and disallowed. | Remove it from the tag pages (George asked) and give each tag page a real description. Drafts stay hidden. |
| 4 | canonical | On every page | None |
| 5 | titles / descriptions | Present. The blog ones are short (29–80 characters; tags about 30). | Rewrite the blog index, post and tag descriptions to 120–160 characters. Lengthen the blog title. No-AI-slop pass on the copy. |
| 6 | one H1 per page | Yes on all 10 pages | None |
| 7 | heading hierarchy | No skipped levels | None |
| 8 | alt text | Every image has alt (decorative ones are `alt=""` + aria-hidden) | None |
| 9 | schema | Person, ProfilePage, WebSite, ScholarlyArticle ×7, Blog, BlogPosting, CollectionPage | Add BreadcrumbList on blog pages. Add `image` + `dateModified` to BlogPosting. |
| 10 | internal links | Posts only link out through the nav | Add previous/next post links and "more on #tag" links on posts |
| 11 | broken links | 0 internal. The 6 flagged external links are DOI/LinkedIn blocking bots (they work in a browser). | None |
| 12 | compress images | Home is fine (all `/_astro/`, 312 KiB). The blog has 88 KiB of savings. `/play/` has 865 KiB (full-size degree scans at 256 px). | Make 512 px WebP copies for /play/ and convert the blog's tatami/band images. Don't touch rename_auto.js or the originals. |
| 13 | Core Web Vitals | Home LCP 1.8 s / CLS 0. Post LCP 2.7 s / CLS 0.142 (the title re-wraps when Shippori Mincho loads). /play/ LCP 7.0 s / CLS 1.05 (the preloader animates `bottom`). | Post: preload the title weight and use a metric-matched serif fallback. /play/: move the preloader with `transform`, add image sizes, defer jQuery if safe. |
| 14 | mobile | No overflow at 390 px on any page. /play/ is a fixed 1000 px stage by design, scaled with no overflow. | Re-check after the changes |
| 15 | HTTPS | Enforced (Pages `https_enforced: true`, http→https 301) | None |
| 16 | URL slugs | All lowercase and hyphenated (`/garden/built-by-agents/`…) | None (renaming would only break links) |
| 17 | OG image | Home and one post have one. Missing on the blog index, 2 posts and the tags. | Add one OG image for the blog (1200×630, ink-and-sun style), used by every blog page without its own |
| 18 | Search Console | **Done 2026-10-06**: George verified a domain property with a DNS TXT record at Namecheap (seen on 1.1.1.1 and 8.8.8.8) | Nothing in the repo. George submits `sitemap-index.xml` in Search Console. |
| 19 | llms.txt | Live and current | Add the blog posts. Optional llms-full.txt. |

## Verification evidence
- Re-crawl: every page has a description of 120–160 characters, an OG image, breadcrumbs, and the tag pages are indexable.
- tsc and build pass. page-check 0 errors. axe 0 violations.
- Lighthouse mobile: post CLS < 0.1 and LCP < 2.5 s; /play/ CLS < 0.1. Home and blog no worse than now.
- /play/ played end to end with frames (memory: verify-ui-by-playing).

## Execution report (2026-10-06)
- **Executor:** done directly, not through pi. Posts already had previous/next and tag links, so the mechanical part was
  too small to be worth delegating (the pi-delegate skill's own rule).
- **Crawl after (local build, 11 pages):** one H1, no heading skips, alt everywhere, canonical everywhere. Descriptions
  are 120–157 characters on every blog page. Every page has an OG image (`og-garden.png` for the blog). The blog pages
  have BreadcrumbList. The tag pages are indexable and in the sitemap. The sitemap has 11 URLs, with `lastmod` from post
  dates. `llms.txt` lists every post. 0 broken internal links.
- **Lighthouse mobile, before → after:**
  - home 96 → 95 (noise; LCP 2.1 s, CLS 0)
  - blog 94 → 97
  - post 90 → 99 (LCP 2.7 → 2.1 s, CLS 0.142 → 0)
  - /play/ 51 → 60 (LCP 7.0 → 4.7 s, CLS 1.05 → 0.56, weight 1.79 → 1.04 MB)
- **Cause of the post's CLS:** the Source Sans preload never fired. Astro's preload filter can't match style or subset on
  a variable font, so the intro paragraph re-wrapped (4 → 3 lines) when the font arrived. Fixed by preloading that one
  file from `fontData`, plus `display: optional`. Also: the tatami texture is 960 px at q45 (204 → 51 KB), with a preload.
- **/play/:** the preloader slides with a transform (george-patches.js). The degree scans are 512 px WebP (804 → 40 KB).
  The remaining CLS 0.56 is the engine's own intro animation (it animates the world layer's height and top). Changing
  that means rewriting minified engine code, which is deliberately not done. Played end to end with no errors.
- **Not changed:** the ink band (`band-b.png`) is 93 px at source and shown at about 96–144 px, so "image smaller than
  displayed" stays.
- **Checks:** tsc and build pass. page-check 14/14. axe 0 violations in 16 combinations. Post header visually identical
  (mean pixel difference 0.5/255).
