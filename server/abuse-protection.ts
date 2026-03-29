import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { pool } from "./storage";

const KNOWN_BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /headless/i, /phantom/i,
  /selenium/i, /puppeteer/i, /playwright/i, /wget/i, /curl\//i,
  /python-requests/i, /python-urllib/i, /go-http-client/i, /java\//i,
  /libwww/i, /httpclient/i, /okhttp/i, /axios/i, /node-fetch/i,
  /scrapy/i, /mechanize/i, /aiohttp/i,
];

const ALLOWED_BOTS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
  /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
  /whatsapp/i, /telegrambot/i, /slackbot/i,
];

interface AbuseTracker {
  warnings: number;
  tempBlocks: number;
  blockedUntil: number;
  lastWarningAt: number;
  rateLimitHits: number;
  firstSeenAt: number;
}

const abuseTrackers = new Map<string, AbuseTracker>();
const manualBlocks = new Map<string, { until: number; reason: string }>();

const WARN_THRESHOLD = 3;
const TEMP_BLOCK_DURATION_MS = 5 * 60 * 1000;
const EXTENDED_BLOCK_DURATION_MS = 30 * 60 * 1000;
const EXTENDED_BLOCK_THRESHOLD = 3;
const TRACKER_CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

const MAX_ABUSE_TRACKERS = 500;

function cleanupAbuseTrackers(): void {
  const now = Date.now();
  const staleThreshold = 60 * 60 * 1000;
  for (const [key, tracker] of abuseTrackers.entries()) {
    if (tracker.blockedUntil < now && now - tracker.firstSeenAt > staleThreshold && tracker.warnings === 0) {
      abuseTrackers.delete(key);
    }
  }
  for (const [key, block] of manualBlocks.entries()) {
    if (block.until > 0 && block.until < now) {
      manualBlocks.delete(key);
    }
  }
  if (abuseTrackers.size > MAX_ABUSE_TRACKERS) {
    const entries = [...abuseTrackers.entries()].sort((a, b) => a[1].firstSeenAt - b[1].firstSeenAt);
    const toDelete = abuseTrackers.size - MAX_ABUSE_TRACKERS;
    for (let i = 0; i < toDelete; i++) {
      abuseTrackers.delete(entries[i][0]);
    }
  }
}

setInterval(cleanupAbuseTrackers, TRACKER_CLEANUP_INTERVAL_MS);

export function getClientIp(req: Request): string {
  return String(req.headers["x-forwarded-for"] || req.ip || "unknown").split(",")[0].trim();
}

function isLocalDevRequest(req: Request): boolean {
  if ((process.env.NODE_ENV || "development") !== "development") return false;
  const ip = getClientIp(req);
  return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}

async function logAbuseEvent(
  userId: string | null,
  ip: string,
  endpoint: string,
  eventType: string,
  requestCount: number = 1,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO security_audit_logs (id, user_id, ip_address, endpoint, event_type, request_count, metadata, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
      [userId, ip, endpoint, eventType, requestCount, JSON.stringify(metadata)]
    );
  } catch (e: any) {
    console.error("[AbuseProtection] Audit log error:", e.message);
  }
}

function getTrackerKey(req: Request): string {
  const userId = (req as any).authUser?.id;
  const ip = getClientIp(req);
  return userId || ip;
}

function getOrCreateTracker(key: string): AbuseTracker {
  let tracker = abuseTrackers.get(key);
  if (!tracker) {
    tracker = {
      warnings: 0,
      tempBlocks: 0,
      blockedUntil: 0,
      lastWarningAt: 0,
      rateLimitHits: 0,
      firstSeenAt: Date.now(),
    };
    abuseTrackers.set(key, tracker);
  }
  return tracker;
}

function isSuspiciousUserAgent(ua: string | undefined): { suspicious: boolean; reason?: string } {
  if (!ua || ua.trim() === "") {
    return { suspicious: true, reason: "missing_user_agent" };
  }

  if (ua.length < 10) {
    return { suspicious: true, reason: "short_user_agent" };
  }

  const isAllowedBot = ALLOWED_BOTS.some(p => p.test(ua));
  if (isAllowedBot) {
    return { suspicious: false };
  }

  const isBotPattern = KNOWN_BOT_PATTERNS.some(p => p.test(ua));
  if (isBotPattern) {
    return { suspicious: true, reason: "known_bot_pattern" };
  }

  return { suspicious: false };
}

function isManuallyBlocked(key: string): { blocked: boolean; reason?: string } {
  const block = manualBlocks.get(key);
  if (!block) return { blocked: false };
  if (block.until > 0 && block.until < Date.now()) {
    manualBlocks.delete(key);
    return { blocked: false };
  }
  return { blocked: true, reason: block.reason };
}

export function botDetectionMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (isLocalDevRequest(req)) {
    next();
    return;
  }

  const ua = req.headers["user-agent"];
  const uaCheck = isSuspiciousUserAgent(ua);

  if (uaCheck.suspicious) {
    const ip = getClientIp(req);
    const userId = (req as any).authUser?.id || null;
    const key = getTrackerKey(req);
    const tracker = getOrCreateTracker(key);

    tracker.warnings++;

    logAbuseEvent(userId, ip, req.path, "bot_heuristic_flag", 1, {
      reason: uaCheck.reason,
      userAgent: ua || "",
    });

    if (tracker.warnings >= WARN_THRESHOLD * 2) {
      tracker.blockedUntil = Date.now() + TEMP_BLOCK_DURATION_MS;
      tracker.tempBlocks++;
      logAbuseEvent(userId, ip, req.path, "bot_auto_blocked", 1, {
        reason: uaCheck.reason,
        warnings: tracker.warnings,
      });
      res.status(403).json({ error: "Access denied. Suspicious automated activity detected." });
      return;
    }

    res.setHeader("X-Abuse-Warning", "Suspicious activity detected");
  }

  next();
}

export function abuseEscalationMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (isLocalDevRequest(req)) {
    next();
    return;
  }

  const key = getTrackerKey(req);
  const ip = getClientIp(req);
  const userId = (req as any).authUser?.id || null;

  const manualCheck = isManuallyBlocked(key);
  if (!manualCheck.blocked) {
    const ipBlock = isManuallyBlocked(ip);
    if (ipBlock.blocked) {
      res.status(403).json({ error: "Your access has been temporarily restricted by an administrator." });
      return;
    }
  }
  if (manualCheck.blocked) {
    res.status(403).json({ error: "Your access has been temporarily restricted by an administrator." });
    return;
  }

  const tracker = abuseTrackers.get(key);
  if (tracker && tracker.blockedUntil > Date.now()) {
    const retryAfter = Math.ceil((tracker.blockedUntil - Date.now()) / 1000);
    logAbuseEvent(userId, ip, req.path, "abuse_block_enforced", 1, { retryAfter });
    res.status(429).json({
      error: "Too many requests. You have been temporarily blocked.",
      retryAfter,
    });
    return;
  }

  next();
}

function handleRateLimitExceeded(req: Request, _res: Response): void {
  const key = getTrackerKey(req);
  const ip = getClientIp(req);
  const userId = (req as any).authUser?.id || null;
  const tracker = getOrCreateTracker(key);
  const now = Date.now();

  tracker.rateLimitHits++;
  tracker.warnings++;
  tracker.lastWarningAt = now;

  if (tracker.warnings >= WARN_THRESHOLD && tracker.tempBlocks < EXTENDED_BLOCK_THRESHOLD) {
    tracker.blockedUntil = now + TEMP_BLOCK_DURATION_MS;
    tracker.tempBlocks++;
    tracker.warnings = 0;

    logAbuseEvent(userId, ip, req.path, "abuse_temp_block", tracker.rateLimitHits, {
      blockDurationMs: TEMP_BLOCK_DURATION_MS,
      tempBlockCount: tracker.tempBlocks,
    });
  } else if (tracker.tempBlocks >= EXTENDED_BLOCK_THRESHOLD) {
    tracker.blockedUntil = now + EXTENDED_BLOCK_DURATION_MS;
    tracker.tempBlocks++;
    tracker.warnings = 0;

    logAbuseEvent(userId, ip, req.path, "abuse_extended_block", tracker.rateLimitHits, {
      blockDurationMs: EXTENDED_BLOCK_DURATION_MS,
      tempBlockCount: tracker.tempBlocks,
    });
  } else {
    logAbuseEvent(userId, ip, req.path, "abuse_warning", tracker.rateLimitHits, {
      warningCount: tracker.warnings,
    });
  }
}

export type EndpointCategory =
  | "auth"
  | "exam_start"
  | "exam_interaction"
  | "ai_generation"
  | "ai_burst"
  | "premium_download"
  | "search"
  | "content_browse"
  | "lead_capture"
  | "feedback"
  | "general";

interface RateLimitPreset {
  windowMs: number;
  max: number;
  message: string;
}

const RATE_LIMIT_PRESETS: Record<EndpointCategory, RateLimitPreset> = {
  auth: { windowMs: 60 * 1000, max: 5, message: "Too many authentication attempts. Please try again later." },
  exam_start: { windowMs: 60 * 1000, max: 10, message: "Too many exam start requests. Please slow down." },
  exam_interaction: { windowMs: 60 * 1000, max: 120, message: "Too many requests. Please slow down." },
  ai_generation: { windowMs: 60 * 1000, max: 10, message: "Too many AI generation requests. Please wait." },
  ai_burst: { windowMs: 10 * 1000, max: 3, message: "Too many rapid AI requests. Please wait a few seconds." },
  premium_download: { windowMs: 60 * 1000, max: 15, message: "Too many download requests. Please slow down." },
  search: { windowMs: 60 * 1000, max: 30, message: "Too many search requests. Please slow down." },
  content_browse: { windowMs: 60 * 1000, max: 60, message: "Too many requests. Please slow down." },
  lead_capture: { windowMs: 15 * 60 * 1000, max: 5, message: "Too many submissions. Please try again later." },
  feedback: { windowMs: 15 * 60 * 1000, max: 10, message: "Too many submissions. Please try again later." },
  general: { windowMs: 60 * 1000, max: 60, message: "Too many requests. Please slow down." },
};

export function createRateLimiter(
  category: EndpointCategory,
  overrides?: Partial<RateLimitPreset>
) {
  const preset = { ...RATE_LIMIT_PRESETS[category], ...overrides };

  return rateLimit({
    windowMs: preset.windowMs,
    max: preset.max,
    skip: (req) => isLocalDevRequest(req),
    message: { error: preset.message },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: true, trustProxy: true },
    handler: (req, res) => {
      handleRateLimitExceeded(req, res);
      res.status(429).json({ error: preset.message });
    },
  });
}

export function antiScrapingHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
}

export function referrerValidation(req: Request, res: Response, next: NextFunction): void {
  const referer = req.headers["referer"] || req.headers["referrer"] || "";
  const origin = req.headers["origin"] || "";

  if (req.method === "GET" && !referer && !origin) {
    const ip = getClientIp(req);
    const userId = (req as any).authUser?.id || null;
    logAbuseEvent(userId, ip, req.path, "missing_referrer_premium", 1, {
      method: req.method,
    });
  }

  next();
}

export function manualBlockIp(ip: string, durationMs: number = 0, reason: string = "admin_block"): void {
  manualBlocks.set(ip, {
    until: durationMs > 0 ? Date.now() + durationMs : 0,
    reason,
  });
}

export function manualUnblockIp(ip: string): boolean {
  return manualBlocks.delete(ip);
}

export function manualUnblockUser(userId: string): boolean {
  const tracker = abuseTrackers.get(userId);
  if (tracker) {
    tracker.blockedUntil = 0;
    tracker.warnings = 0;
    tracker.tempBlocks = 0;
  }
  return manualBlocks.delete(userId);
}

export function getAbuseStats() {
  const now = Date.now();
  const activeBlocks: Array<{ key: string; blockedUntil: number; tempBlocks: number; rateLimitHits: number }> = [];
  const manualBlockList: Array<{ key: string; until: number; reason: string }> = [];

  for (const [key, tracker] of abuseTrackers.entries()) {
    if (tracker.blockedUntil > now || tracker.rateLimitHits > 0) {
      activeBlocks.push({
        key,
        blockedUntil: tracker.blockedUntil,
        tempBlocks: tracker.tempBlocks,
        rateLimitHits: tracker.rateLimitHits,
      });
    }
  }

  for (const [key, block] of manualBlocks.entries()) {
    manualBlockList.push({ key, until: block.until, reason: block.reason });
  }

  return { activeBlocks, manualBlocks: manualBlockList };
}
