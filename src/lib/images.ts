import type { ImageMetadata } from 'astro';

import type { Localized } from '../i18n/localized';

/**
 * The photographs used across the site (wiki: Design system).
 *
 * The files in `src/assets/images/` are full colour and untreated, which is a deliberate
 * departure from the brand's greyscale rule (wiki: Design system). Nothing is filtered in CSS either
 * way. Astro crops each one to the ratio the slot asks for and emits the responsive sizes.
 *
 * Alt text lives here rather than beside the copy, so one image has one description in both
 * languages wherever it appears. Slots that still have no photograph keep the striped
 * placeholder and its caption instead.
 *
 * Photographs are JPEG; screenshots of client work are PNG, so text stays sharp until Astro
 * encodes the served sizes.
 */

/** Alt text per image, in both languages. A missing HR entry fails the build. */
const alt = {
  'service-product': {
    en: 'Three monitors on a desk with code open across them.',
    hr: 'Tri monitora na stolu s otvorenim kodom.',
  },
  'service-custom': {
    en: 'A dashboard on a screen: two charts and a row of figures.',
    hr: 'Nadzorna ploča na ekranu: dva grafikona i red brojki.',
  },
  'service-modernization': {
    en: 'Two server racks with cabling running down the front.',
    hr: 'Dva poslužiteljska ormara s kabelima niz prednju stranu.',
  },
  'service-strategy': {
    en: 'Someone drawing a workflow on a whiteboard.',
    hr: 'Netko crta tok rada na bijeloj ploči.',
  },
  'step-discovery': {
    en: 'An open notebook and a pen on a desk.',
    hr: 'Otvorena bilježnica i olovka na stolu.',
  },
  'step-definition': {
    en: 'A hand signing a document.',
    hr: 'Ruka potpisuje dokument.',
  },
  'step-design': {
    en: 'Interface sketches laid out on paper.',
    hr: 'Skice sučelja razložene na papiru.',
  },
  'step-build': {
    en: 'Source code on a screen.',
    hr: 'Izvorni kod na ekranu.',
  },
  'step-launch': {
    en: 'Status boards showing rows of live data.',
    hr: 'Nadzorne ploče s redovima podataka uživo.',
  },
  'step-support': {
    en: 'A stack of printed documentation.',
    hr: 'Hrpa ispisane dokumentacije.',
  },
  'portrait-filip': {
    en: 'Filip Mučnjak, founder of Minimalist.',
    hr: 'Filip Mučnjak, osnivač Minimalista.',
  },
  'insight-diagram': {
    en: 'A system diagram drawn on a whiteboard.',
    hr: 'Dijagram sustava nacrtan na bijeloj ploči.',
  },
  'insight-wireframes': {
    en: 'Someone drawing page layouts on a tablet at a desk.',
    hr: 'Netko crta rasporede stranica na tabletu za stolom.',
  },
  'work-lift-mucnjak-cover': {
    en: 'The Lift-Mučnjak home page on a desktop browser and a phone.',
    hr: 'Početna stranica Lift-Mučnjaka u pregledniku na računalu i na mobitelu.',
  },
  'work-lift-mucnjak-hero': {
    en: 'The Lift-Mučnjak home page on a desktop browser and a phone: the headline, the 24/7 line and the lift illustration.',
    hr: 'Početna stranica Lift-Mučnjaka u pregledniku na računalu i na mobitelu: naslov, hitna linija 0–24 i ilustracija dizala.',
  },
  'work-lift-mucnjak-forms': {
    en: 'The two Lift-Mučnjak forms: the quote request on desktop and the fault report on a phone.',
    hr: 'Dva obrasca Lift-Mučnjaka: upit za ponudu na računalu i prijava kvara na mobitelu.',
  },
  'work-lift-mucnjak-mobile': {
    en: 'Two Lift-Mučnjak pages on phones: the four steps of how they work, and the contact details.',
    hr: 'Dvije stranice Lift-Mučnjaka na mobitelima: četiri koraka načina rada i kontakt podaci.',
  },
} satisfies Record<string, Localized<string>>;

export type ImageKey = keyof typeof alt;

export interface StudioImage {
  src: ImageMetadata;
  alt: Localized<string>;
}

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpg,png}', {
  eager: true,
});

/** Every key must have a file; a typo fails the build rather than rendering nothing. */
export const studioImages: Record<ImageKey, StudioImage> = Object.fromEntries(
  (Object.keys(alt) as ImageKey[]).map((key) => {
    const file = files[`../assets/images/${key}.jpg`] ?? files[`../assets/images/${key}.png`];
    if (!file) throw new Error(`No image file for "${key}" in src/assets/images/`);
    return [key, { src: file.default, alt: alt[key] }];
  }),
) as Record<ImageKey, StudioImage>;

/** `undefined` (no key, or a key from content that does not exist) keeps the placeholder. */
export function studioImage(key: string | undefined): StudioImage | undefined {
  return key && key in studioImages ? studioImages[key as ImageKey] : undefined;
}
