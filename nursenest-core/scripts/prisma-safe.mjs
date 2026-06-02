#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { loadRuntimeEnv, isRuntimeEnvError, maskedPostgresTarget } from "./lib/load-runtime-env.mjs";
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

function usage() {
  console.error(`Usage: node scripts/prisma-safe.mjs <status|deploy|generate|check-schema>

Safe Prisma commands:
  status       Load canonical env, then run prisma migrate status
  deploy       Load canonical env, run prisma migrate deploy, then verify required columns
  generate     Load canonical env, then run prisma generate
  check-schema Load canonical env, then verify production-required columns
`);
}

function resolvePrismaBinary() {
  const bin = process.platform === "win32" ? "prisma.cmd" : "prisma";
  const candidate = resolve(packageRoot, "node_modules", ".bin", bin);
  if (existsSync(candidate)) {
    return candidate;
  }
  throw new Error(
    "[prisma-safe] Prisma CLI not installed. Run `npm --prefix nursenest-core ci` to install the pinned Prisma version before invoking prisma-safe.",
  );
}

function runPrisma(args) {
  let command;
  try {
    command = resolvePrismaBinary();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
  const result = spawnSync(command, args, {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  return result.status === null ? 1 : result.status;
}

export function isPrismaGenerateCommand(command, argv = process.argv) {
  const commandString = argv.join(" ");
  return commandString.includes("generate");
}

export function isBuildSafePrismaGenerateContext({ command, argv = process.argv, env = process.env } = {}) {
  void command;
  const commandString = argv.join(" ");
  const isGenerate = commandString.includes("generate");
  if (!isGenerate) return false;
  const isBuild =
    env.NN_APP_PLATFORM_BUILD === "true" ||
    env.NN_LOW_MEMORY_BUILD === "1" ||
    env.GITHUB_ACTIONS === "true" ||
    env.CI === "true";
  // prisma generate only reads schema.prisma — never connects to DB.
  // Allow it to run safely whenever DATABASE_URL is absent, regardless of context.
  const noDatabaseUrl = !env.DATABASE_URL?.trim();
  return isBuild || noDatabaseUrl;
}

// prisma generate reads schema.prisma to emit TypeScript types — it never connects to the DB.
// In CI/build contexts without DATABASE_URL, inject a syntactically valid dummy so Prisma's
// env-var parser is satisfied without a real connection.
const PRISMA_GENERATE_DUMMY_URL = "postgresql://ci:ci@localhost:5432/ci_generate_dummy";

export function assertDatabaseUrlForBuildGenerate(env = process.env) {
  if (!env.DATABASE_URL?.trim()) {
    process.env.DATABASE_URL = PRISMA_GENERATE_DUMMY_URL;
    if (!process.env.DIRECT_URL?.trim()) {
      process.env.DIRECT_URL = PRISMA_GENERATE_DUMMY_URL;
    }
    console.log("[prisma-safe] generate: DATABASE_URL absent in CI/build — using dummy for schema codegen (no DB connection made).");
    return;
  }
  maskedPostgresTarget(env.DATABASE_URL?.trim(), "DATABASE_URL");
}

export function loadPrismaSafeEnvForCommand(
  command,
  { argv = process.argv, env = process.env, logger = console, envRoot } = {},
) {
  const buildSafeGenerate = isBuildSafePrismaGenerateContext({ command, argv, env });
  const telemetry = loadRuntimeEnv({
    purpose: `prisma-safe:${command}`,
    validate: !buildSafeGenerate,
    logger,
    ...(envRoot ? { envRoot } : {}),
  });

  if (buildSafeGenerate) {
    assertDatabaseUrlForBuildGenerate(env);
    if (!process.env.DIRECT_URL?.trim()) {
      process.env.DIRECT_URL = process.env.DATABASE_URL;
    }
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
