/**
 * Import this module before constructing `PrismaClient` (directly or via `@/lib/db`).
 *
 * Production (DigitalOcean, etc.): use **`DATABASE_URL`** — the managed Postgres connection string.
 * **`PROD_DATABASE_URL` is not read** (legacy; must not be used — set `DATABASE_URL` only).
 *
 * Tunables (defaults applied only when the URL omits the param — see `tuneDatabaseUrlForProcess`):
 * - `PRISMA_CONNECTION_LIMIT` / `PRISMA_POOL_TIMEOUT` — Prisma pool sizing vs `max_connections`
 * - `PRISMA_CONNECT_TIMEOUT_SEC` — libpq connect timeout (fail fast during failover / network blips)
 * - `PRISMA_STATEMENT_TIMEOUT_MS` — server-side `statement_timeout` (caps runaway queries); set `0` to skip injection. Injection is **skipped** automatically for common poolers (e.g. DigitalOcean `*.db.ondigitalocean.com:25061`, `pgbouncer=true`, port 6432) — those reject `options=-c statement_timeout=…`.
 * - **PgBouncer / DO pooler**: set `PRISMA_USE_PGBOUNCER=true` to append `pgbouncer=true` (or add it to the URL). Set `DIRECT_URL` to the
 *   provider’s **direct** Postgres URI (non-pooler port) — required when the pooled URL uses `pgbouncer=true` (Prisma Migrate cannot use transaction pooling).
 *   Legacy: `DATABASE_DIRECT_URL` is still read and mapped to `DIRECT_URL` when `DIRECT_URL` is unset.
 *
 * `schema.prisma` uses `url = env("DATABASE_URL")` and `directUrl = env("DIRECT_URL")` (see `applyDirectDatabaseUrlFromEnv`).
 */
import { assertRuntimeDatabaseEnvContract } from "../env/require-database-env";

export type DatabaseUrlSource = "database_url" | "missing";

export let databaseUrlSource: DatabaseUrlSource = "missing";

function withDefaultQueryParam(urlString: string, key: string, value: string): string {
  try {
    const url = new URL(urlString);
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return urlString;
  }
}

/**
 * Managed Postgres (DigitalOcean, Neon, Supabase pooler, RDS) expects TLS. If `sslmode` is omitted,
 * libpq may still connect in some environments but credentials login / Prisma can fail inconsistently.
 * Never set for localhost — local dev Postgres often has no TLS.
 */
function withDefaultSslModeRequireForRemoteManagedPostgres(urlString: string): string {
  try {
    const url = new URL(urlString);
    const h = url.hostname.toLowerCase();
    if (h === "localhost" || h === "127.0.0.1" || h.endsWith(".local")) return urlString;
    if (url.searchParams.has("sslmode") || url.searchParams.has("ssl")) return urlString;

    const remoteManaged =
      /\.ondigitalocean\.com$/i.test(h) ||
      /\.neon\.tech$/i.test(h) ||
      /\.pooler\.supabase\.com$/i.test(h) ||
      /\.rds\.amazonaws\.com$/i.test(h) ||
      /\.postgres\.database\.azure\.com$/i.test(h);

    if (!remoteManaged) return urlString;
    url.searchParams.set("sslmode", "require");
    return url.toString();
  } catch {
    return urlString;
  }
}

/** Prisma + transaction-pooling PgBouncer: prepared statements are incompatible unless `pgbouncer=true` is set on the pooled URL. */
function isPrismaPgbouncerMode(): boolean {
  const v = process.env.PRISMA_USE_PGBOUNCER?.trim().toLowerCase();
  return v === "true" || v === "1";
}

/** Remove `pgbouncer` query flag — use for `DIRECT_URL` (migrations / introspection must not use pooler mode). */
function stripPgbouncerFromUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    url.searchParams.delete("pgbouncer");
    return url.toString();
  } catch {
    return urlString;
  }
}

/**
 * Sets PostgreSQL `statement_timeout` for the session via libpq `options` when not already present.
 * Skips if the URL already has an `options` param (caller manages) or `PRISMA_STATEMENT_TIMEOUT_MS=0`.
 */
function withDefaultStatementTimeout(urlString: string): string {
  if (process.env.PRISMA_STATEMENT_TIMEOUT_MS === "0") return urlString;
  try {
    const url = new URL(urlString);
    if (url.searchParams.has("options")) return urlString;
    const ms = process.env.PRISMA_STATEMENT_TIMEOUT_MS?.trim() ?? "120000";
    if (!/^\d+$/.test(ms)) return urlString;
    url.searchParams.set("options", `-c statement_timeout=${ms}`);
    return url.toString();
  } catch {
    return urlString;
  }
}

/**
 * PgBouncer / DigitalOcean **pool** endpoints reject libpq `options=-c statement_timeout=…`
 * (`FATAL: unsupported startup parameter in options: statement_timeout`). Direct Postgres is fine.
 */
function shouldOmitStatementTimeoutOptions(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.searchParams.get("pgbouncer") === "true") return true;
    const port = url.port || "";
    if (port === "6432") return true;
    if (/\.db\.ondigitalocean\.com$/i.test(url.hostname) && port === "25061") return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** Avoid direct `process.argv` references so Edge bundles do not flag Node-only APIs (Turbopack). */
function safeArgvJoin(): string {
  try {
    const g = globalThis as unknown as { process?: { argv?: readonly string[] } };
    const argv = g.process?.argv;
    if (!Array.isArray(argv)) return "";
    return argv.join(" ");
  } catch {
    return "";
  }
}

function safeArgvArray(): string[] {
  try {
    const g = globalThis as unknown as { process?: { argv?: readonly string[] } };
    const argv = g.process?.argv;
    return Array.isArray(argv) ? [...argv] : [];
  } catch {
    return [];
  }
}

/**
 * True for `tsx scripts/…`, `node scripts/…`, Prisma CLI, etc.
 * Used to skip libpq `options=-c statement_timeout=…` — DigitalOcean Postgres / some poolers reject it
 * (`FATAL: unsupported startup parameter in options: statement_timeout`).
 */
export function isDatabaseScriptOrMigrationsProcess(): boolean {
  const argv = safeArgvArray();
  const joined = argv.join(" ");
  if (joined.includes("/scripts/") || joined.includes("\\scripts\\")) return true;
  if (/[\\/]scripts[\\/].*\.(mts?|tsx|jsx|js|cjs|mjs)(\s|$)/i.test(joined)) return true;
  if (joined.includes("prisma migrate") || joined.includes("prisma db ")) return true;
  if (joined.includes("tsx scripts/")) return true;
  return argv.some((a) => typeof a === "string" && /[\\/]scripts[\\/]/.test(a));
}

/**
 * @param role `pooled` = app queries (may add `pgbouncer=true` when `PRISMA_USE_PGBOUNCER` is set).
 *   `direct` = Prisma Migrate / introspection — never adds `pgbouncer=true`; strips it if present.
 */
function tuneDatabaseUrlForProcess(rawUrl: string, role: "pooled" | "direct" = "pooled"): string {
  const argv = safeArgvJoin();
  const lifecycle = process.env.npm_lifecycle_event ?? "";
  const isBuildProcess = lifecycle === "build" || argv.includes("next build");
  const isScriptProcess = isDatabaseScriptOrMigrationsProcess();

  let working = withDefaultSslModeRequireForRemoteManagedPostgres(rawUrl);
  working = role === "direct" ? stripPgbouncerFromUrl(working) : working;

  const usePoolerFlag = role === "pooled" && isPrismaPgbouncerMode();
  const connectionLimit =
    process.env.PRISMA_CONNECTION_LIMIT ??
    (usePoolerFlag
      ? "1"
      : isBuildProcess || isScriptProcess
        ? "2"
        : process.env.NODE_ENV === "production"
          ? "5"
          : "8");
  const poolTimeout = process.env.PRISMA_POOL_TIMEOUT ?? (isBuildProcess ? "25" : "15");
  const connectTimeoutSec = process.env.PRISMA_CONNECT_TIMEOUT_SEC?.trim() ?? "10";

  let tuned = working;
  tuned = withDefaultQueryParam(tuned, "connection_limit", connectionLimit);
  tuned = withDefaultQueryParam(tuned, "pool_timeout", poolTimeout);
  tuned = withDefaultQueryParam(tuned, "connect_timeout", connectTimeoutSec);
  const omitStmtTimeout =
    isScriptProcess ||
    isPrismaPgbouncerMode() ||
    shouldOmitStatementTimeoutOptions(working);
  if (!omitStmtTimeout) {
    tuned = withDefaultStatementTimeout(tuned);
  }
  if (usePoolerFlag) {
    tuned = withDefaultQueryParam(tuned, "pgbouncer", "true");
  }
  return tuned;
}

/**
 * Sets `DIRECT_URL` for `schema.prisma` `directUrl` (migrations). If unset, mirrors the pooled
 * URL with `pgbouncer` stripped — fine for single-instance Postgres; **with DigitalOcean pooler you should
 * set `DIRECT_URL` to the provider’s direct (non-pooler) connection string** for `prisma migrate`.
 * When only `DATABASE_DIRECT_URL` is set (legacy), it is used as the raw direct URL.
 */
export function applyDirectDatabaseUrlFromEnv(): void {
  const pooled = process.env.DATABASE_URL?.trim();
  const rawDirect =
    process.env.DIRECT_URL?.trim() ?? process.env.DATABASE_DIRECT_URL?.trim();

  if (rawDirect) {
    process.env.DIRECT_URL = tuneDatabaseUrlForProcess(rawDirect, "direct");
    return;
  }
  if (pooled) {
    process.env.DIRECT_URL = tuneDatabaseUrlForProcess(stripPgbouncerFromUrl(pooled), "direct");
  }
}

export function applyDatabaseUrlFromEnv(): void {
  const direct = process.env.DATABASE_URL?.trim();
  const legacyProd = process.env.PROD_DATABASE_URL?.trim();

  if (direct) {
    process.env.DATABASE_URL = tuneDatabaseUrlForProcess(direct, "pooled");
    databaseUrlSource = "database_url";
    if (legacyProd && legacyProd !== direct) {
      console.warn(
        "[nursenest-core] PROD_DATABASE_URL is set but ignored — DATABASE_URL is the only source of truth. Remove PROD_DATABASE_URL.",
      );
    }
    return;
  }

  databaseUrlSource = "missing";
  if (legacyProd) {
    console.error(
      "[nursenest-core] DATABASE_URL is unset. PROD_DATABASE_URL is no longer merged — copy the connection string to DATABASE_URL (DigitalOcean app env, GitHub secret, or .env.local). See docs/database-environment.md",
    );
  }
}

applyDatabaseUrlFromEnv();
applyDirectDatabaseUrlFromEnv();
assertRuntimeDatabaseEnvContract();

if (process.env.NODE_ENV !== "production" && process.env.NN_LOG_DIRECT_URL !== "0") {
  // Temporary visibility for Prisma `directUrl` / migrate — remove or gate further if noisy.
  console.log("[env-bootstrap] DIRECT_URL present:", Boolean(process.env.DIRECT_URL?.trim()));
}

/** Set after URL tuning side effects — `src/lib/db.ts` asserts this ran before `PrismaClient` construction. */
(globalThis as typeof globalThis & { __ENV_BOOTSTRAP_RAN__?: boolean }).__ENV_BOOTSTRAP_RAN__ = true;
