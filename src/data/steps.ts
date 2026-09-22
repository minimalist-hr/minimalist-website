import type { ImageKey } from '../lib/images';
import type { Localized } from '../i18n/localized';

/** The six engagement steps, same order on every project (plan §2, Approach). */
export interface Step {
  number: string;
  title: Localized<string>;
  /** One line, used on the home page. */
  description: Localized<string>;
  /** Longer description, used on the Approach page. */
  detail: Localized<string>;
  /** Photograph for the step, keyed into the image registry. */
  image: ImageKey;
  /** Placeholder caption, shown only while `image` has no file. */
  caption: string;
}

export const steps: Step[] = [
  {
    number: '01',
    title: { en: 'Discovery', hr: 'Otkrivanje' },
    description: {
      en: 'We learn the business, the constraints, and what is actually broken.',
      hr: 'Upoznajemo posao, ograničenja i ono što je zaista pokvareno.',
    },
    detail: {
      en: 'One week. We read the code, talk to the people who use the system, and write down what is actually true. No proposal before this.',
      hr: 'Jedan tjedan. Čitamo kod, razgovaramo s ljudima koji koriste sustav i zapisujemo što je stvarno točno. Nema ponude prije toga.',
    },
    image: 'step-discovery',
    caption: 'photo / notes from a discovery week',
  },
  {
    number: '02',
    title: { en: 'Definition', hr: 'Definiranje' },
    description: {
      en: 'Scope, price and timeline fixed in writing before anything is built.',
      hr: 'Obuhvat, cijena i rok fiksiramo pisano prije izrade.',
    },
    detail: {
      en: 'Scope, sequence, fixed price and a list of what we are deliberately not building. Signed before anything starts.',
      hr: 'Obuhvat, slijed, fiksna cijena i popis onoga što namjerno ne gradimo. Potpisano prije početka.',
    },
    image: 'step-definition',
    caption: 'document / signed scope and fixed price',
  },
  {
    number: '03',
    title: { en: 'Design', hr: 'Dizajn' },
    description: {
      en: 'Flows and interface built around the two decisions a user makes.',
      hr: 'Tokovi i sučelje oko dvije odluke koje korisnik donosi.',
    },
    detail: {
      en: 'Interface and architecture decided together, because one determines the other. You see real screens, not mood boards.',
      hr: 'Sučelje i arhitektura odlučuju se zajedno, jer jedno određuje drugo. Vidite prave ekrane, ne mood boardove.',
    },
    image: 'step-design',
    caption: 'screens / real interface, first pass',
  },
  {
    number: '04',
    title: { en: 'Build', hr: 'Izrada' },
    description: {
      en: 'Clean architecture, tested code, weekly builds you can click.',
      hr: 'Čista arhitektura, testiran kod, tjedne verzije koje možete kliknuti.',
    },
    detail: {
      en: 'Weekly releases to a staging environment you can open at any time. One update every Friday, in writing, in plain language.',
      hr: 'Tjedna izdanja na okruženju koje možete otvoriti kad želite. Jedan pisani izvještaj svakog petka, bez žargona.',
    },
    image: 'step-build',
    caption: 'screens / weekly staging release',
  },
  {
    number: '05',
    title: { en: 'Launch', hr: 'Pokretanje' },
    description: {
      en: 'Deployment, monitoring and handover documentation in place.',
      hr: 'Objava, nadzor i dokumentacija za preuzimanje.',
    },
    detail: {
      en: 'Parallel run, migration, switchover. Monitoring and alerting in place before the first real user arrives.',
      hr: 'Paralelni rad, migracija, prijelaz. Nadzor i upozorenja postavljeni prije prvog pravog korisnika.',
    },
    image: 'step-launch',
    caption: 'photo / switchover under monitoring',
  },
  {
    number: '06',
    title: { en: 'Support', hr: 'Podrška' },
    description: {
      en: 'A named engineer stays on, month to month, no lock-in.',
      hr: 'Imenovani inženjer ostaje, mjesečno, bez vezivanja.',
    },
    detail: {
      en: 'A monthly retainer if you want us close, a clean handover if you don’t. Either way the system is yours and documented.',
      hr: 'Mjesečni angažman ako nas želite blizu ili čista predaja ako ne. U svakom slučaju sustav je vaš i dokumentiran.',
    },
    image: 'step-support',
    caption: 'photo / handover documentation',
  },
];
