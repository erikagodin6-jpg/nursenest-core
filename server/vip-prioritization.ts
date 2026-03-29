import type { Express, Request, Response, NextFunction } from "express";
import { requireAdmin } from "./admin-auth";

interface VipConfig {
  enabled: boolean;
  loadThreshold: number;
  maxConcurrentRequests: number;
  vipPaths: Set<string>;
  backgroundPaths: Set<string>;
}

interface VipStatus {
  enabled: boolean;
  currentLoad: number;
  loadThreshold: number;
  activeRequests: number;
  maxConcurrentRequests: number;
  vipRequestsServed: number;
  backgroundRequestsShed: number;
  loadSheddingActive: boolean;
  lastLoadCheck: number;
}

const config: VipConfig = {
  enabled: true,
  loadThreshold: 0.85,
  maxConcurrentRequests: 200,
  vipPaths: new Set([
    "/api/auth",
    "/api/login",
    "/api/user/entitlements",
    "/api/entitlements",
    "/api/stripe",
    "/api/mock-exams",
    "/api/exam-questions",
    "/api/cat/",
    "/api/adaptive-exam",
    "/api/flashcards",
    "/api/flashcard-decks",
    "/api/lessons",
    "/api/downloads",
    "/api/question-bank",
  ]),
  backgroundPaths: new Set([
    "/api/admin/seo",
    "/api/admin/content-generator",
    "/api/admin/ai-",
    "/api/seo/generate",
    "/api/analytics/",
    "/api/admin/weekly-reports",
    "/api/admin/content-integrity",
    "/api/sitemap",
  ]),
};

let activeRequests = 0;
let vipRequestsServed = 0;
let backgroundRequestsShed = 0;
let lastLoadCheck = Date.now();
let currentLoadEstimate = 0;

function isVipPath(path: string): boolean {
  for (const vipPath of config.vipPaths) {
    if (path.startsWith(vipPath)) return true;
  }
  return false;
}

function isBackgroundPath(path: string): boolean {
  for (const bgPath of config.backgroundPaths) {
    if (path.startsWith(bgPath)) return true;
  }
  return false;
}

function isPaidUser(req: Request): boolean {
  const user = (req as any).authUser;
  if (!user) return false;
  const paidTiers = new Set(["rpn", "rn", "np", "admin", "newgrad", "new_grad_toolkit", "certification_prep", "full_access", "allied", "imaging"]);
  return paidTiers.has(user.tier || "free");
}

function estimateLoad(): number {
  const mem = process.memoryUsage();
  const RSS_HIGH_MB = 1200;
  const rssMB = mem.rss / (1024 * 1024);
  const memPressure = Math.min(rssMB / RSS_HIGH_MB, 1.0);
  const requestPressure = activeRequests / config.maxConcurrentRequests;
  currentLoadEstimate = Math.max(memPressure, requestPressure);
  lastLoadCheck = Date.now();
  return currentLoadEstimate;
}

function isUnderHighLoad(): boolean {
  return estimateLoad() >= config.loadThreshold;
}

export function vipPrioritizationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!config.enabled) return next();

    activeRequests++;

    const decrementOnce = (() => {
      let done = false;
      return () => { if (!done) { done = true; activeRequests = Math.max(0, activeRequests - 1); } };
    })();
    res.on("finish", decrementOnce);
    res.on("close", decrementOnce);

    if (!req.path.startsWith("/api/")) return next();

    if (req.path.startsWith("/api/admin/") || req.path.startsWith("/api/health") || req.path.startsWith("/api/auth") || req.path.startsWith("/api/login") || req.path.startsWith("/api/user/") || req.path.startsWith("/api/entitlement/") || req.path.startsWith("/api/platform/")) {
      return next();
    }

    const highLoad = isUnderHighLoad();
    if (!highLoad) return next();

    const paid = isPaidUser(req);
    const vipPath = isVipPath(req.path);
    const bgPath = isBackgroundPath(req.path);

    if (paid && vipPath) {
      vipRequestsServed++;
      res.setHeader("X-VIP-Priority", "high");
      return next();
    }

    if (paid) {
      vipRequestsServed++;
      res.setHeader("X-VIP-Priority", "medium");
      return next();
    }

    if (vipPath) {
      res.setHeader("X-VIP-Priority", "normal");
      return next();
    }

    if (bgPath) {
      backgroundRequestsShed++;
      return res.status(503).json({
        error: "Service temporarily unavailable due to high load",
        code: "VIP_LOAD_SHEDDING",
        retryAfter: 30,
        message: "Background operations are paused during high load. Please try again shortly.",
      });
    }

    if (activeRequests > config.maxConcurrentRequests * 0.95) {
      backgroundRequestsShed++;
      return res.status(503).json({
        error: "Server is at capacity",
        code: "VIP_CAPACITY_LIMIT",
        retryAfter: 15,
      });
    }

    return next();
  };
}

export function getVipStatus(): VipStatus {
  const load = estimateLoad();
  return {
    enabled: config.enabled,
    currentLoad: Math.round(load * 100) / 100,
    loadThreshold: config.loadThreshold,
    activeRequests,
    maxConcurrentRequests: config.maxConcurrentRequests,
    vipRequestsServed,
    backgroundRequestsShed,
    loadSheddingActive: load >= config.loadThreshold,
    lastLoadCheck,
  };
}

export function registerVipPrioritizationRoutes(app: Express): void {
  app.get("/api/admin/vip-status", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json({
      ...getVipStatus(),
      config: {
        vipPaths: Array.from(config.vipPaths),
        backgroundPaths: Array.from(config.backgroundPaths),
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/admin/vip-config", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { enabled, loadThreshold, maxConcurrentRequests } = req.body;
    if (typeof enabled === "boolean") config.enabled = enabled;
    if (typeof loadThreshold === "number" && loadThreshold > 0 && loadThreshold <= 1) config.loadThreshold = loadThreshold;
    if (typeof maxConcurrentRequests === "number" && maxConcurrentRequests > 0) config.maxConcurrentRequests = maxConcurrentRequests;

    console.log(`[VIP] Config updated by ${admin.username || admin.id}: enabled=${config.enabled}, threshold=${config.loadThreshold}, max=${config.maxConcurrentRequests}`);

    res.json({ success: true, config: { enabled: config.enabled, loadThreshold: config.loadThreshold, maxConcurrentRequests: config.maxConcurrentRequests } });
  });
}
