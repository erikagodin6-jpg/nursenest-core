/**
 * Centralized **runtime-only** env validation for critical server-side toggles.
 *
 * - Reads `process.env` only inside exported functions (no import-time evaluation, no module cache).
 * - Skips during `next build` (`NEXT_PHASE === "phase-production-build"`).
 * - `NN_ENV_VALIDATION_MODE`: `strict` (throw, default) | `warn` | `off`.
 *
 * Standalone bootstrap uses `scripts/runtime-env-guard-bootstrap.mjs` (plain Node, no TS loader) — keep logic in sync.
 */

const REQUIRED_RUNTIME_ENVS = ["AI_ADMIN_GENERATION_ENABLED"] as const;

const REQUIRED_ONE_OF = [
  ["AI_INTEGRATIONS_OPENAI_API_KEY", "OPENAI_API_KEY"],
] as const;

function isNextProductionBuildPhase(): boolean {
  return process.env["NEXT_PHASE"] === "phase-production-build";
}

type EnvValidationMode = "strict" | "warn" | "off";

function getEnvValidationMode(): EnvValidationMode {
  const raw = (process.env["NN_ENV_VALIDATION_MODE"] ?? "strict").trim().toLowerCase();
  if (raw === "off") return "off";
  if (raw === "warn") return "warn";
  return "strict";
}

function collectMissingRuntimeEnvIssues(): string[] {
  const missing: string[] = [];

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

/**
 * Safe diagnostic line — **never** logs API key material; toggle value is non-secret config.
 */
export function logRuntimeEnvSnapshot(): void {
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

/**
 * Validates critical runtime env. During Next production build phase or when mode is `off`, no-ops.
 * `warn` logs and returns; `strict` throws on any missing requirement.
 */
export function validateRuntimeEnvOrThrow(): void {
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

  const presentKeys = Object.keys(process.env).filter(
    (k) => k.includes("AI_") || k.includes("OPENAI"),
  );

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
