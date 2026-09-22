---
title: 'Brisanje koda je funkcija'
locale: hr
translationKey: deleting-code
date: 2026-08-18
category: 'Arhitektura'
excerpt: 'Zašto prva četiri tjedna modernizacije trebaju dati manji, a ne veći sustav.'
coverImage: 'insight-diagram'
coverCaption: 'diagram / modules removed in week four'
draft: false
ctaTitle: 'Imate sustav kojem treba manje njega samog?'
---

Većina modernizacija počinje dodavanjem: novi servis, novi sloj, nova abstrakcija nad onim što nitko ne razumije. Prva četiri tjedna trebaju raditi suprotno.

U svakom zastarjelom sustavu koji smo otvorili, između trećine i dvije trećine koda ne radi ništa na što se bilo ko oslanja. Izvještaji koje nitko ne čita. Zastavice trajno uključene. Dvije implementacije istog izračuna, jedna pogrešna ali nikad pozvana.

## Izmjerite prije rasprave

Raspravu o brisanju ne dobiva se mišljenjem. Instrumentirajte ulazne točke, pustite dva tjedna i donesite brojeve poziva na sastanak. Modul s nula poziva u punom obračunskom ciklusu nije rizik, nego balast.

> Svaka obrisana linija je linija koju nikada nećete migrirati, testirati, dokumentirati ni objašnjavati sljedećem inženjeru.

## Brišite javno

Uklanjanje je strašno samo kada je nevidljivo. Vodimo jedan popis svega predloženog za brisanje, s dokazima uz svaku stavku, i tjedno ga pregledavamo s klijentom. Što je sporno, ostaje. U praksi gotovo ništa nije sporno dvaput.

Rezultat nije manja procjena. Rezultat je manji sustav — onaj koji dva čovjeka mogu držati u glavi, objaviti u utorak i razumjeti i za tri godine.
