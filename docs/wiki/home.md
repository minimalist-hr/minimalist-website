# Minimalist website

The website of **Minimalist**, a small software studio in Zagreb, at
[minimalist.hr](https://minimalist.hr). English and Croatian, dark and light.

Astro builds a static site. A Cloudflare Worker serves it and handles the contact form
(Turnstile, then email through Resend). GitLab CI checks, builds and deploys. No database, no
CMS, no cookies.

**Status:** live since 2026-09-18. The build is finished; work is content (case studies and
insights as they exist) and maintenance.

## Pages

| Section          | Pages                                                                                                                                                                                                                                                                                                             |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product**      | [Brand and design](/Product/Brand-and-Design) · [Pages](/Product/Pages) · [Decision log](/Decision-Log)                                                                                                                                                                                                           |
| **How it works** | [Architecture](/How-It-Works/Architecture) · [Languages and SEO](/How-It-Works/Languages-and-SEO) · [Contact form](/How-It-Works/Contact-Form) · [Theme and motion](/How-It-Works/Theme-and-Motion) · [Security and privacy](/How-It-Works/Security-and-Privacy) · [Infrastructure](/How-It-Works/Infrastructure) |
| **Development**  | [Getting started](/Development/Getting-Started) · [Workflow](/Development/Workflow) · [Conventions](/Development/Conventions) · [Testing](/Development/Testing) · [Troubleshooting](/Development/Troubleshooting)                                                                                                 |
| **Guides**       | [Add a case study](/Guides/Add-a-Case-Study) · [Add an insight](/Guides/Add-an-Insight) · [Images](/Guides/Images) · [Add a page](/Guides/Add-a-Page) · [Update dependencies](/Guides/Update-Dependencies) · [Change the email provider](/Guides/Change-the-Email-Provider)                                       |

## Links

| What                  | Where                                                                                                                                                                     |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Production            | [minimalist.hr](https://minimalist.hr)                                                                                                                                    |
| Staging preview       | [staging-minimalist-website.minimalist-1a8.workers.dev](https://staging-minimalist-website.minimalist-1a8.workers.dev/)                                                   |
| Repository, CI, wiki  | [gitlab.com/minimalist-sds/website](https://gitlab.com/minimalist-sds/website)                                                                                            |
| Cloudflare            | [dash.cloudflare.com](https://dash.cloudflare.com/) (root only: deep links contain the account ID)                                                                        |
| Resend                | [resend.com/domains](https://resend.com/domains/76a5d2a8-84d9-4664-b5f3-69de41d35afd)                                                                                     |
| Search consoles       | [Google](https://search.google.com/search-console?resource_id=sc-domain%3Aminimalist.hr), [Bing](https://www.bing.com/webmasters/sitemaps?siteUrl=https://minimalist.hr/) |
| Domain registry (.hr) | [CARNET](https://domene.hr)                                                                                                                                               |

## About this wiki

The single source of truth for the project. The master copy is `docs/wiki/` in the repository;
CI publishes it to the GitLab wiki after each release, so don't edit pages in the GitLab UI. See
[Workflow → The wiki](/Development/Workflow#the-wiki).
