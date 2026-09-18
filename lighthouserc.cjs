/**
 * Lighthouse CI (plan §11.1), run in CI on merge requests (`pnpm run test:lighthouse`).
 * Mobile emulation (Lighthouse's default) against the built site on the Workers runtime.
 * Run `pnpm run build` first. Uses Playwright's Chromium, so there is one browser to manage.
 */
const { chromium } = require('@playwright/test');

const PORT = 8788;
const base = `http://127.0.0.1:${PORT}`;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm exec wrangler dev --port ${PORT} --ip 127.0.0.1`,
      startServerReadyPattern: 'Ready on',
      startServerReadyTimeout: 120000,
      chromePath: chromium.executablePath(),
      // The pages plan §11.1 names: home, a case study, contact.
      url: [`${base}/`, `${base}/work/core-banking-rebuilt/`, `${base}/contact/`],
      // Median of three runs, to smooth out noisy shared CI runners.
      numberOfRuns: 3,
      settings: {
        // --disable-dev-shm-usage: Docker's 64 MB /dev/shm crashes Chrome tabs in CI.
        chromeFlags: '--no-sandbox --headless=new --disable-dev-shm-usage',
        // Turnstile is third-party and its challenge never settles in the headless CI
        // container, so the contact page never finishes loading. Block it: the audit
        // measures our code, and the form already handles Turnstile failing to load.
        blockedUrlPatterns: ['*challenges.cloudflare.com*'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
