/**
 * Load optional env before `playwright.config.ts` evaluates paid/free credential gates.
 *
 * Order matches `scripts/check-e2e-database-connect.cjs` / `learning-routes-e2e-preflight.cjs` so
 * `DATABASE_URL` from `.env.local` is visible to the Playwright process (not only preflight scripts).
 *
 * - `PLAYWRIGHT_DOTENV_PATH`: if set, load that file only (override: false).
 * - Else: `.env.local` → `.env.playwright.local` → `.env` (override: false — shell / CI env wins).
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

const packageRoot = process.cwd();
const explicit = process.env.PLAYWRIGHT_DOTENV_PATH?.trim();

if (explicit) {
  config({ path: explicit, override: false });
} else {
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
