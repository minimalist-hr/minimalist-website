import { glob } from 'astro/loaders';
// `z` from 'astro:content' is deprecated and goes away in Astro 8.
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

import { locales } from './i18n/config';

/**
 * Content collections (plan §8). Each entry exists once per language in its own folder,
 * `work/en/<slug>.md` and `work/hr/<slug>.md`, where the file name is that language's URL slug.
 * Entries are paired across languages by `translationKey`.
 */

const localeField = z.enum(locales);

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    locale: localeField,
    translationKey: z.string(),
    sector: z.string(),
    year: z.number().int(),
    /** Shown only with the client's written permission (plan §8). */
    client: z.string().optional(),
    engagement: z.string().optional(),
    scope: z.string().optional(),
    /** The live project, linked from the case study header. */
    website: z.url().optional(),
    /** One line on the Work list card. */
    summary: z.string(),
    /** Result line on the home card, e.g. "p95 latency 340ms → 48ms". */
    cardMetric: z.string().optional(),
    /** 'in-progress' renders "[ case study in progress ]" instead of a link. */
    status: z.enum(['published', 'in-progress']),
    /** Appears in "Selected work" on the home page. */
    featured: z.boolean().default(false),
    order: z.number().int(),
    /** Key into the image registry (src/lib/images.ts), for the home card and Work list. */
    coverImage: z.string().optional(),
    /** Placeholder caption, shown while the entry has no `coverImage`. */
    coverCaption: z.string(),
    /** Case study page: 16:9 hero image, a registry key. */
    heroImage: z.string().optional(),
    /** Placeholder caption for the hero, shown while there is no `heroImage`. */
    heroCaption: z.string().optional(),
    /**
     * Case study body as labelled blocks, in the design's order:
     * Context / The problem / What we removed / What we built (plan §8).
     * `lead: true` sets a paragraph in ink rather than secondary text.
     */
    sections: z
      .array(
        z.object({
          label: z.string(),
          paragraphs: z.array(z.object({ text: z.string(), lead: z.boolean().default(false) })),
        }),
      )
      .optional(),
    /**
     * Technologies used: a short note on why, and the tools as tags (product names, not
     * translated). Shown full width below the gallery.
     */
    stack: z.object({ text: z.string().optional(), tools: z.array(z.string()) }).optional(),
    /** `image` is a registry key; without it the placeholder shows `caption`. */
    gallery: z.array(z.object({ caption: z.string(), image: z.string().optional() })).optional(),
    results: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    quote: z.object({ text: z.string(), name: z.string(), role: z.string() }).optional(),
    /** Closing question on the case study page. */
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
    /** Key into the image registry (src/lib/images.ts). */
    coverImage: z.string().optional(),
    /** Placeholder caption, shown while the entry has no `coverImage`. */
    coverCaption: z.string(),
    draft: z.boolean().default(false),
    /** Defaults to siteConfig.author. */
    author: z.string().optional(),
    /** Closing question on the article page; falls back to the Insights page CTA. */
    ctaTitle: z.string().optional(),
  }),
});

export const collections = { work, insights };
