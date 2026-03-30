import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { diagnoseDiscoveryEmpty } from "@/lib/questions/discovery-empty-diagnostics";
import {
  DISCOVERY_SQL_EXAM_LIMIT,
  DISCOVERY_SQL_TOPIC_LIMIT,
  loadSubscriberDiscoveryAggregates,
} from "@/lib/questions/subscriber-discovery-aggregates";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";

/** Cap grouped rows returned to the client (must match SQL LIMITs in subscriber-discovery-aggregates). */
const DISCOVERY_TOPIC_BUCKET_CAP = DISCOVERY_SQL_TOPIC_LIMIT;
const DISCOVERY_EXAM_BUCKET_CAP = DISCOVERY_SQL_EXAM_LIMIT;

/**
 * Lightweight bank discovery: topic buckets + counts + exam code breakdown (no question bodies).
 * Aggregates use SQL LIMITs so the database never materializes unbounded distinct groups for the app.
 */
export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/questions/discovery", feature: "question", userId: gate.userId });

  try {
    const t0 = performance.now();
    const { total, topicRows, examRows } = await withRetry(() =>
      loadSubscriberDiscoveryAggregates(gate.entitlement),
    );
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("api_questions_discovery", "aggregate_timing", {
      durationMs,
      total,
      topicBucketRows: topicRows.length,
      examBucketRows: examRows.length,
    });
    if (durationMs >= 2500) {
      safeServerLog("api_questions_discovery", "aggregate_slow_warn", { durationMs, total });
    }

    const buckets = topicRows.map((row) => ({
      topic: row.topic ?? "Unknown",
      count: Number(row.cnt),
    }));

    const topicsTruncated = topicRows.length >= DISCOVERY_TOPIC_BUCKET_CAP;
    const topicsOmittedCount = topicsTruncated
      ? Math.max(0, total - buckets.reduce((s, b) => s + b.count, 0))
      : 0;

    const examFamily = examRows.map((r) => ({
      exam: r.exam,
      count: Number(r.cnt),
    }));
    const examsTruncated = examRows.length >= DISCOVERY_EXAM_BUCKET_CAP;
    const examsOmittedCount = examsTruncated
      ? Math.max(0, total - examFamily.reduce((s, b) => s + b.count, 0))
      : 0;

    const discoveryDiagnostics = total === 0 ? await diagnoseDiscoveryEmpty(gate.entitlement) : undefined;
    if (discoveryDiagnostics) {
      safeServerLog("api_questions_discovery", "empty_scope", {
        code: discoveryDiagnostics.code,
        publishedGlobal: discoveryDiagnostics.counts.publishedGlobal,
        entitlementPublished: discoveryDiagnostics.counts.entitlementPublished,
      });
    }

    return NextResponse.json({
      total,
      buckets,
      examFamily,
      limits: {
        topicBucketCap: DISCOVERY_TOPIC_BUCKET_CAP,
        examBucketCap: DISCOVERY_EXAM_BUCKET_CAP,
        topicsTruncated,
        examsTruncated,
        topicsOmittedCount,
        examsOmittedCount,
        aggregateStrategy: "sql_top_n" as const,
      },
      ...(discoveryDiagnostics ? { diagnostics: discoveryDiagnostics } : {}),
    });
  } catch (e) {
    safeServerLogCritical("api_questions_discovery", "failed", {}, e);
    return NextResponse.json(
      { error: "Unable to load discovery", code: "service_unavailable" },
      { status: 503 },
    );
  }
}
