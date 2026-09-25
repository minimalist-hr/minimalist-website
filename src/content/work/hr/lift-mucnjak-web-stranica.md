---
title: 'Tvrtka za dizala koju je lako pronaći i brzo nazvati'
locale: hr
translationKey: lift-mucnjak
sector: 'Održavanje dizala'
year: 2026
client: 'Lift-Mučnjak d.o.o.'
scope: 'Nova izrada'
website: https://lift-mucnjak.hr/
summary: 'Nova izrada za tvrtku za dizala: prave stranice koje tražilice mogu pročitati, hitna linija na svakoj stranici i dva obrasca koja stižu pravoj osobi.'
status: published
featured: true
order: 1
coverImage: 'work-lift-mucnjak-cover'
coverCaption: 'screenshot / lift-mučnjak home page'
heroImage: 'work-lift-mucnjak-hero'
heroCaption: 'hero screenshot / 16:9 / greyscale'
sections:
  - label: 'Kontekst'
    paragraphs:
      - text: 'Lift-Mučnjak od 2002. brine da dizala u hrvatskim zgradama rade: održavanje, popravci, modernizacija i ugradnja novih, uz ekipu dežurnu 0–24. Njihovi su klijenti upravitelji zgrada i predstavnici suvlasnika, ljudi koji ne razgledavaju stranice. Traže broj telefona, provjere je li tvrtka stvarna, pa zatraže ponudu ili prijave dizalo koje je stalo, ponekad s nekim zaglavljenim unutra. Svaki je posjet kratak i ima svrhu.'
  - label: 'Problem'
    paragraphs:
      - text: 'Stara stranica ništa od toga nije radila dobro. Bila je to jedna stranica koja je sadržaj učitavala JavaScriptom, a izbornik su činili gumbi umjesto poveznica, pa su tražilice vidjele jednu stranicu i ništa više. Dvije inačice domene natjecale su se jedna s drugom. Tekst se udaljio od posla i navodio četiri županije za tvrtku koja radi u cijeloj Hrvatskoj. A broj hitne linije 0–24, jedino što je važno u hitnom slučaju, nije imao svoje mjesto.'
  - label: 'Što smo uklonili'
    paragraphs:
      - text: 'JavaScript između posjetitelja i sadržaja, lažnu navigaciju i drugu domenu. Svaku tvrdnju iza koje klijent nije mogao stati: svaka brojka i obećanje na novoj stranici najprije su provjereni s njima. Praćenje, analitiku i obavijesti o kolačićima, jer tvrtka koja popravlja dizala nema razloga ikoga pratiti po internetu. Zahtjeve prema trećim stranama pri učitavanju: fontovi se poslužuju sa same stranice, a provjera spama čeka da netko počne ispunjavati obrazac.'
  - label: 'Što smo izgradili'
    paragraphs:
      - text: 'Brza statična stranica na kojoj je svaka podstranica pravi HTML, poslužen s hostinga koji je klijent već imao. Hitna linija stoji na vrhu svake stranice, jedan dodir do poziva. Dva obrasca rade dva posla: upit za ponudu stiže u ured, a prijava kvara ide ravno dežurnom tehničaru. Dok skrolate, dizalo s naslovne ilustracije spušta se s vama i otvara vrata gdje god stanete. Pravne stranice opisuju točno ono što stranica radi, ni više ni manje.'
stack:
  text: 'Statično sučelje, mala PHP skripta za dva obrasca i pipeline koji ih oboje drži poštenima. Bez baze podataka, bez CMS-a, ništa što treba krpati u utorak navečer. Radi na dijeljenom hostingu koji je klijent već imao.'
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
results:
  - value: '6'
    label: 'Stranica koje tražilice mogu pročitati, prije jedna'
  - value: '0'
    label: 'Kolačića ili zahtjeva prema trećim stranama pri učitavanju'
  - value: '100'
    label: 'Lighthouse: pristupačnost, najbolje prakse i SEO'
ctaTitle: 'Trebate web stranicu koja dobro radi jedan posao?'
---
