/**
 * Production-safe DATABASE_URL drift signals: redacted connection facts + stable fingerprint.
 * Never logs or returns the password.
 */
import { createHash } from "node:crypto";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type DatabaseConnectionModeGuess = "likely_pooler" | "likely_direct" | "unknown";

/** Safe to log and return from admin diagnostics — no password material. */
export type DatabaseUrlDriftAuditPublic = {
  host: string;
  port: string;
  database: string;
  username: string;
  sslmodeRequire: boolean;
  connectionMode: DatabaseConnectionModeGuess;
  /** First 10 hex chars of SHA-256(UTF-8 DATABASE_URL); changes when any URL component (including password) changes. */
  fingerprintPrefix10: string;
};

function postgresUrlToHttpUrl(raw: string): string {
  return raw.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:");
}

function optionsParamContainsSslModeRequire(options: string): boolean {
  return /sslmode\s*=\s*require/i.test(options);
}

function hasSslModeRequire(params: URLSearchParams): boolean {
  const mode = params.get("sslmode")?.toLowerCase();
  if (mode === "require") return true;
  const ssl = params.get("ssl")?.toLowerCase();
  if (ssl === "require" || ssl === "true") return true;
  const opt = params.get("options") ?? "";
  return optionsParamContainsSslModeRequire(opt);
}

export function guessDatabaseConnectionMode(
  host: string,
  portStr: string,
  params: URLSearchParams,
): DatabaseConnectionModeGuess {
  const pg = params.get("pgbouncer")?.toLowerCase();
  if (pg === "true" || pg === "1") return "likely_pooler";

  const p = portStr ? parseInt(portStr, 10) : NaN;
  if (p === 6432) return "likely_pooler";
  if (/pooler\.supabase\.com$/i.test(host)) return "likely_pooler";
  if (/\.db\.ondigitalocean\.com$/i.test(host) && p === 25061) return "likely_pooler";
  if (/\.db\.ondigitalocean\.com$/i.test(host) && p === 25060) return "likely_direct";
  if ((host === "localhost" || host === "127.0.0.1") && (p === 5432 || Number.isNaN(p))) return "likely_direct";
  return "unknown";
}

/**
 * SHA-256 fingerprint of the **full** connection string (includes password) for drift detection only.
 * Truncate to 10 hex characters for compact logs — do not treat as a cryptographic secret.
 */
export function fingerprintDatabaseUrlPrefix10(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex").slice(0, 10);
}

/**
 * Parse DATABASE_URL into a redacted audit object, or `null` if malformed.
 */
export function databaseUrlDriftAuditPublic(raw: string): DatabaseUrlDriftAuditPublic | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let u: URL;
  try {
    u = new URL(postgresUrlToHttpUrl(trimmed));
  } catch {
    return null;
  }
  const host = u.hostname;
  if (!host) return null;
  const port = u.port || "5432";
  const database = decodeURIComponent((u.pathname || "/").replace(/^\//, "") || "") || "(none)";
  const username = decodeURIComponent(u.username || "") || "(none)";

  return {
    host,
    port,
    database,
    username,
    sslmodeRequire: hasSslModeRequire(u.searchParams),
    connectionMode: guessDatabaseConnectionMode(host, port, u.searchParams),
    fingerprintPrefix10: fingerprintDatabaseUrlPrefix10(trimmed),
  };
}

export type DatabaseUrlShapeGuardOutcome =
  | { ok: true }
  | { ok: false; reason: "db_missing_url" | "db_malformed_url" };

/**
 * Validates only presence + parseability — does **not** compare to another environment.
 */
export function evaluateDatabaseUrlShape(): DatabaseUrlShapeGuardOutcome {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return { ok: false, reason: "db_missing_url" };
  if (!databaseUrlDriftAuditPublic(raw)) return { ok: false, reason: "db_malformed_url" };
  return { ok: true };
}

/**
 * CI / explicit guard: exit non-zero only when enforcement is on **and** URL is missing or malformed.
 * - `NN_DATABASE_URL_SHAPE_GUARD=1`: require a well-formed DATABASE_URL (fail if missing/malformed).
 * - `CI=true` / `CI=1`: if DATABASE_URL is **set**, it must be well-formed; if unset, **skip** (no secret in job).
 */
export function runDatabaseUrlShapeGuardForProcess(): "pass" | "skip" | "fail" {
  const strict = process.env.NN_DATABASE_URL_SHAPE_GUARD === "1";
  const ci = process.env.CI === "true" || process.env.CI === "1";
  const raw = process.env.DATABASE_URL?.trim();

  if (!strict && !ci) return "skip";
  if (!raw) {
    if (strict) return "fail";
    return "skip";
  }
  if (!databaseUrlDriftAuditPublic(raw)) return "fail";
  return "pass";
}

let driftAuditLogged = false;

/** Emit drift audit line(s) — safe fields only; password never appears. */
export function logDatabaseUrlDriftAuditEvent(scope: string): void {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    safeServerLog("database", "database_url_drift_audit", {
      scope,
      configured: "0",
      reason: "db_missing_url",
    });
    console.error(`[nursenest-core] database_url_drift_audit scope=${scope} configured=0 reason=db_missing_url`);
    return;
  }

  const audit = databaseUrlDriftAuditPublic(raw);
  if (!audit) {
    safeServerLog("database", "database_url_drift_audit", {
      scope,
      configured: "1",
      reason: "db_malformed_url",
    });
    console.error(`[nursenest-core] database_url_drift_audit scope=${scope} configured=1 reason=db_malformed_url`);
    return;
  }

  safeServerLog("database", "database_url_drift_audit", {
    scope,
    configured: "1",
    host: audit.host,
    port: audit.port,
    database: audit.database,
    username: audit.username,
    sslmode_require: audit.sslmodeRequire ? "1" : "0",
    connection_mode: audit.connectionMode,
    fingerprint_prefix10: audit.fingerprintPrefix10,
  });
  console.error(
    `[nursenest-core] database_url_drift_audit scope=${scope} ` +
      `host=${audit.host} ` +
      `port=${audit.port} ` +
      `database=${audit.database} ` +
      `username=${audit.username} ` +
      `sslmode_require=${audit.sslmodeRequire ? "1" : "0"} ` +
      `connection_mode=${audit.connectionMode} ` +
      `fingerprint_prefix10=${audit.fingerprintPrefix10}`,
  );
}

/** Log once per Node process at boot — safe fields only; password never appears. */
export function logDatabaseUrlDriftAuditOnce(scope: string = "boot"): void {
  if (driftAuditLogged) return;
  driftAuditLogged = true;
  logDatabaseUrlDriftAuditEvent(scope);
}
