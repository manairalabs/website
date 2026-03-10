import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    author: z.string().default('Manaira Labs'),
    tags: z.array(z.string()).default([]),
    category: z.enum(['Insights', 'Case Study', 'Tutorial', 'News', 'Product Updates', 'SMB Insights']).default('Insights'),
    lang: z.enum(['en', 'id']).default('en'),
    draft: z.boolean().default(false),
    hreflangSlug: z.string().optional(),
  }),
});

export const collections = { blog };
