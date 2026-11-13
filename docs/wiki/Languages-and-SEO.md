# Languages and SEO

## Rules

- **Every user-facing string exists in English and Croatian**, including aria labels, alt text,
  titles, meta descriptions, form messages, emails and 404 copy.
- English at the root, Croatian under `/hr/` with translated slugs. **Trailing slashes always.**
- **No browser-language redirects.** The URL decides the language; nothing is stored.
- Build links with `localizedPath()` and the content path helpers, never `/hr/…` by hand.
- Croatian quotes „…”. Product and tool names are never translated.

## How a missing translation is caught

| Kind                   | Location                       | Check                                                   |
| :--------------------- | :----------------------------- | :------------------------------------------------------ |
| UI strings             | `src/i18n/ui.ts`               | `hr` is typed against `en`; a missing key fails `check` |
| Page copy              | `copy` in each view            | `satisfies Record<Locale, …>`                           |
| Data modules           | `src/data/*.ts`                | `Localized<string>`                                     |
| Alt text, notes        | `src/lib/images.ts`            | Typed; a missing `hr` fails the build                   |
| Case studies, insights | One Markdown file per language | Not enforced: the switch falls back to the list page    |

## Routes and alternates

`src/i18n/routes.ts` lists every static page in both languages; the folders under
`src/pages/hr/` must match. Detail pages use the entry's file name as the slug, so the Croatian
file name is the Croatian URL. The two files of one entry share a `translationKey`.

Every indexable view passes `alternates` (`{ en, hr }`) to `BaseLayout`. From that one value
come the canonical URL, `hreflang` links (plus `x-default` → English), the EN / HR switch and
the sitemap pairs. Pages without `alternates` (the 404s) get none, and their switch links to each
home page.

## Not-found pages

Astro only turns the root `404.astro` into `404.html`. The `localized-404` integration moves
`hr/404/index.html` to `hr/404.html` after the build, and Cloudflare serves the nearest
`404.html` up the path: `/x/` gets English, `/hr/x/` Croatian. Both are `noindex`.

## Metadata

`SeoHead.astro` writes, per page and language: unique `<title>` and description (the lede,
case study `summary` or insight `excerpt`), canonical, `hreflang`, Open Graph (default image
`/og/default.png`, 1200×630) and a Twitter card. One `h1` per page, headings in order.

JSON-LD (`src/lib/structured-data.ts`): `Organization` on home, `BreadcrumbList` on case
studies, `Article` + `BreadcrumbList` on insights.

## Sitemap and robots

`src/lib/sitemap.ts` builds `/sitemap.xml` from the route map (Insights only if `showInsights`)
plus every published case study and non-draft insight, paired by `translationKey`, in Google's
alternates format. `robots.txt` allows everything except `/api/` and names the sitemap.

The sitemap is submitted to Google and Bing; it updates with each build.

## Keeping previews out of search

- The staging deploy appends `X-Robots-Tag: noindex` to `dist/_headers`.
- Production gets the same unless the `production` environment variable `ALLOW_INDEXING` is `true` (set since launch).
- Production answers only on `minimalist.hr`; `www` redirects to the apex.
