const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Checks a Turnstile token with Cloudflare (wiki: Backend architecture). A token is valid once and
 * for a few minutes; anything but an explicit success counts as a failure.
 */
export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
): Promise<boolean> {
  if (!token) return false;

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, { method: 'POST', body });
    if (!response.ok) return false;
    const result: { success?: boolean } = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
}
