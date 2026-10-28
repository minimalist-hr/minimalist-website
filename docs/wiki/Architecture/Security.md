# Security

## Content Security Policy

The CSP is configured in `astro.config.mjs` (`security.csp`) and emitted by Astro as a
`<meta http-equiv="Content-Security-Policy">` tag on every page, with hashes of every script
and style Astro bundles.

| Directive                 | Value                                                                                               | Reason                                                                                                     |
| :------------------------ | :-------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `default-src`             | `'self'`                                                                                            |                                                                                                            |
| `script-src`              | `'self'`, `https://challenges.cloudflare.com`, `https://static.cloudflareinsights.com`, plus hashes | Turnstile (contact page), Web Analytics (injected at the edge), the two inline scripts and Astro's bundles |
| `style-src`               | `'self'`, Astro's hashes, `'unsafe-inline'` for `style=""` **attributes only**                      | Components pass CSS variables (e.g. aspect ratios) in `style` attributes                                   |
| `img-src`                 | `'self' data:`                                                                                      |                                                                                                            |
| `font-src`                | `'self'`                                                                                            | Self-hosted Archivo                                                                                        |
| `connect-src`             | `'self' https://cloudflareinsights.com`                                                             | Analytics beacon reports                                                                                   |
| `frame-src`               | `https://challenges.cloudflare.com`                                                                 | Turnstile's iframe                                                                                         |
| `base-uri`, `form-action` | `'self'`                                                                                            |                                                                                                            |
| `object-src`              | `'none'`                                                                                            |                                                                                                            |

`frame-ancestors` can't be set from a `<meta>` tag, so `public/_headers` sends it as a header.

### Inline scripts

Astro doesn't hash `is:inline` scripts. The two blocking scripts (JS flag, theme) are exported
as exact strings from `src/lib/inline-scripts.ts`; components render them with `set:html` and
`astro.config.mjs` hashes the same strings. The hash can't drift from the page.

**Rules:**

- Never add an `is:inline` script directly. Add its body to `inlineScripts` in
  `src/lib/inline-scripts.ts` and render it with `set:html`.
- Bundled `<script>` tags in components need nothing; Astro hashes them.
- JSON-LD (`JsonLd.astro`) is data, not executed script, so it needs no hash. `<` is escaped so
  content can't close the element early.
- A new third-party script, frame or API origin must be added to the directives explicitly.

## Response headers

From `public/_headers`, for every path:

| Header                       | Value                                                                                                           |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`    | `frame-ancestors 'none'`                                                                                        |
| `X-Frame-Options`            | `DENY`                                                                                                          |
| `X-Content-Type-Options`     | `nosniff`                                                                                                       |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                                               |
| `Permissions-Policy`         | accelerometer, camera, geolocation, gyroscope, magnetometer, microphone, payment, usb, browsing-topics all `()` |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                                                   |
| `Strict-Transport-Security`  | `max-age=31536000; includeSubDomains` (no `preload`, by decision)                                               |

Cache headers: `/_astro/*` one year, immutable (fingerprinted); `/fonts/*` one month.

CI appends `X-Robots-Tag: noindex` for the staging preview (and for production while
`ALLOW_INDEXING` isn't `true`).

## Contact form protections

| Threat                               | Protection                                                                     | Where                                   |
| :----------------------------------- | :----------------------------------------------------------------------------- | :-------------------------------------- |
| Cross-site form posts                | `Origin` must match the Worker's origin when present; CSP `form-action 'self'` | `contact.ts`, CSP                       |
| Oversized payloads                   | `Content-Length` > 64 KiB → `413`; field length limits                         | `contact.ts`, `inquiry.ts`              |
| Simple bots                          | Honeypot field `website`; a filled one gets a fake success                     | `ContactForm.astro`, `contact.ts`       |
| Automated submissions                | Turnstile token verified server-side; one token per submit                     | `turnstile.ts`, `contact-form.ts`       |
| Missing secret                       | Fails closed: no secret → `503`, nothing sent                                  | `contact.ts`                            |
| Email header injection               | Line breaks removed from single-line fields; provider builds headers from JSON | `validation.ts`, `resend.ts`            |
| HTML injection in emails             | Every form value escaped                                                       | `mail/layout.ts` (`escapeHtml`)         |
| Using the form to spam third parties | The auto-reply contains only fixed text, never form content                    | `autoreply.ts`                          |
| Mail loops                           | `Auto-Submitted: auto-replied` on the auto-reply                               | `autoreply.ts`                          |
| Data leaks through logs              | Only error codes are logged, never content or addresses                        | `contact.ts`, `resend.ts`, `console.ts` |

Server-side validation is authoritative; the browser's checks are a convenience.

## Secrets

- Cloudflare API token and account ID: GitLab CI/CD variables only (masked).
- `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`: Cloudflare Worker secrets only.
- Local: `.dev.vars` (gitignored). Commit only `.dev.vars.example`.
- Never write, paste or echo a secret in code, commits, issues, logs or this wiki.

## Supply chain

- Two runtime dependencies (`astro`, `sharp`). New packages need a stated reason and approval.
- `pnpm install --frozen-lockfile` in CI.
- Install scripts run only for packages listed in `pnpm-workspace.yaml` → `allowBuilds`
  (`esbuild`, `workerd`) and `package.json` → `allowScripts`.
- pnpm's minimum release age holds back freshly published versions;
  `minimumReleaseAgeExclude` lists the deliberate exceptions.

## Privacy

No cookies, no tracking, no stored submissions. See
[Privacy and data handling](/Data/Privacy-and-Data-Handling).

## Reporting a problem

Email `hello@minimalist.hr`. There is no public security.txt.
