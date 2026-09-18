/**
 * The seam that keeps the email provider swappable: the rest of the Worker only knows this
 * interface. To change provider, add an implementation next to resend.ts and select it
 * in index.ts; nothing else changes.
 */

export interface OutgoingMail {
  to: string;
  from: { name: string; email: string };
  /** The inquirer's address, so replying in the inbox goes straight to them. */
  replyTo?: string;
  subject: string;
  text: string;
}

export interface Mailer {
  /** Resolves when the provider accepted the message; rejects otherwise. */
  send(mail: OutgoingMail): Promise<void>;
}
