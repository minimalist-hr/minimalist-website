import type { Locale } from '../i18n/config';
import { ui } from '../i18n/ui';
import { localizedPath } from '../i18n/utils';
import { siteConfig } from '../site.config';
import type { OutgoingMail } from './mail';
import { escapeHtml, renderLayout, styles } from './mail/layout';

/**
 * Confirmation to the person who sent the form, in the language they used.
 *
 * It repeats nothing from the form, not even the name: anyone can type any address into
 * the form, so the only thing a false submission can ever send is this fixed text.
 * `Auto-Submitted` (RFC 3834) tells the recipient's mail server it is automatic, so
 * out-of-office replies do not answer it. Replies go to the studio's inbox.
 */
export function composeAutoReply(
  locale: Locale,
  addresses: { to: string; from: string; replyTo: string },
): OutgoingMail {
  const t = ui[locale];
  const { company } = siteConfig;
  const approachUrl = new URL(localizedPath('approach', locale), siteConfig.url).toString();
  const signature = `${company.legalName} · ${company.street}, ${company.postalCode} ${company.city}`;

  const text = [
    t['email.replyTitle'],
    '',
    t['email.replyText'],
    '',
    t['email.replyNext'],
    '',
    `${t['email.replyLink']}: ${approachUrl}`,
    '',
    '—',
    signature,
    t['email.replyFooter'],
  ].join('\n');

  const content = `
            <p class="c-graphite" style="${styles.label}">${escapeHtml(t['email.replyLabel'])}</p>
            <h1 class="c-ink" style="${styles.title}padding-top:12px;">${escapeHtml(t['email.replyTitle'])}</h1>
            <p class="c-ink2" style="${styles.body}padding-top:20px;">${escapeHtml(t['email.replyText'])}</p>
            <p class="c-ink2" style="${styles.body}padding-top:12px;">${escapeHtml(t['email.replyNext'])}</p>
            <p style="margin:0;padding-top:28px;"><a href="${escapeHtml(approachUrl)}" class="c-link" style="${styles.value}${styles.link}">${escapeHtml(t['email.replyLink'])} →</a></p>`;

  return {
    to: addresses.to,
    from: { name: siteConfig.name, email: addresses.from },
    replyTo: addresses.replyTo,
    subject: t['email.replySubject'],
    text,
    html: renderLayout({
      lang: locale,
      preheader: t['email.replyText'],
      content,
      footer: `${signature}. ${t['email.replyFooter']}`,
    }),
    headers: { 'Auto-Submitted': 'auto-replied' },
  };
}
