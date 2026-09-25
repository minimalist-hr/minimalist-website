---
title: 'Lift-Mučnjak: web stranica koja radi kao dizala o kojima brine'
locale: hr
translationKey: lift-mucnjak
sector: 'Održavanje dizala'
year: 2026
client: 'Lift-Mučnjak d.o.o.'
scope: 'Nova izrada'
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
      - text: 'Lift-Mučnjak od 2002. brine da dizala u hrvatskim zgradama rade: održavanje, popravci, modernizacija i ugradnja novih, uz ekipu dežurnu 0–24. Njihovi su klijenti upravitelji zgrada i predstavnici suvlasnika. Ljudi koji ne razgledavaju stranice. Traže broj telefona, provjere je li tvrtka stvarna, pa zatraže ponudu ili prijave dizalo koje je stalo. Ponekad s nekim zaglavljenim unutra.'
  - label: 'Problem'
    paragraphs:
      - text: 'Stara stranica ništa od toga nije radila dobro. Bila je to jedna stranica koja je sadržaj učitavala JavaScriptom, a izbornik su činili gumbi umjesto poveznica, pa su tražilice vidjele jednu stranicu i ništa više. Nije bilo sitemapa ni preusmjeravanja na HTTPS, a dvije inačice domene natjecale su se jedna s drugom. Tekst se udaljio od posla: navodio je četiri županije za tvrtku koja radi u cijeloj Hrvatskoj, potpuno je izostavio ugradnju novih dizala, a na mjestu bankovnih podataka još je stajao privremeni tekst. A ono jedino što je važno u hitnom slučaju, broj hitne linije 0–24, nije imalo svoje mjesto.'
  - label: 'Što smo uklonili'
    paragraphs:
      - text: 'JavaScript koji je stajao između posjetitelja i sadržaja. Fragmente, lažnu navigaciju, drugu domenu. Svaku tvrdnju iza koje klijent nije mogao stati: svaka brojka i svako obećanje na novoj stranici provjereni su s njima prije objave. Praćenje, analitiku i obavijesti o kolačićima, jer tvrtka koja popravlja dizala nema razloga ikoga pratiti po internetu. Zahtjeve prema trećim stranama pri učitavanju: fontovi se poslužuju sa same stranice, a provjera spama čeka da netko zaista počne ispunjavati obrazac. I administracijsko sučelje u koje se nitko ne bi prijavio.'
  - label: 'Što smo izgradili'
    paragraphs:
      - text: 'Brza statična stranica na kojoj je svaka podstranica pravi HTML, unaprijed generiran i poslužen izravno s hostinga koji je klijent već imao. Hitna linija stoji na vrhu svake stranice, jedan dodir do poziva. Dva obrasca rade dva različita posla: upit za ponudu koji stiže u ured i prijava kvara koja ide ravno dežurnom tehničaru, uz potvrdu u stilu tvrtke za pošiljatelja. Pravne stranice opisuju točno ono što stranica radi, ni više ni manje.'
      - text: 'Jedan detalj nosi brend. Dizalo u ilustraciji na vrhu stranice kreće iz prizemlja. Kad počnete skrolati, spušta se niz okno i izlazi iz kadra u blijedo okno iza stranice. Odatle vas prati kroz odjeljke, kat po odjeljak, i otvara vrata gdje god stanete. Skočite li onamo iz izbornika, već vas čeka. Pomak se zapisuje izravno u stranicu kao CSS transformacija, pa ništa ne usporava i ne pomiče raspored. Posjetiteljima koji žele manje pokreta dizalo miruje.'
      - text: 'Svaka promjena prolazi kroz merge request, objavljuje se na probnu kopiju i mora proći Lighthouse na mobitelu i računalu prije nego što stigne u produkciju: učitavanje ispod 2,5 sekunde, bez pomicanja rasporeda, pristupačnost 95 ili više, savršen SEO rezultat. Objava u produkciju je jedan klik, uz snimku stanja napravljenu prije i povratak jednim klikom. Stari URL-ovi preusmjeravaju na nove, pa se ništa što je bilo indeksirano ne gubi.'
stack:
  text: 'Statično sučelje, mala PHP skripta za dva obrasca i pipeline koji ih oboje drži poštenima. Bez baze podataka, bez CMS-a, ništa što treba krpati u utorak navečer. Radi na dijeljenom hostingu koji je klijent već imao.'
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
ctaTitle: 'Trebate web stranicu koja dobro radi jedan posao?'
---
