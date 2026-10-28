# Project overview

## What it is

The public website of **Minimalist**, a small software development studio in Zagreb
(legal form: _obrt_, owner Filip Mučnjak). It runs at **https://minimalist.hr**.

The site does two jobs:

1. Present the studio: what it builds, how it works, what it has built, and who runs it.
2. Turn interest into a project inquiry, through one contact form that emails the studio.

## At a glance

| Area            | Choice                                                                           |
| :-------------- | :------------------------------------------------------------------------------- |
| Framework       | Astro 7, static output, TypeScript strict                                        |
| Styling         | Plain CSS with custom properties and Astro scoped styles. No Tailwind, no UI kit |
| Browser JS      | Small vanilla TypeScript scripts. No framework runtime                           |
| Content         | Astro content collections (Markdown) plus typed TypeScript data modules          |
| Hosting         | Cloudflare Workers with static assets                                            |
| Server code     | One Worker script that handles `POST /api/contact`                               |
| Spam protection | Cloudflare Turnstile plus a honeypot field                                       |
| Email           | Resend (eu-west-1) for sending; iCloud+ custom domain for the inbox              |
| Analytics       | Cloudflare Web Analytics, cookieless, injected at the edge                       |
| CI/CD           | GitLab CI, deploying with Wrangler                                               |
| Languages       | English (default, at `/`) and Croatian (at `/hr/`, translated slugs)             |
| Themes          | Dark (default) and light                                                         |
| Package manager | pnpm, Node 24                                                                    |

## Status

| Date       | Milestone                                                                       |
| :--------- | :------------------------------------------------------------------------------ |
| 2026-09-17 | Project scaffolded, CI/CD live                                                  |
| 2026-09-18 | Public launch on minimalist.hr, indexing on, sitemap submitted                  |
| 2026-09-25 | CI moved to the feature → `staging` → `main` flow with one staging preview      |
| 2026-09-26 | Real case study, consent checkbox, legal texts final, all open questions closed |

The project is finished as a build. Ongoing work is content (case studies and insights as
they exist) and maintenance (dependencies, small fixes). See [Roadmap](/Overview/Roadmap).

## People and roles

| Role                    | Who                                                           |
| :---------------------- | :------------------------------------------------------------ |
| Owner, approver, editor | Filip Mučnjak                                                 |
| Merges to `main`        | Maintainers of the GitLab project (no direct pushes)          |
| Client content approval | Each client approves their name, figures and quote in writing |

## Where things live

| Thing                              | Location                                                                      |
| :--------------------------------- | :---------------------------------------------------------------------------- |
| Source code                        | GitLab repository (this project)                                              |
| Documentation (source of truth)    | `docs/wiki/` in the repository, published to the GitLab wiki                  |
| Project rules for AI-assisted work | `CLAUDE.md`                                                                   |
| Designs (desktop, mobile, brand)   | `design/*.html` (open in a browser), `design/*.extracted.html` (read as text) |
| Inbox (`hello@minimalist.hr`)      | iCloud+                                                                       |

## Links

| What                    | Link                                                                                                                            |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| Production              | [minimalist.hr](https://minimalist.hr)                                                                                          |
| Staging preview         | [staging-minimalist-website.minimalist-1a8.workers.dev](https://staging-minimalist-website.minimalist-1a8.workers.dev/)         |
| Cloudflare              | [dash.cloudflare.com](https://dash.cloudflare.com/): pick the account, then `minimalist.hr` (Worker, DNS, Turnstile, analytics) |
| Resend (sending domain) | [resend.com/domains](https://resend.com/domains/76a5d2a8-84d9-4664-b5f3-69de41d35afd)                                           |
| Google Search Console   | [minimalist.hr property](https://search.google.com/search-console?resource_id=sc-domain%3Aminimalist.hr)                        |
| Bing Webmaster Tools    | [minimalist.hr sitemaps](https://www.bing.com/webmasters/sitemaps?siteUrl=https://minimalist.hr/)                               |
| Domain registry (.hr)   | [CARNET domains](https://domene.hr)                                                                                             |

The Cloudflare link deliberately stops at the dashboard root: deep links contain the account
ID, which stays out of the repository.

## Related

- [Scope](/Overview/Scope): what is and isn't part of the site
- [System architecture](/Architecture/System-Architecture): how it fits together
- [Getting started](/Development/Getting-Started): run it locally
