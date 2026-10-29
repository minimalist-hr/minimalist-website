# Conventions

Write code that reads like the code around it. Lint and Prettier enforce the rest
(`eslint.config.js`, `prettier.config.js`).

## Comments

Comments explain the code: a non-obvious reason, a workaround and the browser it's for. No wiki
references, dates, approvals or history; those belong in the wiki and git. No comment that
repeats what the code says.

## Naming

Components PascalCase (`WorkCard.astro`), views `…View.astro`, TS modules kebab-case, content
files named by their URL slug, image files by their registry key, UI keys `group.name`. Scripts
find elements by `data-*` attributes, never by styling classes.

## Astro components

- A `Props` interface; components take data and `locale`, views do the querying.
- Text from props, `ui.ts` or the view's `copy`; never hard-coded in a component.
- **Never style a child component's root with a scoped class passed from the parent.** Astro's
  scoped CSS doesn't reach it and the rules are silently dropped. Add a prop or wrap the child.

## CSS

- Tokens only: no raw colours, no one-off sizes. A size that differs between designs becomes one
  `clamp()` token.
- Mobile-first; `@media (min-width: 60rem)` adds the desktop design.
- A rule that ends with the text uses `.rule-top` / `.rule-bottom`. **No border on
  `.container`**: it runs through the padding to the screen edge on phones.
- Single-line links use `.link-line`; links in running text keep an underline.
- Hover inside `@media (hover: hover)`. An element with `display` that a script hides needs
  `[hidden] { display: none; }`.
- Motion only with the brand durations and `var(--ease)`.

## TypeScript

Strict, no `any`. `as const` + `satisfies` to keep literal types and check shape; derive types
from data. One source per fact: import, don't repeat. `src/lib/inquiry.ts`, `src/i18n/*` and
`src/site.config.ts` are imported by the Worker, so no browser, Astro or Workers APIs there.

## Browser scripts

- The HTML works without the script; JS-only controls are hidden under `:root:not([data-js])`.
- Never hide content that's on screen at load. Respect reduced motion.
- `localStorage` inside try/catch.
- No copy in scripts; pass strings through `data-*` attributes.
- **No `is:inline` script directly**: body in `src/lib/inline-scripts.ts`, rendered with
  `set:html`, or the CSP blocks it.

## Links and images

- External `http(s)` links: `target="_blank" rel="noopener"` plus the visually hidden
  `t('a11y.newTab')` hint. `mailto:` and internal links stay in the tab.
- Images through the registry and `ImageFrame`, never a raw `<img>` ([Images](/Guides/Images)).

## Accessibility

Target: WCAG 2.2 AA.

- Real elements (`button`, `a`, `input`, `fieldset`) before ARIA.
- Visible focus, never covered by the sticky header (WebKit fix in `Header.astro`).
- Lists that lose their bullets keep `role="list"` (Safari drops the semantics otherwise).
- Every new string, aria label and alt text in both languages.
- Tap targets ≥ 44px, inputs 16px.
- Every interactive change gets a keyboard path, and a test where it fits.

## Worker

Cheap checks first, network calls last. Log codes, never content. Every form value in HTML goes
through `escapeHtml`. A new email provider is one new file behind `Mailer`.
