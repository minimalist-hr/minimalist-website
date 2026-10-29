# Add a page

New pages aren't in the design, so **agree the page with the owner first**: purpose, sections,
copy in both languages.

1. **Route map:** add both paths to `src/i18n/routes.ts`:
   `careers: { en: '/careers/', hr: '/hr/karijera/' }`. This brings the sitemap entry,
   `localizedPath` and `alternatesFor`.
2. **View:** `src/views/CareersView.astro`, modelled on an existing one such as `SkillsView`:
   a typed `copy` object for `en` and `hr`, then
   `<BaseLayout title description alternates={alternatesFor('careers')}>` with existing
   components. The lede doubles as the meta description. A new component or style needs approval.
3. **Route files:** `src/pages/careers.astro` and `src/pages/hr/karijera/index.astro`, each
   rendering the view with its `locale`.
4. **Navigation (optional):** add the key to `primaryNav` / `footerNav` in
   `src/lib/navigation.ts` and `nav.careers` to `ui.ts` in both languages. Check the header still
   fits in Croatian at 960px. For the CTA chain, add it to `ctaSequence`.
5. **Check:** both URLs render and swap with the language switch; both are in the sitemap; phone,
   desktop and 640–960px, both themes; `pnpm exec playwright test tests/a11y.spec.ts -g "/careers/"`.

A page that shouldn't be indexed skips the route map, omits `alternates` and passes `noindex`.
