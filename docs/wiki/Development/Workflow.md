# Workflow

## Branches

| Branch                      | Purpose                                                          |
| :-------------------------- | :--------------------------------------------------------------- |
| `main`                      | Production. Every merge deploys minimalist.hr                    |
| `staging`                   | Finished work waiting for release; every merge refreshes staging |
| `feat/…`, `fix/…`, `docs/…` | One piece of work, off `staging`                                 |

`main` and `staging` are protected: merge requests only, with a passing pipeline. Plain branch
pushes run no pipeline.

## Making a change

1. `git switch staging && git pull && git switch -c feat/short-name`
2. Read the relevant wiki page and the design. For brand, layout or copy the design is the spec.
3. Work in small steps; after each, run the checks and commit. One logical change per commit.
4. Test what you changed ([Testing](/Development/Testing)).
5. Update the wiki in the same branch if behaviour, configuration, structure or a decision
   changed.
6. Open a merge request into `staging`. Merging it refreshes the staging preview (the form
   renders there but can't send).

## Release

1. Check the staging preview on a phone and a desktop, both languages and themes. Have any
   dashboard changes (secrets, variables, DNS) ready.
2. Open a merge request **`staging` → `main`**. It runs the checks, the build and the `audit`.
   While it's open, each merge into `staging` reruns it.
3. Merge **without squashing**, or the branches drift apart.
4. `main` builds, deploys and publishes the wiki.
5. Smoke test: `/` and `/hr/`, the language switch and theme, a case study and an insight,
   `/x/` and `/hr/x/` give the right 404, `/sitemap.xml`, `curl -I https://minimalist.hr/` shows
   the security headers and **no** `X-Robots-Tag`. After Worker or email changes, send one real
   inquiry.

**If the audit fails:** read `playwright-report/` or `.lighthouseci/` in the job artifacts, fix
on a branch off `staging`. A Lighthouse `NO_NAVSTART` after three attempts is a CI flake: rerun.

## Roll back

**Fastest:** Cloudflare → Workers & Pages → `minimalist-website` → Deployments → previous
version → Rollback. Assets roll back with it. Then make the repository match, or the next deploy
brings the problem back:

1. On a branch off `main`, `git revert -m 1 <merge sha>`, merge request into `main`.
2. Merge `main` back into `staging`.

Secrets and dashboard settings aren't part of a Worker version; roll those back by hand.

## Hotfix

Branch off `main`, merge request into `main` (no audit runs, so run the relevant tests
locally), then merge `main` back into `staging`.

## Commits and merge requests

- Commit messages: short, imperative, sentence case, no period; say what changes for the site.
  `Require consent to the privacy policy on the contact form`
- Merge requests: what and why, how you checked it, screenshots for visual changes, and any
  dashboard change needed.

## Ask first

- Changing `.gitlab-ci.yml`, `wrangler.jsonc`, `.gitignore`, `.nvmrc`: explain the problem.
- A new dependency: what it does and why built-ins aren't enough.
- New sections, components or styles not in the design.
- Brand rules: only through an approved deviation in the [Decision log](/Decision-Log).

## The wiki

`docs/wiki/` is the master copy. `sync_wiki` mirrors it to the GitLab wiki after each production
deploy (see [Infrastructure](/How-It-Works/Infrastructure#gitlab)), so edits in the GitLab UI are
overwritten.

- File names become titles (`Getting-Started.md` → "Getting Started"); folders are sections.
  Add new pages to `home.md` and `_sidebar.md`.
- Links are root-relative without `.md`: `[Testing](/Development/Testing#lighthouse)`.
- Mermaid for diagrams. No secrets, tokens or account IDs.
- One place per fact; link instead of repeating. Describe rules, decisions, setup and gotchas;
  don't copy what the code already says.
- If code and wiki disagree, find out which is wrong and fix it in the same merge request.

By hand, only if the job can't run (Git Bash, from the project root):

```bash
git clone https://gitlab.com/minimalist-sds/website.wiki.git ../website.wiki   # once
rsync -a --delete --exclude .git --exclude .gitlab docs/wiki/ ../website.wiki/
cd ../website.wiki && git add -A && git commit -m "Sync wiki" && git push
```
