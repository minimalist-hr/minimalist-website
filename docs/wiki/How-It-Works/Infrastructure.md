# Infrastructure

Everything outside the code. Much of it was set up by hand in dashboards, so this page is the
record. **No secrets, tokens or account IDs here.**

## Cloudflare

Plan: **Workers Free**.

**Worker `minimalist-website`** (`wrangler.jsonc`): entry `src/worker/index.ts`, assets from
`dist/` with binding `ASSETS`, `not_found_handling: 404-page`, `html_handling:
force-trailing-slash`, vars `CONTACT_TO` / `CONTACT_FROM` / `MAIL_PROVIDER`, custom domains
`minimalist.hr` and `www`, `workers_dev: false`, `preview_urls: true`, observability on. After
changing it, run `pnpm run types:worker`. Secrets: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`.

**Zone `minimalist.hr`:** DNS on Cloudflare (registered through CARNET). Redirect Rule `www` →
apex (301). SSL/TLS Full (strict), Always Use HTTPS. Web Analytics with automatic injection (only
into browser requests, so not visible with `curl`).

**Turnstile:** one widget, hostname `minimalist.hr` only. `*.workers.dev` can't be added, so the
form renders on staging but can't send. The site key is a build variable, the secret a Worker
secret.

## GitLab

Project [minimalist-sds/website](https://gitlab.com/minimalist-sds/website).

- `main` (production) and `staging` (default branch) are protected: merge by Maintainers, push
  by no one, no force push. **Pipelines must succeed** is on.
- Pipelines run only for merge requests and pushes to `main` and `staging`.

| Trigger               | Jobs                                             |
| :-------------------- | :----------------------------------------------- |
| MR into `staging`     | `build` (lint, format check, type checks, build) |
| Merge into `staging`  | `build` → `deploy_staging`                       |
| MR `staging` → `main` | `build` (with checks) → `audit`                  |
| Merge into `main`     | `build` → `deploy_production` → `sync_wiki`      |

| Job                 | Does                                                                                            |
| :------------------ | :---------------------------------------------------------------------------------------------- |
| `build`             | Install, checks on MRs, build; keeps `dist/` a week; refreshes the pnpm cache                   |
| `audit`             | `test:a11y` and `test:lighthouse`; reports kept a week. Image tag must match `@playwright/test` |
| `deploy_staging`    | Appends `noindex`, then `wrangler versions upload --preview-alias staging`                      |
| `deploy_production` | Appends `noindex` unless `ALLOW_INDEXING=true`, then `wrangler deploy`                          |
| `sync_wiki`         | Mirrors `docs/wiki/` to the GitLab wiki (keeps its `.gitlab/` folder), pushes only on changes   |

Deploy messages are `<short sha> <commit title>`. Deploy jobs aren't interruptible and use
resource groups, so they never overlap.

**CI/CD variables**

| Key                         | Purpose                                                               | Flags                         |
| :-------------------------- | :-------------------------------------------------------------------- | :---------------------------- |
| `CLOUDFLARE_API_TOKEN`      | Wrangler auth ("Edit Cloudflare Workers", scoped to the account)      | Masked, hidden, not protected |
| `CLOUDFLARE_ACCOUNT_ID`     | Wrangler account                                                      | Masked                        |
| `CF_WORKERS_SUBDOMAIN`      | Builds the staging URL                                                | —                             |
| `PRODUCTION_URL`            | `https://minimalist.hr/`                                              | —                             |
| `ALLOW_INDEXING`            | `true`; without it production gets `noindex`                          | —                             |
| `PUBLIC_TURNSTILE_SITE_KEY` | Baked into the build; missing → test key, which a real secret rejects | —                             |
| `WIKI_TOKEN`                | Fine-grained personal access token for the wiki push, expires         | Masked, hidden, protected     |

`WIKI_TOKEN` is a fine-grained personal access token limited to this project, with _Wiki_ →
Read and Create. It's personal because project access tokens need Premium on GitLab.com. When
it expires `sync_wiki` fails with an auth error: create a new token and replace the value.

## Email and DNS

| Purpose                             | Provider                     | DNS                                    |
| :---------------------------------- | :--------------------------- | :------------------------------------- |
| Inbox (`hello@`, `filip.mucnjak@`)  | iCloud+ Custom Email Domain  | Root MX, SPF, `sig1._domainkey`        |
| Form sending (`form@minimalist.hr`) | Resend, eu-west-1, free plan | `send.` subdomain, `resend._domainkey` |
| Policy                              | —                            | `_dmarc`: `v=DMARC1; p=none;`          |

Resend uses its own subdomain, so the root SPF wasn't merged. Both senders pass DKIM and DMARC.
Mail records are DNS-only. **Never onboard `minimalist.hr` to Cloudflare Email Routing**: it
replaces the iCloud MX records.

## Limits

| Service                 | Limit                                                   |
| :---------------------- | :------------------------------------------------------ |
| Resend free             | 3,000 emails a month, 100 a day; each inquiry sends two |
| Cloudflare Workers Free | 100,000 Worker requests a day; static requests are free |
| GitLab.com              | Monthly compute minutes (Settings → Usage quotas)       |

## Dashboards

| What                               | Where                                               |
| :--------------------------------- | :-------------------------------------------------- |
| Deployments, rollback, Worker logs | Cloudflare → Workers & Pages → `minimalist-website` |
| DNS, redirect rule, SSL            | Cloudflare → `minimalist.hr`                        |
| Analytics, Core Web Vitals         | Cloudflare → Web Analytics                          |
| Turnstile                          | Cloudflare → Turnstile                              |
| Sent emails, domain status         | Resend → Domains                                    |
| Pipelines, environments, variables | GitLab project                                      |

Links: [Home → Links](/home#links).

## Setting up from scratch

To rebuild the setup, move accounts or replace a lost token.

1. **Cloudflare** account (Workers Free); open Workers & Pages once and pick the workers.dev
   subdomain (`minimalist-1a8`).
2. **API token:** My Profile → API Tokens → "Edit Cloudflare Workers", limited to the account
   and the zone.
3. **GitLab variables** from the table above. The Cloudflare token is not protected, so
   `staging` can use it.
4. **Protected branches** `main` and `staging`; `staging` as default; "Pipelines must succeed".
5. **First deploy from `main`** creates the Worker; staging uploads need it to exist.
6. **Worker secrets:** `pnpm exec wrangler secret put TURNSTILE_SECRET_KEY` (and
   `RESEND_API_KEY`).
7. **Domain:** point the CARNET nameservers at Cloudflare's. Once the zone is active, the next
   deploy creates the custom domains. Add the Redirect Rule, Full (strict), Always Use HTTPS,
   Web Analytics.
8. **Turnstile** widget for `minimalist.hr`: site key → GitLab variable, secret → Worker secret.
9. **Email:** iCloud+ custom domain records; Resend domain in eu-west-1 with its records (not
   merged into the root SPF); the DMARC record. Send a test inquiry and check `dkim=pass` and
   `dmarc=pass`.
10. Set `ALLOW_INDEXING=true`, submit the sitemap to Google and Bing, check staging sends
    `X-Robots-Tag: noindex` (`curl -I`).
