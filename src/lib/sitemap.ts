/**
 * Sitemap (plan §10). Built here rather than with @astrojs/sitemap, which pairs languages by
 * matching paths; our Croatian slugs are translated (/work/ ↔ /hr/radovi/), so the pairs come
 * from the route map and each entry's translationKey instead.
 */
import { defaultLocale, localeMeta, locales } from '../i18n/config';
import { routes, type RouteKey } from '../i18n/routes';
import { alternatesFor, type Alternates } from '../i18n/utils';
import { siteConfig } from '../site.config';
import { getEntryAlternates, getInsights, getPublishedWork } from './content';

/** Every indexable page, as the set of its localised paths. */
async function indexablePages(): Promise<Alternates[]> {
  const staticRoutes = (Object.keys(routes) as RouteKey[]).filter(
    (route) => route !== 'insights' || siteConfig.showInsights,
  );
  const pages = staticRoutes.map(alternatesFor);

  const work = await getPublishedWork(defaultLocale);
  for (const entry of work) {
    pages.push(await getEntryAlternates('work', entry.data.translationKey));
  }

  if (siteConfig.showInsights) {
    const insights = await getInsights(defaultLocale);
    for (const entry of insights) {
      pages.push(await getEntryAlternates('insights', entry.data.translationKey));
    }
  }

  return pages;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** One <url> per language version, each listing all versions plus x-default (Google's format). */
export async function buildSitemap(site: URL): Promise<string> {
  const absolute = (path: string) => escapeXml(new URL(path, site).href);
  const urls: string[] = [];

  for (const alternates of await indexablePages()) {
    const links = [
      ...locales.map(
        (locale) =>
          `<xhtml:link rel="alternate" hreflang="${localeMeta[locale].htmlLang}" href="${absolute(alternates[locale])}"/>`,
      ),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(alternates[defaultLocale])}"/>`,
    ].join('');

    for (const locale of locales) {
      urls.push(`<url><loc>${absolute(alternates[locale])}</loc>${links}</url>`);
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n');
}
