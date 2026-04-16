/**
 * Run Prisma CLI with the same env resolution as app code and QA scripts:
 * 1. Load `nursenest-core/.env.local` → `.env.playwright.local` → `.env` (see `load-dotenv-for-cli.mts`).
 * 2. Apply `src/lib/db/env-bootstrap.ts` (tuning + deprecated `PROD_DATABASE_URL` → `DATABASE_URL`).
 * 3. Run `npx prisma …` with `cwd` = the nursenest-core package root (works when the shell cwd is the monorepo root).
 *
 * Usage:
 *   npm run db:deploy
 *   npx tsx scripts/run-prisma-with-env.mts migrate status
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import "./load-dotenv-for-cli.mts";
import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");

const scriptArgIndex = process.argv.findIndex((a) => /run-prisma-with-env\.(mts?|cjs|js)$/i.test(a));
const forwarded = scriptArgIndex >= 0 ? process.argv.slice(scriptArgIndex + 1) : [];

if (forwarded.length === 0) {
  console.error(
    "[run-prisma-with-env] Missing Prisma arguments. Example: tsx scripts/run-prisma-with-env.mts migrate status",
  );
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", ...forwarded], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status === null ? 1 : result.status);
