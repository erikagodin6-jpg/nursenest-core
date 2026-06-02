#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { loadRuntimeEnv, maskedPostgresTarget, isRuntimeEnvError } from "./lib/load-runtime-env.mjs";
import {
  assertRequiredColumnsFromDatabaseUrl,
  formatMissingColumns,
  isSchemaReadinessError,
  withPgClient,
} from "./lib/schema-readiness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");

function localPrismaCommand() {
  const bin = process.platform === "win32" ? "prisma.cmd" : "prisma";
  const candidate = resolve(packageRoot, "node_modules", ".bin", bin);
  return existsSync(candidate) ? candidate : "npx";
}

function scrubSecrets(text) {
  return String(text ?? "").replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted-postgres-url]");
}

function runMigrateStatus() {
  const command = localPrismaCommand();
  const args = command === "npx" ? ["prisma", "migrate", "status"] : ["migrate", "status"];
  return spawnSync(command, args, {
    cwd: packageRoot,
    encoding: "utf8",
    env: process.env,
    shell: process.platform === "win32",
  });
}

async function main() {
  const blockers = [];
  console.log("[production-preflight] Starting NurseNest production database preflight...");

  try {
    loadRuntimeEnv({ purpose: "production-preflight" });
    console.log("[production-preflight] env: PASS (DATABASE_URL and DIRECT_URL visible to Node)");
    const target = maskedPostgresTarget(process.env.DATABASE_URL);
    console.log(`[production-preflight] production DB host: ${target.host}:${target.port}/${target.database}`);
  } catch (error) {
    if (isRuntimeEnvError(error)) blockers.push(error.message);
    else throw error;
  }

  if (blockers.length === 0) {
    try {
      await withPgClient(process.env.DATABASE_URL, async (client) => {
        await client.query("SELECT 1");
      });
      console.log("[production-preflight] database connection: PASS");
    } catch (error) {
      blockers.push(`DATABASE_CONNECT_FAILED: ${error?.message ?? error}`);
    }
  }

  if (blockers.length === 0) {
    const status = runMigrateStatus();
    if (status.status === 0) {
      console.log("[production-preflight] migrations applied: PASS");
    } else {
      blockers.push(
        `MIGRATIONS_NOT_READY: prisma migrate status failed (exit ${status.status ?? 1}).\n` +
          scrubSecrets(status.stdout) +
          scrubSecrets(status.stderr),
      );
    }
  }

  if (blockers.length === 0) {
    try {
      await assertRequiredColumnsFromDatabaseUrl(process.env.DATABASE_URL);
      console.log("[production-preflight] required columns: PASS");
    } catch (error) {
      if (isSchemaReadinessError(error)) {
        blockers.push(`SCHEMA_NOT_READY:\n${formatMissingColumns(error.missingColumns)}`);
      } else {
        throw error;
      }
    }
  }

  console.log("[production-preflight] allied audit fallback zero-count mode: disabled");

  if (blockers.length > 0) {
    console.error("[production-preflight] FAIL");
    for (const blocker of blockers) {
      console.error(`- ${blocker}`);
    }
    process.exit(1);
  }

  console.log("[production-preflight] PASS");
}

main().catch((error) => {
  console.error("[production-preflight] FAIL");
  console.error(error?.stack ?? error);
  process.exit(1);
});
