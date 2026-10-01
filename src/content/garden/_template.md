---
# ── Frontmatter (all fields) ────────────────────────────────────────────────
# title:        required, max 90 chars — the post heading and <title>.
# date:         required, YYYY-MM-DD — publish date (also drives list order).
# description:  required, 20–170 chars — meta description, list excerpt, RSS.
# tags:         optional, lowercase-kebab, e.g. [code, graphs] — no spaces, no capitals.
# cover:        optional, path to an image (e.g. ./cover.jpg) — header image + og:image.
# coverAlt:     required when cover is set — short alt text for the cover.
# kanji:        optional, max 4 chars — the chapter seal shown in the header.
# updated:      optional, YYYY-MM-DD — set when you edit an already-published post.
# draft:        true hides the post from production (visible in `astro dev` only).
# ────────────────────────────────────────────────────────────────────────────
title: Untitled
date: 2026-01-01
description: A short summary between 20 and 170 characters long.
tags: [code]
# cover: ./cover.jpg
# coverAlt: Describe the cover image.
kanji: ・
updated: null
draft: true
---

Write the post body here.

How publishing works:

- A single-file post is `my-post.md` dropped into `src/content/garden/`.
- A post with images is a folder: `my-post/index.md` with the images beside it,
  referenced in the body as `![alt text](./photo.jpg)` — Astro optimises them.
- `cover` + `coverAlt` set the header image (and social preview). Put the image
  next to `index.md` and point `cover` at it, e.g. `cover: ./cover.jpg`.
- Tags must be lowercase-kebab (letters, digits, single hyphens).
- Set `updated` when you edit a published post so the feed and SEO reflect it.
- `draft: true` hides the post from the production build; it still appears in
  `astro dev`. Remove the flag (or set `false`) to publish.
