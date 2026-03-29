import type { Request, Response, NextFunction } from "express";

interface MemoryTrendEntry {
  timestamp: number;
  rssMB: number;
  heapUsedMB: number;
  heapTotalMB: number;
  externalMB: number;
  arrayBuffersMB: number;
}

interface RouteMemoryDelta {
  route: string;
  method: string;
  heapDeltaMB: number;
  rssDeltaMB: number;
  responsePayloadBytes: number;
  durationMs: number;
  timestamp: number;
}

const TREND_RING_SIZE = 120;
const trendRing: MemoryTrendEntry[] = [];
let trendIndex = 0;
let trendCount = 0;
let trendInterval: ReturnType<typeof setInterval> | null = null;

const ROUTE_DELTA_MAX = 200;
const routeDeltas: RouteMemoryDelta[] = [];

let rssBaseline: number | null = null;
let baselineCheckTimer: ReturnType<typeof setInterval> | null = null;
let lastBurstEnd = 0;
let activeRequests = 0;
const BURST_QUIET_PERIOD_MS = 10_000;

function recordTrend() {
  const mem = process.memoryUsage();
  const entry: MemoryTrendEntry = {
    timestamp: Date.now(),
    rssMB: Math.round(mem.rss / 1024 / 1024),
    heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
    heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
    externalMB: Math.round(mem.external / 1024 / 1024),
    arrayBuffersMB: Math.round((mem.arrayBuffers || 0) / 1024 / 1024),
  };

  if (trendCount < TREND_RING_SIZE) {
    trendRing.push(entry);
    trendCount++;
  } else {
    trendRing[trendIndex] = entry;
  }
  trendIndex = (trendIndex + 1) % TREND_RING_SIZE;
}

export function startMemoryTrendTracking(intervalMs = 30_000): void {
  if (trendInterval) return;
  recordTrend();
  trendInterval = setInterval(recordTrend, intervalMs);

  if (rssBaseline === null) {
    rssBaseline = Math.round(process.memoryUsage().rss / 1024 / 1024);
  }

  baselineCheckTimer = setInterval(() => {
    if (activeRequests === 0 && Date.now() - lastBurstEnd > BURST_QUIET_PERIOD_MS) {
      const currentRSS = Math.round(process.memoryUsage().rss / 1024 / 1024);
      if (rssBaseline !== null && currentRSS > rssBaseline * 1.5) {
        console.warn(`[MemoryObservability] RSS not returning to baseline: current=${currentRSS}MB baseline=${rssBaseline}MB`);
      }
    }
  }, 60_000);
}

export function stopMemoryTrendTracking(): void {
  if (trendInterval) {
    clearInterval(trendInterval);
    trendInterval = null;
  }
  if (baselineCheckTimer) {
    clearInterval(baselineCheckTimer);
    baselineCheckTimer = null;
  }
}

export function getMemoryTrend(): MemoryTrendEntry[] {
  if (trendCount < TREND_RING_SIZE) return trendRing.slice();
  const result: MemoryTrendEntry[] = [];
  for (let i = 0; i < TREND_RING_SIZE; i++) {
    const idx = (trendIndex + i) % TREND_RING_SIZE;
    result.push(trendRing[idx]);
  }
  return result;
}

export function getRouteMemoryDeltas(limit = 50): RouteMemoryDelta[] {
  return routeDeltas.slice(0, limit);
}

export function getTopMemoryRoutes(limit = 20): Array<{ route: string; avgHeapDeltaMB: number; maxHeapDeltaMB: number; count: number; avgPayloadBytes: number }> {
  const byRoute = new Map<string, { totalDelta: number; maxDelta: number; count: number; totalPayload: number }>();
  for (const d of routeDeltas) {
    const key = `${d.method} ${d.route}`;
    const existing = byRoute.get(key) || { totalDelta: 0, maxDelta: 0, count: 0, totalPayload: 0 };
    existing.totalDelta += d.heapDeltaMB;
    existing.maxDelta = Math.max(existing.maxDelta, d.heapDeltaMB);
    existing.count++;
    existing.totalPayload += d.responsePayloadBytes;
    byRoute.set(key, existing);
  }

  return Array.from(byRoute.entries())
    .map(([route, stats]) => ({
      route,
      avgHeapDeltaMB: Math.round((stats.totalDelta / stats.count) * 100) / 100,
      maxHeapDeltaMB: Math.round(stats.maxDelta * 100) / 100,
      count: stats.count,
      avgPayloadBytes: Math.round(stats.totalPayload / stats.count),
    }))
    .sort((a, b) => b.maxHeapDeltaMB - a.maxHeapDeltaMB)
    .slice(0, limit);
}

export function getRSSBaseline(): { baselineMB: number | null; currentMB: number; returnedToBaseline: boolean } {
  const currentMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
  return {
    baselineMB: rssBaseline,
    currentMB,
    returnedToBaseline: rssBaseline !== null ? currentMB <= rssBaseline * 1.1 : true,
  };
}

export function routeMemoryDeltaMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    activeRequests++;
    const heapBefore = process.memoryUsage().heapUsed;
    const rssBefore = process.memoryUsage().rss;
    const start = Date.now();
    let responsePayloadBytes = 0;

    const originalJson = res.json;
    res.json = function (body: any): Response {
      try {
        const serialized = JSON.stringify(body);
        responsePayloadBytes = Buffer.byteLength(serialized, "utf8");
      } catch {}
      return originalJson.call(this, body);
    };

    let decremented = false;
    const onDone = () => {
      if (decremented) return;
      decremented = true;

      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        lastBurstEnd = Date.now();
      }

      const heapAfter = process.memoryUsage().heapUsed;
      const rssAfter = process.memoryUsage().rss;
      const heapDeltaMB = (heapAfter - heapBefore) / (1024 * 1024);
      const rssDeltaMB = (rssAfter - rssBefore) / (1024 * 1024);
      const durationMs = Date.now() - start;

      if (Math.abs(heapDeltaMB) > 1 || responsePayloadBytes > 100_000) {
        const routePrefix = req.path.replace(/\/[0-9a-f-]{20,}/g, "/:id");
        const delta: RouteMemoryDelta = {
          route: routePrefix,
          method: req.method,
          heapDeltaMB: Math.round(heapDeltaMB * 100) / 100,
          rssDeltaMB: Math.round(rssDeltaMB * 100) / 100,
          responsePayloadBytes,
          durationMs,
          timestamp: Date.now(),
        };

        routeDeltas.unshift(delta);
        if (routeDeltas.length > ROUTE_DELTA_MAX) {
          routeDeltas.length = ROUTE_DELTA_MAX;
        }
      }
    };

    res.on("finish", onDone);
    res.on("close", onDone);
    next();
  };
}

export function getMemoryObservabilityDashboard() {
  const mem = process.memoryUsage();
  return {
    current: {
      rssMB: Math.round(mem.rss / 1024 / 1024),
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      externalMB: Math.round(mem.external / 1024 / 1024),
      arrayBuffersMB: Math.round((mem.arrayBuffers || 0) / 1024 / 1024),
    },
    baseline: getRSSBaseline(),
    trend: getMemoryTrend(),
    topMemoryRoutes: getTopMemoryRoutes(),
    recentDeltas: getRouteMemoryDeltas(30),
    productionSizing: getProductionSizingRecommendations(),
  };
}

export function getProductionSizingRecommendations() {
  const trend = getMemoryTrend();
  const peakRSS = trend.length > 0 ? Math.max(...trend.map(t => t.rssMB)) : 0;
  const avgRSS = trend.length > 0 ? Math.round(trend.reduce((s, t) => s + t.rssMB, 0) / trend.length) : 0;
  const peakHeap = trend.length > 0 ? Math.max(...trend.map(t => t.heapUsedMB)) : 0;

  return {
    minimumRAM_MB: Math.max(1024, Math.ceil(peakRSS * 1.3 / 256) * 256),
    preferredRAM_MB: Math.max(2048, Math.ceil(peakRSS * 1.8 / 256) * 256),
    observedPeakRSS_MB: peakRSS,
    observedAvgRSS_MB: avgRSS,
    observedPeakHeap_MB: peakHeap,
    workerSeparationMandatory: true,
    workerSeparationReason: "Background jobs (AI generation, content pipelines, PDF export, bulk operations) must run in a separate process to prevent RSS spikes from affecting web request serving",
    autoscalingRecommended: true,
    autoscalingNotes: "Recommended: 2-4 web instances behind a load balancer, 1-2 worker instances. Scale web instances based on request rate, worker instances based on job queue depth.",
    recommendations: [
      "Set --max-old-space-size=1536 for web process, 2048 for worker",
      "Deploy worker as a separate process/container from web",
      "Configure health check at /healthz with 10s interval",
      "Set MEMORY_WARNING_MB=900, MEMORY_PROTECTION_MB=1024, MEMORY_CRITICAL_MB=1200",
      "Monitor RSS via /api/admin/memory-observability endpoint",
      "Enable --expose-gc for manual GC in critical situations",
    ],
  };
}
