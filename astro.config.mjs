// @ts-check
import { createHash } from 'node:crypto';

import { defineConfig, envField } from 'astro/config';

import { defaultLocale, locales } from './src/i18n/config.ts';
import { localized404 } from './src/integrations/localized-404.ts';
import { inlineScripts } from './src/lib/inline-scripts.ts';
import { siteConfig } from './src/site.config.ts';

/** CSP hash of a script body, as the browser computes it. */
const cspHash = (/** @type {string} */ source) =>
  /** @type {`sha256-${string}`} */ (
    `sha256-${createHash('sha256').update(source).digest('base64')}`
  );

export default defineConfig({
  // Canonical origin, used for canonical and hreflang URLs.
  site: siteConfig.url,

  // Matches "html_handling": "force-trailing-slash" in wrangler.jsonc
  trailingSlash: 'always',

  // EN at the root, HR under /hr/. No browser-language redirects.
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },

  integrations: [localized404(locales.filter((locale) => locale !== defaultLocale))],

  // Content Security Policy, emitted as a <meta> tag on every page with hashes of
  // Astro's own scripts and styles, so no 'unsafe-inline' is needed for scripts. Our two
  // is:inline scripts are hashed here from the same strings the pages render.
  // frame-ancestors cannot be set in a <meta> tag; it is sent as a header (public/_headers).
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        // Cloudflare Web Analytics beacon reports here.
        "connect-src 'self' https://cloudflareinsights.com",
        // Turnstile renders its challenge in an iframe.
        'frame-src https://challenges.cloudflare.com',
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          'https://challenges.cloudflare.com', // Turnstile, contact page only
          'https://static.cloudflareinsights.com', // Web Analytics, injected at the edge
        ],
        hashes: inlineScripts.map(cspHash),
      },
      styleDirective: {
        resources: [
          "'self'",
          // style="" attributes carry per-component CSS variables (e.g. aspect ratios);
          // <style> elements still need Astro's hashes.
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },

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
