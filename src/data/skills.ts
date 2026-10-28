import type { Localized } from '../i18n/localized';

/**
 * Six skill areas with their tool tags (wiki: Pages and content, Skills). Tool names are not
 * translated.
 */
export interface SkillGroup {
  label: Localized<string>;
  /** One line, used on the home page. */
  description: Localized<string>;
  /** Longer description, used on the Skills page. */
  detail: Localized<string>;
  /** The result line the design sets in ink under the detail. */
  summary: Localized<string>;
  tools: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: { en: 'The part people see', hr: 'Dio koji ljudi vide' },
    description: {
      en: 'The screens, forms and buttons your customers actually touch.',
      hr: 'Ekrani, obrasci i gumbi koje vaši korisnici zaista diraju.',
    },
    detail: {
      en: 'Screens your team and your customers actually work in — fast, clear, and usable without training.',
      hr: 'Ekrani u kojima vaš tim i vaši korisnici zaista rade — brzi, jasni i upotrebljivi bez edukacije.',
    },
    summary: {
      en: 'Dashboards, internal apps, customer portals, public websites.',
      hr: 'Nadzorne ploče, interne aplikacije, portali za korisnike, javne stranice.',
    },
    tools: ['React.js', 'Vue.js', '.NET Blazor', '.NET MVC'],
  },
  {
    label: { en: 'The part that does the work', hr: 'Dio koji radi posao' },
    description: {
      en: 'The engine behind the screens — rules, calculations, integrations.',
      hr: 'Motor iza ekrana — pravila, izračuni, integracije.',
    },
    detail: {
      en: 'The rules, calculations and connections behind those screens: pricing, invoicing, permissions, and talking to the systems you already pay for.',
      hr: 'Pravila, izračuni i povezivanje iza tih ekrana: cijene, računi, ovlasti i razgovor sa sustavima koje već plaćate.',
    },
    summary: {
      en: 'One source of truth instead of spreadsheets and copy-paste.',
      hr: 'Jedan izvor istine umjesto tablica i kopiranja.',
    },
    tools: ['.NET', 'ASP.NET Core', 'EF Core', 'Identity', 'MediatR'],
  },
  {
    label: { en: 'Where your information lives', hr: 'Gdje žive vaši podaci' },
    description: {
      en: 'Storage chosen for the shape of your data, not for fashion.',
      hr: 'Pohrana odabrana prema obliku vaših podataka, ne prema modi.',
    },
    detail: {
      en: 'Your data kept correct and safe, and structured so it can answer the questions you actually ask of it.',
      hr: 'Vaši podaci ostaju točni i sigurni, i strukturirani tako da mogu odgovoriti na pitanja koja zaista postavljate.',
    },
    summary: {
      en: 'Backups, history, and reports that add up.',
      hr: 'Sigurnosne kopije, povijest i izvještaji koji se poklapaju.',
    },
    tools: ['PostgreSQL', 'Azure Storage', 'Redis', 'Mongo DB'],
  },
  {
    label: { en: 'Keeping it running', hr: 'Da sve radi bez prekida' },
    description: {
      en: 'Hosting, deployment and monitoring, so releases stay uneventful.',
      hr: 'Hosting, objava i nadzor, da izdanja prolaze bez iznenađenja.',
    },
    detail: {
      en: 'Hosting, updates and monitoring, so a new version goes live without downtime and problems are noticed before your customers call.',
      hr: 'Hosting, ažuriranja i nadzor, tako da nova verzija izlazi bez prekida, a problemi se primijete prije nego korisnik pozove.',
    },
    summary: {
      en: 'Predictable releases, no midnight surprises.',
      hr: 'Predvidljiva izdanja, bez iznenađenja u noći.',
    },
    tools: ['GitLab', 'Docker', 'Aspire', 'Azure'],
  },
  {
    label: { en: 'Proving it works', hr: 'Dokaz da radi' },
    description: {
      en: 'Automated tests and code review that find problems before you do.',
      hr: 'Automatizirani testovi i pregled koda nalaze probleme prije vas.',
    },
    detail: {
      en: 'Every change is tested and reviewed before it reaches you, so today’s fix does not quietly break last month’s feature.',
      hr: 'Svaka promjena testirana je i pregledana prije nego dođe do vas, da današnji popravak tiho ne pokvari prošlomjesečnu funkciju.',
    },
    summary: {
      en: 'Fewer regressions, shorter fix cycles.',
      hr: 'Manje vraćanja unatrag, kraći ciklusi popravaka.',
    },
    tools: ['xUnit', 'NSubstitute', 'Selenium', 'SonarQube'],
  },
  {
    label: { en: 'Built to last', hr: 'Građeno da traje' },
    description: {
      en: 'Patterns that keep the system cheap to change in year three.',
      hr: 'Uzorci zbog kojih je sustav i treće godine jeftin za mijenjati.',
    },
    detail: {
      en: 'The system is split into clear, separate parts with your business rules at the centre, and the work runs in short cycles you can see into — so priorities can change without the plan falling apart.',
      hr: 'Sustav je podijeljen u jasne, odvojene dijelove s vašim poslovnim pravilima u središtu, a rad teče u kratkim ciklusima u koje imate uvid — pa se prioriteti mogu mijenjati bez rušenja plana.',
    },
    summary: {
      en: 'Documented, explainable, and yours to take over at any point.',
      hr: 'Dokumentirano, objašnjivo i vaše za preuzimanje u svakom trenutku.',
    },
    tools: ['Clean architecture', 'Domain-driven design', 'Modular monolith', 'Agile'],
  },
];
