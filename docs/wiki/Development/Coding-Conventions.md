# Coding conventions

Write code that reads like the code around it. When in doubt, open a similar file and copy its
shape.

## Linting and formatting

| Tool         | Config                                      | Notes                                                                                                 |
| :----------- | :------------------------------------------ | :---------------------------------------------------------------------------------------------------- |
| ESLint       | `eslint.config.js`                          | `@eslint/js` recommended, `typescript-eslint` strict + stylistic, Astro recommended + jsx-a11y strict |
| Prettier     | `prettier.config.js`                        | Single quotes, print width 100, Astro plugin                                                          |
| EditorConfig | `.editorconfig`                             | UTF-8, LF, 2 spaces, final newline                                                                    |
| TypeScript   | `tsconfig.json`, `src/worker/tsconfig.json` | Strict; the Worker adds `noUncheckedIndexedAccess`                                                    |

Project-specific lint rules:

- Unused variables are errors unless prefixed with `_`.
- Type-only imports use `import type` (`consistent-type-imports`).
- `role="list"` on `ul`/`ol` is allowed (Safari drops list semantics when bullets are removed;
  `base.css` only resets lists marked this way).

`.gitlab-ci.yml`, `wrangler.jsonc`, `design/` and generated types are excluded from Prettier on
purpose.

## Files and naming

| Kind                   | Convention                     | Example                                    |
| :--------------------- | :----------------------------- | :----------------------------------------- |
| Components             | PascalCase `.astro`            | `WorkCard.astro`                           |
| Views                  | PascalCase + `View`            | `CaseStudyView.astro`                      |
| TypeScript modules     | kebab-case                     | `inline-scripts.ts`, `background-field.ts` |
| Content files          | the URL slug, in that language | `kako-je-izradena-ova-stranica.md`         |
| Image files            | the registry key               | `service-product.jpg`                      |
| UI string keys         | `group.name`                   | `form.errorEmail`, `nav.work`              |
| CSS classes            | short, lowercase, scoped       | `.bar`, `.desktop-nav`                     |
| Data hooks for scripts | `data-*` attributes            | `data-menu-toggle`, `data-contact-form`    |

Scripts find elements by `data-*` attributes, never by styling classes.

## Comments

- Start every component and module with a short doc comment: what it is and anything
  non-obvious about it.
- Comment **why**, not what. Explain a workaround and the browser it's for.
- Cite the wiki page a rule comes from, by its title: `(wiki: Motion)`,
  `(wiki: Contact form, Accessibility)`.
- Keep the voice of the existing comments: plain sentences, no filler.

## Astro components

```astro
---
/**
 * One skill area: label, one line of plain language, and its tool tags.
 */
import type { Locale } from '../i18n/config';

interface Props {
  locale: Locale;
  /** What the prop is for, when it isn't obvious. */
  variant?: 'header' | 'menu';
}

const { locale, variant = 'header' } = Astro.props;
---
```

- Always a `Props` interface with doc comments on non-obvious props.
- Components take data and `locale` as props; views do the querying.
- Text comes from props, `ui.ts` or the view's `copy`, never hard-coded in a component.
- **Never style a child component's root element with a scoped class passed from the parent.**
  Astro's scoped CSS doesn't reach it and the rules are silently dropped. Add a prop, or wrap the
  child in an element the parent owns. Use `:global()` only with a comment saying why.

## CSS

- **Tokens only.** Colours, sizes, tracking, durations come from `tokens.css`. No raw colours,
  no one-off sizes. If a size differs between the designs, make one fluid `clamp()` token.
- **Never add a colour, accent or gradient.** (`motion.css` uses `linear-gradient` only as a
  mechanism to draw a rule in `--rule`; it shows no gradient.)
- `--graphite` for labels, metadata and captions only.
- **Mobile-first**: base styles are the mobile design, `@media (min-width: 60rem)` adds the
  desktop design. Use `rem` literals (`40rem`, `60rem`, `77.5rem`).
- Rules that should end with the text use `.rule-top` / `.rule-bottom`, not a border on `.container`.
- Single-line links use `.link-line`; links in running text keep an underline.
- Hover effects go inside `@media (hover: hover)`.
- Elements styled with `display` that a script hides need `[hidden] { display: none; }`.
- Motion: only the brand's durations and `var(--ease)`. Colour transitions use
  `var(--duration-state) linear`.

## TypeScript

- Strict mode; no `any`. Narrow with type guards (`isLocale`).
- Use `as const` and `satisfies` to keep literal types and still check shape:

  ```ts
  export const routes = { … } as const satisfies Record<string, Record<Locale, `/${string}`>>;
  ```

- Derive types from data (`type RouteKey = keyof typeof routes`) rather than repeating them.
- One source per fact: if two places need the same value, import it.
- `src/lib/inquiry.ts`, `src/i18n/*` and `src/site.config.ts` are imported by the Worker: keep
  them free of browser, Astro and Workers APIs.

## Browser scripts

- Vanilla TypeScript in a component `<script>` (bundled) or a module in `src/scripts/`.
- **Progressive enhancement**: the HTML must work without the script. JS-only controls are
  hidden under `:root:not([data-js])`.
- Never hide content that is on screen at load.
- Wrap every `localStorage` access in `try/catch`.
- Respect `prefers-reduced-motion`.
- No copy in scripts; pass strings through `data-*` attributes.
- **Never write an `is:inline` script directly.** Put its body in `src/lib/inline-scripts.ts`
  and render it with `set:html`, or the CSP blocks it.

## Internationalisation

- Every user-facing string in both languages: page copy in the view's `copy`, shared strings in
  `ui.ts`, structured copy as `Localized<string>`, alt text in `images.ts`.
- Build links with `localizedPath()` and the content path helpers. Never type `/hr/…` by hand.
- Croatian quotes „…”. Tool and product names untranslated.

## Copy and voice

- Quiet, short, factual. Not "passionate", "cutting-edge", "innovative", "solutions-driven".
- Small studio, never "one engineer" or "a few projects".
- No invented client names, figures or quotes.
- Applies to alt text, meta descriptions, form messages, emails and 404 copy too.

## Links

- External `http(s)` links: `target="_blank" rel="noopener"` plus a visually hidden
  `t('a11y.newTab')` hint. See the portfolio link in `AboutView.astro` or `MetaPanel.astro`.
- `mailto:` and internal links open in the same tab.

## Images

- Add files to `src/assets/images/` and register them in `src/lib/images.ts` with EN and HR alt text.
- Render through `ImageFrame`; never a raw `<img>`.
- No CSS filters, rounded corners or shadows on images.

## Accessibility

- Real elements first (`button`, `a`, `input`, `fieldset`), ARIA second.
- Tap targets ≥ 44px; inputs 16px.
- Every interactive change gets a keyboard path and a test in `tests/` where it fits.

## Dependencies

No new package without a stated reason (what it does; why CSS, TypeScript or Astro built-ins
aren't enough) and approval. pnpm only.

## Worker

- Keep the pipeline order in `contact.ts`: cheap checks first, network calls last.
- Never log message contents, names, addresses or provider messages; log codes.
- Everything from the form that goes into HTML passes through `escapeHtml`.
- New provider = new file behind `Mailer`; nothing else changes.
