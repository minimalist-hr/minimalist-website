# Testing

## Targets

| Target              | Value                                                      |
| :------------------ | :--------------------------------------------------------- |
| Accessibility       | WCAG 2.2 AA, zero axe violations                           |
| Lighthouse (mobile) | Performance ≥ 95; Accessibility, Best Practices, SEO = 100 |
| Core Web Vitals     | LCP < 1.8s on 4G, CLS < 0.05, INP < 200ms                  |
| JavaScript per page | < 20 kB gzipped, Turnstile excluded                        |
| Layout              | No horizontal scroll from 320px to 2560px                  |

## Layers

| Layer          | Command                | Runs                                                   |
| :------------- | :--------------------- | :----------------------------------------------------- |
| Lint, format   | `lint`, `format:check` | Every commit; every PR                                 |
| Types          | `check`                | Every commit; catches missing HR strings               |
| Build          | `build`                | Every commit; catches schema errors and missing images |
| Browser audits | `test:a11y`            | UI changes locally; release PR                         |
| Cross-browser  | `test:a11y:browsers`   | Locally, before larger UI changes                      |
| Lighthouse     | `test:lighthouse`      | Release PR                                             |

**Test what you changed**, not everything; the full Chromium suite runs in the release PR.

```bash
pnpm exec playwright test tests/motion.spec.ts --project=desktop
pnpm exec playwright test -g "contact form" --project=mobile --project=desktop
pnpm exec playwright test -g "/hr/kontakt/" --project=mobile
```

## Browser tests

Playwright serves the **built** site with `wrangler dev` on port 8787, so run `pnpm run build`
first. A running server on that port is reused, so stop it after rebuilding.

- `tests/a11y.spec.ts`: axe on every URL in `dist/sitemap.xml` plus both 404s, dark and light,
  mobile and desktop, plus the open menu. Runs with reduced motion, so it sees final states. New
  pages are covered automatically.
- `tests/keyboard.spec.ts`: skip link, focus never under the header (both directions), menu
  keys, theme switch, form error focus, reflow at 320px and 640px.
- `tests/motion.spec.ts`: nothing on screen at load is held; content enters on scroll.

CI runs Chromium (`mobile`, `desktop`); `test:a11y:browsers` adds Firefox and WebKit. WebKit
skips links on Tab, like Safari, so link-only keyboard tests skip it.

## Lighthouse

`scripts/lighthouse.mjs` (not `lhci autorun`) runs `/`, `/work/lift-mucnjak-website/` and
`/contact/` three times each on port 8788, retrying a run up to three times because Lighthouse
sometimes fails to record a load in the CI container (`NO_NAVSTART`). Turnstile is blocked: its
challenge never settles headless. Lighthouse comes with `@lhci/cli`; if that version ever
fails on current Chromium (`NO_NAVSTART` on every run), pin a newer one through `overrides` in
`pnpm-workspace.yaml`.

**On Windows** `lhci collect` fails on a Chrome-launcher cleanup bug (EPERM). Use a running
Chromium instead:

```bash
pnpm run build
pnpm exec wrangler dev --port 8788 &
"<path to chrome>" --remote-debugging-port=9222 --headless=new --user-data-dir="<temp dir>"
pnpm dlx lighthouse@<version in pnpm-lock.yaml> http://127.0.0.1:8788/ --port=9222 --view
```

## Manual checks

| Check                                           | When                                |
| :---------------------------------------------- | :---------------------------------- |
| Screen reader (VoiceOver, NVDA)                 | After larger UI changes             |
| iPhone Safari, Android Chrome, desktop Safari   | After layout or interaction changes |
| 320–2560px, landscape phones, Croatian at 960px | After layout changes                |
| Both themes                                     | After colour or component changes   |
| Real inquiry on production                      | After Worker or email changes       |

**Screenshots:** a small Playwright script run from the project root against `pnpm run preview`;
`page.addInitScript` with `localStorage['mn-theme'] = 'light'` for the light theme, and a
`deviceScaleFactor` of 2–4 to judge alignment. Compare with `design/*.html` in a browser.
