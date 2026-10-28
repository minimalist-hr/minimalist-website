# Internationalisation

## Rules

- **Every user-facing string exists in English and Croatian.** That includes aria labels, alt
  text, titles, meta descriptions, form messages, emails and the 404 page.
- English at the root, Croatian under `/hr/` with translated slugs.
- **Trailing slashes always.**
- **No browser-language redirects.** The URL is the source of truth; the language isn't stored.
- Croatian uses „…” quotation marks. Product and tool names are never translated.

## Configuration

`src/i18n/config.ts`:

```ts
export const locales = ['en', 'hr'] as const;
export const defaultLocale: Locale = 'en';
export const localeMeta = {
  en: { htmlLang: 'en', ogLocale: 'en_GB', intl: 'en-GB', label: 'EN', name: 'English' },
  hr: { htmlLang: 'hr', ogLocale: 'hr_HR', intl: 'hr-HR', label: 'HR', name: 'Hrvatski' },
};
```

`astro.config.mjs` uses the same values: `i18n: { locales, defaultLocale, routing: { prefixDefaultLocale: false } }`.

## Route map

`src/i18n/routes.ts` pairs every static page:

| Key        | EN           | HR               |
| :--------- | :----------- | :--------------- |
| `home`     | `/`          | `/hr/`           |
| `work`     | `/work/`     | `/hr/radovi/`    |
| `services` | `/services/` | `/hr/usluge/`    |
| `approach` | `/approach/` | `/hr/pristup/`   |
| `skills`   | `/skills/`   | `/hr/vjestine/`  |
| `about`    | `/about/`    | `/hr/o-studiju/` |
| `insights` | `/insights/` | `/hr/zapisi/`    |
| `contact`  | `/contact/`  | `/hr/kontakt/`   |
| `legal`    | `/legal/`    | `/hr/pravno/`    |

Detail pages append the entry's slug (its file name) to the list path of its language. The
route file folders under `src/pages/hr/` must match these paths.

## Where translations live

| Kind                   | Location                              | How a missing translation is caught                                                                                  |
| :--------------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------- |
| Shared UI strings      | `src/i18n/ui.ts`                      | `hr` is typed `Record<UiKey, string>` where `UiKey = keyof typeof en`: a missing or extra key fails `pnpm run check` |
| Page copy              | `copy` object at the top of each view | `satisfies Record<Locale, …>`: both languages required                                                               |
| Structured copy        | `src/data/*.ts`                       | Every text is `Localized<string>`                                                                                    |
| Alt text               | `src/lib/images.ts`                   | `satisfies Record<string, Localized<string>>`                                                                        |
| Case studies, insights | One Markdown file per language        | Not enforced: a missing translation falls back to the list page in the switch and `hreflang`                         |

UI key groups: `site`, `nav`, `a11y`, `cta`, `services`, `skills`, `approach`, `faq`, `work`,
`case`, `insights`, `insight`, `footer`, `og`, `form`, `email`.

## Helpers

| Helper                                      | File                | Use                                                             |
| :------------------------------------------ | :------------------ | :-------------------------------------------------------------- |
| `getLocale(Astro.currentLocale, Astro.url)` | `i18n/utils.ts`     | Resolve the page's locale (falls back to the first URL segment) |
| `useTranslations(locale)` → `t(key)`        | `i18n/utils.ts`     | Read a UI string                                                |
| `localizedPath(route, locale)`              | `i18n/utils.ts`     | `localizedPath('work', 'hr')` → `/hr/radovi/`                   |
| `alternatesFor(route)`                      | `i18n/utils.ts`     | All paths of a static page                                      |
| `getEntryAlternates(collection, key)`       | `lib/content.ts`    | All paths of a case study or insight                            |
| `pick(value, locale)`                       | `i18n/localized.ts` | Read a `Localized<T>`                                           |

## Language switch and `hreflang`

Every indexable page passes `alternates` to `BaseLayout`. From that one value:

- `SeoHead` writes the canonical URL, one `hreflang` link per language and `x-default` → English.
- `LangSwitch` links each language to its version of the page and marks the current one with
  `aria-current`. Each link carries `lang` and `hreflang`.
- The sitemap writes the same pairs.

Pages without `alternates` (the 404s) get no canonical or `hreflang`, and the switch links to
each language's home page.

## Formatting

| What              | English                              | Croatian     | Where                                                |
| :---------------- | :----------------------------------- | :----------- | :--------------------------------------------------- |
| Insight date      | `2026 / 09`                          | `2026. / 09` | `lib/format.ts` (`Intl.DateTimeFormat`)              |
| Quotes            | “…”                                  | „…”          | Written into the copy                                |
| Budget amounts    | `€500 – €2,000`                      | same         | `lib/inquiry.ts` (not translated)                    |
| Studio email date | `19 Sep 2026, 16:40` (Europe/Zagreb) | —            | `worker/compose.ts` (studio email is always English) |

## Emails

- The **notification** to the studio is always English, with a "Language" row showing which
  version of the form was used.
- The **auto-reply** uses the form's hidden `locale` field and the `email.*` UI strings, and
  links to the Approach page in that language.

## Not-found pages

`src/pages/404.astro` and `src/pages/hr/404.astro` render `NotFoundView` per language. The
`localized-404` integration moves the Croatian one to `dist/hr/404.html` so Cloudflare serves
it for missing `/hr/…` URLs. See [Routing, languages and 404](/How-It-Works/Routing-Languages-and-404).

## Croatian layout notes

Croatian labels are longer ("O studiju", "Vještine"); always check HR at the 960px breakpoint.
One hero phrase ("Manje šuma. Bolji softver.") is short enough to fit one line on desktop, so it
forces a line break (`breakBefore` in `HomeView`).
