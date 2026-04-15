/**
 * Pre-flight for `qa:paid-smoke:browser`: load the same dotenv files as `playwright.env.ts`, then verify
 * paid credentials exist (so the npm pre-check matches Playwright's `hasPaidTestCredentials()`).
 */
const { loadPlaywrightDotenv } = require("./playwright-dotenv-load.cjs");
loadPlaywrightDotenv();

const a = process.env.E2E_PAID_EMAIL?.trim();
const b = process.env.E2E_PAID_PASSWORD;
const c = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
const d = process.env.PLAYWRIGHT_TEST_PASSWORD;
if (!((a && b) || (c && d))) {
  console.error(
    "qa:paid-smoke:browser requires E2E_PAID_EMAIL+E2E_PAID_PASSWORD or PLAYWRIGHT_TEST_EMAIL+PLAYWRIGHT_TEST_PASSWORD (or add them to .env.playwright.local — see playwright.env.ts).",
  );
  process.exit(1);
}
