# Features

What a visitor gets, and where each feature lives in the code. Deeper explanations are linked.

## Pages and content

- Eleven page types in English and Croatian, plus a not-found page per language.
  See [Pages and content](/Product/Pages-and-Content).
- Case studies and insights are Markdown files; adding one adds a page, a list entry, a
  sitemap entry and structured data. See [Data model](/Data/Data-Model).
- A case study can be **in progress**: it shows a card but no page yet.
- The Insights section can be switched off with one flag (`showInsights` in
  `src/site.config.ts`). Navigation, routes, the home section and the sitemap follow it.

## Two languages

- English at `/`, Croatian at `/hr/`, with translated slugs (`/work/` ↔ `/hr/radovi/`).
- The **EN / HR switch** goes to the same page in the other language, not the home page.
- `<html lang>`, `hreflang` links, Open Graph locale, dates and quotation marks follow the language.
- The auto-reply email is sent in the language the visitor used.
- A missing Croatian UI string fails the build.

Details: [Internationalisation](/Technical-Specification/Internationalisation),
[Routing, languages and 404](/How-It-Works/Routing-Languages-and-404).

## Dark and light themes

- Dark by default. A square-knob switch in the header (desktop) or the menu (mobile).
- The choice is kept in `localStorage` (`mn-theme`) and applied before first paint, so there is
  no flash. The browser UI colour (`theme-color`) follows.
- Turnstile's widget renders in the matching theme.

Details: [Theme](/How-It-Works/Theme).

## Navigation

- **Desktop (≥ 960px):** wordmark, seven nav links, language switch and theme switch in one row.
- **Mobile (< 960px):** sticky 60px header with a 44px menu button that opens a dropdown panel
  with the links, language switch and theme switch. The panel closes on Esc, on a link click,
  when focus leaves it, and when the window grows past 960px.
- The current section stays underlined, including on pages below it (a case study keeps
  "Work" underlined).
- Without JavaScript the menu panel is shown as a plain list and the header doesn't stick.
- **Footer:** wordmark, tagline, two nav columns, email, studio address, business name,
  copyright.
- **Closing CTAs walk the site:** each page's CTA band links to the next section
  (Work → Services → Approach → Skills → About → Insights → Work). Hidden sections are skipped.
- A **skip link** is the first Tab stop on every page.

## Contact form

- Fields: name, email, company, role, timeline (chips), budget (chips, in EUR), brief,
  required privacy consent.
- Inline validation in the page's language, with errors that clear as soon as a field is valid.
- Invisible Turnstile check, which only asks for an interaction when it is unsure.
- Sending state, then an inline success message that receives focus.
- The studio gets a branded HTML + plain-text notification with reply-to set to the sender.
- The sender gets a fixed, branded confirmation in their language.

Details: [Contact form](/How-It-Works/Contact-Form).

## Motion

- Rules and underlines draw in from the left as they scroll into view.
- Content below the fold fades up 10px once as it enters. Content on screen at load never waits.
- Page-to-page crossfade (240ms) in browsers that support cross-document view transitions.
- Rotating hero headline: four phrases on an 18s loop. Screen readers get only the first.
- Links underline from the left on hover and focus, like the header nav.
- `prefers-reduced-motion: reduce` turns all of it off.

Details: [Motion](/How-It-Works/Motion).

## Background field

A decorative canvas behind every page. It draws a grid of rectangles that refines around the
pointer and two slowly drifting points: strong over the home hero, faint everywhere else.
Hidden from assistive technology, absent without JavaScript, paused when off screen.

Details: [Background field](/How-It-Works/Background-Field).

## Images

- Responsive images (480–1600px wide) cropped to the slot's ratio, lazy-loaded below the fold.
- Alt text in both languages, kept with the image, not with the copy.
- A slot without an image shows the striped placeholder with its caption.

Details: [Add or replace an image](/Guides/Add-or-Replace-an-Image).

## Search and sharing

- Unique title and description per page and language.
- Canonical URL, `hreflang` alternates, Open Graph and Twitter card tags, a default share image.
- JSON-LD: Organization (home), Article (insights), BreadcrumbList (case studies and insights).
- `/sitemap.xml` with language alternates, and `/robots.txt`.

Details: [SEO and metadata](/Technical-Specification/SEO-and-Metadata).

## Accessibility

WCAG 2.2 AA: visible focus that the sticky header never hides, keyboard-operable menu and form,
real radio inputs behind the chips, errors announced and focused, reflow at 320px, contrast
checked in both themes. See [Accessibility](/Technical-Specification/Accessibility).

## Privacy

No cookies. Cookieless analytics. Self-hosted fonts. Turnstile loads only on the contact page.
Form submissions are emailed, never stored. See [Privacy and data handling](/Data/Privacy-and-Data-Handling).

## Not-found pages

`/404.html` in English and `/hr/404.html` in Croatian. A missing URL under `/hr/` gets the
Croatian page. Both are excluded from indexing.
