import type { Locale } from './config';

/**
 * EN ↔ HR route map (plan §2). Every static page has an entry, so the language
 * switcher and hreflang links always point to the equivalent page.
 * Paths always end with a slash (trailingSlash: 'always').
 *
 * Detail pages (case studies, insights) are built from content collections and
 * paired by their translationKey; their base paths come from `work` and `insights`.
 */
export const routes = {
  home: { en: '/', hr: '/hr/' },
  work: { en: '/work/', hr: '/hr/radovi/' },
  services: { en: '/services/', hr: '/hr/usluge/' },
  approach: { en: '/approach/', hr: '/hr/pristup/' },
  skills: { en: '/skills/', hr: '/hr/vjestine/' },
  about: { en: '/about/', hr: '/hr/o-studiju/' },
  insights: { en: '/insights/', hr: '/hr/zapisi/' },
  contact: { en: '/contact/', hr: '/hr/kontakt/' },
  legal: { en: '/legal/', hr: '/hr/pravno/' },
} as const satisfies Record<string, Record<Locale, `/${string}`>>;

export type RouteKey = keyof typeof routes;
