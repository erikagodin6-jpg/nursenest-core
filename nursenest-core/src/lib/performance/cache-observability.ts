/**
 * Cache Observability Layer
 *
 * Tracks hit/miss rates for all caching layers:
 *   - Redis (Upstash) — learner session data, rate limits, counters
 *   - Study snapshots — pre-built content manifests (question banks, flashcard pools)
 *   - Next.js data cache — RSC fetch() cache entries
 *   - Memory cache — in-process TTL cache for hot data
 *
 * Usage:
 *   // Wrap any cache get with hit/miss tracking:
 *   const result = await trackCacheGet("redis", "session", () => redis.get(key));
 *
 *   // Or use the Redis-specific wrapper:
 *   const cached = await redisGetWithTracking("my-key", () => redis.get("my-key"));
 *
 * The module accumulates in-process counters (per server boot, not per request).
 * Periodic summaries are emitted via structured log for monitoring dashboards.
 *
 * Alert thresholds:
 *   - Redis hit rate < 70%: warn
 *   - Snapshot fallback rate > 20%: warn (indicates stale or missing snapshots)
 *   - Memory cache hit rate < 50%: info
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CacheLayer = "redis" | "snapshot" | "manifest" | "memory" | "next-data" | "cdn";
export type CacheNamespace = string; // e.g. "session", "flashcard-pool", "hub-bootstrap"

export type CacheHitRecord = {
  layer: CacheLayer;
  namespace: CacheNamespace;
  hit: boolean;
  latencyMs?: number;
};

export type CacheLayerStats = {
  layer: CacheLayer;
  hits: number;
  misses: number;
  total: number;
  hitRate: number;
  avgLatencyMs: number | null;
};

// ─── In-process counter store ─────────────────────────────────────────────────

type CounterKey = `${CacheLayer}:${CacheNamespace}`;

type CounterBucket = {
  hits: number;
  misses: number;
  totalLatencyMs: number;
  latencySamples: number;
};

const counters = new Map<CounterKey, CounterBucket>();

function getOrCreate(key: CounterKey): CounterBucket {
  let bucket = counters.get(key);
  if (!bucket) {
    bucket = { hits: 0, misses: 0, totalLatencyMs: 0, latencySamples: 0 };
    counters.set(key, bucket);
  }
  return bucket;
}

// ─── Public recording API ─────────────────────────────────────────────────────

/**
 * Record a cache hit or miss. Called after each cache read.
 */
export function recordCacheAccess(record: CacheHitRecord): void {
  const key: CounterKey = `${record.layer}:${record.namespace}`;
  const bucket = getOrCreate(key);
  if (record.hit) {
    bucket.hits++;
  } else {
    bucket.misses++;
  }
  if (record.latencyMs != null) {
    bucket.totalLatencyMs += record.latencyMs;
    bucket.latencySamples++;
  }
}

/**
 * Wrap any async cache get with automatic hit/miss tracking.
 *
 * Returns the result and records hit (value !== null) or miss (null).
 */
export async function trackCacheGet<T>(
  layer: CacheLayer,
  namespace: CacheNamespace,
  getter: () => Promise<T | null>,
): Promise<T | null> {
  const t0 = performance.now();
  let result: T | null = null;
  try {
    result = await getter();
  } finally {
    recordCacheAccess({
      layer,
      namespace,
      hit: result !== null && result !== undefined,
      latencyMs: performance.now() - t0,
    });
  }
  return result;
}

/**
 * Synchronous variant for in-process memory caches.
 */
export function trackCacheGetSync<T>(
  layer: CacheLayer,
  namespace: CacheNamespace,
  getter: () => T | null | undefined,
): T | null | undefined {
  const t0 = performance.now();
  let result: T | null | undefined;
  try {
    result = getter();
  } finally {
    recordCacheAccess({
      layer,
      namespace,
      hit: result !== null && result !== undefined,
      latencyMs: performance.now() - t0,
    });
  }
  return result;
}

// ─── Snapshot / manifest cache tracking ──────────────────────────────────────

/** Call this when a study snapshot or manifest is loaded from disk (hit). */
export function recordSnapshotHit(snapshotKey: string): void {
  recordCacheAccess({ layer: "snapshot", namespace: snapshotKey, hit: true });
}

/** Call this when a snapshot is missing and the system falls back to a DB query. */
export function recordSnapshotMiss(snapshotKey: string): void {
  recordCacheAccess({ layer: "snapshot", namespace: snapshotKey, hit: false });
  safeServerLog("perf", "snapshot_cache_miss", { snapshotKey });
}

/** Call this when a manifest is loaded from disk (hit). */
export function recordManifestHit(manifestKey: string): void {
  recordCacheAccess({ layer: "manifest", namespace: manifestKey, hit: true });
}

/** Call this when a manifest is missing. */
export function recordManifestMiss(manifestKey: string): void {
  recordCacheAccess({ layer: "manifest", namespace: manifestKey, hit: false });
  safeServerLog("perf", "manifest_cache_miss", { manifestKey });
}

// ─── Statistics ───────────────────────────────────────────────────────────────

/**
 * Returns aggregated hit-rate statistics per cache layer.
 */
export function getCacheLayerStats(): CacheLayerStats[] {
  const byLayer = new Map<
    CacheLayer,
    { hits: number; misses: number; totalLatencyMs: number; samples: number }
  >();

  for (const [key, bucket] of counters) {
    const layer = key.split(":")[0] as CacheLayer;
    const agg = byLayer.get(layer) ?? {
      hits: 0,
      misses: 0,
      totalLatencyMs: 0,
      samples: 0,
    };
    agg.hits += bucket.hits;
    agg.misses += bucket.misses;
    agg.totalLatencyMs += bucket.totalLatencyMs;
    agg.samples += bucket.latencySamples;
    byLayer.set(layer, agg);
  }

  return Array.from(byLayer.entries()).map(([layer, agg]) => {
    const total = agg.hits + agg.misses;
    return {
      layer,
      hits: agg.hits,
      misses: agg.misses,
      total,
      hitRate: total > 0 ? agg.hits / total : 0,
      avgLatencyMs: agg.samples > 0 ? agg.totalLatencyMs / agg.samples : null,
    };
  });
}

/**
 * Returns per-namespace stats for a specific cache layer.
 */
export function getNamespaceStats(layer: CacheLayer): Array<{
  namespace: string;
  hits: number;
  misses: number;
  hitRate: number;
}> {
  const result = [];
  for (const [key, bucket] of counters) {
    if (!key.startsWith(`${layer}:`)) continue;
    const namespace = key.slice(layer.length + 1);
    const total = bucket.hits + bucket.misses;
    result.push({
      namespace,
      hits: bucket.hits,
      misses: bucket.misses,
      hitRate: total > 0 ? bucket.hits / total : 0,
    });
  }
  return result.sort((a, b) => a.namespace.localeCompare(b.namespace));
}

// ─── Alert checks ─────────────────────────────────────────────────────────────

export type CacheAlert = {
  layer: CacheLayer;
  namespace?: string;
  severity: "warn" | "critical";
  message: string;
  hitRate: number;
  threshold: number;
};

const ALERT_THRESHOLDS: Record<CacheLayer, { warnRate: number; criticalRate: number; minSamples: number }> = {
  redis:     { warnRate: 0.70, criticalRate: 0.50, minSamples: 10 },
  snapshot:  { warnRate: 0.80, criticalRate: 0.50, minSamples: 5  },
  manifest:  { warnRate: 0.80, criticalRate: 0.50, minSamples: 5  },
  memory:    { warnRate: 0.50, criticalRate: 0.20, minSamples: 20 },
  "next-data": { warnRate: 0.60, criticalRate: 0.30, minSamples: 10 },
  cdn:       { warnRate: 0.85, criticalRate: 0.60, minSamples: 10 },
};

/**
 * Returns active cache alerts for any layer below its hit-rate threshold.
 */
export function checkCacheAlerts(): CacheAlert[] {
  const alerts: CacheAlert[] = [];
  const stats = getCacheLayerStats();

  for (const stat of stats) {
    const thresholds = ALERT_THRESHOLDS[stat.layer];
    if (!thresholds) continue;
    if (stat.total < thresholds.minSamples) continue;

    if (stat.hitRate < thresholds.criticalRate) {
      alerts.push({
        layer: stat.layer,
        severity: "critical",
        message: `${stat.layer} cache hit rate critically low: ${Math.round(stat.hitRate * 100)}%`,
        hitRate: stat.hitRate,
        threshold: thresholds.criticalRate,
      });
    } else if (stat.hitRate < thresholds.warnRate) {
      alerts.push({
        layer: stat.layer,
        severity: "warn",
        message: `${stat.layer} cache hit rate degraded: ${Math.round(stat.hitRate * 100)}%`,
        hitRate: stat.hitRate,
        threshold: thresholds.warnRate,
      });
    }
  }

  return alerts;
}

/**
 * Emits a structured log summary of all cache layer stats.
 * Call periodically (e.g. on server request completion or cron).
 */
export function emitCacheObservabilitySummary(): void {
  const stats = getCacheLayerStats();
  const alerts = checkCacheAlerts();

  if (stats.length === 0) return;

  safeServerLog("perf", "cache_observability_summary", {
    layers: stats.map((s) => ({
      layer: s.layer,
      hitRate: Math.round(s.hitRate * 100),
      total: s.total,
      avgLatencyMs: s.avgLatencyMs ? Math.round(s.avgLatencyMs * 10) / 10 : null,
    })),
    alertCount: alerts.length,
    alerts: alerts.map((a) => ({ layer: a.layer, severity: a.severity })),
  });
}

/**
 * Resets all counters. Useful for per-request isolation in tests.
 */
export function resetCacheObservabilityCounters(): void {
  counters.clear();
}
