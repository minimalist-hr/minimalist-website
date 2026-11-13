# Security and privacy

## Content Security Policy

Configured in `astro.config.mjs` (`security.csp`) and emitted by Astro as a `<meta>` tag on
every page, with hashes of everything it bundles. Allowed beyond `'self'`: Turnstile
(`challenges.cloudflare.com`, script and frame) and Web Analytics
(`static.cloudflareinsights.com`, `cloudflareinsights.com`). `style-src` allows inline `style=""`
attributes only, because components pass CSS variables that way. `frame-ancestors` can't be set
in a `<meta>`, so `public/_headers` sends it.

### Inline scripts

Astro doesn't hash `is:inline` scripts. The two blocking scripts (JS flag, theme) are exact
strings in `src/lib/inline-scripts.ts`, rendered with `set:html` and hashed by the config from
the same strings.

- **Never add an `is:inline` script directly**; add its body to `inline-scripts.ts`.
- Bundled `<script>` tags in components need nothing.
- A new third-party script, frame or API origin must be added to the directives explicitly.

## Headers

`public/_headers`: `X-Frame-Options: DENY`, `nosniff`, `strict-origin-when-cross-origin`, a
Permissions-Policy that denies sensors, camera, mic, payment and topics, COOP `same-origin`, and
HSTS `max-age=31536000; includeSubDomains` (no `preload`). Cache: `/_astro/*` a year, immutable;
`/fonts/*` a month.

## Form protections

| Threat                   | Protection                                              |
| :----------------------- | :------------------------------------------------------ |
| Cross-site posts         | `Origin` check; CSP `form-action 'self'`                |
| Oversized payloads       | 64 KiB limit; field limits                              |
| Bots                     | Honeypot (fake success); Turnstile verified server-side |
| Missing secret           | Fails closed: `503`, nothing sent                       |
| Header injection         | Line breaks removed from single-line fields             |
| HTML injection in emails | Every value escaped                                     |
| Spamming third parties   | The auto-reply is fixed text                            |
| Mail loops               | `Auto-Submitted: auto-replied`                          |
| Leaks through logs       | Only error codes logged                                 |

## Secrets

- Cloudflare API token and account ID: GitHub Actions secrets only (the token only in the
  `staging` and `production` environments).
- `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`: Cloudflare Worker secrets only.
- Local: `.dev.vars` (gitignored); commit only `.dev.vars.example`.
- Never in code, commits, issues, logs or this wiki.

## Supply chain

Two runtime dependencies (`astro`, `sharp`). CI installs with `--frozen-lockfile`. Install
scripts run only for packages in `allowBuilds` (`pnpm-workspace.yaml`) and `allowScripts`
(`package.json`). pnpm's minimum release age holds back fresh versions;
`minimumReleaseAgeExclude` lists deliberate exceptions.

## What the site collects

| Data                                 | Where it goes                           | Kept                                    |
| :----------------------------------- | :-------------------------------------- | :-------------------------------------- |
| Form fields, language, consent       | Worker (memory) → Resend → iCloud inbox | In the inbox until deleted; Resend logs |
| Turnstile signals (contact page)     | Cloudflare                              | Cloudflare's terms; no cookies          |
| Analytics (views, referrer, country) | Cloudflare Web Analytics                | Aggregated, cookieless                  |
| Worker request logs                  | Cloudflare                              | Short-lived; no form content            |
| Theme preference                     | The visitor's `localStorage`            | Never sent                              |

No cookies; self-hosted fonts; Turnstile only on the contact page. Processors named in the
privacy policy: Cloudflare, Resend (sends from eu-west-1, logs in the US), Apple iCloud+ (no
DPA, owner's choice).

- **Consent is explicit:** required checkbox; the Worker rejects a submit without
  `consent=yes`.
- **Before adding** embeds, pixels, chat widgets, cookie-setting analytics or any new
  processor: re-evaluate the cookie banner and update the privacy policy
  (`src/views/LegalView.astro`, both languages) and the CSP.
- Business details for a Croatian _obrt_ (legal name, owner, address, OIB, registration number,
  IBAN) come from `src/site.config.ts` only.
- Data requests go to `hello@minimalist.hr`: delete the emails, and if needed ask Resend to
  remove its logs.
- Security reports: `hello@minimalist.hr`. No security.txt.
