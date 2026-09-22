---
title: 'Kako je izrađena ova stranica'
locale: hr
translationKey: site-build
date: 2026-09-22
category: 'Praksa'
excerpt: 'Alati, ograničenja i odluke iza ove stranice, uključujući one koje su nas nešto koštale.'
coverCaption: 'dijagram / stranice, rute i odakle svaka dolazi'
draft: false
ctaTitle: 'Želite stranicu izrađenu na isti način?'
---

Ova stranica bila je naš vlastiti projektni zadatak i vodili smo ga kao što vodimo klijentov: prvo postavi ograničenja, pa neka ona odrede kod.

## Statično po zadanom

Astro i TypeScript, bez sučeljnog okvira. Svaka je stranica HTML već u trenutku objave. JavaScript se šalje samo ondje gdje nešto bez njega ne radi — prekidač teme, mobilni izbornik, otkrivanje pri listanju, kontaktni obrazac i pozadina — a stranica radi i kada je sve to isključeno. Ništa nije skriveno iza skripte koja se prvo mora izvršiti.

Hosting je Cloudflare. Objava grane postavlja adresu za pregled, a zadana grana objavljuje produkciju. Postupak izgradnje pokreće linter, provjeru formata, provjeru tipova za stranicu i za Worker, izgradnju, a na zahtjevima za spajanje i revizije pristupačnosti i performansi.

## Dva jezika, jedna karta ruta

Engleski na korijenu, hrvatski pod `/hr/` s prevedenim putanjama: `/work/` i `/hr/radovi/`. Svaka statična stranica ima jedan zapis u zajedničkoj karti ruta, pa preklopnik jezika i `hreflang` oznake ne mogu pokazivati na krivu stranicu. Studije slučaja i zapisi postoje jednom po jeziku i povezani su zajedničkim ključem.

Tekstovi sučelja žive u tipiziranoj tablici. Hrvatski ključ koji nedostaje je pogreška tipa, pa izgradnja pukne umjesto da engleska oznaka završi na hrvatskoj stranici. Nema preusmjeravanja prema jeziku preglednika — adresa koju tražite je stranica koju dobijete.

## Sedam sivih tonova i jedno pismo

Paleta su papir, podignuti papir, tinta, sekundarna tinta, grafit, linija i dva tona pruga, u tamnoj i u svijetloj temi. Bez naglasne boje, bez prijelaza. Sve što se inače rješava bojom ovdje se mora riješiti debljinom, razmakom ili tankom linijom.

Jedan se od tih tonova pomaknuo. Grafit iz identiteta je `#7E7C75`, što na svijetlom papiru daje omjer 3,8:1 — premalo za 4,5:1 koliko traži sitan tekst. U svijetloj je temi potamnjen za jedan korak, na `#67655E`: isti topli sivi, 5,3:1. Kontrast je pobijedio.

Pismo je Archivo u dvije debljine, s vlastitog poslužitelja kao woff2 s latinicom i proširenom latinicom, jer hrvatski treba č, ć, š, ž i đ. Glavna se datoteka učitava unaprijed i postavljena je na zamjenu. Nijedan zahtjev za pismom ne izlazi s naše domene, što ujedno drži sigurnosnu politiku sadržaja kratkom — svaka je ugrađena skripta na stranici ondje po svom otisku, a ništa se drugo ne smije izvršiti.

## Pokret ima budžet

Četiri trajanja. Linije i podcrte izvlače se slijeva u 240 ms, pomaci traju 160 ms, promjene boje 150 ms ili manje, stranice se pretapaju u 240 ms. Sve ostalo je trenutačno.

Sadržaj koji je pri učitavanju već na ekranu nikada ne čeka animaciju, a bez JavaScripta ništa nije skriveno: otkrivanje pri listanju zadržava samo ono što počinje ispod ruba ekrana i uklanja vlastite oznake čim element stigne. `prefers-reduced-motion: reduce` gasi sve, a testovi rade puni prolaz u tom stanju, pa revizija vidi svaku stranicu točno onako kako je vidi čitatelj s tom postavkom.

## Pozadina je algoritam

Polje iza svake stranice je prilagodljivo četverostruko stablo nacrtano na platnu. Ćelija se dijeli na četiri dok je još velika u odnosu na svoju udaljenost od točke interesa; te su točke pokazivač i tri koje polako plutaju, pa se podjela izoštrava ondje gdje jeste, a drugdje ostaje gruba. Ćelije se otvaraju rastom iz vlastitog središta i jednako se tako sklapaju.

Podijeljeno je na završnoj liniji uvodnog bloka — jedna jačina iznad nje, mnogo slabija ispod — pa je granica vidljiv rub, a ne polagano blijeđenje. Omjer piksela uređaja je ograničen, petlja staje kada je kartica skrivena ili je platno izvan ekrana, a smanjeni pokret ostavlja jednu nepomičnu sliku.

> Ukrasni sloj svoje mjesto zaslužuje time što je jeftin. Ako ne drži šezdeset sličica u sekundi na običnom prijenosniku, ne ide u objavu.

## Pristupačnost je korak izgradnje, ne pregled

Svaka se stranica iz karte stranica na svakom zahtjevu za spajanje provjerava alatom axe, a cilj je nula prekršaja prema WCAG 2.2 AA. Uz to ide i skup testova za tipkovnicu: preskočna veza, redoslijed fokusa naprijed i natrag, vidljiv fokus koji ljepljivo zaglavlje nikada ne prekriva, tipke mobilnog izbornika, fokus na prvom neispravnom polju nakon neuspjelog slanja i preslagivanje na 320 i 640 piksela. Performanse, pristupačnost, dobre prakse i SEO drže se na 95 ili više. Prolaz s čitačem ekrana ostaje ručan, jer to nijedan alat ne radi umjesto vas.

## Jedna stvar na poslužitelju

Sve je statično osim kontaktnog obrasca, koji šalje podatke malom Workeru. Obrazac i Worker dijele isti modul za provjeru, pa se preglednik i poslužitelj ne mogu razići oko toga što je ispravna poruka. Pošta izlazi kroz jedno sučelje s jednom izvedbom iza njega, pa je promjena pružatelja jedna varijabla i jedna datoteka. Sadržaj poruka se nikada ne zapisuje.

## Što smo izostavili

Nema analitike koja bi tražila traku o kolačićima. Još nema feeda. Nema okvira, nema knjižnice komponenti, nema dizajnerskog sustava osim datoteke s tokenima i nekoliko pomoćnih stilova. Rezultat je stranica dovoljno mala da je se može držati u glavi — što je i bio zadatak.
