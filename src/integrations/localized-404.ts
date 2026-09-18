import { rename, rmdir } from 'node:fs/promises';

import type { AstroIntegration } from 'astro';

/**
 * Astro only turns the root `src/pages/404.astro` into `404.html`; a page at
 * `src/pages/hr/404.astro` builds to `hr/404/index.html`. Cloudflare serves the *nearest*
 * `404.html` (wrangler.jsonc: not_found_handling = "404-page"), so this moves each localised
 * not-found page to `<locale>/404.html`, and a missing /hr/… URL gets the Croatian page.
 */
export function localized404(prefixedLocales: readonly string[]): AstroIntegration {
  return {
    name: 'localized-404',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        for (const locale of prefixedLocales) {
          const folder = new URL(`${locale}/404/`, dir);
          await rename(new URL('index.html', folder), new URL(`${locale}/404.html`, dir));
          await rmdir(folder);
          logger.info(`${locale}/404/index.html → ${locale}/404.html`);
        }
      },
    },
  };
}
