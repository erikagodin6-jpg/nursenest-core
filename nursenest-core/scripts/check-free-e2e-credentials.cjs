/**
 * Pre-flight for `qa:freemium:browser`: load the same dotenv files as `playwright.env.ts`, then verify
 * free-tier credentials exist (matches `playwright.config` free project gate).
 */
const { loadPlaywrightDotenv } = require("./playwright-dotenv-load.cjs");
loadPlaywrightDotenv();

const freeOk = process.env.E2E_FREE_EMAIL?.trim() && process.env.E2E_FREE_PASSWORD;
if (!freeOk) {
  console.error(
    "qa:freemium:browser requires E2E_FREE_EMAIL and E2E_FREE_PASSWORD (or add them to .env.playwright.local — see playwright.env.ts).",
  );
  process.exit(1);
}
