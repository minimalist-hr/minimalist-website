/**
 * Lighthouse CI with retries (`pnpm run test:lighthouse`, plan §11.1).
 *
 * In the CI container Lighthouse sometimes fails to record a page load (NO_NAVSTART), a
 * browser flake unrelated to the site. `lhci autorun` has no retry, so this collects one run
 * at a time, retries a run that fails, then asserts and uploads as autorun would.
 * URLs, run count, server and thresholds stay in lighthouserc.cjs.
 */
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ci } = require('../lighthouserc.cjs');

/** Attempts per run before the audit fails. */
const ATTEMPTS = 3;

function lhci(...args) {
  // shell: true resolves pnpm's .cmd shim on Windows; the arguments contain no user input.
  const result = spawnSync('pnpm', ['exec', 'lhci', ...args], { stdio: 'inherit', shell: true });
  return result.status === 0;
}

// Collected runs and the uploaded reports both live here; start clean.
rmSync('.lighthouseci', { recursive: true, force: true });

for (const url of ci.collect.url) {
  for (let run = 1; run <= ci.collect.numberOfRuns; run++) {
    let collected = false;
    for (let attempt = 1; attempt <= ATTEMPTS && !collected; attempt++) {
      console.log(`\n[lighthouse] ${url}: run ${run}, attempt ${attempt}/${ATTEMPTS}`);
      collected = lhci('collect', '--additive', `--url=${url}`, '--numberOfRuns=1');
    }
    if (!collected) {
      console.error(`[lighthouse] ${url}: run ${run} failed ${ATTEMPTS} times`);
      process.exit(1);
    }
  }
}

process.exit(lhci('assert') && lhci('upload') ? 0 : 1);
