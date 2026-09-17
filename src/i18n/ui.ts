import type { Locale } from './config';

/**
 * UI strings (navigation, buttons, labels, accessible names).
 * Page copy lives with the pages/content; only shared interface text belongs here.
 *
 * `en` defines the keys. `hr` is typed against them, so a missing or extra
 * Croatian key fails `pnpm run check`.
 */
const en = {
  'site.name': 'Minimalist',
  'site.description':
    'Minimalist is a software development studio. We design and build software that does exactly what it should. Complex problems. Simple solutions.',
  'site.tagline': 'Less noise. Better software.',

  'nav.work': 'Work',
  'nav.services': 'Services',
  'nav.approach': 'Approach',
  'nav.skills': 'Skills',
  'nav.about': 'About',
  'nav.insights': 'Insights',
  'nav.contact': 'Contact',
  'nav.legal': 'Legal',

  'a11y.skipToContent': 'Skip to content',
  'a11y.home': 'Minimalist — home',
  'a11y.primaryNav': 'Primary',
  'a11y.footerNav': 'Footer',
  'a11y.footerNavSecondary': 'Footer secondary',
  'a11y.language': 'Language',
  'a11y.lightMode': 'Light mode',
  'a11y.openMenu': 'Menu',
  'a11y.closeMenu': 'Close menu',

  'cta.startProject': 'Start a project',
  'cta.seeWork': 'See the work',

  'work.readCaseStudy': 'Read the case study',
  'work.inProgress': '[ case study in progress ]',
  'insights.readInsight': 'Read the insight',

  'footer.country': 'Croatia',
  'footer.rights': 'All rights reserved.',

  'og.imageAlt': 'The Minimalist mark on an ink field',
} as const;

export type UiKey = keyof typeof en;

const hr: Record<UiKey, string> = {
  'site.name': 'Minimalist',
  'site.description':
    'Minimalist je studio za razvoj softvera. Osmišljavamo i razvijamo softver koji radi upravo ono što treba. Složeni problemi. Jednostavna rješenja.',
  'site.tagline': 'Manje šuma. Bolji softver.',

  'nav.work': 'Radovi',
  'nav.services': 'Usluge',
  'nav.approach': 'Pristup',
  'nav.skills': 'Vještine',
  'nav.about': 'O studiju',
  'nav.insights': 'Zapisi',
  'nav.contact': 'Kontakt',
  'nav.legal': 'Pravno',

  'a11y.skipToContent': 'Preskoči na sadržaj',
  'a11y.home': 'Minimalist — početna',
  'a11y.primaryNav': 'Glavna navigacija',
  'a11y.footerNav': 'Podnožje',
  'a11y.footerNavSecondary': 'Podnožje, dodatno',
  'a11y.language': 'Jezik',
  'a11y.lightMode': 'Svijetla tema',
  'a11y.openMenu': 'Izbornik',
  'a11y.closeMenu': 'Zatvori izbornik',

  'cta.startProject': 'Započnite projekt',
  'cta.seeWork': 'Pogledajte radove',

  'work.readCaseStudy': 'Pročitajte studiju',
  'work.inProgress': '[ studija u izradi ]',
  'insights.readInsight': 'Pročitajte zapis',

  'footer.country': 'Hrvatska',
  'footer.rights': 'Sva prava pridržana.',

  'og.imageAlt': 'Znak Minimalist na tamnoj podlozi',
};

export const ui: Record<Locale, Record<UiKey, string>> = { en, hr };
