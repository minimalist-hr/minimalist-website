import { budgetAmounts, type Budget, type Timeline } from '../lib/inquiry';
import type { OutgoingMail } from './mail';
import { escapeHtml, light, renderLayout, styles } from './mail/layout';
import type { Inquiry } from './validation';

/** Readable values for the studio's inbox (the notification is always in English). */
const timelineLabels: Record<Timeline, string> = {
  asap: 'As soon as possible',
  '1-3m': '1–3 months',
  '3-6m': '3–6 months',
  exploring: 'Still exploring',
};

const budgetLabels: Record<Budget, string> = { ...budgetAmounts, unsure: 'Not sure yet' };

const languageLabels: Record<Inquiry['locale'], string> = {
  en: 'English',
  hr: 'Croatian',
};

const NOT_GIVEN = '—';

/** When the form was sent, in the studio's time zone, e.g. "19 Sep 2026, 16:40". */
function sentAt(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zagreb',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Notification to the studio, with reply-to set to the inquirer. HTML plus a plain-text copy. */
export function composeInquiryMail(
  inquiry: Inquiry,
  addresses: { to: string; from: string },
  now: Date = new Date(),
): OutgoingMail {
  const who = inquiry.company ? `${inquiry.name}, ${inquiry.company}` : inquiry.name;
  const timeline = inquiry.timeline ? timelineLabels[inquiry.timeline] : NOT_GIVEN;
  const budget = inquiry.budget ? budgetLabels[inquiry.budget] : NOT_GIVEN;
  const language = languageLabels[inquiry.locale];
  const subject = `Inquiry: ${who}`;
  const footer =
    `Sent from the contact form on minimalist.hr, ${sentAt(now)} (Zagreb), ` +
    'with the privacy policy accepted. ' +
    `Replying to this email goes straight to ${inquiry.name}.`;

  const text = [
    `New inquiry from ${who}`,
    '',
    `Name:      ${inquiry.name}`,
    `Email:     ${inquiry.email}`,
    `Company:   ${inquiry.company || NOT_GIVEN}`,
    `Role:      ${inquiry.role || NOT_GIVEN}`,
    `Timeline:  ${timeline}`,
    `Budget:    ${budget}`,
    `Language:  ${language}`,
    '',
    inquiry.brief,
    '',
    '—',
    footer,
  ].join('\n');

  return {
    to: addresses.to,
    from: { name: 'Minimalist website', email: addresses.from },
    replyTo: inquiry.email,
    subject,
    text,
    html: renderLayout({
      lang: 'en',
      preheader: `${timeline} · ${budget} — ${inquiry.brief.slice(0, 90)}`,
      content: inquiryContent(inquiry, { timeline, budget, language, subject }),
      footer,
    }),
  };
}

function inquiryContent(
  inquiry: Inquiry,
  values: { timeline: string; budget: string; language: string; subject: string },
): string {
  const byline = [inquiry.role, inquiry.company].filter(Boolean).join(', ');
  const mailto =
    `mailto:${encodeURIComponent(inquiry.email)}` +
    `?subject=${encodeURIComponent(`Re: ${values.subject}`)}`;
  const firstName = inquiry.name.split(/\s+/)[0] ?? inquiry.name;

  const rows: [string, string][] = [
    [
      'Email',
      `<a href="${escapeHtml(mailto)}" class="c-link" style="${styles.link}">${escapeHtml(inquiry.email)}</a>`,
    ],
    ['Timeline', escapeHtml(values.timeline)],
    ['Budget', escapeHtml(values.budget)],
    ['Language', escapeHtml(values.language)],
  ];

  const detailRows = rows
    .map(
      ([key, value], index) => `
              <tr>
                <td class="key c-graphite c-rule" width="120" style="${styles.label}${index ? styles.rule : ''}padding:12px 16px 12px 0;vertical-align:top;line-height:1.9;">${key}</td>
                <td class="val c-ink c-rule" style="${styles.value}${index ? styles.rule : ''}padding:12px 0;vertical-align:top;">${value}</td>
              </tr>`,
    )
    .join('');

  // Line breaks in the brief become <br>: not every client keeps `white-space: pre-wrap`.
  const brief = escapeHtml(inquiry.brief).replace(/\r?\n/g, '<br>');

  return `
            <p class="c-graphite" style="${styles.label}">New inquiry</p>
            <h1 class="c-ink" style="${styles.title}padding-top:12px;">${escapeHtml(inquiry.name)}</h1>
            ${byline ? `<p class="c-ink2" style="${styles.body}padding-top:4px;">${escapeHtml(byline)}</p>` : ''}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="stack c-rule" style="margin-top:28px;${styles.rule}border-bottom:1px solid ${light.rule};">${detailRows}
            </table>
            <p class="c-graphite" style="${styles.label}padding-top:28px;">Brief</p>
            <p class="c-ink" style="${styles.body}color:${light.ink};padding-top:10px;">${brief}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
              <tr>
                <td><a href="${escapeHtml(mailto)}" class="c-button" style="${styles.button}">Reply to ${escapeHtml(firstName)}</a></td>
              </tr>
            </table>`;
}
