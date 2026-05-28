/**
 * Database Connection Pool Monitor
 *
 * Tracks Prisma connection pool utilization and emits alerts when
 * usage crosses critical thresholds, before pool exhaustion occurs.
 *
 * Alert thresholds:
 *   50% — info: pool is under moderate load
 *   75% — warn: approaching high utilization
 *   90% — critical: pool saturation imminent
 *   95% — emergency: expected queue/timeout failures
 *
 * Pool metrics source (in priority order):
 *   1. Prisma $metrics.prometheus() — requires prisma.metrics.enabled in schema
 *   2. Environment-derived pool size + active connection inference
 *   3. Fallback: report pool size from env only (no active count)
 *
 * Integration:
 *   Call `sampleConnectionPool(prisma)` periodically (e.g. every 30s via setInterval).
 *   Call `checkPoolAlert(sample)` to get any active alerts from the sample.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PoolSample = {
  timestamp: string;
  /** Total pool capacity (from PRISMA_CONNECTION_LIMIT or inferred). */
  poolSize: number;
  /** Currently active (checked-out) connections. null = unknown. */
  active: number | null;
  /** Currently idle connections. null = unknown. */
  idle: number | null;
  /** Requests waiting for a connection. null = unknown. */
  queueDepth: number | null;
  /** 0–1 utilization ratio. null = unknown. */
  utilization: number | null;
  /** How the sample was collected. */
  source: "prisma-metrics" | "env-inferred" | "env-only";
};

export type PoolAlert = {
  severity: "info" | "warn" | "critical" | "emergency";
  threshold: number;
  message: string;
  utilization: number;
  active: number;
  poolSize: number;
};

// ─── Pool size resolution ─────────────────────────────────────────────────────

/**
 * Resolves the configured pool size from the environment.
 * Matches the logic in prisma/env-bootstrap.ts.
 */
export function resolveConfiguredPoolSize(): number {
  const fromEnv = process.env.PRISMA_CONNECTION_LIMIT?.trim();
  if (fromEnv) {
    const n = Number(fromEnv);
    if (Number.isInteger(n) && n > 0) return n;
  }

  // Prisma's default pool size = (cpuCount * 2) + 1, min 2
  try {
    const cpus = (globalThis as typeof globalThis & { os?: { cpus?: () => unknown[] } }).os?.cpus?.();
    const cpuCount = Array.isArray(cpus) ? cpus.length : 1;
    return Math.max(2, cpuCount * 2 + 1);
  } catch {
    return 5; // Safe conservative default
  }
}

// ─── Prisma metrics probe ─────────────────────────────────────────────────────

type PrismaWithMetrics = {
  $metrics?: {
    prometheus?: () => Promise<string>;
    json?: () => Promise<{
      counters: Array<{ key: string; value: number }>;
      gauges: Array<{ key: string; value: number }>;
      histograms: Array<{ key: string; value: unknown }>;
    }>;
  };
};

/**
 * Attempt to read pool metrics from Prisma's built-in metrics exporter.
 * Returns null if metrics are not enabled in the schema.
 */
async function readPrismaMetrics(prisma: PrismaWithMetrics): Promise<{
  active: number;
  idle: number;
  queueDepth: number;
} | null> {
  if (!prisma.$metrics?.json) return null;

  try {
    const m = await prisma.$metrics.json();
    const gauge = (key: string) => m.gauges.find((g) => g.key === key)?.value ?? null;
    const active = gauge("prisma_client_queries_active");
    const idle = gauge("prisma_pool_connections_idle");
    const waitCount = gauge("prisma_client_queries_wait");

    if (active === null) return null;
    return {
      active: active as number,
      idle: (idle ?? 0) as number,
      queueDepth: (waitCount ?? 0) as number,
    };
  } catch {
    return null;
  }
}

// ─── Active connection inference ──────────────────────────────────────────────

/**
 * In-process active connection counter. Incremented/decremented around DB queries.
 * Provides a rough approximation when Prisma metrics are not available.
 */
let _activeConnectionCount = 0;

export function incrementActiveConnections(): void {
  _activeConnectionCount = Math.max(0, _activeConnectionCount + 1);
}

export function decrementActiveConnections(): void {
  _activeConnectionCount = Math.max(0, _activeConnectionCount - 1);
}

export function getActiveConnectionEstimate(): number {
  return _activeConnectionCount;
}

// ─── Pool sampling ────────────────────────────────────────────────────────────

/**
 * Take a connection pool sample. Returns the pool's current state.
 */
export async function sampleConnectionPool(
  prisma?: PrismaWithMetrics,
): Promise<PoolSample> {
  const poolSize = resolveConfiguredPoolSize();
  const timestamp = new Date().toISOString();

  // Try Prisma metrics first (most accurate)
  if (prisma) {
    const metrics = await readPrismaMetrics(prisma).catch(() => null);
    if (metrics) {
      const utilization = poolSize > 0 ? metrics.active / poolSize : null;
      return {
        timestamp,
        poolSize,
        active: metrics.active,
        idle: metrics.idle,
        queueDepth: metrics.queueDepth,
        utilization,
        source: "prisma-metrics",
      };
    }
  }

  // Fall back to in-process counter
  const active = getActiveConnectionEstimate();
  if (active > 0) {
    return {
      timestamp,
      poolSize,
      active,
      idle: Math.max(0, poolSize - active),
      queueDepth: null,
      utilization: poolSize > 0 ? active / poolSize : null,
      source: "env-inferred",
    };
  }

  // Env-only: report config, no active count
  return {
    timestamp,
    poolSize,
    active: null,
    idle: null,
    queueDepth: null,
    utilization: null,
    source: "env-only",
  };
}

// ─── Alert logic ──────────────────────────────────────────────────────────────

export const POOL_ALERT_THRESHOLDS = {
  info:      0.50,
  warn:      0.75,
  critical:  0.90,
  emergency: 0.95,
} as const;

/**
 * Check if a pool sample warrants an alert.
 * Returns null if utilization is healthy or unknown.
 */
export function checkPoolAlert(sample: PoolSample): PoolAlert | null {
  if (sample.utilization === null || sample.active === null) return null;
  const u = sample.utilization;

  let severity: PoolAlert["severity"] | null = null;
  if (u >= POOL_ALERT_THRESHOLDS.emergency) severity = "emergency";
  else if (u >= POOL_ALERT_THRESHOLDS.critical) severity = "critical";
  else if (u >= POOL_ALERT_THRESHOLDS.warn) severity = "warn";
  else if (u >= POOL_ALERT_THRESHOLDS.info) severity = "info";

  if (!severity) return null;

  const pct = Math.round(u * 100);
  const threshold = POOL_ALERT_THRESHOLDS[severity];

  const messages: Record<PoolAlert["severity"], string> = {
    info:      `Connection pool at ${pct}% utilization (${sample.active}/${sample.poolSize})`,
    warn:      `Connection pool reaching high utilization: ${pct}% (${sample.active}/${sample.poolSize}) — monitor closely`,
    critical:  `Connection pool critically high: ${pct}% (${sample.active}/${sample.poolSize}) — queue delays expected`,
    emergency: `Connection pool near exhaustion: ${pct}% (${sample.active}/${sample.poolSize}) — timeouts likely`,
  };

  return {
    severity,
    threshold,
    message: messages[severity],
    utilization: u,
    active: sample.active,
    poolSize: sample.poolSize,
  };
}

// ─── Periodic monitoring ──────────────────────────────────────────────────────

let _monitorInterval: ReturnType<typeof setInterval> | null = null;
const _recentSamples: PoolSample[] = [];
const MAX_SAMPLES = 60; // Keep last 60 samples (30 minutes at 30s interval)

/**
 * Start periodic connection pool monitoring.
 * Emits structured logs at threshold crossings.
 *
 * @param prisma - Prisma client instance (optional — enables accurate metrics)
 * @param intervalMs - Sample interval (default: 30_000ms)
 */
export function startConnectionPoolMonitor(
  prisma?: PrismaWithMetrics,
  intervalMs = 30_000,
): void {
  if (_monitorInterval) return; // Already started

  _monitorInterval = setInterval(async () => {
    const sample = await sampleConnectionPool(prisma).catch(() => null);
    if (!sample) return;

    // Store sample
    _recentSamples.push(sample);
    if (_recentSamples.length > MAX_SAMPLES) _recentSamples.shift();

    // Check and emit alert
    const alert = checkPoolAlert(sample);
    if (alert && (alert.severity === "warn" || alert.severity === "critical" || alert.severity === "emergency")) {
      safeServerLog("perf", "pool_utilization_alert", {
        severity: alert.severity,
        utilization: Math.round(alert.utilization * 100),
        active: alert.active,
        poolSize: alert.poolSize,
        queueDepth: sample.queueDepth,
        source: sample.source,
      });
    }
  }, intervalMs);

  // Don't prevent process exit
  if (_monitorInterval.unref) _monitorInterval.unref();
}

export function stopConnectionPoolMonitor(): void {
  if (_monitorInterval) {
    clearInterval(_monitorInterval);
    _monitorInterval = null;
  }
}

/**
 * Returns recent pool samples for the admin dashboard.
 */
export function getRecentPoolSamples(): readonly PoolSample[] {
  return [..._recentSamples];
}

/**
 * Returns the most recent pool sample, or null if no samples yet.
 */
export function getLatestPoolSample(): PoolSample | null {
  return _recentSamples[_recentSamples.length - 1] ?? null;
}

/**
 * Returns pool utilization trend: "stable" | "rising" | "falling" | "unknown".
 */
export function getPoolUtilizationTrend(): "stable" | "rising" | "falling" | "unknown" {
  if (_recentSamples.length < 3) return "unknown";
  const recent = _recentSamples.slice(-3).map((s) => s.utilization ?? 0);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const delta = last - first;
  if (Math.abs(delta) < 0.05) return "stable";
  return delta > 0 ? "rising" : "falling";
}
