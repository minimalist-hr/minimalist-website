/**
 * Site-wide facts and feature flags. Change values here, not in components.
 * ⚠️ Verify company details before launch (plan §8, §15).
 */
export const siteConfig = {
  name: 'Minimalist',
  url: 'https://minimalist.hr',
  email: 'hello@minimalist.hr',

  /** Show the Insights section in navigation and routes (design flag `showInsights`). */
  showInsights: true,

  company: {
    legalName: 'Minimalist, obrt za razvoj softvera',
    street: 'Hamići 13',
    postalCode: '10000',
    city: 'Zagreb',
  },
} as const;
