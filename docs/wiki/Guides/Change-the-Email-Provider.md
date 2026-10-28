# Change the email provider

The Worker only knows the `Mailer` interface (`src/worker/mail/types.ts`). Changing provider
means adding one implementation and selecting it with `MAIL_PROVIDER`. Nothing else changes.

Constraints:

- **Never onboard `minimalist.hr` to Cloudflare Email Routing**: it replaces the iCloud MX records.
- Cloudflare Email Sending needs the Workers Paid plan.
- The new provider becomes a processor: update the privacy policy (`src/views/LegalView.astro`,
  both languages).

## 1. Implement `Mailer`

`src/worker/mail/<provider>.ts`, modelled on `resend.ts`:

```ts
import type { Mailer } from './types';

/** <Provider> through its REST API. The API key is a Worker secret (<PROVIDER>_API_KEY). */
export function createProviderMailer(apiKey: string): Mailer {
  return {
    async send(mail) {
      const response = await fetch('https://api.provider.example/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { name: mail.from.name, email: mail.from.email },
          to: mail.to,
          reply_to: mail.replyTo,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
          headers: mail.headers, // keep Auto-Submitted on the auto-reply
        }),
      });
      if (!response.ok) {
        // Throw an error with a `code` only. Never include the provider's message: it can
        // contain addresses.
        throw Object.assign(new Error('send failed'), { code: `provider_${response.status}` });
      }
    },
  };
}
```

Requirements:

- Resolve only when the provider accepted the message; reject otherwise.
- Send both `text` and `html`, plus `replyTo` and any `headers`.
- Errors carry a short `code` (the handler logs `error.code`); never log content.

## 2. Register it

In `src/worker/mail/index.ts`:

```ts
case 'provider':
  if (!env.PROVIDER_API_KEY) throw new Error('PROVIDER_API_KEY is not set');
  return createProviderMailer(env.PROVIDER_API_KEY);
```

Declare the secret as optional in `src/worker/env.ts` (add it to the `Secrets` union and the
interface).

## 3. Configure

1. Verify the sending domain with the provider (its DNS records go on a subdomain or selector
   that doesn't clash with iCloud's root SPF, MX and `sig1._domainkey`).
2. Set the secret: `pnpm exec wrangler secret put PROVIDER_API_KEY` (or the Cloudflare dashboard).
3. Change `MAIL_PROVIDER` in `wrangler.jsonc` `vars` (explain the change in the MR), then
   `pnpm run types:worker`.
4. Add the variable to `.dev.vars.example` as a comment.
5. If the API host differs, nothing changes in the CSP: the Worker's outbound `fetch` isn't
   subject to the page CSP.

## 4. Test

- Locally: `MAIL_PROVIDER=provider` and the key in `.dev.vars`, `pnpm run build`,
  `pnpm exec wrangler dev`, send the form. Both emails should arrive; check SPF, DKIM and DMARC
  pass in the headers.
- After release: send one real inquiry on production (staging can't send).

## 5. Clean up

Remove the old implementation and its secret once the new one is live, and update
[Infrastructure](/Architecture/Infrastructure#email-and-dns),
[Backend architecture](/Architecture/Backend-Architecture#the-mailer-seam),
[Privacy](/Data/Privacy-and-Data-Handling) and the [Decision log](/Overview/Decision-Log).
