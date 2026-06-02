#!/usr/bin/env node

import { readFileSync } from "node:fs";

import {
  RUNTIME_ENV_FILE_ALLOWLIST,
  resolveRuntimeEnvFilePath,
  RuntimeEnvFileFallbackError,
  parseRuntimeEnvFile,
  validateRuntimeEnvFilePermissions,
} from "./lib/runtime-env-file-fallback.mjs";

const REQUIRED_KEYS = Object.freeze(["DATABASE_URL", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]);
const REQUIRED_AUTH_SECRET_GROUP = Object.freeze(["AUTH_SECRET", "NEXTAUTH_SECRET"]);
const REQUIRED_AUTH_URL_GROUP = Object.freeze(["AUTH_URL", "NEXTAUTH_URL"]);

function hasTrimmed(values, key) {
  return Boolean(values.get(key)?.trim());
}

function ensureAnyPresent(values, group, description) {
  if (group.some((key) => hasTrimmed(values, key))) {
    return;
  }

  throw new RuntimeEnvFileFallbackError(
    "RUNTIME_ENV_FILE_MISSING_KEYS",
    `Runtime env file is missing ${description}: expected one of ${group.join(", ")}.`,
    { group },
  );
}

function ensureRequiredKeys(values) {
  const missingKeys = REQUIRED_KEYS.filter((key) => !hasTrimmed(values, key));
  if (missingKeys.length > 0) {
    throw new RuntimeEnvFileFallbackError(
      "RUNTIME_ENV_FILE_MISSING_KEYS",
      `Runtime env file is missing required keys: ${missingKeys.join(", ")}.`,
      { missingKeys },
    );
  }

  ensureAnyPresent(values, REQUIRED_AUTH_SECRET_GROUP, "an auth signing secret");
  ensureAnyPresent(values, REQUIRED_AUTH_URL_GROUP, "an auth origin");
}

function ensureAllowlistedKeys(values) {
  const allowlist = new Set(RUNTIME_ENV_FILE_ALLOWLIST);
  const disallowedKeys = [...values.keys()].filter((key) => !allowlist.has(key)).sort();
  if (disallowedKeys.length > 0) {
    throw new RuntimeEnvFileFallbackError(
      "RUNTIME_ENV_FILE_DISALLOWED_KEYS",
      `Runtime env file contains disallowed keys: ${disallowedKeys.join(", ")}.`,
      { disallowedKeys },
    );
  }
}

function main() {
  const runtimeEnvFile = resolveRuntimeEnvFilePath(process.env);
  const mode = validateRuntimeEnvFilePermissions(runtimeEnvFile);
  const { values } = parseRuntimeEnvFile(readFileSync(runtimeEnvFile, "utf8"));

  ensureAllowlistedKeys(values);
  ensureRequiredKeys(values);

  const presentKeys = [...values.keys()].sort();
  console.log(
    `[runtime-env-file] prepare_runtime_env_file_ok:true runtime_env_file_path:${JSON.stringify(runtimeEnvFile)} file_mode:${JSON.stringify(mode.toString(8))} present_keys:${JSON.stringify(presentKeys)}`,
  );
}

try {
  main();
} catch (error) {
  if (error instanceof RuntimeEnvFileFallbackError) {
    console.error(`[runtime-env-file] prepare_runtime_env_file_ok:false error_code:${error.code} message:${JSON.stringify(error.message)}`);
    process.exit(1);
  }

  console.error(
    `[runtime-env-file] prepare_runtime_env_file_ok:false message:${JSON.stringify(error instanceof Error ? error.message : String(error))}`,
  );
  process.exit(1);
}
