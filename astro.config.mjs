// @ts-check
import { defineConfig, envField } from 'astro/config';

import { defaultLocale, locales } from './src/i18n/config.ts';
import { localized404 } from './src/integrations/localized-404.ts';
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

  integrations: [localized404(locales.filter((locale) => locale !== defaultLocale))],

  // Typed build-time settings. Set in GitLab CI/CD variables for real deploys.
  env: {
    schema: {
      // Turnstile site key (public). Defaults to Cloudflare's always-pass test key; that
      // key's tokens are rejected by a real secret, so a missing key fails closed.
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '1x00000000000000000000AA',
      }),
    },
  },
});
