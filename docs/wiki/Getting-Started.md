# Getting started

## Setup

Node 24 (`.nvmrc`), pnpm through Corepack (version pinned in `package.json`), Git. No
Cloudflare account, key or secret is needed to develop: local runs use Turnstile's test keys and
a mailer that only logs.

```bash
git clone https://github.com/minimalist-hr/minimalist-website.git
cd minimalist-website
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:4321 (Croatian at `/hr/`). `pnpm dev` has no Worker, so the form can't
send. Only one dev server runs per project; a second `pnpm dev` stops with "Another astro dev
server is already running". Started by an AI agent, it runs in the background.

**Production setup locally** (headers, 404s, the form):

```bash
cp .dev.vars.example .dev.vars
pnpm run build
pnpm exec wrangler dev            # http://localhost:8787; rebuild after each change
```

## Commands

```bash
pnpm dev                      # dev server, :4321
pnpm astro dev status|stop|logs
pnpm run build                # static build to dist/
pnpm run preview              # serve dist/ without the Worker
pnpm exec wrangler dev        # dist/ + Worker, :8787 (needs .dev.vars)
pnpm run lint                 # ESLint
pnpm run format               # Prettier --write (CI runs format:check)
pnpm run check                # astro check + Worker tsc
pnpm run types:worker         # after editing wrangler.jsonc
pnpm run test:a11y            # Chromium audits (build first)
pnpm run test:a11y:browsers   # + Firefox, WebKit
pnpm run test:lighthouse      # Lighthouse (build first; see Testing on Windows)
```

Before every commit:

```bash
pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build
```

## Where to change what

| Want to change…                       | Look in                                              |
| :------------------------------------ | :--------------------------------------------------- |
| A page's headings or text             | `copy` at the top of `src/views/<Page>View.astro`    |
| Services, steps, skills, FAQ, figures | `src/data/*.ts`                                      |
| A case study or article               | `src/content/{work,insights}/{en,hr}/*.md`           |
| Nav, buttons, form messages, emails   | `src/i18n/ui.ts`                                     |
| Company details, email, Insights flag | `src/site.config.ts`                                 |
| Colours, sizes, spacing, timings      | `src/styles/tokens.css`                              |
| A component's look                    | The `<style>` block in `src/components/<Name>.astro` |
| The form handler                      | `src/worker/`                                        |
| What the design says                  | `design/*.extracted.html`; the `.html` in a browser  |
