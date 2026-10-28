# Scope

## In scope

**Pages** (each in English and Croatian, see [Pages and content](/Product/Pages-and-Content)):
Home, Work (list), Case study, Services, Approach, Skills, About, Insights (list), Insight
(article), Contact, Legal, and a not-found page per language.

**Behaviour**

- Two languages with translated URLs and a language switch that keeps you on the same page.
- Dark and light themes, remembered per browser, with no flash on load.
- A responsive layout from 320px to 2560px: the mobile design below 960px, the desktop design above.
- A contact form with spam protection, a notification email to the studio and an auto-reply
  to the sender in their language.
- Motion inside the brand's limits: rules that draw in, content that fades up once, page
  crossfades, a rotating hero headline, and a decorative background canvas.
- SEO: titles, descriptions, canonical and `hreflang` links, Open Graph, JSON-LD, a sitemap
  and `robots.txt`.
- Accessibility to WCAG 2.2 AA, checked automatically on every release.
- Security headers and a Content Security Policy with no `'unsafe-inline'` scripts.
- CI/CD with a staging preview and gated production releases.

## Out of scope

These were considered and left out on purpose. Don't add them without a new decision
(record it in the [Decision log](/Overview/Decision-Log)).

| Not built                                | Why                                                                                  |
| :--------------------------------------- | :----------------------------------------------------------------------------------- |
| CMS (e.g. Keystatic)                     | Content changes are rare and made by a developer. Adding content means adding a file |
| Database or stored submissions           | Inquiries go straight to the inbox. Less to secure, less to declare under GDPR       |
| RSS feed                                 | Not needed for now; the owner tracks it separately                                   |
| Cookies, tracking pixels, chat widgets   | They would need a cookie banner. Analytics is cookieless                             |
| Browser-language redirects               | They hurt SEO and override the visitor's choice. The language switch is enough       |
| Per-branch preview URLs                  | Dropped on 2026-09-25 to save CI minutes; one staging preview instead                |
| HSTS `preload`                           | It would lock every subdomain to HTTPS for good, and that isn't certain              |
| Cloudflare Email Routing                 | It would replace the iCloud MX records                                               |
| A working form on the staging preview    | Turnstile only accepts hostnames in the Cloudflare account, so not workers.dev       |
| Search, comments, newsletter, accounts   | Not needed by a studio site of this size                                             |
| Invented client names, figures or quotes | Clients are named and quoted only with written approval; results are measured        |

## Constraints

- **Brand.** Neutral colours only, Archivo 400/500 only, fixed motion vocabulary, quiet copy.
  These are hard rules; see [Design system](/Product/Design-System).
- **Design is the spec.** Copy, sizes and spacing come from the files in `design/`. New
  sections, components or visual styles need the owner's approval first.
- **Bilingual.** Every user-facing string exists in both languages, including alt text, aria
  labels, meta descriptions, form messages and emails.
- **No JavaScript required.** Every page reads and navigates without JavaScript. Nothing is
  hidden waiting for a script.
- **Small dependency surface.** Two runtime dependencies (`astro`, `sharp`). A new package
  needs a stated reason and the owner's approval.
- **Free tiers.** Cloudflare Workers Free, Resend free plan (3,000 emails a month, 100 a day),
  GitLab.com compute-minute quota.

## Quality targets

| Target                    | Value                                                      | Checked by                                     |
| :------------------------ | :--------------------------------------------------------- | :--------------------------------------------- |
| Accessibility             | WCAG 2.2 AA, zero axe violations                           | `test:a11y` in the release merge request       |
| Lighthouse (mobile)       | Performance ≥ 95, Accessibility, Best Practices, SEO = 100 | `test:lighthouse` in the release merge request |
| Core Web Vitals           | LCP < 1.8s on 4G, CLS < 0.05, INP < 200ms                  | Lighthouse, Cloudflare Web Analytics           |
| JavaScript per page       | < 20 kB gzipped (Turnstile excluded)                       | Build output                                   |
| Layout                    | No horizontal scroll from 320px to 2560px                  | Reflow tests at 320px and 640px, manual        |
| Tap targets / form inputs | ≥ 44px / 16px text                                         | Design tokens, manual                          |
