import type { Localized } from '../i18n/localized';

export interface FaqItem {
  question: Localized<string>;
  answer: Localized<string>;
}

export const faq: FaqItem[] = [
  {
    question: { en: 'How is a project priced?', hr: 'Kako se projekt naplaćuje?' },
    answer: {
      en: 'Discovery is a fixed fee. Every phase after it is fixed price, agreed and signed before it starts. There is no hourly billing and no change-request theatre.',
      hr: 'Otkrivanje je fiksna naknada. Svaka faza nakon toga ima fiksnu cijenu, dogovorenu i potpisanu prije početka. Nema naplate po satu ni pregovaranja oko svake promjene.',
    },
  },
  {
    question: { en: 'How soon can you start?', hr: 'Kada možete početi?' },
    answer: {
      en: 'Usually two to four weeks out. We commit only to a start date we can keep, so the one you are given is real.',
      hr: 'Obično za dva do četiri tjedna. Obvezujemo se samo na datum početka koji možemo održati, pa je onaj koji dobijete stvaran.',
    },
  },
  {
    question: { en: 'Who owns the code?', hr: 'Tko je vlasnik koda?' },
    answer: {
      en: 'You do — source, infrastructure and documentation, from the first commit. Ownership transfers as each phase is paid.',
      hr: 'Vi — izvorni kod, infrastruktura i dokumentacija, od prvog commita. Vlasništvo prelazi na vas kako se plaća svaka faza.',
    },
  },
  {
    question: { en: 'Will you sign an NDA?', hr: 'Potpisujete li NDA?' },
    answer: {
      en: 'Yes, before the first technical conversation if you prefer. Client names appear on this site only with written permission.',
      hr: 'Da, i prije prvog tehničkog razgovora ako tako želite. Imena klijenata objavljujemo isključivo uz pisano dopuštenje.',
    },
  },
  {
    question: {
      en: 'Can you work with our existing team?',
      hr: 'Možete li raditi s našim timom?',
    },
    answer: {
      en: 'Often the best setup. We can lead the build, pair with your engineers, or review what they ship — and we write so they can take it over.',
      hr: 'Često je to najbolji raspored. Možemo voditi izradu, raditi u paru s vašim inženjerima ili pregledavati ono što isporučuju — i pišemo tako da mogu preuzeti.',
    },
  },
  {
    question: { en: 'What happens after launch?', hr: 'Što se događa nakon pokretanja?' },
    answer: {
      en: 'A monthly retainer if you want us close, or a documented handover and we step away. No lock-in either way.',
      hr: 'Mjesečni angažman ako nas želite blizu ili dokumentirana predaja i mi se povlačimo. Ni u jednom slučaju nema zaključavanja.',
    },
  },
];
