---
title: 'Lift-Mučnjak: a website that works like the lifts it looks after'
locale: en
translationKey: lift-mucnjak
sector: 'Elevator maintenance'
year: 2026
client: 'Lift-Mučnjak d.o.o.'
scope: 'Rebuild'
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
      - text: 'Lift-Mučnjak has kept lifts running in Croatian buildings since 2002: maintenance, repairs, modernisation and new installations, with a crew on call around the clock. Their customers are property managers and residents’ representatives. People who don’t browse. They look for a number, check that the company is real, and either ask for a quote or report a lift that has stopped. Sometimes with someone stuck inside it.'
  - label: 'The problem'
    paragraphs:
      - text: 'The old site didn’t do any of that well. It was a single page that pulled in its content with JavaScript, and its menu was made of buttons rather than links, so search engines saw one page and nothing else. There was no sitemap, no HTTPS redirect, and two versions of the domain competing with each other. The copy had drifted from the business: it named four counties for a company that works nationwide, left out new installations entirely, and still showed a placeholder where the bank details should be. And the one thing that matters in an emergency, the 24/7 number, had no place of its own.'
  - label: 'What we removed'
    paragraphs:
      - text: 'The JavaScript that stood between visitors and the content. The fragments, the fake navigation, the second domain. Every claim the client couldn’t stand behind: each figure and promise on the new site was checked with them before it went in. Tracking, analytics and cookie banners, because a company that fixes lifts has no reason to follow anyone around the internet. Third-party requests on page load: fonts are self-hosted, and the spam check waits until someone actually starts filling in a form. And the admin panel nobody would have logged into.'
  - label: 'What we built'
    paragraphs:
      - text: 'A fast, static site where every page is real HTML, prerendered and served straight from the client’s existing hosting. The emergency line sits at the top of every page, one tap from a call. Two forms do two different jobs: a quote request that reaches the office, and a fault report that goes straight to the technician on call, with a branded confirmation for the sender. The legal pages describe exactly what the site does, no more.'
      - text: 'One detail carries the brand. The lift in the hero illustration starts at the ground floor. Scroll, and it rides down the shaft and out of the frame into a faint shaft behind the page. From there it follows you through the sections, one floor each, and opens its doors wherever you stop. Jump there from the menu and it is already waiting. It is written straight to the page as transforms, so it costs nothing in speed and changes no layout. For visitors who prefer less motion, it stays still.'
      - text: 'Every change goes through a merge request, deploys to a staging copy and has to pass Lighthouse on mobile and desktop before it can reach production: load under 2.5 seconds, no layout shift, accessibility of 95 or more, a perfect SEO score. Production deploys are one click, with a snapshot taken first and a rollback one click away. The old URLs redirect, so nothing that was indexed is lost.'
stack:
  text: 'A static front end, a small PHP endpoint for the two forms, and a pipeline that keeps both honest. No database, no CMS, nothing to patch on a Tuesday night. It runs on the shared hosting the client already had.'
  tools:
    - 'React 19'
    - 'TypeScript'
    - 'Vite'
    - 'vite-react-ssg'
    - 'Tailwind CSS 4'
    - 'shadcn/ui'
    - 'Radix UI'
    - 'Manrope'
    - 'PHP 8.1'
    - 'Resend'
    - 'Cloudflare Turnstile'
    - 'Vitest'
    - 'GitLab CI/CD'
    - 'cPanel'
    - 'Lighthouse CI'
gallery:
  - caption: 'screenshot / quote request and fault report'
    image: work-lift-mucnjak-forms
  - caption: 'screenshot / how we work and contact on mobile'
    image: work-lift-mucnjak-mobile
ctaTitle: 'Need a website that does one job well?'
---
