import { localeMeta, type Locale } from '../i18n/config';

/** Words an average reader gets through per minute; used for the article reading time. */
const WORDS_PER_MINUTE = 200;

/** "2026 / 08", or "2026. / 08" in Croatian, as in the design (wiki: Internationalisation). */
export function formatInsightDate(date: Date, locale: Locale): string {
  const month = new Intl.DateTimeFormat(localeMeta[locale].intl, { month: '2-digit' }).format(date);
  const year = date.getFullYear();
  return locale === 'hr' ? `${year}. / ${month}` : `${year} / ${month}`;
}

/** Whole minutes, at least one, from the article body. */
export function readingTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
