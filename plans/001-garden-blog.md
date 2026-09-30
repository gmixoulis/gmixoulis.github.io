# Plan 001: Turn the Zen Garden into a best-practice blog (tags, images, RSS, per-post SEO)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm
> the expected result before moving to the next step. If anything in "STOP conditions" occurs, stop and
> report; do not improvise. Do NOT commit and do NOT push. The orchestrator reviews and commits.
>
> **Drift check (run first)**: `git diff --stat a43de13 -- src/content.config.ts src/content/garden src/pages/garden src/layouts package.json`
> If any in-scope file changed since this plan was written, compare the excerpts below against the live
> code; on a mismatch, STOP.

## Status
- **Priority**: P1 · **Effort**: M · **Risk**: LOW
- **Depends on**: none
- **Category**: direction (feature) + SEO
- **Planned at**: commit `a43de13`, 2026-09-30

## Why this matters
The owner, George Michoulis, wants `/garden/` to be his real blog: posts he writes in Markdown, with tags,
images, an RSS feed and proper SEO for each post. Today the garden has two posts, no tag pages, no images
inside posts, no RSS, and no per-post meta beyond title and description. After this plan, adding a post means
dropping a Markdown file (or a folder with images) into `src/content/garden/`. Everything else (tag pages,
feed, optimised images, structured data) is generated.

## Current state
- Stack: **Astro 7.2.4** (static output to `build/`), React 19 islands, Tailwind 4, package manager **bun**.
- `src/content.config.ts`: the content collection, whole file:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Zen Garden — personal posts. Drop a .md into src/content/garden/ to publish. */
const garden = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/garden' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Optional single kanji / short compound shown as a chapter seal. */
    kanji: z.string().max(4).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { garden };
```
- Posts today: `src/content/garden/entering-the-garden.md` (tags `[meta, zen]`, kanji 庭) and
  `src/content/garden/one-stroke.md` (tags `[craft]`, kanji 円). Frontmatter keys: title, date,
  description, tags, kanji.
- `src/pages/garden/index.astro`: lists posts newest first inside `<GardenLayout>`. Each entry is
  `<li class="z-entry z-reveal">` with the seal, date (`.z-meta`), `<h2 class="z-display">`,
  description and tags rendered as `<span class="z-tags z-meta">` (plain spans, not links).
- `src/pages/garden/[...slug].astro`: the post page. `getStaticPaths` maps
  `getCollection('garden', ({ data }) => !data.draft)` to `params: { slug: post.id }`, then renders
  `<Content />` inside `<div class="z-prose">`, with a header (seal, h1, description) and a footer link back.
- `src/layouts/GardenLayout.astro`: props `{ title, description?, progress? }`. It wraps `BaseLayout`,
  loads Google Fonts in the `head` slot, and includes decorative kanji/petals plus an
  IntersectionObserver `<script>` that adds `.is-in` to `.z-reveal`/`.z-cut` elements.
- `src/layouts/BaseLayout.astro`: props `{ title?, description? }`. It sets `<title>`,
  `<meta name="description">`, a `head` slot, an inline theme script (`localStorage 'gm-theme'` →
  toggles `html.dark`), and renders `<SiteNav client:load />` (a React nav).
- Styles: `src/styles/garden.css` (all `.z-*` classes; tokens `--z-bg`, `--z-ink`, `--z-accent`; dark
  variant under `.dark .garden`). **Reuse these classes. Don't restyle the garden.**
- `astro.config.mjs` has `site: 'https://gmixoulis.github.io'`. Plan 002 changes it to
  `https://george-michoulis.com`. In this plan, build absolute URLs from `Astro.site` (never hard-code the domain).

## Commands you will need
| Purpose | Command | Expected on success |
|---|---|---|
| Install deps | `bun install` | exit 0 |
| Add RSS package | `bun add @astrojs/rss@^4` | exit 0, added to package.json dependencies |
| Build (gate) | `bun run build` | exit 0, ends with "Complete!" |
| Serve build | `python3 -m http.server 4401 --directory build` (background; kill when done) | serves on :4401 |
| Page check | `node scripts/ideas-qa/page-check.cjs http://127.0.0.1:4401/garden/ …` | every line `"ok":true`, exit 0 |

## Suggested executor toolkit
Read the Astro docs pages if you can: content collections (`image()` schema helper), `astro:assets`
`<Image>`, `@astrojs/rss`. The Astro version is 7.x; the APIs used below exist in 5+ and are unchanged.

## Scope
**In scope** (the only files you may modify or create):
- `package.json`, `bun.lock` (adding `@astrojs/rss` only)
- `src/content.config.ts`
- `src/content/garden/**` (move/edit posts, add `_template.md`, add images)
- `src/pages/garden/index.astro`, `src/pages/garden/[...slug].astro`
- `src/pages/garden/tags/index.astro` (create), `src/pages/garden/tags/[tag].astro` (create)
- `src/pages/garden/rss.xml.ts` (create)
- `src/lib/garden.ts` (create: shared helpers)
- `src/layouts/BaseLayout.astro` (only to add the optional SEO props in Step 5)
- `src/layouts/GardenLayout.astro` (only to pass the new SEO props through)
- `src/styles/garden.css` (only to ADD small styles for tag links, cover figure, prev/next)

**Out of scope** (do NOT touch):
- `src/pages/index.astro` and `src/components/site/*`: the homepage is being redesigned separately.
- `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`: Plan 002 owns site-wide SEO and CSP.
- `public/play/**` (a fragile game engine), `public/drafts/**` (design prototypes), `legacy/**`.
- Existing post body text: don't rewrite George's writing.

## Git workflow
- Stay on the current branch. Don't commit, don't push.

## Steps

### Step 1: Add shared helpers `src/lib/garden.ts`
Create:
```ts
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'garden'>;

/** Published posts, newest first. Drafts are visible only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('garden', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Tag → URL-safe slug. Tags are already validated as lowercase-kebab in the schema. */
export const tagHref = (tag: string) => `/garden/tags/${tag}/`;

/** Unique tags with post counts, most used first, then alphabetical. */
export function tagCounts(posts: Post[]): { tag: string; count: number }[] {
  const m = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) m.set(t, (m.get(t) ?? 0) + 1);
  return [...m].map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** ~230 words per minute; code blocks count as words too. Minimum 1. */
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.trim().split(/\s+/).length / 230));

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' });
```
**Verify**: `bun run build` → exit 0 (the file is unused so far, and must still compile).

### Step 2: Extend the collection schema (cover images, updated date, validated tags)
Replace the `schema` in `src/content.config.ts` with the function form so the `image()` helper is available,
and change the glob so files starting with `_` are ignored (for the template in Step 7):
```ts
const garden = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/garden' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(90),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      description: z.string().min(20).max(170),
      tags: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'tags must be lowercase-kebab')).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      kanji: z.string().max(4).optional(),
      draft: z.boolean().default(false),
    }).refine((d) => !d.cover || (d.coverAlt && d.coverAlt.length > 0), {
      message: 'coverAlt is required when cover is set', path: ['coverAlt'],
    }),
});
```
Keep the existing doc comments. Both existing posts satisfy the schema: their descriptions are 39 and 60
characters (the 20–170 range allows short, human descriptions; don't edit George's text) and their tags are lowercase.
(Revised 2026-09-30 by the orchestrator: the first draft said min(40), which wrongly failed `one-stroke`.) If a build error says otherwise, STOP.
**Verify**: `bun run build` → exit 0, still generating `/garden/entering-the-garden/` and `/garden/one-stroke/`.

### Step 3: Convert one post into a folder post with a cover image (a working example)
1. `mkdir -p src/content/garden/one-stroke && git mv src/content/garden/one-stroke.md src/content/garden/one-stroke/index.md`
2. `cp public/img/ui/enso-sumi.png src/content/garden/one-stroke/enso.png`
3. In `src/content/garden/one-stroke/index.md` frontmatter, add:
   `cover: ./enso.png` and `coverAlt: "A single brushed ensō circle in black sumi ink, left open where the brush ran dry."`
4. The route must stay `/garden/one-stroke/` (the glob loader strips a trailing `/index`).
**Verify**: `bun run build` → exit 0 and `ls build/garden/one-stroke/index.html` exists, and
`ls build/_astro | grep -i enso` shows at least one optimised image (webp/avif/png with a hash).
If the route came out as `/garden/one-stroke/index/`, STOP and report.

### Step 4: Rewrite the post page `src/pages/garden/[...slug].astro`
Keep the existing markup and classes (header, seal, `z-display` h1, `z-prose`, plate footer), and add:
- `getStaticPaths` uses `getPosts()` from `@/lib/garden` and passes `prev`/`next` (neighbours in the sorted array: `prev` = older post, `next` = newer post) as props.
- **Cover**: if `post.data.cover`, render right after the header, before the first `<hr class="z-cut" />`:
  ```astro
  <figure class="z-cover"><Image src={post.data.cover} alt={post.data.coverAlt} widths={[480, 800, 1200]}
    sizes="(max-width: 800px) 100vw, 800px" loading="eager" fetchpriority="high" /></figure>
  ```
  (`import { Image } from 'astro:assets'`).
- **Meta line**: `Zen Garden · <time datetime={iso}>{fmtDate(date)}</time> · N min read`. If `updated`
  exists, also `· updated <time …>`.
- **Tags**: a `<ul class="z-taglist">` of links `<a href={tagHref(t)} rel="tag">#{t}</a>`.
- **Prev/next nav** before the back link: `<nav class="z-prevnext" aria-label="More posts">` with
  "← Older: {title}" and "Newer: {title} →" links when they exist.
- **SEO props** passed to `GardenLayout` (added in Step 5): `canonical`, `ogType="article"`, `ogImage`
  (the absolute URL of an optimised cover: use `getImage({ src: post.data.cover, width: 1200, format: 'jpg' })`
  and `new URL(img.src, Astro.site).href`; omit when there's no cover), `publishedTime`, `modifiedTime`,
  `tags`, and `jsonLd`, a `BlogPosting` object:
  ```ts
  {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: title, description, datePublished: iso(date), dateModified: iso(updated ?? date),
    author: { '@type': 'Person', '@id': new URL('/#person', Astro.site).href, name: 'George Michoulis', url: new URL('/', Astro.site).href },
    mainEntityOfPage: canonical, url: canonical, keywords: tags.join(', '), inLanguage: 'en',
    image: ogImage /* only if present */, isPartOf: { '@type': 'Blog', name: 'Zen Garden', url: new URL('/garden/', Astro.site).href },
  }
  ```
**Verify**: `bun run build` → exit 0. Then
`grep -c '"@type":"BlogPosting"' build/garden/one-stroke/index.html` → `1`, and
`grep -c 'rel="tag"' build/garden/one-stroke/index.html` → at least `1`.

### Step 5: Add optional SEO props to `BaseLayout.astro`, and pass them through `GardenLayout.astro`
`BaseLayout.astro` currently only takes `title` and `description`. Add optional props (all optional, so the
homepage keeps working unchanged): `canonical?: string`, `ogType?: 'website' | 'article' | 'profile'`
(default `'website'`), `ogImage?: string`, `noindex?: boolean`, `jsonLd?: object | object[]`,
`publishedTime?: string`, `modifiedTime?: string`, `tags?: string[]`, `rss?: boolean`.
In `<head>`, render: `<link rel="canonical" href={canonical ?? new URL(Astro.url.pathname, Astro.site).href}>`,
`og:title`, `og:description`, `og:type`, `og:url`, `og:site_name` = "George Michoulis", `og:image` (if any),
`twitter:card` (`summary_large_image` if ogImage, else `summary`), `twitter:creator` = "@GeorgeMicou",
`article:published_time`/`article:modified_time`/`article:tag` (when ogType is article), `robots` noindex
(when `noindex`), the RSS alternate link `<link rel="alternate" type="application/rss+xml" title="Zen Garden" href="/garden/rss.xml">`
(when `rss`), and each JSON-LD object as
`<script type="application/ld+json" set:html={JSON.stringify(obj)} />`.
**Security note**: `JSON.stringify` output inside a script tag must not be able to close the tag. Escape `<`
by using `JSON.stringify(obj).replace(/</g, '\\u003c')`. Keep this exact escaping.
`GardenLayout.astro`: accept the same optional props and forward them to `BaseLayout`, setting `rss` to true for all garden pages.
**Verify**: `bun run build` → exit 0; `grep -c 'rel="canonical"' build/index.html` → `1` (the homepage still
builds and gets a canonical); `grep -c 'application/rss+xml' build/garden/index.html` → `1`.

### Step 6: Index with tag filter, the tag index, and tag pages
- `src/pages/garden/index.astro`: use `getPosts()`. Keep the hero, the list markup and the river figure. Make each
  entry's tags real links (`<a href={tagHref(t)} rel="tag">#{t}</a>`), show the reading time and `<time datetime>`, and
  show a small cover thumbnail (`<Image … width={160} height={100} />`) when the post has a cover. Above the
  list, add a `<nav class="z-taglist" aria-label="Tags">` with all tags from `tagCounts()`, each linked, with its count.
  Add JSON-LD `{ '@type': 'Blog', name: 'Zen Garden', url, author: { '@id': …'/#person' }, blogPost: [ {headline, url, datePublished} … ] }`.
- Create `src/pages/garden/tags/index.astro`: an h1 "Tags", then a list of all tags with counts linking to tag pages.
- Create `src/pages/garden/tags/[tag].astro`: `getStaticPaths` from `tagCounts(await getPosts())`. h1
  `Posts tagged #{tag}`, the same list markup as the index (you may extract the list item into
  `src/components/garden/PostItem.astro` and reuse it; create that file if you do), plus a link back to all posts.
  Canonical is its own URL. JSON-LD: `CollectionPage`.
**Verify**: `bun run build` → exit 0, and these files exist: `build/garden/tags/index.html`,
`build/garden/tags/craft/index.html`, `build/garden/tags/zen/index.html`, `build/garden/tags/meta/index.html`.

### Step 7: RSS feed and writing template
- `bun add @astrojs/rss@^4`.
- Create `src/pages/garden/rss.xml.ts`:
  ```ts
  import rss from '@astrojs/rss';
  import type { APIContext } from 'astro';
  import { getPosts } from '@/lib/garden';
  export async function GET(context: APIContext) {
    const posts = (await getPosts()).filter((p) => !p.data.draft);
    return rss({
      title: 'Zen Garden · George Michoulis', description: 'Notes on blockchain, graphs, code and craft.',
      site: context.site!, items: posts.map((p) => ({ title: p.data.title, description: p.data.description,
        pubDate: p.data.date, link: `/garden/${p.id}/`, categories: p.data.tags })), customData: '<language>en</language>',
    });
  }
  ```
- Create `src/content/garden/_template.md` (ignored by the glob thanks to Step 2) with every frontmatter field
  documented in YAML comments, `draft: true`, and a short body explaining: a single-file post is
  `my-post.md`; a post with images is a folder `my-post/index.md` with images beside it, referenced as
  `![alt text](./photo.jpg)` (Astro optimises them); `cover` + `coverAlt` for the header image;
  tags are lowercase-kebab; `updated` is for edits; `draft: true` hides a post from production.
**Verify**: `bun run build` → exit 0; `build/garden/rss.xml` exists and contains `<item>` twice (the 2 posts);
`test ! -e build/garden/_template/index.html` succeeds (the template is not published).

### Step 8: Styles for the new elements (additive only)
Append to `src/styles/garden.css` minimal rules using the existing tokens (`--z-ink`, `--z-ink-muted`,
`--z-accent`, `--z-rule`, `--z-font-meta`):
- `.z-taglist`: an inline wrap list with a small gap, links in `var(--z-font-meta)`, hover colour `var(--z-accent)`.
- `.z-cover`: a centred figure, max-width `var(--z-measure)`, image `width:100%; height:auto`.
- `.z-prevnext`: two links spaced apart, stacking on narrow screens.
- A visible `:focus-visible` outline on all of these (the file already has a pattern: `outline: 1px solid var(--z-accent)`).
Light and dark must both look right: use tokens only, no raw colours.
**Verify**: `bun run build` → exit 0.

### Step 9: Final page check (both themes are covered by the token system)
Start `python3 -m http.server 4401 --directory build` in the background, then run:
`node scripts/ideas-qa/page-check.cjs http://127.0.0.1:4401/garden/ http://127.0.0.1:4401/garden/one-stroke/ http://127.0.0.1:4401/garden/entering-the-garden/ http://127.0.0.1:4401/garden/tags/ http://127.0.0.1:4401/garden/tags/craft/`
→ exit 0, every line `"ok":true`. Kill the server afterwards (`pkill -f "http.server 4401"`).

## Test plan
There's no unit-test framework in this repo, and don't add one. The gates are: `bun run build` (Astro validates the
schema and fails on bad frontmatter), the `grep`/`test` checks per step, and `page-check.cjs` (console errors,
overflow, exactly one h1 per page) on desktop and mobile.

## Done criteria
- [ ] `bun run build` exits 0
- [ ] `build/garden/rss.xml` contains exactly 2 `<item>` elements
- [ ] `build/garden/tags/{index,craft,zen,meta}/index.html` all exist
- [ ] `grep -c '"@type":"BlogPosting"' build/garden/one-stroke/index.html` → 1
- [ ] An optimised cover image for one-stroke exists in `build/_astro/`
- [ ] `node scripts/ideas-qa/page-check.cjs …` (Step 9 URLs) exits 0
- [ ] `git status --porcelain` shows only in-scope paths changed/added (plus `build/`, which is ignored)

## STOP conditions
- The excerpts above don't match the live files.
- `image()` isn't available in the schema function, or the folder post routes to `/garden/one-stroke/index/`.
- The build fails twice on the same step after a reasonable fix.
- Any step seems to require editing `astro.config.mjs`, the homepage, or `public/**`.

## Maintenance notes
- Plan 002 adds `@astrojs/sitemap` and a CSP. The JSON-LD `<script type="application/ld+json">` blocks are
  data, not executable scripts, so they're unaffected by `script-src`. Plan 002 must still verify that.
- When the homepage is rebuilt, it must emit the `Person` JSON-LD with `@id` `https://george-michoulis.com/#person`,
  because blog posts reference that id as their author.
- New posts: copy `src/content/garden/_template.md`.
