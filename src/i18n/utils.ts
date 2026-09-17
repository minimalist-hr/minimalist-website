import { defaultLocale, isLocale, locales, type Locale } from './config';
import { routes, type RouteKey } from './routes';
import { ui, type UiKey } from './ui';

/** Resolve the locale for a page. Prefer Astro.currentLocale; fall back to the URL. */
export function getLocale(currentLocale: string | undefined, url?: URL): Locale {
  if (isLocale(currentLocale)) return currentLocale;
  const firstSegment = url?.pathname.split('/')[1];
  return isLocale(firstSegment) ? firstSegment : defaultLocale;
}

/** Returns a `t(key)` function bound to one locale. */
export function useTranslations(locale: Locale) {
  return function t(key: UiKey): string {
    return ui[locale][key];
  };
}

/** Path of a static page in the given locale, e.g. localizedPath('work', 'hr') → '/hr/radovi/'. */
export function localizedPath(route: RouteKey, locale: Locale): string {
  return routes[route][locale];
}

/** Find which route a pathname belongs to (exact match), e.g. for the 404 page. */
export function findRouteKey(pathname: string): RouteKey | undefined {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return (Object.keys(routes) as RouteKey[]).find((key) =>
    locales.some((locale) => routes[key][locale] === normalized),
  );
}

/** Localised paths of one page, keyed by locale (used for hreflang and the language switch). */
export type Alternates = Record<Locale, string>;

export function alternatesFor(route: RouteKey): Alternates {
  return { ...routes[route] };
}
