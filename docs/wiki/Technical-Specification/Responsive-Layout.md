# Responsive layout

There are two designs: **mobile** (fixed px values, drawn at about 402px wide) and **desktop**
(fluid `clamp()` values, 1240px container). Neither has breakpoints. The build turns them into
one responsive codebase.

## The rule

- **Below `md` (960px), match the mobile design. From `md` up, match the desktop design.**
- 640–960px has no design: use the mobile structure with wider spacing.
- Mobile values are the floor and desktop values the ceiling: one fluid `clamp()` token per
  size, never a one-off hard-coded value.
- It must hold from **320px to 2560px** with no horizontal page scroll.

## Breakpoints

Media queries can't read custom properties, so use these literals (mobile-first, `min-width`):

| Name | Query                           | Design          | Typical changes                                                                       |
| :--- | :------------------------------ | :-------------- | :------------------------------------------------------------------------------------ |
| base | —                               | Mobile          | One column, sticky 60px header with a menu button, stacked cards, one-column form     |
| `sm` | `(min-width: 40rem)` (640px)    | Mobile, relaxed | Form fields in pairs; grids gain columns                                              |
| `md` | `(min-width: 60rem)` (960px)    | Desktop         | Full navigation replaces the menu button; side-by-side rows; timeline down the middle |
| `lg` | `(min-width: 77.5rem)` (1240px) | Desktop         | Container at max width                                                                |

A few rules apply only below `md`; write those as `(max-width: 59.99rem)`.

## Layout tokens

| Token                              | Value                                        | Notes                                  |
| :--------------------------------- | :------------------------------------------- | :------------------------------------- |
| `--container-max`                  | 1240px                                       | Centred; nothing stretches beyond it   |
| `--gutter`                         | `clamp(20px, 4vw, 64px)`                     | 20px on phones, from the mobile design |
| `--gutter-left` / `--gutter-right` | `max(var(--gutter), env(safe-area-inset-*))` | Clears notches in landscape            |
| `--header-height`                  | `clamp(60px, 7vw, 76px)`                     | Plus `env(safe-area-inset-top)`        |
| `--measure-body`                   | 52ch                                         | Reading text width                     |
| `--tap-target`                     | 44px                                         | Minimum for every control              |
| `--row-min-height`                 | 48px                                         | Menu rows, inputs                      |

## Utilities

- `.container`: the centred column with gutters.
- `.rule-top` / `.rule-bottom`: a hairline that starts and ends with the text. **Don't put a
  border on `.container`**: it runs through the padding and touches the screen edge on phones.
  Only the header's bottom border and the footer's top rule run edge to edge.

## Mobile specifics (below `md`)

- **Header:** sticky, `--paper` background, 1px rule below, wordmark 16px, 44×44 menu button
  in graphite (ink on hover) with three 1.5px bars that animate into an X.
- **Menu:** a dropdown panel directly under the header (not a full-screen overlay). Uppercase
  12px links, 48px rows separated by rules, language switch and theme switch inside. Scrolls if
  it doesn't fit (landscape). Open state on `<html data-menu="open">`.
- **Hero:** 44px headline; each phrase set on three lines by hand, so the heading height
  doesn't jump between phrases.
- **Form:** one column, 16px inputs (prevents iOS zoom), 48px minimum height. Chips wrap.
- **Footer:** two-column grid.

## Desktop specifics (from `md`)

- Header: wordmark, primary nav, language switch, theme switch in one row.
- Work list rows and service blocks alternate image sides.
- Approach timeline runs down the middle; steps alternate sides, each side starting half a step
  lower.
- Footer: brand, two nav columns and contact side by side.

## General requirements

- Tap targets ≥ 44×44px; form inputs 16px.
- Images reserve their aspect ratio (no layout shift) and use `srcset`/`sizes`.
- Wide content scrolls inside its own container; the page never scrolls sideways.
- Focus is never hidden behind the sticky header (`scroll-padding-top` plus a WebKit fix in
  `Header.astro`).

## Testing widths

Check 320, 360, 375, 390, 414, 768, 834, 1024, 1280, 1440, 1920 and 2560px, plus landscape
667×375 and 844×390. Check Croatian at the 960px switch, where labels are longest. The
automated reflow tests cover 320px (400% zoom at 1280px) and 640px (200%).
