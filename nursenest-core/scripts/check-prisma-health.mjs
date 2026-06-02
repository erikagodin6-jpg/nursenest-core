#!/usr/bin/env node
/**
 * Prisma connectivity + migration status (read-only). Does not apply migrations or mutate data.
 *
 *   npm run prisma:health
 *   NN_PRISMA_HEALTH_SKIP_MIGRATE_STATUS=1 npm run prisma:health
 *
 * Loads DATABASE_URL / DIRECT_URL via the same `.env*` merge rules as other Prisma scripts.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadRuntimeEnv, maskedPostgresTarget } from "./lib/load-runtime-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

function prismaBin() {
  const win = process.platform === "win32";
  const p = join(packageRoot, "node_modules", ".bin", win ? "prisma.cmd" : "prisma");
  return existsSync(p) ? p : null;
}

function runPrisma(args, input) {
  const bin = prismaBin();
  const cmd = bin ?? "npx";
  const finalArgs = bin ? args : ["prisma", ...args];
  return spawnSync(cmd, finalArgs, {
    cwd: packageRoot,
    encoding: "utf-8",
    input: input ?? undefined,
    env: process.env,
    shell: process.platform === "win32",
  });
}

try {
  loadRuntimeEnv({ purpose: "prisma-health", validate: true, quiet: false });
} catch (e) {
  console.error("[prisma:health] FATAL: could not load/validate database env.");
  console.error(String(e?.message ?? e));
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
  console.error("[prisma:health] DATABASE_URL is unset — cannot probe database.");
  process.exit(1);
}

let masked;
try {
  masked = maskedPostgresTarget(dbUrl, "DATABASE_URL");
} catch (e) {
  console.error("[prisma:health] DATABASE_URL is not parseable as postgres URL.");
  console.error(String(e?.message ?? e));
  process.exit(1);
}

console.error(`[prisma:health] target host=${masked.host} port=${masked.port} db=${masked.database}`);

const schema = "prisma/schema.prisma";
const sql = "SELECT 1 AS prisma_health_ok;";
const exec = runPrisma(["db", "execute", "--stdin", "--schema", schema], sql);
if (exec.status !== 0) {
  console.error("[prisma:health] db execute failed (connection, credentials, TLS, or pooler).");
  if (exec.stderr) console.error(exec.stderr.slice(0, 4000));
  if (exec.stdout) console.error(exec.stdout.slice(0, 4000));
  process.exit(exec.status ?? 1);
}

console.error("[prisma:health] SELECT 1 OK");

if (process.env.NN_PRISMA_HEALTH_SKIP_MIGRATE_STATUS === "1") {
  console.error("[prisma:health] migrate status skipped (NN_PRISMA_HEALTH_SKIP_MIGRATE_STATUS=1)");
  process.exit(0);
}

const st = runPrisma(["migrate", "status", "--schema", schema], null);
console.error("[prisma:health] --- prisma migrate status ---");
if (st.stdout) process.stdout.write(st.stdout);
if (st.stderr) process.stderr.write(st.stderr);

if (st.status !== 0) {
  console.error("[prisma:health] migrate status non-zero — schema/migration drift likely. See reports/prisma-drift-prevention.md");
  process.exit(st.status ?? 1);
}

process.exit(0);
