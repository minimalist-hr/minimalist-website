# Workflow

## Branches

| Branch                      | Purpose                                                          |
| :-------------------------- | :--------------------------------------------------------------- |
| `main`                      | Production. Every merge deploys minimalist.hr                    |
| `staging`                   | Finished work waiting for release; every merge refreshes staging |
| `feat/…`, `fix/…`, `docs/…` | One piece of work, off `staging`                                 |

`main` and `staging` are protected by rulesets: pull requests only, with passing checks. Plain
branch pushes run no workflow.

## Making a change

1. `git switch staging && git pull && git switch -c feat/short-name`
2. Read the relevant wiki page and the design. For brand, layout or copy the design is the spec.
3. Work in small steps; after each, run the checks and commit. One logical change per commit.
4. Test what you changed ([Testing](Testing)).
5. Update the wiki in the same branch if behaviour, configuration, structure or a decision
   changed.
6. Open a pull request into `staging`; usually squash it. Merging it refreshes the staging
   preview (the form renders there but can't send).

## Release

1. Check the staging preview on a phone and a desktop, both languages and themes. Have any
   dashboard changes (secrets, variables, DNS) ready.
2. Open a pull request **`staging` → `main`**. It runs the checks, the build and the `audit`.
   While it's open, each merge into `staging` reruns it.
3. Merge with a **merge commit** (the only method `main` allows), or the branches drift apart.
4. `main` builds, deploys and publishes the wiki.
5. Smoke test: `/` and `/hr/`, the language switch and theme, a case study and an insight,
   `/x/` and `/hr/x/` give the right 404, `/sitemap.xml`, `curl -I https://minimalist.hr/` shows
   the security headers and **no** `X-Robots-Tag`. After Worker or email changes, send one real
   inquiry.

**If the audit fails:** read `playwright-report/` or `.lighthouseci/` in the run's
`audit-reports` artifact, fix
on a branch off `staging`. A Lighthouse `NO_NAVSTART` after three attempts is a CI flake: rerun.

## Roll back

**Fastest:** Cloudflare → Workers & Pages → `minimalist-website` → Deployments → previous
version → Rollback. Assets roll back with it. Then make the repository match, or the next deploy
brings the problem back:

1. On a branch off `main`, `git revert -m 1 <merge sha>`, pull request into `main`.
2. A pull request `main` → `staging`, merged with a merge commit.

Secrets and dashboard settings aren't part of a Worker version; roll those back by hand.

## Hotfix

Branch off `main`, pull request into `main` (it runs the audit, like a release), then a pull
request `main` → `staging`, merged with a merge commit.

## Commits and pull requests

- Commit messages: short, imperative, sentence case, no period; say what changes for the site.
  `Require consent to the privacy policy on the contact form`
- Pull requests: the template asks for the issue, the changes and a short checklist. Add
  screenshots for visual changes, and any dashboard change needed.

## Ask first

- Changing `.github/workflows/`, `wrangler.jsonc`, `.gitignore`, `.nvmrc`: explain the problem.
- A new dependency: what it does and why built-ins aren't enough.
- New sections, components or styles not in the design.
- Brand rules: only through an approved deviation in the [Decision log](Decision-Log).

## The wiki

`docs/wiki/` is the master copy. The `wiki` job copies it to the GitHub wiki after each
production deploy (see [Infrastructure](Infrastructure#github)), so edits in the GitHub UI are
overwritten; only collaborators can edit there anyway.

- One flat folder: GitHub addresses pages by file name, so names must be unique. File names
  become titles (`Getting-Started.md` → "Getting Started"). Add new pages to `Home.md` and
  `_Sidebar.md`.
- Links are the page name without `.md`: `[Testing](Testing#lighthouse)`. They work in the
  wiki, not in the repository's file view.
- Mermaid for diagrams. No secrets, tokens or account IDs.
- One place per fact; link instead of repeating. Describe rules, decisions, setup and gotchas;
  don't copy what the code already says.
- If code and wiki disagree, find out which is wrong and fix it in the same pull request.

By hand, only if the job can't run (Git Bash, from the project root):

```bash
git clone https://github.com/minimalist-hr/minimalist-website.wiki.git ../website.wiki   # once
rsync -a --delete --exclude .git docs/wiki/ ../website.wiki/
cd ../website.wiki && git add -A && git commit -m "Sync wiki" && git push
```
