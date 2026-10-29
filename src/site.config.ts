export const siteConfig = {
  name: 'Minimalist',
  url: 'https://minimalist.hr',
  email: 'hello@minimalist.hr',
  /** Default byline for insights. */
  author: 'Filip Mučnjak',

  /** Show the Insights section in navigation and routes. */
  showInsights: true,

  /** Business details shown in the footer and on the Legal page. */
  company: {
    legalName: 'Minimalist, obrt za razvoj softvera',
    owner: 'Filip Mučnjak',
    street: 'Hamići 13',
    postalCode: '10000',
    city: 'Zagreb',
    /** Personal identification number (OIB). */
    oib: '43828040803',
    /** Business registration number (matični broj obrta). */
    registrationNumber: '99363119',
    bank: 'ERSTE & STEIERMÄRKISCHE BANK d.d.',
    iban: 'HR3824020061140662890',
  },
} as const;
