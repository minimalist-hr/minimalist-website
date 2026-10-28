# Troubleshooting

## Build and type checks

| Symptom                                                            | Cause                                                 | Fix                                                                                            |
| :----------------------------------------------------------------- | :---------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| `pnpm run check` fails in `src/i18n/ui.ts` with a missing property | A key exists in `en` but not `hr` (or the reverse)    | Add the key to both objects                                                                    |
| Type error in a view's `copy`                                      | One language is missing a field                       | Add it to both `en` and `hr`                                                                   |
| `No image file for "<key>" in src/assets/images/`                  | A key in `src/lib/images.ts` has no `.jpg`/`.png`     | Add the file with exactly that name, or remove the key                                         |
| Build fails with a content schema error                            | Frontmatter doesn't match `src/content.config.ts`     | Read the field named in the error; check types (e.g. `year` is a number, `website` a full URL) |
| `nav.<route>` type error                                           | A new nav route has no UI string                      | Add `nav.<route>` to both languages                                                            |
| `tsc -p src/worker` fails on `Env`                                 | Worker types are stale after editing `wrangler.jsonc` | `pnpm run types:worker`                                                                        |
| Prettier reports every line changed                                | CRLF line endings                                     | `git add --renormalize .`; check `core.autocrlf`. `.gitattributes` forces LF                   |
| `rename` error in the `localized-404` integration                  | `src/pages/hr/404.astro` missing or moved             | Keep one `404.astro` per non-default locale                                                    |

## Styling

| Symptom                                           | Cause                                                              | Fix                                                                                            |
| :------------------------------------------------ | :----------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| A class passed to a child component does nothing  | Astro scoped CSS doesn't reach a child component's root            | Add a prop to the child, or wrap it in an element the parent owns                              |
| A rule touches the screen edges on phones         | A border on `.container` runs through its padding                  | Use `.rule-top` / `.rule-bottom`                                                               |
| An element hidden by a script still shows         | The component sets `display`, which beats the `hidden` attribute   | Add `.thing[hidden] { display: none; }`                                                        |
| A reveal state doesn't override a component style | `motion.css` must stay unlayered and use `:root` selectors         | Don't move it into a layer                                                                     |
| Content invisible after load                      | A reveal stayed `pending` (script error, element never intersects) | Check the console; elements with no size are skipped, but one inside a hidden parent can stick |
| Theme flashes on load                             | The theme script moved or was bundled                              | `ThemeScript` must render early in `<head>`, inline, after the `theme-color` meta              |

## Scripts and CSP

| Symptom                                            | Cause                                        | Fix                                                                     |
| :------------------------------------------------- | :------------------------------------------- | :---------------------------------------------------------------------- |
| "Refused to execute inline script" in the console  | An inline script whose hash isn't in the CSP | Move its body to `src/lib/inline-scripts.ts` and render with `set:html` |
| A third-party script, iframe or request is blocked | Its origin isn't in the CSP                  | Add it to the right directive in `astro.config.mjs` (after a decision)  |
| `style` attribute blocked                          | Shouldn't happen: attributes are allowed     | Check it's an attribute, not a `<style>` element added at runtime       |

## Contact form

| Symptom                                                       | Cause                                                                                                                                     | Fix                                                                                        |
| :------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `/api/contact` returns 404 locally                            | `pnpm dev` has no Worker                                                                                                                  | `pnpm run build && pnpm exec wrangler dev`                                                 |
| `503 unavailable`, log says `TURNSTILE_SECRET_KEY is not set` | No `.dev.vars` (locally) or missing secret (production)                                                                                   | `cp .dev.vars.example .dev.vars`; in production set the secret in Cloudflare               |
| `502 send`, log `Unknown MAIL_PROVIDER`                       | `MAIL_PROVIDER` not `resend` or `console`                                                                                                 | Fix `.dev.vars` or `wrangler.jsonc`                                                        |
| `502 send`, log `RESEND_API_KEY is not set`                   | `MAIL_PROVIDER=resend` without a key                                                                                                      | Set the secret, or use `console` locally                                                   |
| `502 send`, log `resend_403_…`                                | Bad key, unverified domain, or a missing `User-Agent`                                                                                     | Check the key and the domain in Resend                                                     |
| `502 send`, log `resend_429_…`                                | Rate or daily limit (100/day on the free plan)                                                                                            | Wait, or upgrade the Resend plan                                                           |
| `403 verification` on staging                                 | The Turnstile widget only accepts `minimalist.hr`                                                                                         | Expected. Test locally or on production                                                    |
| `403 verification` in production                              | Site key and secret don't belong to the same widget, or `PUBLIC_TURNSTILE_SITE_KEY` wasn't set at build time (falls back to the test key) | Check the GitLab variable and rebuild                                                      |
| `403 Forbidden` (plain text)                                  | `Origin` header differs from the Worker's origin                                                                                          | Post from the same origin; don't call the API cross-site                                   |
| Success shown but no email                                    | Honeypot was filled (an autofill tool?)                                                                                                   | The hidden `website` field must stay empty                                                 |
| No auto-reply, notification arrived                           | Auto-reply failure is only logged                                                                                                         | Check Worker logs for `auto-reply failed`                                                  |
| Emails land in spam                                           | DNS records changed                                                                                                                       | Check SPF, DKIM (`resend._domainkey`, `send.`) and DMARC; send a test and read the headers |

## Language switch and SEO

| Symptom                                            | Cause                                                         | Fix                                                                   |
| :------------------------------------------------- | :------------------------------------------------------------ | :-------------------------------------------------------------------- |
| Switch on a case study goes to the other list page | No entry with the same `translationKey` in the other language | Add the translation, or fix the key                                   |
| A case study has a card but no page                | `status: in-progress`                                         | Set `published`                                                       |
| An insight is missing                              | `draft: true`, or `showInsights: false`                       | Change the frontmatter or flag                                        |
| A new page is missing from the sitemap and switch  | No route map entry                                            | Add it to `src/i18n/routes.ts`                                        |
| `/hr/…` 404 shows English                          | `dist/hr/404.html` missing                                    | Check the build log for `hr/404/index.html → hr/404.html`             |
| Staging appears in search                          | `noindex` header missing                                      | Check `deploy_staging` appended to `dist/_headers`; `curl -I` the URL |

## Tests

| Symptom                                              | Cause                                                        | Fix                                                                             |
| :--------------------------------------------------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------ |
| Tests fail immediately reading `dist/sitemap.xml`    | No build                                                     | `pnpm run build`                                                                |
| Tests use stale pages                                | Playwright reused a running `wrangler dev` with an old build | Stop it, rebuild, rerun                                                         |
| Keyboard tests skipped in WebKit                     | WebKit skips links on Tab, like Safari                       | Expected                                                                        |
| `audit` fails to start: browser executable not found | Playwright image tag ≠ `@playwright/test` version            | Bump both together                                                              |
| Lighthouse `NO_NAVSTART`                             | CI browser flake                                             | Already retried three times; rerun the job if all fail                          |
| `lhci collect` EPERM on Windows                      | Chrome-launcher cleanup bug                                  | Use the remote-debugging approach in [Testing](/Development/Testing#on-windows) |
| Lighthouse performance below 95 only in CI           | Shared runner noise                                          | Check the median report; rerun. Investigate if it repeats                       |

## Install and CI

| Symptom                                | Cause                                        | Fix                                                                       |
| :------------------------------------- | :------------------------------------------- | :------------------------------------------------------------------------ |
| CI install fails on an install script  | Package not approved                         | Add it to `allowBuilds` in `pnpm-workspace.yaml` (after approval)         |
| pnpm refuses a just-published version  | Minimum release age                          | Wait, or add an exact version to `minimumReleaseAgeExclude` with a reason |
| `pnpm install --frozen-lockfile` fails | `package.json` changed without the lockfile  | Run `pnpm install` locally and commit `pnpm-lock.yaml`                    |
| Wrong pnpm version                     | Corepack not enabled                         | `corepack enable`                                                         |
| No pipeline on push                    | Plain branch pushes run nothing              | Open a merge request                                                      |
| Deploy fails with an auth error        | Cloudflare token expired or lacks permission | Owner replaces `CLOUDFLARE_API_TOKEN` in GitLab                           |

## Getting more information

- Worker logs: Cloudflare → Workers & Pages → `minimalist-website` → Logs.
- Locally: the `wrangler dev` terminal.
- Deploy history and rollback: Cloudflare → the Worker → Deployments.
- Pipeline logs and artifacts: GitLab → Build → Pipelines.
