# Add a case study

First have the client's **written permission** to name them, **measured** results (never
estimates) and **approval of any quote's wording**. Without permission, leave out `client` and
anything that identifies them.

## 1. Images

Add them to `src/assets/images/` and register each key with EN and HR alt text
([Images](/Guides/Images)). Typical keys: `work-<client>-cover`, `-hero`, `-<detail>`. Mockups on
a dark background also need a `<key>-light.png`. Hero and gallery screenshots can carry notes.

## 2. English file

`src/content/work/en/<english-slug>.md` → `/work/<english-slug>/`. The schema is in
`src/content.config.ts`; the page is built from frontmatter, so leave the body empty.

```yaml
---
title: 'A short, factual headline'
locale: en
translationKey: client-project # same in both languages
sector: 'Elevator maintenance'
year: 2026
client: 'Client d.o.o.' # only with written permission
engagement: '8 weeks, 2026' # optional; falls back to year
scope: 'Rebuild' # optional
website: https://example.hr/ # optional; opens in a new tab
summary: 'One line for the Work list and the meta description.'
cardMetric: 'Optional result line for the home card.'
status: published # in-progress: card only, no page, not in the sitemap
featured: true # show in "Selected work" on the home page
order: 2 # lower comes first
coverImage: 'work-client-cover'
coverCaption: 'screenshot / client home page' # shown only without an image
heroImage: 'work-client-hero'
heroCaption: 'hero screenshot / 16:9'
sections:
  - label: 'Context'
    paragraphs:
      - text: '…'
        lead: true # optional: set in ink
  - label: 'The problem'
    paragraphs:
      - text: '…'
  - label: 'What we removed'
    paragraphs:
      - text: '…'
  - label: 'What we built'
    paragraphs:
      - text: '…'
stack:
  text: 'Optional note on why these tools.'
  tools: ['Astro', 'TypeScript'] # never translated
gallery:
  - caption: 'screenshot / forms'
    image: work-client-forms
results:
  - value: '6'
    label: 'Pages search engines can read, up from one'
quote:
  text: '“Approved wording, with its quotation marks.”'
  name: 'Name Surname'
  role: 'Director, Client d.o.o.'
ctaTitle: 'Need a website that does one job well?'
---
```

## 3. Croatian file

`src/content/work/hr/<croatian-slug>.md` with `locale: hr`, the **same `translationKey`**, and
the Croatian slug as the file name. „…” for the quote; if the client approved English wording,
tell them the Croatian is its translation.

## 4. Check

- `/work/` and `/hr/radovi/` list it; home shows it if `featured`.
- Both languages and themes, phone and desktop.
- The language switch goes to the other case study, not the list.
- `dist/sitemap.xml` has both URLs.
- Optional: `pnpm exec playwright test tests/a11y.spec.ts -g "<slug>"`.

The Lighthouse audit and `tests/keyboard.spec.ts` use `/work/lift-mucnjak-website/`; if it's ever
removed, update `lighthouserc.cjs` and the test's page list.
