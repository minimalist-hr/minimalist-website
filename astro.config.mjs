// @ts-check
import { defineConfig } from 'astro/config';

import { defaultLocale, locales } from './src/i18n/config.ts';
import { siteConfig } from './src/site.config.ts';

// https://astro.build/config
export default defineConfig({
  // Canonical origin, used for canonical and hreflang URLs.
  site: siteConfig.url,

  // Matches "html_handling": "force-trailing-slash" in wrangler.jsonc
  trailingSlash: 'always',

  // EN at the root, HR under /hr/. No browser-language redirects (plan §2).
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
});
