/**
 * Plain-Node duplicate of `src/lib/env/runtime-env-guard.ts` for `start-standalone.mjs` and CLI checks
 * (production image has no TS runtime loader). **Keep in sync** with the TypeScript module.
 *
 * `assertRuntimeDatabaseEnvContractMjs` mirrors `src/lib/env/require-database-env.ts` → `assertRuntimeDatabaseEnvContract`
 * (bootstrap parent has no TS / no `env-bootstrap` import — this is the only DB guard on that process).
 */
import { fileURLToPath } from "node:url";
import path from "node:path";

/** Must stay aligned with `require-database-env.ts` placeholder markers. */
const DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER = "127.0.0.1:5432/postgres";
const REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS = "postgres:postgres@127.0.0.1";

const REQUIRED_RUNTIME_ENVS = ["AI_ADMIN_GENERATION_ENABLED"];

const OPENAI_KEY_GROUP = ["AI_INTEGRATIONS_OPENAI_API_KEY", "OPENAI_API_KEY"];

/** Keep in sync with `blogChatUsesOpenRouter` in `src/lib/ai/blog-ai-routing.ts`. */
function blogChatUsesOpenRouterMjs() {
  const b = process.env["BLOG_AI_PROVIDER"]?.trim().toLowerCase();
  if (b === "openrouter") return true;
  if (b === "openai" || b === "gemini") return false;
  if (hasTrimmedEnvMjs("OPENROUTER_API_KEY")) return true;
  return process.env["AI_PROVIDER"]?.trim().toLowerCase() === "openrouter";
}

function hasTrimmedEnvMjs(key) {
  const v = process.env[key];
  return Boolean(v && String(v).trim() !== "");
}

function satisfiesAiFundingContractMjs() {
  if (OPENAI_KEY_GROUP.some((k) => hasTrimmedEnvMjs(k))) return true;
  return blogChatUsesOpenRouterMjs() && hasTrimmedEnvMjs("OPENROUTER_API_KEY");
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
  if (lifecycle === "build") return true;
  if (argv.includes("next build")) return true;
  if (/prisma\s+generate\b/i.test(argv)) return true;
  if (/run-prisma-with-env\.(?:mts?|cjs|js)\s+generate\b/i.test(argv)) return true;
  if (process.env.NN_APP_PLATFORM_BUILD === "true") return true;
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
        "DATABASE_URL is missing in runtime environment (not build ARG). Ensure .env.local or runtime env is set.",
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
  const missing = [];

  for (const key of REQUIRED_RUNTIME_ENVS) {
    const v = process.env[key];
    if (!v || v.trim() === "") {
      missing.push(key);
    }
  }

  if (!satisfiesAiFundingContractMjs()) {
    missing.push(
      `One of: ${OPENAI_KEY_GROUP.join(", ")} — or OPENROUTER_API_KEY when AI_PROVIDER=openrouter (or BLOG_AI_PROVIDER=openrouter)`,
    );
  }

  if (isNonDevelopmentNodeEnv() && !isAuthSecretBuildToleranceContextMjs() && !isAuthSecretConfiguredMjs()) {
    missing.push(
      "AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy) — required for Auth.js JWT signing at runtime (generate: openssl rand -base64 32)",
    );
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
    OPENROUTER_API_KEY_present: Boolean(process.env["OPENROUTER_API_KEY"]),
    AI_PROVIDER: process.env["AI_PROVIDER"] ?? null,
    BLOG_AI_PROVIDER: process.env["BLOG_AI_PROVIDER"] ?? null,
    NN_ENV_VALIDATION_MODE: process.env["NN_ENV_VALIDATION_MODE"] ?? null,
  };

  console.error("[ENV SNAPSHOT]", snapshot);
}

export function validateRuntimeEnvOrThrow() {
  if (isNextProductionBuildPhase()) {
    return;
  }

  assertRuntimeDatabaseEnvContractMjs();

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

const isMain =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  logRuntimeEnvSnapshot();
  validateRuntimeEnvOrThrow();
}
