import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    author: z.string().default('TM Sempre Tecnologia'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
