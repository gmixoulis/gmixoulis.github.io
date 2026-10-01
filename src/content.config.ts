import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Zen Garden — personal posts. Drop a .md into src/content/garden/ to publish. */
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
      /** Optional single kanji / short compound shown as a chapter seal. */
      kanji: z.string().max(4).optional(),
      draft: z.boolean().default(false),
    }).refine((d) => !d.cover || (d.coverAlt && d.coverAlt.length > 0), {
      message: 'coverAlt is required when cover is set', path: ['coverAlt'],
    }),
});

export const collections = { garden };
