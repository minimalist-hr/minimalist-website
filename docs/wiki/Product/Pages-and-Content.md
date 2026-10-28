# Pages and content

## Route table

Every page has one view in `src/views/`, shared by both languages. The files in `src/pages/`
only pick the view and pass `locale`.

| Page            | EN route            | HR route             | View               | Content comes from                                        |
| :-------------- | :------------------ | :------------------- | :----------------- | :-------------------------------------------------------- |
| Home            | `/`                 | `/hr/`               | `HomeView`         | View copy, `src/data/*`, featured work, latest 3 insights |
| Work (list)     | `/work/`            | `/hr/radovi/`        | `WorkListView`     | `work` collection (all statuses)                          |
| Case study      | `/work/<slug>/`     | `/hr/radovi/<slug>/` | `CaseStudyView`    | One `work` entry (published only)                         |
| Services        | `/services/`        | `/hr/usluge/`        | `ServicesView`     | `src/data/services.ts`, `src/data/faq.ts`                 |
| Approach        | `/approach/`        | `/hr/pristup/`       | `ApproachView`     | `src/data/steps.ts`, view copy (pricing)                  |
| Skills          | `/skills/`          | `/hr/vjestine/`      | `SkillsView`       | `src/data/skills.ts`                                      |
| About           | `/about/`           | `/hr/o-studiju/`     | `AboutView`        | `src/data/about.ts`, `src/data/stats.ts`, view copy       |
| Insights (list) | `/insights/`        | `/hr/zapisi/`        | `InsightsListView` | `insights` collection (non-draft)                         |
| Insight         | `/insights/<slug>/` | `/hr/zapisi/<slug>/` | `InsightView`      | One `insights` entry                                      |
| Contact         | `/contact/`         | `/hr/kontakt/`       | `ContactView`      | View copy, `ContactForm`, `src/site.config.ts`            |
| Legal           | `/legal/`           | `/hr/pravno/`        | `LegalView`        | View copy, `src/site.config.ts` (company details)         |
| Not found       | `/404.html`         | `/hr/404.html`       | `NotFoundView`     | View copy                                                 |

Generated endpoints: `/sitemap.xml` (`src/pages/sitemap.xml.ts`) and `/robots.txt`
(`src/pages/robots.txt.ts`). The Worker adds `POST /api/contact`.

## What each page contains

Sections are listed top to bottom. Every page ends with the footer; most end with a CTA band
before it.

### Home

1. **Hero:** studio label, rotating headline (four phrases), lede, "Start a project" and
   "See the work", scroll cue. The background field runs at full strength here; the label,
   headline, lede and scroll cue sit on blurred patches of it.
2. **Selected work:** cards for featured case studies, with link to Work.
3. **What we do:** the four services, one line each, with images.
4. **How we work:** the six steps on one rule.
5. **What we build with:** the six skill areas with tool tags.
6. **How the studio works:** a statement and the three studio figures.
7. **Latest thinking:** up to three insights (hidden when `showInsights` is off).
8. **CTA band:** "Tell us what you are trying to build."

### Work and case study

- **Work list:** page header, then one row per case study, image beside text, alternating
  sides from 960px up. In-progress entries show "[ case study in progress ]" instead of a link.
- **Case study:** back link, title, metadata row (client, sector, engagement or year, scope,
  website), 16:9 hero image with notes, labelled sections (Context / The problem / What we removed /
  What we built), gallery (with notes), tech stack (note + tool tags), results, client quote, CTA band.
  Every block is optional apart from the title and metadata; only what the entry provides renders.

### Services

The four services as numbered blocks: title, longer description, image, and the pair
**Solves** (the client sentence it answers) / **You receive**. Then "Questions we are asked
first" (FAQ, answers always visible), then the CTA band.

### Approach

A vertical timeline of the six steps with descriptions and images: the rule runs down the left
on mobile and down the middle from 960px, with steps alternating sides. Then "How engagements
are priced" and the CTA band.

### Skills

Six areas described in plain language, each with a result line and the tools as tags
(tool names are never translated).

### About

Page header, manifesto, five principles, then the portrait beside the studio description and
profile details (name, role, email, portfolio, experience, languages, working with). On mobile
the portrait follows the text. The portfolio link opens in a new tab.

### Insights

- **List:** one row per article: image, date and category, title, excerpt, link.
- **Article:** sidebar metadata (written by, date, category, reading time) beside the body,
  cover image, CTA band (the entry's `ctaTitle`, or the Insights default).

### Contact

Page header, the inquiry form beside "Or write directly" (email), the studio address, the
introductory call note ("Thirty minutes, no pitch deck.") and a one-line privacy note.

### Legal

"Privacy, terms and studio details": the privacy policy (written to GDPR Art. 13; names
Cloudflare, Resend and Apple as processors), terms of use and the business details from
`src/site.config.ts`.

### Not found

"This page was removed." with a button back to the home page. Not indexed, no canonical.

## Where copy lives

| Kind of text                                             | Location                                                      | Notes                                                                  |
| :------------------------------------------------------- | :------------------------------------------------------------ | :--------------------------------------------------------------------- |
| Page headings, ledes, section titles                     | A `copy` object at the top of each view, keyed by `en` / `hr` | Typed with `satisfies Record<Locale, …>`, so both languages must exist |
| Repeated structured content                              | `src/data/*.ts` (services, steps, skills, stats, FAQ, about)  | Each text is a `Localized<string>`                                     |
| Case studies, articles                                   | `src/content/{work,insights}/{en,hr}/*.md`                    | See [Data model](/Data/Data-Model)                                     |
| Shared UI text (nav, buttons, form, emails, aria labels) | `src/i18n/ui.ts`                                              | `hr` is typed against `en`                                             |
| Image alt text                                           | `src/lib/images.ts`                                           | One description per image, both languages                              |
| Company facts, email, flags                              | `src/site.config.ts`                                          | Change values here, never in components                                |

Original copy for every page, in both languages, is in `design/*.extracted.html`.

## Copy rules

- Quiet, short, factual. Never "passionate", "cutting-edge", "innovative", "solutions-driven".
  This includes meta descriptions, alt text, form messages, emails and 404 text.
- Small studio, yes; never frame it as one person or a few projects ("one engineer",
  "few projects" are out; "a senior engineer leads every project" is fine).
- Croatian uses „…” quotation marks.
- No invented client names, figures or quotes.
