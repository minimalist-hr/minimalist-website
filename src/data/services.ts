import type { Localized } from '../i18n/localized';

/**
 * The four services (plan §2). Copy comes from the design; the Services page adds
 * "Solves" and "You receive" lists to the same items later.
 */
export interface Service {
  number: string;
  title: Localized<string>;
  description: Localized<string>;
  /** Placeholder caption until real photography exists (plan §3.4). */
  caption: string;
}

export const services: Service[] = [
  {
    number: '01',
    title: { en: 'Product design & development', hr: 'Dizajn i razvoj proizvoda' },
    description: {
      en: 'From a blank page to a product in the market.',
      hr: 'Od prazne stranice do proizvoda na tržištu.',
    },
    caption: 'photo / design session, wall of screens',
  },
  {
    number: '02',
    title: { en: 'Custom software', hr: 'Softver po mjeri' },
    description: {
      en: 'Internal systems built around how the work actually happens.',
      hr: 'Interni sustavi građeni oko stvarnog načina rada.',
    },
    caption: 'screens / one internal system replacing eleven',
  },
  {
    number: '03',
    title: { en: 'Modernization', hr: 'Modernizacija' },
    description: {
      en: 'Fragile systems rebuilt into clean architecture, nothing lost.',
      hr: 'Krhki sustavi prelaze u čistu arhitekturu, bez gubitaka.',
    },
    caption: 'photo / old system beside its replacement',
  },
  {
    number: '04',
    title: { en: 'Technical strategy', hr: 'Tehnička strategija' },
    description: {
      en: 'A second senior opinion before the expensive decision.',
      hr: 'Drugo stručno mišljenje prije skupe odluke.',
    },
    caption: 'photo / architecture decision on a whiteboard',
  },
];
