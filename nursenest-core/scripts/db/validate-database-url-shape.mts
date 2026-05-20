#!/usr/bin/env npx tsx
/**
 * CI / optional guard: fail only when DATABASE_URL is missing or malformed.
 * Does **not** compare DATABASE_URL to any other environment value.
 *
 * - `NN_DATABASE_URL_SHAPE_GUARD=1`: require a parseable DATABASE_URL (exit 1 if missing/malformed).
 * - `CI=true` / `CI=1`: if DATABASE_URL is set in the job, it must be parseable; if unset, exit 0 (no secret required).
 *
 * Usage: `npm run db:validate-url-shape`
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";

const explicitDotenvPath = process.env.DOTENV_CONFIG_PATH?.trim();
const dotenvPath = explicitDotenvPath
  ? path.isAbsolute(explicitDotenvPath)
    ? explicitDotenvPath
    : path.resolve(process.cwd(), explicitDotenvPath)
  : path.join(process.cwd(), ".env.local");

if (fs.existsSync(dotenvPath)) {
  config({ path: dotenvPath, override: false, quiet: true });
}

const driftAuditModule = await import("../../src/lib/db/database-url-drift-audit.ts");
const {
  evaluateDatabaseUrlShape,
  runDatabaseUrlShapeGuardForProcess,
} = driftAuditModule.default ?? driftAuditModule;

const outcome = runDatabaseUrlShapeGuardForProcess();
if (outcome === "fail") {
  const r = evaluateDatabaseUrlShape();
  console.error(
    JSON.stringify(
      {
        ok: false,
        event: "database_url_shape_guard_failed",
        outcome: r.ok ? "unexpected" : r.reason,
        ci: process.env.CI ?? null,
        NN_DATABASE_URL_SHAPE_GUARD: process.env.NN_DATABASE_URL_SHAPE_GUARD ?? null,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      event: "database_url_shape_guard_ok",
      outcome,
      ci: process.env.CI ?? null,
      NN_DATABASE_URL_SHAPE_GUARD: process.env.NN_DATABASE_URL_SHAPE_GUARD ?? null,
    },
    null,
    2,
  ),
);
