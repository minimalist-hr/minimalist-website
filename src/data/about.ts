import type { Localized } from '../i18n/localized';

/**
 * About page content (plan §2). The profile values are real details from the design —
 * ⚠️ verify them before launch (plan §15).
 */

export const principles: Localized<string>[] = [
  { en: 'Purpose before features.', hr: 'Svrha prije funkcija.' },
  { en: 'Engineered to endure.', hr: 'Građeno da traje.' },
  { en: 'Clarity at every layer.', hr: 'Jasnoća na svakom sloju.' },
  { en: 'Craft without compromise.', hr: 'Izrada bez kompromisa.' },
  { en: 'Honest partnership.', hr: 'Iskreno partnerstvo.' },
];

export const manifesto: Localized<string>[] = [
  {
    en: 'Every product begins with noise. Too many features. Too many opinions. Too many ways to go wrong.',
    hr: 'Svaki proizvod počinje šumom. Previše funkcija. Previše mišljenja. Previše načina da se pogriješi.',
  },
  { en: 'Our work is to remove it.', hr: 'Naš je posao taj šum ukloniti.' },
  {
    en: 'The best software feels inevitable, as if it could not have been built any other way. That feeling is never an accident. It is the result of disciplined thinking, deliberate design, and engineering that holds up long after launch.',
    hr: 'Najbolji softver djeluje neizbježno, kao da se nije mogao izgraditi drugačije. Taj osjećaj nikada nije slučajan. Rezultat je discipliniranog razmišljanja, promišljenog dizajna i inženjerstva koje traje dugo nakon objave.',
  },
  {
    en: 'Complexity is easy. Anyone can add. Clarity is earned. It takes judgment to know what to leave out.',
    hr: 'Složenost je lako postići. Dodavati zna svatko. Jasnoća se zarađuje. Treba prosudba da se zna što izostaviti.',
  },
];

export const studioDescription: Localized<string>[] = [
  {
    en: 'Minimalist is one senior engineer, by design. The person who scopes your project is the person who designs it, writes it, and stands behind it afterwards. No account layer, no handoffs, no diluted accountability.',
    hr: 'Minimalist je namjerno jedan iskusan inženjer. Osoba koja definira vaš projekt ista je koja ga dizajnira, piše i za njega odgovara i nakon predaje. Bez posrednika, bez predavanja posla, bez razvodnjene odgovornosti.',
  },
  {
    en: 'Five-plus years building software and more than thirty products shipped, most of it in regulated and legacy-heavy environments. Design, architecture, code, migration and support are all done by the same person — nothing is subcontracted and nothing is handed off.',
    hr: 'Više od pet godina razvoja softvera i više od trideset objavljenih proizvoda, većinom u reguliranim okruženjima i uz zastarjele sustave. Dizajn, arhitektura, kod, migracija i podrška — sve radi ista osoba. Ništa se ne prepušta podizvođačima i ništa se ne predaje dalje.',
  },
];

export const profile = {
  name: 'Filip Mučnjak',
  role: { en: 'Founder', hr: 'Osnivač' },
  roleSecondary: { en: 'Principal engineer', hr: 'Glavni inženjer' },
  email: 'filip.mucnjak@minimalist.hr',
  portfolio: 'https://mucnjakf.github.io/Portfolio/',
  experience: { en: '5+ years, 30+ products', hr: '5+ godina, 30+ proizvoda' },
  languages: { en: 'Croatian, English', hr: 'Hrvatski, engleski' },
  workingWith: { en: 'Clients across the EU and US', hr: 'Klijentima u EU i SAD-u' },
  portraitCaption: 'portrait / 4:5 / greyscale, flat light',
} as const;
