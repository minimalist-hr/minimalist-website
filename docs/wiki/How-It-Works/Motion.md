# Motion

The vocabulary is fixed by the brand: Reveal, Lift, State, plus the approved Enter, Page and
Field. Easing is always `cubic-bezier(.2, 0, 0, 1)`. Everything else is instant. See
[Design system → Motion](/Product/Design-System#motion).

Three guarantees hold everywhere:

1. **Content on screen at load never waits for motion.**
2. **Nothing is hidden without JavaScript.**
3. **`prefers-reduced-motion: reduce` turns all of it off.**

## Scroll reveal (Enter and Reveal)

`src/scripts/reveal.ts`, started from `BaseLayout`; states in `src/styles/motion.css`.

**What it picks up**

- _Content:_ each child of a top-level `main .container`. If a child contains
  `[data-reveal-item]` elements (cards, steps), those items enter one by one instead.
- _Rules:_ `.rule-top`, `.rule-bottom`, and any element with `data-draw` (a border drawn through
  `border-image`).

**How it runs**

1. On load, measure each candidate. Only those that start **below the viewport** are held:
   the script sets `data-reveal="pending"` or `data-rule="pending"`. A `.rule-bottom` is judged by
   its bottom edge, through a 1px sentinel element.
2. An `IntersectionObserver` (bottom margin −8%) watches them.
3. When elements enter, they're sorted top-to-bottom, left-to-right and switched to `in` with a
   staggered `--reveal-delay` (60ms apart, at most 300ms).
4. After the transition (240ms + margin), the attributes and the delay are removed, so the
   element's own hover transitions work normally again.

**The CSS**

```css
:root [data-reveal='pending'] {
  opacity: 0;
  translate: 0 10px;
} /* Enter */
:root .rule-top[data-rule='pending']::before {
  transform: scaleX(0);
} /* Reveal */
:root [data-draw][data-rule='pending'] {
  --rule-draw: 0%;
} /* border rules */
```

`translate` is used instead of `transform` so it never fights an element's own transform.
`--rule-draw` is a registered `@property`, so the border gradient's length can animate. A
vertical rule sets `--draw-direction: to bottom` (the home steps on mobile and the Approach
timeline draw downwards). In print, everything shows.

The script returns immediately with reduced motion or without `IntersectionObserver`.

## Page crossfade (Page)

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }
}
```

Cross-document view transitions crossfade the root over 240ms. Browsers without support
(currently Firefox) switch instantly. Reduced motion never opts in.

## Links (Reveal on hover)

`.link-line` in `utilities.css`: no underline at rest; on hover (pointer devices only) and on
keyboard focus a 1px ink line scales in from the left over 240ms; the current page or language
keeps it. Links inside running text keep a visible underline instead (WCAG 1.4.1), because the
line can't follow wrapped text.

## Colour changes (State)

Colour transitions use `--duration-state` (140ms) with `linear` timing: nav text brightening to
ink, chips and tool tags on hover, the menu button.

## Hero headline

`src/components/Hero.astro`. Four phrases sit stacked in one grid cell, so the heading is as tall
as the longest one. A CSS animation (`phrase`, 18s loop) shows each for 4.5s, fading in from
10px below and out 10px upward. Only the first phrase is exposed to screen readers; the others
are `aria-hidden`. The scroll cue's text and arrow bob on a 2.6s loop (the cue itself stays put, so its blurred
patch does too). With reduced motion only the first phrase
shows and nothing loops.

## Design-specified extras

The theme knob slides (220ms) and the menu bars turn into an X (260ms), both from the design.

## Lift

Defined (`--duration-lift`, 160ms, translate only) but unused since the card lift was removed on
2026-09-19.

## Reduced motion

Under `prefers-reduced-motion: reduce`, `base.css` cuts every animation to 0.01ms with one
iteration and sets `transition: none` (not a near-zero duration: that would give every element
a transition, and WebKit can then report colours mid-way). The reveal script doesn't hold anything, view transitions are
never enabled, the hero shows its first phrase, and the background field draws one still frame.

## Tests

`tests/motion.spec.ts`:

- nothing on screen at load is held back,
- content below the fold enters as it scrolls into view,
- keyboard focus reveals held content (skipped in WebKit),
- with reduced motion nothing is held.

The axe audit runs with reduced motion, so it always sees the final state.
