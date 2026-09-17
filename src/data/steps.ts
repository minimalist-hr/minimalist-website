import type { Localized } from '../i18n/localized';

/** The six engagement steps, same order on every project (plan §2, Approach). */
export interface Step {
  number: string;
  title: Localized<string>;
  description: Localized<string>;
}

export const steps: Step[] = [
  {
    number: '01',
    title: { en: 'Discovery', hr: 'Otkrivanje' },
    description: {
      en: 'We learn the business, the constraints, and what is actually broken.',
      hr: 'Upoznajemo posao, ograničenja i ono što je zaista pokvareno.',
    },
  },
  {
    number: '02',
    title: { en: 'Definition', hr: 'Definiranje' },
    description: {
      en: 'Scope, price and timeline fixed in writing before anything is built.',
      hr: 'Obuhvat, cijena i rok fiksiramo pisano prije izrade.',
    },
  },
  {
    number: '03',
    title: { en: 'Design', hr: 'Dizajn' },
    description: {
      en: 'Flows and interface built around the two decisions a user makes.',
      hr: 'Tokovi i sučelje oko dvije odluke koje korisnik donosi.',
    },
  },
  {
    number: '04',
    title: { en: 'Build', hr: 'Izrada' },
    description: {
      en: 'Clean architecture, tested code, weekly builds you can click.',
      hr: 'Čista arhitektura, testiran kod, tjedne verzije koje možete kliknuti.',
    },
  },
  {
    number: '05',
    title: { en: 'Launch', hr: 'Pokretanje' },
    description: {
      en: 'Deployment, monitoring and handover documentation in place.',
      hr: 'Objava, nadzor i dokumentacija za preuzimanje.',
    },
  },
  {
    number: '06',
    title: { en: 'Support', hr: 'Podrška' },
    description: {
      en: 'A named engineer stays on, month to month, no lock-in.',
      hr: 'Imenovani inženjer ostaje, mjesečno, bez vezivanja.',
    },
  },
];
