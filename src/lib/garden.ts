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
