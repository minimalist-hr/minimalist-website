import type { ImageMetadata } from 'astro';

import type { Localized } from '../i18n/localized';

/**
 * The photographs used across the site (plan §3.4).
 *
 * The files in `src/assets/images/` are already greyscale and carry the brand's treatment
 * (contrast 0.92, brightness 1.04); nothing is filtered in CSS. Astro crops each one to the
 * ratio the slot asks for and emits the responsive sizes.
 *
 * Alt text lives here rather than beside the copy, so one image has one description in both
 * languages wherever it appears. Slots that still have no photograph keep the striped
 * placeholder and its caption instead.
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
} satisfies Record<string, Localized<string>>;

export type ImageKey = keyof typeof alt;

export interface StudioImage {
  src: ImageMetadata;
  alt: Localized<string>;
}

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.jpg', {
  eager: true,
});

/** Every key must have a file; a typo fails the build rather than rendering nothing. */
export const studioImages: Record<ImageKey, StudioImage> = Object.fromEntries(
  (Object.keys(alt) as ImageKey[]).map((key) => {
    const file = files[`../assets/images/${key}.jpg`];
    if (!file) throw new Error(`No image file for "${key}" in src/assets/images/`);
    return [key, { src: file.default, alt: alt[key] }];
  }),
) as Record<ImageKey, StudioImage>;

/** `undefined` (no key, or a key from content that does not exist) keeps the placeholder. */
export function studioImage(key: string | undefined): StudioImage | undefined {
  return key && key in studioImages ? studioImages[key as ImageKey] : undefined;
}
