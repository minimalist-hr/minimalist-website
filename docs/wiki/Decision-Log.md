# Decision log

Decisions that shape the project, with their reasons. To change one, add a row with the date and
reason, and update the pages that describe it.

## Foundations

| Area            | Decision                                                  | Why                                                                                |
| :-------------- | :-------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| Framework       | Astro, static output                                      | A content site: HTML and CSS, almost no JavaScript; built-in i18n and collections. |
| Styling         | Plain CSS, custom properties, Astro scoped styles         | A few neutrals and one typeface; tokens map 1:1 to CSS variables.                  |
| Browser JS      | Small vanilla TypeScript scripts                          | No framework runtime in the browser.                                               |
| Content         | Content collections (Markdown + typed schema)             | Adding a case study or article means adding a file.                                |
| Hosting         | Cloudflare Workers with static assets (not Pages)         | Free static requests, fast EU edge, preview URLs.                                  |
| CI/CD           | GitLab CI deploying with Wrangler; no Cloudflare Git link | Deploys only after the pipeline passes; everything is defined in the repo.         |
| Form spam       | Turnstile + honeypot                                      | Invisible to most visitors, cookieless.                                            |
| Form email      | Resend, eu-west-1                                         | No database, small GDPR surface. Resend keeps logs in the US.                      |
| Inbox           | iCloud+ Custom Email Domain                               | Owner's choice. No DPA; may move to Zoho later.                                    |
| Analytics       | Cloudflare Web Analytics                                  | Cookieless, so no cookie banner.                                                   |
| Fonts           | Self-hosted Archivo variable woff2, latin + latin-ext     | Performance, GDPR, Croatian diacritics.                                            |
| Package manager | pnpm, version pinned                                      | Fast, strict, reproducible.                                                        |
| Sitemap         | Own endpoint, not `@astrojs/sitemap`                      | The integration pairs languages by path; Croatian slugs are translated.            |
| Tests           | Playwright end to end, no unit test framework             | The logic is small; what matters is behaviour in real browsers.                    |

## Approved deviations from the brand or design

| Date       | Deviation                                                               | Reason                                                                                          |
| :--------- | :---------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| 2026-09    | Light `--graphite` is `#67655E`, not the brand's `#7E7C75`              | The brand value is 3.80:1 on paper, short of AA for small labels. The new one is 5.30:1.        |
| 2026-09-19 | Motion **Enter** (content fades up once) and **Page** (240ms crossfade) | Owner's call; within the brand easing and durations.                                            |
| 2026-09-19 | Card lift removed                                                       | Nothing uses Lift now.                                                                          |
| 2026-09-22 | Photographs in full colour, not greyscale                               | Owner's call. Ratios, no rounded corners, no shadows, no CSS filters still apply.               |
| 2026-09-22 | **Field**: decorative background canvas on every page                   | Owner's call. Axis-aligned graphite hairlines stay inside the palette and geometry.             |
| 2026-10-28 | The field stays out of the content column, shown only beside it         | It clashed with text and rules. Line strength raised to the hero's, since it's off the text.    |
| 2026-10-28 | Hero text on a blurred patch of the field                               | Keeps headline and lede clean. Blurs the canvas, not an image, so "no filters on images" holds. |
| 2026-10-28 | Mockups on a dark background get a light-theme version                  | They stayed dark in the light theme. Only the background is redrawn.                            |
| 2026-10-28 | Notes on case study screenshots (box, square, leader line, label)       | The mockups' empty background read as empty. Page text, so bilingual and accessible.            |
| Build      | FAQ on Services, not Approach                                           | Approach became a timeline; the FAQ fits "what you get".                                        |
| Build      | Approach as an alternating timeline                                     | Agreed during the build.                                                                        |
| Build      | About portrait after the studio text on mobile                          | Desktop keeps it on the left.                                                                   |
| Build      | The design's placeholder clients, figures and quotes removed            | Only verified content is published.                                                             |

## Operations

| Date       | Decision                                                             | Why                                                                                 |
| :--------- | :------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| 2026-09-18 | Custom domains declared in `wrangler.jsonc`, not the dashboard       | A deploy can never drop them.                                                       |
| 2026-09-18 | `workers_dev: false`, `preview_urls: true`                           | Production answers only on minimalist.hr; staging keeps its workers.dev URL.        |
| 2026-09-25 | One staging preview; pipelines only on MRs, `staging` and `main`     | Saves GitLab compute minutes.                                                       |
| 2026-09-25 | Audit job only on `staging` → `main` MRs                             | Once per release instead of on every change.                                        |
| 2026-09-26 | Required consent checkbox on the form                                | GDPR: the inquirer accepts the privacy policy; the Worker rejects a submit without. |
| 2026-09-26 | Legal texts final without outside review                             | Owner's call. Revisit if the site starts collecting anything new.                   |
| 2026-10-29 | CI publishes the GitLab wiki after each production deploy            | A manual sync was easy to forget.                                                   |
| 2026-10-29 | Wiki cut to 20 pages; code comments explain code only, no wiki links | One place per fact; less to keep in sync.                                           |

## Out of scope

Decided against. Don't add without a new row above.

| Not built                                   | Why                                                                        |
| :------------------------------------------ | :------------------------------------------------------------------------- |
| CMS                                         | Content changes are rare and made by a developer.                          |
| Database or stored submissions              | Inquiries go to the inbox. Less to secure and declare.                     |
| Cookies, tracking pixels, chat widgets      | They need a cookie banner.                                                 |
| Browser-language redirects                  | Hurt SEO and override the visitor's choice.                                |
| Per-branch preview URLs                     | CI minutes; one staging preview instead.                                   |
| HSTS `preload`                              | Locks every subdomain to HTTPS for good; not certain.                      |
| Cloudflare Email Routing / Email Sending    | Routing replaces iCloud's MX; Sending needs Workers Paid.                  |
| A working form on staging                   | Turnstile accepts only hostnames of zones in the account, not workers.dev. |
| RSS, search, comments, newsletter, accounts | Not needed now.                                                            |
| Invented client names, figures or quotes    | Clients are named and quoted only with written approval; results measured. |

## Open items

Not committed; each needs the owner's go-ahead.

- More case studies and insights, when real ones exist.
- DMARC `p=quarantine`: safe whenever wanted (both senders pass DKIM); `p=none` is valid.
- Move the inbox off iCloud: changes MX, SPF, DKIM and the privacy policy.
- Per-case-study share images: the SEO head accepts an `image` prop; no page passes one yet.
- Known gap: without JavaScript the Worker redirects to `/contact/?status=<result>`, which the
  static page doesn't read. A no-JS submit always fails Turnstile anyway, and a `<noscript>` note
  gives the email address.
