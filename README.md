# Minimalist website

The studio website at [minimalist.hr](https://minimalist.hr), in English and Croatian.

Astro (static) with plain CSS, served by a Cloudflare Worker with static assets. The Worker
also handles the contact form (Turnstile, then email through Resend). GitLab CI checks, builds
and deploys every push: `main` to production, other branches to preview URLs.

- `MINIMALIST-WEBSITE-PLAN.md`: the build plan; section 17 records how the launched site
  differs from it.
- `CLAUDE.md`: project rules (brand constraints, responsive, i18n, workflow).
- `design/`: the designs this site implements.

## Commands

Node 24 (`.nvmrc`) and pnpm (`corepack enable`).

| Command                       | Action                                                                                       |
| :---------------------------- | :------------------------------------------------------------------------------------------- |
| `pnpm install`                | Install dependencies                                                                         |
| `pnpm dev`                    | Local dev server                                                                             |
| `pnpm run lint`               | ESLint                                                                                       |
| `pnpm run format`             | Prettier (CI runs `format:check`)                                                            |
| `pnpm run check`              | Type checks (site and Worker)                                                                |
| `pnpm run build`              | Static build to `dist/`                                                                      |
| `pnpm exec wrangler dev`      | Built site and Worker on the Workers runtime (copy `.dev.vars.example` to `.dev.vars` first) |
| `pnpm run test:a11y`          | Accessibility, keyboard and reflow checks, Chromium (build first)                            |
| `pnpm run test:a11y:browsers` | The same in Chromium, Firefox and WebKit                                                     |
| `pnpm run test:lighthouse`    | Lighthouse CI (build first)                                                                  |

## Content

Case studies and insights are Markdown files in `src/content/work/` and `src/content/insights/`,
one per language (`en/`, `hr/`), paired by `translationKey`. A case study with
`status: in-progress` shows only its card.
