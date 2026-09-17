# Minimalist — Website Build Plan

> Studio website for **Minimalist**, a software development studio.
> Domain: **minimalist.hr** (registered via CARNET, Croatia).
> Stack: **Astro (static) + plain CSS + Cloudflare** (hosting, DNS, form function, Turnstile, analytics).
> Languages: **English (default) + Croatian**. Themes: **Dark (default) + Light**.
> Must be fully responsive, from 320px phones to 2560px displays. Separate desktop and mobile designs exist; the build merges them into one responsive codebase.

This document is the single source of truth for the build. It is written so it can be handed directly to Claude Code together with the two design files.

---

## 0. How to use this document (for Claude Code)

**Inputs in the repo, under `/design`:**

| File | What it is |
|---|---|
| `design/minimalist-website-desktop-design.html` | **Desktop** website design: all pages, EN/HR copy, dark/light themes. Fluid `clamp()` sizing, 1240px max container |
| `design/minimalist-website-mobile-design.html` | **Mobile** website design: the same pages and copy, laid out for a phone (shown inside an iPhone frame, ~402px wide). Fixed px values, sticky header, dropdown menu |
| `design/minimalist-brand-identity.html` | Brand identity v1.0: logo system, colour, type, grid device, icons, photography, motion, voice |
| `MINIMALIST-WEBSITE-PLAN.md` | This plan |

**All three design files are self-unpacking bundles.** Opened in a browser, they render normally. Read as text, the markup is encoded:
- **Desktop and brand files:** the page lives in `<script type="__bundler/template">` as a JSON-encoded string.
- **Mobile file:** the template is only the iPhone preview frame. The actual mobile page is a separate `text/html` resource inside `<script type="__bundler/manifest">`, gzipped and base64-encoded.

Extract everything once:

```bash
python3 - <<'EOF'
import re, json, base64, gzip

def template(name):
    s = open(f"design/{name}.html").read()
    return s, json.loads(re.search(r'<script type="__bundler/template">(.*?)</script>', s, re.S).group(1))

for name in ["minimalist-website-desktop-design", "minimalist-brand-identity"]:
    _, tpl = template(name)
    open(f"design/{name}.extracted.html", "w").write(tpl)

# mobile: pull the page resource out of the manifest
s, _ = template("minimalist-website-mobile-design")
manifest = json.loads(re.search(r'<script type="__bundler/manifest">(.*?)</script>', s, re.S).group(1))
for uuid, res in manifest.items():
    if res["mime"] == "text/html":
        data = base64.b64decode(res["data"])
        if res.get("compressed"):
            data = gzip.decompress(data)
        open("design/minimalist-website-mobile-design.extracted.html", "wb").write(data)
EOF
```

Use the extracted HTML for exact copy, spacing, sizes, tokens and component structure. Use the browser-rendered files for visual comparison. The two website designs share the same pages, copy and routes; they differ only in layout and sizing.

**Working rules:**
- Treat the design as the spec. Match it closely, and ask before inventing new sections or visual styles.
- Treat the brand identity rules (section 3) as hard constraints.
- Work phase by phase (section 13). Finish each phase's checklist and show the result before moving on.
- Keep dependencies minimal. Every added package needs a reason.

---

## 1. Decisions (locked)

| Area | Decision | Why |
|---|---|---|
| Framework | **Astro**, latest stable, `output: 'static'` | Content site; ships HTML/CSS with near-zero JS; built-in i18n and content collections |
| Styling | **Plain CSS** with custom properties plus Astro scoped styles. No Tailwind, no UI kit | The brand is 4 colours and 1 typeface; tokens map 1:1 to CSS variables |
| Content | **Astro Content Collections** (Markdown/MDX + typed schema) for case studies and insights | Adding content = adding a file |
| JavaScript | Vanilla TS in small `<script>` islands only: theme toggle, language switch, mobile menu, form, reveal motion | No framework runtime shipped to the browser |
| Hosting | **Cloudflare**: static assets and a serverless function for the contact form. Use whichever Cloudflare product is currently recommended for static sites with functions (Pages, or Workers with static assets) | Free, fast EU edge, preview deploys per branch |
| Repo & CI | **GitLab**, connected to Cloudflare. `main` → production; other branches → preview URLs | Matches studio tooling |
| Form spam | **Cloudflare Turnstile** | Invisible, cookieless |
| Form email | Transactional email API with an EU data region (Brevo or Resend), called from the function | No database; minimal GDPR surface |
| Analytics | **Cloudflare Web Analytics** (cookieless) | No cookie banner needed |
| Fonts | **Self-hosted Archivo** (variable, woff2), subsets **latin + latin-ext** | Performance, GDPR, Croatian diacritics |
| Package manager | pnpm (or npm; pick one and stay consistent) | — |

---

## 2. Sitemap and routes

The design is a single-page prototype with in-page routing (`home, work, case, services, approach, skills, about, insights, insight, contact, legal, notfound`). The real site becomes **real multi-page URLs**.

English lives at the root, Croatian under `/hr/`, and Croatian slugs are translated.

| Page | EN route | HR route | Notes |
|---|---|---|---|
| Home | `/` | `/hr/` | Hero, selected work, services, approach, skills, about stats, insights, CTA |
| Work (list) | `/work/` | `/hr/radovi/` | Case study cards; "case study in progress" state for unpublished ones |
| Case study | `/work/[slug]/` | `/hr/radovi/[slug]/` | Meta row, hero image, Context / Problem / What we removed / What we built / Results / Quote / CTA |
| Services | `/services/` | `/hr/usluge/` | 4 services, each with "Solves" and "You receive" |
| Approach | `/approach/` | `/hr/pristup/` | 6 steps, pricing block, FAQ |
| Skills | `/skills/` | `/hr/vjestine/` | 6 areas with tool tags |
| About | `/about/` | `/hr/o-studiju/` | Studio description, stats |
| Insights (list) | `/insights/` | `/hr/zapisi/` | Can be hidden via a site flag (the design has `showInsights`) |
| Insight (article) | `/insights/[slug]/` | `/hr/zapisi/[slug]/` | Long-form reading layout |
| Contact | `/contact/` | `/hr/kontakt/` | Project form |
| Legal | `/legal/` | `/hr/pravno/` | Privacy policy + company information |
| 404 | `/404.html` | Same page, language detected from path | Bilingual-aware not-found |

**Requirements:**
- Configure Astro i18n: `defaultLocale: 'en'`, `locales: ['en', 'hr']`, `prefixDefaultLocale: false`.
- Keep a route map (`src/i18n/routes.ts`) pairing each EN route with its HR counterpart. The language switcher must link to the **equivalent page**, not the homepage.
- Output `hreflang` alternates (`en`, `hr`, `x-default` → EN) and a canonical URL on every page.
- Set `<html lang="en">` or `<html lang="hr">` correctly.
- **No automatic redirect based on browser language.** It harms SEO and annoys users. The switcher is enough.
- Use trailing slashes consistently (`trailingSlash: 'always'`).

---

## 3. Brand rules (hard constraints)

Taken from `minimalist-brand-identity.html`. Do not deviate.

### 3.1 Colour: four neutrals, no accent

| Token | Light theme | Dark theme | Use |
|---|---|---|---|
| `--paper` | `#F5F4F1` | `#111110` | Page ground |
| `--raise` | `#FFFFFF` | `#191917` | Raised surfaces |
| `--ink` | `#111110` | `#F5F4F1` | Text, marks, inverted fields |
| `--ink-2` | `#3B3A36` | `#C9C7C0` | Secondary text |
| `--graphite` | `#7E7C75` | `#8A8880` | Labels, metadata, captions only; **never body copy** |
| `--rule` | `#DCDAD3` | `#2C2B28` | Hairlines, dividers, grids |
| `--stripe-a` | `#E9E7E1` | `#1B1B19` | Image placeholder stripes |
| `--stripe-b` | `#F2F0EA` | `#131312` | Image placeholder stripes |

Copy exact values from the extracted design file if they differ from this table. **Never add a colour or a gradient.**

### 3.2 Typography: Archivo only

- **Weights:** 400 and 500 only.
- **Display:** weight 500, tracking −4.5%.
- **Title:** weight 500, tracking −2.5%.
- **Body:** 400, 17px / 26px line height, max measure ~52 characters for reading text.
- **Label:** 500, UPPERCASE, tracking +14%, 10–11px.
- **Monospace** (metadata/code only): `ui-monospace, SFMono-Regular, Menlo, monospace`.
- **Fallback stack:** `Archivo, Helvetica, Arial, sans-serif`.
- Self-host with `font-display: swap` and preload the main woff2. **Must include latin-ext** (č ć đ š ž). The designs load Archivo from Google Fonts; do **not** copy that into the site.

### 3.3 Logo

- **Wordmark** `MINIMALIST` plus a closing square. Tracking −4%, weight 500. The square is 20% of the font size, baseline-aligned, one optical space after the T, and always the same colour as the text. Used in the site header and footer.
- **Integrated mark** (M with INIMALIST beneath). Used for favicon, app icons and Open Graph image. Full mark down to 48px for icons.
- Never both marks on one surface. Never tinted grey. Never re-tracked, outlined or stretched.
- Build the wordmark as **inline SVG or live text with a CSS square** so it inherits `currentColor` and works in both themes.

### 3.4 Graphic device, icons, images

- **Device:** hairline grid with one cell filled ink.
- **Icons:** 24px box, 1.5px stroke, square caps, no rounding except true circles. Inline SVG using `currentColor`.
- **Photography:** greyscale only, flat light, crops 4:5 / 3:2 / 1:1, no rounded corners, no shadows. Apply treatment to the image files (contrast 0.92, brightness 1.04), not via CSS filters.
- **Type on image:** darken the image to 42% brightness; paper-coloured type at full opacity; no scrims or gradients; minimum 4.5:1 contrast.
- **Until real photos exist,** use the striped placeholder with its caption (e.g. `product shot / core banking console`), exactly as in the design.

### 3.5 Motion

| Name | Duration | Easing | Use |
|---|---|---|---|
| Reveal | 240ms | `cubic-bezier(.2,0,0,1)` | Rules and underlines extend from the left |
| Lift | 160ms | same | Translate only; no scale, shadow or bounce |
| State | ≤150ms | linear | Colour changes |

Everything else is instant.

**Hero rotating headline (both designs).** The h1 cycles through four taglines stacked in one grid cell: "Complex problems. Simple solutions." → "Less noise. Better software." → "Software, reduced to what matters." → "Simple by design, built to last."
- Each phrase is shown for 4.5s within an 18s loop, fading in from 10px below and out 10px upward, with `cubic-bezier(.2,0,0,1)`.
- The design also uses small looping cues: a scroll indicator that bobs, and an "Available for hire" signal/ping dot.
- For screen readers, expose only the first phrase (others `aria-hidden="true"`) so the heading doesn't change underneath them.

**Reduced motion:** respect `prefers-reduced-motion: reduce` by disabling all animations and transitions. The hero then shows only the first phrase, as in both designs.

### 3.6 Voice

Quiet, short, factual. No "passionate", "cutting-edge", "innovative", "solutions-driven". Applies to any new copy: meta descriptions, form messages, 404 text, alt text.

---

## 4. Project structure

```
minimalist/
├─ design/                         # design inputs (not deployed)
│  ├─ minimalist-website-desktop-design.html
│  ├─ minimalist-website-mobile-design.html
│  └─ minimalist-brand-identity.html
├─ functions/
│  └─ api/
│     └─ contact.ts                # Cloudflare function: POST /api/contact
├─ public/
│  ├─ fonts/archivo-*.woff2
│  ├─ favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
│  ├─ og/default.png               # 1200×630, integrated mark on ink
│  ├─ robots.txt
│  └─ _headers                     # security + cache headers
├─ src/
│  ├─ components/
│  │  ├─ Header.astro  Footer.astro  MobileMenu.astro
│  │  ├─ Wordmark.astro  ThemeToggle.astro  LangSwitch.astro
│  │  ├─ SectionHeader.astro  Button.astro  Label.astro
│  │  ├─ WorkCard.astro  ServiceRow.astro  StepRow.astro  SkillGroup.astro
│  │  ├─ InsightCard.astro  StatBlock.astro  Faq.astro  Quote.astro
│  │  ├─ ImageFrame.astro          # real image or striped placeholder + caption
│  │  ├─ CtaBand.astro
│  │  └─ ContactForm.astro
│  ├─ content/
│  │  ├─ work/en/*.md   work/hr/*.md
│  │  └─ insights/en/*.mdx   insights/hr/*.mdx
│  ├─ content.config.ts            # collection schemas
│  ├─ i18n/
│  │  ├─ ui.ts                     # UI strings EN/HR
│  │  ├─ routes.ts                 # EN↔HR route map
│  │  └─ utils.ts                  # t(), getLocale(), localizedPath()
│  ├─ layouts/
│  │  ├─ BaseLayout.astro          # <head>, theme script, SEO, header/footer
│  │  └─ ArticleLayout.astro
│  ├─ pages/
│  │  ├─ index.astro  work/  services.astro  approach.astro  skills.astro
│  │  ├─ about.astro  insights/  contact.astro  legal.astro  404.astro
│  │  └─ hr/ …mirrors with translated slugs…
│  ├─ styles/
│  │  ├─ tokens.css                # colours, type scale, spacing, motion
│  │  ├─ fonts.css
│  │  ├─ base.css                  # reset, typography defaults, focus styles
│  │  └─ utilities.css             # container, grid, visually-hidden
│  └─ site.config.ts               # showInsights, company info, email, socials
├─ astro.config.mjs
├─ wrangler.toml                   # if using Workers
├─ CLAUDE.md                       # short project rules for Claude Code
└─ README.md
```

Page components should be shared between languages. `pages/hr/usluge.astro` renders the same `Services` view as `pages/services.astro` with `locale="hr"`, so there is no duplicated markup.

---

## 5. Responsive specification

There are two layout designs: **mobile** (fixed px values, drawn at ~402px) and **desktop** (fluid `clamp()` values, 1240px container). Neither contains layout breakpoints. The build's job is to turn them into **one responsive codebase** that looks like the mobile design on phones, like the desktop design on laptops and larger, and holds together at every width in between.

### 5.1 Approach
- **Mobile-first CSS.** The mobile design is the base stylesheet; `min-width` media queries layer in the desktop layout.
- **Mobile design values are the floor, desktop values are the ceiling.** Where the same element differs, express it as one fluid token scaling between the two. For example, the hero headline is 44px on mobile and larger on desktop, so the token becomes `clamp(44px, <fluid>, <desktop max>)`. Read the exact desktop `clamp()` from the desktop file.
- **Container queries** (`container-type: inline-size`) for cards and rows that appear in different widths: work cards, insight cards, service rows, step rows.
- **Content width:** max container **1240px** (from both designs), centred. Side padding **20px on mobile** (from mobile design), growing fluidly to the desktop value. Reading text capped at ~52ch.

### 5.2 Breakpoints (layout only)

| Name | Min width | Which design applies | Typical changes |
|---|---|---|---|
| base | 0 | **Mobile design** | Single column, sticky 60px header with menu button, stacked cards, one-column form |
| `sm` | 640px | Mobile, relaxed | Form name/email and company/role in pairs; stats and grids gain columns |
| `md` | 960px | **Desktop design** | Full horizontal navigation replaces the menu button; side-by-side service/image and case study rows |
| `lg` | 1240px | Desktop | Container reaches max width; desktop clamp values near maximum |
| `xl` | 1600px+ | Desktop | Layout stays centred at 1240px; nothing stretches |

The exact `md` switch point depends on where the desktop navigation fits without wrapping in both languages. Croatian labels ("O studiju", "Vještine") are longer, so test HR at the breakpoint.

**Between 640px and 960px (tablets, small laptops)** there is no design. Use the mobile structure with wider spacing, and move to the desktop structure only once it genuinely fits. Screenshot 768px and 834px for review.

### 5.3 Mobile design specifics (match exactly below `md`)

Taken from `minimalist-website-mobile-design.html`:

- **Header:** `position: sticky; top: 0`, height **60px**, `--paper` background, 1px `--rule` bottom border, 20px side padding.
  - Wordmark at 16px, weight 500, tracking −0.035em, followed by a 3.4px square.
  - Menu button 44×44px, `--graphite` colour (→ `--ink` on hover), three 1.5px bars in a 22×14px box.
- **Menu:** a **dropdown panel** directly under the header (`position: absolute; top: 100%`), full width, not a full-screen overlay.
  - Links are uppercase labels (12px, weight 500, +0.14em), graphite, **min-height 48px** each, separated by 1px rules.
  - Active/hover link gets a 1px ink underline under the text.
  - Open state is toggled on `<html data-menu="open">`. The bars animate into an X over 260ms `cubic-bezier(.2,0,0,1)`; the middle bar fades out.
  - The button has a visible label swap (closed/open) and `aria-expanded`.
  - Language switch and theme toggle (a sliding knob switch) sit inside the menu panel. Check the extracted file for their exact placement.
- **Hero:** h1 at **44px**, weight 500, tracking −0.05em, line-height 0.96, max-width 16ch, with deliberate `<br>` line breaks in English.
- **Type sizes used on mobile:** 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 26, 28, 30, 38, 44px. Map these to the shared type tokens rather than hard-coding them.
- **Section rhythm:** vertical padding mostly 32–56px, side padding always 20px.
- **Buttons:** primary is ink fill, paper text, 14px/500, padding 14px 22px, swapping to outline on hover. Text links are uppercase 11px labels with an arrow that nudges 5px on hover.
- **Case study CTA block:** top rule, h2 at 22px, primary button plus a plain label link side by side, wrapping if needed.
- **Form:** one column, 20–24px gaps. Labels are 10px uppercase graphite. Inputs are 16px, padding 14px, **min-height 48px**, 1px inset `--rule` border that turns `--ink` on focus. Chips are visually hidden radios with a styled `<span>`; checked = ink fill, paper text.
- **Footer:** 2-column grid, 36px top / 24px bottom padding.
  - Wordmark (17px) and tagline span both columns.
  - Two nav columns: Work/Services/Approach/Skills and About/Insights/Contact/Legal, at 14px `--ink-2`.
  - Email link, studio address and "Introductory call" details below.
- **Focus style (both designs):** `:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }`.

### 5.4 General requirements
- **Tap targets** ≥ 44×44px (the mobile design uses 44px buttons and 48px rows and inputs).
- **Menu accessibility:** close on Esc, on link click and when resizing past `md`; return focus to the menu button; `aria-controls` linking button and panel.
- **Form inputs** stay at **16px** (prevents iOS zoom). Radio "chips" wrap onto multiple lines on narrow screens.
- **Images** use `srcset`/`sizes`; aspect ratios reserved to prevent layout shift.
- **Tables and wide content** scroll inside their own container; the page never scrolls horizontally.
- **Safe areas:** use `env(safe-area-inset-*)` for the sticky header and menu panel on notched phones. The mobile design previews this with a `--safe-top` offset.
- **Landscape phones:** mobile menu must scroll if it doesn't fit.
- **Test widths:** 320, 360, 375, 390, 414, 768, 834, 1024, 1280, 1440, 1920, 2560. Also landscape at 667×375 and 844×390.
- **Test devices/browsers:** iOS Safari, Android Chrome, desktop Chrome, Firefox, Safari, Edge.

---

## 6. Theme (dark/light)

- **Default: Dark** (per design). The toggle is in the header and mobile menu.
- Persist choice in `localStorage` key `mn-theme` (`dark` | `light`). Key name comes from the design.
- On first visit with no saved choice, use **Dark**.
- **No flash:** an inline, blocking script at the top of `<head>` sets `data-theme` on `<html>` before first paint:
  ```html
  <script is:inline>
    (function(){try{var t=localStorage.getItem('mn-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();
  </script>
  ```
- Tokens: `:root[data-theme="dark"] {…}` and `:root[data-theme="light"] {…}`.
- Set `<meta name="color-scheme" content="dark light">` and a `theme-color` meta that updates with the theme.
- Wrap all `localStorage` access in try/catch.

---

## 7. Internationalisation

- **UI strings** (nav, buttons, labels, form messages) live in `src/i18n/ui.ts`, typed so a missing HR key fails the build.
- **Page copy:** take both EN and HR texts directly from the design file, which already contains both.
- **Content collections:** each case study and insight exists as a pair (`en/slug.md`, `hr/slug.md`) linked by a shared `translationKey` field.
- **Language switch:** shows `EN / HR`, links to the equivalent page, and marks the active language with `aria-current`. The design stores `mn-lang`; on the real site the **URL is the source of truth**, so storing the language is optional.
- **Formatting:** dates via `Intl.DateTimeFormat('en-GB' | 'hr-HR')`. Croatian dates in the design use a trailing dot (e.g. "2026.").
- **Croatian typography:** Croatian quotes „…”, as already used in the design.

---

## 8. Content model

`src/content.config.ts`:

```ts
// work
{
  title: string,
  translationKey: string,
  sector: string,             // e.g. "Fintech"
  year: number,
  client?: string,            // shown only with written permission
  engagement?: string,        // "14 weeks, 2026"
  scope?: string,             // "Modernization"
  summary: string,            // card line
  cardMetric?: string,        // "p95 latency 340ms → 48ms. Infrastructure cost down 62%."
  status: 'published' | 'in-progress',   // in-progress shows "[ case study in progress ]"
  featured: boolean,          // appears in home "Selected work"
  order: number,
  cover?: image, coverCaption: string,
  results?: { value: string, label: string }[],
  quote?: { text: string, name: string, role: string },
}
// body sections: Context / The problem / What we removed / What we built

// insights
{
  title: string,
  translationKey: string,
  date: Date,
  category: string,           // Architecture | Product | Delivery
  excerpt: string,
  cover?: image, coverCaption: string,
  draft: boolean,
}
```

**Content from the design to migrate:**
- **Work:** Core banking (Fintech 2026, full case study), Eleven tools replaced by one (Logistics 2025), Nine clicks became two (Healthcare 2025), A monolith, unbundled (Energy 2024).
- **Insights:** Deleting code is a feature (2026/08), The two decisions a user actually makes (2026/06), Fixed price is a design constraint (2026/04).

> ⚠️ **Before launch, verify all client names, metrics, quotes and stats** (Northbank d.d., Ivan Kovač, p95 340ms → 48ms, −62%, 5+ years, 30+ products). If they are design placeholders, replace them with real ones. The site's own FAQ promises client names appear only with written permission.

---

## 9. Contact form

### 9.1 Fields (from design)

| Field | Name | Type | Required |
|---|---|---|---|
| Name | `name` | text, `autocomplete="name"` | yes |
| Email | `email` | email, `autocomplete="email"` | yes |
| Company | `company` | text, `autocomplete="organization"` | no |
| Role | `role` | text | no |
| Timeline | `timeline` | radio chips: `asap`, `1-3m`, `3-6m`, `exploring` | recommended |
| Budget | `budget` | radio chips: `lt15`, `15-40`, `40-100`, `gt100`, `unsure` | recommended |
| Brief | `brief` | textarea | yes |
| Consent | — | Short privacy note with link to Legal (not a checkbox, unless legal review requires one) | — |
| Honeypot | `website` | hidden text input; submission rejected if filled | — |
| Turnstile | `cf-turnstile-response` | widget token | yes |

Radio chips must be real radio inputs (keyboard and screen-reader accessible) styled as chips.

### 9.2 Behaviour
- Works **without JavaScript** as a normal POST, redirecting back to the contact page with a success or error message.
- **With JavaScript:** `fetch` submit, button disabled with a loading state, then an inline success message replacing the form, or an inline error message. Focus moves to the message.
- Client validation uses native constraints plus clear bilingual messages. Server validation is authoritative.
- The form sends the current `locale` so the auto-reply (if enabled) and redirects use the right language.

### 9.3 `functions/api/contact.ts`
1. Accept `POST` only; parse form data or JSON.
2. Reject if the honeypot is filled; enforce max lengths (e.g. name 120, brief 5000).
3. Verify the Turnstile token server-side with the secret key.
4. Validate required fields and email format.
5. Send the notification email to `CONTACT_TO` (e.g. `hello@minimalist.hr`) via the email provider API, with `reply-to` set to the sender.
6. Optional: send a short, on-voice auto-reply to the sender in their language.
7. Return JSON `{ ok: true }` or a redirect for no-JS submissions.
8. **Store nothing.** Do not log message contents.

**Secrets** (Cloudflare environment variables, never committed): `TURNSTILE_SECRET_KEY`, `EMAIL_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`. Public: `PUBLIC_TURNSTILE_SITE_KEY`. Provide `.dev.vars.example`.

---

## 10. SEO, metadata, sharing

- Unique `<title>` and meta description per page and language, written in brand voice.
- Canonical plus `hreflang` alternates on every page.
- Open Graph and Twitter card tags; default OG image (1200×630, integrated mark on ink). Optional per-case-study OG images.
- `@astrojs/sitemap` with i18n alternates; `robots.txt` pointing to the sitemap.
- JSON-LD structured data: `Organization` (name, url, logo, email, address) on home; `Article` on insights; `BreadcrumbList` on case studies and insights.
- Semantic headings: one `h1` per page, logical order.
- RSS feed for insights (optional, cheap with `@astrojs/rss`).
- Preview deployments must send `X-Robots-Tag: noindex`.

---

## 11. Performance, accessibility, security

### 11.1 Performance budget
- Lighthouse (mobile): **Performance ≥ 95**, Accessibility 100, Best Practices 100, SEO 100.
- LCP < 1.8s on mobile 4G; CLS < 0.05; INP < 200ms.
- JS shipped per page < 20 kB gzipped (Turnstile excluded, loaded only on contact).
- One font file preloaded; images AVIF/WebP via `astro:assets` with explicit dimensions.
- Long-cache fingerprinted assets (`/_astro/*`: `max-age=31536000, immutable`).

### 11.2 Accessibility (WCAG 2.2 AA)
- Contrast: body text uses ink/ink-2 only; graphite only for labels at their specified sizes.
- Visible focus style from the designs: `outline: 2px solid var(--ink); outline-offset: 3px`.
- Skip-to-content link.
- Mobile menu (dropdown panel): Esc to close, focus returns to the button, `aria-controls`/`aria-expanded`, and links reachable in order right after the button.
- FAQ built with `<details>/<summary>`, or an accessible disclosure pattern.
- All placeholders and images have meaningful `alt` text (or `alt=""` when decorative).
- Form: labels tied to inputs, errors announced via `aria-live`, `fieldset`/`legend` for chip groups.
- Respect `prefers-reduced-motion`.

### 11.3 Security headers (`public/_headers`)
- `Content-Security-Policy`: self, plus `challenges.cloudflare.com` (Turnstile) and the Cloudflare analytics beacon.
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (add `preload` after confirming all subdomains are HTTPS).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` locking unused features, `X-Frame-Options: DENY`.

---

## 12. Infrastructure: Cloudflare, domain, email

### 12.1 Cloudflare setup
1. Create a Cloudflare account (free plan).
2. **Add site** `minimalist.hr`. Cloudflare scans existing DNS records; review them.
3. Cloudflare gives two nameservers. In the **.hr domain management** (CARNET's domain system or the registrar the domain was registered through), replace the current nameservers with Cloudflare's. Propagation takes minutes to a few hours.
4. Wait for the zone to show **Active**.
5. Create the project (Pages, or Workers with static assets) and **connect the GitLab repository**.
   - Build command: `pnpm build` (or `npm run build`); output directory: `dist`.
   - Production branch: `main`.
6. Add custom domains `minimalist.hr` and `www.minimalist.hr`. Redirect `www` → apex (301) via a redirect rule.
7. SSL/TLS mode: **Full (strict)**; enable **Always Use HTTPS**.
8. Enable **Web Analytics** for the site.
9. Create a **Turnstile** widget for `minimalist.hr` (plus `localhost` and the preview domain for testing); copy the site key and secret.
10. Add environment variables and secrets (section 9.3) for production and preview.

### 12.2 Business email (e.g. `hello@minimalist.hr`)
- Choose a provider: Google Workspace, Microsoft 365 or Zoho Mail.
- In Cloudflare DNS, add the provider's records:
  - **MX** records
  - **SPF** TXT: `v=spf1 include:<provider> include:<email-api-provider> ~all` (one SPF record only; merge includes)
  - **DKIM** for both the mailbox provider and the transactional email API
  - **DMARC** TXT at `_dmarc`: start with `v=DMARC1; p=none; rua=mailto:dmarc@minimalist.hr`, move to `quarantine` after monitoring
- MX/TXT records are DNS-only (grey cloud) by nature; only web records are proxied.
- Send a test from the contact form and confirm it lands in the inbox, not spam.

### 12.3 Rollback
Every deploy is immutable. Roll back from the Cloudflare dashboard to the previous deployment if a release breaks.

---

## 13. Build phases and checklists

### Phase 1: Foundation
- [ ] Init Astro project (TypeScript strict), Prettier, ESLint (astro plugin)
- [ ] Add the three `/design` files; run the extraction script (section 0)
- [ ] Write `CLAUDE.md` with short project rules (brand constraints, no new colours, mobile-first, i18n for every string)
- [ ] `tokens.css` from design (colours both themes, type scale with clamp, spacing, motion)
- [ ] Self-hosted Archivo (latin + latin-ext), preload
- [ ] `BaseLayout` with head, SEO props, no-flash theme script, skip link
- [ ] Header (desktop nav + mobile sticky header with dropdown menu per section 5.3), Footer, Wordmark, ThemeToggle (knob switch), LangSwitch
- [ ] i18n config, `ui.ts`, `routes.ts`, helpers
- [ ] GitLab repo + Cloudflare project connected; preview deploys working
- [ ] Favicon set and default OG image from the integrated mark

**Done when:** an empty EN and HR page deploy to a preview URL, theme and language switch work, and the header is correct from 320px to 2560px.

### Phase 2: Components and pages
- [ ] Shared components (section 4)
- [ ] `ImageFrame` with striped placeholder + caption
- [ ] Home
- [ ] Services, Approach (with pricing + FAQ), Skills, About
- [ ] Content collections + schemas; migrate work and insights from design
- [ ] Work list + case study template (including "in progress" state)
- [ ] Insights list + article layout (respect `showInsights` flag)
- [ ] Legal page structure, 404
- [ ] All pages in HR with translated slugs
- [ ] Motion (reveal/lift/state) + reduced motion

**Done when:** every page matches the mobile design below `md` and the desktop design from `md` up, in both languages and both themes, with no broken layouts at in-between widths (640–960px).

### Phase 3: Functionality and quality
- [ ] Contact form UI (no-JS + JS paths)
- [ ] `functions/api/contact.ts` with Turnstile, validation, email send
- [ ] Local testing with `wrangler` and `.dev.vars`
- [ ] SEO: meta, canonical, hreflang, sitemap, robots, JSON-LD, RSS
- [ ] Security headers, cache headers, noindex on previews
- [ ] Cloudflare Web Analytics
- [ ] Accessibility pass (keyboard-only run, screen reader spot check, axe)
- [ ] Lighthouse mobile ≥ targets on Home, Case study, Contact

### Phase 4: Content and launch
- [ ] Replace placeholder copy, metrics, clients and quotes with verified content
- [ ] Real photography per brand brief (greyscale, 4:5 / 3:2 / 1:1), processed and optimised
- [ ] Legal: privacy policy and company details reviewed (section 14)
- [ ] Business email set up; SPF/DKIM/DMARC verified
- [ ] Cross-device testing (section 5.4 widths and browsers)
- [ ] Nameservers switched to Cloudflare; custom domain + `www` redirect live
- [ ] Final smoke test on production: all routes EN/HR, form sends, 404 works, sitemap reachable
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools

---

## 14. Legal and compliance (Croatia / EU)

*Not legal advice. Have the final texts checked by someone qualified.*

- **Privacy policy** (EN + HR) covering:
  - what the contact form collects and why
  - legal basis
  - processors (Cloudflare, email provider)
  - retention (emails in the inbox)
  - rights and contact for requests
- **Company information,** typically expected under Croatian e-commerce rules: full company name, legal form, registered address, OIB, court register and registration number, share capital for a d.o.o. (with amount paid in), and contact email. Put it in the Legal page and a compact version in the footer.
- **No cookie banner** as long as the site only uses cookieless analytics, Turnstile, self-hosted fonts, and `localStorage` for the theme preference. Re-evaluate if anything else is added (embeds, marketing pixels, chat widgets).
- **Accessibility:** WCAG 2.2 AA (section 11.2) is good practice and aligns with EU accessibility expectations.

---

## 15. Open decisions (answer before or during build)

1. **Email API provider:** Brevo or Resend (confirm EU data region).
2. **Mailbox provider:** Google Workspace, Microsoft 365 or Zoho.
3. **Contact address** shown on site (e.g. `hello@minimalist.hr`).
4. **Hero headline:** both designs rotate four taglines (section 3.5). Keep the rotation, or launch with a single static headline?
5. **Insights at launch:** show with the three articles, or hide until real posts exist?
6. **Which case studies** are real and approved for publication?
7. **Studio address and call details:** the mobile design shows "Hamići 13, 10000 Zagreb" and an "Introductory call" block. Confirm these are real before launch.
8. **Auto-reply** to form senders: yes or no?
9. **Later:** a git-based CMS (e.g. Keystatic) if non-developers need to edit content. Not needed for launch.

---

## 16. Useful commands

```bash
pnpm create astro@latest minimalist     # scaffold (minimal template, TypeScript strict)
pnpm dev                                # local dev
pnpm build && pnpm preview              # production build check
npx wrangler pages dev dist             # run static site + functions locally (if using Pages)
npx @axe-core/cli http://localhost:4321 # accessibility scan
npx lighthouse http://localhost:4321 --preset=desktop
```

Verify current Cloudflare and Astro CLI syntax against their docs at setup time. Both evolve quickly.
