import type { Express, Request, Response } from "express";
import { pool } from "./storage";

/* =========================
   HELPERS
========================= */

async function requireAdminSafe(req: Request, res: Response) {
  try {
    const { requireAdmin } = await import("./admin-auth");
    return await requireAdmin(req as any, res as any);
  } catch {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
}

function safeJsonParse<T>(value: any, fallback: T): T {
  try {
    return typeof value === "string" ? JSON.parse(value) : value ?? fallback;
  } catch {
    return fallback;
  }
}

/* =========================
   AUDIT SERVICE
========================= */

async function logAudit(pool: any, req: Request, admin: any, entity: string, id: string, action: string, after?: any) {
  try {
    await pool.query(
      `INSERT INTO audit_logs
       (id, actor_id, actor_username, entity_type, entity_id, action, after_json, ip_address, created_at)
       VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,NOW())`,
      [
        admin?.id || null,
        admin?.username || null,
        entity,
        id,
        action,
        after ? JSON.stringify(after) : null,
        req.ip,
      ]
    );
  } catch (e) {
    console.error("[Audit] Failed:", e);
  }
}

/* =========================
   INCIDENT SERVICE
========================= */

async function getIncidentById(id: string) {
  const r = await pool.query(
    `SELECT * FROM production_incidents WHERE incident_id=$1`,
    [id]
  );

  if (!r.rows.length) return null;

  const row = r.rows[0];

  return {
    incidentId: row.incident_id,
    title: row.title,
    severity: row.severity,
    status: row.status,
    firstOccurrence: new Date(row.first_occurrence).getTime(),
    lastOccurrence: new Date(row.last_occurrence).getTime(),
    metadata: safeJsonParse(row.metadata, {}),
  };
}

/* =========================
   CORRELATION ENGINE (SIMPLIFIED)
========================= */

async function buildCorrelationTimeline(start: number, end: number) {
  const windowStart = new Date(start - 30 * 60 * 1000);
  const windowEnd = new Date(end + 5 * 60 * 1000);

  const result = await pool.query(
    `SELECT action, entity_type, entity_id, created_at
     FROM audit_logs
     WHERE created_at BETWEEN $1 AND $2
     ORDER BY created_at DESC
     LIMIT 50`,
    [windowStart, windowEnd]
  );

  return result.rows.map((r: any) => ({
    type: "audit",
    timestamp: new Date(r.created_at).toISOString(),
    description: `${r.action} on ${r.entity_type}`,
    entityId: r.entity_id,
    confidence: 0.5,
  }));
}

/* =========================
   ROUTES
========================= */

export function registerIncidentRoutes(app: Express) {

  /* ===== GET INCIDENT ===== */

  app.get("/api/admin/incidents/:id", async (req, res) => {
    const admin = await requireAdminSafe(req, res);
    if (!admin) return;

    try {
      const incident = await getIncidentById(req.params.id);

      if (!incident) {
        return res.status(404).json({ error: "Not found" });
      }

      const timeline = await buildCorrelationTimeline(
        incident.firstOccurrence,
        incident.lastOccurrence
      );

      res.json({
        incident,
        timeline,
      });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /* ===== CREATE INCIDENT ===== */

  app.post("/api/admin/incidents", async (req, res) => {
    const admin = await requireAdminSafe(req, res);
    if (!admin) return;

    try {
      const { title, message } = req.body;

      if (!title || !message) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const id = `INC-${Date.now()}`;

      await pool.query(
        `INSERT INTO production_incidents
         (incident_id,title,message,status,first_occurrence,last_occurrence)
         VALUES ($1,$2,$3,'active',NOW(),NOW())`,
        [id, title, message]
      );

      await logAudit(pool, req, admin, "incident", id, "create", { title });

      res.json({ id });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  /* ===== RESOLVE ===== */

  app.post("/api/admin/incidents/:id/resolve", async (req, res) => {
    const admin = await requireAdminSafe(req, res);
    if (!admin) return;

    try {
      await pool.query(
        `UPDATE production_incidents
         SET status='resolved', resolved_at=NOW()
         WHERE incident_id=$1`,
        [req.params.id]
      );

      await logAudit(pool, req, admin, "incident", req.params.id, "resolve");

      res.json({ success: true });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}