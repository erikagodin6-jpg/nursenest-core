/**
 * Platform Health Recorder
 *
 * Records infrastructure health snapshots into:
 *   1. In-process ring buffer (trend-analytics.ts) — last-hour resolution
 *   2. FeatureHealthSnapshot DB table — 24h / 7d durable storage
 *
 * Called by the platform-health API route on every admin load.
 * Rate-limited to one DB write per feature per 5 minutes to prevent row explosion.
 *
 * Metric IDs:
 *   "infra.db.latency_ms"           — DB readiness probe latency
 *   "infra.db.reachable"            — 1 = reachable, 0 = failed
 *   "infra.redis.reachable"         — 1 = reachable, 0 = not (unavailable/unreachable)
 *   "infra.redis.misconfigured"     — 1 = misconfigured, 0 = ok
 *   "infra.ratelimit.fallback_events" — running event count (snapshot delta each call)
 *   "infra.ratelimit.bucket_count"  — current in-process bucket count
 *   "infra.errors.critical_routes"  — critical_route_errors count in last hour
 *   "infra.errors.fallback_delivery" — fallback_delivery_events count in last hour
 */

import "server-only";
import { recordMetricDataPoint } from "@/lib/observability/trend-analytics";
import type { RedisHealthState } from "@/lib/server/redis";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

// ─── Rate-limit DB writes (5-min bucket per feature) ──────────────────────────
const WRITE_INTERVAL_MS = 5 * 60 * 1000;
const lastWriteMs = new Map<string, number>();

function shouldWrite(featureId: string): boolean {
  const last = lastWriteMs.get(featureId) ?? 0;
  return Date.now() - last > WRITE_INTERVAL_MS;
}

function markWritten(featureId: string): void {
  lastWriteMs.set(featureId, Date.now());
}

function statusFromScore(score: number, thresholdOk: number): string {
  if (score >= thresholdOk) return "healthy";
  if (score > 0) return "degraded";
  return "critical";
}

async function writeSnapshot(
  featureId: string,
  score: number,
  status: string,
  extras: { p95StartupMs?: number; errorRate?: number; cacheHitRate?: number } = {},
): Promise<void> {
  if (!shouldWrite(featureId)) return;
  markWritten(featureId);
  try {
    await prisma.featureHealthSnapshot.create({
      data: {
        featureId,
        score,
        status,
        ...(extras.p95StartupMs !== undefined ? { p95StartupMs: extras.p95StartupMs } : {}),
        ...(extras.errorRate !== undefined ? { errorRate: extras.errorRate } : {}),
        ...(extras.cacheHitRate !== undefined ? { cacheHitRate: extras.cacheHitRate } : {}),
      },
    });
  } catch {
    // DB write failure must not surface — recorder is fire-and-forget
  }
}

// ─── Error count helpers ──────────────────────────────────────────────────────

async function countRecentErrors(sinceMs: number): Promise<{ criticalRoutes: number; fallbackDelivery: number }> {
  if (!isDatabaseUrlConfigured()) return { criticalRoutes: 0, fallbackDelivery: 0 };
  const since = new Date(Date.now() - sinceMs);
  try {
    const [criticalRoutes, fallbackDelivery] = await Promise.all([
      prisma.criticalRouteErrors.count({ where: { createdAt: { gte: since } } }),
      prisma.fallbackDeliveryEvents.count({ where: { createdAt: { gte: since } } }),
    ]);
    return { criticalRoutes, fallbackDelivery };
  } catch {
    return { criticalRoutes: 0, fallbackDelivery: 0 };
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type HealthRecordInput = {
  db: { reachable: boolean | null; latencyMs: number | null };
  redisState: RedisHealthState;
  rlFallbackEvents: number;
  rlBucketCount: number;
};

export async function recordPlatformHealthSnapshot(input: HealthRecordInput): Promise<void> {
  const { db, redisState, rlFallbackEvents, rlBucketCount } = input;
  const dbOk = isDatabaseUrlConfigured();

  // 1. In-process ring buffer — always
  if (db.latencyMs !== null) {
    recordMetricDataPoint("infra.db.latency_ms", db.latencyMs);
  }
  recordMetricDataPoint("infra.db.reachable", db.reachable === true ? 1 : 0);
  recordMetricDataPoint("infra.redis.reachable", redisState === "reachable" ? 1 : 0);
  recordMetricDataPoint("infra.redis.misconfigured", redisState === "misconfigured" ? 1 : 0);
  recordMetricDataPoint("infra.ratelimit.fallback_events", rlFallbackEvents);
  recordMetricDataPoint("infra.ratelimit.bucket_count", rlBucketCount);

  // 2. Error counts into ring buffer
  if (dbOk) {
    const oneHourMs = 60 * 60 * 1000;
    const errors = await countRecentErrors(oneHourMs);
    recordMetricDataPoint("infra.errors.critical_routes", errors.criticalRoutes);
    recordMetricDataPoint("infra.errors.fallback_delivery", errors.fallbackDelivery);
  }

  // 3. FeatureHealthSnapshot DB rows — rate-limited to 1 per 5 min per feature
  if (!dbOk) return;

  const dbScore = db.reachable === true ? Math.max(0, 1000 - (db.latencyMs ?? 0)) : 0;
  const dbStatus = db.reachable === true
    ? (db.latencyMs !== null && db.latencyMs > 2000 ? "degraded" : "healthy")
    : (db.reachable === null ? "critical" : "critical");

  await Promise.allSettled([
    writeSnapshot("infra.db.readiness", dbScore, dbStatus, {
      p95StartupMs: db.latencyMs ?? undefined,
    }),
    writeSnapshot(
      "infra.redis.primary",
      redisState === "reachable" ? 100 : redisState === "unavailable" ? 50 : 0,
      statusFromScore(redisState === "reachable" ? 100 : redisState === "unavailable" ? 50 : 0, 75),
    ),
    writeSnapshot(
      "infra.ratelimit.fallback",
      rlFallbackEvents,
      rlFallbackEvents === 0 ? "healthy" : rlFallbackEvents < 100 ? "degraded" : "critical",
      { errorRate: rlBucketCount > 0 ? rlBucketCount / 2000 : 0 },
    ),
  ]);
}
