# Configuration

## Configuration files

| File                       | Purpose                         | Key settings                                                                                                                                                                                     |
| :------------------------- | :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `astro.config.mjs`         | Astro                           | `site`, `trailingSlash: 'always'`, i18n (`en` default, unprefixed), localised-404 integration, CSP, env schema                                                                                   |
| `wrangler.jsonc`           | Cloudflare Worker               | Entry, assets, 404 and trailing-slash handling, vars, custom domains, `workers_dev`, `preview_urls`, observability. See [Infrastructure](/Architecture/Infrastructure#worker-minimalist-website) |
| `.gitlab-ci.yml`           | CI/CD                           | Workflow rules, `build`, `audit`, `deploy_staging`, `deploy_production`                                                                                                                          |
| `package.json`             | Scripts, dependencies           | `packageManager` (pnpm pin), `engines`, `allowScripts`                                                                                                                                           |
| `pnpm-workspace.yaml`      | pnpm                            | `allowBuilds` (esbuild, workerd), `minimumReleaseAgeExclude`, `overrides` (Lighthouse 13.4.1)                                                                                                    |
| `tsconfig.json`            | Site types                      | Extends `astro/tsconfigs/strict`; excludes `src/worker`                                                                                                                                          |
| `src/worker/tsconfig.json` | Worker types                    | ES2022, Workers types from `worker-configuration.d.ts`, `noUncheckedIndexedAccess`                                                                                                               |
| `src/content.config.ts`    | Collection schemas              | `work`, `insights`                                                                                                                                                                               |
| `src/site.config.ts`       | Site facts and flags            | `url`, `email`, `author`, `showInsights`, `company`                                                                                                                                              |
| `eslint.config.js`         | Lint rules                      | See [Coding conventions](/Development/Coding-Conventions#linting-and-formatting)                                                                                                                 |
| `prettier.config.js`       | Formatting                      | Single quotes, width 100, Astro plugin                                                                                                                                                           |
| `.prettierignore`          | Formatting exclusions           | `design/`, `.gitlab-ci.yml`, `wrangler.jsonc`, generated types, test output                                                                                                                      |
| `.editorconfig`            | Editor defaults                 | UTF-8, LF, 2 spaces, final newline                                                                                                                                                               |
| `.gitattributes`           | Line endings                    | LF everywhere; binary assets marked                                                                                                                                                              |
| `.nvmrc`                   | Node version                    | `24`                                                                                                                                                                                             |
| `playwright.config.ts`     | Browser tests                   | Projects, `wrangler dev` web server on port 8787                                                                                                                                                 |
| `lighthouserc.cjs`         | Lighthouse CI                   | URLs, 3 runs, thresholds, Turnstile blocked; server on port 8788                                                                                                                                 |
| `public/_headers`          | Response headers                | Security and cache headers                                                                                                                                                                       |
| `public/site.webmanifest`  | Web app manifest                | Name, icons, colours                                                                                                                                                                             |
| `.dev.vars.example`        | Local Worker variables template | Turnstile test secret, `MAIL_PROVIDER=console`                                                                                                                                                   |

**Explain the problem before changing** `.gitlab-ci.yml`, `wrangler.jsonc`, `.gitignore` or
`.nvmrc`. After changing `wrangler.jsonc`, run `pnpm run types:worker`.

## Variables and secrets

### Build time (Astro)

| Name                        | Where set                               | Default                                                        | Notes                                                                                                                                                                     |
| :-------------------------- | :-------------------------------------- | :------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_TURNSTILE_SITE_KEY` | GitLab CI/CD variable; optional locally | `1x00000000000000000000AA` (Cloudflare's always-pass test key) | Public. Read with `import { PUBLIC_TURNSTILE_SITE_KEY } from 'astro:env/client'`. The test key's tokens are rejected by a real secret, so a missing variable fails closed |

### Worker runtime

| Name                   | Kind                    | Production              | Local (`.dev.vars`)                                                     |
| :--------------------- | :---------------------- | :---------------------- | :---------------------------------------------------------------------- |
| `CONTACT_TO`           | Var in `wrangler.jsonc` | `hello@minimalist.hr`   | same                                                                    |
| `CONTACT_FROM`         | Var in `wrangler.jsonc` | `form@minimalist.hr`    | same                                                                    |
| `MAIL_PROVIDER`        | Var in `wrangler.jsonc` | `resend`                | `console`                                                               |
| `TURNSTILE_SECRET_KEY` | Secret                  | Real secret (dashboard) | `1x0000000000000000000000000000000AA` (test secret: every token passes) |
| `RESEND_API_KEY`       | Secret                  | Real key (dashboard)    | Only to test a real send                                                |

Set a production secret with `pnpm exec wrangler secret put <NAME>` or in the Cloudflare
dashboard. Never commit `.dev.vars`.

### CI/CD (GitLab)

| Name                        | Purpose                                                               |
| :-------------------------- | :-------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`      | Wrangler authentication (masked, hidden)                              |
| `CLOUDFLARE_ACCOUNT_ID`     | Wrangler account (masked)                                             |
| `CF_WORKERS_SUBDOMAIN`      | Builds the staging URL                                                |
| `PRODUCTION_URL`            | Production environment link                                           |
| `ALLOW_INDEXING`            | `true` in production; otherwise the deploy adds `noindex`             |
| `PUBLIC_TURNSTILE_SITE_KEY` | See above                                                             |
| `WORKER_NAME`               | Set in `.gitlab-ci.yml` itself; must match `name` in `wrangler.jsonc` |
| `WRANGLER_SEND_METRICS`     | `false` in the audit job and Playwright's web server                  |

## Feature flags

| Flag           | File                 | Effect                                                                                                                                                    |
| :------------- | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showInsights` | `src/site.config.ts` | `false` hides Insights from navigation, the home page, the CTA chain and the sitemap. The routes still build; to remove them, also drop the insight pages |

## Ports

| Port | Used by                                            |
| :--- | :------------------------------------------------- |
| 4321 | `pnpm dev` (Astro default)                         |
| 8787 | `pnpm exec wrangler dev` default; Playwright tests |
| 8788 | Lighthouse CI server                               |

## Scripts

| Script                    | Command                                                                   | Notes                             |
| :------------------------ | :------------------------------------------------------------------------ | :-------------------------------- |
| `dev`                     | `astro dev`                                                               | No Worker                         |
| `build`                   | `astro build`                                                             | Output in `dist/`                 |
| `preview`                 | `astro preview`                                                           | Static preview without the Worker |
| `check`                   | `astro check && tsc -p src/worker`                                        | Site and Worker types             |
| `lint`                    | `eslint .`                                                                |                                   |
| `format` / `format:check` | `prettier --write .` / `--check .`                                        | CI runs `format:check`            |
| `types:worker`            | `wrangler types src/worker/worker-configuration.d.ts --strict-vars false` | After changing `wrangler.jsonc`   |
| `test:a11y`               | `playwright test --project=mobile --project=desktop`                      | Build first                       |
| `test:a11y:browsers`      | `playwright test`                                                         | Adds Firefox and WebKit           |
| `test:lighthouse`         | `node scripts/lighthouse.mjs`                                             | Build first                       |
