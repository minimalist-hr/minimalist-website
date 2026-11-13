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

## GitHub

Repository [minimalist-hr/minimalist-website](https://github.com/minimalist-hr/minimalist-website),
public. Moved from GitLab in November 2026 ([Decision log](Decision-Log)).

- **Rulesets** on `main` (production) and `staging` (default branch): pull request required, 0
  approvals, no force push, no deletion, no bypass. `main` allows merge commits only, `staging`
  merge or squash. Required checks: `checks`, `audit` and `SonarCloud Code Analysis`.
- Rebase merging is off; head branches are deleted after merge.
- Secret scanning with push protection, Dependabot alerts and security updates, CodeQL (default
  setup), private vulnerability reporting.
- **Board:** org project #2 "Minimalist website" (Backlog, Ready, In progress, In review, Done).
  Open issues and pull requests are added automatically and start in Backlog; closed or merged
  ones move to Done. The issue forms (Story, Task, Bug) set the issue type and the board.

| Trigger               | Workflow › jobs                 |
| :-------------------- | :------------------------------ |
| PR into `staging`     | CI › `checks` (`audit` skipped) |
| PR `staging` → `main` | CI › `checks` → `audit`         |
| Push to `staging`     | Deploy › `staging`              |
| Push to `main`        | Deploy › `production` → `wiki`  |

| Job          | Does                                                                                          |
| :----------- | :-------------------------------------------------------------------------------------------- |
| `checks`     | Lint, format check, type checks, build                                                        |
| `audit`      | Build, `test:a11y`, `test:lighthouse` in the Playwright image; reports kept a week (artifact) |
| `staging`    | Build, append `noindex`, `wrangler versions upload --preview-alias staging`                   |
| `production` | Build, append `noindex` unless `ALLOW_INDEXING` is `true`, `wrangler deploy`                  |
| `wiki`       | Copies `docs/wiki/` to the GitHub wiki with the workflow's own token, pushes only on changes  |

The audit image tag in `ci.yml` must match `@playwright/test`. Shared setup (pnpm from
`package.json`, Node from `.nvmrc`, cached install) is the local action `.github/actions/setup`.
Third-party actions are pinned to a commit. Deploy messages are `<short sha> <commit title>`;
deploy jobs use concurrency groups, so they never overlap or cancel each other.

**Secrets and variables** (Settings › Secrets and variables › Actions, and Settings ›
Environments)

| Name                        | Kind and scope                     | Purpose                                                               |
| :-------------------------- | :--------------------------------- | :-------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`      | Secret, `staging` and `production` | Wrangler auth; account-owned token (below)                            |
| `CLOUDFLARE_ACCOUNT_ID`     | Secret, repository                 | Wrangler account; a secret so it's masked in public logs              |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable, repository               | Baked into the build; missing → test key, which a real secret rejects |
| `CF_WORKERS_SUBDOMAIN`      | Variable, `staging`                | Builds the staging URL                                                |
| `PRODUCTION_URL`            | Variable, `production`             | `https://minimalist.hr/`                                              |
| `ALLOW_INDEXING`            | Variable, `production`             | `true`; without it production gets `noindex`                          |

Each environment only accepts deploys from its own branch, so pull request jobs never see the
token. The token is an **account-owned** API token (Manage account › Account API tokens), so it
doesn't depend on a user: Workers Scripts Write and Account Settings Read on the account, Workers
Routes Write and Zone Read on `minimalist.hr`. No expiry.

**SonarQube Cloud:** project `minimalist-hr_minimalist-website` in the `minimalist-hr`
organization, Automatic Analysis (no token, no workflow job), quality gate "Sonar way", new code =
the last 30 days. It analyses `staging` and every pull request, Dependabot's included. Security
hotspots in new code must be reviewed in Sonar before the check passes.

**Dependabot** (`.github/dependabot.yml`): npm and GitHub Actions weekly on Mondays, minor and
patch grouped, 3-day cooldown. Ignored: `@playwright/test` (moves with the audit image), `sharp`,
and majors of `astro`, `wrangler`, `typescript`, `eslint`, `@types/node`; those go through
[Update dependencies](Update-Dependencies).

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
| GitHub Actions          | Unlimited minutes for a public repository               |

## Dashboards

| What                               | Where                                               |
| :--------------------------------- | :-------------------------------------------------- |
| Deployments, rollback, Worker logs | Cloudflare → Workers & Pages → `minimalist-website` |
| DNS, redirect rule, SSL            | Cloudflare → `minimalist.hr`                        |
| Analytics, Core Web Vitals         | Cloudflare → Web Analytics                          |
| Turnstile                          | Cloudflare → Turnstile                              |
| Sent emails, domain status         | Resend → Domains                                    |
| Workflow runs, environments        | GitHub → Actions, Settings → Environments           |
| Code analysis                      | SonarQube Cloud → `minimalist-website`              |

Links: [Home → Links](Home#links).

## Setting up from scratch

To rebuild the setup, move accounts or replace a lost token.

1. **Cloudflare** account (Workers Free); open Workers & Pages once and pick the workers.dev
   subdomain (`minimalist-1a8`).
2. **API token:** an account-owned token with the permissions above.
3. **GitHub:** environments `staging` and `production` limited to their branches, then the
   secrets and variables from the table above.
4. **Rulesets** for `main` and `staging`; `staging` as default branch. Add the required checks
   once each has run.
5. **First deploy from `main`** creates the Worker; staging uploads need it to exist.
6. **Worker secrets:** `pnpm exec wrangler secret put TURNSTILE_SECRET_KEY` (and
   `RESEND_API_KEY`).
7. **Domain:** point the CARNET nameservers at Cloudflare's. Once the zone is active, the next
   deploy creates the custom domains. Add the Redirect Rule, Full (strict), Always Use HTTPS,
   Web Analytics.
8. **Turnstile** widget for `minimalist.hr`: site key → GitHub variable, secret → Worker secret.
9. **Email:** iCloud+ custom domain records; Resend domain in eu-west-1 with its records (not
   merged into the root SPF); the DMARC record. Send a test inquiry and check `dkim=pass` and
   `dmarc=pass`.
10. Set `ALLOW_INDEXING=true`, submit the sitemap to Google and Bing, check staging sends
    `X-Robots-Tag: noindex` (`curl -I`).
