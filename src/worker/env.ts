/**
 * `Env` is generated from wrangler.jsonc by `pnpm run types:worker`. Secrets are declared here
 * instead, as optional, because previews may run without them. They are omitted from `Env`
 * first, because `wrangler types` also adds any names it finds in a local .dev.vars.
 */
type Secrets = 'TURNSTILE_SECRET_KEY' | 'RESEND_API_KEY';

export interface WorkerEnv extends Omit<Env, Secrets> {
  /** Turnstile secret key (wrangler secret put TURNSTILE_SECRET_KEY). */
  TURNSTILE_SECRET_KEY?: string;
  /** Resend API key, used when MAIL_PROVIDER is "resend" (wrangler secret put RESEND_API_KEY). */
  RESEND_API_KEY?: string;
}
