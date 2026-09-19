import type { Mailer } from './types';

const RESEND_URL = 'https://api.resend.com/emails';

/** Error carrying only a provider code, so the Worker can log why without logging content. */
class MailSendError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(`Mail provider rejected the message (${code})`);
    this.code = code;
  }
}

/**
 * Resend (resend.com) through its REST API. The API key is a Worker secret
 * (RESEND_API_KEY); the sending domain is verified in the Resend dashboard.
 */
export function createResendMailer(apiKey: string): Mailer {
  return {
    async send(mail) {
      const response = await fetch(RESEND_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          // Required by Resend: requests without a User-Agent are rejected with 403.
          'User-Agent': 'minimalist-website/1.0',
        },
        body: JSON.stringify({
          from: `${mail.from.name} <${mail.from.email}>`,
          to: [mail.to],
          subject: mail.subject,
          text: mail.text,
          ...(mail.html ? { html: mail.html } : {}),
          ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
        }),
      });

      if (!response.ok) {
        // Resend's error `name` (e.g. validation_error) is safe to log; its `message`
        // can contain addresses, so it is dropped.
        const body = (await response.json().catch(() => null)) as { name?: string } | null;
        throw new MailSendError(`resend_${response.status}_${body?.name ?? 'unknown'}`);
      }
    },
  };
}
