/**
 * Load optional env before `playwright.config.ts` evaluates paid/free credential gates.
 * - `PLAYWRIGHT_DOTENV_PATH`: explicit path to a dotenv file
 * - Else, if `.env.playwright.local` exists in the package root, load it (gitignored via `.env*`)
 *
 * Does not override variables already set in the process environment (`override: false`).
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

const explicit = process.env.PLAYWRIGHT_DOTENV_PATH?.trim();
const local = resolve(process.cwd(), ".env.playwright.local");
const pathToLoad = explicit || (existsSync(local) ? local : undefined);
if (pathToLoad) {
  config({ path: pathToLoad, override: false });
}
