/** Static files are served before this runs; only requests without a matching file arrive here. */
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
