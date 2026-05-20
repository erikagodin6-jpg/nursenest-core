import type { Express } from "express";
import { z } from "zod";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

const VALID_ACTION_TYPES = ["extend_subscription", "grant_temporary_access", "restore_entitlement", "replay_billing_sync", "reset_exam_state", "send_backup_link", "support_note"] as const;
const VALID_TIERS = ["free", "basic", "premium", "pro", "enterprise"] as const;

const extendSubscriptionSchema = z.object({
  userId: z.string().min(1),
  days: z.coerce.number().int().min(1).max(365),
  reason: z.string().optional(),
  incidentId: z.string().optional(),
});

const grantTempAccessSchema = z.object({
  userId: z.string().min(1),
  hours: z.coerce.number().int().min(1).max(720),
  tier: z.enum(VALID_TIERS).optional(),
  reason: z.string().optional(),
  incidentId: z.string().optional(),
});

const restoreEntitlementSchema = z.object({
  userId: z.string().min(1),
  tier: z.enum(VALID_TIERS).optional(),
  reason: z.string().optional(),
  incidentId: z.string().optional(),
});

const userActionSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().optional(),
  incidentId: z.string().optional(),
});

const sendBackupLinkSchema = userActionSchema.extend({
  resourceUrl: z.string().url().optional().or(z.literal("")),
  resourceName: z.string().max(500).optional(),
});

const addSupportNoteSchema = z.object({
  userId: z.string().min(1),
  note: z.string().min(1).max(5000),
  reason: z.string().optional(),
  incidentId: z.string().optional(),
});

const bulkActionSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1).max(100),
  actionType: z.enum(VALID_ACTION_TYPES),
  actionData: z.record(z.unknown()).optional(),
  reason: z.string().optional(),
  incidentId: z.string().optional(),
});

const createTemplateSchema = z.object({
  templateKey: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(500),
  bodyEmail: z.string().min(1).max(10000),
  bodyInApp: z.string().min(1).max(5000),
  placeholders: z.array(z.string()).optional(),
});

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  subject: z.string().min(1).max(500).optional(),
  bodyEmail: z.string().min(1).max(10000).optional(),
  bodyInApp: z.string().min(1).max(5000).optional(),
  placeholders: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

function sanitizeError(e: any): string {
  if (e?.code === "23505") return "A record with this key already exists";
  if (e?.code === "23503") return "Referenced record not found";
  if (e?.code === "42P01") return "Required database table not found";
  return "An internal error occurred";
}

const DEFAULT_TEMPLATES = [
  {
    template_key: "exam_temporarily_unavailable",
    name: "Exam Temporarily Unavailable",
    subject: "Your exam access is temporarily interrupted",
    body_email: "Hi {{customer_name}},\n\nWe're aware of an issue affecting access to {{product_name}}. Our team is working to resolve this as quickly as possible.\n\nIncident Reference: {{incident_id}}\n\nYour progress has been saved and your exam time will not be affected. We expect this to be resolved within {{duration}}.\n\nThank you for your patience.",
    body_in_app: "We're aware of an issue affecting {{product_name}}. Your progress is saved and exam time is paused. Expected resolution: {{duration}}.",
    placeholders: JSON.stringify(["customer_name", "product_name", "incident_id", "duration"]),
  },
  {
    template_key: "backup_mode_active",
    name: "Backup Mode Active",
    subject: "You're now in backup study mode",
    body_email: "Hi {{customer_name}},\n\nDue to a temporary service issue, we've activated backup study mode for your account. You can continue studying with cached content.\n\nIncident Reference: {{incident_id}}\n\nAll your progress will sync once the issue is resolved. Thank you for your understanding.",
    body_in_app: "Backup study mode is active. Your progress will sync automatically once normal service resumes.",
    placeholders: JSON.stringify(["customer_name", "incident_id"]),
  },
  {
    template_key: "access_protected",
    name: "Access Protected",
    subject: "Your subscription access has been protected",
    body_email: "Hi {{customer_name}},\n\nWe experienced a brief service interruption that may have affected your access to {{product_name}}. We want you to know that your subscription access has been fully protected.\n\nNo action is needed on your part. If you experience any issues, please don't hesitate to reach out.\n\nThank you for being a valued subscriber.",
    body_in_app: "Your subscription access to {{product_name}} has been fully protected during the recent service interruption. No action needed.",
    placeholders: JSON.stringify(["customer_name", "product_name"]),
  },
  {
    template_key: "issue_resolved",
    name: "Issue Resolved",
    subject: "Service issue resolved - everything is back to normal",
    body_email: "Hi {{customer_name}},\n\nThe service issue ({{incident_id}}) that was affecting {{product_name}} has been resolved. Everything is back to normal.\n\nIf you notice anything unusual, please let us know.\n\nThank you for your patience and understanding.",
    body_in_app: "The service issue affecting {{product_name}} has been resolved. Everything is back to normal.",
    placeholders: JSON.stringify(["customer_name", "product_name", "incident_id"]),
  },
  {
    template_key: "subscription_extended",
    name: "Subscription Extended",
    subject: "We've extended your subscription",
    body_email: "Hi {{customer_name}},\n\nDue to the recent service interruption, we've extended your {{product_name}} subscription by {{extension_granted}}.\n\nYour new access extends through the additional period. No action is needed on your part.\n\nWe value your trust and apologize for any inconvenience.",
    body_in_app: "Your {{product_name}} subscription has been extended by {{extension_granted}} due to the recent service interruption.",
    placeholders: JSON.stringify(["customer_name", "product_name", "extension_granted"]),
  },
  {
    template_key: "backup_link_sent",
    name: "Backup Link Sent",
    subject: "Backup study resources available",
    body_email: "Hi {{customer_name}},\n\nWhile we resolve a temporary issue with {{product_name}}, we've prepared backup study resources for you.\n\nYou can access them to continue your study session without interruption.\n\nThank you for your understanding.",
    body_in_app: "Backup study resources are available for {{product_name}} while we resolve the current issue.",
    placeholders: JSON.stringify(["customer_name", "product_name"]),
  },
  {
    template_key: "temporary_billing_sync",
    name: "Temporary Billing Sync Issue",
    subject: "Brief billing sync delay - your access is unaffected",
    body_email: "Hi {{customer_name}},\n\nWe noticed a brief delay in our billing sync system. We want to assure you that your subscription to {{product_name}} is active and your access is completely unaffected.\n\nNo action is needed on your part. If you have any billing questions, please reach out.\n\nThank you.",
    body_in_app: "A brief billing sync delay was detected. Your subscription and access are fully active and unaffected.",
    placeholders: JSON.stringify(["customer_name", "product_name"]),
  },
  {
    template_key: "goodwill_credit_applied",
    name: "Goodwill Credit Applied",
    subject: "A credit has been applied to your account",
    body_email: "Hi {{customer_name}},\n\nAs a gesture of goodwill following the recent service interruption ({{incident_id}}), we've applied {{extension_granted}} of additional access to your {{product_name}} subscription.\n\nWe appreciate your patience and continued trust.\n\nThank you for being part of our community.",
    body_in_app: "{{extension_granted}} of additional access has been applied to your {{product_name}} subscription as a goodwill gesture.",
    placeholders: JSON.stringify(["customer_name", "product_name", "incident_id", "extension_granted"]),
  },
];

async function ensureRescueTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriber_rescue_actions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        incident_id VARCHAR,
        action_type TEXT NOT NULL,
        action_data JSONB DEFAULT '{}'::jsonb,
        performed_by VARCHAR NOT NULL,
        performed_by_username TEXT,
        reason TEXT,
        status TEXT DEFAULT 'completed',
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS communication_templates (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        template_key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        body_email TEXT NOT NULL,
        body_in_app TEXT NOT NULL,
        placeholders JSONB DEFAULT '[]'::jsonb,
        is_active BOOLEAN DEFAULT true,
        updated_by VARCHAR,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rescue_actions_user ON subscriber_rescue_actions(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_rescue_actions_incident ON subscriber_rescue_actions(incident_id)`);
  } catch (e: any) {
    console.error("[SubscriberRescue] Table creation error:", e.message);
  }
}

async function seedDefaultTemplates() {
  try {
    for (const t of DEFAULT_TEMPLATES) {
      await pool.query(
        `INSERT INTO communication_templates (template_key, name, subject, body_email, body_in_app, placeholders)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb)
         ON CONFLICT (template_key) DO NOTHING`,
        [t.template_key, t.name, t.subject, t.body_email, t.body_in_app, t.placeholders]
      );
    }
  } catch (e: any) {
    console.error("[SubscriberRescue] Template seeding error:", e.message);
  }
}

async function logRescueAction(
  userId: string,
  incidentId: string | null,
  actionType: string,
  actionData: any,
  performedBy: string,
  performedByUsername: string | null,
  reason: string | null
) {
  await pool.query(
    `INSERT INTO subscriber_rescue_actions (user_id, incident_id, action_type, action_data, performed_by, performed_by_username, reason)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)`,
    [userId, incidentId, actionType, JSON.stringify(actionData), performedBy, performedByUsername, reason]
  );
  await pool.query(
    `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, reason, severity, created_at)
     VALUES (gen_random_uuid(), $1, $2, 'subscriber_rescue', $3, $4, $5, $6, 'warning', NOW())`,
    [performedBy, performedByUsername, userId, `rescue_${actionType}`, JSON.stringify(actionData), reason]
  );
}

function renderTemplate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }
  return result;
}

export function registerSubscriberRescueRoutes(app: Express) {
  ensureRescueTables().then(() => seedDefaultTemplates());

  app.post("/api/admin/rescue/extend-subscription", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = extendSubscriptionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userId, days, reason, incidentId } = parsed.data;

      const userResult = await pool.query("SELECT id, username, tier, subscription_status FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      const extensionMs = days * 24 * 60 * 60 * 1000;
      const newExpiry = new Date(Date.now() + extensionMs);
      await pool.query(
        `UPDATE users SET plan_expires_at = GREATEST(COALESCE(plan_expires_at, NOW()), NOW()) + INTERVAL '1 day' * $1 WHERE id = $2`,
        [days, userId]
      );

      await logRescueAction(userId, incidentId || null, "extend_subscription", { days, newExpiry: newExpiry.toISOString() }, admin.id, admin.username, reason || null);
      res.json({ success: true, action: "extend_subscription", userId, days });
    } catch (e: any) {
      console.error("[SubscriberRescue] extend-subscription error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/grant-temporary-access", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = grantTempAccessSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userId, hours, tier, reason, incidentId } = parsed.data;

      const userResult = await pool.query("SELECT id, username, tier FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      await pool.query(
        `CREATE TABLE IF NOT EXISTS provisional_access_grants (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id VARCHAR NOT NULL,
          reason TEXT,
          granted_by VARCHAR,
          granted_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ,
          revoked_at TIMESTAMPTZ
        )`
      );
      await pool.query(
        `INSERT INTO provisional_access_grants (id, user_id, reason, granted_by, granted_at, expires_at)
         VALUES (gen_random_uuid(), $1, $2, $3, NOW(), $4)`,
        [userId, reason || `Temporary access for ${hours}h`, admin.id, expiresAt]
      );

      await logRescueAction(userId, incidentId || null, "grant_temporary_access", { hours, tier: tier || "current", expiresAt: expiresAt.toISOString() }, admin.id, admin.username, reason || null);
      res.json({ success: true, action: "grant_temporary_access", userId, hours, expiresAt });
    } catch (e: any) {
      console.error("[SubscriberRescue] grant-temporary-access error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/restore-entitlement", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = restoreEntitlementSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userId, tier, reason, incidentId } = parsed.data;

      const userResult = await pool.query("SELECT id, username, tier, subscription_status FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      const previousTier = userResult.rows[0].tier;
      const targetTier = tier || previousTier;

      if (targetTier !== "admin") {
        await pool.query("UPDATE users SET tier = $1, subscription_status = 'active' WHERE id = $2", [targetTier, userId]);
      }

      await logRescueAction(userId, incidentId || null, "restore_entitlement", { previousTier, restoredTier: targetTier }, admin.id, admin.username, reason || null);
      res.json({ success: true, action: "restore_entitlement", userId, previousTier, restoredTier: targetTier });
    } catch (e: any) {
      console.error("[SubscriberRescue] restore-entitlement error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/replay-billing-sync", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = userActionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userId, reason, incidentId } = parsed.data;

      const userResult = await pool.query("SELECT id, username, tier, stripe_customer_id, stripe_subscription_id FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      let clearedCache = false;
      try {
        await pool.query("DELETE FROM entitlement_cache WHERE user_id = $1", [userId]);
        clearedCache = true;
      } catch (cacheErr: any) {
        console.warn("[SubscriberRescue] entitlement_cache table may not exist:", cacheErr.message);
      }

      await logRescueAction(userId, incidentId || null, "replay_billing_sync", { clearedCache, stripeCustomerId: userResult.rows[0].stripe_customer_id }, admin.id, admin.username, reason || null);
      res.json({ success: true, action: "replay_billing_sync", userId, clearedCache });
    } catch (e: any) {
      console.error("[SubscriberRescue] replay-billing-sync error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/reset-exam-state", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = userActionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userId, reason, incidentId } = parsed.data;

      const userResult = await pool.query("SELECT id, username FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      let resetCount = 0;
      try {
        const stuckSessions = await pool.query(
          `UPDATE session_checkpoints SET status = 'reset_by_admin', updated_at = NOW()
           WHERE user_id = $1 AND status = 'active'
           RETURNING id`,
          [userId]
        );
        resetCount = stuckSessions.rows.length;
      } catch (sessErr: any) {
        console.warn("[SubscriberRescue] session_checkpoints table may not exist:", sessErr.message);
      }

      await logRescueAction(userId, incidentId || null, "reset_exam_state", { resetCount }, admin.id, admin.username, reason || null);
      res.json({ success: true, action: "reset_exam_state", userId, resetCount });
    } catch (e: any) {
      console.error("[SubscriberRescue] reset-exam-state error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/send-backup-link", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = sendBackupLinkSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userId, resourceUrl, resourceName, reason, incidentId } = parsed.data;

      const userResult = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      await logRescueAction(userId, incidentId || null, "send_backup_link", { resourceUrl: resourceUrl || "", resourceName: resourceName || "Backup Resources" }, admin.id, admin.username, reason || null);
      res.json({ success: true, action: "send_backup_link", userId, resourceUrl, resourceName });
    } catch (e: any) {
      console.error("[SubscriberRescue] send-backup-link error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/add-support-note", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = addSupportNoteSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userId, note, reason, incidentId } = parsed.data;

      const userResult = await pool.query("SELECT id, username FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      await logRescueAction(userId, incidentId || null, "support_note", { note }, admin.id, admin.username, reason || null);
      res.json({ success: true, action: "support_note", userId });
    } catch (e: any) {
      console.error("[SubscriberRescue] add-support-note error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.get("/api/admin/rescue/actions", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { userId, incidentId, limit: limitStr } = req.query;
      const limit = Math.min(Math.max(parseInt(limitStr as string) || 50, 1), 200);

      let query = `SELECT * FROM subscriber_rescue_actions WHERE 1=1`;
      const params: any[] = [];
      let idx = 1;

      if (userId && typeof userId === "string") { query += ` AND user_id = $${idx++}`; params.push(userId); }
      if (incidentId && typeof incidentId === "string") { query += ` AND incident_id = $${idx++}`; params.push(incidentId); }

      query += ` ORDER BY created_at DESC LIMIT $${idx++}`;
      params.push(limit);

      const result = await pool.query(query, params);
      res.json({ actions: result.rows, total: result.rows.length });
    } catch (e: any) {
      console.error("[SubscriberRescue] actions list error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.get("/api/admin/rescue/user/:userId", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { userId } = req.params;

      const [userResult, actionsResult, provisionalResult] = await Promise.all([
        pool.query(
          `SELECT id, username, email, tier, subscription_status, stripe_customer_id, stripe_subscription_id,
                  plan_expires_at, tester_access, tester_expiry, trial_active, trial_end, is_lifetime, created_at
           FROM users WHERE id = $1`,
          [userId]
        ),
        pool.query(
          `SELECT * FROM subscriber_rescue_actions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
          [userId]
        ),
        pool.query(
          `SELECT * FROM provisional_access_grants WHERE user_id = $1 ORDER BY granted_at DESC LIMIT 5`,
          [userId]
        ).catch(() => ({ rows: [] })),
      ]);

      if (!userResult.rows[0]) return res.status(404).json({ error: "User not found" });

      res.json({
        user: userResult.rows[0],
        rescueHistory: actionsResult.rows,
        provisionalGrants: provisionalResult.rows,
      });
    } catch (e: any) {
      console.error("[SubscriberRescue] user detail error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.get("/api/admin/rescue/templates", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query("SELECT * FROM communication_templates ORDER BY name ASC");
      res.json({ templates: result.rows });
    } catch (e: any) {
      console.error("[SubscriberRescue] templates list error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.get("/api/admin/rescue/templates/:id", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query("SELECT * FROM communication_templates WHERE id = $1", [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Template not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      console.error("[SubscriberRescue] template detail error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.put("/api/admin/rescue/templates/:id", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const parsed = updateTemplateSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { name, subject, bodyEmail, bodyInApp, placeholders, isActive } = parsed.data;

      const result = await pool.query(
        `UPDATE communication_templates
         SET name = COALESCE($1, name), subject = COALESCE($2, subject),
             body_email = COALESCE($3, body_email), body_in_app = COALESCE($4, body_in_app),
             placeholders = COALESCE($5::jsonb, placeholders), is_active = COALESCE($6, is_active),
             updated_by = $7, updated_at = NOW()
         WHERE id = $8 RETURNING *`,
        [name, subject, bodyEmail, bodyInApp, placeholders ? JSON.stringify(placeholders) : null, isActive ?? null, admin.id, req.params.id]
      );

      if (!result.rows[0]) return res.status(404).json({ error: "Template not found" });

      await pool.query(
        `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, severity, created_at)
         VALUES (gen_random_uuid(), $1, $2, 'communication_template', $3, 'template_updated', $4, 'info', NOW())`,
        [admin.id, admin.username, req.params.id, JSON.stringify({ name, subject })]
      );

      res.json(result.rows[0]);
    } catch (e: any) {
      console.error("[SubscriberRescue] template update error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/templates", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const parsed = createTemplateSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { templateKey, name, subject, bodyEmail, bodyInApp, placeholders } = parsed.data;

      const result = await pool.query(
        `INSERT INTO communication_templates (template_key, name, subject, body_email, body_in_app, placeholders, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7) RETURNING *`,
        [templateKey, name, subject, bodyEmail, bodyInApp, JSON.stringify(placeholders || []), admin.id]
      );

      res.json(result.rows[0]);
    } catch (e: any) {
      console.error("[SubscriberRescue] template create error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/templates/:id/render", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { values } = req.body;
      const result = await pool.query("SELECT * FROM communication_templates WHERE id = $1", [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Template not found" });

      const template = result.rows[0];
      const renderedSubject = renderTemplate(template.subject, values || {});
      const renderedEmail = renderTemplate(template.body_email, values || {});
      const renderedInApp = renderTemplate(template.body_in_app, values || {});

      res.json({ subject: renderedSubject, bodyEmail: renderedEmail, bodyInApp: renderedInApp });
    } catch (e: any) {
      console.error("[SubscriberRescue] template render error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.get("/api/admin/rescue/incident/:incidentId/affected-users", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { incidentId } = req.params;

      const incidentResult = await pool.query(
        `SELECT * FROM production_incidents WHERE incident_id = $1 LIMIT 1`,
        [incidentId]
      ).catch(() => ({ rows: [] }));

      let affectedUsers: any[] = [];
      if (incidentResult.rows[0]) {
        const incident = incidentResult.rows[0];
        const userIds = (incident.affected_user_ids || []).filter((id: any) => id && id !== "unknown" && id !== "anonymous");

        if (userIds.length > 0) {
          const userResult = await pool.query(
            `SELECT id, username, email, tier, subscription_status FROM users WHERE id = ANY($1)`,
            [userIds.slice(0, 100)]
          );
          affectedUsers = userResult.rows;
        }
      }

      const rescueActions = await pool.query(
        `SELECT * FROM subscriber_rescue_actions WHERE incident_id = $1 ORDER BY created_at DESC`,
        [incidentId]
      ).catch(() => ({ rows: [] }));

      res.json({
        incident: incidentResult.rows[0] || null,
        affectedUsers,
        rescueActions: rescueActions.rows,
        suggestedActions: getSuggestedActions(incidentResult.rows[0]),
      });
    } catch (e: any) {
      console.error("[SubscriberRescue] affected-users error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.post("/api/admin/rescue/bulk-action", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = bulkActionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors });
      const { userIds, actionType, actionData, reason, incidentId } = parsed.data;

      const results: any[] = [];
      for (const userId of userIds) {
        try {
          switch (actionType) {
            case "extend_subscription": {
              const days = actionData?.days || 7;
              await pool.query(
                `UPDATE users SET plan_expires_at = GREATEST(COALESCE(plan_expires_at, NOW()), NOW()) + INTERVAL '1 day' * $1 WHERE id = $2`,
                [days, userId]
              );
              await logRescueAction(userId, incidentId || null, "extend_subscription", { days, bulk: true }, admin.id, admin.username, reason || null);
              results.push({ userId, success: true, action: "extend_subscription" });
              break;
            }
            case "grant_temporary_access": {
              const hours = Math.min(Math.max(Number(actionData?.hours) || 24, 1), 720);
              const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
              try {
                await pool.query(
                  `INSERT INTO provisional_access_grants (id, user_id, reason, granted_by, granted_at, expires_at)
                   VALUES (gen_random_uuid(), $1, $2, $3, NOW(), $4)`,
                  [userId, reason || `Bulk temporary access for ${hours}h`, admin.id, expiresAt]
                );
              } catch (grantErr: any) {
                console.warn("[SubscriberRescue] Bulk grant insert warning:", grantErr.message);
              }
              await logRescueAction(userId, incidentId || null, "grant_temporary_access", { hours, bulk: true }, admin.id, admin.username, reason || null);
              results.push({ userId, success: true, action: "grant_temporary_access" });
              break;
            }
            case "replay_billing_sync": {
              try {
                await pool.query("DELETE FROM entitlement_cache WHERE user_id = $1", [userId]);
              } catch (cacheErr: any) {
                console.warn("[SubscriberRescue] Bulk cache clear warning:", cacheErr.message);
              }
              await logRescueAction(userId, incidentId || null, "replay_billing_sync", { bulk: true }, admin.id, admin.username, reason || null);
              results.push({ userId, success: true, action: "replay_billing_sync" });
              break;
            }
            case "support_note": {
              await logRescueAction(userId, incidentId || null, "support_note", { note: actionData?.note || reason || "Bulk support action", bulk: true }, admin.id, admin.username, reason || null);
              results.push({ userId, success: true, action: "support_note" });
              break;
            }
            default:
              results.push({ userId, success: false, error: "Unknown action type" });
          }
        } catch (err: any) {
          console.error(`[SubscriberRescue] Bulk action error for user ${userId}:`, err.message);
          results.push({ userId, success: false, error: "Action failed for this user" });
        }
      }

      res.json({ results, totalProcessed: results.length, successCount: results.filter(r => r.success).length });
    } catch (e: any) {
      console.error("[SubscriberRescue] bulk-action error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.get("/api/admin/rescue/refund-prevention", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [activeIncidents, recentRescues, atRiskUsers] = await Promise.all([
        pool.query(
          `SELECT * FROM production_incidents
           WHERE status = 'active' AND severity IN ('critical', 'warning')
           ORDER BY last_occurrence DESC LIMIT 20`
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT action_type, COUNT(*)::int as count, MAX(created_at) as last_action
           FROM subscriber_rescue_actions
           WHERE created_at > NOW() - INTERVAL '7 days'
           GROUP BY action_type ORDER BY count DESC`
        ).catch(() => ({ rows: [] })),
        pool.query(
          `SELECT u.id, u.username, u.email, u.tier, u.subscription_status,
                  COUNT(pi.id)::int as incident_count
           FROM users u
           JOIN production_incidents pi ON u.id = ANY(pi.affected_user_ids)
           WHERE pi.status = 'active' AND pi.severity IN ('critical', 'warning')
             AND u.tier != 'free' AND u.tier != 'admin'
           GROUP BY u.id, u.username, u.email, u.tier, u.subscription_status
           ORDER BY incident_count DESC LIMIT 50`
        ).catch(() => ({ rows: [] })),
      ]);

      res.json({
        activeIncidents: activeIncidents.rows.map((i: any) => ({
          incidentId: i.incident_id,
          title: i.title,
          severity: i.severity,
          category: i.category,
          affectedUserCount: i.affected_user_count || 0,
          firstOccurrence: i.first_occurrence,
          lastOccurrence: i.last_occurrence,
          status: i.status,
        })),
        recentRescueStats: recentRescues.rows,
        atRiskSubscribers: atRiskUsers.rows,
      });
    } catch (e: any) {
      console.error("[SubscriberRescue] refund-prevention error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });

  app.get("/api/admin/rescue/search-user", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { q } = req.query;
      if (!q || typeof q !== "string" || q.length < 2) return res.json({ users: [] });

      const searchTerm = q.substring(0, 100).toLowerCase();
      const result = await pool.query(
        `SELECT id, username, email, tier, subscription_status
         FROM users
         WHERE LOWER(username) LIKE $1 OR LOWER(email) LIKE $1 OR id = $2
         LIMIT 20`,
        [`%${searchTerm}%`, q]
      );

      res.json({ users: result.rows });
    } catch (e: any) {
      console.error("[SubscriberRescue] search-user error:", e.message);
      res.status(500).json({ error: sanitizeError(e) });
    }
  });
}

function getSuggestedActions(incident: any): any[] {
  if (!incident) return [];
  const severity = incident.severity || "info";
  const category = incident.category || "";
  const suggestions: any[] = [];

  if (severity === "critical") {
    suggestions.push(
      { action: "grant_temporary_access", label: "Grant Temporary Access", priority: "high", description: "Give affected users emergency access while the issue is resolved" },
      { action: "extend_subscription", label: "Extend Subscriptions", priority: "high", description: "Extend subscription by the duration of the outage" },
    );
  }

  if (category.includes("billing") || category.includes("subscription") || category.includes("payment")) {
    suggestions.push(
      { action: "replay_billing_sync", label: "Replay Billing Sync", priority: "high", description: "Clear entitlement cache and re-verify billing status" },
      { action: "restore_entitlement", label: "Restore Entitlements", priority: "medium", description: "Manually restore subscription tier access" },
    );
  }

  if (category.includes("exam") || category.includes("session")) {
    suggestions.push(
      { action: "reset_exam_state", label: "Reset Exam State", priority: "high", description: "Reset stuck exam or study sessions" },
    );
  }

  if (severity === "warning" || severity === "critical") {
    suggestions.push(
      { action: "support_note", label: "Add Support Note", priority: "low", description: "Log an internal note about actions taken" },
    );
  }

  return suggestions;
}
