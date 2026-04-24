/**
 * Run Prisma CLI with the same env resolution as app code and QA scripts:
 * 1. Load `nursenest-core/.env.local` → `.env.playwright.local` → `.env` (see `load-dotenv-for-cli.mts`).
 * 2. Apply `src/lib/db/env-bootstrap.ts` (URL tuning; `DATABASE_URL` only).
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
import { assertDatabaseUrlPresentOrExit } from "./lib/database-env-assert.mts";

/** `load-dotenv-for-cli.mts` already clears invalid `PRISMA_CLI_USE_DIRECT_URL`; repeat here so any future import reorder cannot skip it. */
function ensurePrismaCliDirectUrlFlagConsistent(): void {
  const direct = process.env.DIRECT_URL?.trim() ?? process.env.DATABASE_DIRECT_URL?.trim();
  if (process.env.PRISMA_CLI_USE_DIRECT_URL === "1" && !direct) {
    delete process.env.PRISMA_CLI_USE_DIRECT_URL;
    console.warn(
      "[run-prisma-with-env] PRISMA_CLI_USE_DIRECT_URL=1 but DIRECT_URL/DATABASE_DIRECT_URL is unset — Prisma will use DATABASE_URL.",
    );
  }
}
ensurePrismaCliDirectUrlFlagConsistent();

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

/** `prisma generate` does not open a DB; Prisma still needs a syntactically valid URL. Must not match the banned Docker placeholder (`127.0.0.1:5432/postgres`). */
const isGenerateOnly = forwarded[0] === "generate" && forwarded.length === 1;
if (isGenerateOnly && !process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL =
    "postgresql://nn_prisma_codegen:nn_prisma_codegen@127.0.0.1:65432/nn_prisma_codegen?schema=public";
  console.warn(
    "[run-prisma-with-env] DATABASE_URL unset — using local Prisma codegen stub (no network). For migrate/db push, set DATABASE_URL in .env.local.",
  );
}

await import("../src/lib/db/env-bootstrap");

assertDatabaseUrlPresentOrExit("Prisma CLI requires DATABASE_URL (loaded from nursenest-core env files).");

const result = spawnSync("npx", ["prisma", ...forwarded], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status === null ? 1 : result.status);
