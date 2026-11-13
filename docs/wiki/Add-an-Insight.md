# Add an insight

## 1. Cover image (optional)

Add and register it ([Images](Images)). Without one, the placeholder shows
`coverCaption`.

## 2. English file

`src/content/insights/en/<english-slug>.md` → `/insights/<english-slug>/`

```markdown
---
title: 'How this site is built'
locale: en
translationKey: site-build
date: 2026-09-22
category: 'Practice'
excerpt: 'One or two sentences: lists, home page, meta description, JSON-LD.'
coverImage: 'insight-wireframes'
coverCaption: 'diagram / pages, routes and where each one comes from'
draft: false # true leaves it out of the build
author: 'Filip Mučnjak' # optional; defaults to siteConfig.author
ctaTitle: 'Want a site built the same way?' # optional
---

Opening paragraph.

## A section heading

Plain Markdown. `##` for sections; the title is the only `h1`.
```

Sorted by `date`, newest first; the home page shows the latest three. Reading time is computed
from the body.

## 3. Croatian file

`src/content/insights/hr/<croatian-slug>.md` → `/hr/zapisi/<croatian-slug>/`, `locale: hr`, the
**same `translationKey`**, „…” quotes.

## 4. Check

- `/insights/`, `/hr/zapisi/` and the home page list it.
- It reads well at 320px and on desktop, both themes; code, tables and long URLs don't scroll the
  page sideways.
- The language switch goes to the translation.

Voice: notes on decisions and what they changed. Quiet, short, factual.
