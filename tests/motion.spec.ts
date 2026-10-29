import { expect, test } from '@playwright/test';

const held = '[data-reveal="pending"], [data-rule="pending"]';

test('nothing on screen at load is held back', async ({ page }) => {
  await page.goto('/');
  const onScreen = await page.evaluate((selector) => {
    // A bottom rule waits for its own bottom edge, which is below the fold.
    return [...document.querySelectorAll(selector)].filter(
      (element) =>
        !element.classList.contains('rule-bottom') &&
        element.getBoundingClientRect().top < window.innerHeight,
    ).length;
  }, held);
  expect(onScreen).toBe(0);
});

test('content below the fold enters as it scrolls into view', async ({ page }) => {
  await page.goto('/approach/');
  const lastStep = page.locator('.timeline .step').last();
  await expect(lastStep).toHaveAttribute('data-reveal', 'pending');

  await lastStep.scrollIntoViewIfNeeded();
  await expect(lastStep).not.toHaveAttribute('data-reveal');
  await expect(lastStep).toHaveCSS('opacity', '1');
});

test('keyboard focus reveals held content', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit skips links on Tab, like Safari');
  await page.goto('/');
  // Mark the last held item with a link, so the locator still finds it once it has entered.
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('main [data-reveal="pending"]')];
    items
      .filter((element) => element.querySelector('a'))
      .at(-1)
      ?.setAttribute('data-test', '');
  });
  const item = page.locator('[data-test]');
  await item.locator('a').first().focus();
  await expect(item).not.toHaveAttribute('data-reveal');
  await expect(item).toHaveCSS('opacity', '1');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('holds nothing back', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator(held)).toHaveCount(0);
  });
});
