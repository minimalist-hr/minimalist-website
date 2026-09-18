/**
 * Bindings and variables available to the Worker.
 * `Env` is generated from wrangler.jsonc by `pnpm run types:worker`; secrets are not in that
 * file, so they are declared here. Secrets are optional: previews may run without them.
 */
export interface WorkerEnv extends Env {
  /** Turnstile secret key (wrangler secret put TURNSTILE_SECRET_KEY). */
  TURNSTILE_SECRET_KEY?: string;
}
