/**
 * Shared dotenv load for Playwright credential checks (same rules as `playwright.env.ts`).
 */
const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { config } = require("dotenv");

function loadPlaywrightDotenv() {
  const packageRoot = process.cwd();
  const explicit = process.env.PLAYWRIGHT_DOTENV_PATH?.trim();
  if (explicit) {
    config({ path: explicit, override: false });
    return;
  }
  const envLocalPath = resolve(packageRoot, ".env.local");
  const envPlaywrightPath = resolve(packageRoot, ".env.playwright.local");
  const envPath = resolve(packageRoot, ".env");
  if (existsSync(envLocalPath)) {
    config({ path: envLocalPath, override: false });
  }
  if (existsSync(envPlaywrightPath)) {
    config({ path: envPlaywrightPath, override: false });
  }
  if (existsSync(envPath)) {
    config({ path: envPath, override: false });
  }
}

module.exports = { loadPlaywrightDotenv };
