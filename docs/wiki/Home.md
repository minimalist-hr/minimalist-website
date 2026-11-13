# Minimalist website

The website of **Minimalist**, a small software studio in Zagreb, at
[minimalist.hr](https://minimalist.hr). English and Croatian, dark and light.

Astro builds a static site. A Cloudflare Worker serves it and handles the contact form
(Turnstile, then email through Resend). GitLab CI checks, builds and deploys. No database, no
CMS, no cookies.

**Status:** live since 2026-09-18. The build is finished; work is content (case studies and
insights as they exist) and maintenance.

## Pages

| Section          | Pages                                                                                                                                                                                                                         |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product**      | [Brand and design](Brand-and-Design) · [Pages](Pages) · [Decision log](Decision-Log)                                                                                                                                          |
| **How it works** | [Architecture](Architecture) · [Languages and SEO](Languages-and-SEO) · [Contact form](Contact-Form) · [Theme and motion](Theme-and-Motion) · [Security and privacy](Security-and-Privacy) · [Infrastructure](Infrastructure) |
| **Development**  | [Getting started](Getting-Started) · [Workflow](Workflow) · [Conventions](Conventions) · [Testing](Testing) · [Troubleshooting](Troubleshooting)                                                                              |
| **Guides**       | [Add a case study](Add-a-Case-Study) · [Add an insight](Add-an-Insight) · [Images](Images) · [Add a page](Add-a-Page) · [Update dependencies](Update-Dependencies) · [Change the email provider](Change-the-Email-Provider)   |

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
[Workflow → The wiki](Workflow#the-wiki).
