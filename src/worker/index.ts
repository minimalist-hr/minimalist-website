/**
 * Worker entry (wrangler.jsonc "main"). Static files are served before this runs; only
 * requests without a matching file arrive here.
 *
 * - POST /api/contact → the inquiry form handler
 * - anything else     → back to the asset server, which applies the 404-page handling
 */
import { contactEndpoint } from '../lib/inquiry';
import { handleContact } from './contact';
import type { WorkerEnv } from './env';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === contactEndpoint || pathname === `${contactEndpoint}/`) {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<WorkerEnv>;
