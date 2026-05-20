/**
 * Pre-flight for `qa:paid-smoke:browser`: load the same dotenv files as `playwright.env.ts`, then verify
 * paid credentials exist (so the npm pre-check matches Playwright's `hasPaidTestCredentials()`).
 */
const { loadPlaywrightDotenv } = require("./playwright-dotenv-load.cjs");
loadPlaywrightDotenv();

const qa = process.env.QA_PAID_EMAIL?.trim();
const qb = process.env.QA_PAID_PASSWORD;
const a = process.env.E2E_PAID_EMAIL?.trim();
const b = process.env.E2E_PAID_PASSWORD;
const c = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
const d = process.env.PLAYWRIGHT_TEST_PASSWORD;
const hasQa = qa && qb !== undefined && String(qb).length > 0;
const hasE2e = Boolean(a && b);
const hasPw = Boolean(c && d);
if (!(hasQa || hasE2e || hasPw)) {
  console.error(
    "Paid E2E requires QA_PAID_EMAIL+QA_PAID_PASSWORD, or E2E_PAID_EMAIL+E2E_PAID_PASSWORD, or PLAYWRIGHT_TEST_EMAIL+PLAYWRIGHT_TEST_PASSWORD (see .env.playwright.local — playwright.env.ts).",
  );
  process.exit(1);
}
