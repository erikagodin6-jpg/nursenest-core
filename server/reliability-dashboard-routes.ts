import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin, logOperatorAction } from "./admin-auth";
import { getActiveIncidents, getAllIncidents } from "./incident-monitor";
import { BoundedMap } from "./bounded-map";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

interface RouteErrorEntry {
  count: number;
  lastSeen: number;
  statuses: { code: number; timestamp: number }[];
}

const routeErrorCounts = new BoundedMap<string, RouteErrorEntry>(500, 30 * 60 * 1000);

export function recordRouteError(path: string, statusCode: number): void {
  const key = path.replace(/\/[0-9a-f-]{36}/g, "/:id").replace(/\/\d+/g, "/:id");
  const now = Date.now();
  const existing = routeErrorCounts.get(key);
  if (existing) {
    existing.count++;
    existing.lastSeen = now;
    existing.statuses.push({ code: statusCode, timestamp: now });
    if (existing.statuses.length > 200) existing.statuses = existing.statuses.slice(-200);
  } else {
    routeErrorCounts.set(key, { count: 1, lastSeen: now, statuses: [{ code: statusCode, timestamp: now }] });
  }
}

const fallbackEvents: { timestamp: number; route: string; reason: string; primary: string; fallback: string }[] = [];

export function recordFallbackUsage(route: string, reason: string, primary: string, fallback: string): void {
  fallbackEvents.push({ timestamp: Date.now(), route, reason, primary, fallback });
  if (fallbackEvents.length > 500) fallbackEvents.splice(0, fallbackEvents.length - 500);
}

const provisionalAccessEvents: { timestamp: number; userId: string; reason: string; durationMs: number }[] = [];

export function recordProvisionalAccess(userId: string, reason: string, durationMs: number = 3600000): void {
  provisionalAccessEvents.push({ timestamp: Date.now(), userId, reason, durationMs });
  if (provisionalAccessEvents.length > 500) provisionalAccessEvents.splice(0, provisionalAccessEvents.length - 500);
}

function requireSuperOrOpsAdmin(admin: any, res: Response): boolean {
  const role = admin.admin_role || admin.adminRole || "super_admin";
  if (role === "super_admin" || role === "ops_viewer") return true;
  res.status(403).json({ error: "Insufficient permissions. Requires super_admin or ops_viewer role." });
  return false;
}

function requireSuperAdmin(admin: any, res: Response): boolean {
  const role = admin.admin_role || admin.adminRole || "super_admin";
  if (role === "super_admin") return true;
  res.status(403).json({ error: "Insufficient permissions. Requires super_admin role." });
  return false;
}

export function registerReliabilityDashboardRoutes(app: Express): void {

  app.get("/api/admin/reliability/failing-routes", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      const routes: any[] = [];
      for (const [path, data] of routeErrorCounts.entries()) {
        if (data.lastSeen > cutoff) {
          const recentStatuses = data.statuses.filter(s => s.timestamp > cutoff);
          const statusCounts: Record<number, number> = {};
          for (const s of recentStatuses) {
            statusCounts[s.code] = (statusCounts[s.code] || 0) + 1;
          }
          if (recentStatuses.length > 0) {
            routes.push({
              path,
              errors24h: recentStatuses.length,
              totalErrors: data.count,
              lastSeen: new Date(data.lastSeen).toISOString(),
              statusBreakdown: statusCounts,
              is5xx: recentStatuses.some(s => s.code >= 500),
            });
          }
        }
      }
      routes.sort((a, b) => b.errors24h - a.errors24h);
      res.json({ routes: routes.slice(0, 50), totalTracked: routeErrorCounts.size });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/fallback-usage", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const hours = parseInt(req.query.hours as string) || 24;
      const cutoff = Date.now() - hours * 60 * 60 * 1000;
      const recent = fallbackEvents.filter(e => e.timestamp > cutoff);

      const byRoute: Record<string, number> = {};
      const byReason: Record<string, number> = {};
      for (const e of recent) {
        byRoute[e.route] = (byRoute[e.route] || 0) + 1;
        byReason[e.reason] = (byReason[e.reason] || 0) + 1;
      }

      res.json({
        totalFallbacks: recent.length,
        byRoute,
        byReason,
        recentEvents: recent.slice(-20).reverse(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/quarantined-content", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let quarantined: any[] = [];
      try {
        const result = await pool.query(
          `SELECT cq.*, 
            COALESCE(
              (SELECT COUNT(DISTINCT user_id) FROM user_progress WHERE lesson_id = cq.content_id),
              0
            ) as affected_user_count
           FROM content_quarantine cq 
           WHERE cq.resolved_at IS NULL 
           ORDER BY cq.created_at DESC 
           LIMIT 50`
        );
        quarantined = result.rows.map(snakeToCamel);
      } catch (e: any) {
        quarantined = [];
      }

      res.json({ quarantined, total: quarantined.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/validation-failures", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let failures: any[] = [];
      try {
        const result = await pool.query(
          `SELECT id, content_id, content_type, version, errors, warnings, triggered_by, created_at
           FROM content_validation_results
           WHERE valid = false
           ORDER BY created_at DESC
           LIMIT 50`
        );
        failures = result.rows.map(snakeToCamel);
      } catch {
        failures = [];
      }

      res.json({ failures, total: failures.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/provisional-access", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const hours = parseInt(req.query.hours as string) || 24;
      const cutoff = Date.now() - hours * 60 * 60 * 1000;
      const recent = provisionalAccessEvents.filter(e => e.timestamp > cutoff);

      const uniqueUsers = new Set(recent.map(e => e.userId));

      res.json({
        totalEvents: recent.length,
        uniqueUsersAffected: uniqueUsers.size,
        events: recent.slice(-30).reverse().map(e => ({
          ...e,
          timestamp: new Date(e.timestamp).toISOString(),
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/entitlement-mismatches", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let mismatches: any[] = [];
      try {
        const result = await pool.query(
          `SELECT id, username, email, tier, subscription_status, stripe_customer_id
           FROM users
           WHERE tier IN ('rpn', 'rn', 'np', 'allied', 'imaging', 'new_grad_toolkit', 'certification_prep', 'full_access')
             AND (subscription_status IS NULL OR subscription_status NOT IN ('active', 'trialing'))
           ORDER BY username
           LIMIT 100`
        );
        mismatches = result.rows.map(r => snakeToCamel({
          ...r,
          mismatchType: "paid_tier_inactive_subscription",
          description: `User has tier "${r.tier}" but subscription status is "${r.subscription_status || 'null'}"`,
        }));
      } catch {
        mismatches = [];
      }

      let reverseMismatches: any[] = [];
      try {
        const result2 = await pool.query(
          `SELECT id, username, email, tier, subscription_status, stripe_customer_id
           FROM users
           WHERE subscription_status = 'active'
             AND (tier IS NULL OR tier = 'free')
           ORDER BY username
           LIMIT 100`
        );
        reverseMismatches = result2.rows.map(r => snakeToCamel({
          ...r,
          mismatchType: "active_subscription_free_tier",
          description: `User has active subscription but tier is "${r.tier || 'free'}"`,
        }));
      } catch {
        reverseMismatches = [];
      }

      res.json({
        mismatches: [...mismatches, ...reverseMismatches],
        total: mismatches.length + reverseMismatches.length,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/incidents", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let active: any[] = [];
      let recent: any[] = [];
      try {
        active = getActiveIncidents();
      } catch { active = []; }
      try {
        const all = getAllIncidents();
        recent = all.sort((a, b) => (b.lastOccurrence || 0) - (a.lastOccurrence || 0)).slice(0, 50);
      } catch { recent = []; }

      res.json({ active, recent, totalActive: active.length, totalRecent: recent.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/summary", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;

      let failingRouteCount = 0;
      for (const [, data] of routeErrorCounts.entries()) {
        const recent5xx = data.statuses.filter(s => s.timestamp > cutoff24h && s.code >= 500);
        if (recent5xx.length > 0) failingRouteCount++;
      }

      const fallbackCount = fallbackEvents.filter(e => e.timestamp > cutoff24h).length;
      const provisionalCount = provisionalAccessEvents.filter(e => e.timestamp > cutoff24h).length;

      let quarantineCount = 0;
      try {
        const qr = await pool.query("SELECT COUNT(*)::int as cnt FROM content_quarantine WHERE resolved_at IS NULL");
        quarantineCount = qr.rows[0]?.cnt || 0;
      } catch {}

      let validationFailureCount = 0;
      try {
        const vr = await pool.query(
          "SELECT COUNT(*)::int as cnt FROM content_validation_results WHERE valid = false AND created_at > NOW() - INTERVAL '24 hours'"
        );
        validationFailureCount = vr.rows[0]?.cnt || 0;
      } catch {}

      let entitlementMismatchCount = 0;
      try {
        const mr = await pool.query(
          `SELECT COUNT(*)::int as cnt FROM users
           WHERE (tier IN ('rpn','rn','np','allied','imaging','new_grad_toolkit','certification_prep','full_access')
                  AND (subscription_status IS NULL OR subscription_status NOT IN ('active','trialing')))
              OR (subscription_status = 'active' AND (tier IS NULL OR tier = 'free'))`
        );
        entitlementMismatchCount = mr.rows[0]?.cnt || 0;
      } catch {}

      let activeIncidentCount = 0;
      try {
        activeIncidentCount = getActiveIncidents().length;
      } catch {}

      const overallHealth = activeIncidentCount > 0 || failingRouteCount > 5
        ? "critical"
        : quarantineCount > 0 || entitlementMismatchCount > 5 || failingRouteCount > 0
        ? "degraded"
        : "healthy";

      res.json({
        overallHealth,
        failingRouteCount,
        fallbackCount,
        quarantineCount,
        validationFailureCount,
        entitlementMismatchCount,
        provisionalAccessCount: provisionalCount,
        activeIncidentCount,
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/disable-content", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperOrOpsAdmin(admin, res)) return;

      const { contentId, contentType } = req.body;
      if (!contentId || !contentType) {
        return res.status(400).json({ error: "contentId and contentType are required" });
      }

      const table = contentType === "lesson" ? "lessons" : "content";
      await pool.query(`UPDATE ${table} SET status = 'disabled' WHERE id = $1 OR slug = $1`, [contentId]);

      await logOperatorAction({
        req, actor: admin, action: "reliability_disable_content",
        actionCategory: "reliability", entityType: "content",
        entityId: contentId, reason: "Disabled via reliability dashboard",
      });

      res.json({ success: true, action: "disabled", contentId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/enable-content", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperOrOpsAdmin(admin, res)) return;

      const { contentId, contentType } = req.body;
      if (!contentId || !contentType) {
        return res.status(400).json({ error: "contentId and contentType are required" });
      }

      const table = contentType === "lesson" ? "lessons" : "content";
      await pool.query(`UPDATE ${table} SET status = 'published' WHERE id = $1 OR slug = $1`, [contentId]);

      await logOperatorAction({
        req, actor: admin, action: "reliability_enable_content",
        actionCategory: "reliability", entityType: "content",
        entityId: contentId, reason: "Enabled via reliability dashboard",
      });

      res.json({ success: true, action: "enabled", contentId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/restore-version", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperOrOpsAdmin(admin, res)) return;

      const { contentId } = req.body;
      if (!contentId) {
        return res.status(400).json({ error: "contentId is required" });
      }

      let restored = false;
      try {
        const snapshot = await pool.query(
          `SELECT * FROM content_snapshots WHERE content_id = $1 AND is_last_known_good = true ORDER BY created_at DESC LIMIT 1`,
          [contentId]
        );
        if (snapshot.rows[0]) {
          const snap = snapshot.rows[0];
          if (snap.verified_payload) {
            await pool.query(
              `UPDATE content SET content = $1, status = 'published', updated_at = NOW() WHERE id = $2`,
              [snap.verified_payload, contentId]
            );
            restored = true;
          }
        }
      } catch {}

      if (!restored) {
        try {
          const revision = await pool.query(
            `SELECT * FROM content_revisions WHERE content_id = $1 ORDER BY revision_number DESC LIMIT 1`,
            [contentId]
          );
          if (revision.rows[0]) {
            await pool.query(
              `UPDATE content SET content = $1, status = 'published', updated_at = NOW() WHERE id = $2`,
              [revision.rows[0].content, contentId]
            );
            restored = true;
          }
        } catch {}
      }

      await logOperatorAction({
        req, actor: admin, action: "reliability_restore_version",
        actionCategory: "reliability", entityType: "content",
        entityId: contentId, reason: "Version restored via reliability dashboard",
        afterState: { restored },
      });

      res.json({ success: restored, action: "restore_version", contentId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/force-backup-mode", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperOrOpsAdmin(admin, res)) return;

      const { contentId, category } = req.body;
      if (!contentId && !category) {
        return res.status(400).json({ error: "contentId or category is required" });
      }

      if (contentId) {
        try {
          await pool.query(
            `INSERT INTO content_quarantine (id, content_id, content_type, reason, triggered_by, created_at)
             VALUES (gen_random_uuid(), $1, 'content', 'forced_backup_mode', 'admin', NOW())
             ON CONFLICT DO NOTHING`,
            [contentId]
          );
        } catch {}
      }

      await logOperatorAction({
        req, actor: admin, action: "reliability_force_backup_mode",
        actionCategory: "reliability", entityType: "content",
        entityId: contentId || category, reason: "Forced backup mode via reliability dashboard",
      });

      res.json({ success: true, action: "force_backup_mode", contentId, category });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/replay-entitlement-sync", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperAdmin(admin, res)) return;

      const { userId, batchAll } = req.body;

      if (batchAll) {
        const result = await pool.query(
          `UPDATE users SET subscription_status = 'inactive', tier = 'free'
           WHERE tier IN ('rpn','rn','np','allied','imaging','new_grad_toolkit','certification_prep','full_access')
             AND (subscription_status IS NULL OR subscription_status NOT IN ('active','trialing'))
           RETURNING id, username`
        );

        const reverseResult = await pool.query(
          `UPDATE users SET subscription_status = 'inactive'
           WHERE subscription_status = 'active' AND (tier IS NULL OR tier = 'free')
           RETURNING id, username`
        );

        await logOperatorAction({
          req, actor: admin, action: "reliability_batch_entitlement_sync",
          actionCategory: "reliability", entityType: "entitlement",
          reason: "Batch entitlement sync via reliability dashboard",
          afterState: { downgraded: result.rows.length, fixedReverse: reverseResult.rows.length },
        });

        res.json({
          success: true,
          action: "replay_entitlement_sync",
          downgraded: result.rows.length,
          fixedReverse: reverseResult.rows.length,
        });
        return;
      }

      if (!userId) {
        return res.status(400).json({ error: "userId or batchAll is required" });
      }

      const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
      if (!user.rows[0]) {
        return res.status(404).json({ error: "User not found" });
      }

      const u = user.rows[0];
      let action = "no_change";

      if (u.stripe_customer_id) {
        try {
          const { getUncachableStripeClient } = await import("./stripeClient");
          const stripe = await getUncachableStripeClient();
          const subs = await stripe.subscriptions.list({ customer: u.stripe_customer_id, limit: 1 });
          if (subs.data.length > 0 && subs.data[0].status === "active") {
            action = "confirmed_active";
          } else {
            await pool.query("UPDATE users SET subscription_status = 'inactive', tier = 'free' WHERE id = $1", [userId]);
            action = "downgraded_to_free";
          }
        } catch {
          action = "stripe_check_failed";
        }
      } else {
        if (u.tier !== "free" && u.tier !== "admin") {
          await pool.query("UPDATE users SET subscription_status = 'inactive', tier = 'free' WHERE id = $1", [userId]);
          action = "downgraded_no_stripe";
        }
      }

      await logOperatorAction({
        req, actor: admin, action: "reliability_replay_entitlement",
        actionCategory: "reliability", entityType: "user",
        entityId: userId, reason: "Single user entitlement sync via reliability dashboard",
        beforeState: { tier: u.tier, subscriptionStatus: u.subscription_status },
        afterState: { action },
      });

      res.json({ success: true, action, userId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/regenerate-backups", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperOrOpsAdmin(admin, res)) return;

      const { contentId } = req.body;
      if (!contentId) {
        return res.status(400).json({ error: "contentId is required" });
      }

      let generated = false;
      try {
        const { createContentSnapshot } = await import("./content-versioning-quarantine");
        const result = await createContentSnapshot(contentId, "content", true);
        generated = !!result;
      } catch {}

      await logOperatorAction({
        req, actor: admin, action: "reliability_regenerate_backups",
        actionCategory: "reliability", entityType: "content",
        entityId: contentId, reason: "Backup regeneration via reliability dashboard",
        afterState: { generated },
      });

      res.json({ success: generated, action: "regenerate_backups", contentId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/extend-access", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperAdmin(admin, res)) return;

      const { userId, days } = req.body;
      if (!userId || !days) {
        return res.status(400).json({ error: "userId and days are required" });
      }

      const extensionDate = new Date();
      extensionDate.setDate(extensionDate.getDate() + parseInt(days));

      await pool.query(
        `UPDATE users SET subscription_status = 'active', updated_at = NOW() WHERE id = $1`,
        [userId]
      );

      await logOperatorAction({
        req, actor: admin, action: "reliability_extend_access",
        actionCategory: "reliability", entityType: "user",
        entityId: userId, reason: `Extended access by ${days} days via reliability dashboard`,
        afterState: { extendedUntil: extensionDate.toISOString() },
      });

      res.json({ success: true, action: "extend_access", userId, extendedUntil: extensionDate.toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/backup-usage", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let byFeatureType: Record<string, number> = {};
      let totalBackupServed = 0;
      let recentEvents: any[] = [];

      try {
        const result = await pool.query(`
          SELECT delivered_tier, product_type, COUNT(*)::int as cnt,
                 MAX(created_at) as last_occurrence
          FROM orchestrator_routing_decisions
          WHERE delivered_tier IN ('backup_snapshot', 'last_known_good', 'static_fallback')
            AND created_at > NOW() - INTERVAL '24 hours'
          GROUP BY delivered_tier, product_type
          ORDER BY cnt DESC
        `);
        for (const row of result.rows) {
          const key = `${row.product_type}:${row.delivered_tier}`;
          byFeatureType[key] = row.cnt;
          totalBackupServed += row.cnt;
        }
      } catch {}

      try {
        const eventsResult = await pool.query(`
          SELECT id, product_type, product_id, delivered_tier, created_at
          FROM orchestrator_routing_decisions
          WHERE delivered_tier IN ('backup_snapshot', 'last_known_good', 'static_fallback')
            AND created_at > NOW() - INTERVAL '24 hours'
          ORDER BY created_at DESC
          LIMIT 30
        `);
        recentEvents = eventsResult.rows.map(snakeToCamel);
      } catch {}

      res.json({ totalBackupServed, byFeatureType, recentEvents });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/substitute-routing", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let events: any[] = [];
      let totalSubstitutes = 0;

      try {
        const result = await pool.query(`
          SELECT id, product_type, product_id, delivered_tier, substitute_id, created_at
          FROM orchestrator_routing_decisions
          WHERE delivered_tier = 'substitute_equivalent'
            AND created_at > NOW() - INTERVAL '24 hours'
          ORDER BY created_at DESC
          LIMIT 50
        `);
        events = result.rows.map(snakeToCamel);
        totalSubstitutes = events.length;
      } catch {}

      try {
        const countResult = await pool.query(`
          SELECT COUNT(*)::int as cnt
          FROM orchestrator_routing_decisions
          WHERE delivered_tier = 'substitute_equivalent'
            AND created_at > NOW() - INTERVAL '24 hours'
        `);
        totalSubstitutes = countResult.rows[0]?.cnt || totalSubstitutes;
      } catch {}

      res.json({ totalSubstitutes, events });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/missing-backups", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let missingBackups: any[] = [];

      try {
        const result = await pool.query(`
          SELECT ba.id, ba.content_id, ba.content_type, ba.status, ba.error_message, ba.generated_at
          FROM backup_artifacts ba
          WHERE ba.status = 'failed' OR ba.status = 'missing'
          ORDER BY ba.generated_at DESC NULLS LAST
          LIMIT 50
        `);
        missingBackups = result.rows.map(snakeToCamel);
      } catch {}

      if (missingBackups.length === 0) {
        try {
          const result = await pool.query(`
            SELECT ci.id as content_id, ci.type as content_type, ci.title, ci.status
            FROM content_items ci
            LEFT JOIN content_snapshots cs ON cs.content_id = ci.id AND cs.is_last_known_good = true
            WHERE ci.status = 'published' AND cs.id IS NULL
            ORDER BY ci.updated_at DESC
            LIMIT 50
          `);
          missingBackups = result.rows.map(r => snakeToCamel({
            ...r,
            status: "no_snapshot",
            error_message: "Published content has no last-known-good snapshot",
          }));
        } catch {}
      }

      res.json({ missingBackups, total: missingBackups.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/top-failing-content", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let topFailing: any[] = [];

      try {
        const result = await pool.query(`
          SELECT cq.content_id, cq.content_type, COUNT(*)::int as failure_count,
                 MAX(cq.created_at) as last_occurrence,
                 COALESCE((
                   SELECT COUNT(DISTINCT up.user_id)::int
                   FROM user_progress up
                   WHERE up.lesson_id = cq.content_id
                 ), 0) as impacted_users
          FROM content_quarantine cq
          WHERE cq.created_at > NOW() - INTERVAL '7 days'
          GROUP BY cq.content_id, cq.content_type
          ORDER BY failure_count DESC
          LIMIT 20
        `);
        topFailing = result.rows.map(snakeToCamel);
      } catch {}

      if (topFailing.length === 0) {
        try {
          const result = await pool.query(`
            SELECT content_id, content_type, COUNT(*)::int as failure_count,
                   MAX(created_at) as last_occurrence
            FROM content_validation_results
            WHERE valid = false AND created_at > NOW() - INTERVAL '7 days'
            GROUP BY content_id, content_type
            ORDER BY failure_count DESC
            LIMIT 20
          `);
          topFailing = result.rows.map(snakeToCamel);
        } catch {}
      }

      res.json({ topFailing, total: topFailing.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/alerts", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      let alerts: any[] = [];
      let total = 0;

      try {
        const result = await pool.query(`
          SELECT id, alert_type, severity, message, metadata, acknowledged, created_at
          FROM reliability_alerts
          ORDER BY created_at DESC
          LIMIT 100
        `);
        alerts = result.rows.map(snakeToCamel);
        total = alerts.length;
      } catch {}

      res.json({ alerts, total });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/alert-thresholds", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { getAlertThresholds } = await import("./alerting-engine");
      res.json({ thresholds: getAlertThresholds() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/reliability/alert-thresholds", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperAdmin(admin, res)) return;

      const updates = req.body;
      const { setAlertThresholds } = await import("./alerting-engine");
      const newThresholds = await setAlertThresholds(updates, pool);

      await logOperatorAction({
        req, actor: admin, action: "reliability_update_alert_thresholds",
        actionCategory: "reliability", entityType: "alert_config",
        reason: "Alert thresholds updated via reliability dashboard",
        afterState: newThresholds,
      });

      res.json({ success: true, thresholds: newThresholds });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/swap-substitute", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperAdmin(admin, res)) return;

      const { contentId, substituteId } = req.body;
      if (!contentId) {
        return res.status(400).json({ error: "contentId is required" });
      }

      if (substituteId) {
        await pool.query(
          `UPDATE content_items SET content = (SELECT content FROM content_items WHERE id = $1), updated_at = NOW() WHERE id = $2`,
          [substituteId, contentId]
        );
      } else {
        await pool.query(
          `INSERT INTO content_quarantine (id, content_id, content_type, reason, triggered_by, created_at)
           VALUES (gen_random_uuid(), $1, 'content', 'swapped_to_substitute', 'admin', NOW())
           ON CONFLICT DO NOTHING`,
          [contentId]
        );
      }

      await logOperatorAction({
        req, actor: admin, action: "reliability_swap_substitute",
        actionCategory: "reliability", entityType: "content",
        entityId: contentId, reason: "Swapped to substitute resource via reliability dashboard",
        afterState: { substituteId },
      });

      res.json({ success: true, action: "swap_substitute", contentId, substituteId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/revalidate-content", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperAdmin(admin, res)) return;

      const { contentId } = req.body;
      if (!contentId) {
        return res.status(400).json({ error: "contentId is required" });
      }

      let validationResult: any = null;
      try {
        const { validateForPublish } = await import("./content-integrity-validation");
        const content = await pool.query(`SELECT * FROM content_items WHERE id = $1`, [contentId]);
        const row = content.rows[0];
        if (row) {
          const contentType = String(row.type ?? "lesson");
          validationResult = validateForPublish(contentType, row);
        }
      } catch (e: any) {
        console.warn("[ReliabilityDashboard] Validation module unavailable:", e.message);
      }

      await pool.query(
        `DELETE FROM content_quarantine WHERE content_id = $1`,
        [contentId]
      );

      await logOperatorAction({
        req, actor: admin, action: "reliability_revalidate_content",
        actionCategory: "reliability", entityType: "content",
        entityId: contentId, reason: "Content revalidated via reliability dashboard",
        afterState: { validationResult },
      });

      res.json({ success: true, action: "revalidate_content", contentId, validationResult });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/mark-incident-resolved", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      if (!requireSuperAdmin(admin, res)) return;

      const { incidentId } = req.body;
      if (!incidentId) {
        return res.status(400).json({ error: "incidentId is required" });
      }

      try {
        const { resolveIncident } = await import("./incident-monitor");
        resolveIncident(incidentId, admin.username || admin.id || "admin", "Resolved via reliability dashboard");
      } catch (e: any) {
        console.warn("[ReliabilityDashboard] In-memory incident resolution skipped:", e.message);
      }

      await pool.query(
        `UPDATE incidents SET status = 'resolved', resolved_at = NOW() WHERE id = $1 OR incident_id = $1`,
        [incidentId]
      );

      await logOperatorAction({
        req, actor: admin, action: "reliability_mark_incident_resolved",
        actionCategory: "reliability", entityType: "incident",
        entityId: incidentId, reason: "Incident marked resolved via reliability dashboard",
      });

      res.json({ success: true, action: "mark_incident_resolved", incidentId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/reliability/actions/acknowledge-alert", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { alertId } = req.body;
      if (!alertId) {
        return res.status(400).json({ error: "alertId is required" });
      }

      await pool.query(
        `UPDATE reliability_alerts SET acknowledged = true WHERE id = $1`,
        [alertId]
      );

      res.json({ success: true, action: "acknowledge_alert", alertId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/reliability/download-report", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
      const report: any = {
        generatedAt: new Date().toISOString(),
        generatedBy: admin.username || admin.id,
      };

      let failingRouteCount = 0;
      const routesList: any[] = [];
      for (const [path, data] of routeErrorCounts.entries()) {
        const recent = data.statuses.filter(s => s.timestamp > cutoff24h);
        if (recent.length > 0) {
          failingRouteCount++;
          routesList.push({ path, errors24h: recent.length, lastSeen: new Date(data.lastSeen).toISOString() });
        }
      }
      report.failingRoutes = { count: failingRouteCount, routes: routesList };

      const recentFallbacks = fallbackEvents.filter(e => e.timestamp > cutoff24h);
      report.fallbackUsage = { count: recentFallbacks.length };

      const recentProvisional = provisionalAccessEvents.filter(e => e.timestamp > cutoff24h);
      report.provisionalAccess = { count: recentProvisional.length, uniqueUsers: new Set(recentProvisional.map(e => e.userId)).size };

      try {
        const qr = await pool.query("SELECT COUNT(*)::int as cnt FROM content_quarantine WHERE resolved_at IS NULL");
        report.quarantinedContent = { count: qr.rows[0]?.cnt || 0 };
      } catch { report.quarantinedContent = { count: 0 }; }

      try {
        const vr = await pool.query(
          "SELECT COUNT(*)::int as cnt FROM content_validation_results WHERE valid = false AND created_at > NOW() - INTERVAL '24 hours'"
        );
        report.validationFailures = { count: vr.rows[0]?.cnt || 0 };
      } catch { report.validationFailures = { count: 0 }; }

      try {
        const mr = await pool.query(`
          SELECT COUNT(*)::int as cnt FROM users
          WHERE (tier IN ('rpn','rn','np','allied','imaging','new_grad_toolkit','certification_prep','full_access')
                 AND (subscription_status IS NULL OR subscription_status NOT IN ('active','trialing')))
             OR (subscription_status = 'active' AND (tier IS NULL OR tier = 'free'))
        `);
        report.entitlementMismatches = { count: mr.rows[0]?.cnt || 0 };
      } catch { report.entitlementMismatches = { count: 0 }; }

      try {
        const ar = await pool.query(`
          SELECT id, alert_type, severity, message, created_at
          FROM reliability_alerts
          WHERE created_at > NOW() - INTERVAL '24 hours'
          ORDER BY created_at DESC
        `);
        report.recentAlerts = ar.rows.map(snakeToCamel);
      } catch { report.recentAlerts = []; }

      let activeIncidents: any[] = [];
      try { activeIncidents = getActiveIncidents(); } catch {}
      report.activeIncidents = activeIncidents;

      await logOperatorAction({
        req, actor: admin, action: "reliability_download_report",
        actionCategory: "reliability", entityType: "report",
        reason: "Downloaded failure report via reliability dashboard",
      });

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="reliability-report-${new Date().toISOString().slice(0, 10)}.json"`);
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
