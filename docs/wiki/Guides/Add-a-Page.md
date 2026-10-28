# Add a page

New pages aren't in the design, so **agree the page with the owner first**: its purpose, its
sections and its copy in both languages.

## 1. Route map

Add both paths to `src/i18n/routes.ts` (trailing slashes, translated Croatian slug):

```ts
careers: { en: '/careers/', hr: '/hr/karijera/' },
```

This alone adds the page to the sitemap (once it exists) and lets `localizedPath('careers', …)`
and `alternatesFor('careers')` work.

## 2. View

Create `src/views/CareersView.astro`, following an existing view such as `SkillsView.astro`:

```astro
---
/**
 * Careers page, shared by /careers/ and /hr/karijera/.
 */
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHeader from '../components/PageHeader.astro';
import type { Locale } from '../i18n/config';
import { alternatesFor } from '../i18n/utils';

interface Props {
  locale: Locale;
}

const copy = {
  en: { title: 'Careers — Minimalist', heading: '…', lede: '…' },
  hr: { title: 'Karijera — Minimalist', heading: '…', lede: '…' },
} satisfies Record<Locale, Record<string, string>>;

const { locale } = Astro.props;
const text = copy[locale];
---

<BaseLayout title={text.title} description={text.lede} alternates={alternatesFor('careers')}>
  <PageHeader title={text.heading} lede={text.lede} />
  <!-- sections built from existing components -->
</BaseLayout>
```

- The `lede` doubles as the meta description; keep it to one or two sentences.
- Reuse existing components; a new component or visual style needs approval.
- Shared strings go in `src/i18n/ui.ts` (both languages).

## 3. Route files

```text
src/pages/careers.astro             → <CareersView locale="en" />
src/pages/hr/karijera/index.astro   → <CareersView locale="hr" />
```

Each is three lines: import the view, render it with the locale.

## 4. Navigation (optional)

If the page belongs in the menu:

- add the key to `primaryNav` and/or `footerNav` in `src/lib/navigation.ts`;
- add `nav.careers` to both languages in `ui.ts` (the type check insists);
- check the desktop header still fits in Croatian at 960px. If it doesn't, the `md` breakpoint
  or the nav needs a design decision.

If it belongs in the CTA chain, add it to `ctaSequence` in `navigation.ts`, and if its view has
a CTA band, pass `nextSection('careers', locale)`.

## 5. Check

```bash
pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build
```

- Both URLs render; the language switch swaps between them.
- `dist/sitemap.xml` lists both.
- Phone and desktop, both themes, 640–960px in between.
- `pnpm exec playwright test tests/a11y.spec.ts -g "/careers/"` (the a11y test reads the sitemap,
  so the page is covered automatically). Consider adding it to `TAB_PAGES` in
  `tests/keyboard.spec.ts` if it has new interactive parts.

## Non-indexed pages

For a page that shouldn't be indexed, skip the route map entry, omit `alternates`, and pass
`noindex` to `BaseLayout`.
