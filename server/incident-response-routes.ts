import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export function registerIncidentResponseRoutes(app: Express) {
  app.get("/api/admin/incident-response/overview", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [incidentsResult, provisionalResult, checkpointsResult] = await Promise.all([
        pool.query(
          `SELECT * FROM platform_incidents
           WHERE created_at > NOW() - INTERVAL '24 hours'
           ORDER BY created_at DESC LIMIT 100`
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT * FROM provisional_access_grants
           WHERE revoked_at IS NULL AND expires_at > NOW()
           ORDER BY granted_at DESC LIMIT 50`
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT session_type, COUNT(*)::int AS count
           FROM session_checkpoints
           WHERE updated_at > NOW() - INTERVAL '1 hour'
           GROUP BY session_type`
        ).catch(() => ({ rows: [] })),
      ]);

      const incidents = incidentsResult.rows;
      const severityCounts = {
        critical: incidents.filter((i: any) => i.severity === "critical").length,
        warning: incidents.filter((i: any) => i.severity === "warning").length,
        info: incidents.filter((i: any) => i.severity === "info").length,
      };

      const routeBreakdown: Record<string, number> = {};
      for (const inc of incidents) {
        const route = (inc as any).route || "unknown";
        routeBreakdown[route] = (routeBreakdown[route] || 0) + 1;
      }
      const failingRoutes = Object.entries(routeBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([route, count]) => ({ route, count }));

      const typeBreakdown: Record<string, number> = {};
      for (const inc of incidents) {
        const type = (inc as any).type || "unknown";
        typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
      }

      res.json({
        summary: {
          totalIncidents24h: incidents.length,
          severityCounts,
          activeProvisionalGrants: provisionalResult.rows.length,
          activeCheckpoints: checkpointsResult.rows,
        },
        failingRoutes,
        typeBreakdown,
        recentIncidents: incidents.slice(0, 50).map((i: any) => ({
          id: i.id,
          incidentId: i.incident_id,
          type: i.type,
          severity: i.severity,
          userId: i.user_id,
          route: i.route,
          message: i.message,
          resolvedAt: i.resolved_at,
          createdAt: i.created_at,
        })),
        provisionalAccessUsers: provisionalResult.rows.map((g: any) => ({
          id: g.id,
          userId: g.user_id,
          reason: g.reason,
          grantedAt: g.granted_at,
          expiresAt: g.expires_at,
          grantedBy: g.granted_by,
        })),
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/incident-response/incidents", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const severity = req.query.severity as string;
      const type = req.query.type as string;

      let query = `SELECT * FROM platform_incidents WHERE 1=1`;
      const params: any[] = [];
      let idx = 1;

      if (severity) {
        query += ` AND severity = $${idx}`;
        params.push(severity);
        idx++;
      }
      if (type) {
        query += ` AND type = $${idx}`;
        params.push(type);
        idx++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx}`;
      params.push(limit);

      const result = await pool.query(query, params);
      res.json({ incidents: result.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/incident-response/resolve/:incidentId", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      await pool.query(
        `UPDATE platform_incidents SET resolved_at = NOW() WHERE incident_id = $1`,
        [req.params.incidentId]
      );
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/incident-response/provisional-access", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT pag.*, u.username, u.email, u.tier, u.subscription_status
         FROM provisional_access_grants pag
         LEFT JOIN users u ON u.id = pag.user_id
         ORDER BY pag.granted_at DESC LIMIT 100`
      );

      res.json({
        grants: result.rows.map((r: any) => ({
          id: r.id,
          userId: r.user_id,
          username: r.username,
          email: r.email,
          userTier: r.tier,
          subscriptionStatus: r.subscription_status,
          reason: r.reason,
          grantedAt: r.granted_at,
          expiresAt: r.expires_at,
          revokedAt: r.revoked_at,
          grantedBy: r.granted_by,
        })),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/incident-response/grant-access", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { userId, reason, durationHours } = req.body;
      if (!userId || !reason) {
        return res.status(400).json({ error: "userId and reason required" });
      }

      const hours = durationHours || 24;
      await pool.query(
        `INSERT INTO provisional_access_grants (user_id, reason, expires_at, granted_by)
         VALUES ($1, $2, NOW() + INTERVAL '1 hour' * $3, $4)`,
        [userId, reason, hours, (admin as any).username || "admin"]
      );

      try {
        const { grantProvisionalAccess } = await import("./platform-resilience");
        grantProvisionalAccess(userId, reason);
      } catch {}

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/incident-response/revoke-access/:grantId", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      await pool.query(
        `UPDATE provisional_access_grants SET revoked_at = NOW() WHERE id = $1`,
        [req.params.grantId]
      );
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/incident-response/extend-subscription", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { userId, days } = req.body;
      if (!userId || !days) {
        return res.status(400).json({ error: "userId and days required" });
      }

      await pool.query(
        `UPDATE users SET plan_expires_at = COALESCE(plan_expires_at, NOW()) + INTERVAL '1 day' * $2 WHERE id = $1`,
        [userId, days]
      );

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/incident-response/replay-billing-sync", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      const userResult = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [userId]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userResult.rows[0];
      if (!user.stripe_customer_id) {
        return res.status(400).json({ error: "User has no Stripe customer ID" });
      }

      try {
        const { getUncachableStripeClient } = await import("./stripeClient");
        const stripe = await getUncachableStripeClient();

        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripe_customer_id,
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const sub = subscriptions.data[0];
          const status = sub.status;
          let tier = user.tier;

          if (status === "active" || status === "trialing") {
            if (tier === "free") tier = "rpn";
          }

          await pool.query(
            `UPDATE users SET subscription_status = $2, tier = $3, stripe_subscription_id = $4 WHERE id = $1`,
            [userId, status, tier, sub.id]
          );

          res.json({ success: true, syncedStatus: status, syncedTier: tier });
        } else {
          res.json({ success: true, message: "No active subscriptions found" });
        }
      } catch (stripeErr: any) {
        res.status(500).json({ error: `Stripe sync failed: ${stripeErr.message}` });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/incident-response/entitlement-mismatches", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT id, username, email, tier, subscription_status, stripe_customer_id, stripe_subscription_id
         FROM users
         WHERE (subscription_status = 'active' AND tier = 'free')
            OR (subscription_status IN ('past_due', 'unpaid') AND tier != 'free')
            OR (stripe_subscription_id IS NOT NULL AND subscription_status IS NULL)
         LIMIT 100`
      );

      res.json({
        mismatches: result.rows.map((r: any) => ({
          userId: r.id,
          username: r.username,
          email: r.email,
          tier: r.tier,
          subscriptionStatus: r.subscription_status,
          hasStripeCustomer: !!r.stripe_customer_id,
          hasStripeSubscription: !!r.stripe_subscription_id,
        })),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
