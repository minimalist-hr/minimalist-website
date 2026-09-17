/** Supported locales. English is the default and lives at the site root; Croatian under /hr/. */
export const locales = ['en', 'hr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Per-locale metadata used for <html lang>, Open Graph and Intl formatting. */
export const localeMeta = {
  en: { htmlLang: 'en', ogLocale: 'en_GB', intl: 'en-GB', label: 'EN', name: 'English' },
  hr: { htmlLang: 'hr', ogLocale: 'hr_HR', intl: 'hr-HR', label: 'HR', name: 'Hrvatski' },
} as const satisfies Record<Locale, Record<string, string>>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
