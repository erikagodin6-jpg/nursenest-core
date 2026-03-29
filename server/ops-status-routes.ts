import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export function registerOpsStatusRoutes(app: Express) {
  app.get("/api/admin/ops/status", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const {
        getCircuitBreakerStates,
        getFeatureFlags,
        getKillSwitches,
        getEmergencyModeStatus,
        getMinimalCoreStatus,
        getErrorBudgets,
        getCacheWarmStatus,
        getProvisionalAccessGrants,
        getSelfHealingLog,
        getResilienceEvents,
        getLastHealthResults,
        runHealthChecks,
        isFeatureEnabled,
      } = await import("./platform-resilience");

      const healthResults = getLastHealthResults().length > 0
        ? getLastHealthResults()
        : await runHealthChecks();

      const emergencyMode = getEmergencyModeStatus();
      const minimalCore = getMinimalCoreStatus();
      const featureFlags = getFeatureFlags();
      const killSwitches = getKillSwitches();
      const circuitBreakers = getCircuitBreakerStates();
      const errorBudgets = getErrorBudgets();
      const events = getResilienceEvents(100);

      let examHealth: any = null;
      try {
        const { checkPoolHealth, getQuarantinedCount } = await import("./exam-reliability");
        const tiers = ["rpn", "rn", "np"];
        const tierHealth: Record<string, any> = {};
        for (const tier of tiers) {
          tierHealth[tier] = await checkPoolHealth(tier);
        }
        const quarantinedCount = await getQuarantinedCount();
        examHealth = { tiers: tierHealth, quarantinedCount };
      } catch {}

      let backupStatus: any = null;
      try {
        const fs = await import("fs");
        const path = await import("path");
        const backupsDir = path.default.join(process.cwd(), "backups");
        if (fs.default.existsSync(backupsDir)) {
          const dirs = ["db", "content", "stripe", "object-storage", "code"];
          const components: Record<string, any> = {};
          for (const dir of dirs) {
            const dirPath = path.default.join(backupsDir, dir);
            if (fs.default.existsSync(dirPath)) {
              const entries = fs.default.readdirSync(dirPath);
              components[dir] = { exists: true, count: entries.length, latest: entries.sort().reverse()[0] || null };
            } else {
              components[dir] = { exists: false, count: 0 };
            }
          }
          backupStatus = { exists: true, components };
        }
      } catch {}

      let recentIncidents: any[] = [];
      try {
        const result = await pool.query(
          `SELECT id, severity, category, title, message, source, acknowledged, created_at as "createdAt"
           FROM platform_alerts
           WHERE created_at > NOW() - INTERVAL '24 hours'
           ORDER BY created_at DESC LIMIT 50`
        );
        recentIncidents = result.rows;
      } catch {
        recentIncidents = [];
      }

      let failureRates: any = {};
      try {
        const examIncidents = await pool.query(
          `SELECT reason_code, COUNT(*)::int as count
           FROM exam_incidents
           WHERE created_at > NOW() - INTERVAL '24 hours'
           GROUP BY reason_code
           ORDER BY count DESC LIMIT 10`
        ).catch(() => ({ rows: [] }));
        failureRates.examIncidents = examIncidents.rows;
      } catch {}

      let userCounts: any = {};
      try {
        const totalUsers = await pool.query(`SELECT COUNT(*)::int as count FROM users`);
        const activeUsers = await pool.query(`SELECT COUNT(*)::int as count FROM users WHERE tier != 'free' AND tier IS NOT NULL`);
        const affectedByEmergency = emergencyMode.active
          ? (await pool.query(`SELECT COUNT(*)::int as count FROM users WHERE tier != 'admin'`)).rows[0]?.count || 0
          : 0;
        userCounts = {
          total: totalUsers.rows[0]?.count || 0,
          activeSubscribers: activeUsers.rows[0]?.count || 0,
          affectedByEmergency,
        };
      } catch {}

      let entitlementIssues = 0;
      try {
        const result = await pool.query(
          `SELECT COUNT(*)::int as count FROM users
           WHERE tier != 'free' AND tier != 'admin'
           AND (subscription_status IS NULL OR subscription_status NOT IN ('active', 'trialing'))`
        );
        entitlementIssues = result.rows[0]?.count || 0;
      } catch {}

      const overallHealth = healthResults.some(r => r.status === "down")
        ? "critical"
        : healthResults.some(r => r.status === "degraded")
          ? "degraded"
          : "healthy";

      const activeKillSwitchCount = killSwitches.filter(ks => ks.active).length;
      const openBreakerCount = circuitBreakers.filter(cb => cb.state !== "closed").length;
      const disabledFlagCount = featureFlags.filter(f => {
        const effective = f.adminOverride !== null ? f.adminOverride : f.enabled;
        return !effective;
      }).length;

      res.json({
        overallHealth,
        deploymentVersion: process.env.REPL_SLUG || process.env.npm_package_version || "unknown",
        uptime: process.uptime(),
        timestamp: Date.now(),

        emergencyMode,
        minimalCore,

        healthChecks: healthResults,
        circuitBreakers,
        featureFlags: featureFlags.map(f => ({
          ...f,
          effectiveEnabled: isFeatureEnabled(f.key),
        })),
        killSwitches,
        errorBudgets,

        examHealth,
        backupStatus,
        recentIncidents,
        failureRates,
        userCounts,
        entitlementIssues,

        summary: {
          activeKillSwitches: activeKillSwitchCount,
          openBreakers: openBreakerCount,
          disabledFlags: disabledFlagCount,
          healthyServices: healthResults.filter(r => r.status === "healthy").length,
          totalServices: healthResults.length,
          recentIncidentCount: recentIncidents.length,
          unacknowledgedAlerts: recentIncidents.filter((i: any) => !i.acknowledged).length,
        },

        events: events.slice(0, 50),
        selfHealingLog: getSelfHealingLog(),
        cacheWarmStatus: getCacheWarmStatus(),
        provisionalAccess: getProvisionalAccessGrants(),
      });
    } catch (err: any) {
      console.error("[OpsStatus] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/safe-mode", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { activateEmergencyMode, deactivateEmergencyMode, getEmergencyModeStatus } = await import("./platform-resilience");
      const { logOperatorAction } = await import("./admin-auth");
      const { active, reason } = req.body;

      if (active) {
        activateEmergencyMode(reason || "ops_dashboard_activation", admin.username || admin.id);
      } else {
        deactivateEmergencyMode(admin.username || admin.id);
      }

      await logOperatorAction({
        req,
        actor: admin,
        action: active ? "safe_mode_activated" : "safe_mode_deactivated",
        actionCategory: "safe_mode",
        entityType: "platform",
        entityId: "emergency_mode",
        reason: reason || "ops_dashboard",
        confirmationRequired: true,
      });

      res.json({ success: true, emergencyMode: getEmergencyModeStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/feature-flag", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { setFeatureFlag, getFeatureFlags } = await import("./platform-resilience");
      const { logOperatorAction } = await import("./admin-auth");
      const { key, enabled, reason } = req.body;

      if (!key || typeof enabled !== "boolean") {
        return res.status(400).json({ error: "key and enabled (boolean) are required" });
      }

      setFeatureFlag(key, enabled, reason || "ops_dashboard", admin.username || admin.id);

      await logOperatorAction({
        req,
        actor: admin,
        action: "feature_flag_toggled",
        actionCategory: "feature_flag",
        entityType: "feature_flag",
        entityId: key,
        reason: reason || "ops_dashboard",
        confirmationRequired: true,
      });

      res.json({ success: true, flags: getFeatureFlags() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/kill-switch", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { activateKillSwitch, deactivateKillSwitch, getKillSwitches } = await import("./platform-resilience");
      const { logOperatorAction } = await import("./admin-auth");
      const { key, active, scope, target, reason } = req.body;

      if (!key) return res.status(400).json({ error: "key is required" });

      if (active === false) {
        deactivateKillSwitch(key);
      } else {
        activateKillSwitch(key, scope || "feature", target || key, reason || "ops_dashboard", admin.username || admin.id);
      }

      await logOperatorAction({
        req,
        actor: admin,
        action: active === false ? "kill_switch_deactivated" : "kill_switch_activated",
        actionCategory: "safe_mode",
        entityType: "kill_switch",
        entityId: key,
        reason: reason || "ops_dashboard",
        confirmationRequired: true,
      });

      res.json({ success: true, killSwitches: getKillSwitches() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/minimal-core", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { activateMinimalCore, deactivateMinimalCore, getMinimalCoreStatus } = await import("./platform-resilience");
      const { logOperatorAction } = await import("./admin-auth");
      const { active, reason } = req.body;

      if (active) {
        activateMinimalCore(reason || "ops_dashboard", admin.username || admin.id);
      } else {
        deactivateMinimalCore(admin.username || admin.id);
      }

      await logOperatorAction({
        req,
        actor: admin,
        action: active ? "minimal_core_activated" : "minimal_core_deactivated",
        actionCategory: "safe_mode",
        entityType: "platform",
        entityId: "minimal_core",
        reason: reason || "ops_dashboard",
        confirmationRequired: true,
      });

      res.json({ success: true, minimalCore: getMinimalCoreStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/reset-breaker", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { resetCircuitBreaker, getCircuitBreakerStates } = await import("./platform-resilience");
      const { logOperatorAction } = await import("./admin-auth");
      const { name } = req.body;

      if (!name) return res.status(400).json({ error: "name is required" });

      resetCircuitBreaker(name);

      await logOperatorAction({
        req,
        actor: admin,
        action: "circuit_breaker_reset",
        actionCategory: "system_config",
        entityType: "circuit_breaker",
        entityId: name,
        reason: "ops_dashboard",
      });

      res.json({ success: true, circuitBreakers: getCircuitBreakerStates() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/replay-entitlement-sync", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { clearEntitlementCache } = await import("./platform-resilience");
      const { logOperatorAction } = await import("./admin-auth");

      clearEntitlementCache();

      await logOperatorAction({
        req,
        actor: admin,
        action: "entitlement_cache_cleared",
        actionCategory: "system_config",
        entityType: "entitlement_cache",
        entityId: "all",
        reason: "ops_dashboard_replay_sync",
      });

      res.json({ success: true, message: "Entitlement cache cleared. Subscriptions will re-sync on next access." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/run-health-check", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { runHealthChecks } = await import("./platform-resilience");
      const results = await runHealthChecks();
      res.json({ success: true, results });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/ops/action/acknowledge-alert", async (req: any, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { logOperatorAction } = await import("./admin-auth");
      const { alertId } = req.body;

      if (!alertId) return res.status(400).json({ error: "alertId is required" });

      await pool.query(`UPDATE platform_alerts SET acknowledged = true WHERE id = $1`, [alertId]);

      await logOperatorAction({
        req,
        actor: admin,
        action: "alert_acknowledged",
        actionCategory: "system_config",
        entityType: "alert",
        entityId: alertId,
        reason: "ops_dashboard",
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
