import type { Mailer } from './types';

/**
 * Cloudflare Email Service through the Worker's `send_email` binding (wrangler.jsonc).
 * No API key: the binding is authorised by the account, and it is locked to one
 * destination address, so it cannot be used to send anywhere else.
 */
export function createCloudflareMailer(binding: SendEmail): Mailer {
  return {
    async send(mail) {
      await binding.send({
        to: mail.to,
        from: mail.from,
        subject: mail.subject,
        text: mail.text,
        ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
      });
    },
  };
}
