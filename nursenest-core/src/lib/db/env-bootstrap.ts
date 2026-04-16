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
 * If `DATABASE_URL` is unset and `PROD_DATABASE_URL` is set, copy prod → `DATABASE_URL` (legacy alias).
 * `schema.prisma` references `env("DATABASE_URL")` only.
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

function tuneDatabaseUrlForProcess(rawUrl: string): string {
  const argv = safeArgvJoin();
  const lifecycle = process.env.npm_lifecycle_event ?? "";
  const isBuildProcess = lifecycle === "build" || argv.includes("next build");
  const isScriptProcess = argv.includes("/scripts/") || argv.includes("tsx scripts/");

  // Allow explicit override from env; otherwise pick conservative defaults by process type.
  const connectionLimit =
    process.env.PRISMA_CONNECTION_LIMIT ??
    (isBuildProcess || isScriptProcess ? "2" : process.env.NODE_ENV === "production" ? "5" : "8");
  const poolTimeout = process.env.PRISMA_POOL_TIMEOUT ?? (isBuildProcess ? "25" : "15");
  const connectTimeoutSec = process.env.PRISMA_CONNECT_TIMEOUT_SEC?.trim() ?? "10";

  let tuned = rawUrl;
  tuned = withDefaultQueryParam(tuned, "connection_limit", connectionLimit);
  tuned = withDefaultQueryParam(tuned, "pool_timeout", poolTimeout);
  tuned = withDefaultQueryParam(tuned, "connect_timeout", connectTimeoutSec);
  tuned = withDefaultStatementTimeout(tuned);
  return tuned;
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
      process.env.DATABASE_URL = tuneDatabaseUrlForProcess(direct);
      databaseUrlSource = "database_url";
      return;
    }
    if (prod) {
      process.env.DATABASE_URL = tuneDatabaseUrlForProcess(prod);
      databaseUrlSource = "prod_override";
      return;
    }
    databaseUrlSource = "missing";
    return;
  }

  if (direct) {
    process.env.DATABASE_URL = tuneDatabaseUrlForProcess(direct);
    databaseUrlSource = "database_url";
  } else {
    databaseUrlSource = "missing";
  }
}

applyDatabaseUrlFromEnv();
