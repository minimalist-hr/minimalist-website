# Release and roll back

## Before releasing

- Everything to release is merged into `staging`.
- The staging preview (GitLab → Operate → Environments → `staging`) looks right on a phone and
  a desktop, in both languages and themes.
- Changes that need dashboard work (secrets, variables, DNS) are ready.

## Release

1. Open a merge request from **`staging` into `main`**.
2. The pipeline runs lint, format check, type checks, the build and the **audit** (axe on every
   page in both themes and layouts, keyboard, motion, reflow, Lighthouse). "Pipelines must
   succeed" blocks the merge until it's green.
3. Merge **without squashing**.
4. The `main` pipeline builds again and runs `wrangler deploy` (resource group `production`, so
   two deploys never overlap). The deployment message is `<short sha> <commit title>`. Then
   `sync_wiki` publishes `docs/wiki/` to the GitLab wiki.
5. Smoke test production:
   - `/` and `/hr/` load; the language switch and theme work;
   - a case study and an insight load;
   - a missing URL returns the right 404 (`/x/` English, `/hr/x/` Croatian);
   - `/sitemap.xml` is reachable;
   - `curl -I https://minimalist.hr/` shows the security headers and **no** `X-Robots-Tag`;
   - after Worker or email changes: send one real inquiry and check both emails arrive.

## If the audit fails

Open the job artifacts: `playwright-report/` for axe and keyboard failures, `.lighthouseci/`
for Lighthouse. Fix on a branch off `staging`; each merge into `staging` reruns the open release
MR. A Lighthouse `NO_NAVSTART` failure after three attempts is a CI flake: rerun the job.

## Roll back

**Fastest:** Cloudflare dashboard → Workers & Pages → `minimalist-website` → Deployments →
pick the previous version → Rollback. The site switches within seconds. Static assets roll back
with the version.

Then make the repository match, or the next deploy brings the problem back:

1. Revert the offending merge on a branch off `main` (`git revert -m 1 <merge sha>`), open an MR
   into `main`, merge it. The pipeline redeploys.
2. Merge `main` back into `staging`.

**Without dashboard access:** do the revert alone; production updates when its pipeline finishes.

Secrets and dashboard settings (DNS, Redirect Rule, Turnstile) aren't part of a Worker version;
roll those back by hand.

## Hotfix

1. Branch off `main`, fix, MR into `main` (the checks run; the audit runs only on MRs from
   `staging`, so run the relevant tests locally).
2. Merge; production deploys.
3. Merge `main` back into `staging`.

## Indexing

Production is indexable only because `ALLOW_INDEXING=true` is set in GitLab. If it's ever
removed, the next deploy adds `X-Robots-Tag: noindex` to every response.
