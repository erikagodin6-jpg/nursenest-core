/**
 * Shared dotenv load for Playwright credential checks (same rules as `playwright.env.ts`).
 */
const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { config } = require("dotenv");

function loadPlaywrightDotenv() {
  const explicit = process.env.PLAYWRIGHT_DOTENV_PATH?.trim();
  const local = resolve(process.cwd(), ".env.playwright.local");
  if (explicit) {
    config({ path: explicit, override: false });
  } else if (existsSync(local)) {
    config({ path: local, override: false });
  }
}

module.exports = { loadPlaywrightDotenv };
