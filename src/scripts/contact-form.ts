/**
 * Progressive enhancement for the inquiry form (plan §9.2):
 * inline bilingual validation, Turnstile, a fetch submit with a sending state, and an inline
 * success or error message that receives focus. The markup and all copy live in
 * ContactForm.astro; this file only adds behaviour.
 */
import type { InquiryResponse } from '../lib/inquiry';

interface Messages {
  sending: string;
  invalid: string;
  verification: string;
  send: string;
  fields: Record<string, string>;
  tooLong: string;
}

interface Turnstile {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
    onTurnstileLoad?: () => void;
  }
}

const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';

/** Validated on the client before sending; the Worker checks them again. */
const VALIDATED_FIELDS = ['name', 'email', 'company', 'role', 'brief'] as const;

/** How long a submit waits for Turnstile to issue a token before sending anyway. */
const TOKEN_TIMEOUT_MS = 10_000;

let turnstileReady: Promise<Turnstile> | undefined;

/** Loads Turnstile once per page, only on pages with the form. */
function loadTurnstile(): Promise<Turnstile> {
  turnstileReady ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    window.onTurnstileLoad = () => (window.turnstile ? resolve(window.turnstile) : reject());
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onerror = () => reject(new Error('Turnstile failed to load'));
    document.head.append(script);
  });
  return turnstileReady;
}

interface FormParts {
  body: HTMLElement;
  success: HTMLElement;
  status: HTMLElement;
  submit: HTMLButtonElement;
  widget: HTMLElement;
}

/** The elements the script needs, or null if the markup is not the expected form. */
function queryParts(form: HTMLFormElement): FormParts | null {
  const body = form.querySelector<HTMLElement>('[data-form-body]');
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  const status = form.querySelector<HTMLElement>('[data-form-error]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const widget = form.querySelector<HTMLElement>('[data-turnstile]');
  if (!body || !success || !status || !submit || !widget) return null;
  return { body, success, status, submit, widget };
}

export function enhanceContactForm(form: HTMLFormElement): void {
  const parts = queryParts(form);
  if (!parts) return;
  const { body, success, status, submit, widget } = parts;
  const messages = JSON.parse(form.dataset.messages ?? '{}') as Messages;

  // Our own messages replace the browser's, which would be in the browser's language.
  form.noValidate = true;
  const submitLabel = submit.textContent ?? '';

  // ---- Turnstile: one token per submit, refreshed after every attempt ----
  let widgetId: string | undefined;
  let token = '';
  let onToken: ((value: string) => void) | undefined;

  loadTurnstile()
    .then((turnstile) => {
      widgetId = turnstile.render(widget, {
        sitekey: widget.dataset.sitekey,
        language: widget.dataset.language,
        theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
        appearance: 'interaction-only',
        size: 'flexible',
        callback: (value: string) => {
          token = value;
          onToken?.(value);
        },
        'expired-callback': () => (token = ''),
      });
    })
    .catch(() => {
      // Blocked or offline: the Worker will reject the submit and the error explains why.
    });

  function waitForToken(): Promise<string> {
    if (token) return Promise.resolve(token);
    return new Promise((resolve) => {
      onToken = resolve;
      setTimeout(() => resolve(token), TOKEN_TIMEOUT_MS);
    });
  }

  function resetTurnstile() {
    token = '';
    if (widgetId) window.turnstile?.reset(widgetId);
  }

  // ---- Field errors ----
  function fieldControl(name: string) {
    return form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
  }

  function setFieldError(name: string, message: string | null) {
    const control = fieldControl(name);
    const error = document.getElementById(`${name}-error`);
    if (!control || !error) return;
    if (message === null) control.removeAttribute('aria-invalid');
    else control.setAttribute('aria-invalid', 'true');
    error.textContent = message ?? '';
    error.hidden = message === null;
  }

  function clearErrors() {
    VALIDATED_FIELDS.forEach((name) => setFieldError(name, null));
    status.hidden = true;
    status.textContent = '';
  }

  function showFieldErrors(fields: readonly string[]) {
    fields.forEach((name) => {
      const control = fieldControl(name);
      const tooLong = control?.validity.tooLong ?? false;
      setFieldError(name, tooLong ? messages.tooLong : (messages.fields[name] ?? messages.tooLong));
    });
    showStatus(messages.invalid);
    fieldControl(fields[0] ?? '')?.focus();
  }

  function showStatus(message: string) {
    status.textContent = message;
    status.hidden = false;
  }

  function invalidFields(): string[] {
    return VALIDATED_FIELDS.filter((name) => {
      const control = fieldControl(name);
      return control ? !control.checkValidity() : false;
    });
  }

  function setBusy(busy: boolean) {
    submit.disabled = busy;
    submit.textContent = busy ? messages.sending : submitLabel;
    form.setAttribute('aria-busy', String(busy));
  }

  // ---- Submit ----
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const invalid = invalidFields();
    if (invalid.length > 0) {
      showFieldErrors(invalid);
      return;
    }

    setBusy(true);
    try {
      await waitForToken();
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const result = (await response.json()) as InquiryResponse;

      if (result.ok) {
        body.hidden = true;
        success.hidden = false;
        success.focus();
        return;
      }

      resetTurnstile();
      if (result.error === 'invalid') showFieldErrors(result.fields);
      else if (result.error === 'verification') showStatus(messages.verification);
      else showStatus(messages.send);
    } catch {
      resetTurnstile();
      showStatus(messages.send);
    } finally {
      setBusy(false);
    }
  });
}
