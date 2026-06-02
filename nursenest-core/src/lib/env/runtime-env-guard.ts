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
const EARLY_RUNTIME_PRESENCE_KEYS = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "STRIPE_SECRET_KEY",
  "NEXTAUTH_URL",
  "AUTH_URL",
  "PORT",
  "HOSTNAME",
] as const;

function hasTrimmedEnv(key: string): boolean {
  const v = process.env[key];
  return Boolean(v && v.trim() !== "");
}

function hasOpenAiFunding(): boolean {
  return OPENAI_KEY_GROUP.some((k) => hasTrimmedEnv(k));
}

/** First non-empty flag wins; unknown tokens are `ambiguous` (still require AI funding). */
function parseAdminAiGenerationIntent(): "unset" | "off" | "on" | "ambiguous" {
  for (const k of ADMIN_AI_GENERATION_FLAG_GROUP) {
    const v = process.env[k]?.trim();
    if (!v) continue;
    const lower = v.toLowerCase();
    if (["false", "0", "off", "no", "disabled"].includes(lower)) return "off";
    if (["true", "1", "on", "yes", "enabled"].includes(lower)) return "on";
    return "ambiguous";
  }
  return "unset";
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

function validateOriginLikeSetting(key: "AUTH_URL" | "NEXTAUTH_URL"): string | null {
  const raw = process.env[key]?.trim();
  if (!raw) return null;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return `${key} must be a valid absolute http(s) origin.`;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return `${key} must use http:// or https://.`;
  }

  if ((parsed.pathname && parsed.pathname !== "/") || parsed.search || parsed.hash) {
    return `${key} must be origin-only (for example https://www.nursenest.ca, not a path).`;
  }

  return null;
}

function collectAuthOriginIssues(): string[] {
  const issues: string[] = [];
  const authUrl = process.env.AUTH_URL?.trim();
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();

  if (!authUrl && !nextAuthUrl) return [];

  for (const key of ["AUTH_URL", "NEXTAUTH_URL"] as const) {
    const issue = validateOriginLikeSetting(key);
    if (issue) issues.push(issue);
  }

  if (authUrl && nextAuthUrl) {
    try {
      if (new URL(authUrl).origin !== new URL(nextAuthUrl).origin) {
        issues.push("AUTH_URL and NEXTAUTH_URL must resolve to the same origin when both are set.");
      }
    } catch {
      /* per-key parse errors are already surfaced above */
    }
  }

  return issues;
}

function collectMissingRuntimeEnvIssues(): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const adminAiIntent = parseAdminAiGenerationIntent();
  if (adminAiIntent === "unset") {
    errors.push("AI_ADMIN_GENERATION_ENABLED (or accepted typo alias AI_ADMIN_GENERation)");
  }

  const requiresAiFunding = adminAiIntent === "on" || adminAiIntent === "ambiguous";

  if (requiresAiFunding && !satisfiesAiFundingContract()) {
    errors.push(
      `One of: ${OPENAI_KEY_GROUP.join(", ")} — or OPENROUTER_API_KEY / BLOG_OPENROUTER_API_KEY when AI_PROVIDER=openrouter (or BLOG_AI_PROVIDER=openrouter)`,
    );
  }

  if (
    isNonDevelopmentNodeEnv() &&
    !isAuthSecretBuildToleranceContext() &&
    !isAuthSecretConfigured()
  ) {
    errors.push(
      "AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy) — required for Auth.js JWT signing at runtime (generate: openssl rand -base64 32)",
    );
  }

  errors.push(...collectAuthOriginIssues());

  if (isNonDevelopmentNodeEnv() && !hasTrimmedEnv("STRIPE_SECRET_KEY")) {
    warnings.push(
      "STRIPE_SECRET_KEY missing — app boot is allowed, but checkout/session creation will fail on billing routes.",
    );
  }

  return { errors, warnings };
}

/**
 * Safe diagnostic line — **never** logs API key material; toggle value is non-secret config.
 */
export function logRuntimeEnvSnapshot(): void {
  if (isNextProductionBuildPhase()) {
    return;
  }

  const snapshot = Object.fromEntries(
    EARLY_RUNTIME_PRESENCE_KEYS.map((key) => [key + "_present", Boolean(process.env[key]?.trim())]),
  );

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

  const diagnostics = collectMissingRuntimeEnvIssues();
  if (diagnostics.errors.length === 0 && diagnostics.warnings.length === 0) {
    return;
  }

  if (diagnostics.warnings.length > 0) {
    console.error("[ENV VALIDATION WARN]", { warnings: diagnostics.warnings });
  }

  if (diagnostics.errors.length === 0) {
    return;
  }

  console.error("[ENV VALIDATION ERROR]", {
    errors: diagnostics.errors,
  });

  const message = `Missing required runtime env vars: ${diagnostics.errors.join(", ")}`;

  if (mode === "warn") {
    console.error("[ENV VALIDATION WARN]", message);
    return;
  }

  throw new Error(message);
}
