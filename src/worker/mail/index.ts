import type { WorkerEnv } from '../env';
import { createCloudflareMailer } from './cloudflare';
import { createConsoleMailer } from './console';
import { createResendMailer } from './resend';
import type { Mailer } from './types';

export type { Mailer, OutgoingMail } from './types';

/** Picks the provider from MAIL_PROVIDER (wrangler.jsonc vars; overridden in .dev.vars). */
export function createMailer(env: WorkerEnv): Mailer {
  switch (env.MAIL_PROVIDER) {
    case 'resend':
      if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
      return createResendMailer(env.RESEND_API_KEY);
    case 'cloudflare':
      return createCloudflareMailer(env.EMAIL);
    case 'console':
      return createConsoleMailer();
    default:
      throw new Error(`Unknown MAIL_PROVIDER "${env.MAIL_PROVIDER}"`);
  }
}
