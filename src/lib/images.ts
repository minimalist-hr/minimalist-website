import type { ImageMetadata } from 'astro';

import type { Localized } from '../i18n/localized';

/**
 * Alt text lives here rather than beside the copy, so one image has one description in both
 * languages wherever it appears. A file `<key>-light.<ext>` next to an image is its light-theme
 * version.
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

/** A point on an image, in percent of its width and height. */
export type NotePoint = readonly [x: number, y: number];

/**
 * A note on a screenshot: a hairline box around a feature and a leader
 * line from the box out into the empty background, ending in a short label.
 */
export interface ImageNote {
  /** The highlighted area: left, top, width, height. */
  box: readonly [x: number, y: number, width: number, height: number];
  /**
   * The leader line, from a point on the box edge to where the label starts. Every segment is
   * horizontal or vertical; the label continues in the direction of the last one.
   */
  path: readonly NotePoint[];
  /** The most room the label may take, in percent of the image width, when something is in
   * its way before the image edge. */
  width?: number;
  text: Localized<string>;
}

/**
 * Notes per image, shown only where a slot asks for them (the case study). Positions assume
 * the slot's ratio is the file's, so nothing is cropped away.
 */
const notes = {
  'work-lift-mucnjak-hero': [
    {
      box: [75.25, 13.3, 14.75, 2.9],
      path: [
        [82.6, 13.3],
        [82.6, 5.5],
        [78, 5.5],
      ],
      text: {
        en: 'The 24/7 line at the top of every page',
        hr: 'Hitna linija na vrhu svake stranice',
      },
    },
    {
      box: [23.5, 22.2, 32, 3.6],
      path: [
        [30, 22.2],
        [30, 5.5],
        [27, 5.5],
      ],
      text: {
        en: 'Real pages search engines can read',
        hr: 'Prave stranice koje tražilice čitaju',
      },
    },
    {
      box: [55, 40, 7.5, 19.1],
      path: [
        [58.75, 59.1],
        [58.75, 95],
        [62, 95],
      ],
      text: {
        en: 'The lift rides down as you scroll',
        hr: 'Dizalo se spušta dok listate',
      },
    },
  ],
  'work-lift-mucnjak-forms': [
    {
      box: [48.6, 18.1, 40.6, 43.1],
      path: [
        [70, 61.2],
        [70, 64],
      ],
      text: {
        en: 'Quote request, for the office',
        hr: 'Upit za ponudu, za ured',
      },
    },
    {
      box: [11.6, 49.1, 27.3, 36.5],
      path: [
        [38.9, 80],
        [52, 80],
      ],
      text: {
        en: 'Fault report, straight to the technician on call',
        hr: 'Prijava kvara, ravno dežurnom tehničaru',
      },
    },
  ],
  'work-lift-mucnjak-mobile': [
    {
      box: [9.9, 29.8, 35.1, 48.2],
      path: [
        [14, 78],
        [14, 86],
        [18, 86],
      ],
      width: 32,
      text: {
        en: 'How we work, in four steps',
        hr: 'Način rada u četiri koraka',
      },
    },
    {
      box: [56.5, 47.9, 32.6, 12.2],
      path: [
        [56.5, 57],
        [50, 57],
        [50, 94],
        [46, 94],
      ],
      text: {
        en: 'Emergency line, email and address in one place',
        hr: 'Hitna linija, e-pošta i adresa na jednom mjestu',
      },
    },
  ],
} satisfies Partial<Record<ImageKey, readonly ImageNote[]>>;

export interface StudioImage {
  src: ImageMetadata;
  /** The light-theme version, when the image has one. */
  light?: ImageMetadata;
  alt: Localized<string>;
  notes?: readonly ImageNote[];
}

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpg,png}', {
  eager: true,
});

function file(name: string): ImageMetadata | undefined {
  return (files[`../assets/images/${name}.jpg`] ?? files[`../assets/images/${name}.png`])?.default;
}

/** Every key must have a file; a typo fails the build rather than rendering nothing. */
export const studioImages: Record<ImageKey, StudioImage> = Object.fromEntries(
  (Object.keys(alt) as ImageKey[]).map((key) => {
    const src = file(key);
    if (!src) throw new Error(`No image file for "${key}" in src/assets/images/`);
    const light = file(`${key}-light`);
    const imageNotes = (notes as Partial<Record<ImageKey, readonly ImageNote[]>>)[key];
    return [
      key,
      { src, ...(light && { light }), alt: alt[key], ...(imageNotes && { notes: imageNotes }) },
    ];
  }),
) as Record<ImageKey, StudioImage>;

/** `undefined` (no key, or a key from content that does not exist) keeps the placeholder. */
export function studioImage(key: string | undefined): StudioImage | undefined {
  return key && key in studioImages ? studioImages[key as ImageKey] : undefined;
}
