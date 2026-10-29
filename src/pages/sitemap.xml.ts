import type { APIRoute } from 'astro';

import { buildSitemap } from '../lib/sitemap';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('`site` must be set in astro.config.mjs to build the sitemap');
  return new Response(await buildSitemap(site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
