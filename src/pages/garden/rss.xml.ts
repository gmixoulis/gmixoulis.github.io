import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '@/lib/garden';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  return rss({
    title: 'Zen Garden · George Michoulis',
    description: 'Notes on blockchain, graphs, code and craft.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/garden/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
