import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseDotenv } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PACKAGE_ROOT = resolve(__dirname, "../..");
const ENV_FILES = [".env", ".env.local", ".env.production"];

export class RuntimeEnvError extends Error {
  constructor(code, message, details = {}) {
    super(`${code}: ${message}`);
    this.name = "RuntimeEnvError";
    this.code = code;
    this.details = details;
  }
}

function isTruthyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parsePostgresUrl(raw, key) {
  if (!isTruthyString(raw)) {
    throw new RuntimeEnvError("ENV_MISSING", `${key} is required for Prisma/runtime database scripts.`, { key });
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new RuntimeEnvError("ENV_INVALID", `${key} must be a valid PostgreSQL URL.`, { key });
  }

  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    throw new RuntimeEnvError("ENV_INVALID", `${key} must use postgresql:// or postgres://.`, { key });
  }

  if (!url.hostname) {
    throw new RuntimeEnvError("ENV_INVALID", `${key} is missing a database host.`, { key });
  }

  return url;
}

export function maskHost(hostname) {
  if (!hostname) return "(missing)";
  if (hostname.length <= 6) return "***";
  const [firstLabel = hostname] = hostname.split(".");
  const suffix = hostname.includes(".") ? hostname.slice(hostname.indexOf(".")) : hostname.slice(-3);
  return `${firstLabel.slice(0, 1)}***${suffix}`;
}

export function maskedPostgresTarget(raw, key = "DATABASE_URL") {
  const url = parsePostgresUrl(raw, key);
  return {
    host: maskHost(url.hostname),
    port: url.port || "5432",
    database: url.pathname.replace(/^\//, "") || "(default)",
  };
}

function collectEnvFiles(envRoot) {
  const values = new Map();
  const sources = new Map();
  const files = [];

  for (const file of ENV_FILES) {
    const filePath = resolve(envRoot, file);
    if (!existsSync(filePath)) {
      files.push({ file, found: false });
      continue;
    }

    files.push({ file, found: true });
    const parsed = parseDotenv(readFileSync(filePath, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      values.set(key, value);
      sources.set(key, file);
    }
  }

  return { values, sources, files };
}

function sourceForKey(key, preExistingKeys, fileSources) {
  if (preExistingKeys.has(key)) return "process.env";
  return fileSources.get(key) ?? "unset";
}

export function loadRuntimeEnv(options = {}) {
  const {
    envRoot = DEFAULT_PACKAGE_ROOT,
    logger = console,
    quiet = false,
    validate = true,
    purpose = "runtime",
  } = options;

  const preExistingKeys = new Set(Object.keys(process.env));

  const { values, sources, files } = collectEnvFiles(envRoot);

  for (const [key, value] of values.entries()) {
    if (!preExistingKeys.has(key)) {
      process.env[key] = value;
    }
  }

  if (!preExistingKeys.has("DIRECT_URL") && isTruthyString(process.env.DATABASE_DIRECT_URL)) {
    process.env.DIRECT_URL = process.env.DATABASE_DIRECT_URL;
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  const directUrl = process.env.DIRECT_URL?.trim();

  let databaseTarget = null;
  let directTarget = null;
  if (validate) {
    databaseTarget = maskedPostgresTarget(databaseUrl, "DATABASE_URL");
    directTarget = maskedPostgresTarget(directUrl, "DIRECT_URL");
  } else {
    if (isTruthyString(databaseUrl)) databaseTarget = maskedPostgresTarget(databaseUrl, "DATABASE_URL");
    if (isTruthyString(directUrl)) directTarget = maskedPostgresTarget(directUrl, "DIRECT_URL");
  }

  const telemetry = {
    purpose,
    envRoot,
    files,
    databaseUrlPresent: isTruthyString(databaseUrl),
    directUrlPresent: isTruthyString(directUrl),
    databaseUrlSource: sourceForKey("DATABASE_URL", preExistingKeys, sources),
    directUrlSource: sourceForKey("DIRECT_URL", preExistingKeys, sources),
    databaseTarget,
    directTarget,
  };

  if (!quiet) {
    logger.log(
      `[runtime-env] ${purpose}: DATABASE_URL=${telemetry.databaseUrlPresent ? "set" : "missing"} ` +
        `source=${telemetry.databaseUrlSource} host=${databaseTarget ? `${databaseTarget.host}:${databaseTarget.port}/${databaseTarget.database}` : "(missing)"}`,
    );
    logger.log(
      `[runtime-env] ${purpose}: DIRECT_URL=${telemetry.directUrlPresent ? "set" : "missing"} ` +
        `source=${telemetry.directUrlSource} host=${directTarget ? `${directTarget.host}:${directTarget.port}/${directTarget.database}` : "(missing)"}`,
    );
  }

  return telemetry;
}

export function isRuntimeEnvError(error) {
  return error instanceof RuntimeEnvError || Boolean(error && typeof error === "object" && "code" in error && String(error.code).startsWith("ENV_"));
}
