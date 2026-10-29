/** Shared by the form and the Worker: keep it free of browser, Astro and Workers APIs. */

export const timelineValues = ['asap', '1-3m', '3-6m', 'exploring'] as const;
export type Timeline = (typeof timelineValues)[number];

export const budgetValues = ['lt500', '500-2k', '2k-5k', '5k-15k', 'gt15k', 'unsure'] as const;
export type Budget = (typeof budgetValues)[number];

/** Budget amounts, shown the same in both languages (the form and the studio's email). */
export const budgetAmounts: Record<Exclude<Budget, 'unsure'>, string> = {
  lt500: '< €500',
  '500-2k': '€500 – €2,000',
  '2k-5k': '€2,000 – €5,000',
  '5k-15k': '€5,000 – €15,000',
  gt15k: '€15,000 +',
};

/** Maximum lengths, enforced by the form (maxlength) and again by the Worker. */
export const fieldLimits = {
  name: 120,
  email: 200,
  company: 120,
  role: 120,
  brief: 5000,
} as const;

/**
 * What counts as a valid email address, for the form and the Worker alike. Stricter than
 * the browser's own check, which accepts addresses without a dot in the domain.
 */
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Form field that must stay empty; bots fill it in. */
export const honeypotField = 'website';

export const contactEndpoint = '/api/contact';

/** JSON body the Worker returns to the JavaScript submit. */
export type InquiryResponse =
  | { ok: true }
  | { ok: false; error: 'invalid'; fields: string[] }
  | { ok: false; error: 'verification' | 'send' | 'unavailable' };
