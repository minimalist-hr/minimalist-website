# Background field

A decorative canvas behind every page (approved addition, 2026-09-22). Component:
`src/components/BackgroundField.astro`. Engine and tuning: `src/scripts/background-field.ts`.

## What it draws

An **adaptive quadtree**. The plane is tiled with root cells (each twice the viewport); a cell
splits into four while it's still large compared with its distance to a _point of interest_,
and stops when it's small enough or hits the depth limit.

The points of interest are the **pointer** and **drifting points** that move slowly on their own,
so the grid is fine where the cursor is, coarse away from it, and keeps changing when nothing is
moving. After 2.6s without pointer movement, the pointer's point joins the drift.

Every line is axis-aligned and every cell is a rectangle of the same proportion: the brand's
grid device rather than an overlay. Lines are `--graphite` at low alpha.

A cell opens by growing from its own centre over 240ms (Reveal) and collapses back over 420ms,
so moving the pointer across an area doesn't flicker. The whole lattice drifts about 7px a second.

## Hero and ambient levels

|                                    | Over the hero | Below the hero, and on other pages |
| :--------------------------------- | :------------ | :--------------------------------- |
| Max depth                          | 6             | 4                                  |
| Pointer reach (`POINTER_DETAIL_*`) | 0.85          | 0.45                               |
| Line alpha (`LINE_ALPHA_*`)        | 0.18          | 0.11                               |

Away from the hero the field shows only beside the content column (see Placement), so its
alpha can sit closer to the hero's than a level drawn behind text could.

The home hero is marked with `[data-field-hero]`. Its closing rule is the threshold: lines above
it are drawn at hero strength and lines below it much fainter **in the same frame**, so the
boundary reads as an edge rather than a slow fade. The tree depth and pointer reach ease from
hero to ambient as the hero leaves the screen (fully hero while ≥ 72% is visible, fully ambient
by 30%).

Theme scaling: `--field-alpha-scale` is 1 in dark and 0.5 in light, because the same grey reads
heavier on paper.

## Placement

```css
.field {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
```

Behind all content but above the page background. The header, footer, form fields, links, chips
and tags keep their own `--paper` background, so the field runs behind the page, not through
the chrome or the controls. Hidden in print.

**The content column is opaque** (2026-10-28). Below the hero, every top-level element of
`<main>` (`main > :not([data-field-hero])`, in `utilities.css`) is the 1240px column on a
`--paper` background, so the field never runs behind text, rules or the space between blocks.
It shows only in the side margins, on windows wider than the column. The hero keeps the field
behind it.

From 78rem (1248px) up, the column has a hairline on each side (`--rule`, like the header's
bottom and the footer's top rule). The lines start at the hero's full-width closing rule (or
the header) and end at the footer, so the column reads as framed. Narrower windows have no
margin, so the column fills the window, the sides stay open and no line sits on the screen edge.
On phones and tablets the field therefore shows only in the hero.

A new page gets this as long as its blocks are direct children of `<main>` (any `Section`,
`article` or wrapper). Something meant to run the full width of the window needs its own
exception, as the hero has.

## Safeguards

- `aria-hidden="true"`, `pointer-events: none`, no content.
- Absent without JavaScript.
- The animation loop stops when the tab is hidden or the canvas is off screen.
- Device pixel ratio capped at 1.75.
- Phones (≤ 640px) run one level shallower.
- Detail scales with the viewport (reference 900px, clamped 0.5–1.15), so a phone doesn't refine
  every cell to the same depth and turn into a plain grid.
- Reduced motion: one settled frame, then stop.
- Canvas 2D, not WebGL: a few hundred stroked rectangles per frame, batched into one path per
  depth and fade step (6 steps). Crisp hairlines matter more than shader power, and there's no
  context loss to handle.

## Tuning

All constants are exported at the top of `background-field.ts`, each with a comment. The ones
you're most likely to touch:

| Constant                                     | Default     | Effect                                                             |
| :------------------------------------------- | :---------- | :----------------------------------------------------------------- |
| `MAX_DEPTH_HERO` / `MAX_DEPTH_AMBIENT`       | 6 / 4       | Smallest cell size                                                 |
| `POINTER_DETAIL_HERO` / `_AMBIENT`           | 0.85 / 0.45 | How dense and how far the pointer's effect reaches                 |
| `DRIFT_DETAIL`, `DRIFT_COUNT`                | 0.35, 3     | Liveliness without a pointer                                       |
| `LINE_ALPHA_HERO` / `_AMBIENT`               | 0.18 / 0.11 | Line strength                                                      |
| `HERO_HOLD` / `HERO_RELEASE`                 | 0.72 / 0.3  | Where the hero hands over                                          |
| `SPLIT_DURATION_MS` / `COLLAPSE_DURATION_MS` | 240 / 420   | Open and close speed                                               |
| `MAX_CELL_FRACTION`                          | 1.1         | Largest cell relative to the viewport; too tight looks like a grid |
| `MAX_DPR`                                    | 1.75        | Resolution cap                                                     |

Keep it quiet: the field must never compete with text. Check both themes, a phone, and with
the hero in and out of view after any change. Colour stays `--graphite`; never add a colour.
