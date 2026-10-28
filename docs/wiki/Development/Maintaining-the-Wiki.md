# Maintaining this wiki

## Where the master copy lives

**This wiki is the project's single source of truth.** `docs/wiki/` in the repository is the
master copy; the GitLab wiki is a published copy of it. There is no separate plan or README.

- Edit pages in the repository, in the same branch and merge request as the change they
  describe, so code and documentation are reviewed together.
- Don't edit pages in the GitLab wiki UI; the next sync overwrites them.

## How it relates to the other documents

| Document      | Role                                                                              |
| :------------ | :-------------------------------------------------------------------------------- |
| This wiki     | Source of truth: what the site is, how it works, how to work on it, and why       |
| `CLAUDE.md`   | Short rules for AI-assisted work, pointing here; must not contradict the wiki     |
| `design/`     | The visual spec (copy, sizes, spacing)                                            |
| Code comments | The detail behind a specific file; they cite wiki pages as `(wiki: <Page title>)` |

If the code and the wiki disagree, find out which one is wrong and fix it in the same merge
request. A change in behaviour that isn't in the wiki isn't finished.

The original build plan (`MINIMALIST-WEBSITE-PLAN.md`) and `README.md` were removed on
2026-10-28 once their content was here. Both are in the git history.

## Conventions

- **File names** become page titles: `Getting-Started.md` shows as "Getting Started". Use
  Title-Case words joined by hyphens.
- **Folders** become sections (`Architecture/`, `Guides/` …).
- **`home.md`** is the wiki's start page; **`_sidebar.md`** is the custom sidebar. Add every new
  page to both.
- **Links** are root-relative and without `.md`: `[Testing](/Development/Testing)`, with an
  optional anchor: `(/Development/Testing#on-windows)`. GitLab resolves these from the wiki root.
- **Diagrams** use Mermaid code blocks, which GitLab renders.
- **No secrets**, tokens or account IDs, ever.
- **Voice**: short, plain, factual, like the rest of the project.
- Prefer one place per fact and link to it, rather than repeating details across pages.

## Syncing to GitLab

The GitLab wiki is its own Git repository: `<project URL>.wiki.git` (find the clone URL under
Plan → Wiki → Clone repository).

**macOS / Linux / Git Bash:**

```bash
# once
git clone <project URL>.wiki.git ../website.wiki

# each time
rsync -a --delete --exclude .git docs/wiki/ ../website.wiki/
cd ../website.wiki
git add -A
git commit -m "Sync wiki from $(git -C ../website rev-parse --short HEAD)"
git push
```

**Windows PowerShell** (no rsync):

```powershell
robocopy docs\wiki ..\website.wiki /MIR /XD .git
cd ..\website.wiki; git add -A; git commit -m "Sync wiki"; git push
```

Sync after the merge request reaches `main`, so the wiki describes what is live.

### Automating it (optional)

A CI job on `main` could push `docs/wiki/` to the wiki repository with a project access token
that has `write_repository`. That changes `.gitlab-ci.yml` and adds a token, so it needs a
decision first.

## When to update which page

| You changed…                              | Update                                                                                                  |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| A page's sections or routes               | [Pages and content](/Product/Pages-and-Content), maybe [Features](/Product/Features)                    |
| Content schema                            | [Data model](/Data/Data-Model), the relevant guide                                                      |
| Form fields or Worker behaviour           | [Contact form](/How-It-Works/Contact-Form), [Backend architecture](/Architecture/Backend-Architecture)  |
| Tokens, components, motion                | [Design system](/Product/Design-System), [Motion](/How-It-Works/Motion)                                 |
| Config files, variables, secrets          | [Configuration](/Technical-Specification/Configuration), [Infrastructure](/Architecture/Infrastructure) |
| CI                                        | [Infrastructure](/Architecture/Infrastructure#pipeline-gitlab-ciyml), [Workflow](/Development/Workflow) |
| Dependencies                              | [Tech stack](/Technical-Specification/Tech-Stack)                                                       |
| A decision or deviation                   | [Decision log](/Overview/Decision-Log), [Roadmap](/Overview/Roadmap)                                    |
| Something that broke and how you fixed it | [Troubleshooting](/Development/Troubleshooting)                                                         |
