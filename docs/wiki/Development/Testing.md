# Testing

## Layers

| Layer          | Command                       | When                                         | Catches                                                                                 |
| :------------- | :---------------------------- | :------------------------------------------- | :-------------------------------------------------------------------------------------- |
| Lint           | `pnpm run lint`               | Every commit; MR pipeline                    | Code errors, accessibility mistakes in markup (jsx-a11y)                                |
| Format         | `pnpm run format:check`       | Every commit; MR pipeline                    | Formatting drift                                                                        |
| Types          | `pnpm run check`              | Every commit; MR pipeline                    | Type errors in the site and Worker, missing HR strings, bad nav keys, schema-typed data |
| Build          | `pnpm run build`              | Every commit; every pipeline                 | Content schema errors, missing image files, broken `getStaticPaths`                     |
| Browser audits | `pnpm run test:a11y`          | Locally for UI changes; release MR (`audit`) | WCAG violations, keyboard traps, hidden focus, reflow, motion regressions               |
| Cross-browser  | `pnpm run test:a11y:browsers` | Locally before larger UI changes             | Firefox and WebKit differences                                                          |
| Lighthouse     | `pnpm run test:lighthouse`    | Release MR (`audit`)                         | Performance, accessibility, best-practice and SEO scores                                |

There is no unit test framework. The logic is small, and the behaviour that matters is tested
end to end in real browsers.

## Browser tests

Playwright serves the **built** site with `wrangler dev` on port 8787, so headers, 404 pages
and the Worker behave as in production. **Run `pnpm run build` first.** Locally an
already-running server on that port is reused.

### Projects

| Project           | Device                    | In `test:a11y` (CI) |
| :---------------- | :------------------------ | :-----------------: |
| `mobile`          | Pixel 7 (Chromium)        |          ✓          |
| `desktop`         | Desktop Chrome, 1440×900  |          ✓          |
| `firefox-desktop` | Desktop Firefox, 1440×900 |                     |
| `webkit-desktop`  | Desktop Safari, 1440×900  |                     |
| `webkit-mobile`   | iPhone 15                 |                     |

### Test files

**`tests/a11y.spec.ts`:** axe with the WCAG 2.0, 2.1 and 2.2 A/AA tags on every URL in
`dist/sitemap.xml` plus `/does-not-exist/` and `/hr/ne-postoji/`, in dark and light, plus the
open mobile menu. Runs with reduced motion so every page is in its final state. New pages are
covered automatically.

**`tests/keyboard.spec.ts`:**

- skip link is the first stop, visible, and moves focus to `main`;
- focus order forwards and backwards on a set of pages, never hidden by the sticky header;
- mobile menu opens from the keyboard, closes on Esc and returns focus, closes when focus leaves;
- theme switch toggles with Space and reports its state;
- contact form: clicking outside a field keeps the scroll position; an empty submit focuses the
  first invalid field; errors clear when valid; focus stays on the button while sending;
- reflow: nothing is cut off at 320px and 640px.

**`tests/motion.spec.ts`:** nothing on screen at load is held back; content below the fold
enters on scroll; keyboard focus reveals held content; reduced motion holds nothing.

WebKit skips links on Tab (like Safari), so link-only keyboard tests skip it.

### Running a subset

Run what your change touches, not everything:

```bash
pnpm exec playwright test tests/motion.spec.ts --project=desktop
pnpm exec playwright test -g "contact form" --project=mobile --project=desktop
pnpm exec playwright test -g "/hr/kontakt/" --project=mobile
```

The full Chromium suite runs in the release MR anyway. Run `test:a11y:browsers` (3–5 minutes)
only for larger UI changes or browser-specific fixes.

### Reports

Locally the reporter is `list`. In CI an HTML report is written to `playwright-report/` and
kept as a job artifact for a week, even on failure.

## Lighthouse

`scripts/lighthouse.mjs` reads `lighthouserc.cjs` and collects **one run at a time**, retrying a
run up to three times, then asserts and uploads like `lhci autorun`. Retries exist because
Lighthouse sometimes fails to record a page load in the CI container (`NO_NAVSTART`).

- URLs: `/`, `/work/lift-mucnjak-website/`, `/contact/`; three runs each, median taken.
- Mobile emulation (Lighthouse default), server `wrangler dev` on port 8788, Playwright's Chromium.
- Turnstile is blocked: its challenge never settles headless, and the audit measures our code.
- Thresholds: performance ≥ 0.95; accessibility, best practices, SEO = 1.
- Reports: `.lighthouseci/` (job artifact in CI).

Lighthouse itself is pinned to 13.4.1 through `overrides` in `pnpm-workspace.yaml`, because the
version bundled with `@lhci/cli` 0.15 fails on current Chromium.

### On Windows

`lhci collect` fails on a Chrome-launcher cleanup bug (EPERM on its temp profile). It works in
CI. Locally, start a Chromium with remote debugging and point Lighthouse at it:

```bash
pnpm run build
pnpm exec wrangler dev --port 8788 &
"<path to chrome>" --remote-debugging-port=9222 --headless=new --user-data-dir="<temp dir>"
pnpm dlx lighthouse@13.4.1 http://127.0.0.1:8788/ --port=9222 --view
```

`--port` makes Lighthouse use the running browser instead of launching its own, which avoids the
temp-profile cleanup. Use the same Lighthouse version as the override.

## CI audit job

`audit` runs on merge requests into `main` only, in `mcr.microsoft.com/playwright:v1.63.0-noble`
(browsers preinstalled). **The image tag must match `@playwright/test` in `package.json`.**
Bump both together.

## Manual checks

| Check                                                  | When                                                     |
| :----------------------------------------------------- | :------------------------------------------------------- |
| Screen reader (VoiceOver, NVDA)                        | After larger UI changes                                  |
| Real iPhone (Safari), Android (Chrome), desktop Safari | After layout or interaction changes                      |
| Widths 320–2560px, landscape phones, HR at 960px       | After layout changes                                     |
| Both themes                                            | After colour or component changes                        |
| Form end to end on production                          | After Worker or email changes (it can't send on staging) |

## Screenshots for visual comparison

Compare against the design files in a browser (`design/*.html`). For screenshots, a small
Playwright script run from the project root works (so `@playwright/test` resolves): start
`pnpm run preview`, open the page at the width you need, and call `page.screenshot()`.
Set `localStorage['mn-theme'] = 'light'` with `page.addInitScript` for the light theme. A
`deviceScaleFactor` of 2–4 helps judge pixel alignment.
