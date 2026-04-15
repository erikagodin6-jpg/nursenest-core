/**
 * Startup checks for database configuration (production Node runtime only).
 * Never logs credentials — only scheme, host presence, and missing-timeout warnings.
 */
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

function effectiveDatabaseUrl(): string | undefined {
  const d = process.env.DATABASE_URL?.trim();
  if (d) return d;
  if (process.env.NODE_ENV === "production") {
    const p = process.env.PROD_DATABASE_URL?.trim();
    if (p) return p;
  }
  return undefined;
}

/**
 * Call from `instrumentation` after `env-bootstrap` / `logDatabaseEnvOnce`.
 * Does not throw — logs actionable errors so misconfigured deploys are visible in platform logs.
 */
export function validateProductionDatabaseEnv(): void {
  if (process.env.NODE_ENV !== "production") return;

  if (!isDatabaseUrlConfigured()) {
    console.error(
      "[nursenest-core] database env: DATABASE_URL is missing (and PROD_DATABASE_URL is unset). Prisma will fail at query time — set DATABASE_URL to your Postgres connection string.",
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

  if (!raw.includes("statement_timeout")) {
    console.warn(
      "[nursenest-core] database env: DATABASE_URL has no statement_timeout query param. Consider adding e.g. ?statement_timeout=30000 (ms) so runaway queries fail at the server (tune with traffic; migration jobs may use a separate direct URL).",
    );
  }

  if (!raw.includes("connection_limit") && !process.env.PRISMA_CONNECTION_LIMIT) {
    console.warn(
      "[nursenest-core] database env: no connection_limit in URL and PRISMA_CONNECTION_LIMIT unset — env-bootstrap injects defaults; verify pool size vs Postgres max_connections.",
    );
  }
}
