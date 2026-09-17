import type { Locale } from './config';

/** A value written once per language, e.g. `{ en: 'Work', hr: 'Radovi' }`. */
export type Localized<T> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
