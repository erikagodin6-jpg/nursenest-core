/**
 * Phase 17 — Resilience Observability Dashboard API
 *
 * Unified dashboard for monitoring all resilience systems.
 * Metrics: DB failures, cache hit rates, snapshot loads, offline sessions,
 * sync retries, CAT failovers, Stripe failovers, email retries.
 *
 * Admins can see: what failed, when, why, what backup activated.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { getEmailQueueStats } from "./email-dead-letter-queue";
import { getEmergencyBankStatus } from "./cat-exam-resilience";

export interface ResilienceMetrics {
  timestamp: string;
  database: {
    available: boolean;
    recentErrors: number;
    lastError?: string;
  };
  entitlementGrace: {
    activeGraceUsers: number;
    expiredGraceUsers: number;
  };
  checkoutIntents: {
    pending: number;
    recovered: number;
    total: number;
  };
  catResilience: {
    tierStatus: Array<{ tier: string; available: boolean; count: number; generatedAt: string | null }>;
    resilienceSessionsToday: number;
  };
  emailQueue: {
    pending: number;
    retrying: number;
    sent: number;
    dead: number;
  };
  adaptiveSnapshots: {
    totalActive: number;
    stale: number;
  };
  analyticsSnapshots: {
    totalActive: number;
    stale: number;
  };
  adminActionQueue: {
    pending: number;
    failed: number;
    appliedToday: number;
  };
  progressSync: {
    eventsProcessedToday: number;
    pendingEvents: number;
  };
  searchIndex: {
    entryCount: number;
    fresh: boolean;
    generatedAt: string | null;
  };
  alerts: Array<{
    id: string;
    severity: string;
    category: string;
    title: string;
    message: string;
    createdAt: number;
    acknowledged: boolean;
  }>;
}

async function safeCount(query: string, params: any[] = []): Promise<number> {
  try {
    const { rows } = await pool.query(query, params);
    return parseInt(rows[0]?.count || rows[0]?.total || "0");
  } catch {
    return -1;
  }
}

export async function gatherResilienceMetrics(): Promise<ResilienceMetrics> {
  const [
    recentDbErrors,
    graceActive,
    graceExpired,
    checkoutPending,
    checkoutRecovered,
    checkoutTotal,
    catResilienceToday,
    adaptiveActive,
    adaptiveStale,
    analyticsActive,
    analyticsStale,
    adminPending,
    adminFailed,
    adminApplied,
    progressToday,
    progressPending,
  ] = await Promise.all([
    safeCount(`SELECT COUNT(*) FROM critical_route_errors WHERE created_at > NOW() - INTERVAL '24 hours'`),
    safeCount(`SELECT COUNT(*) FROM entitlement_grace_snapshots WHERE grace_period_ends_at > NOW() AND tier != 'free'`),
    safeCount(`SELECT COUNT(*) FROM entitlement_grace_snapshots WHERE grace_period_ends_at < NOW()`),
    safeCount(`SELECT COUNT(*) FROM checkout_intents WHERE recovered_at IS NULL`),
    safeCount(`SELECT COUNT(*) FROM checkout_intents WHERE recovered_at IS NOT NULL`),
    safeCount(`SELECT COUNT(*) FROM checkout_intents`),
    safeCount(`SELECT COUNT(*) FROM cat_resilience_sessions WHERE started_at > NOW() - INTERVAL '24 hours'`),
    safeCount(`SELECT COUNT(*) FROM adaptive_snapshots WHERE valid_until > NOW()`),
    safeCount(`SELECT COUNT(*) FROM adaptive_snapshots WHERE valid_until < NOW()`),
    safeCount(`SELECT COUNT(*) FROM analytics_snapshots WHERE valid_until > NOW()`),
    safeCount(`SELECT COUNT(*) FROM analytics_snapshots WHERE valid_until < NOW()`),
    safeCount(`SELECT COUNT(*) FROM admin_action_queue WHERE status = 'pending'`),
    safeCount(`SELECT COUNT(*) FROM admin_action_queue WHERE status = 'failed'`),
    safeCount(`SELECT COUNT(*) FROM admin_action_queue WHERE status = 'applied' AND applied_at > NOW() - INTERVAL '24 hours'`),
    safeCount(`SELECT COUNT(*) FROM progress_sync_log WHERE synced_at > NOW() - INTERVAL '24 hours'`),
    safeCount(`SELECT COUNT(*) FROM progress_sync_log WHERE processed = false`),
  ]);

  const emailStats = await getEmailQueueStats().catch(() => ({ pending: 0, retrying: 0, sent: 0, dead: 0 }));

  let catTierStatus: ResilienceMetrics["catResilience"]["tierStatus"] = [];
  try {
    catTierStatus = getEmergencyBankStatus().map((s) => ({
      tier: s.tier,
      available: s.available,
      count: s.questionCount,
      generatedAt: s.generatedAt !== "never" ? s.generatedAt : null,
    }));
    // Add new_grad from DB
    const { rows: ngRow } = await pool.query(
      `SELECT question_count, generated_at FROM cat_emergency_fallback_banks WHERE tier = 'new_grad'`
    ).catch(() => ({ rows: [] }));
    if (!catTierStatus.find((t) => t.tier === "new_grad")) {
      catTierStatus.push({
        tier: "new_grad",
        available: ngRow.length > 0 && ngRow[0].question_count >= 25,
        count: ngRow[0]?.question_count || 0,
        generatedAt: ngRow[0]?.generated_at?.toISOString() || null,
      });
    }
  } catch {}

  // Recent alerts from platform resilience in-memory store
  let alerts: ResilienceMetrics["alerts"] = [];
  try {
    const { getRecentAlerts } = await import("./platform-resilience");
    alerts = (getRecentAlerts ? getRecentAlerts() : []).slice(0, 20);
  } catch {}

  return {
    timestamp: new Date().toISOString(),
    database: {
      available: recentDbErrors >= 0,
      recentErrors: recentDbErrors < 0 ? 0 : recentDbErrors,
    },
    entitlementGrace: {
      activeGraceUsers: graceActive,
      expiredGraceUsers: graceExpired,
    },
    checkoutIntents: {
      pending: checkoutPending,
      recovered: checkoutRecovered,
      total: checkoutTotal,
    },
    catResilience: {
      tierStatus: catTierStatus,
      resilienceSessionsToday: catResilienceToday,
    },
    emailQueue: {
      pending: emailStats.pending || 0,
      retrying: emailStats.retrying || 0,
      sent: emailStats.sent || 0,
      dead: emailStats.dead || 0,
    },
    adaptiveSnapshots: {
      totalActive: adaptiveActive,
      stale: adaptiveStale,
    },
    analyticsSnapshots: {
      totalActive: analyticsActive,
      stale: analyticsStale,
    },
    adminActionQueue: {
      pending: adminPending,
      failed: adminFailed,
      appliedToday: adminApplied,
    },
    progressSync: {
      eventsProcessedToday: progressToday,
      pendingEvents: progressPending,
    },
    searchIndex: {
      entryCount: 0, // populated by route handler
      fresh: false,
      generatedAt: null,
    },
    alerts,
  };
}

export function registerResilienceDashboardRoutes(app: Express): void {
  app.get("/api/admin/resilience-dashboard", async (_req: Request, res: Response) => {
    try {
      const metrics = await gatherResilienceMetrics();
      return res.json({ ok: true, metrics });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/resilience-dashboard/health", async (_req: Request, res: Response) => {
    try {
      await pool.query("SELECT 1");
      return res.json({ ok: true, database: "connected", timestamp: new Date().toISOString() });
    } catch (e: any) {
      return res.status(503).json({ ok: false, database: "unavailable", error: e.message, timestamp: new Date().toISOString() });
    }
  });

  // Trigger nightly jobs manually (admin)
  app.post("/api/admin/resilience-dashboard/run-nightly", async (_req: Request, res: Response) => {
    const results: Record<string, any> = {};

    try {
      const { runNightlyAdaptiveSnapshots } = await import("./adaptive-snapshot-engine");
      results.adaptive = await runNightlyAdaptiveSnapshots();
    } catch (e: any) { results.adaptive = { error: e.message }; }

    try {
      const { runNightlyAnalyticsSnapshots } = await import("./analytics-snapshot-engine");
      results.analytics = await runNightlyAnalyticsSnapshots();
    } catch (e: any) { results.analytics = { error: e.message }; }

    try {
      const { buildSearchSnapshotIndex } = await import("./search-snapshot-index");
      results.searchIndex = { count: await buildSearchSnapshotIndex() };
    } catch (e: any) { results.searchIndex = { error: e.message }; }

    try {
      const { ensureNewGradResilienceBank } = await import("./cat-resilience-extension");
      results.catNewGrad = await ensureNewGradResilienceBank();
    } catch (e: any) { results.catNewGrad = { error: e.message }; }

    try {
      const { replayPendingAdminActions } = await import("./admin-action-queue");
      results.adminQueue = await replayPendingAdminActions();
    } catch (e: any) { results.adminQueue = { error: e.message }; }

    return res.json({ ok: true, results, timestamp: new Date().toISOString() });
  });
}
