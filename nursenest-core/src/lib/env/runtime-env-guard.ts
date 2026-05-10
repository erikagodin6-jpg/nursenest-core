/**
 * Centralized **runtime-only** env validation for critical server-side toggles.
 *
 * - Reads `process.env` only inside exported functions (no import-time evaluation, no module cache).
 * - Skips during `next build` (`NEXT_PHASE === "phase-production-build"`).
 * - `NN_ENV_VALIDATION_MODE`: `strict` (throw, default) | `warn` | `off`.
 *
 * Standalone bootstrap uses `scripts/runtime-env-guard-bootstrap.mjs` (plain Node, no TS loader) — keep logic in sync.
 */

import "server-only";

import { openRouterApiKeyEnvPresent } from "@/lib/ai/blog-ai-env-keys";
import { blogChatUsesOpenRouter } from "@/lib/ai/blog-ai-routing";
import { isAuthSecretBuildToleranceContext, isAuthSecretConfigured } from "@/lib/auth/auth-session-signing-env";
import { assertRuntimeDatabaseEnvContract } from "./require-database-env";

const OPENAI_KEY_GROUP = ["AI_INTEGRATIONS_OPENAI_API_KEY", "OPENAI_API_KEY"] as const;
const ADMIN_AI_GENERATION_FLAG_GROUP = ["AI_ADMIN_GENERATION_ENABLED", "AI_ADMIN_GENERation"] as const;

function hasTrimmedEnv(key: string): boolean {
  const v = process.env[key];
  return Boolean(v && v.trim() !== "");
}

function hasOpenAiFunding(): boolean {
  return OPENAI_KEY_GROUP.some((k) => hasTrimmedEnv(k));
}

function hasAdminAiGenerationFlag(): boolean {
  return ADMIN_AI_GENERATION_FLAG_GROUP.some((k) => hasTrimmedEnv(k));
}

/** OpenAI keys, or OpenRouter key when blog/content chat is routed to OpenRouter. */
function satisfiesAiFundingContract(): boolean {
  if (hasOpenAiFunding()) return true;
  return blogChatUsesOpenRouter() && openRouterApiKeyEnvPresent();
}

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

function isNonDevelopmentNodeEnv(): boolean {
  /** Treat unset NODE_ENV like local tooling (tsx scripts) — not production auth context. */
  const n = process.env.NODE_ENV?.trim();
  if (!n || n === "development" || n === "test") return false;
  return true;
}

function collectMissingRuntimeEnvIssues(): string[] {
  const missing: string[] = [];

  if (!hasAdminAiGenerationFlag()) {
    missing.push("AI_ADMIN_GENERATION_ENABLED (or accepted typo alias AI_ADMIN_GENERation)");
  }

  if (!satisfiesAiFundingContract()) {
    missing.push(
      `One of: ${OPENAI_KEY_GROUP.join(", ")} — or OPENROUTER_API_KEY / BLOG_OPENROUTER_API_KEY when AI_PROVIDER=openrouter (or BLOG_AI_PROVIDER=openrouter)`,
    );
  }

  if (
    isNonDevelopmentNodeEnv() &&
    !isAuthSecretBuildToleranceContext() &&
    !isAuthSecretConfigured()
  ) {
    missing.push(
      "AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy) — required for Auth.js JWT signing at runtime (generate: openssl rand -base64 32)",
    );
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
    OPENROUTER_API_KEY_present: Boolean(process.env["OPENROUTER_API_KEY"]?.trim()),
    BLOG_OPENROUTER_API_KEY_present: Boolean(process.env["BLOG_OPENROUTER_API_KEY"]?.trim()),
    AI_PROVIDER: process.env["AI_PROVIDER"] ?? null,
    BLOG_AI_PROVIDER: process.env["BLOG_AI_PROVIDER"] ?? null,
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

  /** Fails fast before AI env checks — catches baked build ARG / missing DO runtime env on the bootstrap parent. */
  assertRuntimeDatabaseEnvContract();

  const mode = getEnvValidationMode();
  if (mode === "off") {
    return;
  }

  const missing = collectMissingRuntimeEnvIssues();
  if (missing.length === 0) {
    return;
  }

  const presentKeys = Object.keys(process.env).filter(
    (k) => k.includes("AI_") || k.includes("OPENAI") || k.includes("OPENROUTER"),
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
