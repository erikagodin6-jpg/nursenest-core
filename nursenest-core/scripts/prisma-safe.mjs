#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { loadRuntimeEnv, isRuntimeEnvError } from "./lib/load-runtime-env.mjs";
import {
  assertRequiredColumnsFromDatabaseUrl,
  formatMissingColumns,
  isSchemaReadinessError,
} from "./lib/schema-readiness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");

const COMMANDS = new Set(["status", "deploy", "generate", "check-schema"]);

function usage() {
  console.error(`Usage: node scripts/prisma-safe.mjs <status|deploy|generate|check-schema>

Safe Prisma commands:
  status       Load canonical env, then run prisma migrate status
  deploy       Load canonical env, run prisma migrate deploy, then verify required columns
  generate     Load canonical env, then run prisma generate
  check-schema Load canonical env, then verify production-required columns
`);
}

function localPrismaCommand() {
  const bin = process.platform === "win32" ? "prisma.cmd" : "prisma";
  const candidate = resolve(packageRoot, "node_modules", ".bin", bin);
  return existsSync(candidate) ? candidate : "npx";
}

function runPrisma(args) {
  const command = localPrismaCommand();
  const finalArgs = command === "npx" ? ["prisma", ...args] : args;
  const result = spawnSync(command, finalArgs, {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  return result.status === null ? 1 : result.status;
}

async function main() {
  const command = process.argv[2];
  if (!COMMANDS.has(command)) {
    usage();
    process.exit(1);
  }

  try {
    loadRuntimeEnv({ purpose: `prisma-safe:${command}` });
  } catch (error) {
    if (isRuntimeEnvError(error)) {
      console.error(`[prisma-safe] ${error.message}`);
      process.exit(1);
    }
    throw error;
  }

  if (command === "check-schema") {
    try {
      await assertRequiredColumnsFromDatabaseUrl(process.env.DATABASE_URL);
      console.log("[prisma-safe] check-schema PASS: required production columns exist.");
      process.exit(0);
    } catch (error) {
      if (isSchemaReadinessError(error)) {
        console.error("[prisma-safe] SCHEMA_NOT_READY: required columns are missing:");
        console.error(formatMissingColumns(error.missingColumns));
        process.exit(1);
      }
      throw error;
    }
  }

  const argsByCommand = {
    status: ["migrate", "status"],
    deploy: ["migrate", "deploy"],
    generate: ["generate"],
  };

  const exitCode = runPrisma(argsByCommand[command]);
  if (exitCode !== 0) process.exit(exitCode);

  if (command === "deploy") {
    try {
      await assertRequiredColumnsFromDatabaseUrl(process.env.DATABASE_URL);
      console.log("[prisma-safe] post-deploy schema check PASS.");
    } catch (error) {
      if (isSchemaReadinessError(error)) {
        console.error("[prisma-safe] SCHEMA_NOT_READY after migrate deploy:");
        console.error(formatMissingColumns(error.missingColumns));
        process.exit(1);
      }
      throw error;
    }
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("[prisma-safe] failed:");
  console.error(error?.stack ?? error);
  process.exit(1);
});
