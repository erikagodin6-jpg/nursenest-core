/**
 * Import this module before constructing `PrismaClient` (directly or via `@/lib/db`).
 *
 * Production (DigitalOcean, etc.): **`DATABASE_URL` wins** when set — use the **managed Postgres**
 * connection string from the DO dashboard (HA / standby failover is handled by the platform; the URI
 * stays stable). Pair with `sslmode=require` when the provider requires TLS.
 *
 * Tunables (defaults applied only when the URL omits the param — see `tuneDatabaseUrlForProcess`):
 * - `PRISMA_CONNECTION_LIMIT` / `PRISMA_POOL_TIMEOUT` — Prisma pool sizing vs `max_connections`
 * - `PRISMA_CONNECT_TIMEOUT_SEC` — libpq connect timeout (fail fast during failover / network blips)
 * - `PRISMA_STATEMENT_TIMEOUT_MS` — server-side `statement_timeout` (caps runaway queries); set `0` to skip injection
 * - **PgBouncer / DO pooler**: set `PRISMA_USE_PGBOUNCER=true` to append `pgbouncer=true` (or add it to the URL). Set `DATABASE_DIRECT_URL` to the
 *   provider’s **direct** Postgres URI (non-pooler port) — required when the pooled URL uses `pgbouncer=true` (Prisma Migrate cannot use transaction pooling).
 *
 * If `DATABASE_URL` is unset and `PROD_DATABASE_URL` is set, copy prod → `DATABASE_URL` (**deprecated alias** —
 * use `DATABASE_URL` everywhere; see `docs/database-environment.md`).
 * `schema.prisma` uses `DATABASE_URL` + `DATABASE_DIRECT_URL` (see `applyDirectDatabaseUrlFromEnv`).
 */
export type DatabaseUrlSource = "prod_override" | "database_url" | "missing";

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

/** Prisma + transaction-pooling PgBouncer: prepared statements are incompatible unless `pgbouncer=true` is set on the pooled URL. */
function isPrismaPgbouncerMode(): boolean {
  const v = process.env.PRISMA_USE_PGBOUNCER?.trim().toLowerCase();
  return v === "true" || v === "1";
}

/** Remove `pgbouncer` query flag — use for `DATABASE_DIRECT_URL` (migrations / introspection must not use pooler mode). */
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

  let working = role === "direct" ? stripPgbouncerFromUrl(rawUrl) : rawUrl;

  const usePoolerFlag = role === "pooled" && isPrismaPgbouncerMode();
  // External pooler: avoid double-pooling — one Prisma connection per server worker is typical (override with PRISMA_CONNECTION_LIMIT).
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
  // Script / migrate CLIs: skip statement_timeout in `options` — DO managed PG often rejects that startup param.
  // Elsewhere: cap runaway queries via libpq options (override with PRISMA_STATEMENT_TIMEOUT_MS=0).
  if (!isScriptProcess) {
    tuned = withDefaultStatementTimeout(tuned);
  }
  if (usePoolerFlag) {
    tuned = withDefaultQueryParam(tuned, "pgbouncer", "true");
  }
  return tuned;
}

/**
 * Sets `DATABASE_DIRECT_URL` for `schema.prisma` `directUrl` (migrations). If unset, mirrors the pooled
 * URL with `pgbouncer` stripped — fine for single-instance Postgres; **with DigitalOcean pooler you should
 * set `DATABASE_DIRECT_URL` to the provider’s direct (non-pooler) connection string** for `prisma migrate`.
 */
export function applyDirectDatabaseUrlFromEnv(): void {
  const pooled = process.env.DATABASE_URL?.trim();
  const rawDirect = process.env.DATABASE_DIRECT_URL?.trim();

  if (rawDirect) {
    process.env.DATABASE_DIRECT_URL = tuneDatabaseUrlForProcess(rawDirect, "direct");
    return;
  }
  if (pooled) {
    process.env.DATABASE_DIRECT_URL = tuneDatabaseUrlForProcess(stripPgbouncerFromUrl(pooled), "direct");
  }
}

export function applyDatabaseUrlFromEnv(): void {
  const direct = process.env.DATABASE_URL?.trim();
  const prod = process.env.PROD_DATABASE_URL?.trim();

  if (process.env.NODE_ENV === "production") {
    if (direct && prod && direct !== prod) {
      console.error(
        "[nursenest-core] DATABASE_URL and PROD_DATABASE_URL differ; using DATABASE_URL. Remove or align PROD_DATABASE_URL.",
      );
    }
    if (direct) {
      process.env.DATABASE_URL = tuneDatabaseUrlForProcess(direct, "pooled");
      databaseUrlSource = "database_url";
      return;
    }
    if (prod) {
      process.env.DATABASE_URL = tuneDatabaseUrlForProcess(prod, "pooled");
      databaseUrlSource = "prod_override";
      return;
    }
    databaseUrlSource = "missing";
    return;
  }

  if (direct) {
    process.env.DATABASE_URL = tuneDatabaseUrlForProcess(direct, "pooled");
    databaseUrlSource = "database_url";
  } else if (prod) {
    console.warn(
      "[nursenest-core] DEPRECATED: DATABASE_URL is unset but PROD_DATABASE_URL is set. Copying to DATABASE_URL. " +
        "Set DATABASE_URL in nursenest-core/.env.local (or your shell) and remove PROD_DATABASE_URL — see docs/database-environment.md.",
    );
    process.env.DATABASE_URL = tuneDatabaseUrlForProcess(prod, "pooled");
    databaseUrlSource = "prod_override";
  } else {
    databaseUrlSource = "missing";
  }
}

applyDatabaseUrlFromEnv();
applyDirectDatabaseUrlFromEnv();
