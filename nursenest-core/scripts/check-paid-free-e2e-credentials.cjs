/**
 * Pre-flight for running paid + free Playwright projects together.
 * Loads the same dotenv files as `playwright.env.ts`.
 */
const { loadPlaywrightDotenv } = require("./playwright-dotenv-load.cjs");
loadPlaywrightDotenv();

const paidOk =
  (process.env.E2E_PAID_EMAIL?.trim() && process.env.E2E_PAID_PASSWORD) ||
  (process.env.PLAYWRIGHT_TEST_EMAIL?.trim() && process.env.PLAYWRIGHT_TEST_PASSWORD);
const freeOk = process.env.E2E_FREE_EMAIL?.trim() && process.env.E2E_FREE_PASSWORD;

if (!paidOk || !freeOk) {
  console.error(
    "Requires paid creds (E2E_PAID_EMAIL+E2E_PAID_PASSWORD or PLAYWRIGHT_TEST_*) AND free tier (E2E_FREE_EMAIL+E2E_FREE_PASSWORD). Add to .env.playwright.local — see playwright.env.ts.",
  );
  process.exit(1);
}
