import { glob } from 'astro/loaders';
// `z` from 'astro:content' is deprecated and goes away in Astro 8.
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

import { locales } from './i18n/config';

const localeField = z.enum(locales);

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    locale: localeField,
    translationKey: z.string(),
    sector: z.string(),
    year: z.number().int(),
    client: z.string().optional(),
    engagement: z.string().optional(),
    scope: z.string().optional(),
    website: z.url().optional(),
    summary: z.string(),
    cardMetric: z.string().optional(),
    /** 'in-progress' renders "[ case study in progress ]" instead of a link. */
    status: z.enum(['published', 'in-progress']),
    featured: z.boolean().default(false),
    order: z.number().int(),
    /** Key into the image registry, for the home card and Work list. */
    coverImage: z.string().optional(),
    coverCaption: z.string(),
    heroImage: z.string().optional(),
    heroCaption: z.string().optional(),
    /** `lead: true` sets a paragraph in ink rather than secondary text. */
    sections: z
      .array(
        z.object({
          label: z.string(),
          paragraphs: z.array(z.object({ text: z.string(), lead: z.boolean().default(false) })),
        }),
      )
      .optional(),
    stack: z.object({ text: z.string().optional(), tools: z.array(z.string()) }).optional(),
    /** `image` is a registry key; without it the placeholder shows `caption`. */
    gallery: z.array(z.object({ caption: z.string(), image: z.string().optional() })).optional(),
    results: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    quote: z.object({ text: z.string(), name: z.string(), role: z.string() }).optional(),
    ctaTitle: z.string().optional(),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    locale: localeField,
    translationKey: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    excerpt: z.string(),
    /** Key into the image registry. */
    coverImage: z.string().optional(),
    coverCaption: z.string(),
    draft: z.boolean().default(false),
    /** Defaults to siteConfig.author. */
    author: z.string().optional(),
    /** Closing question on the article page; falls back to the Insights page CTA. */
    ctaTitle: z.string().optional(),
  }),
});

export const collections = { work, insights };
