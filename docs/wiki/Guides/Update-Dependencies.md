# Update dependencies

Update on a branch off `staging`, one dependency (or one related group) per commit.

## See what's outdated

```bash
pnpm outdated
```

## Update

```bash
pnpm update <package>            # within the range in package.json
pnpm update <package> --latest   # to the newest version, changing the range
```

Then:

```bash
pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build
pnpm run test:a11y               # for anything that affects output
```

Commit `package.json` and `pnpm-lock.yaml` together.

## Things that move together

| If you update…     | Also                                                                                                                                                                                                        |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@playwright/test` | The `audit` image in `.gitlab-ci.yml` (`mcr.microsoft.com/playwright:v<same>-noble`); locally `pnpm exec playwright install`                                                                                |
| `wrangler`         | `pnpm run types:worker` to regenerate `worker-configuration.d.ts`; consider bumping `compatibility_date` in `wrangler.jsonc` (explain the change in the MR)                                                 |
| `astro`            | Read the release notes; check `astro check`, the CSP output (`<meta>` in a built page), image output and i18n routing. `z` must come from `astro/zod` (the `astro:content` export is going away in Astro 8) |
| `@lhci/cli`        | Check whether the `lighthouse` override in `pnpm-workspace.yaml` is still needed                                                                                                                            |
| `sharp`            | It's pinned exactly; rebuild and compare a few images                                                                                                                                                       |
| Node (`.nvmrc`)    | The CI image `node:24-slim` in `.gitlab-ci.yml` and `engines` in `package.json` (explain the change first)                                                                                                  |
| pnpm               | `corepack use pnpm@<version>` updates `packageManager`; commit it                                                                                                                                           |

## pnpm safety settings

- **Install scripts** only run for packages in `allowBuilds` (`pnpm-workspace.yaml`) and
  `allowScripts` (`package.json`). If a new or updated package needs one, CI install fails until
  it's approved there. Ask before approving.
- **Minimum release age:** pnpm holds back versions published very recently. If you need one
  right away, add the exact version to `minimumReleaseAgeExclude` with a reason, and remove it
  later.

## New dependencies

Not part of a routine update. Each needs a stated reason (what it does, why CSS, TypeScript or
Astro built-ins aren't enough) and the owner's approval. Then add it to
[Tech stack](/Technical-Specification/Tech-Stack).

## Security advisories

```bash
pnpm audit
```

Most advisories hit dev tools that never reach the browser (the site ships static HTML and its
own scripts). Fix them anyway, but judge urgency by what actually runs in production: `astro`'s
output, `sharp` at build time, and the Worker.
