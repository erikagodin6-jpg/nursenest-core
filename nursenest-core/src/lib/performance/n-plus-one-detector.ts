/**
 * N+1 Query Detector
 *
 * Analyses the in-memory Prisma query log (from prisma-query-capture.ts) to detect:
 *
 *   1. Repeated model queries — same model.action executed N≥3 times in one request.
 *      Classic N+1: forEach(users) → user.findUnique(id) × N
 *
 *   2. Sequential waterfalls — chains of queries where each depends on the previous.
 *      Signal: high query count with similar inter-query gaps.
 *
 *   3. Unbounded table scans — SELECT with no WHERE clause or LIMIT on large tables.
 *
 * The detector is intentionally conservative — it flags probable N+1s for human review,
 * not guaranteed ones. False-positive rate is acceptable for a dev/CI tool.
 *
 * Integration:
 *   import { detectNPlusOnePatterns } from "@/lib/performance/n-plus-one-detector";
 *   import { getPrismaQueryLog } from "@/lib/db/prisma-query-capture";
 *
 *   const patterns = detectNPlusOnePatterns(getPrismaQueryLog(), {
 *     route: "/app/questions",
 *     threshold: 3,
 *   });
 */

import type { CapturedPrismaQuery } from "@/lib/db/prisma-query-capture";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NPlusOnePattern = {
  type: "repeated-query" | "sequential-waterfall" | "unbounded-scan";
  model: string;
  action?: string;
  count: number;
  totalDurationMs: number;
  description: string;
  severity: "warn" | "critical";
};

export type NPlusOneReport = {
  route: string;
  totalQueries: number;
  patterns: NPlusOnePattern[];
  hasN1: boolean;
  hasWaterfall: boolean;
  hasUnboundedScan: boolean;
  estimatedWastedMs: number;
};

export type NPlusOneDetectorOptions = {
  route: string;
  /** Minimum repetition count to flag as N+1 (default: 3). */
  threshold?: number;
  /** Minimum total query count before waterfall detection runs (default: 10). */
  waterfallQueryMinCount?: number;
};

// ─── SQL analysis helpers ─────────────────────────────────────────────────────

/** Extract model name from Prisma raw SQL. Best-effort, not guaranteed. */
function extractModelFromSql(sql: string): string {
  const match =
    sql.match(/(?:FROM|UPDATE|INSERT INTO|DELETE FROM)\s+"?(\w+)"?/i) ??
    sql.match(/SELECT .+ FROM "?(\w+)"?/i);
  return match?.[1] ?? "unknown";
}

/** Extract operation type from SQL. */
function extractActionFromSql(sql: string): string {
  const upper = sql.trim().toUpperCase();
  if (upper.startsWith("SELECT")) return "findMany";
  if (upper.startsWith("INSERT")) return "create";
  if (upper.startsWith("UPDATE")) return "update";
  if (upper.startsWith("DELETE")) return "delete";
  return "query";
}

/**
 * Normalizes a SQL query for fingerprinting: replaces literal values with `?`
 * so that queries differing only in WHERE clause values are identified as "same".
 */
function fingerprintSql(sql: string): string {
  return sql
    .replace(/\$\d+/g, "?")           // Prisma positional params: $1, $2, …
    .replace(/'[^']*'/g, "'?'")        // String literals
    .replace(/\d+/g, "0")             // Numeric literals
    .replace(/\s+/g, " ")             // Normalize whitespace
    .trim()
    .slice(0, 200);
}

/** Returns true if a SQL query looks like an unbounded full-table scan. */
function isLikelyUnboundedScan(sql: string): boolean {
  const upper = sql.trim().toUpperCase();
  if (!upper.startsWith("SELECT")) return false;
  if (upper.includes("WHERE") || upper.includes("LIMIT")) return false;
  if (upper.includes("COUNT(*)")) return false;
  const model = extractModelFromSql(sql);
  // Only flag for models that are typically large in production
  const largeTables = new Set([
    "exam_question",
    "examquestion",
    "practice_test",
    "practicetest",
    "exam_session",
    "examsession",
    "blog_post",
    "blogpost",
    "user",
    "flashcard",
    "lesson",
  ]);
  return largeTables.has(model.toLowerCase());
}

// ─── Detection logic ──────────────────────────────────────────────────────────

/**
 * Detects N+1 and waterfall query patterns in a request's query log.
 */
export function detectNPlusOnePatterns(
  queries: CapturedPrismaQuery[],
  opts: NPlusOneDetectorOptions,
): NPlusOneReport {
  const threshold = opts.threshold ?? 3;
  const waterfallMinCount = opts.waterfallQueryMinCount ?? 10;

  const patterns: NPlusOnePattern[] = [];

  // ── 1. Repeated query detection ──────────────────────────────────────────────

  const fingerprintMap = new Map<
    string,
    { count: number; totalMs: number; model: string; action: string }
  >();

  for (const q of queries) {
    const fp = fingerprintSql(q.query);
    const model = extractModelFromSql(q.query);
    const action = extractActionFromSql(q.query);

    const existing = fingerprintMap.get(fp);
    if (existing) {
      existing.count++;
      existing.totalMs += q.durationMs;
    } else {
      fingerprintMap.set(fp, { count: 1, totalMs: q.durationMs, model, action });
    }
  }

  let estimatedWastedMs = 0;

  for (const [, stats] of fingerprintMap) {
    if (stats.count < threshold) continue;
    const avgMs = stats.totalMs / stats.count;
    // Wasted time = (count - 1) queries that could have been batched
    const wastedMs = avgMs * (stats.count - 1);
    estimatedWastedMs += wastedMs;

    patterns.push({
      type: "repeated-query",
      model: stats.model,
      action: stats.action,
      count: stats.count,
      totalDurationMs: Math.round(stats.totalMs),
      description:
        `${stats.model}.${stats.action} called ${stats.count}× — possible N+1. ` +
        `Batch with findMany + ID filter or use Prisma includes.`,
      severity: stats.count >= threshold * 3 ? "critical" : "warn",
    });
  }

  // ── 2. Sequential waterfall detection ────────────────────────────────────────

  if (queries.length >= waterfallMinCount) {
    // A waterfall = many queries with short inter-query gaps (< 5ms between them)
    // suggesting synchronous sequential execution rather than parallel batching
    let waterfallRun = 0;
    let waterfallMs = 0;

    for (let i = 1; i < queries.length; i++) {
      // We don't have timestamps in CapturedPrismaQuery, so infer from duration patterns:
      // if all queries are SHORT (< 20ms each) but MANY, it's likely a waterfall loop
      if (queries[i].durationMs < 20 && queries[i - 1].durationMs < 20) {
        waterfallRun++;
        waterfallMs += queries[i].durationMs;
      }
    }

    if (waterfallRun >= waterfallMinCount - 1) {
      patterns.push({
        type: "sequential-waterfall",
        model: "multiple",
        count: waterfallRun,
        totalDurationMs: Math.round(waterfallMs),
        description:
          `${waterfallRun} consecutive short queries detected — ` +
          `possible sequential waterfall. Consider Promise.all() or JOIN/include.`,
        severity: waterfallRun >= 25 ? "critical" : "warn",
      });
      estimatedWastedMs += waterfallMs * 0.5; // Rough estimate of parallelization savings
    }
  }

  // ── 3. Unbounded scan detection ───────────────────────────────────────────────

  for (const q of queries) {
    if (isLikelyUnboundedScan(q.query)) {
      const model = extractModelFromSql(q.query);
      patterns.push({
        type: "unbounded-scan",
        model,
        count: 1,
        totalDurationMs: Math.round(q.durationMs),
        description: `Possible unbounded SELECT on ${model} — add WHERE + LIMIT to avoid full table scan.`,
        severity: q.durationMs > 200 ? "critical" : "warn",
      });
    }
  }

  return {
    route: opts.route,
    totalQueries: queries.length,
    patterns,
    hasN1: patterns.some((p) => p.type === "repeated-query"),
    hasWaterfall: patterns.some((p) => p.type === "sequential-waterfall"),
    hasUnboundedScan: patterns.some((p) => p.type === "unbounded-scan"),
    estimatedWastedMs: Math.round(estimatedWastedMs),
  };
}

/**
 * Formats an N+1 report for structured logging.
 */
export function formatNPlusOneReport(report: NPlusOneReport): Record<string, unknown> {
  return {
    event: "n_plus_one_detected",
    route: report.route,
    totalQueries: report.totalQueries,
    patternCount: report.patterns.length,
    hasN1: report.hasN1,
    hasWaterfall: report.hasWaterfall,
    hasUnboundedScan: report.hasUnboundedScan,
    estimatedWastedMs: report.estimatedWastedMs,
    patterns: report.patterns.map((p) => ({
      type: p.type,
      model: p.model,
      count: p.count,
      severity: p.severity,
    })),
  };
}

/**
 * Emits a structured log warning when N+1 patterns are detected.
 * Safe to call on every request — silently no-ops when no patterns found.
 */
export function warnOnNPlusOne(
  queries: CapturedPrismaQuery[],
  opts: NPlusOneDetectorOptions,
): void {
  if (queries.length < (opts.threshold ?? 3)) return;
  const report = detectNPlusOnePatterns(queries, opts);
  if (!report.patterns.length) return;
  // Use console.warn with structured JSON — picked up by log drains
  console.warn(JSON.stringify(formatNPlusOneReport(report)));
}
