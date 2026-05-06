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
const BUILD_TIME_GENERATE_MESSAGE =
  "[prisma-safe] Build-time Prisma generate detected; DIRECT_URL requirement skipped.";
const CODEGEN_DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:65432/nn_prisma_codegen?schema=public";
const CODEGEN_DATABASE_URL_MESSAGE =
  "[prisma-safe] Prisma generate using codegen-only DATABASE_URL placeholder.";

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

export function isPrismaGenerateCommand(command, argv = process.argv) {
  if (command === "generate") return true;
  const commandString = argv.join(" ");
  return commandString.includes("generate");
}

export function isBuildSafePrismaGenerateContext({ command, argv = process.argv, env = process.env } = {}) {
  void command;
  const commandString = argv.join(" ");
  const isGenerate = commandString.includes("generate");
  const isBuild = env.NN_APP_PLATFORM_BUILD === "true" || env.NN_LOW_MEMORY_BUILD === "1";
  const isBuildGenerate = isBuild && isGenerate;
  return isBuildGenerate;
}

export function ensurePrismaGenerateEnv(env = process.env, logger = console) {
  if (!env.DATABASE_URL?.trim()) {
    env.DATABASE_URL = CODEGEN_DATABASE_URL;
    logger.log(CODEGEN_DATABASE_URL_MESSAGE);
  }
  if (!env.DIRECT_URL?.trim()) {
    env.DIRECT_URL = env.DATABASE_URL;
  }
}

export function loadPrismaSafeEnvForCommand(
  command,
  { argv = process.argv, env = process.env, logger = console, envRoot } = {},
) {
  const generateCommand = isPrismaGenerateCommand(command, argv);
  const buildSafeGenerate = isBuildSafePrismaGenerateContext({ command, argv, env });
  const telemetry = loadRuntimeEnv({
    purpose: `prisma-safe:${command}`,
    validate: !generateCommand,
    logger,
    ...(envRoot ? { envRoot } : {}),
  });

  if (generateCommand) {
    ensurePrismaGenerateEnv(env, logger);
  }

  if (buildSafeGenerate) {
    logger.log(BUILD_TIME_GENERATE_MESSAGE);
  }

  return { telemetry, buildSafeGenerate };
}

async function main() {
  const command = process.argv[2];
  if (!COMMANDS.has(command)) {
    usage();
    process.exit(1);
  }

  try {
    loadPrismaSafeEnvForCommand(command);
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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error("[prisma-safe] failed:");
    console.error(error?.stack ?? error);
    process.exit(1);
  });
}
