/**
 * Plain-Node duplicate of `src/lib/env/runtime-env-guard.ts` for `start-standalone.mjs` and CLI checks
 * (production image has no TS runtime loader). **Keep in sync** with the TypeScript module.
 *
 * `assertRuntimeDatabaseEnvContractMjs` mirrors `src/lib/env/require-database-env.ts` → `assertRuntimeDatabaseEnvContract`
 * (bootstrap parent has no TS / no `env-bootstrap` import — this is the only DB guard on that process).
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  buildMissingRuntimeEnvContractMessage,
  createEarlyRuntimeDiagnostics,
  createRuntimeEnvProbeDiagnostics,
  runtimeEnvProbeEnabled,
} from "./lib/runtime-env-contract.mjs";
import { loadRuntimeEnvFileFallback } from "./lib/runtime-env-file-fallback.mjs";

/** Must stay aligned with `require-database-env.ts` placeholder markers. */
const DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER = "127.0.0.1:5432/postgres";
const REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS = "postgres:postgres@127.0.0.1";

const OPENAI_KEY_GROUP = ["AI_INTEGRATIONS_OPENAI_API_KEY", "OPENAI_API_KEY"];
const ADMIN_AI_GENERATION_FLAG_GROUP = ["AI_ADMIN_GENERATION_ENABLED", "AI_ADMIN_GENERation"];
const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** First non-empty flag wins; unknown tokens are treated as `ambiguous` (still require AI funding). */
function parseAdminAiGenerationIntentMjs() {
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

/** Keep in sync with `blogChatUsesOpenRouter` in `src/lib/ai/blog-ai-routing.ts`. */
function blogChatUsesOpenRouterMjs() {
  const b = process.env["BLOG_AI_PROVIDER"]?.trim().toLowerCase();
  if (b === "openrouter") return true;
  if (b === "openai" || b === "gemini") return false;
  if (hasTrimmedEnvMjs("OPENROUTER_API_KEY") || hasTrimmedEnvMjs("BLOG_OPENROUTER_API_KEY")) return true;
  return process.env["AI_PROVIDER"]?.trim().toLowerCase() === "openrouter";
}

function hasTrimmedEnvMjs(key) {
  const v = process.env[key];
  return Boolean(v && String(v).trim() !== "");
}

function satisfiesAiFundingContractMjs() {
  if (OPENAI_KEY_GROUP.some((k) => hasTrimmedEnvMjs(k))) return true;
  return blogChatUsesOpenRouterMjs() && (hasTrimmedEnvMjs("OPENROUTER_API_KEY") || hasTrimmedEnvMjs("BLOG_OPENROUTER_API_KEY"));
}

function isNextProductionBuildPhase() {
  return process.env["NEXT_PHASE"] === "phase-production-build";
}

function getEnvValidationMode() {
  const raw = (process.env["NN_ENV_VALIDATION_MODE"] ?? "strict").trim().toLowerCase();
  if (raw === "off") return "off";
  if (raw === "warn") return "warn";
  return "strict";
}

function safeArgvJoin() {
  try {
    const argv = globalThis.process?.argv;
    if (!Array.isArray(argv)) return "";
    return argv.join(" ");
  } catch {
    return "";
  }
}

/** Mirrors `isDatabaseContractSkippedPhase` in `require-database-env.ts`. */
function isDatabaseContractSkippedPhase() {
  if (process.env.NN_SKIP_DATABASE_ENV_CONTRACT === "1") return true;
  const argv = safeArgvJoin();
  const lifecycle = process.env.npm_lifecycle_event ?? "";
  const phase = process.env.NEXT_PHASE?.trim();

  if (phase === "phase-production-build" || phase === "phase-development-build") return true;
  if (lifecycle === "build") return true;
  if (lifecycle === "heroku-postbuild") return true;
  if (argv.includes("next build")) return true;
  if (argv.includes("run-next-prod-build.mjs")) return true;
  if (argv.includes("run-buildpack-build.mjs")) return true;
  if (/prisma\s+generate\b/i.test(argv)) return true;
  if (/run-prisma-with-env\.(?:mts?|cjs|js)\s+generate\b/i.test(argv)) return true;
  if (/prisma-safe\.mjs\s+generate\b/i.test(argv)) return true;
  return false;
}

/** Keep aligned with `isAllowedPrismaCodegenStubDatabaseUrl` in `require-database-env.ts`. */
function isAllowedPrismaCodegenStubDatabaseUrl(url) {
  try {
    const u = new URL(String(url).trim());
    const h = u.hostname.toLowerCase();
    if (h !== "127.0.0.1" && h !== "localhost") return false;
    const port = u.port || (u.protocol === "postgresql:" || u.protocol === "postgres:" ? "5432" : "");
    if (port !== "65432") return false;
    const db = (u.pathname.replace(/^\//, "").split("/")[0] ?? "").trim();
    return db === "nn_prisma_codegen";
  } catch {
    return false;
  }
}

function isRejectedRuntimePlaceholderDatabaseUrl(url) {
  const t = String(url).trim();
  if (t.includes(DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER)) return true;
  if (isAllowedPrismaCodegenStubDatabaseUrl(t)) return false;
  if (t.includes(REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS)) return true;
  return false;
}

/** Keep aligned with `assertPostgresConnectionStringShape` in `require-database-env.ts`. */
function assertPostgresConnectionStringShape(urlString) {
  const trimmed = String(urlString).trim();
  const lowered = trimmed.toLowerCase();
  if (!lowered.startsWith("postgresql:") && !lowered.startsWith("postgres:")) {
    throw new Error("DATABASE_URL must use postgresql:// or postgres://.");
  }
  let u;
  try {
    const httpish = trimmed.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:");
    u = new URL(httpish);
  } catch {
    throw new Error("DATABASE_URL is not a parseable PostgreSQL connection string.");
  }
  if (!u.hostname) {
    throw new Error("DATABASE_URL is missing a database host.");
  }
}

function isProductionLikeDatabaseHost(urlString) {
  try {
    const u = new URL(urlString);
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h === "127.0.0.1" || h === "::1") return false;
    if (h.endsWith(".local")) return false;
    if (h === "0.0.0.0") return false;
    return true;
  } catch {
    return false;
  }
}

function maskDatabaseUrlHostForLog(urlString) {
  try {
    const u = new URL(urlString);
    const host = u.hostname;
    const port = u.port || (u.protocol === "postgresql:" || u.protocol === "postgres:" ? "5432" : "");
    if (!host) return { host: "(unparseable)", port: port || "?" };
    const parts = host.split(".").filter(Boolean);
    if (parts.length <= 1) {
      return { host: `${host.slice(0, 1)}***`, port: port || "default" };
    }
    const tld = parts.slice(-2).join(".");
    const first = parts[0];
    return { host: `${first.slice(0, 1)}***.${tld}`, port: port || "default" };
  } catch {
    return { host: "(unparseable)", port: "?" };
  }
}

let dbContractLogEmitted = false;

function logDatabaseContractLine(payload) {
  if (dbContractLogEmitted) return;
  dbContractLogEmitted = true;
  console.info(`[nn-db-startup] ${JSON.stringify(payload)}`);
}

function validateOriginLikeSettingMjs(key) {
  const raw = process.env[key]?.trim();
  if (!raw) return null;

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return `${key} must be a valid absolute http(s) origin.`;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return `${key} must use http:// or https://.`;
  }

  if (!parsed.origin) {
    return `${key} must include an origin.`;
  }

  if ((parsed.pathname && parsed.pathname !== "/") || parsed.search || parsed.hash) {
    return `${key} must be origin-only (for example https://www.nursenest.ca, not a path).`;
  }

  return null;
}

function collectAuthOriginIssuesMjs() {
  const issues = [];
  const authUrl = process.env.AUTH_URL?.trim();
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
  if (!authUrl && !nextAuthUrl) return issues;

  for (const key of ["AUTH_URL", "NEXTAUTH_URL"]) {
    const issue = validateOriginLikeSettingMjs(key);
    if (issue) issues.push(issue);
  }

  if (authUrl && nextAuthUrl) {
    try {
      if (new URL(authUrl).origin !== new URL(nextAuthUrl).origin) {
        issues.push("AUTH_URL and NEXTAUTH_URL must resolve to the same origin when both are set.");
      }
    } catch {
      /* Individual parse errors are already collected above. */
    }
  }

  return issues;
}

/** Mirrors `assertRuntimeDatabaseEnvContract` in `require-database-env.ts`. */
function assertRuntimeDatabaseEnvContractMjs() {
  const raw = process.env.DATABASE_URL?.trim();
  if (raw && isRejectedRuntimePlaceholderDatabaseUrl(raw)) {
    throw new Error(
      "DATABASE_URL matches a localhost placeholder (Docker default or postgres:postgres@127.0.0.1). Refusing to connect.",
    );
  }

  if (isDatabaseContractSkippedPhase()) return;

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        buildMissingRuntimeEnvContractMessage({
          envName: "DATABASE_URL",
          appRoot: APP_ROOT,
          reason:
            "Runtime env did not reach the standalone Node process; inspect DigitalOcean component env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding.",
        }),
      );
    }
    return;
  }

  assertPostgresConnectionStringShape(raw);

  const { host, port } = maskDatabaseUrlHostForLog(raw);
  logDatabaseContractLine({
    context: "runtime-env-guard-bootstrap",
    database_url_source: "process_env",
    host_masked: host,
    port,
    isProductionDb: isProductionLikeDatabaseHost(raw),
  });
}

function isNonDevelopmentNodeEnv() {
  const n = process.env.NODE_ENV;
  if (n === "development" || n === "test") return false;
  return true;
}

/** Mirrors `isAuthSecretBuildToleranceContext` in `src/lib/auth/auth-session-signing-env.ts`. */
function isAuthSecretBuildToleranceContextMjs() {
  const p = process.env.NEXT_PHASE?.trim();
  if (p === "phase-production-build" || p === "phase-development-build") return true;
  const ev = process.env.npm_lifecycle_event?.trim();
  if (ev === "build" || ev === "vercel-build") return true;
  const parts = process.argv;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const a = parts[i] ?? "";
    const isNextBin = a === "next" || a.endsWith("/next") || a.endsWith("\\next.cmd");
    if (isNextBin && parts[i + 1] === "build") return true;
  }
  return false;
}

function isAuthSecretConfiguredMjs() {
  const a = process.env.AUTH_SECRET?.trim();
  if (a) return true;
  const b = process.env.NEXTAUTH_SECRET?.trim();
  return Boolean(b);
}

function collectMissingRuntimeEnvIssues() {
  const errors = [];
  const warnings = [];

  const adminAiIntent = parseAdminAiGenerationIntentMjs();
  if (adminAiIntent === "unset") {
    errors.push("AI_ADMIN_GENERATION_ENABLED (or accepted typo alias AI_ADMIN_GENERation)");
  }

  const requiresAiFunding =
    adminAiIntent === "on" || adminAiIntent === "ambiguous";

  if (requiresAiFunding && !satisfiesAiFundingContractMjs()) {
    errors.push(
      `One of: ${OPENAI_KEY_GROUP.join(", ")} — or OPENROUTER_API_KEY / BLOG_OPENROUTER_API_KEY when AI_PROVIDER=openrouter (or BLOG_AI_PROVIDER=openrouter)`,
    );
  }

  if (isNonDevelopmentNodeEnv() && !isAuthSecretBuildToleranceContextMjs() && !isAuthSecretConfiguredMjs()) {
    errors.push(
      "AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy) — required for Auth.js JWT signing at runtime (generate: openssl rand -base64 32)",
    );
  }

  errors.push(...collectAuthOriginIssuesMjs());

  if (isNonDevelopmentNodeEnv() && !hasTrimmedEnvMjs("STRIPE_SECRET_KEY")) {
    warnings.push(
      "STRIPE_SECRET_KEY missing — app boot is allowed, but checkout/session creation will fail on billing routes.",
    );
  }

  return { errors, warnings };
}

export function logRuntimeEnvSnapshot() {
  if (isNextProductionBuildPhase()) {
    return;
  }

  console.error(
    "[ENV SNAPSHOT]",
    createEarlyRuntimeDiagnostics({
      env: process.env,
      phase: "runtime_env_guard_snapshot",
    }),
  );
}

export function validateRuntimeEnvOrThrow() {
  if (isNextProductionBuildPhase()) {
    return;
  }

  if (runtimeEnvProbeEnabled(process.env)) {
    console.error(
      "[ENV PROBE]",
      createRuntimeEnvProbeDiagnostics({
        env: process.env,
        phase: "runtime_env_guard_pre_validate",
      }),
    );
  }

  assertRuntimeDatabaseEnvContractMjs();

  const mode = getEnvValidationMode();
  if (mode === "off") {
    return;
  }

  const diagnostics = collectMissingRuntimeEnvIssues();
  if (diagnostics.errors.length === 0 && diagnostics.warnings.length === 0) {
    return;
  }

  if (diagnostics.warnings.length > 0) {
    console.error("[ENV VALIDATION WARN]", {
      warnings: diagnostics.warnings,
    });
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

const isMain =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  loadRuntimeEnvFileFallback();
  logRuntimeEnvSnapshot();
  validateRuntimeEnvOrThrow();
}
