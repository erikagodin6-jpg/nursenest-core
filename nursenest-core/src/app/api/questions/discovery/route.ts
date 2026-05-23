cd ~/nursenest-core

git add \
  nursenest-core/src/lib/entitlements/get-user-access.ts \
  nursenest-core/src/lib/flashcards/load-flashcards-exam-inventory.server.ts \
  nursenest-core/src/app/api/flashcards/inventory/route.ts \
  nursenest-core/src/app/api/questions/discovery/route.ts

git commit -m "fix(stability): reduce entitlement DB load + bound/cache paid aggregates"
git pushimport type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { enforceDiscoveryProtection } from "@/lib/http/api-protection";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { normalizePathwayIdForStudySurfaces } from "@/lib/study-question-pool/study-pathway-normalize";
import { diagnoseDiscoveryEmpty } from "@/lib/questions/discovery-empty-diagnostics";
import {
  DISCOVERY_SQL_EXAM_LIMIT,
  DISCOVERY_SQL_TOPIC_LIMIT,
  loadSubscriberDiscoveryAggregates,
} from "@/lib/questions/subscriber-discovery-aggregates";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { logLargeApiResponse } from "@/lib/observability/perf-log";

export const dynamic = "force-dynamic";

type DiscoveryCacheEntry = { cachedAtMs: number; body: unknown };
const discoveryCache = new Map<string, DiscoveryCacheEntry>();
const DISCOVERY_CACHE_TTL_MS = 30_000;
const DISCOVERY_CACHE_MAX = 2000;

function discoveryCacheKey(userId: string, pathwayId: string | null, language: string): string {
  return `${userId}::${pathwayId ?? ""}::${language}`;
}

/** Cap grouped rows returned to the client (must match SQL LIMITs in subscriber-discovery-aggregates). */
const DISCOVERY_TOPIC_BUCKET_CAP = DISCOVERY_SQL_TOPIC_LIMIT;
const DISCOVERY_EXAM_BUCKET_CAP = DISCOVERY_SQL_EXAM_LIMIT;

/**
 * Lightweight bank discovery: topic buckets + counts + exam code breakdown (no question bodies).
 * Aggregates use SQL LIMITs so the database never materializes unbounded distinct groups for the app.
 */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/questions/discovery", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;
  const requestedPathwayIdRaw = req.nextUrl.searchParams.get("pathwayId");
  const requestedPathwayId = requestedPathwayIdRaw
    ? normalizePathwayIdForStudySurfaces(requestedPathwayIdRaw, gate.entitlement.country)
    : null;
  const requestedLanguage = req.nextUrl.searchParams.get("language")?.trim() || "en";
  const examContext = requestedPathwayId ? buildGlobalExamContext(requestedPathwayId, requestedLanguage) : null;

  const blocked = await enforceDiscoveryProtection(req, gate.userId);
  if (blocked) return blocked;

  setSentryServerContext({ route: "/api/questions/discovery", feature: SERVER_FEATURE.question, userId: gate.userId });

  const cacheKey = discoveryCacheKey(gate.userId, requestedPathwayId, requestedLanguage);
  const cached = discoveryCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAtMs < DISCOVERY_CACHE_TTL_MS) {
    const res = NextResponse.json(cached.body);
    res.headers.set("x-nn-discovery-cache", "hit");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  try {
    if (requestedPathwayId && !examContext) {
      safeServerLog("api_questions_discovery", "invalid_pathway_scope", { pathwayId: requestedPathwayId });
      return NextResponse.json({
        total: 0,
        buckets: [],
        examFamily: [],
        limits: {
          topicBucketCap: DISCOVERY_TOPIC_BUCKET_CAP,
          examBucketCap: DISCOVERY_EXAM_BUCKET_CAP,
          topicsTruncated: false,
          examsTruncated: false,
          topicsOmittedCount: 0,
          examsOmittedCount: 0,
          aggregateStrategy: "sql_top_n" as const,
        },
      });
    }

    const t0 = performance.now();
    const { total, topicRows, examRows } = await withRetry(() =>
      loadSubscriberDiscoveryAggregates(gate.entitlement, examContext),
    );
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("api_questions_discovery", "aggregate_timing", {
      durationMs,
      total,
      topicBucketRows: topicRows.length,
      examBucketRows: examRows.length,
      pathwayId: examContext?.pathwayId,
      examKey: examContext?.exam,
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

    const discoveryBody = {
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
    };
    logLargeApiResponse("/api/questions/discovery", estimateJsonUtf8Bytes(discoveryBody));

    if (discoveryCache.size > DISCOVERY_CACHE_MAX) discoveryCache.clear();
    discoveryCache.set(cacheKey, { cachedAtMs: Date.now(), body: discoveryBody });

    const res = NextResponse.json(discoveryBody);
    res.headers.set("x-nn-discovery-cache", "miss");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  } catch (e) {
    emitStructuredLog("question_load_failed", "error", {
      correlationId: correlationIdFromRequest(req),
      route: "/api/questions/discovery",
      method: "GET",
      flow: "content",
      httpStatus: 503,
      errorClass: e instanceof Error ? e.name : "unknown",
      message: "question discovery aggregate failure",
    });
    safeServerLogCritical("api_questions_discovery", "failed", {}, e);
    return NextResponse.json(
      { error: "Unable to load discovery", code: "service_unavailable" },
      { status: 503 },
    );
  }
  });
}
