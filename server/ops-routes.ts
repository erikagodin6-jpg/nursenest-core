import type { Express } from "express";
import {
  requireAdminRole,
  issueConfirmationToken,
  validateConfirmationToken,
} from "./admin-auth";
import {
  auditAction,
  queryAuditLogs,
  getAuditLogActions,
  getAuditLogEntityTypes,
  exportAuditLogs,
} from "./ops-audit-service";
import { pool } from "./storage";

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function buildWhere(filters: Record<string, any>) {
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;
    conditions.push(`${key} = $${idx++}`);
    params.push(value);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
    nextIdx: idx,
  };
}

function safeLimit(val: any, def = 50, max = 200) {
  const n = parseInt(val);
  if (isNaN(n)) return def;
  return Math.min(n, max);
}

/**
 * ------------------------------
 * ROUTES
 * ------------------------------
 */

export function registerOpsRoutes(app: Express) {

  /**
   * ------------------------------
   * AUDIT LOGS
   * ------------------------------
   */

  app.get("/api/admin/audit-logs", requireAdminRole("super_admin", "ops_viewer"), async (req: any, res) => {
    try {
      const filters = {
        action: req.query.action,
        actorId: req.query.actorId,
        actorUsername: req.query.actorUsername,
        entityType: req.query.entityType,
        entityId: req.query.entityId,
        severity: req.query.severity,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        limit: safeLimit(req.query.limit),
        offset: parseInt(req.query.offset) || 0,
      };

      const { logs, total } = await queryAuditLogs(filters);

      res.json({ logs, total, limit: filters.limit, offset: filters.offset });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/audit-logs/actions", requireAdminRole("super_admin", "ops_viewer"), async (_req, res) => {
    try {
      res.json({ actions: await getAuditLogActions() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/audit-logs/entity-types", requireAdminRole("super_admin", "ops_viewer"), async (_req, res) => {
    try {
      res.json({ entityTypes: await getAuditLogEntityTypes() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * EXPORT
   */
  app.get("/api/admin/audit-logs/export", requireAdminRole("super_admin"), async (req: any, res) => {
    try {
      const logs = await exportAuditLogs(req.query);

      if (req.query.format === "csv") {
        const headers = ["id", "actor_id", "actor_username", "entity_type", "entity_id", "action", "reason", "severity", "ip_address", "created_at"];

        const rows = logs.map(log =>
          headers.map(h => {
            const val = log[h];
            if (!val) return "";
            const str = String(val);
            return str.includes(",") || str.includes('"')
              ? `"${str.replace(/"/g, '""')}"`
              : str;
          }).join(",")
        );

        res.setHeader("Content-Type", "text/csv");
        return res.send([headers.join(","), ...rows].join("\n"));
      }

      res.json({ logs, count: logs.length });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * ------------------------------
   * INCIDENTS
   * ------------------------------
   */

  app.get("/api/admin/ops-incidents", requireAdminRole("super_admin", "support_admin", "ops_viewer"), async (req: any, res) => {
    try {
      const { where, params, nextIdx } = buildWhere({
        status: req.query.status,
        severity: req.query.severity,
      });

      const limit = safeLimit(req.query.limit);
      const offset = parseInt(req.query.offset) || 0;

      const total = await pool.query(
        `SELECT COUNT(*)::int FROM ops_incidents ${where}`,
        params
      );

      const result = await pool.query(
        `SELECT * FROM ops_incidents ${where}
         ORDER BY created_at DESC
         LIMIT $${nextIdx} OFFSET $${nextIdx + 1}`,
        [...params, limit, offset]
      );

      res.json({
        incidents: result.rows,
        total: total.rows[0]?.count || 0,
      });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * CREATE INCIDENT
   */
  app.post("/api/admin/ops-incidents", requireAdminRole("super_admin", "support_admin"), async (req: any, res) => {
    try {
      const admin = req.adminUser;
      const { title, description, severity, category } = req.body;

      if (!title) return res.status(400).json({ error: "Title required" });

      const r = await pool.query(
        `INSERT INTO ops_incidents (id,title,description,severity,status,category,created_at,updated_at)
         VALUES (gen_random_uuid(),$1,$2,$3,'open',$4,NOW(),NOW())
         RETURNING *`,
        [title, description || null, severity || "warning", category || "general"]
      );

      await auditAction(req, admin, "ops_incident_created", "ops_incident", r.rows[0].id);

      res.json(r.rows[0]);

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * ------------------------------
   * COMM TEMPLATES
   * ------------------------------
   */

  app.get("/api/admin/comm-templates", requireAdminRole("super_admin", "support_admin", "content_admin"), async (_req, res) => {
    try {
      const r = await pool.query("SELECT * FROM comm_templates ORDER BY created_at DESC");
      res.json({ templates: r.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/comm-templates", requireAdminRole("super_admin", "support_admin"), async (req: any, res) => {
    try {
      const admin = req.adminUser;
      const { name, bodyTemplate } = req.body;

      if (!name || !bodyTemplate) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const r = await pool.query(
        `INSERT INTO comm_templates (id,name,body_template,created_by,created_at)
         VALUES (gen_random_uuid(),$1,$2,$3,NOW())
         RETURNING *`,
        [name, bodyTemplate, admin?.id]
      );

      await auditAction(req, admin, "comm_template_created", "comm_template", r.rows[0].id);

      res.json(r.rows[0]);

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * DELETE (WITH CONFIRMATION)
   */
  app.delete("/api/admin/comm-templates/:id", requireAdminRole("super_admin"), async (req: any, res) => {
    try {
      const admin = req.adminUser;
      const { id } = req.params;

      const token = req.headers["x-confirm-token"] as string;

      if (!token || !validateConfirmationToken(token, admin?.id, "delete_comm_template").valid) {
        return res.status(428).json({
          error: "Confirmation required",
          confirmToken: issueConfirmationToken(admin?.id, "delete_comm_template", { id }),
        });
      }

      await pool.query(`DELETE FROM comm_templates WHERE id=$1`, [id]);

      await auditAction(req, admin, "comm_template_deleted", "comm_template", id);

      res.json({ success: true });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * ------------------------------
   * RESCUE ACTIONS
   * ------------------------------
   */

  app.get("/api/admin/rescue-actions", requireAdminRole("super_admin", "support_admin"), async (req: any, res) => {
    try {
      const { where, params, nextIdx } = buildWhere({
        status: req.query.status,
      });

      const limit = safeLimit(req.query.limit);

      const r = await pool.query(
        `SELECT * FROM rescue_actions ${where}
         ORDER BY created_at DESC
         LIMIT $${nextIdx}`,
        [...params, limit]
      );

      res.json({ actions: r.rows });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

}