# Add a case study

Before you start, have the client's **written permission** to name them, **measured** results
(never estimates), and their **approval of any quote's wording**. Without permission, leave out
`client` and anything that identifies them.

## 1. Add the images

Put the files in `src/assets/images/` (JPEG for photographs, PNG for screenshots) and register
each key with English and Croatian alt text in `src/lib/images.ts`. See
[Add or replace an image](/Guides/Add-or-Replace-an-Image). Typical keys:
`work-<client>-cover`, `work-<client>-hero`, `work-<client>-<detail>`. Mockups on a dark background
also need a light-theme version, `<key>-light.png` (see
[Light-theme versions](/Guides/Add-or-Replace-an-Image#light-theme-versions)). The hero and gallery
screenshots can carry a few notes on their empty background (see
[Notes on screenshots](/Guides/Add-or-Replace-an-Image#notes-on-screenshots)).

## 2. Write the English file

`src/content/work/en/<english-slug>.md`. The file name is the URL: `/work/<english-slug>/`.

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
website: https://example.hr/ # optional; linked from the header, new tab
summary: 'One line for the Work list and the meta description.'
cardMetric: 'Optional result line for the home card.'
status: published # or in-progress: card only, no page
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
  tools: ['Astro', 'TypeScript'] # product names, never translated
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

The page body is built from the frontmatter; leave the Markdown body empty. Every field is
described in [Data model → work](/Data/Data-Model#work).

## 3. Write the Croatian file

`src/content/work/hr/<croatian-slug>.md` with `locale: hr`, the **same `translationKey`**, and a
translated slug as the file name (`/hr/radovi/<croatian-slug>/`). Use „…” for the quote. If the
client approved the English wording, the Croatian quote is its translation; say so to the client.

## 4. Check

```bash
pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build
pnpm dev
```

- `/work/` and `/hr/radovi/` list it; the home page shows it if `featured`.
- The page renders in both languages and both themes, at a phone width and on desktop.
- The language switch goes to the other language's case study, not the list.
- `dist/sitemap.xml` contains both URLs.
- Optional: `pnpm exec playwright test tests/a11y.spec.ts -g "<slug>"` after a build.

## In-progress case studies

`status: in-progress` shows the card with "[ case study in progress ]" and no link. No page, no
sitemap entry. Switch to `published` when the text, results and permissions are ready.

## Lighthouse URL

The audit measures `/work/lift-mucnjak-website/`. If that case study is ever removed, update the
URL in `lighthouserc.cjs` and the page list in `tests/keyboard.spec.ts`.
