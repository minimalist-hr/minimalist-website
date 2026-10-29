/**
 * The page's two blocking inline scripts, as exact strings.
 *
 * They must run before first paint, so they cannot be bundled modules. The Content Security
 * Policy only allows inline scripts whose hash it lists, and Astro does not hash `is:inline`
 * scripts itself, so astro.config.mjs hashes these same strings. Components render them
 * verbatim with `set:html`, so the hashes can never drift from what is on the page.
 */
import { defaultTheme, themeColors, themeStorageKey } from './theme';

/** Marks JavaScript as available, so JS-only controls never flash. */
export const jsFlagScript = "document.documentElement.dataset.js='';";

/** Applies the saved theme and matching theme-color before first paint. */
export const themeScript = [
  '(function(){',
  `var theme=${JSON.stringify(defaultTheme)};`,
  `try{if(localStorage.getItem(${JSON.stringify(themeStorageKey)})==='light')theme='light';}catch(e){}`,
  'document.documentElement.dataset.theme=theme;',
  'var meta=document.querySelector(\'meta[name="theme-color"]\');',
  `if(meta)meta.setAttribute('content',${JSON.stringify(themeColors)}[theme]);`,
  '})();',
].join('');

export const inlineScripts = [jsFlagScript, themeScript] as const;
