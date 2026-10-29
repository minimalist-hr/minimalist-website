import { readFileSync } from 'node:fs';

import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** The page list comes from the built sitemap; the 404 pages aren't in it. */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Audit every page in its final state: with reduced motion, nothing below the fold is held
// back for a scroll reveal (motion.spec.ts covers the reveal itself).
test.use({ reducedMotion: 'reduce' });

function sitemapPaths(): string[] {
  const xml = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1] ?? '/').pathname,
  );
}

const pages = [...sitemapPaths(), '/does-not-exist/', '/hr/ne-postoji/'];

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.help}\n` +
      violation.nodes.map((node) => `    ${node.target.join(' ')}`).join('\n'),
  );
  expect(summary, summary.join('\n')).toEqual([]);
}

for (const theme of ['dark', 'light'] as const) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('mn-theme', value), theme);
    });

    for (const path of pages) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expectNoViolations(page);
      });
    }

    // The mobile menu is only in the DOM's visible tree when open.
    test('mobile menu open', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'The menu button only exists below md');
      await page.goto('/');
      await page.getByRole('button', { name: 'Menu' }).click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await expectNoViolations(page);
    });
  });
}
