import type { Localized } from '../i18n/localized';

/** Six skill areas with their tool tags (plan §2, Skills). Tool names are not translated. */
export interface SkillGroup {
  label: Localized<string>;
  description: Localized<string>;
  tools: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: { en: 'The part people see', hr: 'Dio koji ljudi vide' },
    description: {
      en: 'The screens, forms and buttons your customers actually touch.',
      hr: 'Ekrani, obrasci i gumbi koje vaši korisnici zaista diraju.',
    },
    tools: ['React.js', 'Vue.js', '.NET Blazor', '.NET MVC'],
  },
  {
    label: { en: 'The part that does the work', hr: 'Dio koji radi posao' },
    description: {
      en: 'The engine behind the screens — rules, calculations, integrations.',
      hr: 'Motor iza ekrana — pravila, izračuni, integracije.',
    },
    tools: ['.NET', 'ASP.NET Core', 'EF Core', 'Identity', 'MediatR'],
  },
  {
    label: { en: 'Where your information lives', hr: 'Gdje žive vaši podaci' },
    description: {
      en: 'Storage chosen for the shape of your data, not for fashion.',
      hr: 'Pohrana odabrana prema obliku vaših podataka, ne prema modi.',
    },
    tools: ['PostgreSQL', 'Azure Storage', 'Redis', 'Mongo DB'],
  },
  {
    label: { en: 'Keeping it running', hr: 'Da sve radi bez prekida' },
    description: {
      en: 'Hosting, deployment and monitoring, so releases stay boring.',
      hr: 'Hosting, objava i nadzor, da izdanja ostanu dosadna.',
    },
    tools: ['GitLab', 'Docker', 'Aspire', 'Azure'],
  },
  {
    label: { en: 'Proving it works', hr: 'Dokaz da radi' },
    description: {
      en: 'Automated tests and code review that find problems before you do.',
      hr: 'Automatizirani testovi i pregled koda nalaze probleme prije vas.',
    },
    tools: ['xUnit', 'NSubstitute', 'Selenium', 'SonarQube'],
  },
  {
    label: { en: 'Built to last', hr: 'Građeno da traje' },
    description: {
      en: 'Patterns that keep the system cheap to change in year three.',
      hr: 'Uzorci zbog kojih je sustav i treće godine jeftin za mijenjati.',
    },
    tools: ['Clean architecture', 'Domain-driven design', 'Modular monolith', 'Agile'],
  },
];
