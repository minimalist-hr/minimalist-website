# Routing, languages and 404

## From route map to files

`src/i18n/routes.ts` is the single list of static pages and their paths in both languages.
The files in `src/pages/` must produce exactly those paths:

```text
src/pages/
├─ index.astro                  /
├─ work/index.astro             /work/
├─ work/[slug].astro            /work/<slug>/
├─ services.astro               /services/
├─ approach.astro               /approach/
├─ skills.astro                 /skills/
├─ about.astro                  /about/
├─ insights/index.astro         /insights/
├─ insights/[slug].astro        /insights/<slug>/
├─ contact.astro                /contact/
├─ legal.astro                  /legal/
├─ 404.astro                    /404.html
├─ sitemap.xml.ts               /sitemap.xml
├─ robots.txt.ts                /robots.txt
└─ hr/
   ├─ index.astro               /hr/
   ├─ radovi/index.astro        /hr/radovi/
   ├─ radovi/[slug].astro       /hr/radovi/<slug>/
   ├─ usluge/index.astro        /hr/usluge/
   ├─ pristup/index.astro       /hr/pristup/
   ├─ vjestine/index.astro      /hr/vjestine/
   ├─ o-studiju/index.astro     /hr/o-studiju/
   ├─ zapisi/index.astro        /hr/zapisi/
   ├─ zapisi/[slug].astro       /hr/zapisi/<slug>/
   ├─ kontakt/index.astro       /hr/kontakt/
   ├─ pravno/index.astro        /hr/pravno/
   └─ 404.astro                 /hr/404.html (moved after the build)
```

Each file renders a view with a fixed `locale`. Links inside the site are always built with
`localizedPath()` or the content path helpers, never typed by hand.

## Detail pages

`work/[slug].astro` (and its three siblings) call `getStaticPaths`:

```ts
const entries = await getPublishedWork('en'); // or getInsights('en')
return entries.map(async (entry) => ({
  params: { slug: slugOf(entry) }, // the file name
  props: { entry, alternates: await getEntryAlternates('work', entry.data.translationKey) },
}));
```

- `slugOf` takes the file name, so the Croatian file name is the Croatian slug.
- Only `status: published` case studies and non-draft insights get pages.
- `getEntryAlternates` finds the entry with the same `translationKey` in each language. If a
  language has none, that language's alternate is its list page.

## Alternates

Every indexable view passes `alternates` (a `{ en, hr }` path pair) to `BaseLayout`:

- static pages: `alternatesFor('services')` → `{ en: '/services/', hr: '/hr/usluge/' }`
- detail pages: from `getEntryAlternates`

`BaseLayout` hands it to `SeoHead` (canonical, `hreflang`, `x-default`) and to the header, where
`LangSwitch` turns it into the EN / HR links. Nothing is stored; the URL decides the language.

## Navigation state

`buildNav(routes, locale, pathname)` in `src/lib/navigation.ts`:

- drops Insights when `showInsights` is off,
- labels each link from `nav.<route>` in `ui.ts` (a missing key is a type error),
- marks a link current when the path equals it **or starts with it**, so `/work/<slug>/` keeps
  "Work" current.

`nextSection(route, locale)` gives each page's CTA band its secondary link: the next entry in
Work → Services → Approach → Skills → About → Insights, looping back to Work, skipping hidden
sections. Contact isn't in the chain because the primary button already goes there.

## Locale detection

`getLocale(Astro.currentLocale, Astro.url)` prefers Astro's i18n value and falls back to the
first path segment. Views receive `locale` as a prop anyway; `BaseLayout` uses `getLocale` for
`<html lang>` and its own strings.

## Localised 404 pages

Astro only turns the root `src/pages/404.astro` into `404.html`; `src/pages/hr/404.astro` would
build to `hr/404/index.html`. The integration in `src/integrations/localized-404.ts` runs after
the build and moves it:

```text
dist/hr/404/index.html  →  dist/hr/404.html
```

Cloudflare's `not_found_handling: "404-page"` serves the **nearest** `404.html` up the path, so:

- `/does-not-exist/` → `dist/404.html` (English)
- `/hr/ne-postoji/` → `dist/hr/404.html` (Croatian)

Both 404 pages are `noindex`, have no canonical or `hreflang`, and their language switch links to
each home page. A third locale would be picked up automatically: the integration receives every
non-default locale from `astro.config.mjs`.

## Sitemap

`src/lib/sitemap.ts` reuses the same pieces: every route map entry via `alternatesFor`, every
published case study and insight via `getEntryAlternates`. See
[SEO and metadata → Sitemap](/Technical-Specification/SEO-and-Metadata#sitemap).
