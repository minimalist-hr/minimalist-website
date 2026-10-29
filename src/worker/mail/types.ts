/** The rest of the Worker only knows this interface, so a provider is one implementation. */

export interface OutgoingMail {
  to: string;
  from: { name: string; email: string };
  /** The inquirer's address, so replying in the inbox goes straight to them. */
  replyTo?: string;
  subject: string;
  /** Plain-text body; always sent, for clients and filters that prefer it. */
  text: string;
  html?: string;
  /** Extra headers, e.g. Auto-Submitted on the auto-reply. */
  headers?: Record<string, string>;
}

export interface Mailer {
  /** Resolves when the provider accepted the message; rejects otherwise. */
  send(mail: OutgoingMail): Promise<void>;
}
