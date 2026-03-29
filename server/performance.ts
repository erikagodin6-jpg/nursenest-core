import type { Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { recordFailure, isEmergencyMode } from "./platform-resilience";

/**
 * ------------------------------
 * TYPES
 * ------------------------------
 */

interface RequestMetric {
  method: string;
  path: string;
  routePrefix: string;
  statusCode: number;
  durationMs: number;
  timestamp: number;
  userId?: string;
  tier?: number;
}

/**
 * ------------------------------
 * RING BUFFER (METRICS)
 * ------------------------------
 */

const RING_BUFFER_SIZE = 2000;
const metricsBuffer: RequestMetric[] = new Array(RING_BUFFER_SIZE);
let metricsHead = 0;
let metricsCount = 0;

function addMetric(metric: RequestMetric) {
  metricsBuffer[metricsHead] = metric;
  metricsHead = (metricsHead + 1) % RING_BUFFER_SIZE;
  if (metricsCount < RING_BUFFER_SIZE) metricsCount++;
}

function getMetrics(): RequestMetric[] {
  const result: RequestMetric[] = [];
  for (let i = 0; i < metricsCount; i++) {
    const idx = (metricsHead - metricsCount + i + RING_BUFFER_SIZE) % RING_BUFFER_SIZE;
    const m = metricsBuffer[idx];
    if (m) result.push(m);
  }
  return result;
}

/**
 * ------------------------------
 * ROUTE TIERS
 * ------------------------------
 */

const ROUTE_TIERS: Record<number, string[]> = {
  1: [
    "/api/login", "/api/auth", "/api/register",
    "/api/entitlement", "/api/user/",
    "/api/exam-sessions", "/api/cat-", "/api/mock-exam",
    "/api/flashcard-review", "/api/sm2-review",
  ],
  2: [
    "/api/lessons", "/api/dashboard", "/api/progress",
    "/api/flashcard", "/api/notes",
  ],
};

function getRouteTier(path: string): number {
  for (const p of ROUTE_TIERS[1]) if (path.startsWith(p)) return 1;
  for (const p of ROUTE_TIERS[2]) if (path.startsWith(p)) return 2;

  if (path.startsWith("/api/admin")) return 3;
  if (path.startsWith("/api/seo")) return 3;

  return 2;
}

function getRoutePrefix(path: string): string {
  const match = path.match(/^\/api\/([^/]+(?:\/[^/]+)?)/);
  return match ? match[1] : path.split("/").slice(0, 3).join("/");
}

/**
 * ------------------------------
 * LOAD MONITORING
 * ------------------------------
 */

let currentLoad: "normal" | "elevated" | "high" = "normal";

function updateLoad() {
  const recent = getMetrics().filter(m => Date.now() - m.timestamp < 10000);
  const rps = recent.length / 10;

  if (rps > 100) currentLoad = "high";
  else if (rps > 50) currentLoad = "elevated";
  else currentLoad = "normal";
}

export function startLoadMonitoring() {
  setInterval(updateLoad, 5000);
}

/**
 * ------------------------------
 * PERFORMANCE MIDDLEWARE
 * ------------------------------
 */

export function performanceMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    const start = Date.now();
    const tier = getRouteTier(req.path);

    const emergency = isEmergencyMode();

    if ((currentLoad === "high" || emergency) && tier === 3) {
      return res.status(503).json({ error: "High load", retryAfter: 30 });
    }

    if ((currentLoad === "high" || emergency) && tier === 2 && req.method !== "GET") {
      return res.status(503).json({ error: "Write disabled", retryAfter: 15 });
    }

    const originalEnd = res.end;

    res.end = function (this: Response, ...args: any[]) {
      const duration = Date.now() - start;

      addMetric({
        method: req.method,
        path: req.path,
        routePrefix: getRoutePrefix(req.path),
        statusCode: res.statusCode,
        durationMs: duration,
        timestamp: Date.now(),
        userId: (req as any).authUser?.id,
        tier,
      });

      if (duration > 3000) console.error(`[SLOW] ${req.method} ${req.path} ${duration}ms`);
      else if (duration > 1000) console.warn(`[WARN] ${req.method} ${req.path} ${duration}ms`);

      return originalEnd.apply(this, args as any);
    } as any;

    next();
  };
}

/**
 * ------------------------------
 * DB TIMING
 * ------------------------------
 */

const slowQueries: any[] = [];

/** Third argument: milliseconds, or `{ timeoutMs, label }` for statement timeout (label used in slow-query metadata when needed). */
export type TimedQueryTimeout = number | { timeoutMs?: number; label?: string };

function resolveTimedQueryTimeout(timeoutOrOpts?: TimedQueryTimeout): number {
  if (timeoutOrOpts == null) return 5000;
  if (typeof timeoutOrOpts === "number") return timeoutOrOpts;
  return timeoutOrOpts.timeoutMs ?? 5000;
}

export async function timedQuery(query: string, params?: any[], timeoutOrOpts?: TimedQueryTimeout) {
  const timeout = resolveTimedQueryTimeout(timeoutOrOpts);
  const start = Date.now();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(`SET LOCAL statement_timeout = '${timeout}'`);

    const result = await client.query(query, params);

    await client.query("COMMIT");

    const duration = Date.now() - start;

    if (duration > 500) {
      slowQueries.unshift({ query: query.slice(0, 200), duration });
      if (slowQueries.length > 50) slowQueries.pop();

      if (duration > 3000) recordFailure("database");
    }

    return result;

  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});
    recordFailure("database");
    throw err;
  } finally {
    client.release();
  }
}

export function getSlowQueryLog() {
  return slowQueries.slice(0, 50);
}

/**
 * ------------------------------
 * MEMORY CACHE
 * ------------------------------
 */

const cache = new Map<string, any>();
const MAX_ENTRIES = 200;

export function cacheGet<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return;
  if (Date.now() > entry.exp) {
    cache.delete(key);
    return;
  }
  entry.last = Date.now();
  return entry.val;
}

export function cacheSet<T>(key: string, val: T, ttl: number) {
  if (cache.size >= MAX_ENTRIES) {
    const oldest = Array.from(cache.entries()).sort((a, b) => a[1].last - b[1].last)[0];
    if (oldest) cache.delete(oldest[0]);
  }

  cache.set(key, {
    val,
    exp: Date.now() + ttl * 1000,
    last: Date.now(),
  });
}

export function clearCache() {
  cache.clear();
}

/** Delete cache entries whose keys start with `prefix` (e.g. "pricing:"). */
export function cacheInvalidate(prefix: string) {
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number, label?: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error(`${label || "operation"} timed out after ${ms}ms`));
    }, ms);
    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

/** Lightweight timing hook; returns a no-op end function (metrics can be added later). */
export function instrumentCorePath(_label: string): () => void {
  return () => {};
}

export function getCacheStats() {
  return { size: cache.size, maxEntries: MAX_ENTRIES };
}

/**
 * ------------------------------
 * METRICS SUMMARY
 * ------------------------------
 */

function percentile(arr: number[], p: number) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor((p / 100) * sorted.length)];
}

export function getMetricsSummary() {
  const metrics = getMetrics();
  const durations = metrics.map(m => m.durationMs);

  return {
    total: metrics.length,
    errors: metrics.filter(m => m.statusCode >= 400).length,
    p50: percentile(durations, 50),
    p95: percentile(durations, 95),
    p99: percentile(durations, 99),
    load: currentLoad,
    cacheSize: cache.size,
    slowQueries: slowQueries.length,
  };
}

/**
 * ------------------------------
 * ADMIN ROUTES
 * ------------------------------
 */

export function registerPerformanceRoutes(app: any) {

  startLoadMonitoring();

  app.get("/api/admin/performance", async (req: Request, res: Response) => {
    res.json(getMetricsSummary());
  });

  app.get("/api/admin/performance/slow", async (req: Request, res: Response) => {
    res.json(getSlowQueryLog());
  });

}