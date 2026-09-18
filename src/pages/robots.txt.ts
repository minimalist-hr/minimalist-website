import type { APIRoute } from 'astro';

/**
 * /robots.txt (plan §10). Crawling is allowed; until launch, the X-Robots-Tag: noindex header
 * (added by the CI pipeline) keeps pages out of search results.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('`site` must be set in astro.config.mjs to build robots.txt');
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
