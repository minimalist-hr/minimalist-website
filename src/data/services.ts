import type { ImageKey } from '../lib/images';
import type { Localized } from '../i18n/localized';

/**
 * The four services (plan §2). Copy comes from the design; the Services page adds
 * "Solves" and "You receive" lists to the same items later.
 */
export interface Service {
  number: string;
  title: Localized<string>;
  /** One line, used on the home page. */
  description: Localized<string>;
  /** Longer description, used on the Services page. */
  detail: Localized<string>;
  /** The client sentence this service answers. */
  solves: Localized<string>;
  /** What the client ends up with. */
  receives: Localized<string>;
  /** Photograph for the service, keyed into the image registry. */
  image: ImageKey;
  /** Placeholder caption, shown only while `image` has no file. */
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
    detail: {
      en: 'A product taken from a blank page to something people use every day — interface, architecture and delivery handled by the same hands.',
      hr: 'Proizvod od prazne stranice do nečega što ljudi koriste svaki dan — sučelje, arhitektura i dostava u istim rukama.',
    },
    solves: {
      en: '“We know what we want to build and need it built properly, once.”',
      hr: '„Znamo što želimo izgraditi i treba nam napravljeno kako treba, iz prve.”',
    },
    receives: {
      en: 'A shipped product, the source, the infrastructure, and documentation your own team can pick up.',
      hr: 'Objavljen proizvod, izvorni kod, infrastrukturu i dokumentaciju koju vaš tim može preuzeti.',
    },
    image: 'service-product',
    caption: 'photo / design session, wall of screens',
  },
  {
    number: '02',
    title: { en: 'Custom software', hr: 'Softver po mjeri' },
    description: {
      en: 'Internal systems built around how the work actually happens.',
      hr: 'Interni sustavi građeni oko stvarnog načina rada.',
    },
    detail: {
      en: "Internal systems shaped around how the work actually happens, instead of forcing the work into someone else's product.",
      hr: 'Interni sustavi oblikovani prema stvarnom načinu rada, umjesto da se rad prilagođava tuđem proizvodu.',
    },
    solves: {
      en: "“Our process lives in eleven spreadsheets and three people's heads.”",
      hr: '„Naš proces živi u jedanaest tablica i u glavama triju ljudi.”',
    },
    receives: {
      en: 'One system, integrated with what you already run, with the manual steps removed.',
      hr: 'Jedan sustav, integriran s postojećim, bez ručnih koraka.',
    },
    image: 'service-custom',
    caption: 'screens / one internal system replacing eleven',
  },
  {
    number: '03',
    title: { en: 'Modernization', hr: 'Modernizacija' },
    description: {
      en: 'Fragile systems rebuilt into clean architecture, nothing lost.',
      hr: 'Krhki sustavi prelaze u čistu arhitekturu, bez gubitaka.',
    },
    detail: {
      en: "Fragile systems rebuilt into clean architecture, preserving everything that already works and deleting everything that doesn't.",
      hr: 'Krhki sustavi prelaze u čistu arhitekturu, uz zadržavanje svega što radi i brisanje svega što ne radi.',
    },
    solves: {
      en: '“It works, but every change is expensive and nobody wants to touch it.”',
      hr: '„Radi, ali svaka promjena je skupa i nitko to ne želi dirati.”',
    },
    receives: {
      en: 'A migration plan, a parallel run, a switchover without downtime, and a smaller system afterwards.',
      hr: 'Plan migracije, paralelni rad, prijelaz bez zastoja i manji sustav nakon toga.',
    },
    image: 'service-modernization',
    caption: 'photo / old system beside its replacement',
  },
  {
    number: '04',
    title: { en: 'Technical strategy', hr: 'Tehnička strategija' },
    description: {
      en: 'A second senior opinion before the expensive decision.',
      hr: 'Drugo stručno mišljenje prije skupe odluke.',
    },
    detail: {
      en: 'A senior second opinion before an expensive decision: build or buy, rewrite or refactor, hire or outsource.',
      hr: 'Stručno drugo mišljenje prije skupe odluke: graditi ili kupiti, pisati iznova ili refaktorirati, zaposliti ili prepustiti.',
    },
    solves: {
      en: '“Three vendors gave us three answers and all of them are selling something.”',
      hr: '„Tri dobavljača dala su tri odgovora i svi nešto prodaju.”',
    },
    receives: {
      en: 'A written assessment, a recommended path, the cost of each option, and no obligation to hire us for it.',
      hr: 'Pisanu procjenu, preporučeni put, trošak svake opcije i nikakvu obvezu da nas angažirate.',
    },
    image: 'service-strategy',
    caption: 'photo / architecture decision on a whiteboard',
  },
];
