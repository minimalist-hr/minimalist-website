# Minimalist website: project rules

## Sources of truth

- **`docs/wiki/` is the single source of truth** for the project: scope, decisions, architecture, data, configuration, workflow and how things work. Start at `docs/wiki/home.md` and read the relevant pages before starting a task. If a request conflicts with the wiki, say so.
- **Keep the wiki true.** Any change to behaviour, structure, configuration, content model, workflow or a decision updates the matching wiki page in the same branch and merge request (conventions in `docs/wiki/Development/Workflow.md`, section "The wiki"). Record new decisions and approved deviations in `docs/wiki/Decision-Log.md`. The wiki holds rules, decisions, setup and gotchas; don't copy into it what the code already says. Never put secrets, tokens or account IDs in the wiki.
- If the code and the wiki disagree, find out which is wrong and fix it; don't silently follow either.
- Code comments explain the code only: a non-obvious reason or a workaround. No wiki references, dates, approvals or history, and no comment that repeats the code.
- The design is the visual spec. Use `design/*.extracted.html` for exact copy, sizes, spacing and tokens, and the original `design/*.html` bundles (open in a browser) for visual comparison. Ask before inventing sections, components or visual styles.
- The build is finished and launched; work is content and maintenance (wiki: Home). Don't start new features without being asked.

## Brand hard constraints (wiki: Brand and design), no exceptions

- **Colour:** only the neutral tokens (`--paper`, `--raise`, `--ink`, `--ink-2`, `--graphite`, `--rule`, `--stripe-a/b`), dark and light. Never add a colour, accent or gradient. `--graphite` is for labels, metadata and captions only, never body copy. In the light theme it is `#67655E`, darkened from the brand's `#7E7C75` for WCAG AA contrast (approved deviation); don't revert it.
- **Type:** Archivo only, weights 400 and 500 only. Self-hosted woff2 with latin + latin-ext, `font-display: swap`. Never load Google Fonts. Monospace is for metadata and code only.
- **Logo:** header and footer use the wordmark `MINIMALIST` plus a closing square in the same colour (`currentColor`). The integrated mark is only for favicon, app icons and OG image. Never both marks on one surface; never tinted, re-tracked, outlined or stretched.
- **Icons:** inline SVG, 24px box, 1.5px stroke, square caps, `currentColor`.
- **Images:** full colour (approved deviation from the brand's greyscale, 2026-09-22; don't revert it), 4:5 / 3:2 / 1:1, no rounded corners, no shadows, any treatment applied to the files (not CSS filters). A slot without an image shows the striped placeholder with its caption.
- **Motion:** Reveal 240ms, Lift 160ms (translate only), State ≤150ms linear; plus three approved additions: Enter (content fades up 10px once as it scrolls into view), Page (240ms crossfade between pages) and Field (the decorative background canvas); easing `cubic-bezier(.2,0,0,1)`. Everything else is instant. Content on screen at load is never hidden, and nothing is hidden without JavaScript. `prefers-reduced-motion: reduce` disables all animation.
- **Voice:** quiet, short, factual. No "passionate", "cutting-edge", "innovative", "solutions-driven". This also applies to meta descriptions, alt text, form messages and 404 copy.

## Responsive (wiki: Brand and design → Responsive)

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
- `main` is production, `staging` collects finished work; both are protected (no direct pushes). Work on a branch off `staging`; the user opens a merge request into `staging`. Merging into `staging` deploys the one staging preview URL. Releases are a `staging` → `main` merge request; merging it deploys production. Hotfixes may target `main`, then `main` is merged back into `staging`. Plain branch pushes run no pipeline. Don't push unless asked.
- Before changing `.gitlab-ci.yml`, `wrangler.jsonc`, `.gitignore` or `.nvmrc`, explain the problem first.
- CLI tools change: when a command or flag from the wiki doesn't match, check `--help` or the current docs, say what differs, and update the wiki.

## Audits

- `test:a11y` and `test:lighthouse` run in CI on `staging` → `main` merge requests only (job `audit`); the targets are WCAG 2.2 AA with zero axe violations and Lighthouse 95+/100/100/100 (wiki: Testing).
- `test:a11y` also runs `tests/keyboard.spec.ts`: skip link, a visible focus that the sticky header never covers (both Tab directions), mobile menu keys, form error focus, and reflow at 320px / 640px. A screen reader pass stays manual.
- `test:a11y` also runs `tests/motion.spec.ts` (the scroll reveal). axe audits with reduced motion, so it sees every page in its final state.
- CI runs Chromium only. Before larger UI changes, run `pnpm run test:a11y:browsers` locally (adds Firefox and WebKit). WebKit skips links on Tab, like Safari, so link-only keyboard tests skip it.
- The Playwright Docker image tag in `.gitlab-ci.yml` must match the `@playwright/test` version.
- `test:lighthouse` runs `scripts/lighthouse.mjs`, not `lhci autorun`: Lighthouse sometimes fails to record a page load in the CI container (`NO_NAVSTART`), so each run is retried up to three times.
- On Windows, `lhci collect` fails on a Chrome-launcher cleanup bug (EPERM on its temp profile); it works in CI. Locally, run Lighthouse against a Chromium started with `--remote-debugging-port` instead.

## Security (CSP)

- The Content Security Policy is configured in `astro.config.mjs` (`security.csp`) and emitted per page; `public/_headers` adds the other security and cache headers.
- **Never add an `is:inline` script directly.** Put its body in `src/lib/inline-scripts.ts` and render it with `set:html`; the config hashes those strings. Any other inline script is blocked by the CSP. Bundled `<script>` tags in components are hashed by Astro automatically.
- A new third-party script, frame or API origin must be added to the CSP directives explicitly.

## Worker (contact form)

- `src/worker/` handles `POST /api/contact`; every other request goes back to `env.ASSETS` so the 404 pages keep working. The form/Worker contract lives in `src/lib/inquiry.ts`.
- Email goes through the `Mailer` interface in `src/worker/mail/`. To change provider, add one implementation and select it by `MAIL_PROVIDER`; nothing else changes. Never log message contents.
- Production sends through Resend (`MAIL_PROVIDER=resend`, secret `RESEND_API_KEY`, domain `minimalist.hr` verified in the eu-west-1 region). iCloud keeps the inbox and the root MX records; never onboard `minimalist.hr` to Cloudflare Email Routing.

## Secrets

- Never write, ask for or echo Cloudflare API tokens, account IDs or other secrets. They live only in GitLab CI/CD variables and Cloudflare secrets. Local dev secrets go in `.dev.vars` (gitignored); commit only `.dev.vars.example`.

## Commands

```
pnpm dev                 # local dev server (from an agent it runs in the background; one per project)
pnpm astro dev stop      # stop it; `status` and `logs` also exist
pnpm run lint            # eslint (TS, Astro, a11y rules)
pnpm run format          # prettier --write (format:check in CI)
pnpm run check           # astro check (site types) + tsc for the Worker
pnpm run build           # static build to dist/
pnpm run types:worker    # regenerate Worker types after changing wrangler.jsonc
pnpm run test:a11y       # axe + keyboard + reflow on every sitemap page, Chromium (build first)
pnpm run test:a11y:browsers # the same in Chromium, Firefox and WebKit (local)
pnpm run test:lighthouse # Lighthouse CI on home, case study, contact (build first)
pnpm exec wrangler dev   # serve dist/ + the Worker locally (needs .dev.vars, see .dev.vars.example)
```
