import { getCollection, type CollectionEntry } from 'astro:content';

import { locales, type Locale } from '../i18n/config';
import { localizedPath, type Alternates } from '../i18n/utils';

export type WorkEntry = CollectionEntry<'work'>;
export type InsightEntry = CollectionEntry<'insights'>;

/** File name without the locale folder; this is the URL slug in that language. */
export function slugOf(entry: WorkEntry | InsightEntry): string {
  return entry.id.split('/').pop() ?? entry.id;
}

export function workPath(entry: WorkEntry, locale: Locale): string {
  return `${localizedPath('work', locale)}${slugOf(entry)}/`;
}

export function insightPath(entry: InsightEntry, locale: Locale): string {
  return `${localizedPath('insights', locale)}${slugOf(entry)}/`;
}

/** Case studies in one language, lowest `order` first. */
export async function getWork(locale: Locale): Promise<WorkEntry[]> {
  const entries = await getCollection('work', (entry) => entry.data.locale === locale);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Case studies shown in "Selected work" on the home page. */
export async function getFeaturedWork(locale: Locale): Promise<WorkEntry[]> {
  return (await getWork(locale)).filter((entry) => entry.data.featured);
}

/** Case studies with a page of their own; entries still being written have none. */
export async function getPublishedWork(locale: Locale): Promise<WorkEntry[]> {
  return (await getWork(locale)).filter((entry) => entry.data.status === 'published');
}

/**
 * Paths of one entry in every language, for hreflang and the language switch.
 * Entries are paired by `translationKey`; a language without a translation falls back
 * to that language's list page.
 */
export async function getEntryAlternates(
  collection: 'work' | 'insights',
  translationKey: string,
): Promise<Alternates> {
  const entries = await getCollection(collection, (e) => e.data.translationKey === translationKey);
  const listRoute = collection === 'work' ? 'work' : 'insights';

  return Object.fromEntries(
    locales.map((locale) => {
      const listPath = localizedPath(listRoute, locale);
      const match = entries.find((entry) => entry.data.locale === locale);
      return [locale, match ? `${listPath}${slugOf(match)}/` : listPath];
    }),
  ) as Alternates;
}

/** Published insights in one language, newest first. Drafts are excluded from builds. */
export async function getInsights(locale: Locale): Promise<InsightEntry[]> {
  const entries = await getCollection(
    'insights',
    (entry) => entry.data.locale === locale && !entry.data.draft,
  );
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
