/**
 * Plain-Node duplicate of `src/lib/env/runtime-env-guard.ts` for `start-standalone.mjs` and CLI checks
 * (production image has no TS runtime loader). **Keep in sync** with the TypeScript module.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";

const REQUIRED_RUNTIME_ENVS = ["AI_ADMIN_GENERATION_ENABLED"];

const REQUIRED_ONE_OF = [["AI_INTEGRATIONS_OPENAI_API_KEY", "OPENAI_API_KEY"]];

function isNextProductionBuildPhase() {
  return process.env["NEXT_PHASE"] === "phase-production-build";
}

function getEnvValidationMode() {
  const raw = (process.env["NN_ENV_VALIDATION_MODE"] ?? "strict").trim().toLowerCase();
  if (raw === "off") return "off";
  if (raw === "warn") return "warn";
  return "strict";
}

function collectMissingRuntimeEnvIssues() {
  const missing = [];

  for (const key of REQUIRED_RUNTIME_ENVS) {
    const v = process.env[key];
    if (!v || v.trim() === "") {
      missing.push(key);
    }
  }

  for (const group of REQUIRED_ONE_OF) {
    const hasOne = group.some((k) => {
      const val = process.env[k];
      return Boolean(val && val.trim() !== "");
    });
    if (!hasOne) {
      missing.push(`One of: ${group.join(", ")}`);
    }
  }

  return missing;
}

export function logRuntimeEnvSnapshot() {
  if (isNextProductionBuildPhase()) {
    return;
  }

  const snapshot = {
    AI_ADMIN_GENERATION_ENABLED_present: Boolean(process.env["AI_ADMIN_GENERATION_ENABLED"]),
    AI_ADMIN_GENERATION_ENABLED_value: process.env["AI_ADMIN_GENERATION_ENABLED"] ?? null,
    AI_INTEGRATIONS_OPENAI_API_KEY_present: Boolean(process.env["AI_INTEGRATIONS_OPENAI_API_KEY"]),
    OPENAI_API_KEY_present: Boolean(process.env["OPENAI_API_KEY"]),
    NN_ENV_VALIDATION_MODE: process.env["NN_ENV_VALIDATION_MODE"] ?? null,
  };

  console.error("[ENV SNAPSHOT]", snapshot);
}

export function validateRuntimeEnvOrThrow() {
  if (isNextProductionBuildPhase()) {
    return;
  }

  const mode = getEnvValidationMode();
  if (mode === "off") {
    return;
  }

  const missing = collectMissingRuntimeEnvIssues();
  if (missing.length === 0) {
    return;
  }

  const presentKeys = Object.keys(process.env).filter((k) => k.includes("AI_") || k.includes("OPENAI"));

  console.error("[ENV VALIDATION ERROR]", {
    missing,
    presentKeys,
  });

  const message = `Missing required runtime env vars: ${missing.join(", ")}`;

  if (mode === "warn") {
    console.error("[ENV VALIDATION WARN]", message);
    return;
  }

  throw new Error(message);
}

const isMain =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  logRuntimeEnvSnapshot();
  validateRuntimeEnvOrThrow();
}
