---
title: 'Deleting code is a feature'
locale: en
translationKey: deleting-code
date: 2026-08-18
category: 'Architecture'
excerpt: 'Why the first four weeks of a modernization should produce a smaller system, not a bigger one.'
coverCaption: 'diagram / modules removed in week four'
draft: false
ctaTitle: 'Have a system that needs less of itself?'
---

Most modernization projects start by adding: a new service, a new layer, a new abstraction over the part nobody understands. The first four weeks should do the opposite.

On every legacy system we have opened, somewhere between a third and two thirds of the code is not doing work anyone depends on. Reports nobody reads. Feature flags permanently on. Two implementations of the same calculation, one of them wrong but never called.

## Measure before you argue

Nobody wins a deletion argument with an opinion. Instrument the entry points, let it run for two weeks, and bring the call counts to the meeting. A module with zero invocations in a full billing cycle is not a risk, it is dead weight.

> Every line you delete is a line you never have to migrate, test, document, or explain to the next engineer.

## Delete in public

Removal is only frightening when it is invisible. We keep a single list of everything proposed for deletion, with the evidence next to it, and review it weekly with the client. Anything contested stays. In practice almost nothing is contested twice.

The result is not a smaller estimate. It is a smaller system — one a team of two can hold in their heads, deploy on a Tuesday, and still understand in three years.
