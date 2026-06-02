import type { Express, Request, Response } from "express";
import pg from "pg";
import { requireAdmin } from "./admin-auth";
import {
  getAlertThresholds,
  setAlertThresholds,
  runAlertingChecks,
} from "./alerting-engine";
import {
  runAllSyntheticTests,
  runSyntheticTest,
  getAvailableTests,
} from "./synthetic-monitoring";

/* =========================
   HELPERS
========================= */

function parseNumber(value: any, def: number, min: number, max: number) {
  const n = parseInt(value);
  if (isNaN(n)) return def;
  return Math.min(Math.max(n, min), max);
}

function handleError(res: Response, label: string, e: any) {
  if (e.message?.includes("does not exist")) {
    return res.json({ items: [], total: 0 });
  }
  console.error(`[AlertRoutes] ${label}:`, e.message);
  res.status(500).json({ error: "Internal server error" });
}

/* =========================
   QUERY BUILDER
========================= */

function buildWhere(filters: Record<string, any>) {
  const clauses: string[] = [];
  const params: any[] = [];
  let i = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined) continue;

    clauses.push(`${key} = $${i++}`);
    params.push(value);
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
    nextIndex: i,
  };
}

/* =========================
   ROUTES
========================= */

export function registerAlertingRoutes(app: Express, pool: pg.Pool) {

  /* ===== ALERT LIST ===== */

  app.get("/api/admin/reliability/alerts", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const limit = parseNumber(req.query.limit, 50, 1, 200);
      const offset = parseNumber(req.query.offset, 0, 0, 10000);

      const filters = {
        severity: req.query.severity,
        alert_type: req.query.type,
        ...(req.query.acknowledged === "true" || req.query.acknowledged === "false"
          ? { acknowledged: req.query.acknowledged === "true" }
          : {}),
      };

      const { where, params, nextIndex } = buildWhere(filters);

      const total = await pool.query(
        `SELECT COUNT(*)::int AS total FROM reliability_alerts ${where}`,
        params
      );

      const data = await pool.query(
        `SELECT * FROM reliability_alerts
         ${where}
         ORDER BY created_at DESC
         LIMIT $${nextIndex} OFFSET $${nextIndex + 1}`,
        [...params, limit, offset]
      );

      res.json({
        items: data.rows,
        total: total.rows[0]?.total || 0,
        limit,
        offset,
      });

    } catch (e: any) {
      handleError(res, "GET alerts", e);
    }
  });

  /* ===== SUMMARY ===== */

  app.get("/api/admin/reliability/alerts/summary", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const hours = parseNumber(req.query.hours, 24, 1, 168);

      const summary = await pool.query(`
        SELECT alert_type, severity, COUNT(*)::int AS count, MAX(created_at) AS latest
        FROM reliability_alerts
        WHERE created_at > NOW() - ($1 || ' hours')::interval
        GROUP BY alert_type, severity
        ORDER BY count DESC
      `, [hours]);

      const unack = await pool.query(
        `SELECT COUNT(*)::int AS count FROM reliability_alerts WHERE acknowledged = false`
      );

      res.json({
        summary: summary.rows,
        unacknowledgedCount: unack.rows[0]?.count || 0,
        hours,
      });

    } catch (e: any) {
      handleError(res, "GET summary", e);
    }
  });

  /* ===== ACK ===== */

  app.post("/api/admin/reliability/alerts/:id/acknowledge", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await pool.query(
        `UPDATE reliability_alerts
         SET acknowledged = true,
             acknowledged_by = $1,
             acknowledged_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [admin.username || admin.id, req.params.id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ error: "Alert not found" });
      }

      res.json(result.rows[0]);

    } catch (e: any) {
      handleError(res, "ACK alert", e);
    }
  });

  /* ===== THRESHOLDS ===== */

  app.get("/api/admin/reliability/thresholds", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json(getAlertThresholds());
  });

  app.put("/api/admin/reliability/thresholds", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const allowed = [
        "failureRatePercent",
        "fallbackRatePercent",
        "quarantineCountPerHour",
        "protectedRecoveryCountPerHour",
        "backupFailureCountPerHour",
        "entitlementMismatchCountPerHour",
        "cooldownMinutes",
      ];

      const updates: Record<string, number> = {};

      for (const key of allowed) {
        if (typeof req.body[key] === "number" && req.body[key] >= 0) {
          updates[key] = req.body[key];
        }
      }

      res.json(await setAlertThresholds(updates, pool));

    } catch (e: any) {
      handleError(res, "PUT thresholds", e);
    }
  });

  /* ===== CHECK NOW ===== */

  app.post("/api/admin/reliability/check-now", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await runAlertingChecks(pool);
      res.json({ success: true });
    } catch (e: any) {
      handleError(res, "check-now", e);
    }
  });

  /* ===== SYNTHETIC ===== */

  app.post("/api/admin/reliability/synthetic/run", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const baseUrl = `http://127.0.0.1:${process.env.PORT || "5000"}`;
      const { testName } = req.body || {};

      if (testName) {
        return res.json(await runSyntheticTest(pool, testName, baseUrl));
      }

      const results = await runAllSyntheticTests(pool, baseUrl);

      res.json({
        results,
        summary: {
          total: results.length,
          passed: results.filter(r => r.status === "pass").length,
          failed: results.filter(r => r.status === "fail").length,
        },
      });

    } catch (e: any) {
      handleError(res, "synthetic run", e);
    }
  });

  app.get("/api/admin/reliability/synthetic/tests", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json(getAvailableTests());
  });
}