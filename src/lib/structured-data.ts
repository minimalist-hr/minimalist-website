/**
 * schema.org JSON-LD (wiki: SEO and metadata): Organization on the home page, Article on insights,
 * BreadcrumbList on case studies and insights. Values come from site.config and content.
 */
import { localeMeta, type Locale } from '../i18n/config';
import { localizedPath, useTranslations } from '../i18n/utils';
import { siteConfig } from '../site.config';
import type { InsightEntry } from './content';

export type StructuredData = Record<string, unknown>;

const absolute = (path: string) => new URL(path, siteConfig.url).href;

function organization(): StructuredData {
  const { company, email, name, url } = siteConfig;
  return {
    '@type': 'Organization',
    name,
    legalName: company.legalName,
    url,
    logo: absolute('/icon-512.png'),
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.street,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressCountry: 'HR',
    },
  };
}

export function organizationSchema(): StructuredData {
  return { '@context': 'https://schema.org', ...organization() };
}

export function articleSchema(entry: InsightEntry, locale: Locale, path: string): StructuredData {
  const { title, excerpt, date, author } = entry.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    datePublished: date.toISOString(),
    inLanguage: localeMeta[locale].htmlLang,
    mainEntityOfPage: absolute(path),
    image: absolute('/og/default.png'),
    author: { '@type': 'Person', name: author ?? siteConfig.author },
    publisher: organization(),
  };
}

/** Home › section › page, with localised names and URLs. */
export function breadcrumbSchema(
  locale: Locale,
  section: 'work' | 'insights',
  page: { name: string; path: string },
): StructuredData {
  const t = useTranslations(locale);
  const items = [
    { name: siteConfig.name, path: localizedPath('home', locale) },
    { name: t(`nav.${section}`), path: localizedPath(section, locale) },
    page,
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
