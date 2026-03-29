import type { Request, Response, NextFunction } from "express";
import {
  isMemoryProtectionActive,
  isMemoryCritical,
  isMemoryWarning,
  checkMemoryNow,
  logSpike,
  logProtectionAction,
  incrementConnections,
  decrementConnections,
  shouldPauseBackgroundJobs,
} from "./memory-monitor";
import { BoundedMap } from "./bounded-map";

const MAX_RESPONSE_SIZE_BYTES = 1 * 1024 * 1024;
const MAX_ITEMS_UNDER_PRESSURE = 10;
const MAX_CONCURRENT_AI_OPS = 2;
const AI_REQUEST_TIMEOUT_MS = 45_000;
const MAX_REQUEST_BODY_SIZE = 512 * 1024;
let activeAiOps = 0;

const BULK_AI_PATTERNS = [
  "/api/ai/generate",
  "/api/ai/content",
  "/api/ai/tutor",
  "/api/admin/ai",
  "/api/admin/seo",
  "/api/seo/generate",
  "/api/admin/mass-expansion",
  "/api/admin/bulk",
];

const LARGE_LIST_PATTERNS = [
  "/api/exam-questions",
  "/api/question-bank",
  "/api/flashcard-decks",
  "/api/flashcards",
  "/api/lessons",
  "/api/mock-exams",
  "/api/content",
  "/api/nursing/question-topics",
  "/api/allied-questions",
];

const HEAVY_OPERATION_PATTERNS = [
  "/api/exam-sessions",
  "/api/cat-session",
  "/api/mock-exam",
  "/api/ai/generate",
  "/api/ai/content",
  "/api/ai/tutor",
  "/api/admin/ai",
  "/api/admin/bulk",
  "/api/admin/mass-expansion",
];

const MAX_CONCURRENT_HEAVY_OPS = parseInt(process.env.MAX_CONCURRENT_HEAVY_OPS || "0") || 8;
let currentHeavyOps = 0;

const heavyRouteCounters = new BoundedMap<string, { count: number; lastSeen: number }>(200, 30 * 60 * 1000);

const HEAVY_ROUTE_PATTERNS = [
  ...BULK_AI_PATTERNS,
  ...LARGE_LIST_PATTERNS,
  "/api/exams/generate",
  "/api/cat-exam/start",
  "/api/mlt-exam",
];

const MAX_CONCURRENT_HEAVY = 3;
let currentHeavyRequests = 0;

export function getHeavyConcurrency(): { current: number; max: number } {
  return { current: currentHeavyRequests, max: MAX_CONCURRENT_HEAVY };
}

export function connectionTrackingMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    incrementConnections();
    let decremented = false;
    const onDone = () => {
      if (!decremented) {
        decremented = true;
        decrementConnections();
      }
    };
    res.on("finish", onDone);
    res.on("close", onDone);
    next();
  };
}

const CORE_USER_PATHS = [
  "/api/platform/status",
  "/api/admin/resilience",
  "/api/healthz",
  "/api/auth",
  "/api/user",
  "/api/stripe/webhook",
  "/api/login",
  "/api/register",
  "/api/exam-sessions",
  "/api/exams",
  "/api/dashboard",
  "/api/kill-switches",
  "/api/entitlement",
  "/api/boot-beacon",
];

const EXEMPT_PATHS = CORE_USER_PATHS;

const HEAVY_NON_ESSENTIAL_PATTERNS = [
  "/api/ai/",
  "/api/admin/ai",
  "/api/admin/seo",
  "/api/seo/generate",
  "/api/admin/mass-expansion",
  "/api/admin/bulk",
  "/api/admin/publish-gate",
  "/api/admin/analytics",
  "/api/blog/generate",
];

const NON_ESSENTIAL_PATHS = HEAVY_NON_ESSENTIAL_PATTERNS;

const MAX_REQUEST_PAYLOAD_BYTES = 2 * 1024 * 1024;


export function loadSheddingMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    const isCoreUserPath = CORE_USER_PATHS.some(p => req.path.startsWith(p));
    if (isCoreUserPath) return next();

    let emergencyMode = false;
    try {
      const resilience = require("./platform-resilience");
      emergencyMode = typeof resilience.isEmergencyMode === "function" && resilience.isEmergencyMode();
    } catch {}

    if (isMemoryWarning()) {
      const isBulkAI = BULK_AI_PATTERNS.some(p => req.path.startsWith(p));
      if (isBulkAI && req.method === "POST") {
        logProtectionAction("warning_shed_ai", `Blocked AI POST ${req.path} (memory warning)`);
        res.setHeader("Retry-After", "30");
        return res.status(503).json({
          error: "AI operations temporarily paused due to elevated memory usage.",
          retryAfter: 30,
          memoryPressure: true,
        });
      }

      const isLargeList = LARGE_LIST_PATTERNS.some(p => req.path.startsWith(p));
      if (isLargeList && req.method === "GET") {
        const requestedLimit = parseInt(req.query.limit as string) || 50;
        req.query.limit = String(Math.min(requestedLimit, 25));
      }
    }

    if (isMemoryCritical()) {
      const isNonEssential = NON_ESSENTIAL_PATHS.some(p => req.path.startsWith(p));
      if (isNonEssential) {
        res.setHeader("Retry-After", "60");
        return res.status(503).json({
          error: "System under high memory pressure. This operation is temporarily disabled.",
          retryAfter: 60,
          memoryPressure: true,
        });
      }

      const isBulkAI = BULK_AI_PATTERNS.some(p => req.path.startsWith(p));
      if (isBulkAI) {
        res.setHeader("Retry-After", "60");
        return res.status(503).json({
          error: "System under high memory pressure. Bulk operations temporarily disabled.",
          retryAfter: 60,
          memoryPressure: true,
        });
      }

      const isLargeList = LARGE_LIST_PATTERNS.some(p => req.path.startsWith(p));
      if (isLargeList && req.method === "GET") {
        req.query.limit = String(Math.min(parseInt(req.query.limit as string) || 50, 5));
      }
    }

    if (emergencyMode) {
      const isNonEssential = HEAVY_NON_ESSENTIAL_PATTERNS.some(p => req.path.startsWith(p));
      if (isNonEssential) {
        res.setHeader("Retry-After", "120");
        return res.status(503).json({
          error: "Platform is in emergency mode. Non-essential operations are temporarily disabled.",
          retryAfter: 120,
          emergencyMode: true,
        });
      }

      const isLargeList = LARGE_LIST_PATTERNS.some(p => req.path.startsWith(p));
      if (isLargeList && req.method === "GET") {
        req.query.limit = String(Math.min(parseInt(req.query.limit as string) || 50, 5));
      }
    }

    // Memory pressure block — block all heavy routes when memory protection is active
    const isHeavy = HEAVY_ROUTE_PATTERNS.some(p => req.path.startsWith(p));

    if (isMemoryProtectionActive()) {
      if (isHeavy) {
        const retryAfter = isMemoryCritical() ? 60 : 30;
        logProtectionAction("load_shed_block", `Blocked heavy route ${req.method} ${req.path} (memory pressure)`);
        res.setHeader("Retry-After", String(retryAfter));
        return res.status(503).json({
          error: "System under memory pressure. This operation is temporarily disabled. Please try again shortly.",
          retryAfter,
          memoryPressure: true,
        });
      }
    }

    if (isHeavy) {
      if (currentHeavyRequests >= MAX_CONCURRENT_HEAVY) {
        logProtectionAction("concurrency_limit", `Rejected ${req.method} ${req.path} (${currentHeavyRequests}/${MAX_CONCURRENT_HEAVY} concurrent)`);
        res.setHeader("Retry-After", "10");
        return res.status(503).json({
          error: "Too many heavy operations in progress. Please try again shortly.",
          retryAfter: 10,
          concurrencyLimit: true,
        });
      }

      currentHeavyRequests++;
      let decremented = false;
      const onDone = () => {
        if (!decremented) {
          decremented = true;
          currentHeavyRequests = Math.max(0, currentHeavyRequests - 1);
        }
      };
      res.on("finish", onDone);
      res.on("close", onDone);
    }

    next();
  };
}

export function requestPayloadLimiterMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();
    if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") return next();

    const contentLength = parseInt(req.headers["content-length"] || "0");
    if (contentLength > MAX_REQUEST_PAYLOAD_BYTES) {
      return res.status(413).json({
        error: "Request payload too large",
        maxSizeBytes: MAX_REQUEST_PAYLOAD_BYTES,
        actualSizeBytes: contentLength,
      });
    }

    next();
  };
}

export function responseSizeLimiterMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    const originalJson = res.json.bind(res);

    res.json = function (body: any): Response {
      try {
        const sizeEstimate = estimateJsonSize(body);

        if (sizeEstimate > MAX_RESPONSE_SIZE_BYTES) {
          const status = checkMemoryNow();
          logSpike(status, req.path, sizeEstimate);

          console.warn(
            `[ResponseSizeLimiter] Oversized response blocked: ${req.path} (~${Math.round(sizeEstimate / 1024)}KB)`
          );

          res.status(413);
          return originalJson({
            error: "Response too large. Please use pagination or filters to reduce the result set.",
            maxSizeBytes: MAX_RESPONSE_SIZE_BYTES,
            estimatedSizeBytes: sizeEstimate,
            path: req.path,
          });
        }

        return originalJson(body);
      } catch {
        return originalJson(body);
      }
    };

    next();
  };
}

function estimateJsonSize(obj: any): number {
  if (obj === null || obj === undefined) return 4;
  if (typeof obj === "string") return obj.length + 2;
  if (typeof obj === "number" || typeof obj === "boolean") return 8;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 2;
    const sampleSize = Math.min(obj.length, 5);
    let sampleBytes = 0;
    for (let i = 0; i < sampleSize; i++) {
      sampleBytes += estimateJsonSize(obj[i]);
    }
    const avgItemSize = sampleBytes / sampleSize;
    return Math.ceil(avgItemSize * obj.length * 1.05) + obj.length + 2;
  }
  if (typeof obj === "object") {
    let size = 2;
    const keys = Object.keys(obj);
    for (const key of keys) {
      size += key.length + 3 + estimateJsonSize(obj[key]) + 1;
    }
    return size;
  }
  return 16;
}

export function memoryAwareRequestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    if (isMemoryProtectionActive()) {
      const contentLength = parseInt(req.headers["content-length"] || "0");
      if (contentLength > 0) {
        const status = checkMemoryNow();
        logSpike(status, req.path, contentLength);
      }
    }

    next();
  };
}

export function aiConcurrencyLimiterMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const isBulkAI = BULK_AI_PATTERNS.some(p => req.path.startsWith(p));
    if (!isBulkAI || req.method !== "POST") return next();

    if (isMemoryProtectionActive()) {
      res.setHeader("Retry-After", "30");
      return res.status(503).json({
        error: "AI operations temporarily disabled due to memory pressure.",
        retryAfter: 30,
        memoryPressure: true,
      });
    }

    if (activeAiOps >= MAX_CONCURRENT_AI_OPS) {
      return res.status(503).json({
        error: `Too many concurrent AI operations (${activeAiOps}/${MAX_CONCURRENT_AI_OPS}). Please try again shortly.`,
        retryAfter: 10,
      });
    }

    const contentLength = parseInt(req.headers["content-length"] || "0");
    if (contentLength > MAX_REQUEST_BODY_SIZE) {
      return res.status(413).json({
        error: `Request body too large (${Math.round(contentLength / 1024)}KB). Maximum: ${Math.round(MAX_REQUEST_BODY_SIZE / 1024)}KB.`,
      });
    }

    activeAiOps++;
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: "AI operation timed out." });
      }
    }, AI_REQUEST_TIMEOUT_MS);

    let decremented = false;
    const onComplete = () => {
      if (!decremented) {
        decremented = true;
        clearTimeout(timer);
        activeAiOps = Math.max(0, activeAiOps - 1);
      }
    };
    res.on("finish", onComplete);
    res.on("close", onComplete);

    next();
  };
}

const INSTRUMENTED_ROUTES = [
  "/api/exams",
  "/api/exam-questions",
  "/api/mock-exams",
  "/api/cat-exams",
  "/api/v1/cat-exams",
  "/api/ai/",
  "/api/content",
  "/api/lessons",
  "/api/decks",
  "/api/flashcard",
  "/api/new-grad",
  "/api/newgrad",
  "/api/question-bank",
];

export function routeInstrumentationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    const isInstrumented = INSTRUMENTED_ROUTES.some(p => req.path.startsWith(p));
    if (!isInstrumented) return next();

    const startTime = Date.now();
    const mem = process.memoryUsage();

    const onFinish = () => {
      const latencyMs = Date.now() - startTime;
      const memAfter = process.memoryUsage();
      const contentLength = res.getHeader("content-length");
      const payloadSize = contentLength ? parseInt(String(contentLength)) : 0;

      if (latencyMs > 1000 || payloadSize > 100_000) {
        console.log(
          `[RouteInstrumentation] ${req.method} ${req.path} | ${res.statusCode} | ${latencyMs}ms | payload=${Math.round(payloadSize / 1024)}KB | rss=${Math.round(memAfter.rss / 1024 / 1024)}MB | heapUsed=${Math.round(memAfter.heapUsed / 1024 / 1024)}MB | heapDelta=${Math.round((memAfter.heapUsed - mem.heapUsed) / 1024)}KB`
        );
      }
    };

    res.on("finish", onFinish);
    next();
  };
}

export function concurrencyLimiterMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) return next();

    const isHeavy = HEAVY_OPERATION_PATTERNS.some(p => req.path.startsWith(p));
    if (!isHeavy) return next();

    const routePrefix = req.path.split("/").slice(0, 4).join("/");
    const existing = heavyRouteCounters.get(routePrefix);
    heavyRouteCounters.set(routePrefix, { count: (existing?.count || 0) + 1, lastSeen: Date.now() });

    if (currentHeavyOps >= MAX_CONCURRENT_HEAVY_OPS) {
      const retryAfter = isMemoryProtectionActive() ? 30 : 10;
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(503).json({
        error: "Too many concurrent requests. Please try again shortly.",
        retryAfter,
        memoryPressure: isMemoryProtectionActive(),
      });
    }

    currentHeavyOps++;
    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        currentHeavyOps = Math.max(0, currentHeavyOps - 1);
      }
    };
    res.on("finish", release);
    res.on("close", release);

    next();
  };
}

export function getHeavyRouteCounters(): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, val] of heavyRouteCounters) {
    result[key] = val.count;
  }
  return result;
}

export function getCurrentHeavyOps(): number {
  return currentHeavyOps;
}
