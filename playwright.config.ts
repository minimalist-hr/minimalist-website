import { defineConfig, devices } from '@playwright/test';

/**
 * Accessibility audit (plan §11.2), run in CI on merge requests (`pnpm run test:a11y`).
 * Serves the built site on the Workers runtime, so headers, 404 handling and the Worker
 * behave as in production. Run `pnpm run build` first.
 * `test:a11y` (CI) runs the two Chromium projects; `test:a11y:browsers` also runs Firefox
 * and WebKit (local only; needs `pnpm exec playwright install firefox webkit` once).
 */
const PORT = 8787;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
  },

  // Both designs: the mobile layout below md and the desktop layout above it.
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'webkit-mobile', use: { ...devices['iPhone 15'] } },
  ],

  webServer: {
    command: `pnpm exec wrangler dev --port ${PORT} --ip 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { WRANGLER_SEND_METRICS: 'false' },
  },
});
