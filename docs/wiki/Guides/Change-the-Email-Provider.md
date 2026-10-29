# Change the email provider

The Worker only knows the `Mailer` interface (`src/worker/mail/types.ts`). A new provider is one
implementation selected by `MAIL_PROVIDER`; nothing else changes.

- **Never onboard `minimalist.hr` to Cloudflare Email Routing**: it replaces iCloud's MX.
- The provider becomes a processor: update the privacy policy (`LegalView.astro`, both
  languages).

## Steps

1. **Implement** `src/worker/mail/<provider>.ts`, modelled on `resend.ts`. Resolve only when the
   provider accepted the message. Send `text`, `html`, `replyTo` and `headers` (the auto-reply
   needs `Auto-Submitted`). On failure throw an error with a short `code` only, never the
   provider's message.
2. **Register** it in `src/worker/mail/index.ts` and declare its secret as optional in
   `src/worker/env.ts`.
3. **Configure:** verify the sending domain on a subdomain or selector that doesn't clash with
   iCloud's records; `pnpm exec wrangler secret put <PROVIDER>_API_KEY`; change `MAIL_PROVIDER`
   in `wrangler.jsonc` (explain in the MR) and run `pnpm run types:worker`; add the variable to
   `.dev.vars.example`. The CSP doesn't apply to the Worker's own `fetch`.
4. **Test** locally with `wrangler dev` and the key in `.dev.vars`: both emails arrive with SPF,
   DKIM and DMARC passing. After release, one real inquiry on production.
5. **Clean up:** remove the old implementation and secret; update
   [Contact form](/How-It-Works/Contact-Form#mailer),
   [Infrastructure](/How-It-Works/Infrastructure#email-and-dns),
   [Security and privacy](/How-It-Works/Security-and-Privacy) and the
   [Decision log](/Decision-Log).
