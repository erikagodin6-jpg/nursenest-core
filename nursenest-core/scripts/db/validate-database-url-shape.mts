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
import "../../src/lib/db/env-bootstrap";
import {
  evaluateDatabaseUrlShape,
  runDatabaseUrlShapeGuardForProcess,
} from "../../src/lib/db/database-url-drift-audit";

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
