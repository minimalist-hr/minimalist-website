# Add an insight

## 1. Cover image (optional)

Add the file to `src/assets/images/` and register the key with EN and HR alt text in
`src/lib/images.ts`. Without a cover, the placeholder shows `coverCaption`.

## 2. English file

`src/content/insights/en/<english-slug>.md` → `/insights/<english-slug>/`

```markdown
---
title: 'How this site is built'
locale: en
translationKey: site-build
date: 2026-09-22
category: 'Practice'
excerpt: 'One or two sentences. Used in lists, the home page, the meta description and JSON-LD.'
coverImage: 'insight-wireframes'
coverCaption: 'diagram / pages, routes and where each one comes from'
draft: false
author: 'Filip Mučnjak' # optional; defaults to siteConfig.author
ctaTitle: 'Want a site built the same way?' # optional
---

Opening paragraph.

## A section heading

Body in plain Markdown. Use `##` for sections (the page title is the only `h1`).
```

- Reading time is computed from the body (200 words a minute).
- The list is sorted by `date`, newest first; the home page shows the latest three.
- `draft: true` keeps it out of the build entirely.

Fields: [Data model → insights](/Data/Data-Model#insights).

## 3. Croatian file

`src/content/insights/hr/<croatian-slug>.md` → `/hr/zapisi/<croatian-slug>/`, with `locale: hr`
and the **same `translationKey`**. Croatian quotes „…”.

## 4. Check

```bash
pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build
pnpm dev
```

- `/insights/` and `/hr/zapisi/` list it; the home page's "Latest thinking" shows it.
- The article reads well at 320px and on desktop, in both themes.
- Code, tables and long URLs don't cause horizontal scrolling.
- The language switch goes to the translation.

## Voice

Quiet, short, factual. Notes on decisions and what they changed. No "passionate",
"cutting-edge", "innovative", "solutions-driven". Never frame the studio as one person.

## Hiding the whole section

Set `showInsights: false` in `src/site.config.ts`: navigation, the home section, the CTA chain
and the sitemap drop Insights. The list and article routes still build unless you remove them.
