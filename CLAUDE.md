# Minimalist website: project rules

## Sources of truth

- `MINIMALIST-WEBSITE-PLAN.md` is the single source of truth. Read the relevant section before starting a task. If a request conflicts with it, say so.
- The design is the spec. Use `design/*.extracted.html` for exact copy, sizes, spacing and tokens, and the original `design/*.html` bundles (open in a browser) for visual comparison. Ask before inventing sections, components or visual styles.
- Work phase by phase (plan §13). Don't start the next phase's work without being asked.

## Brand hard constraints (plan §3), no exceptions

- **Colour:** only the neutral tokens (`--paper`, `--raise`, `--ink`, `--ink-2`, `--graphite`, `--rule`, `--stripe-a/b`), dark and light. Never add a colour, accent or gradient. `--graphite` is for labels, metadata and captions only, never body copy. In the light theme it is `#67655E`, darkened from the brand's `#7E7C75` for WCAG AA contrast (approved deviation); don't revert it.
- **Type:** Archivo only, weights 400 and 500 only. Self-hosted woff2 with latin + latin-ext, `font-display: swap`. Never load Google Fonts. Monospace is for metadata and code only.
- **Logo:** header and footer use the wordmark `MINIMALIST` plus a closing square in the same colour (`currentColor`). The integrated mark is only for favicon, app icons and OG image. Never both marks on one surface; never tinted, re-tracked, outlined or stretched.
- **Icons:** inline SVG, 24px box, 1.5px stroke, square caps, `currentColor`.
- **Images:** greyscale, 4:5 / 3:2 / 1:1, no rounded corners, no shadows, treatment applied to the files (not CSS filters). Until real photos exist, use the striped placeholder with its caption.
- **Motion:** Reveal 240ms, Lift 160ms (translate only), State ≤150ms linear; easing `cubic-bezier(.2,0,0,1)`. Everything else is instant. `prefers-reduced-motion: reduce` disables all animation.
- **Voice:** quiet, short, factual. No "passionate", "cutting-edge", "innovative", "solutions-driven". This also applies to meta descriptions, alt text, form messages and 404 copy.

## Responsive (plan §5)

- Mobile-first CSS. **Below `md` (960px) match the mobile design; from `md` up match the desktop design.** 640–960px uses the mobile structure with wider spacing.
- **Never style a child component's root element with a scoped class passed from the parent** — Astro scoped CSS does not apply there and the rules are silently dropped. Give the component a prop, or wrap it in an element the parent owns.
- A `border` on `.container` runs through its padding and touches the screen edge on phones. For a rule that ends with the text, use the `.rule-top` / `.rule-bottom` utilities.
- Mobile values are the floor, desktop values the ceiling: shared fluid `clamp()` tokens, no hard-coded one-off sizes.
- Must hold from 320px to 2560px with no horizontal page scroll. Tap targets ≥ 44px, form inputs 16px.

## i18n

- **Every user-facing string exists in both EN and HR**, including aria labels, alt text, titles, meta descriptions and form messages. UI strings go in `src/i18n/ui.ts` (typed, so a missing HR key fails the build); page copy comes from the design file, which has both languages.
- EN at the root, HR under `/hr/` with translated slugs (route map in `src/i18n/routes.ts`). Trailing slashes always. No browser-language redirects.

## Dependencies

- No new dependency without a stated reason (what it does, why plain CSS/TS or Astro built-ins aren't enough). Ask first.
- pnpm only (version pinned in `package.json`). Packages with install scripts must be approved in `pnpm-workspace.yaml` (`allowBuilds`), or CI install fails.

## Workflow

- Work in small steps. After each step run `pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build`, then commit with a clear message. One logical change per commit.
- `main` is protected (no direct pushes) and deploys to production. Work on a branch; a pushed branch deploys a preview URL, then the user opens a merge request. Don't push unless asked.
- Before changing `.gitlab-ci.yml`, `wrangler.jsonc`, `.gitignore` or `.nvmrc`, explain the problem first.
- CLI tools change: when a command or flag from the plan doesn't match, check `--help` or the current docs and say what differs.

## Audits

- `test:a11y` and `test:lighthouse` run in CI on merge requests only (job `audit`); the targets are WCAG 2.2 AA with zero axe violations and Lighthouse 95+/100/100/100 (plan §11.1).
- `test:a11y` also runs `tests/keyboard.spec.ts`: skip link, a visible focus that the sticky header never covers (both Tab directions), mobile menu keys, form error focus, and reflow at 320px / 640px. A screen reader pass stays manual.
- The Playwright Docker image tag in `.gitlab-ci.yml` must match the `@playwright/test` version.
- On Windows, `lhci autorun` fails on a Chrome-launcher cleanup bug (EPERM on its temp profile); it works in CI. Locally, run Lighthouse against a Chromium started with `--remote-debugging-port` instead.

## Security (CSP)

- The Content Security Policy is configured in `astro.config.mjs` (`security.csp`) and emitted per page; `public/_headers` adds the other security and cache headers.
- **Never add an `is:inline` script directly.** Put its body in `src/lib/inline-scripts.ts` and render it with `set:html`; the config hashes those strings. Any other inline script is blocked by the CSP. Bundled `<script>` tags in components are hashed by Astro automatically.
- A new third-party script, frame or API origin must be added to the CSP directives explicitly.

## Worker (contact form)

- `src/worker/` handles `POST /api/contact`; every other request goes back to `env.ASSETS` so the 404 pages keep working. The form/Worker contract lives in `src/lib/inquiry.ts`.
- Email goes through the `Mailer` interface in `src/worker/mail/`. To change provider, add one implementation and select it by `MAIL_PROVIDER`; nothing else changes. Never log message contents.
- Production sends through Resend (`MAIL_PROVIDER=resend`, secret `RESEND_API_KEY`, domain `minimalist.hr` verified in the eu-west-1 region). iCloud keeps the inbox and the root MX records; never onboard `minimalist.hr` to Cloudflare Email Routing. The Cloudflare `send_email` binding stays as a fallback (needs Workers Paid).

## Secrets

- Never write, ask for or echo Cloudflare API tokens, account IDs or other secrets. They live only in GitLab CI/CD variables and Cloudflare secrets. Local dev secrets go in `.dev.vars` (gitignored); commit only `.dev.vars.example`.

## Commands

```
pnpm dev                 # local dev server
pnpm run lint            # eslint (TS, Astro, a11y rules)
pnpm run format          # prettier --write (format:check in CI)
pnpm run check           # astro check (site types) + tsc for the Worker
pnpm run build           # static build to dist/
pnpm run types:worker    # regenerate Worker types after changing wrangler.jsonc
pnpm run test:a11y       # axe on every sitemap page, both themes and layouts (build first)
pnpm run test:lighthouse # Lighthouse CI on home, an article, contact (build first)
pnpm exec wrangler dev   # serve dist/ + the Worker locally (needs .dev.vars, see .dev.vars.example)
```
