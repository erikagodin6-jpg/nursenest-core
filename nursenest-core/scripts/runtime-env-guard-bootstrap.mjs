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

function isRejectedRuntimePlaceholderDatabaseUrl(url) {
  const t = String(url).trim();
  if (t.includes(DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER)) return true;
  if (t.includes(REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS)) return true;
  return false;
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

  const { host, port } = maskDatabaseUrlHostForLog(raw);
  logDatabaseContractLine({
    context: "runtime-env-guard-bootstrap",
    database_url_source: "process_env",
    host_masked: host,
    port,
    isProductionDb: isProductionLikeDatabaseHost(raw),
  });
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

  assertRuntimeDatabaseEnvContractMjs();

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
