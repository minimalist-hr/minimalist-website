import type { Localized } from '../i18n/localized';

export interface Stat {
  value: string;
  label: Localized<string>;
}

export const stats: Stat[] = [
  { value: '5+', label: { en: 'Years of experience', hr: 'Godina iskustva' } },
  { value: '30+', label: { en: 'Products built', hr: 'Izgrađenih proizvoda' } },
  {
    value: '0',
    label: { en: 'Layers between you and the build', hr: 'Slojeva između vas i izrade' },
  },
];
