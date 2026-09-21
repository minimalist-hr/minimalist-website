---
title: 'A website for an elevator company'
locale: en
translationKey: lift-mucnjak
sector: 'Elevators'
year: 2026
client: 'Lift-Mučnjak'
scope: 'Website'
summary: 'Service, maintenance, modernization and new installations, explained plainly on one site.'
status: published
featured: true
order: 1
coverCaption: 'screenshot / lift-mučnjak home page'
heroCaption: 'hero screenshot / 16:9 / greyscale'
sections:
  - label: 'Context'
    paragraphs:
      - text: 'Lift-Mučnjak services, maintains and modernizes elevators in residential and commercial buildings across Croatia, and designs and installs new ones. Their clients are building managers, owners and developers.'
  - label: 'The problem'
    paragraphs:
      - text: 'Four services, each with a different reader: a building manager with a lift that has stopped, an owner planning a modernization, a developer specifying a new installation. The site had to get each of them to the right answer, and to a phone number, quickly.'
  - label: 'What we removed'
    paragraphs:
      - text: 'Anything a visitor has to decode. No catalogue of lift models, no stock photos of glass elevators, no news section someone has to keep alive. Each service got one page, in plain language.'
  - label: 'What we built'
    paragraphs:
      - text: 'A fast static site with a page for each service, a direct path to the service line, and an inquiry form that goes straight to the office. It loads quickly on a phone in a machine room with one bar of signal.'
stack:
  text: 'Static pages with no database and no CMS to maintain, so the site is fast by default and costs almost nothing to run. The inquiry form runs on Cloudflare’s edge: spam is filtered before a message reaches the office.'
  tools:
    - 'Astro'
    - 'TypeScript'
    - 'CSS'
    - 'Cloudflare Workers'
    - 'Cloudflare Turnstile'
    - 'Resend'
gallery:
  - caption: 'screenshot / service page'
  - caption: 'screenshot / inquiry form on mobile'
ctaTitle: 'Need a website that does one job well?'
---
