import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { routeParamString } from "./route-params";
import { requireAdmin, requireAdminRole, logAuditAction } from "./admin-auth";
import type { AdminRole } from "./admin-auth";
import {
  getCircuitBreakerStates,
  getFeatureFlags,
  getKillSwitches,
  getEmergencyModeStatus,
  getProvisionalAccessGrants,
  getResilienceEvents,
  getSelfHealingLog,
  runHealthChecks,
  getLastHealthResults,
  isEmergencyMode,
  activateEmergencyMode,
  deactivateEmergencyMode,
  setFeatureFlag,
  resetFeatureErrors,
  resetCircuitBreaker,
  activateKillSwitch,
  deactivateKillSwitch,
  grantProvisionalAccess,
  clearEntitlementCache,
  isFeatureEnabled,
} from "./platform-resilience";

const OPS_ROLES: AdminRole[] = ["super_admin", "support_admin", "ops_viewer"];
const OPS_WRITE_ROLES: AdminRole[] = ["super_admin", "support_admin"];

function getActor(admin: any) {
  return { id: admin?.id || "unknown", username: admin?.username || "unknown" };
}

async function ensureAuditLogColumns(): Promise<void> {
  try {
    await pool.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS reason TEXT`);
    await pool.query(`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB`);
  } catch (e: any) {
    console.error("[OpsDashboard] Failed to ensure audit_logs columns:", e.message);
  }
}

export function registerOpsDashboardRoutes(app: Express): void {
  ensureAuditLogColumns().catch(() => {});

  app.get("/api/admin/ops/status", requireAdminRole(...OPS_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    try {
      const healthResults = await runHealthChecks();
      const circuitBreakers = getCircuitBreakerStates();
      const featureFlags = getFeatureFlags();
      const killSwitches = getKillSwitches();
      const emergencyMode = getEmergencyModeStatus();
      const provisionalAccess = getProvisionalAccessGrants();
      const events = getResilienceEvents(100);
      const selfHealingLog = getSelfHealingLog();

      const overallStatus = healthResults.some(r => r.status === "down")
        ? "down"
        : healthResults.some(r => r.status === "degraded")
          ? "degraded"
          : "healthy";

      const flagStates: Record<string, boolean> = {};
      for (const flag of featureFlags) {
        flagStates[flag.key] = isFeatureEnabled(flag.key);
      }

      let affectedUsers = 0;
      try {
        const r = await pool.query(`SELECT COUNT(*)::int AS cnt FROM users WHERE tier != 'free' AND tier != 'admin'`);
        affectedUsers = r.rows[0]?.cnt || 0;
      } catch {}

      let fallbackUsageRate = 0;
      try {
        const total = await pool.query(`SELECT COUNT(*)::int AS cnt FROM entitlement_decisions WHERE created_at > NOW() - INTERVAL '1 hour'`);
        const provisional = await pool.query(`SELECT COUNT(*)::int AS cnt FROM entitlement_decisions WHERE provisional = true AND created_at > NOW() - INTERVAL '1 hour'`);
        const totalCnt = total.rows[0]?.cnt || 0;
        const provCnt = provisional.rows[0]?.cnt || 0;
        fallbackUsageRate = totalCnt > 0 ? Math.round((provCnt / totalCnt) * 100) : 0;
      } catch {}

      res.json({
        overallStatus,
        deploymentVersion: process.env.REPL_SLUG || "dev",
        uptime: Math.round(process.uptime()),
        healthChecks: healthResults,
        circuitBreakers,
        featureFlags,
        flagStates,
        killSwitches,
        emergencyMode,
        provisionalAccess,
        events,
        selfHealingLog,
        affectedUsers,
        fallbackUsageRate,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      console.error("[OpsDashboard] Status error:", err.message);
      res.status(500).json({ error: "Failed to fetch ops status" });
    }
  });

  app.post("/api/admin/ops/emergency-mode", requireAdminRole(...OPS_WRITE_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    const { active, reason } = req.body;

    if (active) {
      activateEmergencyMode(reason || "admin_activated", admin.username || admin.id);
    } else {
      deactivateEmergencyMode(admin.username || admin.id);
    }

    await logAuditAction({
      req,
      actor: getActor(admin),
      action: active ? "emergency_mode_activate" : "emergency_mode_deactivate",
      entityType: "platform",
      entityId: "emergency_mode",
      reason: reason || "admin_action",
      metadata: { active, triggeredBy: admin.username },
    });

    res.json({ success: true, emergencyMode: getEmergencyModeStatus() });
  });

  app.post("/api/admin/ops/feature-flag/:key", requireAdminRole(...OPS_WRITE_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    const key = routeParamString(req.params.key);
    const { enabled, reason } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "enabled must be a boolean" });
    }

    const flags = getFeatureFlags();
    const before = flags.find(f => f.key === key);

    setFeatureFlag(key, enabled, reason, admin.username || admin.id);

    await logAuditAction({
      req,
      actor: getActor(admin),
      action: "feature_flag_toggle",
      entityType: "feature_flag",
      entityId: key,
      reason: reason || "admin_action",
      metadata: { enabled, previousState: before?.enabled },
      before: before ? { enabled: before.enabled, adminOverride: before.adminOverride } : null,
      after: { enabled },
    });

    res.json({ success: true });
  });

  app.post("/api/admin/ops/feature-flag/:key/reset-errors", requireAdminRole(...OPS_WRITE_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    const key = routeParamString(req.params.key);

    resetFeatureErrors(key);

    await logAuditAction({
      req,
      actor: getActor(admin),
      action: "feature_flag_reset_errors",
      entityType: "feature_flag",
      entityId: key,
      reason: "admin_reset",
    });

    res.json({ success: true });
  });

  app.post("/api/admin/ops/circuit-breaker/:name/reset", requireAdminRole(...OPS_WRITE_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    const name = routeParamString(req.params.name);

    const breakers = getCircuitBreakerStates();
    const before = breakers.find(b => b.name === name);

    resetCircuitBreaker(name);

    await logAuditAction({
      req,
      actor: getActor(admin),
      action: "circuit_breaker_reset",
      entityType: "circuit_breaker",
      entityId: name,
      reason: req.body?.reason || "admin_reset",
      metadata: { previousState: before?.state, failureCount: before?.failureCount },
    });

    res.json({ success: true });
  });

  app.post("/api/admin/ops/kill-switch", requireAdminRole(...OPS_WRITE_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    const { key, scope, target, reason, active } = req.body;

    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }

    if (active === false) {
      deactivateKillSwitch(key);
    } else {
      if (!scope || !target) {
        return res.status(400).json({ error: "scope and target are required" });
      }
      activateKillSwitch(key, scope, target, reason || "admin_action", admin.username);
    }

    await logAuditAction({
      req,
      actor: getActor(admin),
      action: active === false ? "kill_switch_deactivate" : "kill_switch_activate",
      entityType: "kill_switch",
      entityId: key,
      reason: reason || "admin_action",
      metadata: { scope, target, active },
    });

    res.json({ success: true });
  });

  app.post("/api/admin/ops/provisional-access", requireAdminRole(...OPS_WRITE_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    grantProvisionalAccess(userId, reason || "admin_grant");

    await logAuditAction({
      req,
      actor: getActor(admin),
      action: "provisional_access_grant",
      entityType: "provisional_access",
      entityId: userId,
      reason: reason || "admin_grant",
      metadata: { targetUserId: userId },
    });

    res.json({ success: true });
  });

  app.post("/api/admin/ops/clear-entitlement-cache", requireAdminRole(...OPS_WRITE_ROLES), async (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    const { userId } = req.body;

    clearEntitlementCache(userId);

    await logAuditAction({
      req,
      actor: getActor(admin),
      action: "entitlement_cache_clear",
      entityType: "entitlement_cache",
      entityId: userId || "all",
      reason: "admin_action",
      metadata: { targetUserId: userId || "all_users" },
    });

    res.json({ success: true });
  });

  app.get("/api/admin/ops/audit-log", requireAdminRole(...OPS_ROLES), async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    try {
      const result = await pool.query(
        `SELECT id, actor_id, actor_username, entity_type, entity_id, action, reason, metadata, before_json, after_json, ip_address, created_at
         FROM audit_logs
         WHERE entity_type IN ('platform', 'feature_flag', 'circuit_breaker', 'kill_switch', 'provisional_access', 'entitlement_cache', 'emergency_mode', 'alert')
         ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
      res.json({ entries: result.rows });
    } catch {
      res.json({ entries: [] });
    }
  });
}
