import "./load-env";
import * as fs from "node:fs";
import pg from "pg";

export type DatabaseTarget = "production" | "development";

const DEV_URL = process.env.DATABASE_URL;
const PROD_URL = process.env.PROD_DATABASE_URL;

const DEFAULT_STATEMENT_TIMEOUT_MS = getEnvInt("DB_STATEMENT_TIMEOUT_MS", 10000);
const DEFAULT_CONNECTION_TIMEOUT_MS = getEnvInt("DB_CONNECTION_TIMEOUT_MS", 5000);
const DEFAULT_IDLE_TIMEOUT_MS = getEnvInt("DB_IDLE_TIMEOUT_MS", 30000);
const DEFAULT_MAX_POOL_SIZE = getEnvInt("DB_MAX_POOL_SIZE", 22);
const SLOW_QUERY_THRESHOLD_MS = getEnvInt("DB_SLOW_QUERY_THRESHOLD_MS", 500);

const ALLOW_PROD_FALLBACK_TO_DATABASE_URL =
  String(process.env.ALLOW_PROD_FALLBACK_TO_DATABASE_URL || "").toLowerCase() === "true";

const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Use the production DB pool for all generic app access. Wider than NODE_ENV alone so
 * Railway/Render do not hit getDevPool() → DATABASE_URL when NODE_ENV is unset.
 */
export function isProductionLikeRuntime(): boolean {
  if (NODE_ENV === "production") return true;
  if (Boolean(process.env.DYNO?.trim())) return true;
  if (process.env.REPLIT_DEPLOYMENT === "1") return true;
  if (String(process.env.RENDER || "").toLowerCase() === "true") return true;
  if (String(process.env.RAILWAY_ENVIRONMENT || "").toLowerCase() === "production") return true;
  // Any deployed Railway replica (NODE_ENV is often unset on default templates).
  if (Boolean(process.env.RAILWAY_SERVICE_ID?.trim())) return true;
  return false;
}

const IS_PROD_RUNTIME = isProductionLikeRuntime();

function getEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;

  return Math.floor(parsed);
}

function maskUrl(url: string | undefined): string {
  if (!url) return "(not set)";
  return url.replace(/\/\/.*@/, "//***@");
}

function shouldUseSsl(connectionString: string): boolean {
  const forceSsl = String(process.env.DB_SSL || "").toLowerCase();

  if (forceSsl === "true") return true;
  if (forceSsl === "false") return false;

  return /render\.com|supabase\.co|neon\.tech|railway\.app|amazonaws\.com|azure\.com|ondigitalocean\.com/i.test(
    connectionString,
  );
}

/**
 * pg merges `parse(connectionString)` over Pool options. If the URL contains `sslmode=require`
 * (or similar), pg-connection-string sets `ssl: {}`, which enables TLS with Node's default
 * `rejectUnauthorized: true` and overwrites an explicit `ssl: { rejectUnauthorized: false }`.
 * We strip SSL-related query params and pass a single explicit `ssl` object instead.
 *
 * @see https://github.com/brianc/node-postgres/issues/2375
 */
function stripSslParamsFromConnectionString(connectionString: string): {
  cleaned: string;
  sslModeFromUrl: string | null;
} {
  try {
    const u = new URL(connectionString);
    const sslModeFromUrl = u.searchParams.get("sslmode");
    const stripKeys = ["sslmode", "ssl", "sslrootcert", "sslcert", "sslkey", "uselibpqcompat"];
    for (const k of stripKeys) {
      u.searchParams.delete(k);
    }
    return { cleaned: u.toString(), sslModeFromUrl };
  } catch {
    return { cleaned: connectionString, sslModeFromUrl: null };
  }
}

function readSslCaBundle(): string | null {
  const pathEnv = process.env.DB_SSL_CA?.trim() || process.env.PGSSLROOTCERT?.trim();
  if (!pathEnv) return null;
  try {
    if (!fs.existsSync(pathEnv)) {
      console.warn(`[DB] SSL CA file not found at ${pathEnv} (DB_SSL_CA / PGSSLROOTCERT)`);
      return null;
    }
    return fs.readFileSync(pathEnv, "utf8");
  } catch (e) {
    console.warn(`[DB] Failed to read SSL CA file: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

type PgSslConfig = false | { rejectUnauthorized: boolean; ca?: string };

/**
 * Explicit TLS options for `pg` (never rely on empty `ssl: {}` from URL parsing).
 * - With CA file: verify server cert (recommended for production).
 * - Non-production-like runtime: relax verification for managed DBs (local/staging against DO/Neon).
 * - Production-like without CA: strict by default; opt-in via DB_SSL_INSECURE_NO_CA=true only if you accept risk.
 */
function resolvePgSslConfig(connectionString: string, sslModeFromUrl: string | null): PgSslConfig {
  const mode = (sslModeFromUrl || "").toLowerCase();
  if (mode === "disable") {
    return false;
  }

  const wantTls =
    shouldUseSsl(connectionString) ||
    mode === "require" ||
    mode === "verify-ca" ||
    mode === "verify-full" ||
    mode === "prefer";

  if (!wantTls) {
    return false;
  }

  const ca = readSslCaBundle();
  if (ca) {
    return { rejectUnauthorized: true, ca };
  }

  if (!IS_PROD_RUNTIME) {
    return { rejectUnauthorized: false };
  }

  if (String(process.env.DB_SSL_INSECURE_NO_CA || "").toLowerCase() === "true") {
    console.warn(
      "[DB] DB_SSL_INSECURE_NO_CA=true: TLS to Postgres without CA verification in a production-like runtime. Prefer DB_SSL_CA (e.g. DigitalOcean ca-certificate.crt).",
    );
    return { rejectUnauthorized: false };
  }

  // Production-like, no CA: try strict verify (works if chain is in system trust store).
  return { rejectUnauthorized: true };
}

function getRequiredUrl(target: DatabaseTarget): string {
  if (target === "production") {
    const prod = PROD_URL?.trim();
    const dev = DEV_URL?.trim();

    if (prod) {
      console.log("selected_db_target=production_prod_url");
      return prod;
    }

    if (dev) {
      if (ALLOW_PROD_FALLBACK_TO_DATABASE_URL) {
        console.log("selected_db_target=production_database_url_fallback_flag");
      } else {
        console.log("selected_db_target=production_database_url_singleton");
      }
      return dev;
    }

    throw new Error(
      "Production database URL missing: set PROD_DATABASE_URL (recommended) or DATABASE_URL.",
    );
  }

  if (DEV_URL) return DEV_URL;

  // Dev/test environments may intentionally run without DB; keep behavior non-fatal.
  console.error("[DB] DATABASE_URL is not set. Development DB calls will fail until DATABASE_URL is configured.");
  return "postgresql://127.0.0.1:1/nurse_nest_db_not_configured";
}

function getPoolLabel(target: DatabaseTarget): string {
  return target === "production" ? "Prod" : "Dev";
}

function getApplicationName(target: DatabaseTarget): string {
  return `nursenest-${NODE_ENV}-${target}`;
}

function normalizeQueryText(queryText: string): string {
  return queryText.replace(/\s+/g, " ").trim().slice(0, 300);
}

function logSlowOrFailedQuery(
  target: DatabaseTarget,
  queryText: string,
  start: number,
  error?: unknown,
): void {
  const elapsed = Date.now() - start;
  const shortQuery = normalizeQueryText(queryText);

  if (error) {
    console.error(`[DB:${target}] Query failed after ${elapsed}ms: ${shortQuery}`, error);
    return;
  }

  if (elapsed > SLOW_QUERY_THRESHOLD_MS) {
    console.warn(`[DB:${target}] Slow query ${elapsed}ms: ${shortQuery}`);
  }
}

function wrapPoolQuery(pool: pg.Pool, target: DatabaseTarget): void {
  const originalQuery = pool.query.bind(pool);

  pool.query = (async (...args: any[]) => {
    const start = Date.now();
    const queryText =
      typeof args[0] === "string"
        ? args[0]
        : typeof args[0]?.text === "string"
          ? args[0].text
          : "(complex query)";

    try {
      const result = await (originalQuery as (...fnArgs: unknown[]) => Promise<unknown>).apply(pool, args);
      logSlowOrFailedQuery(target, queryText, start);
      return result;
    } catch (error) {
      logSlowOrFailedQuery(target, queryText, start, error);
      throw error;
    }
  }) as any;
}

function createPool(target: DatabaseTarget): pg.Pool {
  const rawConnectionString = getRequiredUrl(target);
  const { cleaned: connectionString, sslModeFromUrl } = stripSslParamsFromConnectionString(rawConnectionString);
  const ssl = resolvePgSslConfig(rawConnectionString, sslModeFromUrl);
  const sslEnabled = ssl !== false;

  const pool = new pg.Pool({
    connectionString,
    statement_timeout: DEFAULT_STATEMENT_TIMEOUT_MS,
    connectionTimeoutMillis: DEFAULT_CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: DEFAULT_IDLE_TIMEOUT_MS,
    max: DEFAULT_MAX_POOL_SIZE,
    application_name: getApplicationName(target),
    ssl,
  });

  wrapPoolQuery(pool, target);

  pool.on("connect", (client) => {
    client.on("error", (err) => {
      console.error(`[DB:${target}] Client error`, err);
    });
  });

  pool.on("error", (err) => {
    console.error(`[DB:${target}] Unexpected pool error`, err);
  });

  const sslVerify =
    ssl && typeof ssl === "object" ? (ssl.rejectUnauthorized ? "verify" : "tls_no_ca_verify") : "off";
  console.log(
    `[DB] ${getPoolLabel(target)} pool created → ${maskUrl(connectionString)} ` +
      `(statement_timeout=${DEFAULT_STATEMENT_TIMEOUT_MS}ms, ` +
      `connection_timeout=${DEFAULT_CONNECTION_TIMEOUT_MS}ms, ` +
      `idle_timeout=${DEFAULT_IDLE_TIMEOUT_MS}ms, ` +
      `max=${DEFAULT_MAX_POOL_SIZE}, ssl=${sslEnabled}, ssl_verify=${sslVerify}, app=${getApplicationName(target)})`,
  );

  return pool;
}

let devPool: pg.Pool | null = null;
let prodPool: pg.Pool | null = null;
let isClosingPools = false;

export function getDevPool(): pg.Pool {
  // In production runtime we never want to create/use a "dev" pool.
  // Some code paths still call getDevPool(); route them to prod pool instead.
  if (IS_PROD_RUNTIME) {
    return getProdPool();
  }
  if (!devPool) {
    devPool = createPool("development");
  }
  return devPool;
}

export function getProdPool(): pg.Pool {
  if (!prodPool) {
    prodPool = createPool("production");
  }
  return prodPool;
}

export function getPool(target?: DatabaseTarget): pg.Pool {
  const resolved = target ?? (IS_PROD_RUNTIME ? "production" : "development");
  return resolved === "production" ? getProdPool() : getDevPool();
}

/**
 * pg.Pool proxy that resolves {@link getPool} on first property access.
 * Prefer this over `const pool = getPool()` at module scope so merely importing a module never connects to the DB.
 */
export function createLazyPrimaryPoolProxy(): pg.Pool {
  return new Proxy({} as pg.Pool, {
    get(_target, propKey) {
      const p = getPool() as any;
      const value = p[propKey as keyof pg.Pool];
      if (typeof value === "function") return (value as (...a: unknown[]) => unknown).bind(p);
      return value;
    },
  }) as pg.Pool;
}

export function hasSeparateProdDb(): boolean {
  return !!(PROD_URL && PROD_URL !== DEV_URL);
}

/**
 * One-line startup log: which connection string drives the primary pool in this process.
 * Does not throw; safe before pools are created.
 */
export function logStartupDatabaseResolution(): void {
  const productionLike = isProductionLikeRuntime();
  const hasProd = Boolean(PROD_URL?.trim());
  const hasDev = Boolean(DEV_URL?.trim());

  let primaryLabel: string;
  let maskedPrimary: string;

  if (productionLike) {
    if (hasProd) {
      primaryLabel = "PROD_DATABASE_URL";
      maskedPrimary = maskUrl(PROD_URL);
    } else if (hasDev) {
      primaryLabel = "DATABASE_URL (PROD_DATABASE_URL unset)";
      maskedPrimary = maskUrl(DEV_URL);
    } else {
      primaryLabel = "none";
      maskedPrimary = "(not set)";
    }
  } else if (hasDev) {
    primaryLabel = "DATABASE_URL";
    maskedPrimary = maskUrl(DEV_URL);
  } else {
    primaryLabel = "none";
    maskedPrimary = "(not set)";
  }

  console.log(
    JSON.stringify({
      type: "db_config_startup",
      productionLikeRuntime: productionLike,
      primaryPoolUses: primaryLabel,
      maskedPrimaryUrl: maskedPrimary,
      hasDatabaseUrl: hasDev,
      hasProdDatabaseUrl: hasProd,
      separateProdDbConfigured: hasSeparateProdDb(),
      note: "Exactly one of DATABASE_URL or PROD_DATABASE_URL is sufficient for production; both are optional to set together.",
    }),
  );
}

export function getDbInfo() {
  return {
    devUrl: maskUrl(DEV_URL),
    prodUrl: maskUrl(PROD_URL),
    hasSeparateProd: hasSeparateProdDb(),
    environment: NODE_ENV,
    allowProdFallbackToDatabaseUrl: ALLOW_PROD_FALLBACK_TO_DATABASE_URL,
    poolDefaults: {
      statementTimeoutMs: DEFAULT_STATEMENT_TIMEOUT_MS,
      connectionTimeoutMs: DEFAULT_CONNECTION_TIMEOUT_MS,
      idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MS,
      maxPoolSize: DEFAULT_MAX_POOL_SIZE,
      slowQueryThresholdMs: SLOW_QUERY_THRESHOLD_MS,
    },
    appNames: {
      development: getApplicationName("development"),
      production: getApplicationName("production"),
    },
  };
}

export function logDatabaseTarget(operation: string, target: DatabaseTarget): void {
  const url =
    target === "production" ? PROD_URL || DEV_URL : DEV_URL;

  console.log(
    `[DB] ${operation} → targeting ${target.toUpperCase()} database (${maskUrl(url)})`,
  );
}

export function logRowCount(operation: string, count: number): void {
  console.log(`[DB] ${operation} → ${count} rows affected`);
}

export async function testDatabaseConnection(
  target?: DatabaseTarget,
): Promise<{ ok: boolean; target: DatabaseTarget; timeMs: number; now?: string; error?: string }> {
  const resolved = target ?? (IS_PROD_RUNTIME ? "production" : "development");
  const pool = getPool(resolved);
  const started = Date.now();

  try {
    const result = await pool.query("SELECT 1 AS ok, NOW() AS now");
    return {
      ok: true,
      target: resolved,
      timeMs: Date.now() - started,
      now: result.rows[0]?.now?.toISOString?.() || String(result.rows[0]?.now || ""),
    };
  } catch (error: any) {
    return {
      ok: false,
      target: resolved,
      timeMs: Date.now() - started,
      error: error?.message || "Unknown database connection error",
    };
  }
}

export async function closeAllPools(): Promise<void> {
  if (isClosingPools) return;
  isClosingPools = true;

  try {
    const shutdowns: Promise<void>[] = [];

    if (devPool) {
      const currentDevPool = devPool;
      devPool = null;
      shutdowns.push(
        currentDevPool.end().then(() => {
          console.log("[DB] Dev pool closed");
        }),
      );
    }

    if (prodPool) {
      const currentProdPool = prodPool;
      prodPool = null;
      shutdowns.push(
        currentProdPool.end().then(() => {
          console.log("[DB] Prod pool closed");
        }),
      );
    }

    await Promise.all(shutdowns);
  } finally {
    isClosingPools = false;
  }
}