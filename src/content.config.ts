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
