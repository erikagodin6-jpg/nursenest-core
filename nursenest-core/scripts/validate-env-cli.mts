#!/usr/bin/env npx tsx
/**
 * Centralized env validation CLI (invoked via `node scripts/validate-env.mjs`).
 *
 * Profiles:
 * - default (`dev`): DATABASE_URL shape, conflicts, Prisma DIRECT_URL hints, localhost misuse when prod-like.
 * - `--ci`: stricter public surface + URL shape (for CI jobs that may omit secrets).
 * - `--production`: full production guard issues (requires typical production env vars).
 *
 * Flags:
 * - `--json` — machine-readable output
 * - `--strict` — treat warnings as failures
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import {
  buildEnvDiagnosticsReport,
  formatEnvDiagnosticsReportHuman,
  formatEnvDiagnosticsReportJson,
} from "../src/lib/env/env-diagnostics.ts";

const root = process.cwd();

for (const f of [".env.local", ".env", ".env.production"]) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) {
    config({ path: p, override: false, quiet: true });
  }
}

const argv = process.argv.slice(2);
const json = argv.includes("--json");
const strict = argv.includes("--strict");
const ci = argv.includes("--ci");
const production = argv.includes("--production");

const profile = production ? "production" : ci ? "ci" : "dev";

const report = buildEnvDiagnosticsReport({ profile, strict });

if (json) {
  console.log(formatEnvDiagnosticsReportJson(report));
} else {
  console.log(formatEnvDiagnosticsReportHuman(report));
}

process.exit(report.exitCode);
