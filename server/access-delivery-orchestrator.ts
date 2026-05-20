import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import type { OrchestratorDeliveryTier } from "@shared/schema";
import { resolveAuthUser } from "./admin-auth";
import { queryParamString, routeParamString } from "./route-params";

export interface DeliveryAttemptResult {
  success: boolean;
  data?: any;
  error?: string;
  tier: OrchestratorDeliveryTier;
  responseTimeMs: number;
}

export interface OrchestratorConfig {
  contentId?: string;
  primaryHandler: (req: Request, res: Response) => Promise<any>;
  safeFallback?: (req: Request, res: Response) => Promise<any>;
  lastKnownGood?: (req: Request, contentId: string) => Promise<any>;
  backupSnapshot?: (req: Request, contentId: string) => Promise<any>;
  substituteEquivalent?: (req: Request, contentId: string) => Promise<any>;
  staticFallback?: (req: Request) => any;
  getContentId?: (req: Request) => string | null;
  quarantineHook?: (contentId: string, failureReason: string) => Promise<void>;
}

async function logRoutingDecision(
  userId: string | null,
  contentId: string | null,
  requestPath: string,
  attemptedTier: OrchestratorDeliveryTier,
  deliveredTier: OrchestratorDeliveryTier | "exhausted",
  failureReason: string | null,
  responseTimeMs: number,
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO orchestrator_routing_decisions (id, user_id, content_id, request_path, attempted_tier, delivered_tier, failure_reason, response_time_ms, metadata, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [userId, contentId, requestPath, attemptedTier, deliveredTier, failureReason, responseTimeMs, JSON.stringify(metadata || {})],
    );
  } catch (err: any) {
    console.error(`[AccessOrchestrator] Failed to log routing decision: ${err?.message}`);
  }
}

async function attemptDelivery(
  handler: () => Promise<any>,
  tier: OrchestratorDeliveryTier,
): Promise<DeliveryAttemptResult> {
  const start = Date.now();
  try {
    const data = await handler();
    return {
      success: true,
      data,
      tier,
      responseTimeMs: Date.now() - start,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Unknown error",
      tier,
      responseTimeMs: Date.now() - start,
    };
  }
}

async function fetchLastKnownGoodVersion(contentId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT * FROM content_snapshots WHERE content_id = $1 ORDER BY version DESC LIMIT 1`,
      [contentId],
    );
    return result.rows[0]?.content_data || null;
  } catch {
    return null;
  }
}

async function fetchBackupSnapshot(contentId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT * FROM render_payloads WHERE content_id = $1 ORDER BY version DESC LIMIT 1`,
      [contentId],
    );
    return result.rows[0]?.data || null;
  } catch {
    return null;
  }
}

async function findSubstituteContent(contentId: string, req?: Request): Promise<any | null> {
  try {
    const { findSubstitute } = await import("./substitute-content-engine");
    const userId: string | null = req ? ((req as any).authUser?.id || (req as any).user?.id || null) : null;
    const context = {
      userId,
      tier: (req as any)?.authUser?.tier || null,
      profession: (req as any)?.authUser?.careerType || (req as any)?.authUser?.career_type || null,
      region: (req as any)?.authUser?.region || null,
      requestPath: req?.originalUrl || req?.url || null,
    };

    const result = await findSubstitute(contentId, null, context);
    if (!result) return null;

    return {
      ...result.substituteData,
      _substitutionMeta: {
        originalContentId: contentId,
        substituteId: result.substituteId,
        matchScore: result.matchScore,
        matchingCriteria: result.matchingCriteria,
        wasLanguageFallback: result.wasLanguageFallback,
        message: result.message,
      },
    };
  } catch {
    return null;
  }
}

export function createAccessDeliveryOrchestrator(config: OrchestratorConfig) {
  return async (req: Request, res: Response, _next: NextFunction) => {
    const contentId = config.getContentId?.(req) || config.contentId || null;
    const requestPath = req.originalUrl || req.url;
    const userId: string | null = (req as any).authUser?.id || (req as any).user?.id || null;
    const overallStart = Date.now();

    const attempts: DeliveryAttemptResult[] = [];

    const primaryResult = await attemptDelivery(
      () => config.primaryHandler(req, res),
      "primary",
    );
    attempts.push(primaryResult);

    if (primaryResult.success) {
      logRoutingDecision(userId, contentId, requestPath, "primary", "primary", null, primaryResult.responseTimeMs).catch(() => {});
      return;
    }

    console.warn(`[AccessOrchestrator] Primary delivery failed for ${requestPath}: ${primaryResult.error}`);

    if (config.quarantineHook && contentId) {
      config.quarantineHook(contentId, primaryResult.error || "primary_delivery_failed").catch(() => {});
    }

    if (config.safeFallback) {
      const fallbackResult = await attemptDelivery(
        () => config.safeFallback!(req, res),
        "safe_fallback",
      );
      attempts.push(fallbackResult);
      if (fallbackResult.success) {
        logRoutingDecision(userId, contentId, requestPath, "primary", "safe_fallback", primaryResult.error || null, fallbackResult.responseTimeMs).catch(() => {});
        return;
      }
    }

    if (contentId) {
      if (config.lastKnownGood) {
        const lkgResult = await attemptDelivery(
          () => config.lastKnownGood!(req, contentId),
          "last_known_good",
        );
        attempts.push(lkgResult);
        if (lkgResult.success && lkgResult.data) {
          logRoutingDecision(userId, contentId, requestPath, "primary", "last_known_good", primaryResult.error || null, lkgResult.responseTimeMs).catch(() => {});
          if (!res.headersSent) {
            res.json({ data: lkgResult.data, _deliveryTier: "last_known_good", _contentId: contentId });
          }
          return;
        }
      } else {
        const lkgStart = Date.now();
        const lkgData = await fetchLastKnownGoodVersion(contentId);
        if (lkgData) {
          logRoutingDecision(userId, contentId, requestPath, "primary", "last_known_good", primaryResult.error || null, Date.now() - lkgStart).catch(() => {});
          if (!res.headersSent) {
            res.json({ data: lkgData, _deliveryTier: "last_known_good", _contentId: contentId });
          }
          return;
        }
      }

      if (config.backupSnapshot) {
        const backupResult = await attemptDelivery(
          () => config.backupSnapshot!(req, contentId),
          "backup_snapshot",
        );
        attempts.push(backupResult);
        if (backupResult.success && backupResult.data) {
          logRoutingDecision(userId, contentId, requestPath, "primary", "backup_snapshot", primaryResult.error || null, backupResult.responseTimeMs).catch(() => {});
          if (!res.headersSent) {
            res.json({ data: backupResult.data, _deliveryTier: "backup_snapshot", _contentId: contentId });
          }
          return;
        }
      } else {
        const bkStart = Date.now();
        const backupData = await fetchBackupSnapshot(contentId);
        if (backupData) {
          logRoutingDecision(userId, contentId, requestPath, "primary", "backup_snapshot", primaryResult.error || null, Date.now() - bkStart).catch(() => {});
          if (!res.headersSent) {
            res.json({ data: backupData, _deliveryTier: "backup_snapshot", _contentId: contentId });
          }
          return;
        }
      }

      if (config.substituteEquivalent) {
        const subResult = await attemptDelivery(
          () => config.substituteEquivalent!(req, contentId),
          "substitute_equivalent",
        );
        attempts.push(subResult);
        if (subResult.success && subResult.data) {
          logRoutingDecision(userId, contentId, requestPath, "primary", "substitute_equivalent", primaryResult.error || null, subResult.responseTimeMs).catch(() => {});
          if (!res.headersSent) {
            res.json({ data: subResult.data, _deliveryTier: "substitute_equivalent", _originalContentId: contentId });
          }
          return;
        }
      } else {
        const subStart = Date.now();
        const subData = await findSubstituteContent(contentId, req);
        if (subData) {
          logRoutingDecision(userId, contentId, requestPath, "primary", "substitute_equivalent", primaryResult.error || null, Date.now() - subStart).catch(() => {});
          if (!res.headersSent) {
            res.json({ data: subData, _deliveryTier: "substitute_equivalent", _originalContentId: contentId });
          }
          return;
        }
      }
    }

    if (config.staticFallback) {
      const staticData = config.staticFallback(req);
      logRoutingDecision(userId, contentId, requestPath, "primary", "static_fallback", primaryResult.error || null, Date.now() - overallStart).catch(() => {});
      if (!res.headersSent) {
        res.json({ data: staticData, _deliveryTier: "static_fallback" });
      }
      return;
    }

    const totalTime = attempts.reduce((sum, a) => sum + a.responseTimeMs, 0);
    logRoutingDecision(
      userId,
      contentId,
      requestPath,
      "primary",
      "exhausted",
      `all_tiers_exhausted: ${attempts.map(a => `${a.tier}:${a.error || "ok"}`).join(", ")}`,
      totalTime,
    ).catch(() => {});

    if (!res.headersSent) {
      res.status(503).json({
        error: "Content temporarily unavailable",
        _deliveryTier: "exhausted",
        _attemptsExhausted: true,
      });
    }
  };
}

export function wrapWithOrchestrator(
  handler: (req: Request, res: Response) => Promise<void>,
  options: {
    getContentId?: (req: Request) => string | null;
    staticFallbackData?: any;
  } = {},
) {
  return createAccessDeliveryOrchestrator({
    primaryHandler: handler,
    getContentId: options.getContentId,
    staticFallback: options.staticFallbackData
      ? () => options.staticFallbackData
      : undefined,
  });
}

export async function getOrchestratorStats(sinceHours: number = 24): Promise<{
  totalDecisions: number;
  byDeliveredTier: Record<string, number>;
  failureRate: number;
  avgResponseTimeMs: number;
}> {
  try {
    const safeSinceHours = Math.max(1, Math.min(Math.floor(Number(sinceHours) || 24), 8760));
    const result = await pool.query(
      `SELECT delivered_tier, COUNT(*) as count, AVG(response_time_ms) as avg_time
       FROM orchestrator_routing_decisions
       WHERE created_at > NOW() - ($1::int * INTERVAL '1 hour')
       GROUP BY delivered_tier`,
      [safeSinceHours],
    );

    const byDeliveredTier: Record<string, number> = {};
    let total = 0;
    let failures = 0;
    let totalTime = 0;
    let timeCount = 0;

    for (const row of result.rows) {
      byDeliveredTier[row.delivered_tier] = parseInt(row.count);
      total += parseInt(row.count);
      if (row.delivered_tier !== "primary") {
        failures += parseInt(row.count);
      }
      if (row.avg_time) {
        totalTime += parseFloat(row.avg_time) * parseInt(row.count);
        timeCount += parseInt(row.count);
      }
    }

    return {
      totalDecisions: total,
      byDeliveredTier,
      failureRate: total > 0 ? failures / total : 0,
      avgResponseTimeMs: timeCount > 0 ? totalTime / timeCount : 0,
    };
  } catch {
    return { totalDecisions: 0, byDeliveredTier: {}, failureRate: 0, avgResponseTimeMs: 0 };
  }
}

export type ContentType = "exam" | "cat" | "flashcard" | "lesson" | "download" | "study-guide" | "question-bank" | "mock-exam";

export type DeliveryMode =
  | "primary"
  | "safe-fallback"
  | "study-mode"
  | "backup-version"
  | "static-backup"
  | "printable-backup"
  | "fixed-form-backup"
  | "downloadable-backup"
  | "mirrored-storage"
  | "manual-fulfillment"
  | "recovery-screen";

export interface DeliveryDecision {
  mode: DeliveryMode;
  reason: string;
  contentType: ContentType;
  contentId?: string;
  fallbackChainPosition: number;
  metadata?: Record<string, any>;
}

export interface FallbackEvent {
  contentType: ContentType;
  contentId?: string;
  userId?: string;
  requestedMode: DeliveryMode;
  resolvedMode: DeliveryMode;
  reason: string;
  fallbackChainPosition: number;
  route: string;
  timestamp: string;
}

const FALLBACK_CHAINS: Record<ContentType, DeliveryMode[]> = {
  exam: ["primary", "safe-fallback", "study-mode", "backup-version", "static-backup", "recovery-screen"],
  cat: ["primary", "fixed-form-backup", "safe-fallback", "backup-version", "static-backup", "recovery-screen"],
  flashcard: ["primary", "safe-fallback", "study-mode", "downloadable-backup", "backup-version", "recovery-screen"],
  lesson: ["primary", "safe-fallback", "backup-version", "static-backup", "downloadable-backup", "recovery-screen"],
  download: ["primary", "mirrored-storage", "backup-version", "manual-fulfillment", "recovery-screen"],
  "study-guide": ["primary", "safe-fallback", "static-backup", "downloadable-backup", "recovery-screen"],
  "question-bank": ["primary", "safe-fallback", "study-mode", "recovery-screen"],
  "mock-exam": ["primary", "safe-fallback", "study-mode", "backup-version", "printable-backup", "recovery-screen"],
};

const recentFallbackEvents: FallbackEvent[] = [];
const MAX_EVENTS = 1000;

function recordFallbackEvent(event: FallbackEvent) {
  recentFallbackEvents.unshift(event);
  if (recentFallbackEvents.length > MAX_EVENTS) {
    recentFallbackEvents.length = MAX_EVENTS;
  }

  persistFallbackEvent(event).catch((e) =>
    console.error("[AccessDeliveryOrchestrator] Failed to persist event:", e.message)
  );
}

async function persistFallbackEvent(event: FallbackEvent) {
  try {
    await pool.query(
      `INSERT INTO fallback_delivery_events (content_type, content_id, user_id, requested_mode, resolved_mode, reason, fallback_chain_position, route, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [event.contentType, event.contentId, event.userId, event.requestedMode, event.resolvedMode, event.reason, event.fallbackChainPosition, event.route]
    );
  } catch {}
}

interface ModeAvailability {
  available: boolean;
  reason?: string;
}

type ModeChecker = (contentType: ContentType, contentId?: string, userId?: string) => Promise<ModeAvailability>;

const modeCheckers: Partial<Record<DeliveryMode, ModeChecker>> = {
  "primary": async () => ({ available: true }),
  "safe-fallback": async () => ({ available: true }),
  "study-mode": async () => ({ available: true }),
  "printable-backup": async () => ({ available: true }),
  "recovery-screen": async () => ({ available: true }),

  "backup-version": async (contentType, contentId) => {
    if (!contentId) return { available: false, reason: "no_content_id" };
    try {
      const result = await pool.query(
        `SELECT id FROM content_versions WHERE content_type = $1 AND content_id = $2 AND verified_good = true ORDER BY version_number DESC LIMIT 1`,
        [contentType, contentId]
      );
      return { available: result.rows.length > 0, reason: result.rows.length === 0 ? "no_verified_version" : undefined };
    } catch {
      return { available: false, reason: "db_error" };
    }
  },

  "fixed-form-backup": async (contentType, contentId) => {
    if (contentType !== "cat") return { available: false, reason: "not_cat" };
    try {
      const result = await pool.query(
        `SELECT id FROM exam_snapshots WHERE template_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [contentId]
      );
      return { available: result.rows.length > 0, reason: result.rows.length === 0 ? "no_snapshot" : undefined };
    } catch {
      return { available: true, reason: "snapshot_check_failed_but_can_generate" };
    }
  },

  "static-backup": async (contentType, contentId) => {
    if (!contentId) return { available: false, reason: "no_content_id" };
    try {
      const result = await pool.query(
        `SELECT id FROM content_versions WHERE content_type = $1 AND content_id = $2 ORDER BY version_number DESC LIMIT 1`,
        [contentType, contentId]
      );
      return { available: result.rows.length > 0, reason: result.rows.length === 0 ? "no_static_backup" : undefined };
    } catch {
      return { available: false, reason: "db_error" };
    }
  },

  "downloadable-backup": async (contentType) => {
    const downloadableTypes: ContentType[] = ["flashcard", "lesson", "study-guide"];
    return { available: downloadableTypes.includes(contentType) };
  },

  "mirrored-storage": async () => {
    const hasStoragePaths = !!process.env.PUBLIC_OBJECT_SEARCH_PATHS;
    return { available: hasStoragePaths, reason: hasStoragePaths ? undefined : "no_storage_configured" };
  },

  "manual-fulfillment": async () => {
    return { available: true };
  },
};

export async function evaluateDeliveryMode(
  contentType: ContentType,
  contentId?: string,
  userId?: string,
  requestedMode?: DeliveryMode,
  primaryFailed: boolean = false,
  failureReason?: string
): Promise<DeliveryDecision> {
  const chain = FALLBACK_CHAINS[contentType] || ["primary", "recovery-screen"];

  if (requestedMode && requestedMode !== "primary") {
    const checker = modeCheckers[requestedMode];
    if (checker) {
      const check = await checker(contentType, contentId, userId);
      if (check.available) {
        return {
          mode: requestedMode,
          reason: "user_requested",
          contentType,
          contentId,
          fallbackChainPosition: chain.indexOf(requestedMode),
          metadata: { requestedMode },
        };
      }
    }
    const requestedIdx = chain.indexOf(requestedMode);
    for (let i = Math.max(requestedIdx + 1, 1); i < chain.length; i++) {
      const fallbackMode = chain[i];
      const fallbackChecker = modeCheckers[fallbackMode];
      if (!fallbackChecker) {
        return {
          mode: fallbackMode,
          reason: `requested_${requestedMode}_unavailable`,
          contentType,
          contentId,
          fallbackChainPosition: i,
        };
      }
      try {
        const fallbackCheck = await fallbackChecker(contentType, contentId, userId);
        if (fallbackCheck.available) {
          return {
            mode: fallbackMode,
            reason: `requested_${requestedMode}_unavailable`,
            contentType,
            contentId,
            fallbackChainPosition: i,
            metadata: { originalRequest: requestedMode, checkerResult: fallbackCheck },
          };
        }
      } catch { continue; }
    }
    return {
      mode: "recovery-screen",
      reason: `requested_${requestedMode}_unavailable_all_exhausted`,
      contentType,
      contentId,
      fallbackChainPosition: chain.length - 1,
    };
  }

  if (!primaryFailed) {
    return {
      mode: "primary",
      reason: "primary_available",
      contentType,
      contentId,
      fallbackChainPosition: 0,
    };
  }

  for (let i = 1; i < chain.length; i++) {
    const mode = chain[i];
    const checker = modeCheckers[mode];
    if (!checker) {
      return {
        mode,
        reason: failureReason || "primary_failed",
        contentType,
        contentId,
        fallbackChainPosition: i,
      };
    }

    try {
      const check = await checker(contentType, contentId, userId);
      if (check.available) {
        return {
          mode,
          reason: failureReason || "primary_failed",
          contentType,
          contentId,
          fallbackChainPosition: i,
          metadata: { checkerResult: check },
        };
      }
    } catch {
      continue;
    }
  }

  return {
    mode: "recovery-screen",
    reason: "all_fallbacks_exhausted",
    contentType,
    contentId,
    fallbackChainPosition: chain.length - 1,
  };
}

export function deliveryOrchestratorMiddleware(contentType: ContentType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const contentId =
      routeParamString(req.params.id) ||
      routeParamString(req.params.contentId) ||
      routeParamString(req.params.attemptId) ||
      undefined;
    let userId: string | undefined;
    try {
      const user = await resolveAuthUser(req as any);
      userId = user?.id;
    } catch {}

    const requestedMode =
      queryParamString(req.query.fallback as string | string[] | undefined) ||
      queryParamString(req.query.delivery_mode as string | string[] | undefined);

    try {
      const decision = await evaluateDeliveryMode(
        contentType,
        contentId,
        userId,
        requestedMode as DeliveryMode | undefined
      );

      (req as any).deliveryDecision = decision;

      if (decision.mode !== "primary") {
        recordFallbackEvent({
          contentType,
          contentId,
          userId,
          requestedMode: (requestedMode as DeliveryMode) || "primary",
          resolvedMode: decision.mode,
          reason: decision.reason,
          fallbackChainPosition: decision.fallbackChainPosition,
          route: req.originalUrl || req.path,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (err) {
      (req as any).deliveryDecision = {
        mode: "primary",
        reason: "orchestrator_error",
        contentType,
        contentId,
        fallbackChainPosition: 0,
      };
      next();
    }
  };
}

export function getDeliveryDecision(req: Request): DeliveryDecision | null {
  return (req as any).deliveryDecision || null;
}

async function ensureFallbackTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fallback_delivery_events (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        content_type text NOT NULL,
        content_id varchar,
        user_id varchar,
        requested_mode text NOT NULL,
        resolved_mode text NOT NULL,
        reason text NOT NULL,
        fallback_chain_position integer NOT NULL DEFAULT 0,
        route text,
        created_at timestamptz DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_fallback_events_type ON fallback_delivery_events(content_type);
      CREATE INDEX IF NOT EXISTS idx_fallback_events_created ON fallback_delivery_events(created_at);

      CREATE TABLE IF NOT EXISTS manual_fulfillment_queue (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        content_type text NOT NULL,
        content_id varchar NOT NULL,
        user_id varchar NOT NULL,
        status text NOT NULL DEFAULT 'pending',
        reason text,
        resolved_at timestamptz,
        resolved_by varchar,
        created_at timestamptz DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_manual_fulfillment_status ON manual_fulfillment_queue(status);
      CREATE INDEX IF NOT EXISTS idx_manual_fulfillment_user ON manual_fulfillment_queue(user_id);
    `);
  } catch (e: any) {
    console.error("[AccessDeliveryOrchestrator] Table creation error:", e.message);
  }
}

export function registerAccessDeliveryRoutes(app: Express) {
  ensureFallbackTables().catch((e) =>
    console.error("[AccessDeliveryOrchestrator] Init error:", e?.message)
  );

  app.get("/api/delivery/evaluate", async (req, res) => {
    try {
      const contentType = (req.query.contentType as ContentType) || "exam";
      const contentId = req.query.contentId as string | undefined;
      const mode = req.query.mode as DeliveryMode | undefined;
      const primaryFailed = req.query.primaryFailed === "true";

      let userId: string | undefined;
      try {
        const user = await resolveAuthUser(req as any);
        userId = user?.id;
      } catch {}

      const decision = await evaluateDeliveryMode(contentType, contentId, userId, mode, primaryFailed);
      res.json(decision);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/delivery/fallback-chain", (req, res) => {
    const contentType = (req.query.contentType as ContentType) || "exam";
    const chain = FALLBACK_CHAINS[contentType] || ["primary", "recovery-screen"];
    res.json({ contentType, chain });
  });

  app.post("/api/delivery/manual-fulfillment", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { contentType, contentId, reason } = req.body;
      if (!contentType || !contentId) {
        return res.status(400).json({ error: "contentType and contentId required" });
      }

      await pool.query(
        `INSERT INTO manual_fulfillment_queue (id, content_type, content_id, user_id, reason, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
        [contentType, contentId, user.id, reason || "download_fallback"]
      );

      recordFallbackEvent({
        contentType: contentType as ContentType,
        contentId,
        userId: user.id,
        requestedMode: "manual-fulfillment",
        resolvedMode: "manual-fulfillment",
        reason: reason || "user_requested_manual_fulfillment",
        fallbackChainPosition: -1,
        route: req.originalUrl,
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, message: "Your request has been queued for manual processing." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/delivery/events", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin required" });

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const contentType = req.query.contentType as string;

      let query = `SELECT * FROM fallback_delivery_events`;
      const params: any[] = [];
      if (contentType) {
        query += ` WHERE content_type = $1`;
        params.push(contentType);
      }
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await pool.query(query, params);
      res.json({
        events: result.rows,
        recentInMemory: recentFallbackEvents.slice(0, 20),
      });
    } catch (err: any) {
      res.json({ events: [], recentInMemory: recentFallbackEvents.slice(0, 20) });
    }
  });

  app.get("/api/delivery/fulfillment-queue", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin required" });

      const status = (req.query.status as string) || "pending";
      const result = await pool.query(
        `SELECT * FROM manual_fulfillment_queue WHERE status = $1 ORDER BY created_at DESC LIMIT 100`,
        [status]
      );
      res.json({ queue: result.rows });
    } catch (err: any) {
      res.json({ queue: [] });
    }
  });

  app.post("/api/delivery/fulfillment-resolve", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin required" });

      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });

      await pool.query(
        `UPDATE manual_fulfillment_queue SET status = 'resolved', resolved_at = NOW(), resolved_by = $1 WHERE id = $2`,
        [user.id, id]
      );
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/mock-exams/backup-practice-set", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { tier, examCode, questionCount } = req.body;
      const targetTier = tier || "nclex-rn";
      const count = Math.min(questionCount || 25, 50);

      let questions: any[] = [];
      try {
        const result = await pool.query(
          `SELECT id, stem AS question, options, correct_answer AS correct, rationale, body_system, difficulty, question_type AS "questionType"
           FROM questions
           WHERE tier = $1 AND active = true
           ORDER BY RANDOM()
           LIMIT $2`,
          [targetTier, count]
        );
        questions = result.rows.map((row: any) => {
          let opts = row.options;
          if (typeof opts === "string") {
            try { opts = JSON.parse(opts); } catch { opts = []; }
          }
          let correct = row.correct;
          if (typeof correct === "string") {
            const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
            correct = letterMap[correct.toUpperCase()] ?? parseInt(correct, 10);
          }
          return {
            id: String(row.id),
            question: row.question,
            options: Array.isArray(opts) ? opts : [],
            correct: typeof correct === "number" && !isNaN(correct) ? correct : 0,
            rationale: row.rationale || "",
            bodySystem: row.body_system || "General",
            difficulty: row.difficulty || "medium",
            questionType: row.questionType || "multiple-choice",
          };
        }).filter((q: any) => q.question && Array.isArray(q.options) && q.options.length >= 2);
      } catch (dbErr) {
        console.warn("[AccessDeliveryOrchestrator] backup-practice-set DB error:", (dbErr as Error).message);
      }

      if (questions.length === 0) {
        return res.status(404).json({ error: "No backup questions available for this tier" });
      }

      recordFallbackEvent({
        contentType: "mock-exam",
        contentId: examCode || targetTier,
        userId: user.id,
        requestedMode: "safe-fallback",
        resolvedMode: "safe-fallback",
        reason: "backup_practice_set_generated",
        fallbackChainPosition: 1,
        route: req.originalUrl,
        timestamp: new Date().toISOString(),
      });

      res.json({ questions, tier: targetTier, count: questions.length, source: "backup-practice-set" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate backup practice set" });
    }
  });

  app.get("/api/content/download/:contentType/:contentId", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { contentType, contentId } = req.params;

      if (user.tier === "free") {
        return res.status(403).json({ error: "Content downloads require an active subscription" });
      }

      let content: any = null;
      try {
        if (contentType === "flashcard") {
          const result = await pool.query(
            `SELECT * FROM flashcard_bank WHERE id = $1 OR topic = $1 LIMIT 50`,
            [contentId]
          );
          content = { type: "flashcard", cards: result.rows };
        } else if (contentType === "lesson" || contentType === "study-guide") {
          const result = await pool.query(
            `SELECT * FROM content_items WHERE id = $1 OR slug = $1 LIMIT 1`,
            [contentId]
          );
          content = result.rows[0] || null;
        } else if (contentType === "exam" || contentType === "mock-exam") {
          const result = await pool.query(
            `SELECT * FROM content_versions WHERE content_type = $1 AND content_id = $2 AND verified_good = true ORDER BY version_number DESC LIMIT 1`,
            [contentType, contentId]
          );
          content = result.rows[0]?.snapshot || null;
        }
      } catch {}

      if (!content) {
        const versionResult = await pool.query(
          `SELECT snapshot FROM content_versions WHERE content_type = $1 AND content_id = $2 ORDER BY version_number DESC LIMIT 1`,
          [contentType, contentId]
        ).catch(() => ({ rows: [] }));

        content = versionResult.rows[0]?.snapshot || { message: "Content backup unavailable" };
      }

      recordFallbackEvent({
        contentType: contentType as ContentType,
        contentId,
        userId: user.id,
        requestedMode: "downloadable-backup",
        resolvedMode: "downloadable-backup",
        reason: "user_download_backup",
        fallbackChainPosition: -1,
        route: req.originalUrl,
        timestamp: new Date().toISOString(),
      });

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${contentType}-${contentId}-backup.json"`);
      res.json(content);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate backup download" });
    }
  });
}
