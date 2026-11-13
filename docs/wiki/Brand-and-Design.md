# Brand and design

The brand rules are hard constraints. Every value used in code is a token in
`src/styles/tokens.css`. Approved exceptions are in the
[Decision log](Decision-Log#approved-deviations-from-the-brand-or-design).

## Colour

Neutrals only. **Never add a colour, accent or gradient.**

| Token        | Dark (default) | Light     | Use                                                  |
| :----------- | :------------- | :-------- | :--------------------------------------------------- |
| `--paper`    | `#111110`      | `#F5F4F1` | Page ground                                          |
| `--raise`    | `#191917`      | `#FFFFFF` | Raised surfaces                                      |
| `--ink`      | `#F5F4F1`      | `#111110` | Text, marks, inverted fields                         |
| `--ink-2`    | `#C9C7C0`      | `#3B3A36` | Secondary text                                       |
| `--graphite` | `#8A8880`      | `#67655E` | Labels, metadata, captions only. **Never body copy** |
| `--rule`     | `#2C2B28`      | `#DCDAD3` | Hairlines                                            |
| `--stripe-a` | `#1B1B19`      | `#E9E7E1` | Placeholder stripes                                  |
| `--stripe-b` | `#131312`      | `#F2F0EA` | Placeholder stripes                                  |

Three places can't read CSS variables and repeat the colours; change them together:
`src/lib/theme.ts`, `src/worker/mail/layout.ts`, `public/site.webmanifest`.

## Type

- **Archivo only, weights 400 and 500 only.** Self-hosted variable woff2 (latin + latin-ext for
  č ć đ š ž), `font-display: swap`. Never Google Fonts.
- Monospace for metadata and code only.
- Roles: Display 500 (−4.5% tracking), Title 500 (−2.5%), Body 400 at 17px (~1.55 leading,
  ~52ch), Label 500 uppercase +14% (`.label`).

## Logo

- **Wordmark** (`Wordmark.astro`): `MINIMALIST` plus a closing square in `currentColor`. Header
  and footer.
- **Integrated mark** (M over INIMALIST): favicon, app icons and share image only. Masters in
  `design/assets/`; regeneration in `scripts/README.md`.
- Never both on one surface. Never tinted, re-tracked, outlined or stretched.

## Icons

Inline SVG, 24px box, 1.5px stroke, square caps, `currentColor`.

## Images

- Full colour. Ratios 4:5, 3:2, 1:1 from the brand; slots also use the design's 4:3, 16:10,
  16:9 and 21:8.
- No rounded corners, no shadows, no CSS filters: any treatment goes into the file.
- A slot without an image shows the striped placeholder with its caption.
- Type on an image (unused): darken the file to 42%, paper-coloured type, ≥ 4.5:1.
- Case study screenshots may carry notes (box, square, leader line, label) on their plain
  background, never over the picture. See [Images](Images#notes-on-screenshots).

## Motion

Easing `cubic-bezier(.2, 0, 0, 1)` (`--ease`). Everything not listed is instant.

| Name   | Duration       | Use                                        |
| :----- | :------------- | :----------------------------------------- |
| Reveal | 240ms          | Rules and underlines extend from the left  |
| Lift   | 160ms          | Translate only; unused                     |
| State  | ≤150ms, linear | Colour changes                             |
| Enter  | 240ms          | Content below the fold fades up 10px, once |
| Page   | 240ms          | Crossfade between pages                    |
| Field  | continuous     | The background canvas                      |

From the design: the theme knob (220ms) and the menu bars (260ms). Content on screen at load is
never hidden, nothing is hidden without JavaScript, and reduced motion turns all of it off. How
it's built: [Theme and motion](Theme-and-Motion).

## Voice

Quiet, short, factual. Never "passionate", "cutting-edge", "innovative", "solutions-driven".
Small studio, yes; never "one engineer" or "few projects". No invented clients, figures or
quotes. Croatian uses „…”. Applies to every string: meta descriptions, alt text, form
messages, emails, 404 copy.

## Responsive

- **Below `md` (960px) match the mobile design; from `md` up the desktop design.** 640–960px
  uses the mobile structure with wider spacing.
- Mobile values are the floor, desktop the ceiling: one fluid `clamp()` token per size.
- 320px to 2560px with no horizontal page scroll. Tap targets ≥ 44px, inputs 16px.
- Breakpoints (media queries can't read tokens): `sm` `40rem`, `md` `60rem`, `lg` `77.5rem`,
  mobile-first with `min-width`; below-`md`-only rules use `max-width: 59.99rem`.
- Check Croatian at 960px, where labels are longest.

## Design files

`design/` is the visual spec: copy, sizes, spacing, structure. New sections, components or
styles need the owner's approval.

| File                                     | What it is                                                     |
| :--------------------------------------- | :------------------------------------------------------------- |
| `minimalist-website-desktop-design.html` | All pages, EN/HR copy, both themes; fluid sizes, 1240px column |
| `minimalist-website-mobile-design.html`  | The same pages at ~402px in an iPhone frame; fixed px          |
| `minimalist-brand-identity.html`         | Logo, colour, type, grid device, icons, photography, motion    |
| `*.extracted.html`                       | The same pages as plain HTML, to read copy and values          |
| `assets/`                                | Master logo SVGs and `favicon.ico`                             |

Open the `.html` bundles in a browser; read the `.extracted.html` files as text.

**Re-extracting** (only if a bundle is replaced): the desktop and brand files keep the page as a
JSON string in `<script type="__bundler/template">`. In the mobile file that template is only
the phone frame; the page is a gzipped, base64 `text/html` resource in
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
