# Performance

## Budget

| Metric                                        | Target                              |
| :-------------------------------------------- | :---------------------------------- |
| Lighthouse Performance (mobile)               | ≥ 95                                |
| Lighthouse Accessibility, Best Practices, SEO | 100                                 |
| LCP on mobile 4G                              | < 1.8s                              |
| CLS                                           | < 0.05                              |
| INP                                           | < 200ms                             |
| JavaScript per page                           | < 20 kB gzipped, Turnstile excluded |

Lighthouse checks home, the Lift-Mučnjak case study and contact (median of three runs) in the
release MR. Configuration: `lighthouserc.cjs`.

## How the site meets it

**HTML and CSS first.** Every page is static HTML. No framework runtime. Scripts are small
islands, bundled and fingerprinted by Astro.

**Fonts.** One variable woff2 per subset (latin, latin-ext), 400–500 in one file,
`font-display: swap`. The latin file is preloaded in `BaseLayout`. Croatian diacritics load the
latin-ext file only when the page uses them.

**Images.** `astro:assets` crops each image to its slot's ratio and emits widths 480, 800,
1200 and 1600 with `sizes` from the caller. Below-the-fold images are lazy; one per page may be
`priority` (eager). Aspect ratios are reserved, so images never shift the layout. Screenshots
are PNG sources so text stays sharp; Astro encodes the served sizes.

**Caching** (`public/_headers`):

| Path                        | Cache-Control                                                                  |
| :-------------------------- | :----------------------------------------------------------------------------- |
| `/_astro/*` (fingerprinted) | `public, max-age=31536000, immutable`                                          |
| `/fonts/*`                  | `public, max-age=2592000` (a month, so a replaced font still reaches visitors) |
| HTML                        | Cloudflare defaults                                                            |

**Third parties.** None on load except the Web Analytics beacon (injected by Cloudflare).
Turnstile loads only on the contact page, with `appearance: 'interaction-only'`. Lighthouse
blocks it, because its challenge never settles in headless CI and it measures third-party code.

**Motion.** Reveal states animate `opacity`, `translate` and a registered custom property;
nothing animates layout. Nothing on screen at load waits for a script, so motion never delays LCP.

**Background field.**

- Canvas 2D, a few hundred stroked rectangles per frame, batched into one path per depth and
  fade step.
- Device pixel ratio capped at 1.75.
- The loop stops when the tab is hidden or the canvas is off screen.
- Shallower tree on phones (one level less).
- Reduced motion draws one still frame and stops.

**Worker.** Static files are served without running the Worker. Only `POST /api/contact` and
missing URLs reach it.

## Checking performance

- Release MR: the `audit` job runs Lighthouse; reports are in the job artifacts (`.lighthouseci/`).
- Locally: build, then `pnpm run test:lighthouse` (see [Testing](/Development/Testing) for the
  Windows workaround).
- Field data: Cloudflare → Web Analytics → Core Web Vitals.
- Bundle size: `pnpm run build` and look at `dist/_astro/*.js`.

## When adding things

- New script: keep it an island on the pages that need it.
- New image: add it through the registry and `ImageFrame`; never a raw `<img>` from `public/`.
- New font weight or family: not allowed by the brand.
- New third-party resource: needs a decision, a CSP entry, and a Lighthouse run.
