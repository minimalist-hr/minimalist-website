import { isLocale, type Locale } from '../i18n/config';
import {
  budgetValues,
  emailPattern,
  fieldLimits,
  timelineValues,
  type Budget,
  type Timeline,
} from '../lib/inquiry';

/** A submission that passed validation. Optional fields are empty strings when not given. */
export interface Inquiry {
  name: string;
  email: string;
  company: string;
  role: string;
  timeline?: Timeline;
  budget?: Budget;
  brief: string;
  locale: Locale;
}

export type ParseResult = { ok: true; inquiry: Inquiry } | { ok: false; fields: string[] };

/** Deliberately simple: the real check is that the reply arrives. */

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/** Single-line fields end up in the email subject; no line breaks there. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ');
}

function oneOf<T extends string>(value: string, allowed: readonly T[]): T | undefined {
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

/**
 * Server-side validation (authoritative, plan §9.2). Returns the names of invalid fields,
 * which the page uses to show messages.
 */
export function parseInquiry(form: FormData): ParseResult {
  const name = singleLine(text(form, 'name'));
  const email = singleLine(text(form, 'email'));
  const company = singleLine(text(form, 'company'));
  const role = singleLine(text(form, 'role'));
  const brief = text(form, 'brief');
  const localeValue = text(form, 'locale');

  const fields: string[] = [];
  if (!name || name.length > fieldLimits.name) fields.push('name');
  if (!emailPattern.test(email) || email.length > fieldLimits.email) fields.push('email');
  if (company.length > fieldLimits.company) fields.push('company');
  if (role.length > fieldLimits.role) fields.push('role');
  if (!brief || brief.length > fieldLimits.brief) fields.push('brief');
  // The privacy policy must be accepted (the form's required checkbox).
  if (text(form, 'consent') !== 'yes') fields.push('consent');

  if (fields.length > 0) return { ok: false, fields };

  return {
    ok: true,
    inquiry: {
      name,
      email,
      company,
      role,
      timeline: oneOf(text(form, 'timeline'), timelineValues),
      budget: oneOf(text(form, 'budget'), budgetValues),
      brief,
      locale: isLocale(localeValue) ? localeValue : 'en',
    },
  };
}
