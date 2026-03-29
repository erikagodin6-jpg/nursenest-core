import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { getNotificationSettings, saveNotificationSettings, sendTestNotification } from "./admin-notifications";

const VALID_CHANNELS = ["email", "sms"] as const;
const SETTINGS_BOOLEAN_KEYS = [
  "emailEnabled", "smsEnabled",
  "notifyOnNewSubscription", "notifyOnCancellation",
  "notifyOnPaymentFailed", "notifyOnLifetimePurchase", "notifyOnTrialStart",
  "notifyOnCriticalIncident", "notifyOnWarningIncident"
] as const;

export function registerNotificationRoutes(app: Express, pool: any) {
  app.get("/api/admin/notifications/settings", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const settings = await getNotificationSettings(pool);
      res.json(settings);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/notifications/settings", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const sanitized: Record<string, any> = {};
      for (const key of SETTINGS_BOOLEAN_KEYS) {
        if (key in req.body && typeof req.body[key] === "boolean") {
          sanitized[key] = req.body[key];
        }
      }
      if (req.body.adminEmail && typeof req.body.adminEmail === "string") {
        sanitized.adminEmail = req.body.adminEmail.trim().slice(0, 200);
      }
      if (req.body.adminPhone && typeof req.body.adminPhone === "string") {
        sanitized.adminPhone = req.body.adminPhone.trim().slice(0, 30);
      }
      const updated = await saveNotificationSettings(pool, sanitized);
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/notifications/test", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { channel } = req.body;
      if (channel && !VALID_CHANNELS.includes(channel)) {
        return res.status(400).json({ error: "Invalid channel. Use 'email' or 'sms'." });
      }
      const result = await sendTestNotification(pool, channel);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/notifications/log", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 200);
      const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);
      const result = await pool.query(
        `SELECT id, event_type, channel, recipient, subject, status, error_message, stripe_event_id, created_at
         FROM notification_log ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM notification_log`);
      res.json({ items: result.rows, total: countResult.rows[0].total });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
