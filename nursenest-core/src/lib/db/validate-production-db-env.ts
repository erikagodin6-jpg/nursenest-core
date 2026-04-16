/**
 * Startup checks for database configuration (production Node runtime only).
 * Never logs credentials — only scheme, host presence, and missing-timeout warnings.
 *
 * After `env-bootstrap`, `DATABASE_URL` normally includes `connect_timeout`, pool limits, and
 * `options=-c statement_timeout=…` unless overridden — validate against the **effective** URL.
 */
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

function effectiveDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL?.trim();
}

function hasStatementTimeoutConfigured(raw: string): boolean {
  if (raw.includes("statement_timeout")) return true;
  try {
    const opt = new URL(raw).searchParams.get("options") ?? "";
    return /statement_timeout\s*=/.test(opt);
  } catch {
    return false;
  }
}

function hasConnectTimeoutConfigured(raw: string): boolean {
  try {
    return new URL(raw).searchParams.has("connect_timeout");
  } catch {
    return raw.includes("connect_timeout");
  }
}

/**
 * Call from `instrumentation` after `env-bootstrap` / `logDatabaseEnvOnce`.
 * Does not throw — logs actionable errors so misconfigured deploys are visible in platform logs.
 */
export function validateProductionDatabaseEnv(): void {
  if (process.env.NODE_ENV !== "production") return;

  if (!isDatabaseUrlConfigured()) {
    console.error(
      "[nursenest-core] database env: DATABASE_URL is missing. Prisma will fail at query time — set DATABASE_URL to your Postgres connection string.",
    );
    return;
  }

  const raw = effectiveDatabaseUrl();
  if (!raw) return;

  try {
    const u = new URL(raw);
    const scheme = u.protocol.replace(":", "").toLowerCase();
    if (scheme !== "postgresql" && scheme !== "postgres") {
      console.error(
        `[nursenest-core] database env: DATABASE_URL must use postgres protocol (got "${scheme}").`,
      );
    }
  } catch {
    console.error("[nursenest-core] database env: DATABASE_URL is not a valid URL — check escaping and format.");
  }

  if (!hasStatementTimeoutConfigured(raw)) {
    console.warn(
      "[nursenest-core] database env: no statement_timeout in DATABASE_URL (or libpq options). env-bootstrap injects one by default; if you disabled it (PRISMA_STATEMENT_TIMEOUT_MS=0), set server-side timeouts or options manually so runaway queries cannot block workers.",
    );
  }

  if (!hasConnectTimeoutConfigured(raw)) {
    console.warn(
      "[nursenest-core] database env: no connect_timeout in DATABASE_URL — env-bootstrap injects PRISMA_CONNECT_TIMEOUT_SEC (default 10s) so connections fail fast during failover; verify effective URL after bootstrap.",
    );
  }

  if (!raw.includes("connection_limit") && !process.env.PRISMA_CONNECTION_LIMIT) {
    console.warn(
      "[nursenest-core] database env: no connection_limit in URL and PRISMA_CONNECTION_LIMIT unset — env-bootstrap injects defaults; verify pool size vs Postgres max_connections.",
    );
  }
}
