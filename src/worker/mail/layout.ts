/**
 * Shared HTML shell for the site's emails, in the brand's neutral palette (wiki: Design system).
 *
 * Email clients are not browsers: layout uses tables and inline styles, which every client
 * keeps. The light theme is the default because Gmail and Outlook ignore
 * `prefers-color-scheme`; clients that support it (Apple Mail, iCloud) switch to the dark
 * theme through the classes in the <style> block. Type is Archivo, loaded from the site
 * where the client allows web fonts, with a neutral system fallback.
 */

import { siteConfig } from '../../site.config';

/** The brand tokens (src/styles/tokens.css), repeated here because emails cannot use CSS variables reliably. */
export const light = {
  paper: '#f5f4f1',
  raise: '#ffffff',
  ink: '#111110',
  ink2: '#3b3a36',
  graphite: '#67655e',
  rule: '#dcdad3',
} as const;

const dark = {
  paper: '#111110',
  raise: '#191917',
  ink: '#f5f4f1',
  ink2: '#c9c7c0',
  graphite: '#8a8880',
  rule: '#2c2b28',
} as const;

const FONT = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SITE = siteConfig.url;

/** Escapes text for HTML. Every value that came from the form goes through this. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Inline styles for the parts templates use. `c-*` classes switch them in dark mode. */
export const styles = {
  label: `margin:0;font-family:${FONT};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${light.graphite};`,
  title: `margin:0;font-family:${FONT};font-size:26px;font-weight:500;letter-spacing:-0.02em;line-height:1.2;color:${light.ink};`,
  body: `margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${light.ink2};`,
  value: `font-family:${FONT};font-size:15px;line-height:1.5;color:${light.ink};`,
  link: `color:${light.ink};text-decoration:underline;text-decoration-color:${light.rule};text-underline-offset:3px;`,
  rule: `border-top:1px solid ${light.rule};`,
  button: `display:inline-block;padding:13px 22px;font-family:${FONT};font-size:14px;font-weight:500;color:${light.paper};background:${light.ink};text-decoration:none;`,
} as const;

interface LayoutOptions {
  /** Document language, e.g. "en" or "hr". */
  lang: string;
  /** Hidden preview line shown next to the subject in the inbox list. */
  preheader: string;
  /** Inner HTML of the card. */
  content: string;
  /** Small print under the card (plain text; escaped here). */
  footer: string;
}

export function renderLayout({ lang, preheader, content, footer }: LayoutOptions): string {
  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  @font-face { font-family: Archivo; font-weight: 100 900; font-display: swap;
    src: url('${SITE}/fonts/archivo-latin-wght.woff2') format('woff2'); }
  @font-face { font-family: Archivo; font-weight: 100 900; font-display: swap;
    src: url('${SITE}/fonts/archivo-latin-ext-wght.woff2') format('woff2');
    unicode-range: U+0100-02AF, U+1E00-1EFF, U+2C60-2C7F, U+A720-A7FF; }
  @media (prefers-color-scheme: dark) {
    .c-paper { background: ${dark.paper} !important; }
    .c-raise { background: ${dark.raise} !important; border-color: ${dark.rule} !important; }
    .c-ink, .c-ink a { color: ${dark.ink} !important; }
    .c-ink2 { color: ${dark.ink2} !important; }
    .c-graphite { color: ${dark.graphite} !important; }
    .c-rule { border-color: ${dark.rule} !important; }
    .c-link { color: ${dark.ink} !important; text-decoration-color: ${dark.rule} !important; }
    .c-button { background: ${dark.ink} !important; color: ${dark.paper} !important; }
    .c-mark { background: ${dark.ink} !important; }
  }
  @media (max-width: 520px) {
    .card { padding: 28px 22px !important; }
    .stack td { display: block !important; width: auto !important; }
    .stack .key { padding-bottom: 2px !important; }
    .stack .val { border-top: 0 !important; padding-top: 0 !important; }
  }
</style>
</head>
<body class="c-paper" style="margin:0;padding:0;background:${light.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="c-paper" style="background:${light.paper};">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td style="padding:0 0 20px;">
            <a href="${SITE}/" class="c-ink" style="font-family:${FONT};font-size:16px;font-weight:500;letter-spacing:-0.035em;line-height:1;color:${light.ink};text-decoration:none;">MINIMALIST<span class="c-mark" style="display:inline-block;width:0.2em;height:0.2em;margin-left:0.26em;background:${light.ink};vertical-align:baseline;"></span></a>
          </td>
        </tr>
        <tr>
          <td class="card c-raise" style="padding:40px;background:${light.raise};border:1px solid ${light.rule};">
${content}
          </td>
        </tr>
        <tr>
          <td class="c-graphite" style="padding:20px 0 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${light.graphite};">
            ${escapeHtml(footer)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
