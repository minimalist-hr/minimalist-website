# Accessibility

**Target:** WCAG 2.2 AA, zero axe violations, Lighthouse accessibility 100.

## What is built in

### Structure and navigation

- A **skip link** is the first Tab stop on every page; it moves focus to `<main>`.
- One `h1` per page, headings in order, landmarks (`header`, `nav` with labels, `main`, `footer`).
- Lists that lose their bullets keep `role="list"` (Safari/VoiceOver drops list semantics
  otherwise; ESLint allows this explicitly).
- The current page and language are marked with `aria-current`.
- External links open in a new tab and carry a visually hidden "opens in a new tab" hint;
  `mailto:` and internal links stay in the same tab.

### Focus

- Visible focus everywhere: `outline: 2px solid var(--ink); outline-offset: 3px`.
- **The sticky header never covers focus (WCAG 2.4.11).** `scroll-padding-top` handles
  Chromium and Firefox; a small `focusin` handler in `Header.astro` scrolls the element clear
  in WebKit, which doesn't scroll to a partly visible element.
- Clicking empty space keeps the scroll position (`<main tabindex="-1">` has no outline).

### Mobile menu

- Button with `aria-expanded`, `aria-controls` and a label that changes between "Menu" and
  "Close menu".
- Links follow the button in the Tab order.
- Closes on Esc (focus returns to the button), on a link click, when focus leaves the menu,
  and when the window grows past 960px.

### Theme switch

A `button` with `role="switch"` and `aria-checked`, operable with Space and Enter.

### Contact form

- Every control has a visible `<label>` that wraps it.
- Chips are real radio inputs in a `fieldset` with a `legend`; the consent box is a real checkbox.
- Errors are tied to fields (`aria-invalid`, an error element per field), summarised in a
  `role="alert"` message, and focus moves to the first invalid field.
- An error clears as soon as its field is valid; the summary goes when none are left.
- While sending, the button uses `aria-disabled` rather than `disabled`, so keyboard focus
  isn't dropped. The form sets `aria-busy`.
- Success replaces the form with a `role="status"` message that receives focus.
- Messages are in the page's language, not the browser's (`novalidate` plus custom messages).

### Content

- Images have meaningful alt text in both languages; decorative elements are `aria-hidden`.
- The rotating hero headline exposes only the first phrase to screen readers.
- The background canvas is `aria-hidden` and `pointer-events: none`.
- The FAQ shows every answer, so there is no disclosure widget to operate.

### Visual

- Body text uses `--ink` / `--ink-2`; `--graphite` only for labels. Light-theme graphite was
  darkened to `#67655E` (5.30:1 on paper).
- Content reflows at 320px without loss.
- `prefers-reduced-motion: reduce` disables every animation and transition.
- Without JavaScript nothing is hidden.

## Automated checks

Run in CI on the release MR (`audit` job) and locally with `pnpm run test:a11y` (build first).

| Test file                | Covers                                                                                                                                                                                           |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/a11y.spec.ts`     | axe (WCAG 2.0/2.1/2.2 A and AA tags) on every page in the sitemap plus both 404s, in dark and light, at mobile and desktop sizes; the open mobile menu                                           |
| `tests/keyboard.spec.ts` | Skip link; focus never hidden by the header, Tab forward and back; mobile menu keys; theme switch with Space; form error focus and clearing; focus kept while sending; reflow at 320px and 640px |
| `tests/motion.spec.ts`   | Nothing on screen at load is held back; content enters on scroll; keyboard focus reveals held content; reduced motion holds nothing                                                              |

axe runs with reduced motion, so it sees every page in its final state.

New pages are covered automatically: the page list comes from `dist/sitemap.xml`.

## Manual checks

- A screen reader pass (VoiceOver on macOS/iOS, NVDA on Windows) after larger UI changes.
- Real devices: an iPhone (Safari), an Android phone, desktop Safari.
- `pnpm run test:a11y:browsers` (adds Firefox and WebKit) before larger UI changes.

**Safari skips links on Tab** unless Option+Tab or "Press Tab to highlight each item" is on.
The link-only keyboard tests skip WebKit for that reason.

## Rules for new work

- Use real elements (`button`, `a`, `input`) before ARIA.
- Every new string, including aria labels and alt text, in both languages.
- Keep tap targets ≥ 44px and inputs at 16px.
- Don't hide anything that is on screen at load, and don't hide anything without JavaScript.
- Run the relevant tests from `tests/` before opening the MR.
