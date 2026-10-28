# Decision log

Decisions that shape the code, with their reasons. This page is the project's decision record
(it replaces the original build plan, removed on 2026-10-28; its history is in git). If you
change a decision, add a row with the date and the reason, and update the pages that describe it.

## Foundations

| Area            | Decision                                                                 | Why                                                                                                  |
| :-------------- | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Framework       | Astro, `output: 'static'`                                                | A content site. Ships HTML and CSS with almost no JavaScript; built-in i18n and content collections. |
| Styling         | Plain CSS, custom properties, Astro scoped styles                        | The brand is a few neutrals and one typeface; tokens map 1:1 to CSS variables.                       |
| Content         | Content collections (Markdown + typed schema)                            | Adding a case study or article means adding a file.                                                  |
| Browser JS      | Vanilla TypeScript islands                                               | No framework runtime in the browser.                                                                 |
| Hosting         | Cloudflare Workers with static assets (not Pages)                        | Cloudflare's recommended target; free static requests; fast EU edge; preview URLs.                   |
| CI/CD           | GitLab CI deploying with Wrangler; Cloudflare's Git integration not used | Deploys only happen after the pipeline passes; everything is defined in the repo.                    |
| Form spam       | Cloudflare Turnstile + honeypot                                          | Invisible to most visitors, cookieless.                                                              |
| Form email      | Resend, sending region eu-west-1                                         | No database; small GDPR surface. Resend keeps logs in the US.                                        |
| Analytics       | Cloudflare Web Analytics                                                 | Cookieless, so no cookie banner.                                                                     |
| Fonts           | Self-hosted Archivo variable woff2, latin + latin-ext                    | Performance, GDPR, Croatian diacritics.                                                              |
| Package manager | pnpm, version pinned in `package.json`                                   | Fast, strict, reproducible.                                                                          |
| Sitemap         | Custom endpoint, not `@astrojs/sitemap`                                  | The integration pairs languages by matching paths; Croatian slugs are translated.                    |

## Approved deviations from the brand or design

| Date       | Deviation                                                                      | Reason                                                                                                        |
| :--------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| 2026-09    | Light-theme `--graphite` is `#67655E`, not the brand's `#7E7C75`               | The brand value is 3.80:1 on paper, short of WCAG AA for small labels. The new value is 5.30:1.               |
| 2026-09-19 | Motion: **Enter** (content fades up once) and **Page** (240ms crossfade) added | Owner's call; both stay within the brand easing and durations.                                                |
| 2026-09-19 | Card lift removed                                                              | Nothing uses Lift now.                                                                                        |
| 2026-09-22 | Photographs in full colour, not greyscale                                      | Owner's call. Ratios, no rounded corners, no shadows and no CSS filters still apply.                          |
| 2026-09-22 | **Field**: decorative background canvas on every page                          | Owner's call. Axis-aligned graphite hairlines, so it stays inside the palette and geometry.                   |
| 2026-10-28 | Field kept out of content: blocks are opaque, the field shows between them     | Owner's call: it clashed with text and rules. Ambient alpha 0.05 → 0.11, since it no longer sits behind text. |
| Build      | FAQ moved from Approach to Services                                            | Approach became a timeline; the FAQ fits the "what you get" page.                                             |
| Build      | Approach uses an alternating timeline                                          | Agreed during the build; see [Pages and content → Approach](/Product/Pages-and-Content#approach).             |
| Build      | About portrait follows the studio text on mobile                               | Desktop keeps it on the left.                                                                                 |

## Settled questions

| #   | Question                         | Answer                                                                             |
| :-- | :------------------------------- | :--------------------------------------------------------------------------------- |
| 1   | Email API provider               | Resend, eu-west-1                                                                  |
| 2   | Mailbox provider                 | iCloud+ Custom Email Domain (no DPA; may move to Zoho later)                       |
| 3   | Address shown on the site        | `hello@minimalist.hr`                                                              |
| 4   | Rotating hero headline or static | Rotation kept                                                                      |
| 5   | Insights at launch               | Shown, with one real article                                                       |
| 6   | Which case studies               | Lift-Mučnjak only, with written permission, measured results and an approved quote |
| 7   | Studio address and call block    | Address confirmed; the call block has no link (calls are arranged by email)        |
| 8   | Auto-reply                       | Added 2026-09-19                                                                   |
| 9   | Git-based CMS                    | Not needed                                                                         |
| 10  | Outside legal review             | No. Owner accepted the texts as final on 2026-09-26                                |
| 11  | DMARC `quarantine`               | Optional, not required                                                             |
| 12  | HSTS `preload`                   | No                                                                                 |
| 13  | RSS feed                         | Not needed for now                                                                 |

## Operational decisions

| Date       | Decision                                                         | Why                                                                                      |
| :--------- | :--------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| 2026-09-18 | Custom domains declared in `wrangler.jsonc`, not the dashboard   | A deploy can never drop them.                                                            |
| 2026-09-18 | `workers_dev: false`, `preview_urls: true`                       | Production answers only on minimalist.hr; the staging preview keeps its workers.dev URL. |
| 2026-09-18 | Cloudflare Email Sending not used                                | Needs Workers Paid; Email Routing would take over iCloud's MX.                           |
| 2026-09-25 | One staging preview, pipelines only on MRs, `staging` and `main` | Saves GitLab compute minutes.                                                            |
| 2026-09-25 | Audit job only on `staging` → `main` MRs                         | Runs once per release instead of on every change.                                        |
| 2026-09-26 | Required consent checkbox                                        | GDPR: the inquirer accepts the privacy policy; the Worker rejects a submit without it.   |
