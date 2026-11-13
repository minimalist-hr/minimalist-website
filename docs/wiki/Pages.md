# Pages

## Routes

Each page has one view in `src/views/`, shared by both languages; the route files in
`src/pages/` only pass `locale`. Paths come from `src/i18n/routes.ts`.

| Page       | EN                  | HR                   | Content from                                              |
| :--------- | :------------------ | :------------------- | :-------------------------------------------------------- |
| Home       | `/`                 | `/hr/`               | View copy, `src/data/*`, featured work, latest 3 insights |
| Work       | `/work/`            | `/hr/radovi/`        | `work` collection (all statuses)                          |
| Case study | `/work/<slug>/`     | `/hr/radovi/<slug>/` | One published `work` entry                                |
| Services   | `/services/`        | `/hr/usluge/`        | `services.ts`, `faq.ts`                                   |
| Approach   | `/approach/`        | `/hr/pristup/`       | `steps.ts`, view copy (pricing)                           |
| Skills     | `/skills/`          | `/hr/vjestine/`      | `skills.ts`                                               |
| About      | `/about/`           | `/hr/o-studiju/`     | `about.ts`, `stats.ts`, view copy                         |
| Insights   | `/insights/`        | `/hr/zapisi/`        | `insights` collection (non-draft)                         |
| Insight    | `/insights/<slug>/` | `/hr/zapisi/<slug>/` | One `insights` entry                                      |
| Contact    | `/contact/`         | `/hr/kontakt/`       | View copy, `ContactForm`, `site.config.ts`                |
| Legal      | `/legal/`           | `/hr/pravno/`        | View copy (privacy policy, terms), `site.config.ts`       |
| Not found  | `/404.html`         | `/hr/404.html`       | View copy; not indexed                                    |

Also `/sitemap.xml`, `/robots.txt`, and the Worker's `POST /api/contact`.

## What each page holds

Top to bottom. Most pages end with a CTA band whose second link walks the site: Work → Services
→ Approach → Skills → About → Insights → Work, skipping hidden sections.

- **Home:** hero (rotating headline, field at full strength), selected work, the four services,
  the six steps, the six skill areas, studio figures, latest insights, CTA.
- **Work:** one row per case study, sides alternating from 960px. In-progress entries show
  "[ case study in progress ]" and no link.
- **Case study:** back link, title, metadata row, 16:9 hero with notes, labelled sections,
  gallery, tech stack, results, quote, CTA. Only the blocks the entry provides render.
- **Services:** four numbered blocks with **Solves** / **You receive**, then the FAQ (always
  open).
- **Approach:** the six steps as a timeline (left rule on mobile, centre from 960px), then
  pricing.
- **Skills:** six areas, each with a result line and tool tags (never translated).
- **About:** manifesto, five principles, portrait beside the studio text and profile.
- **Insights:** list rows; article with sidebar metadata, cover, body, CTA.
- **Contact:** the form beside the email, address and the call note.
- **Legal:** privacy policy (GDPR Art. 13; names Cloudflare, Resend, Apple), terms, business
  details.

`showInsights` in `src/site.config.ts` hides the whole Insights section (navigation, home
section, CTA chain, sitemap); the routes still build.

## Where copy lives

| Text                                              | Location                                               |
| :------------------------------------------------ | :----------------------------------------------------- |
| Page headings, ledes, section titles              | The `copy` object at the top of each view (`en`, `hr`) |
| Services, steps, skills, figures, FAQ, principles | `src/data/*.ts`, each text a `Localized<string>`       |
| Case studies, articles                            | `src/content/{work,insights}/{en,hr}/*.md`             |
| Nav, buttons, form, emails, aria labels           | `src/i18n/ui.ts`                                       |
| Alt text, screenshot notes                        | `src/lib/images.ts`                                    |
| Company facts, email, flags                       | `src/site.config.ts`                                   |

The original copy for every page, in both languages, is in `design/*.extracted.html`.
