# Contact form

The one feature with a server side. The form and the Worker share one contract,
`src/lib/inquiry.ts` (fields, limits, allowed values, response type), so they can't disagree.

| Part    | Files                                                        |
| :------ | :----------------------------------------------------------- |
| Markup  | `ContactForm.astro` (+ `TextField`, `ChipGroup`, `Checkbox`) |
| Browser | `src/scripts/contact-form.ts`                                |
| Worker  | `src/worker/contact.ts`, `validation.ts`, `turnstile.ts`     |
| Emails  | `src/worker/compose.ts`, `autoreply.ts`, `mail/`             |
| Strings | `form.*` and `email.*` in `src/i18n/ui.ts`                   |

Fields: name, email, company, role, timeline (chips), budget in EUR (chips), brief, required
consent. Hidden: `locale`, the honeypot `website`, the Turnstile token.

## In the browser

1. Turnstile loads only on this page, invisible unless it's unsure (`interaction-only`), in
   the page's language and theme.
2. The script sets `novalidate` and validates on submit with messages in the page's language.
   Each invalid field gets `aria-invalid` and its error; a summary appears; focus goes to the
   first invalid field. Errors clear as soon as a field is valid.
3. While sending, the button uses `aria-disabled` (not `disabled`, which drops focus). It waits
   up to 10s for a token, then posts with `fetch` and `Accept: application/json`.
4. Success replaces the form with a focused message. A failure resets Turnstile (a token is
   valid once) and shows the matching message, with the email address for send errors.

Without JavaScript the form posts normally, but Turnstile can't run, so it fails verification;
a `<noscript>` note offers the email address instead.

## In the Worker

`handleContact` stops at the first failure:

| #   | Check                                      | On failure                         |
| :-- | :----------------------------------------- | :--------------------------------- |
| 1   | `POST`                                     | `405`                              |
| 2   | `Origin`, if present, equals the request's | `403`                              |
| 3   | `Content-Length` ≤ 64 KiB                  | `413`                              |
| 4   | Body is form data                          | `400`                              |
| 5   | Honeypot empty                             | Fake success, nothing sent         |
| 6   | `parseInquiry` passes                      | `400 { error: 'invalid', fields }` |
| 7   | `TURNSTILE_SECRET_KEY` set (fail closed)   | `503 { error: 'unavailable' }`     |
| 8   | Turnstile token verifies                   | `403 { error: 'verification' }`    |
| 9   | Notification sent                          | `502 { error: 'send' }`            |
| 10  | Auto-reply sent                            | Logged only; still success         |

From step 5, `Accept: application/json` gets JSON; a plain form post gets a `303` to the contact
page with `?status=…`. Server validation is authoritative. Single-line fields lose line breaks
(they reach the subject line).

## Emails

- **Notification** to `CONTACT_TO`, from "Minimalist website" `<CONTACT_FROM>`, reply-to the
  inquirer, subject `Inquiry: <name>[, <company>]`. Always English, with a Language row.
- **Auto-reply** to the inquirer in their language, reply-to `CONTACT_TO`,
  `Auto-Submitted: auto-replied`. **It repeats nothing from the form, not even the name**, so
  the form can't send someone else's text to a stranger.
- Both are plain text plus HTML (`mail/layout.ts`): light by default, dark where clients support
  it; every form value goes through `escapeHtml`.

## Mailer

Email goes through the `Mailer` interface (`src/worker/mail/types.ts`); `MAIL_PROVIDER` picks
the implementation: `resend` (production) or `console` (logs metadata only). Errors carry a
short `code` such as `resend_403_…`; provider messages are dropped because they can contain
addresses. To switch provider: [Change the email provider](Change-the-Email-Provider).

| Name                   | Kind                  | Value                                  |
| :--------------------- | :-------------------- | :------------------------------------- |
| `CONTACT_TO`           | Var, `wrangler.jsonc` | `hello@minimalist.hr`                  |
| `CONTACT_FROM`         | Var                   | `form@minimalist.hr`                   |
| `MAIL_PROVIDER`        | Var                   | `resend`; `console` in `.dev.vars`     |
| `TURNSTILE_SECRET_KEY` | Secret                | Cloudflare; test secret in `.dev.vars` |
| `RESEND_API_KEY`       | Secret                | Cloudflare; optional locally           |

The Worker logs only error codes and the missing-secret warning. **Never log names, addresses,
briefs or provider messages.**

## Testing locally

```bash
cp .dev.vars.example .dev.vars    # Turnstile test secret, MAIL_PROVIDER=console
pnpm run build && pnpm exec wrangler dev
```

Send the form at `http://localhost:8787/contact/`; the terminal shows `[mail:console] would send
to …` twice. For a real send set `MAIL_PROVIDER=resend` and `RESEND_API_KEY` in `.dev.vars`.
Staging can't send; after Worker or email changes, send one real inquiry on production.

## Changing the form

A new field touches `ContactForm.astro`, `ui.ts` (both languages), `inquiry.ts`,
`validation.ts`, `compose.ts`, and `VALIDATED_FIELDS` in `contact-form.ts` if validated. A new
kind of data also means updating the privacy policy. Run the "contact form" keyboard tests.
