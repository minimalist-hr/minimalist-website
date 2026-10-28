# Roadmap

## Where the project is

All four build phases are done and the site is live. Nothing is scheduled. Work from here is:

- **Content:** add case studies and insights when real ones exist. Clients are named and
  quoted only with their written approval; results are measured, never estimated.
- **Maintenance:** dependency updates, browser fixes, copy corrections.

## History

| Date       | What changed                                                                                                                                                                                                                                                                                                                                               |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-17 | **Phase 1, foundation.** Astro scaffold, tokens, self-hosted Archivo, base layout, header, footer, theme and language switches, i18n helpers. GitLab CI → Cloudflare deploys live before any feature work.                                                                                                                                                 |
| 2026-09-18 | **Phases 2–4.** All pages in both languages, content collections, contact form and Worker, Turnstile, Resend, SEO, security headers, accessibility and Lighthouse audits. Custom domains `minimalist.hr` and `www`, indexing turned on, sitemap submitted to Google and Bing. **Public launch.**                                                           |
| 2026-09-19 | Motion additions approved (Enter, Page). Links behave like the header nav everywhere. Card lift removed. Branded HTML emails. Auto-reply to the sender in their language. Smaller budget ranges on the form.                                                                                                                                               |
| 2026-09-20 | Portfolio link on About points to mucnjakf.dev and opens in a new tab.                                                                                                                                                                                                                                                                                     |
| 2026-09-22 | Stock photographs for services, steps and the insight cover; the real portrait on About. Photographs move to full colour (approved deviation). Background field added behind every page, then reworked as an adaptive quadtree. Hero line breaks fixed on mobile and for the Croatian desktop phrase. The insight is replaced by "How this site is built". |
| 2026-09-25 | CI switches to feature → `staging` → `main` with one staging preview, to save compute minutes. The Lift-Mučnjak placeholder becomes the real case study, with screenshots and a link to the live site.                                                                                                                                                     |
| 2026-09-26 | Required consent checkbox on the form. Measured results and an approved client quote on the case study. Legal texts accepted as final. Every remaining open question closed.                                                                                                                                                                               |

## Build phases

| Phase                        | Goal                                                                                                           | Status |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------- | :----- |
| 1. Foundation                | Empty EN and HR pages deploy to a preview; theme and language switch work; header correct from 320px to 2560px | Done   |
| 2. Components and pages      | Every page matches the mobile design below md and the desktop design above, in both languages and themes       | Done   |
| 3. Functionality and quality | Contact form, Worker, SEO, security headers, analytics, accessibility and Lighthouse targets                   | Done   |
| 4. Content and launch        | Real content, photography, legal texts, email, cross-device testing, domain, launch                            | Done   |

## Possible later work

None of this is committed. Each item needs the owner's go-ahead.

| Item                                       | Notes                                                                                                           |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| More case studies and insights             | When they exist. See [Add a case study](/Guides/Add-a-Case-Study) and [Add an insight](/Guides/Add-an-Insight). |
| DMARC `p=quarantine`                       | Optional. Both senders (iCloud, Resend) pass DKIM, so it's safe whenever wanted. `p=none` is valid as is.       |
| Move the mailbox off iCloud (e.g. to Zoho) | iCloud has no data processing agreement. Would change MX, SPF and DKIM records and the privacy policy.          |
| RSS feed for insights                      | Tracked by the owner. Cheap with `@astrojs/rss` if it is ever wanted (a new dependency, so ask first).          |
| Per-case-study share images                | The SEO head already accepts an `image` prop; no page passes one yet.                                           |
| Revisit the legal texts                    | Required if the site starts collecting anything new (embeds, a new processor, cookies).                         |

## Known small gaps

Found while writing this wiki. Low impact; listed so they aren't rediscovered.

- **No-JavaScript form result isn't shown.** Without JavaScript the Worker redirects to
  `/contact/?status=<result>`, but the static contact page doesn't read `status`. In practice
  a no-JS submit always fails the Turnstile check, and the page already shows a `<noscript>`
  note with the email address instead.

## Not planned

See [Scope → Out of scope](/Overview/Scope#out-of-scope) for things that were decided against
(CMS, database, cookies, browser-language redirects, HSTS preload and others).
