import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { getPool } from "./db";
import {
  getEnvironmentInfo,
  runDiagnosticChecks,
  runPreflightChecks,
  executeEnvironmentAwareWrite,
  createProductionConfirmNonce,
} from "./environment-write-service";
import type { EnvironmentTarget } from "@shared/schema";

export function registerEnvironmentRoutes(app: Express) {
  const pool = getPool();

  app.get("/api/admin/environment/info", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const info = await getEnvironmentInfo();
      res.json(info);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/environment/diagnostics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const diagnostics = await runDiagnosticChecks();
      res.json(diagnostics);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/environment/preflight", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { target } = req.body;
      if (!target || !["development", "staging", "production"].includes(target)) {
        return res.status(400).json({ error: "Invalid target. Must be development, staging, or production." });
      }
      const result = await runPreflightChecks(target as EnvironmentTarget);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/environment/audit-log", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      await pool.query(`
        CREATE TABLE IF NOT EXISTS environment_write_audit (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          actor_id VARCHAR,
          actor_username TEXT,
          selected_target TEXT NOT NULL,
          actual_environment TEXT NOT NULL,
          actual_db_fingerprint TEXT,
          content_type TEXT NOT NULL,
          entity_id VARCHAR,
          item_count INTEGER DEFAULT 0,
          action_type TEXT NOT NULL,
          provider_model TEXT,
          approval_state TEXT,
          write_summary TEXT,
          preflight_result JSONB,
          post_write_result JSONB,
          success BOOLEAN DEFAULT false,
          failure_reason TEXT,
          mismatch_reason TEXT,
          block_reason TEXT,
          dry_run BOOLEAN DEFAULT false,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const targetFilter = req.query.target as string;
      const successFilter = req.query.success as string;

      let query = `SELECT * FROM environment_write_audit WHERE 1=1`;
      const params: any[] = [];
      let paramIdx = 1;

      if (targetFilter && ["development", "staging", "production"].includes(targetFilter)) {
        query += ` AND selected_target = $${paramIdx++}`;
        params.push(targetFilter);
      }
      if (successFilter === "true" || successFilter === "false") {
        query += ` AND success = $${paramIdx++}`;
        params.push(successFilter === "true");
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      let countQuery = `SELECT COUNT(*) AS total FROM environment_write_audit WHERE 1=1`;
      const countParams: any[] = [];
      let countIdx = 1;
      if (targetFilter && ["development", "staging", "production"].includes(targetFilter)) {
        countQuery += ` AND selected_target = $${countIdx++}`;
        countParams.push(targetFilter);
      }
      if (successFilter === "true" || successFilter === "false") {
        countQuery += ` AND success = $${countIdx++}`;
        countParams.push(successFilter === "true");
      }
      const countResult = await pool.query(countQuery, countParams);

      res.json({
        entries: result.rows,
        total: parseInt(countResult.rows[0]?.total || "0", 10),
        limit,
        offset,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/environment/confirm-nonce", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { target, contentType, actionType } = req.body;
      if (!target || !["production"].includes(target)) {
        return res.status(400).json({ error: "Nonce only required for production target" });
      }
      if (!contentType || !actionType) {
        return res.status(400).json({ error: "contentType and actionType are required" });
      }
      const nonce = createProductionConfirmNonce(admin.id, target, contentType, actionType);
      res.json({ nonce, expiresInSeconds: 300 });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/environment/test-write", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { target, dryRun, productionConfirmNonce } = req.body;
      if (!target || !["development", "staging", "production"].includes(target)) {
        return res.status(400).json({ error: "Invalid target" });
      }

      const result = await executeEnvironmentAwareWrite(
        {
          selectedTarget: target as EnvironmentTarget,
          contentType: "diagnostic_test",
          actionType: "test_write",
          itemCount: 1,
          writeSummary: "Diagnostic test write to verify environment pipeline",
          actorId: admin.id,
          actorUsername: admin.username,
          dryRun: dryRun !== false,
          productionConfirmNonce: productionConfirmNonce || undefined,
        },
        async (targetPool) => {
          await targetPool.query("SELECT 1");
          return { count: 0, tableName: "environment_write_audit" };
        },
      );

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
