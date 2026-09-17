import type { Locale } from '../i18n/config';
import type { RouteKey } from '../i18n/routes';
import type { UiKey } from '../i18n/ui';
import { localizedPath, useTranslations } from '../i18n/utils';
import { siteConfig } from '../site.config';

/** Routes that appear in navigation (every page except home, which the wordmark links to). */
export type NavRoute = Exclude<RouteKey, 'home'>;

/** Each nav route needs a `nav.<route>` UI string; this fails to type-check if one is missing. */
const navLabelKey = (route: NavRoute) => `nav.${route}` as const satisfies UiKey;

export const primaryNav = [
  'work',
  'services',
  'approach',
  'skills',
  'about',
  'insights',
  'contact',
] as const satisfies readonly NavRoute[];

export const footerNav = {
  primary: ['work', 'services', 'approach', 'skills'],
  secondary: ['about', 'insights', 'contact', 'legal'],
} as const satisfies Record<string, readonly NavRoute[]>;

export interface NavItem {
  route: NavRoute;
  href: string;
  label: string;
  current: boolean;
}

/** A route is current on its own page and on pages below it (e.g. a case study under Work). */
function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return path === href || path.startsWith(href);
}

function isEnabled(route: NavRoute): boolean {
  return route !== 'insights' || siteConfig.showInsights;
}

/** Resolve nav routes into localised links, dropping disabled sections. */
export function buildNav(routes: readonly NavRoute[], locale: Locale, pathname: string): NavItem[] {
  const t = useTranslations(locale);
  return routes.filter(isEnabled).map((route) => {
    const href = localizedPath(route, locale);
    return { route, href, label: t(navLabelKey(route)), current: isCurrent(href, pathname) };
  });
}
