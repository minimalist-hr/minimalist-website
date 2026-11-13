# Update dependencies

Dependabot opens grouped pull requests into `staging` every Monday ([Infrastructure](Infrastructure#github)).
Merge them once the checks pass; check the site for anything that affects output. What it
ignores is updated by hand, below.

On a branch off `staging`, one dependency (or related group) per commit.

```bash
pnpm outdated
pnpm update <package>             # within the range
pnpm update <package> --latest    # newest, changing the range
pnpm run lint && pnpm run format:check && pnpm run check && pnpm run build
pnpm run test:a11y                # for anything that affects output
```

Commit `package.json` and `pnpm-lock.yaml` together.

## Things that move together

| Update             | Also                                                                             |
| :----------------- | :------------------------------------------------------------------------------- |
| `@playwright/test` | The `audit` image tag in `ci.yml`; locally `pnpm exec playwright install`        |
| `wrangler`         | `pnpm run types:worker`; consider `compatibility_date` in `wrangler.jsonc`       |
| `astro`            | Release notes; check `astro check`, the CSP `<meta>`, image output, i18n routing |
| `@lhci/cli`        | Whether the `lighthouse` override in `pnpm-workspace.yaml` is still needed       |
| `sharp`            | Pinned exactly; rebuild and compare a few images                                 |
| Node               | `.nvmrc` (CI reads it too), `engines` (explain first)                            |
| pnpm               | `corepack use pnpm@<version>` updates `packageManager`                           |

## pnpm safety

- Install scripts run only for packages in `allowBuilds` / `allowScripts`; CI install fails
  until a new one is approved. Ask before approving.
- Minimum release age holds back fresh versions; to take one now, add it to
  `minimumReleaseAgeExclude` with a reason and remove it later.

`pnpm audit`: most advisories hit dev tools that never reach the browser. Judge urgency by what
runs in production: Astro's output, `sharp` at build time, the Worker.

New dependencies aren't part of an update: they need a stated reason and the owner's approval.
