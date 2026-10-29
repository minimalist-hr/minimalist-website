import type { Locale } from './config';

/** Paths always end with a slash. Detail pages take their base path from `work` and `insights`. */
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
