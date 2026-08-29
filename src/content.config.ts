import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const photo = z.object({
  src: z.url({ protocol: /^https$/ }),
  alt: z.string(),
  caption: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ""),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        created: z.coerce.date(),
        updated: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        authors: z.array(reference("authors")),
        relatedPosts: z.array(reference("blog")),
        galleries: z.array(reference("galleries")).optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      .refine((data) => !data.cover || Boolean(data.coverAlt), {
        message: "coverAlt is required when cover is set",
        path: ["coverAlt"],
      }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/data/authors" }),
  schema: z.object({
    name: z.string(),
  }),
});

const galleries = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/gallery",
    generateId: ({ entry }) => entry.replace(/\.json$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    listed: z.boolean().default(true),
    photos: z.array(photo).min(1),
    blogs: z.array(reference("blog")).optional(),
  }),
});

export const collections = { blog, authors, galleries };
