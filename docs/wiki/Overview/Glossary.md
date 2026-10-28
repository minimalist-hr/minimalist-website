# Glossary

## Product and content

| Term               | Meaning                                                                                                                                    |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **Case study**     | One entry in the `work` content collection, with its own page at `/work/<slug>/`.                                                          |
| **In progress**    | A case study with `status: in-progress`. It shows a card with "[ case study in progress ]" and has no page.                                |
| **Featured**       | A case study with `featured: true`. It appears in "Selected work" on the home page.                                                        |
| **Insight**        | An article in the `insights` content collection, at `/insights/<slug>/`.                                                                   |
| **Draft**          | An insight with `draft: true`. It is left out of the build.                                                                                |
| **translationKey** | The shared key that pairs the English and Croatian files of one case study or insight.                                                     |
| **Image key**      | The name of a file in `src/assets/images/` without its extension (e.g. `step-build`), registered with its alt text in `src/lib/images.ts`. |
| **Placeholder**    | The striped box with a caption shown in an image slot that has no image key.                                                               |
| **CTA band**       | The closing call to action at the bottom of a page: a line, a "Start a project" button and a link to the next section.                     |
| **Hero**           | The top of the home page, with the rotating headline.                                                                                      |
| **Studio**         | Minimalist. Copy says "studio", never "agency".                                                                                            |

## Brand and design

| Term                            | Meaning                                                                                         |
| :------------------------------ | :---------------------------------------------------------------------------------------------- |
| **Token**                       | A CSS custom property in `src/styles/tokens.css` (colour, size, spacing, motion).               |
| **Paper / Raise / Ink / Ink-2** | Page ground, raised surface, main text, secondary text.                                         |
| **Graphite**                    | The grey for labels, metadata and captions only. Never body copy.                               |
| **Rule / hairline**             | A 1px divider line in `--rule`.                                                                 |
| **Stripe A / B**                | The two tones of the image placeholder stripes.                                                 |
| **Wordmark**                    | `MINIMALIST` plus a closing square. Used in the header and footer.                              |
| **Integrated mark**             | The M with INIMALIST beneath it. Used only for the favicon, app icons and share image.          |
| **Label**                       | Uppercase small text, weight 500, wide tracking (`.label`).                                     |
| **Reveal**                      | Motion: a rule or underline extends from the left (240ms).                                      |
| **Lift**                        | Motion: translate only (160ms). Defined but unused at the moment.                               |
| **State**                       | Motion: a colour change (≤150ms, linear).                                                       |
| **Enter**                       | Motion: content below the fold fades up 10px once as it scrolls into view.                      |
| **Page**                        | Motion: a 240ms crossfade between pages (cross-document view transitions).                      |
| **Field / background field**    | The decorative canvas behind every page that draws an adaptive quadtree.                        |
| **Quadtree**                    | A grid where each cell can split into four smaller cells; here it splits near the pointer.      |
| **md**                          | The 960px (`60rem`) breakpoint. Below it the mobile design applies, from it the desktop design. |

## Code and architecture

| Term                | Meaning                                                                                                              |
| :------------------ | :------------------------------------------------------------------------------------------------------------------- |
| **Page (file)**     | A thin file in `src/pages/` that maps a URL to a view and passes `locale`.                                           |
| **View**            | A component in `src/views/` that renders one page for either language and holds that page's copy.                    |
| **Route map**       | `src/i18n/routes.ts`: every static page's English and Croatian path.                                                 |
| **Alternates**      | The paths of one page in every language. Used for `hreflang` and the language switch.                                |
| **Locale**          | `en` or `hr`.                                                                                                        |
| **`Localized<T>`**  | A value written once per language: `{ en: …, hr: … }`.                                                               |
| **UI string**       | Shared interface text in `src/i18n/ui.ts`, read with `t('key')`.                                                     |
| **Island / script** | A small `<script>` in a component, bundled by Astro, that adds behaviour to static HTML.                             |
| **Inline script**   | One of the two blocking scripts in `<head>` (JS flag, theme). Their exact text lives in `src/lib/inline-scripts.ts`. |
| **`data-js`**       | Attribute set on `<html>` by the first inline script, so CSS can tell JavaScript is available.                       |
| **Worker**          | The Cloudflare Worker script in `src/worker/`. Handles `POST /api/contact`.                                          |
| **Static assets**   | The built `dist/` folder, served by Cloudflare before the Worker runs.                                               |
| **`ASSETS`**        | The Worker binding that serves static assets; the Worker hands every non-form request to it.                         |
| **Mailer**          | The interface in `src/worker/mail/types.ts` that hides the email provider.                                           |
| **`MAIL_PROVIDER`** | Worker variable that picks the mailer: `resend` (production) or `console` (local).                                   |
| **Inquiry**         | A validated contact form submission. Its contract is in `src/lib/inquiry.ts`.                                        |
| **Honeypot**        | The hidden `website` field. Bots fill it; the Worker then pretends success and sends nothing.                        |
| **Auto-reply**      | The fixed confirmation email sent to the inquirer after the notification is delivered.                               |

## Infrastructure and tooling

| Term                        | Meaning                                                                                                                  |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **Wrangler**                | Cloudflare's CLI. Runs the Worker locally and deploys it.                                                                |
| **Version upload**          | `wrangler versions upload`: uploads a Worker version without making it live. Used for staging.                           |
| **Preview alias**           | The fixed name (`staging`) a version upload is reachable under: `staging-minimalist-website.minimalist-1a8.workers.dev`. |
| **Turnstile**               | Cloudflare's cookieless bot check. The widget issues a token; the Worker verifies it with _siteverify_.                  |
| **Resend**                  | The transactional email API the Worker sends through.                                                                    |
| **CSP**                     | Content Security Policy. Emitted as a `<meta>` tag per page, with hashes of every allowed inline script.                 |
| **`_headers`**              | `public/_headers`: response headers Cloudflare adds to static files.                                                     |
| **`X-Robots-Tag: noindex`** | Header CI appends for the staging preview so it is never indexed.                                                        |
| **hreflang / x-default**    | Links that tell search engines which URL is which language; `x-default` points to English.                               |
| **JSON-LD**                 | Structured data (schema.org) in a `<script type="application/ld+json">`.                                                 |
| **axe**                     | The accessibility rules engine used by `tests/a11y.spec.ts`.                                                             |
| **Lighthouse / LHCI**       | Google's page audit, run through Lighthouse CI in `scripts/lighthouse.mjs`.                                              |
| **`NO_NAVSTART`**           | A Lighthouse flake in CI containers where a page load isn't recorded. Runs are retried.                                  |
| **Release MR**              | The `staging` → `main` merge request. Runs the audit; merging it deploys production.                                     |
| **Hotfix**                  | A merge request straight into `main`, merged back into `staging` afterwards.                                             |

## Croatian and legal

| Term                                                                             | Meaning                                                                                                     |
| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **radovi / usluge / pristup / vještine / o-studiju / zapisi / kontakt / pravno** | URL slugs for work, services, approach, skills, about, insights, contact, legal.                            |
| **obrt**                                                                         | A Croatian sole-proprietor business form. Minimalist's legal name is "Minimalist, obrt za razvoj softvera". |
| **OIB**                                                                          | Croatian personal identification number, shown on the Legal page.                                           |
| **Matični broj obrta**                                                           | Business registration number.                                                                               |
| **d.o.o.**                                                                       | Croatian limited liability company (e.g. the client Lift-Mučnjak d.o.o.).                                   |
| **„…”**                                                                          | Croatian quotation marks, used in Croatian copy instead of “…”.                                             |
| **SPF / DKIM / DMARC**                                                           | Email authentication DNS records. See [Infrastructure](/Architecture/Infrastructure#email-and-dns).         |
