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
    /** One line on the Work list card. */
    summary: z.string(),
    /** Result line on the home card, e.g. "p95 latency 340ms → 48ms". */
    cardMetric: z.string().optional(),
    /** 'in-progress' renders "[ case study in progress ]" instead of a link. */
    status: z.enum(['published', 'in-progress']),
    /** Appears in "Selected work" on the home page. */
    featured: z.boolean().default(false),
    order: z.number().int(),
    coverCaption: z.string(),
    results: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    quote: z.object({ text: z.string(), name: z.string(), role: z.string() }).optional(),
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
    coverCaption: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, insights };
