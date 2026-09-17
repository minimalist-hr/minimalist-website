// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Matches "html_handling": "force-trailing-slash" in wrangler.jsonc
  trailingSlash: 'always',
});
