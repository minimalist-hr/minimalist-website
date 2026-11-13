# Troubleshooting

## Build and types

| Symptom                                          | Fix                                                                     |
| :----------------------------------------------- | :---------------------------------------------------------------------- |
| `check` fails in `ui.ts` with a missing property | The key exists in only one language; add it to both                     |
| Type error in a view's `copy`                    | One language is missing a field                                         |
| `No image file for "<key>"`                      | Add the file with exactly that name, or remove the key                  |
| Content schema error                             | Frontmatter doesn't match `src/content.config.ts`; read the named field |
| `tsc -p src/worker` fails on `Env`               | `pnpm run types:worker`                                                 |
| Prettier reports every line changed              | CRLF endings: `git add --renormalize .`                                 |
| `rename` error in `localized-404`                | Keep one `404.astro` per non-default locale                             |
| "Another astro dev server is already running"    | Use it, or `pnpm astro dev stop`                                        |

## Styling and scripts

| Symptom                                          | Fix                                                                  |
| :----------------------------------------------- | :------------------------------------------------------------------- |
| A class passed to a child component does nothing | Scoped CSS doesn't reach a child's root: add a prop or wrap it       |
| A rule touches the screen edges on phones        | Use `.rule-top` / `.rule-bottom`, not a border on `.container`       |
| An element hidden by a script still shows        | Add `[hidden] { display: none; }` to it                              |
| A reveal state doesn't override a component      | `motion.css` must stay unlayered with `:root` selectors              |
| Content invisible after load                     | A reveal stayed `pending`; check the console                         |
| Theme flashes on load                            | `ThemeScript` must render inline, early in `<head>`                  |
| "Refused to execute inline script"               | Move the body to `src/lib/inline-scripts.ts`, render with `set:html` |
| A third-party request is blocked                 | Add its origin to the CSP in `astro.config.mjs` (after a decision)   |

## Contact form

| Symptom                                  | Fix                                                                          |
| :--------------------------------------- | :--------------------------------------------------------------------------- |
| `/api/contact` 404 locally               | `pnpm dev` has no Worker: build, then `wrangler dev`                         |
| `503`, `TURNSTILE_SECRET_KEY is not set` | `cp .dev.vars.example .dev.vars`; in production set the secret               |
| `502`, `Unknown MAIL_PROVIDER`           | Must be `resend` or `console`                                                |
| `502`, `RESEND_API_KEY is not set`       | Set the secret, or use `console` locally                                     |
| `502`, `resend_403_…`                    | Bad key or unverified domain in Resend                                       |
| `502`, `resend_429_…`                    | Resend limit (100 a day); wait                                               |
| `403 verification` on staging            | Expected: Turnstile accepts only `minimalist.hr`                             |
| `403 verification` in production         | Site key and secret from different widgets, or the key missing at build time |
| Success but no email                     | The honeypot was filled (autofill?)                                          |
| Notification but no auto-reply           | Worker logs: `auto-reply failed`                                             |
| Emails in spam                           | Check SPF, DKIM, DMARC records; read a test email's headers                  |

## Languages and pages

| Symptom                                  | Fix                                                           |
| :--------------------------------------- | :------------------------------------------------------------ |
| Switch on a case study goes to the list  | No entry with the same `translationKey` in the other language |
| Case study has a card but no page        | `status: in-progress`                                         |
| An insight is missing                    | `draft: true` or `showInsights: false`                        |
| New page missing from sitemap and switch | Add it to `src/i18n/routes.ts`                                |
| `/hr/…` 404 shows English                | `dist/hr/404.html` missing; check the build log               |
| Staging in search results                | `deploy_staging` didn't append `noindex`; `curl -I` it        |

## Tests and CI

| Symptom                               | Fix                                                         |
| :------------------------------------ | :---------------------------------------------------------- |
| Tests fail reading `dist/sitemap.xml` | Build first                                                 |
| Tests see old pages                   | A reused `wrangler dev` serves an old build: stop, rebuild  |
| `audit`: browser executable not found | Playwright image tag ≠ `@playwright/test`; bump both        |
| Lighthouse `NO_NAVSTART`              | Already retried three times; rerun the job                  |
| Lighthouse below 95 only in CI        | Runner noise; rerun, investigate if it repeats              |
| CI install fails on an install script | Approve the package in `allowBuilds` (ask first)            |
| pnpm refuses a just-published version | Wait, or add it to `minimumReleaseAgeExclude` with a reason |
| `--frozen-lockfile` fails             | `pnpm install` and commit `pnpm-lock.yaml`                  |
| No workflow on push                   | Plain pushes run nothing; open a pull request               |
| Deploy auth error                     | Replace `CLOUDFLARE_API_TOKEN` in both environments         |
| `wiki` job fails to clone             | The wiki has no first page yet; create one in the GitHub UI |

Logs: Cloudflare → the Worker → Logs; locally the `wrangler dev` terminal; GitHub → Actions for
runs and artifacts.
