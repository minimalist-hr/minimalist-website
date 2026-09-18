import type { Budget, Timeline } from '../lib/inquiry';
import type { OutgoingMail } from './mail';
import type { Inquiry } from './validation';

/** Readable values for the studio's inbox (the notification is always in English). */
const timelineLabels: Record<Timeline, string> = {
  asap: 'As soon as possible',
  '1-3m': '1–3 months',
  '3-6m': '3–6 months',
  exploring: 'Still exploring',
};

const budgetLabels: Record<Budget, string> = {
  lt15: '< €15,000',
  '15-40': '€15,000 – €40,000',
  '40-100': '€40,000 – €100,000',
  gt100: '€100,000 +',
  unsure: 'Not sure yet',
};

const NOT_GIVEN = '—';

/** Plain-text notification to the studio, with reply-to set to the inquirer. */
export function composeInquiryMail(
  inquiry: Inquiry,
  addresses: { to: string; from: string },
): OutgoingMail {
  const who = inquiry.company ? `${inquiry.name}, ${inquiry.company}` : inquiry.name;

  const text = [
    `Name:      ${inquiry.name}`,
    `Email:     ${inquiry.email}`,
    `Company:   ${inquiry.company || NOT_GIVEN}`,
    `Role:      ${inquiry.role || NOT_GIVEN}`,
    `Timeline:  ${inquiry.timeline ? timelineLabels[inquiry.timeline] : NOT_GIVEN}`,
    `Budget:    ${inquiry.budget ? budgetLabels[inquiry.budget] : NOT_GIVEN}`,
    `Language:  ${inquiry.locale.toUpperCase()}`,
    '',
    inquiry.brief,
    '',
    '—',
    'Sent from the contact form on minimalist.hr. Reply to this email to answer directly.',
  ].join('\n');

  return {
    to: addresses.to,
    from: { name: 'Minimalist website', email: addresses.from },
    replyTo: inquiry.email,
    subject: `Inquiry: ${who}`,
    text,
  };
}
