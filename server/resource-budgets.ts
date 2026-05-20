import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

interface ResourceBudget {
  maxPayloadSizeBytes: number;
  maxMemoryGrowthBytes: number;
  maxRouteLatencyMs: number;
  maxConcurrentHeavyJobs: number;
  maxExamBatchSize: number;
  maxCachedObjectCount: number;
  maxCachedObjectSizeBytes: number;
  maxSyntheticMonitorFrequencyMs: number;
}

const DEFAULT_BUDGETS: ResourceBudget = {
  maxPayloadSizeBytes: 5 * 1024 * 1024,
  maxMemoryGrowthBytes: 50 * 1024 * 1024,
  maxRouteLatencyMs: 10000,
  maxConcurrentHeavyJobs: 3,
  maxExamBatchSize: 200,
  maxCachedObjectCount: 10000,
  maxCachedObjectSizeBytes: 100 * 1024 * 1024,
  maxSyntheticMonitorFrequencyMs: 60000,
};

let budgets: ResourceBudget = { ...DEFAULT_BUDGETS };

const ENDPOINT_PAYLOAD_LIMITS: Record<string, number> = {
  "/api/exams": 2 * 1024 * 1024,
  "/api/mock-exams": 2 * 1024 * 1024,
  "/api/content": 3 * 1024 * 1024,
  "/api/admin/content": 5 * 1024 * 1024,
  "/api/admin/bg-jobs": 1 * 1024 * 1024,
  "/api/flashcards": 2 * 1024 * 1024,
  "/api/lessons": 3 * 1024 * 1024,
};

const ROUTE_LATENCY_LIMITS: Record<string, number> = {
  "/api/exams": 5000,
  "/api/mock-exams": 5000,
  "/api/auth": 3000,
  "/api/flashcards": 3000,
  "/api/lessons": 5000,
  "/api/stripe": 8000,
  "/api/content": 5000,
};

interface BudgetViolation {
  id: string;
  type: "payload_size" | "memory_growth" | "route_latency" | "concurrent_jobs" | "exam_batch_size" | "cache_limit" | "architecture";
  severity: "warning" | "critical";
  endpoint: string;
  message: string;
  value: number;
  limit: number;
  timestamp: number;
}

const violations: BudgetViolation[] = [];
const MAX_VIOLATIONS = 500;
let baselineMemory = process.memoryUsage().rss;

interface MemorySnapshot {
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  timestamp: number;
}

const memoryHistory: MemorySnapshot[] = [];
const MAX_MEMORY_HISTORY = 360;

interface RouteLatencyRecord {
  route: string;
  latencyMs: number;
  statusCode: number;
  timestamp: number;
}

const routeLatencyHistory: RouteLatencyRecord[] = [];
const MAX_LATENCY_HISTORY = 2000;

interface RouteErrorRecord {
  route: string;
  statusCode: number;
  timestamp: number;
}

const routeErrorHistory: RouteErrorRecord[] = [];
const MAX_ERROR_HISTORY = 1000;

const HEAVY_OPERATIONS = new Set([
  "ai_content_generation",
  "bulk_exam_creation",
  "bulk_content_render",
  "scheduled_audit",
  "content_repair",
  "nightly_integrity_audit",
  "full_content_scan",
  "seo_generation",
  "bulk_flashcard_generation",
]);

const WEB_ALLOWED_OPERATIONS = new Set([
  "single_question_validate",
  "single_content_publish",
  "health_check",
  "auth_check",
  "session_save",
  "cache_lookup",
  "entitlement_check",
]);

let activeHeavyJobs = 0;

export function getResourceBudgets(): ResourceBudget {
  return { ...budgets };
}

export function setResourceBudgets(updates: Partial<ResourceBudget>): ResourceBudget {
  for (const [key, value] of Object.entries(updates)) {
    if (key in budgets && typeof value === "number" && value > 0) {
      (budgets as any)[key] = value;
    }
  }
  return { ...budgets };
}

function addViolation(violation: Omit<BudgetViolation, "id" | "timestamp">): void {
  const entry: BudgetViolation = {
    ...violation,
    id: `viol-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  };
  violations.unshift(entry);
  if (violations.length > MAX_VIOLATIONS) violations.length = MAX_VIOLATIONS;

  if (violation.severity === "critical") {
    console.error(`[ResourceBudget] CRITICAL: ${violation.message}`);
  } else {
    console.warn(`[ResourceBudget] WARNING: ${violation.message}`);
  }
}

export function getViolations(limit = 50): BudgetViolation[] {
  return violations.slice(0, limit);
}

export function getMemoryHistory(): MemorySnapshot[] {
  return [...memoryHistory];
}

export function getRouteLatencyHistory(route?: string, limit = 100): RouteLatencyRecord[] {
  const filtered = route ? routeLatencyHistory.filter(r => r.route.startsWith(route)) : routeLatencyHistory;
  return filtered.slice(0, limit);
}

export function getRouteErrorHistory(limit = 100): RouteErrorRecord[] {
  return routeErrorHistory.slice(0, limit);
}

export function getLatencyPercentiles(route?: string): { p50: number; p75: number; p90: number; p95: number; p99: number; count: number } {
  const cutoff = Date.now() - 15 * 60 * 1000;
  let records = routeLatencyHistory.filter(r => r.timestamp > cutoff);
  if (route) records = records.filter(r => r.route.startsWith(route));
  if (records.length === 0) return { p50: 0, p75: 0, p90: 0, p95: 0, p99: 0, count: 0 };

  const sorted = records.map(r => r.latencyMs).sort((a, b) => a - b);
  const percentile = (p: number) => sorted[Math.min(Math.ceil(sorted.length * p / 100) - 1, sorted.length - 1)];

  return { p50: percentile(50), p75: percentile(75), p90: percentile(90), p95: percentile(95), p99: percentile(99), count: sorted.length };
}

export function getErrorRateByRoute(): Array<{ route: string; errors: number; total: number; rate: number }> {
  const cutoff = Date.now() - 15 * 60 * 1000;
  const recentLatency = routeLatencyHistory.filter(r => r.timestamp > cutoff);
  const routeMap = new Map<string, { total: number; errors: number }>();

  for (const r of recentLatency) {
    const base = r.route.replace(/\/[0-9a-f-]{36}/g, "/:id").replace(/\/\d+/g, "/:id");
    const entry = routeMap.get(base) || { total: 0, errors: 0 };
    entry.total++;
    if (r.statusCode >= 500) entry.errors++;
    routeMap.set(base, entry);
  }

  return Array.from(routeMap.entries())
    .map(([route, { total, errors }]) => ({ route, errors, total, rate: total > 0 ? errors / total : 0 }))
    .sort((a, b) => b.rate - a.rate);
}

export function recordMemorySnapshot(): MemorySnapshot {
  const mem = process.memoryUsage();
  const snapshot: MemorySnapshot = {
    rss: mem.rss,
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    external: mem.external,
    timestamp: Date.now(),
  };
  memoryHistory.push(snapshot);
  if (memoryHistory.length > MAX_MEMORY_HISTORY) memoryHistory.shift();

  const growth = mem.rss - baselineMemory;
  if (growth > budgets.maxMemoryGrowthBytes) {
    addViolation({
      type: "memory_growth",
      severity: growth > budgets.maxMemoryGrowthBytes * 2 ? "critical" : "warning",
      endpoint: "system",
      message: `Memory growth ${(growth / 1024 / 1024).toFixed(1)}MB exceeds budget ${(budgets.maxMemoryGrowthBytes / 1024 / 1024).toFixed(1)}MB (RSS: ${(mem.rss / 1024 / 1024).toFixed(1)}MB)`,
      value: growth,
      limit: budgets.maxMemoryGrowthBytes,
    });
  }

  return snapshot;
}

export function checkArchitectureBoundary(operationName: string, context: "web" | "job_queue"): { allowed: boolean; reason?: string } {
  if (context === "web" && HEAVY_OPERATIONS.has(operationName)) {
    addViolation({
      type: "architecture",
      severity: "critical",
      endpoint: operationName,
      message: `Heavy operation "${operationName}" attempted in web process - must use job queue`,
      value: 1,
      limit: 0,
    });
    return { allowed: false, reason: `Operation "${operationName}" must run through the job queue, not in the web process` };
  }
  return { allowed: true };
}

export function isHeavyOperation(operationName: string): boolean {
  return HEAVY_OPERATIONS.has(operationName);
}

export function isWebAllowedOperation(operationName: string): boolean {
  return WEB_ALLOWED_OPERATIONS.has(operationName);
}

export function enforceArchitectureBoundary(operationName: string): void {
  const check = checkArchitectureBoundary(operationName, "web");
  if (!check.allowed) {
    throw new Error(check.reason || `Operation "${operationName}" is not allowed in the web process`);
  }
}

export function checkExamBatchSize(batchSize: number): { allowed: boolean; reason?: string } {
  if (batchSize > budgets.maxExamBatchSize) {
    addViolation({
      type: "exam_batch_size",
      severity: batchSize > budgets.maxExamBatchSize * 2 ? "critical" : "warning",
      endpoint: "exam_batch",
      message: `Exam batch size ${batchSize} exceeds budget ${budgets.maxExamBatchSize}`,
      value: batchSize,
      limit: budgets.maxExamBatchSize,
    });
    return { allowed: false, reason: `Exam batch size ${batchSize} exceeds maximum ${budgets.maxExamBatchSize}` };
  }
  return { allowed: true };
}

export function trackHeavyJobStart(): boolean {
  if (activeHeavyJobs >= budgets.maxConcurrentHeavyJobs) {
    addViolation({
      type: "concurrent_jobs",
      severity: "warning",
      endpoint: "job_queue",
      message: `Concurrent heavy jobs (${activeHeavyJobs}) at limit (${budgets.maxConcurrentHeavyJobs})`,
      value: activeHeavyJobs,
      limit: budgets.maxConcurrentHeavyJobs,
    });
    return false;
  }
  activeHeavyJobs++;
  return true;
}

export function trackHeavyJobEnd(): void {
  activeHeavyJobs = Math.max(0, activeHeavyJobs - 1);
}

export function getActiveHeavyJobCount(): number {
  return activeHeavyJobs;
}

export function getCurrentMemoryUsage(): { rss: number; heapUsed: number; heapTotal: number; external: number; growthFromBaseline: number } {
  const mem = process.memoryUsage();
  return {
    rss: mem.rss,
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    external: mem.external,
    growthFromBaseline: mem.rss - baselineMemory,
  };
}

export function resetBaselineMemory(): void {
  baselineMemory = process.memoryUsage().rss;
}

export function resourceBudgetMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.path.startsWith("/api/")) {
      next();
      return;
    }

    const start = Date.now();

    const contentLength = parseInt(req.headers["content-length"] || "0", 10);
    const routeBase = req.path.split("/").slice(0, 4).join("/");
    const payloadLimit = ENDPOINT_PAYLOAD_LIMITS[routeBase] || budgets.maxPayloadSizeBytes;

    if (contentLength > payloadLimit) {
      const isCritical = contentLength > payloadLimit * 2;
      addViolation({
        type: "payload_size",
        severity: isCritical ? "critical" : "warning",
        endpoint: req.path,
        message: `Request payload ${(contentLength / 1024).toFixed(1)}KB exceeds limit ${(payloadLimit / 1024).toFixed(1)}KB for ${req.path}`,
        value: contentLength,
        limit: payloadLimit,
      });
      if (isCritical) {
        res.status(413).json({ error: `Payload too large: ${(contentLength / 1024).toFixed(1)}KB exceeds ${(payloadLimit / 1024).toFixed(1)}KB limit`, code: "PAYLOAD_TOO_LARGE" });
        return;
      }
    }

    const originalEnd = res.end;
    (res as any).end = function (...args: any[]) {
      const latencyMs = Date.now() - start;
      const latencyLimit = ROUTE_LATENCY_LIMITS[routeBase] || budgets.maxRouteLatencyMs;

      routeLatencyHistory.unshift({
        route: req.path,
        latencyMs,
        statusCode: res.statusCode,
        timestamp: Date.now(),
      });
      if (routeLatencyHistory.length > MAX_LATENCY_HISTORY) routeLatencyHistory.length = MAX_LATENCY_HISTORY;

      if (res.statusCode >= 400) {
        routeErrorHistory.unshift({ route: req.path, statusCode: res.statusCode, timestamp: Date.now() });
        if (routeErrorHistory.length > MAX_ERROR_HISTORY) routeErrorHistory.length = MAX_ERROR_HISTORY;
      }

      if (latencyMs > latencyLimit) {
        addViolation({
          type: "route_latency",
          severity: latencyMs > latencyLimit * 2 ? "critical" : "warning",
          endpoint: req.path,
          message: `Route ${req.path} took ${latencyMs}ms (limit: ${latencyLimit}ms)`,
          value: latencyMs,
          limit: latencyLimit,
        });
      }

      const responsePayload = res.getHeader("content-length");
      if (responsePayload) {
        const responseSize = typeof responsePayload === "string" ? parseInt(responsePayload, 10) : responsePayload as number;
        if (responseSize > payloadLimit) {
          addViolation({
            type: "payload_size",
            severity: responseSize > payloadLimit * 2 ? "critical" : "warning",
            endpoint: req.path,
            message: `Response payload ${(responseSize / 1024).toFixed(1)}KB exceeds limit ${(payloadLimit / 1024).toFixed(1)}KB for ${req.path}`,
            value: responseSize,
            limit: payloadLimit,
          });
        }
      }

      return (originalEnd as (...a: Parameters<Response["end"]>) => ReturnType<Response["end"]>).apply(
        res,
        args as Parameters<Response["end"]>
      );
    };

    next();
  };
}

let memoryMonitorInterval: ReturnType<typeof setInterval> | null = null;

export function startMemoryMonitor(intervalMs = 30000): void {
  if (memoryMonitorInterval) return;
  baselineMemory = process.memoryUsage().rss;
  recordMemorySnapshot();
  memoryMonitorInterval = setInterval(() => {
    recordMemorySnapshot();
  }, intervalMs);
  console.log(`[ResourceBudgets] Memory monitor started (interval: ${intervalMs / 1000}s)`);
}

export function stopMemoryMonitor(): void {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval);
    memoryMonitorInterval = null;
  }
}

export function getBudgetCheckReport(): {
  memory: { current: ReturnType<typeof getCurrentMemoryUsage>; overBudget: boolean };
  violations: { recent: BudgetViolation[]; criticalCount: number; warningCount: number };
  heavyJobs: { active: number; limit: number; atLimit: boolean };
  canDeploy: boolean;
} {
  const memory = getCurrentMemoryUsage();
  const recentViolations = violations.filter(v => Date.now() - v.timestamp < 3600000);
  const criticalCount = recentViolations.filter(v => v.severity === "critical").length;
  const warningCount = recentViolations.filter(v => v.severity === "warning").length;

  return {
    memory: {
      current: memory,
      overBudget: memory.growthFromBaseline > budgets.maxMemoryGrowthBytes,
    },
    violations: {
      recent: recentViolations.slice(0, 20),
      criticalCount,
      warningCount,
    },
    heavyJobs: {
      active: activeHeavyJobs,
      limit: budgets.maxConcurrentHeavyJobs,
      atLimit: activeHeavyJobs >= budgets.maxConcurrentHeavyJobs,
    },
    canDeploy: criticalCount === 0,
  };
}

export function registerResourceBudgetRoutes(app: Express): void {
  app.get("/api/admin/resource-budgets", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      res.json({
        budgets,
        report: getBudgetCheckReport(),
        memoryHistory: memoryHistory.slice(-60),
        latencyPercentiles: getLatencyPercentiles(),
        errorRateByRoute: getErrorRateByRoute(),
        heavyOperations: Array.from(HEAVY_OPERATIONS),
        webAllowedOperations: Array.from(WEB_ALLOWED_OPERATIONS),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/resource-budgets", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const updated = setResourceBudgets(req.body);
      res.json({ budgets: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/resource-budgets/violations", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    res.json({ violations: getViolations(limit) });
  });

  app.get("/api/admin/resource-budgets/memory", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json({
      current: getCurrentMemoryUsage(),
      history: memoryHistory,
      baseline: baselineMemory,
      budget: budgets.maxMemoryGrowthBytes,
    });
  });

  app.get("/api/admin/resource-budgets/latency", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const route = req.query.route as string | undefined;
    res.json({
      percentiles: getLatencyPercentiles(route),
      errorRateByRoute: getErrorRateByRoute(),
      recentLatency: getRouteLatencyHistory(route, 50),
    });
  });

  app.post("/api/admin/resource-budgets/reset-baseline", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    resetBaselineMemory();
    res.json({ success: true, newBaseline: baselineMemory });
  });
}
