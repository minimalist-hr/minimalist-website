import type { Localized } from '../i18n/localized';

/**
 * About page content (plan §2).
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
    en: 'Minimalist is a small senior studio, by design. The people who scope your project are the ones who design it, write it, and stand behind it afterwards. No account layer, no handoffs, no diluted accountability.',
    hr: 'Minimalist je namjerno malen studio iskusnih inženjera. Oni koji definiraju vaš projekt isti su koji ga dizajniraju, pišu i za njega odgovaraju i nakon predaje. Bez posrednika, bez predavanja posla, bez razvodnjene odgovornosti.',
  },
  {
    en: 'Five-plus years building software and more than thirty products shipped, most of it in regulated and legacy-heavy environments. Design, architecture, code, migration and support all stay in the same hands — nothing is subcontracted and nothing is handed off.',
    hr: 'Više od pet godina razvoja softvera i više od trideset objavljenih proizvoda, većinom u reguliranim okruženjima i uz zastarjele sustave. Dizajn, arhitektura, kod, migracija i podrška ostaju u istim rukama. Ništa se ne prepušta podizvođačima i ništa se ne predaje dalje.',
  },
];

export const profile = {
  name: 'Filip Mučnjak',
  role: { en: 'Founder', hr: 'Osnivač' },
  roleSecondary: { en: 'Principal engineer', hr: 'Glavni inženjer' },
  email: 'filip.mucnjak@minimalist.hr',
  portfolio: 'https://mucnjakf.dev/',
  experience: { en: '5+ years, 30+ products', hr: '5+ godina, 30+ proizvoda' },
  languages: { en: 'Croatian, English', hr: 'Hrvatski, engleski' },
  workingWith: { en: 'Clients across the EU and US', hr: 'Klijentima u EU i SAD-u' },
  portrait: 'portrait-filip',
  /** Placeholder caption, shown only while `portrait` has no file. */
  portraitCaption: 'portrait / 4:5 / greyscale, flat light',
} as const;
