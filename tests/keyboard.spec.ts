import { readFileSync } from 'node:fs';

import { expect, test, type Page } from '@playwright/test';

/**
 * Keyboard and reflow checks that axe cannot make (plan §11.2): skip link, a visible and
 * unobscured focus on every stop in both directions, the mobile menu, the theme switch,
 * the contact form's error focus, and no content lost at 200% / 400% zoom.
 */

function sitemapPaths(): string[] {
  const xml = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1] ?? '/').pathname,
  );
}

/** One page of each template, EN and HR. */
const TAB_PAGES = [
  '/',
  '/work/',
  '/insights/deleting-code-is-a-feature/',
  '/services/',
  '/contact/',
  '/insights/',
  '/hr/',
  '/does-not-exist/',
];

/** Upper bound on focus stops per page, so a focus trap fails instead of hanging. */
const MAX_STOPS = 250;

interface FocusStop {
  label: string;
  visible: boolean;
  obscured: boolean;
}

/** Describes the focused element: whether it shows an indicator and sits under the header. */
function describeFocus(page: Page): Promise<FocusStop | null> {
  return page.evaluate(() => {
    const element = document.activeElement;
    if (!element || element === document.body) return null;
    const style = getComputedStyle(element);
    const visible =
      (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1) ||
      style.boxShadow !== 'none';
    const header = document.querySelector('.site-header');
    const rect = element.getBoundingClientRect();
    const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
    // Anything outside the sticky header (and not fixed above it, like the skip link)
    // must not start underneath it.
    const obscured =
      !header?.contains(element) && style.position !== 'fixed' && rect.top < headerBottom - 1;
    const label = `${element.tagName.toLowerCase()} "${(element.textContent ?? '').trim().slice(0, 40) || element.getAttribute('aria-label') || element.getAttribute('name') || ''}"`;
    return { label, visible, obscured };
  });
}

async function walkFocus(page: Page, key: 'Tab' | 'Shift+Tab') {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (let stop = 0; stop < MAX_STOPS; stop++) {
    await page.keyboard.press(key);
    const focus = await describeFocus(page);
    if (!focus) return problems; // left the document: the walk is complete
    const id = await page.evaluate(() => {
      const element = document.activeElement;
      return element ? [...document.querySelectorAll('*')].indexOf(element) : -1;
    });
    if (seen.has(String(id))) return problems; // wrapped around
    seen.add(String(id));
    if (!focus.visible) problems.push(`no focus indicator: ${focus.label}`);
    if (focus.obscured) problems.push(`under the header: ${focus.label}`);
  }
  problems.push(`more than ${MAX_STOPS} focus stops (focus trap?)`);
  return problems;
}

test.describe('skip link', () => {
  test('is the first stop, visible, and moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});

test.describe('focus order', () => {
  for (const path of TAB_PAGES) {
    test(`${path} forwards and backwards`, async ({ page }) => {
      await page.goto(path);
      const forward = await walkFocus(page, 'Tab');
      expect(forward, forward.join('\n')).toEqual([]);

      // Backwards from the end: the case where a sticky header hides the focused element.
      await page.keyboard.press('End');
      await page.locator('.site-footer').evaluate((footer) => {
        const last = [...footer.querySelectorAll<HTMLElement>('a, button')].at(-1);
        last?.focus();
      });
      const backward = await walkFocus(page, 'Shift+Tab');
      expect(backward, backward.join('\n')).toEqual([]);
    });
  }
});

test.describe('mobile menu', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists below md');
  });

  test('opens from the keyboard, closes on Esc and returns focus', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('[data-menu-toggle]');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(page.locator('#mobile-menu a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  });

  test('closes when focus leaves it, so it never covers the focused element', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('[data-menu-toggle]');
    await button.focus();
    await page.keyboard.press('Enter');
    const stops = await page
      .locator('#mobile-menu')
      .evaluate((menu) => menu.querySelectorAll('a, button').length);
    for (let i = 0; i <= stops; i++) await page.keyboard.press('Tab');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });
});

test.describe('theme switch', () => {
  test('toggles with Space and reports its state', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Covered by the desktop header switch');
    await page.goto('/');
    const toggle = page.locator('.desktop-controls [data-theme-toggle]');
    const before = await page.locator('html').getAttribute('data-theme');
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', before ?? '');
    await expect(toggle).toHaveAttribute('aria-checked', before === 'dark' ? 'true' : 'false');
    await expect(toggle).toBeFocused();
  });
});

test.describe('contact form', () => {
  test('an empty submit focuses the first invalid field and shows the errors', async ({ page }) => {
    await page.goto('/contact/');
    const submit = page.locator('form button[type="submit"]');
    await submit.focus();
    await page.keyboard.press('Enter');
    const first = page.locator('form [aria-invalid="true"]').first();
    await expect(first).toBeFocused();
    await expect(page.locator('[data-form-error]')).toBeVisible();
  });

  test('keeps focus on the submit button while sending', async ({ page }) => {
    // Hold the request open so the sending state is observable.
    let release: () => void = () => undefined;
    await page.route('**/api/contact', async (route) => {
      await new Promise<void>((resolve) => (release = resolve));
      await route.fulfill({ json: { ok: false, error: 'send' } });
    });
    // Stand-in Turnstile that issues a token at once, so the test needs no network.
    await page.addInitScript(() => {
      Object.assign(window, {
        turnstile: {
          render: (_el: Element, options: { callback: (token: string) => void }) => {
            options.callback('test-token');
            return 'widget';
          },
          reset: () => undefined,
        },
      });
    });
    await page.goto('/contact/');
    await page.fill('[name="name"]', 'Test');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="brief"]', 'A short brief.');
    const submit = page.locator('form button[type="submit"]');
    await submit.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
    await expect(submit).toBeFocused();
    release();
    await expect(page.locator('[data-form-error]')).toBeVisible();
    await expect(submit).toBeFocused();
  });
});

test.describe('reflow', () => {
  test.skip(({ isMobile }) => !!isMobile, 'Viewport widths are set explicitly');

  // 320px = 400% zoom at 1280px (WCAG 1.4.10); 640px = 200%.
  for (const width of [320, 640]) {
    test(`nothing is cut off at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      const problems: string[] = [];
      for (const path of sitemapPaths()) {
        await page.goto(path);
        const overflowing = await page.evaluate(() => {
          const limit = document.documentElement.clientWidth + 1;
          return [...document.querySelectorAll<HTMLElement>('body *')]
            .filter((element) => {
              if (element.closest('.visually-hidden, [hidden], [aria-hidden="true"]')) {
                return false;
              }
              const rect = element.getBoundingClientRect();
              return rect.width > 0 && rect.right > limit;
            })
            .map((element) => `${element.tagName.toLowerCase()}.${element.className}`);
        });
        if (overflowing.length > 0) problems.push(`${path}: ${overflowing.slice(0, 5).join(', ')}`);
      }
      expect(problems, problems.join('\n')).toEqual([]);
    });
  }
});
