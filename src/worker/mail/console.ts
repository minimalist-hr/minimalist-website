import type { Mailer } from './types';

/**
 * Local development: pretends to send. Logs only where the mail would go and its length,
 * never the content (plan §9.3: do not log message contents).
 */
export function createConsoleMailer(): Mailer {
  return {
    async send(mail) {
      console.log(
        `[mail:console] would send to ${mail.to} from ${mail.from.email} ` +
          `(${mail.subject.length} char subject, ${mail.text.length} char body)`,
      );
    },
  };
}
