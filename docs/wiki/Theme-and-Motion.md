# Theme and motion

## Theme

Dark by default; light is opt-in, kept in `localStorage['mn-theme']` (the only thing the site
stores in the browser).

- An inline script in `<head>` applies the saved theme and `theme-color` before first paint, so
  there's no flash. Its body lives in `src/lib/inline-scripts.ts` (CSP hashing, see
  [Security](Security-and-Privacy#inline-scripts)).
- Tokens switch on `:root[data-theme]`. Without JavaScript the page stays dark and the toggle is
  hidden.
- The toggle is a `button role="switch"`; it flips `data-theme`, updates `theme-color`, saves
  (inside try/catch) and syncs every toggle on the page.
- Turnstile renders in the current theme; the background field halves its line strength in
  light; emails don't follow the site theme.

**Images with a light version** (`<key>-light.png`) render both; CSS shows the one that matches.
The light one is always lazy, so the dark theme never downloads it. The one cost: a `priority`
image (the case study hero) downloads both in the light theme.

## Motion

Vocabulary and durations: [Brand and design → Motion](Brand-and-Design#motion). Three
guarantees: content on screen at load never waits, nothing is hidden without JavaScript, reduced
motion turns everything off.

**Scroll reveal** (`src/scripts/reveal.ts`, states in `motion.css`). Candidates are the children
of top-level `main .container` (or their `[data-reveal-item]`s), plus rules (`.rule-top`,
`.rule-bottom`, `data-draw`). Only those that start **below the viewport** are held
(`data-reveal="pending"`). An `IntersectionObserver` releases them in reading order, 60ms apart
(max 300ms), then removes the attributes so hover transitions work again. Enter uses `translate`,
not `transform`, so it never fights an element's own transform. `--rule-draw` is a registered
`@property` so border rules can draw.

**Page crossfade:** `@view-transition { navigation: auto }`, only without reduced motion.
Firefox switches instantly.

**Links:** `.link-line` draws a 1px underline from the left on hover and focus. Links in running
text keep a visible underline (WCAG 1.4.1).

**Hero headline:** four phrases stacked in one grid cell (the heading never changes height), on
an 18s CSS loop. Screen readers get only the first; with reduced motion only the first shows.

**Reduced motion** (`base.css`): animations cut to 0.01ms and `transition: none`. Not a
near-zero transition: that gives every element one, and WebKit then reports colours mid-way.

## Background field

A decorative canvas behind every page (`BackgroundField.astro`, engine and tuning constants in
`src/scripts/background-field.ts`).

- An **adaptive quadtree**: cells split near the pointer and a few slowly drifting points, so the
  grid is fine near the cursor and keeps changing when nothing moves. Axis-aligned `--graphite`
  hairlines at low alpha.
- **Hero vs. elsewhere:** deeper tree and wider pointer reach over the home hero
  (`[data-field-hero]`). The hero's closing rule is a hard edge in the same frame; depth eases
  down as the hero leaves the screen.
- **Never behind content.** Below the hero every direct child of `<main>` is the 1240px column
  on `--paper`, so the field shows only in the side margins of wide windows. From 78rem the
  column gets a hairline on each side. A new page gets this as long as its blocks are direct
  children of `<main>`. On phones the field shows only in the hero.
- **Hero text** sits on patches of the field blurred 8px at 70% (`backdrop-filter`, `::before`
  in `Hero.astro`). A small script fits the headline's patch to its widest phrase.
- **Safeguards:** `aria-hidden`, `pointer-events: none`, absent without JavaScript, paused when
  hidden or off screen, DPR capped at 1.75, one level shallower on phones, one still frame with
  reduced motion. Canvas 2D: crisp hairlines matter more than shader power.

Keep it quiet. After any change check both themes, a phone, and the hero in and out of view.
