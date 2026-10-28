# Theme

Dark is the default. Light is opt-in and remembered per browser.

## Pieces

| Piece           | File                                                                         | Role                                                                                                 |
| :-------------- | :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Settings        | `src/lib/theme.ts`                                                           | `defaultTheme = 'dark'`, `themeStorageKey = 'mn-theme'`, `themeColors` (browser UI colour per theme) |
| No-flash script | `src/lib/inline-scripts.ts` (`themeScript`), rendered by `ThemeScript.astro` | Applies the saved theme before first paint                                                           |
| Toggle          | `src/components/ThemeToggle.astro`                                           | Switch in the header (desktop) and the mobile menu                                                   |
| Tokens          | `src/styles/tokens.css`                                                      | `:root[data-theme='dark']` and `:root[data-theme='light']` colour sets                               |

## Load sequence

1. The server HTML has `<html data-theme="dark">` and `<meta name="theme-color" content="#111110">`.
2. In `<head>`, before any CSS paints, the inline script runs:

   ```js
   var theme = 'dark';
   try {
     if (localStorage.getItem('mn-theme') === 'light') theme = 'light';
   } catch (e) {}
   document.documentElement.dataset.theme = theme;
   // and sets <meta name="theme-color"> to themeColors[theme]
   ```

3. CSS reads `data-theme` through the token selectors. `color-scheme` is set per theme so
   native controls and scrollbars match. `<meta name="color-scheme" content="dark light">` is
   in the head too.

Without JavaScript the page stays dark (the `:root` default) and the toggle is hidden.

## Toggling

The toggle is a `<button role="switch">` whose `aria-checked` means "light mode on". Its knob
position is pure CSS from `<html data-theme>`. On click the script:

1. flips `data-theme` on `<html>`,
2. updates `<meta name="theme-color">`,
3. saves the choice to `localStorage` (wrapped in try/catch: private modes may throw),
4. syncs `aria-checked` on every toggle on the page (header and menu).

## Things that follow the theme

- **Turnstile** renders with `theme: 'light'` or `'dark'` from `data-theme` at load.
- **Background field** reads `--field-line` and `--field-alpha-scale` (0.5 in light, because
  the same grey reads heavier on paper).
- **Images** with a light-theme version (`<key>-light.png`, see below) switch with it.
- **Emails** don't follow the site theme: they're light by default and switch to dark in clients
  that honour `prefers-color-scheme` (Apple Mail, iCloud).

## Images

An image registered with a light-theme version renders twice in its `ImageFrame`: the dark
version (`data-theme-image="dark"`) and the light one (`data-theme-image="light"`). CSS hides
the one that doesn't match `<html data-theme>`, so toggling swaps them at once; without
JavaScript the dark one shows.

- The dark version keeps the slot's loading (`priority` → eager). The light version is always
  `loading="lazy"`, and a hidden lazy image is never fetched, so the dark theme never downloads
  it.
- In the light theme the light version loads as soon as it shows, and a lazy dark version is
  never fetched. The one exception is a `priority` slot (the case study hero): its dark version
  still downloads, because it loads eagerly for the default theme, so a light-theme visitor
  downloads that one image twice.
- After a toggle the newly shown version loads then; the frame is briefly empty on a slow
  connection.
- The hidden `<img>` is `display: none`, so assistive technology meets one image with one alt.

## Colours outside CSS

`themeColors` in `src/lib/theme.ts` must match `--paper` in `tokens.css`. The manifest
(`public/site.webmanifest`) and the email layout (`src/worker/mail/layout.ts`) repeat brand
colours too. Change all of them together.

## Tests

`tests/a11y.spec.ts` runs every page in both themes by seeding `localStorage['mn-theme']` before
load. `tests/keyboard.spec.ts` checks the switch toggles with Space and reports its state.
