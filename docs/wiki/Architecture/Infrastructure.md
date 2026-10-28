# Infrastructure

Everything outside the code: Cloudflare, GitLab CI, DNS and email. Much of it was set up by
hand in dashboards, so this page is the record. **No secrets, tokens or account IDs belong
here.** They live only in GitLab CI/CD variables and Cloudflare secrets.

## Cloudflare

Account plan: **Workers Free**.

### Worker `minimalist-website`

Configured in `wrangler.jsonc`:

| Setting                     | Value                                                  | Why                                                              |
| :-------------------------- | :----------------------------------------------------- | :--------------------------------------------------------------- |
| `main`                      | `./src/worker/index.ts`                                | The Worker script                                                |
| `compatibility_date`        | `2026-09-17`                                           | Pins runtime behaviour                                           |
| `assets.directory`          | `./dist`                                               | Astro's build output                                             |
| `assets.binding`            | `ASSETS`                                               | Lets the Worker hand requests back to the asset server           |
| `assets.not_found_handling` | `404-page`                                             | Serves the nearest `404.html` (so `/hr/…` gets the Croatian one) |
| `assets.html_handling`      | `force-trailing-slash`                                 | Matches Astro's `trailingSlash: 'always'`                        |
| `vars`                      | `CONTACT_TO`, `CONTACT_FROM`, `MAIL_PROVIDER`          | Non-secret settings                                              |
| `routes`                    | `minimalist.hr`, `www.minimalist.hr` as custom domains | Declared in code so a deploy can never drop them                 |
| `workers_dev`               | `false`                                                | Production answers only on minimalist.hr                         |
| `preview_urls`              | `true`                                                 | The staging preview keeps its workers.dev URL                    |
| `observability.enabled`     | `true`                                                 | Worker logs in the dashboard                                     |

Secrets (dashboard or `wrangler secret put`): `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`.

### Zone `minimalist.hr`

- DNS is on Cloudflare (the domain is registered through CARNET).
- Custom domains for the apex and `www` are created by the Worker routes.
- **Redirect Rule:** `www.minimalist.hr` → `https://minimalist.hr` (301). Runs before the Worker.
- SSL/TLS **Full (strict)**, **Always Use HTTPS** on.
- **Web Analytics** with automatic injection. Cloudflare injects the beacon only into browser
  requests, so you won't see it with `curl`.

### Turnstile

One widget, hostname `minimalist.hr` only. Turnstile accepts only hostnames of zones in the
account, so `*.workers.dev` can't be added: the form **renders on staging but cannot send**.
Locally, Cloudflare's always-pass test keys are used. The public site key is a build variable
(`PUBLIC_TURNSTILE_SITE_KEY`); the secret is a Worker secret.

## GitLab

### Branches

| Branch           | Role                                   | Protection                                      |
| :--------------- | :------------------------------------- | :---------------------------------------------- |
| `main`           | Production                             | Merge: Maintainers. Push: no one. No force push |
| `staging`        | Collects finished work; default branch | Protected like `main`                           |
| feature branches | One change each, off `staging`         | —                                               |

Settings → Merge requests: **Pipelines must succeed** is on.

### Pipeline (`.gitlab-ci.yml`)

Pipelines run only for merge requests and for pushes to `main` and `staging`. A plain branch
push runs nothing.

| Trigger                                  | Jobs                                             |
| :--------------------------------------- | :----------------------------------------------- |
| MR into `staging`                        | `build` (lint, format check, type checks, build) |
| Push to `staging` (after a merge)        | `build` (build only) → `deploy_staging`          |
| MR `staging` → `main`                    | `build` (with checks) → `audit`                  |
| Push to `main` (after the release merge) | `build` (build only) → `deploy_production`       |

| Job                 | Image                                        | What it does                                                                                                                                     |
| :------------------ | :------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`             | `node:24-slim`                               | `pnpm install --frozen-lockfile`; on MRs `lint`, `format:check`, `check`; then `build`. Keeps `dist/` for a week. Refreshes the pnpm store cache |
| `audit`             | `mcr.microsoft.com/playwright:v1.63.0-noble` | `test:a11y` and `test:lighthouse` against `dist/`. Reports kept for a week, even on failure                                                      |
| `deploy_staging`    | `node:24-slim`                               | Appends `X-Robots-Tag: noindex` to `dist/_headers`, then `wrangler versions upload --preview-alias staging`. Resource group `staging`            |
| `deploy_production` | `node:24-slim`                               | Appends `noindex` unless `ALLOW_INDEXING=true`, then `wrangler deploy`. Resource group `production`, so deploys never overlap                    |

Deploy messages are `<short sha> <commit title>`, cut to 90 characters. Deploy jobs are not
interruptible; the others are, so a newer pipeline cancels an older one.

The Playwright image tag must match `@playwright/test` in `package.json`.

### CI/CD variables

| Key                         | Purpose                                                                   | Flags                         |
| :-------------------------- | :------------------------------------------------------------------------ | :---------------------------- |
| `CLOUDFLARE_API_TOKEN`      | Wrangler auth ("Edit Cloudflare Workers" template, scoped to the account) | Masked, hidden, not protected |
| `CLOUDFLARE_ACCOUNT_ID`     | Wrangler account                                                          | Masked                        |
| `CF_WORKERS_SUBDOMAIN`      | Builds the staging environment URL                                        | —                             |
| `PRODUCTION_URL`            | Production environment URL (`https://minimalist.hr/`)                     | —                             |
| `ALLOW_INDEXING`            | `true` since launch; without it production gets `noindex`                 | —                             |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key, baked into the build                                  | —                             |

### Environments

GitLab → Operate → Environments lists `staging` and `production` with their URLs and the last
deployment.

## Email and DNS

| Purpose                             | Provider                            | DNS records                                              |
| :---------------------------------- | :---------------------------------- | :------------------------------------------------------- |
| Inbox (`hello@`, `filip.mucnjak@`)  | iCloud+ Custom Email Domain         | Root MX, SPF, `sig1._domainkey` DKIM                     |
| Form sending (`form@minimalist.hr`) | Resend, region eu-west-1, free plan | Records on the `send.` subdomain and `resend._domainkey` |
| Policy                              | —                                   | `_dmarc`: `v=DMARC1; p=none;` (no report address)        |

- Resend authenticates through its own subdomain, so the root SPF record was not merged.
- Both senders pass DKIM and DMARC (verified with a test inquiry at launch).
- **Never onboard `minimalist.hr` to Cloudflare Email Routing.** It would replace the iCloud
  MX records. Cloudflare Email Sending also needs Workers Paid.
- Mail records are DNS-only (grey cloud).

## Limits to watch

| Service                 | Limit                                                                               |
| :---------------------- | :---------------------------------------------------------------------------------- |
| Resend free             | 3,000 emails a month, 100 a day. Each inquiry sends two (notification + auto-reply) |
| Cloudflare Workers Free | 100,000 Worker requests a day. Static asset requests are free and don't count       |
| GitLab.com              | Monthly compute minutes; check Settings → Usage quotas                              |

## Dashboards

All links are also listed in [Project overview → Links](/Overview/Project-Overview#links).

| What                                         | Where                                                                                                                                                                                                    |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worker deployments, versions, rollback, logs | [Cloudflare](https://dash.cloudflare.com/) → Workers & Pages → `minimalist-website`                                                                                                                      |
| DNS, redirect rule, SSL                      | [Cloudflare](https://dash.cloudflare.com/) → `minimalist.hr`                                                                                                                                             |
| Analytics                                    | [Cloudflare](https://dash.cloudflare.com/) → Web Analytics                                                                                                                                               |
| Turnstile widget and keys                    | [Cloudflare](https://dash.cloudflare.com/) → Turnstile                                                                                                                                                   |
| Sent emails, domain status                   | [Resend → domains](https://resend.com/domains/76a5d2a8-84d9-4664-b5f3-69de41d35afd)                                                                                                                      |
| Pipelines, environments, variables           | GitLab project                                                                                                                                                                                           |
| Indexing                                     | [Google Search Console](https://search.google.com/search-console?resource_id=sc-domain%3Aminimalist.hr), [Bing Webmaster Tools](https://www.bing.com/webmasters/sitemaps?siteUrl=https://minimalist.hr/) |
| Domain registration (nameservers)            | [CARNET domains](https://domene.hr)                                                                                                                                                                      |

## Setting up from scratch

What was done once by hand. Use it to rebuild the setup, move accounts, or replace a lost token.

### Cloudflare and GitLab

1. **Cloudflare account** (Workers Free). Open Workers & Pages once and choose the workers.dev
   subdomain (currently `minimalist-1a8`).
2. **API token:** My Profile → API Tokens → Create Token → template "Edit Cloudflare Workers",
   limited to the account and the `minimalist.hr` zone. It's shown once.
3. **GitLab → Settings → CI/CD → Variables:** add the variables in the
   [table above](#cicd-variables). The token is masked and hidden but **not protected**, so the
   `staging` pipeline can use it too.
4. **GitLab → Settings → Repository → Protected branches:** protect `main` and `staging`
   (merge: Maintainers; push: no one; no force push). Make `staging` the default branch.
5. **GitLab → Settings → Merge requests:** turn on "Pipelines must succeed".
6. **First deploy from `main`.** It creates the Worker; version uploads (staging) need the Worker
   to exist, so `main` must deploy once before `staging` can.
7. **Secrets:** `pnpm exec wrangler secret put TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` (or
   Worker → Settings → Variables and Secrets in the dashboard).
8. Check the staging URL sends `X-Robots-Tag: noindex` (`curl -I <url>`).

### Domain

1. **Nameservers.** `minimalist.hr` is registered through [CARNET](https://domene.hr). Its
   nameservers point to the two Cloudflare gives when the zone is added. Changes take minutes to
   a few hours.
2. When the zone is **Active**, the custom domains in `wrangler.jsonc` `routes` are created on
   the next deploy.
3. **Redirect Rule** `www` → apex (301); **SSL/TLS Full (strict)**; **Always Use HTTPS** on.
4. **Web Analytics** for the site, automatic injection.
5. **Turnstile widget** for `minimalist.hr`: the site key goes into the GitLab variable
   `PUBLIC_TURNSTILE_SITE_KEY`, the secret into the Worker secret.
6. GitLab variables `PRODUCTION_URL=https://minimalist.hr/` and `ALLOW_INDEXING=true`.
7. Submit `https://minimalist.hr/sitemap.xml` to Google Search Console and Bing Webmaster Tools.

### Email

1. **Inbox:** iCloud+ Custom Email Domain for `minimalist.hr`; add the MX, SPF and DKIM
   (`sig1._domainkey`) records iCloud lists. DNS-only.
2. **Resend:** add the domain in region eu-west-1 and its records (`send.` subdomain,
   `resend._domainkey`). Don't merge them into the root SPF record.
3. **DMARC:** TXT at `_dmarc`: `v=DMARC1; p=none;`.
4. Send a test inquiry from production and check the headers show `dkim=pass` and `dmarc=pass`.
