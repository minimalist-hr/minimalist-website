# Privacy and data handling

_Not legal advice. The legal texts on the site were accepted as final by the owner on
2026-09-26 without an outside review. Revisit them if the site starts collecting anything new._

## What the site collects

| Data                                                                                         | When                               | Where it goes                                 | Kept                                               |
| :------------------------------------------------------------------------------------------- | :--------------------------------- | :-------------------------------------------- | :------------------------------------------------- |
| Contact form fields (name, email, company, role, timeline, budget, brief, language, consent) | When someone sends the form        | Worker (in memory) → Resend → iCloud inbox    | In the inbox until deleted. Resend keeps send logs |
| Turnstile signals                                                                            | On the contact page                | Cloudflare Turnstile                          | Per Cloudflare's terms; no cookies                 |
| Analytics (page views, referrer, country, performance)                                       | Every page view                    | Cloudflare Web Analytics                      | Aggregated; cookieless, no fingerprinting          |
| Request logs                                                                                 | Every Worker request               | Cloudflare (observability)                    | Short-lived; contain no form content               |
| Theme preference                                                                             | When the visitor toggles the theme | The visitor's own `localStorage` (`mn-theme`) | Until cleared; never sent anywhere                 |

The site sets **no cookies** and loads **no third-party resources** on most pages. Fonts are
self-hosted. Turnstile is requested only on the contact page.

## Processors

Named in the privacy policy on `/legal/`:

| Processor       | Role                                       | Region notes                                          |
| :-------------- | :----------------------------------------- | :---------------------------------------------------- |
| Cloudflare      | Hosting, Worker, Turnstile, analytics, DNS | Global edge                                           |
| Resend          | Sends the notification and auto-reply      | Sends from eu-west-1; logs stored in the US           |
| Apple (iCloud+) | Hosts the inbox                            | No data processing agreement; owner's accepted choice |

## Principles in code

- **Store nothing.** The Worker has no storage bindings. A submission exists only in memory for
  the length of the request, then in the two emails.
- **Never log content.** Logs carry error codes only. See
  [Backend architecture → Logging](/Architecture/Backend-Architecture#logging).
- **Consent is explicit.** A required checkbox links to the privacy policy; the Worker rejects a
  submission without `consent=yes`, and the studio's email notes it was accepted.
- **The auto-reply repeats nothing** from the form, so the form can't be used to send someone
  else's text to an address that didn't ask for it.
- **No mailing list.** Addresses are used only to answer the inquiry (stated on the contact page).

## When a cookie banner would become necessary

Not today, because the site only uses cookieless analytics, Turnstile, self-hosted fonts and
`localStorage` for a preference. Re-evaluate before adding any of:

- embeds (video, maps, social posts),
- marketing or advertising pixels,
- chat widgets,
- any analytics that sets cookies or fingerprints,
- any new processor.

Any of these also means updating the privacy policy in `src/views/LegalView.astro` (both
languages) and the CSP.

## Company information

The Legal page and footer show the business details required for a Croatian _obrt_: legal
name, owner, registered address, OIB, registration number, bank and IBAN. They come from
`src/site.config.ts`; change them there only.

## Requests from people

Data subject requests (access, deletion) go to `hello@minimalist.hr`. The only place personal
data lives is the inbox (and Resend's send logs), so a deletion means deleting the emails and,
if needed, asking Resend to remove its logs.
