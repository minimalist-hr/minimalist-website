import { isLocale, type Locale } from '../i18n/config';
import { localizedPath } from '../i18n/utils';
import { honeypotField, type InquiryResponse } from '../lib/inquiry';
import { composeInquiryMail } from './compose';
import type { WorkerEnv } from './env';
import { createMailer } from './mail';
import { verifyTurnstile } from './turnstile';
import { parseInquiry } from './validation';

/** Generous for a 5,000-character brief; anything bigger is not a real inquiry. */
const MAX_BODY_BYTES = 64 * 1024;

/**
 * POST /api/contact (plan §9.3). Stores nothing and never logs message content.
 *
 * The page submits with JavaScript and asks for JSON. A plain form POST (no JavaScript) gets
 * a redirect back to the contact page instead.
 */
export async function handleContact(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  // Only accept submissions from this site's own pages.
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return new Response('Forbidden', { status: 403 });
  }

  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) {
    return new Response('Payload too large', { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const wantsJson = request.headers.get('Accept')?.includes('application/json') ?? false;
  const localeValue = form.get('locale');
  const locale: Locale = isLocale(localeValue) ? localeValue : 'en';
  const reply = (result: InquiryResponse, status: number) =>
    wantsJson ? Response.json(result, { status }) : redirectToContact(request, locale, result);

  // Honeypot filled in: a bot. Answer as if it worked, send nothing.
  const honeypot = form.get(honeypotField);
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return reply({ ok: true }, 200);
  }

  const parsed = parseInquiry(form);
  if (!parsed.ok) {
    return reply({ ok: false, error: 'invalid', fields: parsed.fields }, 400);
  }

  // Fail closed: without a secret there is no spam protection, so nothing is sent.
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('[contact] TURNSTILE_SECRET_KEY is not set');
    return reply({ ok: false, error: 'unavailable' }, 503);
  }

  const token = form.get('cf-turnstile-response');
  const verified = await verifyTurnstile(
    typeof token === 'string' ? token : '',
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP'),
  );
  if (!verified) {
    return reply({ ok: false, error: 'verification' }, 403);
  }

  try {
    const mailer = createMailer(env);
    await mailer.send(
      composeInquiryMail(parsed.inquiry, { to: env.CONTACT_TO, from: env.CONTACT_FROM }),
    );
  } catch (error) {
    // Log the reason only, never the inquiry itself.
    const code = error instanceof Error && 'code' in error ? String(error.code) : 'unknown';
    console.error(`[contact] send failed: ${code}`);
    return reply({ ok: false, error: 'send' }, 502);
  }

  return reply({ ok: true }, 200);
}

/** No-JavaScript path: back to the contact page with the outcome in the query string. */
function redirectToContact(request: Request, locale: Locale, result: InquiryResponse): Response {
  const url = new URL(localizedPath('contact', locale), request.url);
  url.searchParams.set('status', result.ok ? 'sent' : result.error);
  return Response.redirect(url.toString(), 303);
}
