# Design system

The brand rules are hard constraints. The source is `design/minimalist-brand-identity.html`;
every value used in code is a token in `src/styles/tokens.css`.

## Colour

Four neutrals plus a rule colour and two placeholder tones. **Never add a colour, accent or
gradient.**

| Token        | Dark (default) | Light     | Use                                                  |
| :----------- | :------------- | :-------- | :--------------------------------------------------- |
| `--paper`    | `#111110`      | `#F5F4F1` | Page ground                                          |
| `--raise`    | `#191917`      | `#FFFFFF` | Raised surfaces                                      |
| `--ink`      | `#F5F4F1`      | `#111110` | Text, marks, inverted fields                         |
| `--ink-2`    | `#C9C7C0`      | `#3B3A36` | Secondary text                                       |
| `--graphite` | `#8A8880`      | `#67655E` | Labels, metadata, captions only. **Never body copy** |
| `--rule`     | `#2C2B28`      | `#DCDAD3` | Hairlines, dividers                                  |
| `--stripe-a` | `#1B1B19`      | `#E9E7E1` | Placeholder stripes                                  |
| `--stripe-b` | `#131312`      | `#F2F0EA` | Placeholder stripes                                  |

Light `--graphite` is darkened from the brand's `#7E7C75` for WCAG AA contrast. This is an
approved deviation; don't revert it.

The theme colours are repeated in three places that can't read CSS variables. Keep them in sync:
`src/lib/theme.ts` (`themeColors`, browser UI colour), `src/worker/mail/layout.ts` (emails) and
`public/site.webmanifest`.

## Typography

- **Archivo only**, weights **400 and 500 only**. Self-hosted variable woff2 in `public/fonts/`
  (latin + latin-ext for č ć đ š ž), `font-display: swap`, latin file preloaded. Never load
  Google Fonts.
- Fallback stack: `Archivo, Helvetica, Arial, sans-serif`.
- Monospace (`ui-monospace, SFMono-Regular, Menlo, monospace`) for metadata and code only.
- Roles from the brand: **Display** 500, tracking −4.5%; **Title** 500, tracking −2.5%;
  **Body** 400, 17px, about 1.55 line height, measure ~52ch; **Label** 500, uppercase,
  +14% tracking, 10–11px (`.label`).
- Croatian diacritics (č ć đ š ž) must always render in Archivo, so latin-ext is never dropped.

**Type scale.** Fixed steps are the same in both designs; fluid steps are `clamp(mobile, fluid, desktop)`.

| Token                                                  | Value                      | Typical use                                          |
| :----------------------------------------------------- | :------------------------- | :--------------------------------------------------- |
| `--text-label-sm` / `--text-label` / `--text-label-lg` | 10 / 11 / 12px             | Form labels, section labels, mobile menu             |
| `--text-xs` … `--text-body`                            | 13, 14, 15, 16, 17px       | Small text, buttons, UI, inputs (16px), reading text |
| `--text-lead`                                          | `clamp(16px, 1.5vw, 19px)` | Ledes                                                |
| `--text-lg` / `--text-xl` / `--text-2xl`               | up to 22 / 26 / 34px       | Card and section headings                            |
| `--text-4xl` / `--text-5xl`                            | up to 42 / 46px            | Large headings                                       |
| `--text-cta`                                           | `clamp(26px, 4.4vw, 56px)` | CTA band                                             |
| `--text-6xl`                                           | `clamp(30px, 5.4vw, 66px)` | Page titles                                          |
| `--text-display`                                       | `clamp(44px, 8vw, 104px)`  | Home hero                                            |

Tracking (`--tracking-*`) runs from `-0.045em` (display) to `+0.14em` (labels); leading
(`--leading-*`) from `0.98` (display) to `1.6`.

## Layout

| Token              | Value                                                                   |
| :----------------- | :---------------------------------------------------------------------- |
| `--container-max`  | 1240px                                                                  |
| `--gutter`         | `clamp(20px, 4vw, 64px)`, plus safe-area insets (`--gutter-left/right`) |
| `--header-height`  | `clamp(60px, 7vw, 76px)`                                                |
| `--tap-target`     | 44px                                                                    |
| `--row-min-height` | 48px                                                                    |
| `--hairline`       | 1px                                                                     |

Breakpoints: `sm` 640px (`40rem`), `md` 960px (`60rem`), `lg` 1240px (`77.5rem`). See
[Responsive layout](/Technical-Specification/Responsive-Layout).

## Logo

- **Wordmark** (`src/components/Wordmark.astro`): live text `MINIMALIST` plus a CSS square,
  tracking −0.035em, weight 500, in `currentColor`. The square is 20% of the font size,
  baseline-aligned, one optical space (0.26em) after the T, always the text colour. Used in the
  header and footer; header 16–18px, footer 17px.
- **Integrated mark** (M with INIMALIST beneath): favicon, app icons and the share image only.
  Masters in `design/assets/`; regeneration steps in `scripts/README.md`.
- Never both marks on one surface. Never tinted, re-tracked, outlined or stretched.

## Icons

Inline SVG, 24px box, 1.5px stroke, square caps, `currentColor`. No rounding except true circles.

## Images

- Full colour (approved deviation from the brand's greyscale, 2026-09-22; don't revert it).
- The brand brief names 4:5, 3:2 and 1:1 for photography. Image slots follow the design's
  frames: 4:5 (About portrait), 4:3 (`ImageFrame` default, cards), 16:10, 16:9 (case study hero,
  article cover) and 21:8. Astro crops each file to its slot, so one file can serve several ratios.
- No rounded corners, no shadows. Any treatment goes into the file, never a CSS filter.
- Flat light. Free-licence stock for services, steps and the insight cover; the About portrait
  is the owner's own photograph (4:5); case study images are real screenshots (PNG).
- **Type on an image** (not used today): darken the image to 42% brightness in the file and set
  paper-coloured type at full opacity. No scrims or gradients; at least 4.5:1 contrast.
- **Notes on screenshots** (2026-10-28, case study only): a hairline box around a feature, the
  brand's square on its edge and an axis-aligned leader line out to a short uppercase label.
  Boxes and squares are `--ink` with a `--paper` edge, so they read on light and dark screens;
  lines are `--graphite`; labels are `--ink-2` label type. Labels sit only on the mockup's own
  plain background, which matches the page in both themes, never over the picture, so the
  type-on-image rule above doesn't apply. Below md the lines go, the squares carry numbers and
  the labels run as a numbered list under the image. Component: `AnnotatedImage`; how to add
  them: [Add or replace an image](/Guides/Add-or-Replace-an-Image#notes-on-screenshots).
- A slot without an image shows the striped placeholder with its caption, e.g.
  `product shot / core banking console`.

## Graphic device

A hairline grid with one cell filled ink. The square after the wordmark, the step markers and
the metadata separators (`MetaRow`) come from it.

## Motion

Easing for everything: `cubic-bezier(.2, 0, 0, 1)` (`--ease`).

| Name   | Duration       | Token                      | Use                                        |
| :----- | :------------- | :------------------------- | :----------------------------------------- |
| Reveal | 240ms          | `--duration-reveal`        | Rules and underlines extend from the left  |
| Lift   | 160ms          | `--duration-lift`          | Translate only; currently unused           |
| State  | ≤150ms, linear | `--duration-state` (140ms) | Colour changes                             |
| Enter  | 240ms          | `--duration-reveal`        | Content below the fold fades up 10px, once |
| Page   | 240ms          | `--duration-reveal`        | Crossfade between pages                    |
| Field  | continuous     | —                          | The background canvas                      |

Also: the theme knob (`--duration-switch`, 220ms) and the menu icon bars (`--duration-menu`,
260ms) from the design. Everything else is instant. Content on screen at load is never hidden,
nothing is hidden without JavaScript, and reduced motion disables all animation. See
[Motion](/How-It-Works/Motion).

## Components at a glance

| Component                                                                 | Purpose                                                                                    |
| :------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------- |
| `Button`                                                                  | Primary action: ink fill, paper text; outline on hover. `<a>` with `href`, else `<button>` |
| `CtaLink`                                                                 | Uppercase label link with an arrow that nudges on hover; `plain` and `back` variants       |
| `CtaBand`                                                                 | Closing line, primary button and next-section link                                         |
| `Section`, `SectionHeader`, `PageHeader`                                  | Page rhythm, section titles with an optional link, page titles                             |
| `ImageFrame`                                                              | Image cropped to a ratio, or the striped placeholder                                       |
| `AnnotatedImage`                                                          | `ImageFrame` plus the image's notes (case study screenshots)                               |
| `WorkCard`, `WorkRow`                                                     | Case study on the home page / Work list                                                    |
| `InsightCard`, `InsightRow`                                               | Insight on the home page / Insights list                                                   |
| `ServiceCard`, `NumberedBlock`, `DetailPair`                              | Services and steps                                                                         |
| `StepList`, `Timeline`                                                    | Six steps on the home page / Approach                                                      |
| `SkillGroupCard`, `ToolTags`, `LabelledRow`                               | Skills, tool tags, label-beside-content rows                                               |
| `StatBlock`, `ResultList`, `Quote`, `MetaPanel`, `MetaRow`                | Figures, results, quotes, metadata                                                         |
| `FaqList`                                                                 | Questions and answers, always open                                                         |
| `TextField`, `ChipGroup`, `Checkbox`, `ContactForm`                       | Form controls and the inquiry form                                                         |
| `Header`, `MobileMenu`, `Footer`, `Wordmark`, `LangSwitch`, `ThemeToggle` | Site chrome                                                                                |
| `Hero`, `BackgroundField`                                                 | Home hero, decorative canvas                                                               |
| `SeoHead`, `JsonLd`, `ThemeScript`                                        | `<head>` content                                                                           |

## Voice

Quiet, short, factual. No "passionate", "cutting-edge", "innovative", "solutions-driven".
Applies to every new string: meta descriptions, alt text, form messages, emails, 404 copy.

## Design files

The design is the spec. Copy, sizes, spacing and component structure come from `design/`.
New sections, components or visual styles need the owner's approval first.

| File                                     | What it is                                                                                                                          |
| :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `minimalist-website-desktop-design.html` | Desktop design: all pages, EN/HR copy, both themes. Fluid `clamp()` sizes, 1240px container                                         |
| `minimalist-website-mobile-design.html`  | Mobile design: the same pages and copy at about 402px wide, shown in an iPhone frame. Fixed px values, sticky header, dropdown menu |
| `minimalist-brand-identity.html`         | Brand identity v1.0: logo, colour, type, grid device, icons, photography, motion, voice                                             |
| `*.extracted.html`                       | The same three pages as plain HTML, for reading copy and exact values                                                               |
| `assets/`                                | Master logo SVGs (mark and wordmark, ink and paper) and `favicon.ico`                                                               |

Open the `.html` files in a browser for visual comparison. They are self-unpacking bundles, so
read the `.extracted.html` versions as text. The two website designs share pages, copy and
routes and differ only in layout and sizing. The designs load Archivo from Google Fonts; the
site never does.

### Re-extracting

Only needed if a design bundle is replaced. The desktop and brand files keep the page in
`<script type="__bundler/template">` as a JSON string. In the mobile file that template is only
the iPhone frame; the page is a gzipped, base64-encoded `text/html` resource inside
`<script type="__bundler/manifest">`.

```bash
python3 - <<'EOF'
import re, json, base64, gzip

def template(name):
    s = open(f"design/{name}.html", encoding="utf-8").read()
    return s, json.loads(re.search(r'<script type="__bundler/template">(.*?)</script>', s, re.S).group(1))

for name in ["minimalist-website-desktop-design", "minimalist-brand-identity"]:
    _, tpl = template(name)
    open(f"design/{name}.extracted.html", "w", encoding="utf-8").write(tpl)

s, _ = template("minimalist-website-mobile-design")
manifest = json.loads(re.search(r'<script type="__bundler/manifest">(.*?)</script>', s, re.S).group(1))
for res in manifest.values():
    if res["mime"] == "text/html":
        data = base64.b64decode(res["data"])
        if res.get("compressed"):
            data = gzip.decompress(data)
        open("design/minimalist-website-mobile-design.extracted.html", "wb").write(data)
EOF
```

### Where the build differs from the design

The design is a single-page prototype with in-page routing; the site has real URLs per page and
language. Approved differences (full-colour photos, light graphite, Enter/Page/Field motion, FAQ
on Services, the Approach timeline, mobile About order) are listed in the
[Decision log](/Overview/Decision-Log#approved-deviations-from-the-brand-or-design). The design's
placeholder clients, metrics and quotes were removed; only verified content is published.
