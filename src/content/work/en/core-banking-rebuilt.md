---
title: 'Core banking, rebuilt in 14 weeks'
locale: en
translationKey: core-banking
sector: 'Fintech'
year: 2026
client: 'Northbank d.d.'
engagement: '14 weeks, 2026'
scope: 'Modernization'
summary: 'A ledger nobody dared touch, replaced without a single day of downtime.'
cardMetric: 'p95 latency 340ms → 48ms. Infrastructure cost down 62%.'
status: in-progress
featured: true
order: 1
coverCaption: 'product shot / core banking console'
heroCaption: 'hero product shot / 16:9 / greyscale'
sections:
  - label: 'Context'
    paragraphs:
      - text: 'A regional lender ran its accounts, payments and reporting on a ledger written in 2009. Every release needed a weekend, every change needed the one engineer who remembered why it worked.'
  - label: 'The problem'
    paragraphs:
      - text: 'Not the code. The coupling. Thirty-one modules shared one database schema, so nothing could be changed in isolation and nothing could be tested honestly.'
  - label: 'What we removed'
    paragraphs:
      - text: 'Nineteen of the thirty-one modules were unused, duplicated, or reporting the same number twice. They were deleted, not migrated.'
      - text: 'Two thirds of the system left the building before a line of new code was written.'
        lead: true
  - label: 'What we built'
    paragraphs:
      - text: 'An event-sourced ledger with four bounded services, an immutable audit trail the regulator reads directly, and a console that replaced three internal tools. Deployed behind a parallel run for six weeks, then switched over on a Tuesday afternoon.'
gallery:
  - caption: 'screenshot / ledger console'
  - caption: 'screenshot / audit trail'
results:
  - value: '48ms'
    label: 'p95 latency, from 340ms'
  - value: '−62%'
    label: 'infrastructure cost per month'
  - value: '0'
    label: 'minutes of downtime at switchover'
  - value: '2h'
    label: 'to ship a release, from one weekend'
quote:
  text: '“They removed two thirds of the system and the product got better. We expected a rewrite and got something our own engineers can maintain — with a migration we barely noticed.”'
  name: 'Ivan Kovač'
  role: 'CTO, Northbank d.d.'
ctaTitle: 'Have a system nobody wants to touch?'
---
