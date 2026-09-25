---
title: 'A lift company, easy to find and quick to call'
locale: en
translationKey: lift-mucnjak
sector: 'Elevator maintenance'
year: 2026
client: 'Lift-Mučnjak d.o.o.'
scope: 'Rebuild'
website: https://lift-mucnjak.hr/
summary: 'A rebuild for a lift company: real pages search engines can read, the 24/7 line on every page, and two forms that reach the right person.'
status: published
featured: true
order: 1
coverImage: 'work-lift-mucnjak-cover'
coverCaption: 'screenshot / lift-mučnjak home page'
heroImage: 'work-lift-mucnjak-hero'
heroCaption: 'hero screenshot / 16:9 / greyscale'
sections:
  - label: 'Context'
    paragraphs:
      - text: 'Lift-Mučnjak has kept lifts running in Croatian buildings since 2002: maintenance, repairs, modernisation and new installations, with a crew on call around the clock. Their customers are property managers and residents’ representatives, people who don’t browse. They look for a number, check that the company is real, and either ask for a quote or report a lift that has stopped, sometimes with someone stuck inside it. Every visit is short and has a purpose.'
  - label: 'The problem'
    paragraphs:
      - text: 'The old site did none of that well. It was a single page that loaded its content with JavaScript, and its menu was buttons, not links, so search engines saw one page and nothing else. Two versions of the domain competed with each other. The copy had drifted from the business, naming four counties for a company that works nationwide. And the 24/7 number, the one thing that matters in an emergency, had no place of its own.'
  - label: 'What we removed'
    paragraphs:
      - text: 'The JavaScript between visitors and the content, the fake navigation and the second domain. Every claim the client couldn’t stand behind: each figure and promise on the new site was checked with them first. Tracking, analytics and cookie banners, because a company that fixes lifts has no reason to follow anyone around the internet. Third-party requests on page load: fonts are self-hosted, and the spam check waits until someone starts filling in a form.'
  - label: 'What we built'
    paragraphs:
      - text: 'A fast static site where every page is real HTML, served from the hosting the client already had. The emergency line sits at the top of every page, one tap from a call. Two forms do two jobs: a quote request for the office, and a fault report that goes straight to the technician on call. As you scroll, the lift from the hero rides down with you and opens its doors wherever you stop. The legal pages describe exactly what the site does, no more.'
stack:
  text: 'A static front end, a small PHP endpoint for the two forms, and a pipeline that keeps both honest. No database, no CMS, nothing to patch on a Tuesday night. It runs on the shared hosting the client already had.'
  tools:
    - 'React'
    - 'TypeScript'
    - 'Vite'
    - 'Tailwind CSS'
    - 'shadcn/ui'
    - 'PHP 8.1'
    - 'Resend'
    - 'Cloudflare Turnstile'
    - 'Vitest'
    - 'cPanel'
gallery:
  - caption: 'screenshot / quote request and fault report'
    image: work-lift-mucnjak-forms
  - caption: 'screenshot / how we work and contact on mobile'
    image: work-lift-mucnjak-mobile
ctaTitle: 'Need a website that does one job well?'
---
