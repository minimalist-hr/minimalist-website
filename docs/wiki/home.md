# Minimalist website

The studio website at [minimalist.hr](https://minimalist.hr), in English and Croatian, dark and light.

Astro builds a static site. A Cloudflare Worker serves it and handles the contact form, which
is checked by Turnstile and emailed through Resend. GitLab CI checks, builds and deploys every
change. There is no database, no CMS and no cookies.

**Status:** live since 2026-09-18. Every post-launch question was closed on 2026-09-26. The
site is in maintenance: new case studies and insights get added as they exist.

## Start here

| If you want to…                 | Read                                                                                   |
| :------------------------------ | :------------------------------------------------------------------------------------- |
| Understand what the project is  | [Project overview](/Overview/Project-Overview)                                         |
| Run it on your machine          | [Getting started](/Development/Getting-Started)                                        |
| See how the pieces fit together | [System architecture](/Architecture/System-Architecture)                               |
| Ship a change                   | [Workflow](/Development/Workflow)                                                      |
| Add a case study or an article  | [Add a case study](/Guides/Add-a-Case-Study), [Add an insight](/Guides/Add-an-Insight) |
| Fix something that broke        | [Troubleshooting](/Development/Troubleshooting)                                        |
| Look up a term                  | [Glossary](/Overview/Glossary)                                                         |

## Sections

- **Overview:** [Project overview](/Overview/Project-Overview), [Scope](/Overview/Scope),
  [Glossary](/Overview/Glossary), [Roadmap](/Overview/Roadmap), [Decision log](/Overview/Decision-Log)
- **Product:** [Features](/Product/Features), [Pages and content](/Product/Pages-and-Content),
  [Design system](/Product/Design-System)
- **Architecture:** [System](/Architecture/System-Architecture),
  [Frontend](/Architecture/Frontend-Architecture), [Backend (Worker)](/Architecture/Backend-Architecture),
  [Infrastructure](/Architecture/Infrastructure), [Security](/Architecture/Security)
- **Data:** [Data model](/Data/Data-Model), [Privacy and data handling](/Data/Privacy-and-Data-Handling)
- **Technical specification:** [Tech stack](/Technical-Specification/Tech-Stack),
  [Configuration](/Technical-Specification/Configuration),
  [Internationalisation](/Technical-Specification/Internationalisation),
  [Responsive layout](/Technical-Specification/Responsive-Layout),
  [SEO and metadata](/Technical-Specification/SEO-and-Metadata),
  [Accessibility](/Technical-Specification/Accessibility),
  [Performance](/Technical-Specification/Performance)
- **How it works:** [Request lifecycle](/How-It-Works/Request-Lifecycle),
  [Contact form](/How-It-Works/Contact-Form), [Routing, languages and 404](/How-It-Works/Routing-Languages-and-404),
  [Theme](/How-It-Works/Theme), [Motion](/How-It-Works/Motion),
  [Background field](/How-It-Works/Background-Field)
- **Development:** [Getting started](/Development/Getting-Started), [Workflow](/Development/Workflow),
  [Coding conventions](/Development/Coding-Conventions), [Testing](/Development/Testing),
  [Troubleshooting](/Development/Troubleshooting), [Maintaining this wiki](/Development/Maintaining-the-Wiki)
- **Guides:** [Add a case study](/Guides/Add-a-Case-Study), [Add an insight](/Guides/Add-an-Insight),
  [Add or replace an image](/Guides/Add-or-Replace-an-Image), [Add a page](/Guides/Add-a-Page),
  [Change the email provider](/Guides/Change-the-Email-Provider),
  [Release and roll back](/Guides/Release-and-Roll-Back), [Update dependencies](/Guides/Update-Dependencies)

## About this wiki

**This wiki is the project's single source of truth.** The master copy lives in the repository
under `docs/wiki/`. Edit it there, in the same merge request as the code it describes, then sync
it to the GitLab wiki. Pages edited only in the GitLab UI are overwritten on the next sync. See
[Maintaining this wiki](/Development/Maintaining-the-Wiki).

Other documents in the repository:

- `CLAUDE.md`: short project rules for AI-assisted work (brand constraints, workflow, i18n).
- `design/`: the desktop, mobile and brand-identity designs the site implements. See
  [Design system → Design files](/Product/Design-System#design-files).
