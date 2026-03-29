import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import rateLimit from "express-rate-limit";

const ALLOWED_REV_EVENT_TYPES = new Set([
  "failed_checkout", "blocked_premium_access", "subscription_extended",
  "access_granted", "recovery_message_sent", "payment_declined",
  "entitlement_mismatch", "churn_signal", "refund_requested",
]);

function sanitizeStr(val: any, maxLen = 200): string | null {
  if (typeof val !== "string") return null;
  return val.slice(0, maxLen).replace(/[<>]/g, "");
}

async function ensureRevenueProtectionTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS revenue_protection_events (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR,
        username TEXT,
        event_type TEXT NOT NULL,
        severity TEXT DEFAULT 'medium',
        details JSONB DEFAULT '{}',
        resolved BOOLEAN DEFAULT false,
        resolved_by TEXT,
        resolved_at TIMESTAMP,
        action_taken TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rev_prot_user ON revenue_protection_events(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rev_prot_type ON revenue_protection_events(event_type)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rev_prot_resolved ON revenue_protection_events(resolved)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rev_prot_created ON revenue_protection_events(created_at)`);
  } catch (e: any) {
    console.error("[RevenueProtection] Table init error:", e.message);
  }
}

export function registerRevenueProtectionRoutes(app: Express) {
  ensureRevenueProtectionTables().catch(() => {});

  app.get("/api/admin/revenue-protection/dashboard", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const days = Math.max(1, Math.min(90, Math.floor(Number(req.query.days || 30))));
      const cutoff = `NOW() - INTERVAL '${days} days'`;

      const [
        failedCheckouts,
        paidNoAccess,
        fallbackHeavyUsers,
        churnRiskSignals,
        blockedPremiumAttempts,
        recentEvents,
        summaryStats,
        eventsByType,
      ] = await Promise.all([
        pool.query(`
          SELECT rpe.user_id, rpe.username, rpe.details, rpe.created_at,
            COUNT(*)::int OVER (PARTITION BY rpe.user_id) as total_failures
          FROM revenue_protection_events rpe
          WHERE rpe.event_type = 'failed_checkout' AND rpe.created_at > ${cutoff}
          ORDER BY rpe.created_at DESC LIMIT 50
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT u.id as user_id, u.username, u.tier, u.subscription_status,
            u.stripe_subscription_id, u.plan_expires_at
          FROM users u
          WHERE u.subscription_status = 'active'
            AND (u.tier IS NULL OR u.tier = 'free')
            AND u.stripe_subscription_id IS NOT NULL
          LIMIT 50
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT te.user_id, COUNT(*)::int as fallback_count,
            COUNT(DISTINCT te.event_data->>'fallbackType')::int as unique_fallback_types
          FROM telemetry_events te
          WHERE te.event_type = 'fallback_used' AND te.created_at > ${cutoff} AND te.user_id IS NOT NULL
          GROUP BY te.user_id
          HAVING COUNT(*) >= 5
          ORDER BY fallback_count DESC LIMIT 30
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT u.id as user_id, u.username, u.tier, u.subscription_status,
            u.plan_expires_at,
            CASE
              WHEN u.plan_expires_at < NOW() + INTERVAL '7 days' AND u.plan_expires_at > NOW() THEN 'expiring_soon'
              WHEN u.plan_expires_at < NOW() THEN 'expired'
              ELSE 'active'
            END as risk_signal,
            (SELECT COUNT(*)::int FROM telemetry_events te
              WHERE te.user_id = u.id AND te.event_category = 'error'
              AND te.created_at > ${cutoff}) as recent_errors
          FROM users u
          WHERE u.tier NOT IN ('free', 'admin')
            AND u.subscription_status IN ('active', 'past_due', 'trialing')
            AND (
              u.plan_expires_at < NOW() + INTERVAL '7 days'
              OR u.subscription_status = 'past_due'
            )
          ORDER BY u.plan_expires_at ASC LIMIT 50
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT rpe.user_id, rpe.username, rpe.details, rpe.created_at
          FROM revenue_protection_events rpe
          WHERE rpe.event_type = 'blocked_premium_access' AND rpe.created_at > ${cutoff}
          ORDER BY rpe.created_at DESC LIMIT 50
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT id, user_id, username, event_type, severity, details, resolved,
            resolved_by, action_taken, created_at
          FROM revenue_protection_events
          WHERE created_at > ${cutoff}
          ORDER BY created_at DESC LIMIT 100
        `).catch(() => ({ rows: [] })),

        pool.query(`
          SELECT
            COUNT(*)::int as total_events,
            COUNT(CASE WHEN resolved = true THEN 1 END)::int as resolved_events,
            COUNT(CASE WHEN resolved = false THEN 1 END)::int as unresolved_events,
            COUNT(CASE WHEN severity = 'critical' THEN 1 END)::int as critical_count,
            COUNT(CASE WHEN severity = 'high' THEN 1 END)::int as high_count,
            COUNT(CASE WHEN event_type = 'failed_checkout' THEN 1 END)::int as failed_checkouts,
            COUNT(CASE WHEN event_type = 'blocked_premium_access' THEN 1 END)::int as blocked_access,
            COUNT(DISTINCT user_id)::int as affected_users
          FROM revenue_protection_events WHERE created_at > ${cutoff}
        `).catch(() => ({ rows: [{}] })),

        pool.query(`
          SELECT event_type, COUNT(*)::int as count,
            COUNT(CASE WHEN resolved = false THEN 1 END)::int as unresolved
          FROM revenue_protection_events WHERE created_at > ${cutoff}
          GROUP BY event_type ORDER BY count DESC
        `).catch(() => ({ rows: [] })),
      ]);

      res.json({
        period: { days },
        summary: summaryStats.rows[0] || {},
        failedCheckouts: failedCheckouts.rows,
        paidNoAccess: paidNoAccess.rows,
        fallbackHeavyUsers: fallbackHeavyUsers.rows,
        churnRiskSignals: churnRiskSignals.rows,
        blockedPremiumAttempts: blockedPremiumAttempts.rows,
        recentEvents: recentEvents.rows,
        eventsByType: eventsByType.rows,
      });
    } catch (e: any) {
      console.error("[RevenueProtection] Dashboard error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/revenue-protection/event", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { userId, username, eventType, severity, details } = req.body;
      if (!eventType) {
        return res.status(400).json({ error: "eventType is required" });
      }
      const result = await pool.query(
        `INSERT INTO revenue_protection_events (id, user_id, username, event_type, severity, details, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [userId || null, username || null, eventType, severity || "medium", JSON.stringify(details || {})]
      );
      res.status(201).json(result.rows[0]);
    } catch (e: any) {
      console.error("[RevenueProtection] Event create error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/revenue-protection/extend-subscription", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { userId, extensionDays, reason } = req.body;
      if (!userId || !extensionDays) {
        return res.status(400).json({ error: "userId and extensionDays are required" });
      }

      const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentExpiry = user.rows[0].plan_expires_at ? new Date(user.rows[0].plan_expires_at) : new Date();
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      const newExpiry = new Date(baseDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);

      await pool.query(
        `UPDATE users SET plan_expires_at = $1, subscription_status = 'active' WHERE id = $2`,
        [newExpiry, userId]
      );

      await pool.query(
        `INSERT INTO revenue_protection_events (id, user_id, username, event_type, severity, details, resolved, resolved_by, resolved_at, action_taken, created_at)
         VALUES (gen_random_uuid(), $1, $2, 'subscription_extended', 'info', $3, true, $4, NOW(), $5, NOW())`,
        [userId, user.rows[0].username, JSON.stringify({ extensionDays, reason, previousExpiry: user.rows[0].plan_expires_at, newExpiry }), (admin as any).username || "admin", `Extended subscription by ${extensionDays} days`]
      );

      await pool.query(
        `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, severity, created_at)
         VALUES (gen_random_uuid(), $1, $2, 'user', $3, 'subscription_extended', $4, 'info', NOW())`,
        [(admin as any).id, (admin as any).username, userId, JSON.stringify({ extensionDays, reason, newExpiry })]
      );

      res.json({ success: true, newExpiry, extensionDays });
    } catch (e: any) {
      console.error("[RevenueProtection] Extend subscription error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/revenue-protection/grant-access", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { userId, tier, durationDays, reason } = req.body;
      if (!userId || !tier) {
        return res.status(400).json({ error: "userId and tier are required" });
      }

      const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const previousTier = user.rows[0].tier;
      const expiry = durationDays
        ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        : null;

      const updateFields: string[] = [`tier = $1`];
      const params: any[] = [tier];
      let paramIdx = 2;

      if (expiry) {
        updateFields.push(`plan_expires_at = $${paramIdx++}`);
        params.push(expiry);
      }
      updateFields.push(`subscription_status = 'active'`);
      params.push(userId);

      await pool.query(
        `UPDATE users SET ${updateFields.join(", ")} WHERE id = $${paramIdx}`,
        params
      );

      await pool.query(
        `INSERT INTO revenue_protection_events (id, user_id, username, event_type, severity, details, resolved, resolved_by, resolved_at, action_taken, created_at)
         VALUES (gen_random_uuid(), $1, $2, 'access_granted', 'info', $3, true, $4, NOW(), $5, NOW())`,
        [userId, user.rows[0].username, JSON.stringify({ tier, durationDays, reason, previousTier, expiry }), (admin as any).username || "admin", `Granted ${tier} access${durationDays ? ` for ${durationDays} days` : " indefinitely"}`]
      );

      await pool.query(
        `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, before_json, after_json, severity, created_at)
         VALUES (gen_random_uuid(), $1, $2, 'user', $3, 'access_granted', $4, $5, 'info', NOW())`,
        [(admin as any).id, (admin as any).username, userId, JSON.stringify({ tier: previousTier }), JSON.stringify({ tier, durationDays, reason })]
      );

      res.json({ success: true, tier, expiry, durationDays });
    } catch (e: any) {
      console.error("[RevenueProtection] Grant access error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/revenue-protection/send-recovery", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { userId, messageType, customMessage } = req.body;
      if (!userId || !messageType) {
        return res.status(400).json({ error: "userId and messageType are required" });
      }

      const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const templates: Record<string, { subject: string; body: string }> = {
        payment_failed: {
          subject: "Action needed: Update your payment method",
          body: `Hi ${user.rows[0].username},\n\nWe noticed your recent payment didn't go through. Please update your payment method to continue enjoying your premium access.\n\nIf you need any help, just reply to this email.\n\nBest,\nThe NurseNest Team`,
        },
        access_issue: {
          subject: "We're here to help with your access",
          body: `Hi ${user.rows[0].username},\n\nWe noticed you may be having trouble accessing some premium features. We've looked into this and want to make sure everything is working perfectly for you.\n\nPlease don't hesitate to reach out if you need any assistance.\n\nBest,\nThe NurseNest Team`,
        },
        churn_prevention: {
          subject: "We miss you! Here's what's new",
          body: `Hi ${user.rows[0].username},\n\nWe noticed it's been a while since your last visit. We've added some great new study materials and features that we think you'll love.\n\nCome back and check them out!\n\nBest,\nThe NurseNest Team`,
        },
        custom: {
          subject: "Message from NurseNest",
          body: customMessage || "We wanted to reach out to you.",
        },
      };

      const template = templates[messageType] || templates.custom;
      let emailSent = false;

      if (user.rows[0].email) {
        try {
          const { getResendClient } = await import("./resend-client");
          const { client, fromEmail } = await getResendClient();
          await client.emails.send({
            from: fromEmail || "NurseNest <noreply@nursenest.ca>",
            to: user.rows[0].email,
            subject: template.subject,
            text: template.body,
          });
          emailSent = true;
        } catch (emailErr: any) {
          console.error("[RevenueProtection] Email send failed:", emailErr.message);
        }
      }

      await pool.query(
        `INSERT INTO revenue_protection_events (id, user_id, username, event_type, severity, details, resolved, resolved_by, resolved_at, action_taken, created_at)
         VALUES (gen_random_uuid(), $1, $2, 'recovery_message_sent', 'info', $3, true, $4, NOW(), $5, NOW())`,
        [userId, user.rows[0].username, JSON.stringify({ messageType, emailSent, hasEmail: !!user.rows[0].email }), (admin as any).username || "admin", `Sent ${messageType} recovery message${emailSent ? " (email delivered)" : " (no email on file)"}`]
      );

      res.json({ success: true, emailSent, messageType });
    } catch (e: any) {
      console.error("[RevenueProtection] Send recovery error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/revenue-protection/resolve/:eventId", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { eventId } = req.params;
      const { actionTaken } = req.body;

      const result = await pool.query(
        `UPDATE revenue_protection_events
         SET resolved = true, resolved_by = $1, resolved_at = NOW(), action_taken = $2
         WHERE id = $3 RETURNING *`,
        [(admin as any).username || "admin", actionTaken || "Manually resolved", eventId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(result.rows[0]);
    } catch (e: any) {
      console.error("[RevenueProtection] Resolve error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  const revTrackLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: "Too many revenue tracking requests" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post("/api/revenue-protection/track", revTrackLimiter, async (req, res) => {
    try {
      const userId = sanitizeStr(req.body.userId, 100);
      const username = sanitizeStr(req.body.username, 100);
      const eventType = sanitizeStr(req.body.eventType, 50);
      const severity = sanitizeStr(req.body.severity, 20);
      if (!eventType) {
        return res.status(400).json({ error: "eventType is required" });
      }
      if (!ALLOWED_REV_EVENT_TYPES.has(eventType)) {
        return res.status(400).json({ error: "Invalid eventType" });
      }
      const safeSeverity = ["low", "medium", "high", "critical"].includes(severity || "") ? severity : "medium";
      const details = req.body.details && typeof req.body.details === "object" ? req.body.details : {};
      await pool.query(
        `INSERT INTO revenue_protection_events (id, user_id, username, event_type, severity, details, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
        [userId || null, username || null, eventType, safeSeverity, JSON.stringify(details)]
      );
      res.status(201).json({ success: true });
    } catch (e: any) {
      console.error("[RevenueProtection] Track error:", e.message);
      res.status(500).json({ error: "Failed to track event" });
    }
  });
}
