import "server-only";

import { createHash } from "node:crypto";

import { safeServerLog } from "@/lib/observability/safe-server-log";

/** When set to a positive integer (ms), logs queries at or above the threshold via {@link safeServerLog}. */
export function readPrismaSlowQueryThresholdMs(): number {
  const raw = process.env.PRISMA_SLOW_QUERY_LOG_MS?.trim();
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** When set to a positive integer (chars), logs a fingerprint for unusually long SQL text (no literals redacted beyond Prisma’s `$n` params). */
export function readPrismaLargeSqlWarnChars(): number {
  const raw = process.env.PRISMA_LARGE_SQL_WARN_CHARS?.trim();
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function sqlFingerprint(query: string): string {
  return createHash("sha256").update(query).digest("hex").slice(0, 16);
}

/**
 * Opt-in diagnostics for Prisma `$on('query')` hooks. Never logs raw SQL — only hash + coarse size.
 */
export function logPrismaQueryDiagnosticsIfConfigured(durationMs: number, query: string): void {
  const slowMs = readPrismaSlowQueryThresholdMs();
  if (slowMs > 0 && durationMs >= slowMs) {
    safeServerLog("prisma", "slow_query", {
      durationMs: Math.round(durationMs),
      fingerprint: sqlFingerprint(query),
      approxSqlChars: query.length,
    });
  }

  const largeChars = readPrismaLargeSqlWarnChars();
  if (largeChars > 0 && query.length >= largeChars) {
    safeServerLog("prisma", "large_sql_text", {
      fingerprint: sqlFingerprint(query),
      approxSqlChars: query.length,
      durationMs: Math.round(durationMs),
    });
  }
}
