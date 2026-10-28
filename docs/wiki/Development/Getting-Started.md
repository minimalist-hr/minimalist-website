# Getting started

## Prerequisites

| Tool               | Version           | Notes                                                                    |
| :----------------- | :---------------- | :----------------------------------------------------------------------- |
| Node.js            | 24 (see `.nvmrc`) | `nvm use` or `fnm use` picks it up                                       |
| pnpm               | 12.4.2            | Comes from `packageManager` through Corepack: run `corepack enable` once |
| Git                | any recent        | The repo normalises line endings to LF (`.gitattributes`)                |
| VS Code (optional) | —                 | Accept the recommended extensions: Astro, ESLint, Prettier, EditorConfig |

You don't need a Cloudflare account, Resend key or any secret to develop. Local runs use
Cloudflare's Turnstile test keys and a mailer that only logs.

## First run

```bash
git clone <repository URL>
cd website
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:4321. English is at `/`, Croatian at `/hr/`. Edits reload instantly.

`pnpm dev` doesn't run the Worker, so the contact form can't send there. For that, see below.

## Run the production setup locally

The built site plus the Worker on the real Workers runtime, with production's headers, 404
handling and the form:

```bash
cp .dev.vars.example .dev.vars    # Turnstile test secret, MAIL_PROVIDER=console
pnpm run build
pnpm exec wrangler dev
```

Open http://localhost:8787. Sending the form prints `[mail:console] would send to …` in the
terminal. Rebuild after each change; `wrangler dev` serves `dist/` as it is.

## Checks before every commit

```bash
pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build
```

The same checks run in the merge request pipeline. `pnpm run format` fixes formatting.

## Browser tests (optional)

```bash
pnpm exec playwright install chromium          # once
pnpm run build
pnpm run test:a11y                             # axe, keyboard, motion, reflow
```

For Firefox and WebKit too: `pnpm exec playwright install firefox webkit` once, then
`pnpm run test:a11y:browsers`. See [Testing](/Development/Testing).

## Find your way around

| Want to change…                                   | Look in                                                                                                                |
| :------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| A page's headings or text                         | The `copy` object at the top of `src/views/<Page>View.astro`                                                           |
| Services, steps, skills, FAQ, figures             | `src/data/*.ts`                                                                                                        |
| A case study or article                           | `src/content/{work,insights}/{en,hr}/*.md`                                                                             |
| Navigation labels, buttons, form messages, emails | `src/i18n/ui.ts`                                                                                                       |
| Company details, email address, Insights flag     | `src/site.config.ts`                                                                                                   |
| Colours, sizes, spacing, motion timings           | `src/styles/tokens.css`                                                                                                |
| A component's look                                | The `<style>` block in `src/components/<Name>.astro`                                                                   |
| The contact form handler                          | `src/worker/`                                                                                                          |
| What the design says                              | `design/minimalist-website-{desktop,mobile}-design.extracted.html`; open the `.html` versions in a browser to see them |

Read next: [Workflow](/Development/Workflow), [Coding conventions](/Development/Coding-Conventions),
[Frontend architecture](/Architecture/Frontend-Architecture).

## Useful commands

```bash
pnpm dev                      # dev server, http://localhost:4321
pnpm run build                # static build to dist/
pnpm run preview              # serve dist/ without the Worker
pnpm exec wrangler dev        # dist/ + Worker, http://localhost:8787 (needs .dev.vars)
pnpm run lint                 # ESLint
pnpm run format               # Prettier --write
pnpm run check                # astro check + Worker tsc
pnpm run types:worker         # regenerate Worker types after editing wrangler.jsonc
pnpm run test:a11y            # Chromium audits (build first)
pnpm run test:a11y:browsers   # + Firefox, WebKit
pnpm run test:lighthouse      # Lighthouse (build first; see Testing for Windows)
```
