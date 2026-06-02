import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { analyzeTrend } from "@/lib/observability/trend-analytics";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" } as const;

// ─── DB helpers ───────────────────────────────────────────────────────────────

async function loadFeatureSnapshots(featureId: string, sinceMs: number) {
  if (!isDatabaseUrlConfigured()) return [];
  try {
    return await prisma.featureHealthSnapshot.findMany({
      where: {
        featureId,
        snapshotDate: { gte: new Date(Date.now() - sinceMs) },
      },
      orderBy: { snapshotDate: "asc" },
      select: { snapshotDate: true, score: true, status: true, p95StartupMs: true, errorRate: true },
    });
  } catch { return []; }
}

async function loadErrorCounts(windowMs: number) {
  if (!isDatabaseUrlConfigured()) return { criticalRoutes: 0, fallbackDelivery: 0 };
  const since = new Date(Date.now() - windowMs);
  try {
    const [criticalRoutes, fallbackDelivery] = await Promise.all([
      prisma.criticalRouteErrors.count({ where: { createdAt: { gte: since } } }),
      prisma.fallbackDeliveryEvents.count({ where: { createdAt: { gte: since } } }),
    ]);
    return { criticalRoutes, fallbackDelivery };
  } catch { return { criticalRoutes: 0, fallbackDelivery: 0 }; }
}

// ─── Aggregation helpers ──────────────────────────────────────────────────────

type DbSnapshot = { snapshotDate: Date; score: number; status: string; p95StartupMs: number | null; errorRate: number | null };

function toTimeSeries(rows: DbSnapshot[], valueKey: "score" | "p95StartupMs") {
  return rows
    .filter(r => r[valueKey] !== null)
    .map(r => ({ ts: r.snapshotDate.getTime(), value: Number(r[valueKey]) }));
}

function bucketed(rows: DbSnapshot[], bucketMs: number, valueKey: "score" | "p95StartupMs") {
  const buckets = new Map<number, number[]>();
  for (const r of rows) {
    const v = r[valueKey];
    if (v === null) continue;
    const bucket = Math.floor(r.snapshotDate.getTime() / bucketMs) * bucketMs;
    const arr = buckets.get(bucket) ?? [];
    arr.push(Number(v));
    buckets.set(bucket, arr);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a - b)
    .map(([ts, values]) => ({
      ts,
      avg: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    }));
}

function incidentCount(rows: DbSnapshot[]) {
  return rows.filter(r => r.status === "critical" || r.status === "degraded").length;
}

function uptimePct(rows: DbSnapshot[]): string {
  if (rows.length === 0) return "—";
  const healthy = rows.filter(r => r.status === "healthy").length;
  return ((healthy / rows.length) * 100).toFixed(1) + "%";
}

// ─── Route ────────────────────────────────────────────────────────────────────

const ONE_HOUR_MS  = 60 * 60 * 1000;
const ONE_DAY_MS   = 24 * ONE_HOUR_MS;
const SEVEN_DAY_MS = 7 * ONE_DAY_MS;
const BUCKET_1H_MS  = 5 * 60 * 1000;   // 5-min buckets for last-hour sparklines
const BUCKET_24H_MS = 30 * 60 * 1000;  // 30-min buckets for 24h chart
const BUCKET_7D_MS  = 4 * ONE_HOUR_MS; // 4-hour buckets for 7d chart

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const SEVEN_DAYS = SEVEN_DAY_MS;

  // Load DB snapshots for all feature IDs over 7d (one query window covers all sub-windows)
  const [dbRows, redisRows, rlRows, errors1h, errors24h, errors7d] = await Promise.all([
    loadFeatureSnapshots("infra.db.readiness", SEVEN_DAYS),
    loadFeatureSnapshots("infra.redis.primary", SEVEN_DAYS),
    loadFeatureSnapshots("infra.ratelimit.fallback", SEVEN_DAYS),
    loadErrorCounts(ONE_HOUR_MS),
    loadErrorCounts(ONE_DAY_MS),
    loadErrorCounts(SEVEN_DAY_MS),
  ]);

  // Slice sub-windows
  const cutoff24h = Date.now() - ONE_DAY_MS;
  const cutoff1h  = Date.now() - ONE_HOUR_MS;

  const db24h = dbRows.filter(r => r.snapshotDate.getTime() >= cutoff24h);
  const db1h  = dbRows.filter(r => r.snapshotDate.getTime() >= cutoff1h);
  const redis24h = redisRows.filter(r => r.snapshotDate.getTime() >= cutoff24h);
  const rl24h    = rlRows.filter(r => r.snapshotDate.getTime() >= cutoff24h);

  // In-process ring buffer trends (last 24h window)
  const dbLatencyTrend   = analyzeTrend("infra.db.latency_ms", "7d", { lowerIsBetter: true });
  const redisReachTrend  = analyzeTrend("infra.redis.reachable", "7d", { lowerIsBetter: false });
  const rlEventTrend     = analyzeTrend("infra.ratelimit.fallback_events", "7d", { lowerIsBetter: true });
  const errorTrend       = analyzeTrend("infra.errors.critical_routes", "7d", { lowerIsBetter: true });

  // Phase 4: error sparklines from ring buffer (last 24 data points)
  const errorSparkline = (analyzeTrend("infra.errors.critical_routes", "7d")).dataPoints.slice(-24);
  const fallbackSparkline = (analyzeTrend("infra.errors.fallback_delivery", "7d")).dataPoints.slice(-24);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),

    // Phase 1: Database trends
    database: {
      ringBuffer: {
        trend: dbLatencyTrend.direction,
        movingAvgMs: dbLatencyTrend.movingAverage,
        currentMs: dbLatencyTrend.currentValue,
        dataPoints: dbLatencyTrend.dataPoints.slice(-60), // last 60 in-process points
      },
      lastHour: {
        rows: toTimeSeries(db1h, "p95StartupMs"),
        buckets: bucketed(db1h, BUCKET_1H_MS, "p95StartupMs"),
        avgLatencyMs: db1h.length > 0
          ? Math.round(db1h.reduce((s, r) => s + (r.p95StartupMs ?? 0), 0) / db1h.length)
          : null,
        incidents: incidentCount(db1h),
        uptimePct: uptimePct(db1h),
      },
      last24h: {
        buckets: bucketed(db24h, BUCKET_24H_MS, "p95StartupMs"),
        avgLatencyMs: db24h.length > 0
          ? Math.round(db24h.reduce((s, r) => s + (r.p95StartupMs ?? 0), 0) / db24h.length)
          : null,
        incidents: incidentCount(db24h),
        uptimePct: uptimePct(db24h),
      },
      last7d: {
        buckets: bucketed(dbRows, BUCKET_7D_MS, "p95StartupMs"),
        avgLatencyMs: dbRows.length > 0
          ? Math.round(dbRows.reduce((s, r) => s + (r.p95StartupMs ?? 0), 0) / dbRows.length)
          : null,
        incidents: incidentCount(dbRows),
        uptimePct: uptimePct(dbRows),
        snapshotCount: dbRows.length,
      },
    },

    // Phase 2: Redis trends
    redis: {
      ringBuffer: {
        trend: redisReachTrend.direction,
        dataPoints: redisReachTrend.dataPoints.slice(-60),
      },
      last24h: {
        reachableCount: redis24h.filter(r => r.status === "healthy").length,
        degradedCount: redis24h.filter(r => r.status === "degraded").length,
        criticalCount: redis24h.filter(r => r.status === "critical").length,
        total: redis24h.length,
        uptimePct: uptimePct(redis24h),
      },
      last7d: {
        reachableCount: redisRows.filter(r => r.status === "healthy").length,
        degradedCount: redisRows.filter(r => r.status === "degraded").length,
        criticalCount: redisRows.filter(r => r.status === "critical").length,
        total: redisRows.length,
        uptimePct: uptimePct(redisRows),
        snapshotCount: redisRows.length,
      },
    },

    // Phase 3: Rate limit trends
    rateLimit: {
      ringBuffer: {
        trend: rlEventTrend.direction,
        dataPoints: rlEventTrend.dataPoints.slice(-60),
      },
      last24h: {
        peakFallbackEvents: rl24h.length > 0 ? Math.max(...rl24h.map(r => r.score)) : 0,
        avgBucketUsage: rl24h.length > 0
          ? (rl24h.reduce((s, r) => s + (r.errorRate ? Number(r.errorRate) : 0), 0) / rl24h.length * 100).toFixed(1)
          : "—",
        fallbackActiveCount: rl24h.filter(r => r.score > 0).length,
      },
      last7d: {
        peakFallbackEvents: rlRows.length > 0 ? Math.max(...rlRows.map(r => r.score)) : 0,
        fallbackActiveCount: rlRows.filter(r => r.score > 0).length,
        snapshotCount: rlRows.length,
      },
    },

    // Phase 4: Error trends
    errors: {
      ringBuffer: {
        criticalRoutesTrend: errorTrend.direction,
        criticalRoutesSparkline: errorSparkline,
        fallbackSparkline,
      },
      lastHour:  { criticalRoutes: errors1h.criticalRoutes,  fallbackDelivery: errors1h.fallbackDelivery },
      last24h:   { criticalRoutes: errors24h.criticalRoutes, fallbackDelivery: errors24h.fallbackDelivery },
      last7d:    { criticalRoutes: errors7d.criticalRoutes,  fallbackDelivery: errors7d.fallbackDelivery },
    },

    // Phase 5: Operational summary
    summary: {
      today: {
        dbUptime: uptimePct(db24h),
        dbIncidents: incidentCount(db24h),
        redisUptime: uptimePct(redis24h),
        redisOutages: redis24h.filter(r => r.status === "critical").length,
        rlFallbackActivations: rl24h.filter(r => r.score > 0).length,
        criticalErrors: errors24h.criticalRoutes,
        fallbackDeliveries: errors24h.fallbackDelivery,
        slowDbPeriods: db24h.filter(r => (r.p95StartupMs ?? 0) > 2000).length,
      },
      last7d: {
        dbUptime: uptimePct(dbRows),
        dbIncidents: incidentCount(dbRows),
        redisUptime: uptimePct(redisRows),
        redisOutages: redisRows.filter(r => r.status === "critical").length,
        rlFallbackActivations: rlRows.filter(r => r.score > 0).length,
        criticalErrors: errors7d.criticalRoutes,
        fallbackDeliveries: errors7d.fallbackDelivery,
        slowDbPeriods: dbRows.filter(r => (r.p95StartupMs ?? 0) > 2000).length,
        snapshotCoverage: dbRows.length,
      },
    },

    meta: {
      ringBufferDescription: "In-process ring buffer — resets on deploy. Max 500 data points per metric.",
      dbDescription: "FeatureHealthSnapshot rows — written every 5 min per feature, retained indefinitely.",
      errorTablesDescription: "critical_route_errors and fallback_delivery_events — raw counts from production tables.",
    },
  }, { headers: NO_STORE });
}
