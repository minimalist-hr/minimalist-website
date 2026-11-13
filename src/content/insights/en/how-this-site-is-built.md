---
title: 'How this site is built'
locale: en
translationKey: site-build
date: 2026-09-22
category: 'Practice'
excerpt: 'The stack, the constraints and the decisions behind this site, including the ones that cost us something.'
coverImage: 'insight-wireframes'
coverCaption: 'diagram / pages, routes and where each one comes from'
draft: false
ctaTitle: 'Want a site built the same way?'
---

This site was our own brief, and we ran it the way we run a client's: settle the constraints first, then let them decide the code.

## Static by default

Astro and TypeScript, no UI framework. Every page is HTML by the time it is deployed. JavaScript ships only where something needs it — the theme switch, the mobile menu, the scroll reveal, the contact form, the background — and the site works with all of it off. Nothing is hidden behind a script that has to run first.

Hosting is Cloudflare. Merging into the staging branch refreshes a preview; a release to the main branch deploys production. Every pull request runs the linter, the formatter, type checks for both the site and the Worker, and a build; each release adds the accessibility and performance audits.

## Two languages, one route map

English at the root, Croatian under `/hr/` with translated slugs: `/work/` and `/hr/radovi/`. Every static page has one entry in a single route map, so the language switch and the `hreflang` tags cannot point at the wrong page. Case studies and articles exist once per language and are paired by a shared key.

Interface strings live in a typed table. A missing Croatian key is a type error, so the build fails rather than shipping an English label into a Croatian page. There are no browser-language redirects — the URL you ask for is the page you get.

## Seven greys and one typeface

The palette is paper, raised paper, ink, secondary ink, graphite, rule and two stripe tones, in dark and in light. No accent, no gradient. Anything that would usually be solved with colour has to be solved with weight, spacing or a hairline instead.

One of those greys moved. The brand's graphite is `#7E7C75`, which measures 3.8:1 on light paper — short of the 4.5:1 that small text needs. In the light theme it is darkened one step to `#67655E`: same warm grey, 5.3:1. Contrast won.

Type is Archivo in two weights, self-hosted as woff2 with latin and latin-ext, because Croatian needs č, ć, š, ž and đ. The main file is preloaded and set to swap. No font request leaves our own origin, which also keeps the content security policy short — every inline script on the page is there by hash, and nothing else is allowed to run.

## Motion has a budget

Four durations. Rules and underlines draw in from the left over 240ms, lifts translate over 160ms, colour changes take 150ms or less, pages crossfade at 240ms. Everything else is instant.

Content already on screen when a page loads never waits for an animation, and nothing is hidden without JavaScript: the scroll reveal only holds back what starts below the fold, and it removes its own markers once an element has arrived. `prefers-reduced-motion: reduce` turns all of it off, and the test suite runs a full pass in that state so the audit sees every page exactly as a reader with that setting would.

## The background is an algorithm

The field behind every page is an adaptive quadtree drawn on a canvas. A cell splits into four while it is still large next to its distance to a point of interest; the points are the cursor and three slowly drifting ones, so the partition sharpens where you are and stays coarse everywhere else. Cells open by growing from their own centre and collapse back the same way.

It is divided at the hero's closing rule — one strength above it, much fainter below — so the boundary is a visible edge rather than a slow fade. The device pixel ratio is capped, the loop stops when the tab is hidden or the canvas is off screen, and reduced motion leaves a single still frame.

> A decorative layer earns its place by being cheap. If it cannot hold sixty frames a second on an ordinary laptop, it does not ship.

## Accessibility is a build step, not a review

Every page in the sitemap is checked with axe before each release, and the target is zero violations against WCAG 2.2 AA. A keyboard suite runs alongside it: the skip link, focus order forwards and backwards, a visible focus that the sticky header never covers, the mobile menu keys, focus landing on the first invalid field after a failed submit, and reflow at 320 and 640 pixels. Performance, accessibility, best practices and SEO are held at 95 or above. A screen reader pass stays manual, because no tool does it for you.

## One thing on a server

Everything is static except the contact form, which posts to a small Worker. The form and the Worker share one validation module, so the browser and the server cannot disagree about what a valid message is. Mail goes out through a single interface with one implementation behind it, which means changing provider is one variable and one file. Message contents are never logged.

## What we left out

No analytics that would need a cookie banner. No feed yet. No framework, no component library, no design system beyond a tokens file and a handful of utilities. The result is a site small enough to hold in your head — which was the brief.
