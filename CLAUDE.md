# Minimalist website: project rules

## Sources of truth
- `MINIMALIST-WEBSITE-PLAN.md` is the single source of truth. Read the relevant section before starting a task. If a request conflicts with it, say so.
- The design is the spec. Use `design/*.extracted.html` for exact copy, sizes, spacing and tokens, and the original `design/*.html` bundles (open in a browser) for visual comparison. Ask before inventing sections, components or visual styles.
- Work phase by phase (plan §13). Don't start the next phase's work without being asked.

## Brand hard constraints (plan §3), no exceptions
- **Colour:** only the neutral tokens (`--paper`, `--raise`, `--ink`, `--ink-2`, `--graphite`, `--rule`, `--stripe-a/b`), dark and light. Never add a colour, accent or gradient. `--graphite` is for labels, metadata and captions only, never body copy.
- **Type:** Archivo only, weights 400 and 500 only. Self-hosted woff2 with latin + latin-ext, `font-display: swap`. Never load Google Fonts. Monospace is for metadata and code only.
- **Logo:** header and footer use the wordmark `MINIMALIST` plus a closing square in the same colour (`currentColor`). The integrated mark is only for favicon, app icons and OG image. Never both marks on one surface; never tinted, re-tracked, outlined or stretched.
- **Icons:** inline SVG, 24px box, 1.5px stroke, square caps, `currentColor`.
- **Images:** greyscale, 4:5 / 3:2 / 1:1, no rounded corners, no shadows, treatment applied to the files (not CSS filters). Until real photos exist, use the striped placeholder with its caption.
- **Motion:** Reveal 240ms, Lift 160ms (translate only), State ≤150ms linear; easing `cubic-bezier(.2,0,0,1)`. Everything else is instant. `prefers-reduced-motion: reduce` disables all animation.
- **Voice:** quiet, short, factual. No "passionate", "cutting-edge", "innovative", "solutions-driven". This also applies to meta descriptions, alt text, form messages and 404 copy.

## Responsive (plan §5)
- Mobile-first CSS. **Below `md` (960px) match the mobile design; from `md` up match the desktop design.** 640–960px uses the mobile structure with wider spacing.
- Mobile values are the floor, desktop values the ceiling: shared fluid `clamp()` tokens, no hard-coded one-off sizes.
- Must hold from 320px to 2560px with no horizontal page scroll. Tap targets ≥ 44px, form inputs 16px.

## i18n
- **Every user-facing string exists in both EN and HR**, including aria labels, alt text, titles, meta descriptions and form messages. UI strings go in `src/i18n/ui.ts` (typed, so a missing HR key fails the build); page copy comes from the design file, which has both languages.
- EN at the root, HR under `/hr/` with translated slugs (route map in `src/i18n/routes.ts`). Trailing slashes always. No browser-language redirects.

## Dependencies
- No new dependency without a stated reason (what it does, why plain CSS/TS or Astro built-ins aren't enough). Ask first.
- pnpm only (version pinned in `package.json`). Packages with install scripts must be approved in `pnpm-workspace.yaml` (`allowBuilds`), or CI install fails.

## Workflow
- Work in small steps. After each step run `pnpm run check && pnpm run build`, then commit with a clear message. One logical change per commit.
- Don't push unless asked. `main` deploys to production; other branches deploy previews (`.gitlab-ci.yml`).
- Before changing `.gitlab-ci.yml`, `wrangler.jsonc`, `.gitignore` or `.nvmrc`, explain the problem first.
- CLI tools change: when a command or flag from the plan doesn't match, check `--help` or the current docs and say what differs.

## Secrets
- Never write, ask for or echo Cloudflare API tokens, account IDs or other secrets. They live only in GitLab CI/CD variables and Cloudflare secrets. Local dev secrets go in `.dev.vars` (gitignored); commit only `.dev.vars.example`.

## Commands
```
pnpm dev                 # local dev server
pnpm run check           # astro check (types)
pnpm run build           # static build to dist/
pnpm exec wrangler dev   # serve dist/ on the Workers runtime (http://127.0.0.1:8787)
```
