# Tech stack

Versions are the ranges in `package.json` at the time of writing; `pnpm-lock.yaml` has the
exact ones.

## Runtime and build

| Tool       | Version                                           | Purpose                                                                       |
| :--------- | :------------------------------------------------ | :---------------------------------------------------------------------------- |
| Node.js    | 24 (`.nvmrc`; `engines` ≥ 22.12.0)                | Build and tooling                                                             |
| pnpm       | 12.4.2 (pinned in `packageManager`, via Corepack) | Package manager                                                               |
| Astro      | ^7.3.3                                            | Static site generator, content collections, i18n routing, image pipeline, CSP |
| sharp      | 0.35.4                                            | Image encoding for `astro:assets`                                             |
| TypeScript | ^6.0.3                                            | Strict types for the site and the Worker                                      |

## Hosting and services

| Service                             | Purpose                                         |
| :---------------------------------- | :---------------------------------------------- |
| Cloudflare Workers + static assets  | Hosting and the contact Worker                  |
| Cloudflare DNS, Redirect Rules, SSL | Domain, `www` → apex, HTTPS                     |
| Cloudflare Turnstile                | Bot check on the form                           |
| Cloudflare Web Analytics            | Cookieless analytics                            |
| Resend                              | Sending email from the Worker                   |
| iCloud+ Custom Email Domain         | Inbox                                           |
| GitLab.com                          | Repository, CI/CD, wiki                         |
| Wrangler ^4.132.0                   | Local Workers runtime, deploys, type generation |

## Quality tooling

| Tool                   | Version  | Purpose                                                                                                                                                    |
| :--------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ESLint                 | ^10.10.0 | Linting, with `@eslint/js`, `typescript-eslint` (strict + stylistic), `eslint-plugin-astro` (recommended + jsx-a11y strict via `eslint-plugin-jsx-a11y-x`) |
| Prettier               | ^3.9.7   | Formatting, with `prettier-plugin-astro`                                                                                                                   |
| `@astrojs/check`       | ^0.9.10  | Type checks for `.astro` files                                                                                                                             |
| Playwright             | ^1.63.0  | Browser tests (accessibility, keyboard, motion, reflow)                                                                                                    |
| `@axe-core/playwright` | ^4.13.0  | WCAG rules engine                                                                                                                                          |
| `@lhci/cli`            | ^0.15.1  | Lighthouse CI; Lighthouse forced to 13.4.1 through a pnpm override                                                                                         |
| `@types/node`          | ^24      | Node types for config and scripts                                                                                                                          |

## Browser platform features used

| Feature                                              | Used for                                            | Fallback                      |
| :--------------------------------------------------- | :-------------------------------------------------- | :---------------------------- |
| CSS custom properties, `clamp()`, cascade layers     | Tokens, fluid type, style order                     | — (baseline)                  |
| `@property`                                          | Animating the `--rule-draw` length for border rules | Rule appears without drawing  |
| Cross-document view transitions (`@view-transition`) | Page crossfade                                      | Instant page switch (Firefox) |
| `IntersectionObserver`                               | Scroll reveal, pausing the background field         | Nothing is held back          |
| Canvas 2D                                            | Background field                                    | No canvas; nothing lost       |
| `env(safe-area-inset-*)`                             | Notched phones                                      | Normal gutters                |

## Deliberately not used

| Not used                                     | Instead                                                        |
| :------------------------------------------- | :------------------------------------------------------------- |
| React, Vue, Svelte or any UI framework       | Astro components, vanilla TypeScript                           |
| Tailwind or a UI kit                         | Plain CSS with tokens                                          |
| `@astrojs/sitemap`                           | Custom `src/lib/sitemap.ts` (translated slugs)                 |
| `@astrojs/rss`                               | Not needed for now                                             |
| MDX                                          | Plain Markdown is enough for the content                       |
| Google Fonts                                 | Self-hosted woff2                                              |
| A CMS                                        | Markdown files in the repo                                     |
| Cloudflare Pages, Cloudflare Git integration | Workers with static assets, GitLab CI                          |
| Cloudflare Email Sending / Email Routing     | Resend; iCloud keeps the MX                                    |
| Unit test framework                          | Logic is small; behaviour is tested end to end with Playwright |

## Adding a dependency

Ask first, and state what it does and why plain CSS, TypeScript or Astro built-ins aren't
enough. If it has an install script, add it to `allowBuilds` in `pnpm-workspace.yaml`, or CI
install fails. See [Update dependencies](/Guides/Update-Dependencies).
