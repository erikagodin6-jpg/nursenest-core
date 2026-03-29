import type { Express, Request, Response } from "express";
import { queryParamString, routeParamString } from "./route-params";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  quarantineContentItem,
  resolveQuarantine,
  isContentQuarantined,
  getQuarantineInfo,
  getLastKnownGoodSnapshot,
  getContentWithQuarantineCheck,
  runPublishValidationPipeline,
  createContentSnapshot,
} from "./content-versioning-quarantine";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

export function registerContentQuarantineRoutes(app: Express): void {

  app.post("/api/admin/content-quarantine/quarantine", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId, contentType, reason } = req.body;
      if (!contentId || !contentType || !reason) {
        return res.status(400).json({ error: "contentId, contentType, and reason are required" });
      }

      const result = await quarantineContentItem(contentId, contentType, reason, "admin");
      if (!result) {
        return res.status(500).json({ error: "Failed to quarantine content" });
      }

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-quarantine/resolve", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId, action } = req.body;
      if (!contentId || !action) {
        return res.status(400).json({ error: "contentId and action are required" });
      }

      const validActions = ["restore", "delete", "repair", "replace"];
      if (!validActions.includes(action)) {
        return res.status(400).json({ error: `Invalid action. Must be one of: ${validActions.join(", ")}` });
      }

      const resolved = await resolveQuarantine(contentId, admin.id, action);
      if (!resolved) {
        return res.status(500).json({ error: "Failed to resolve quarantine" });
      }

      res.json({ success: true, contentId, action });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-quarantine/list", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const showResolved = req.query.resolved === "true";
      const contentType = req.query.contentType as string;

      let query = "SELECT * FROM content_quarantine";
      const params: any[] = [];
      const conditions: string[] = [];

      if (!showResolved) {
        conditions.push("resolved_at IS NULL");
      }
      if (contentType) {
        params.push(contentType);
        conditions.push(`content_type = $${params.length}`);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }
      query += " ORDER BY created_at DESC LIMIT 100";

      const result = await pool.query(query, params);
      res.json(snakeToCamel(result.rows));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-quarantine/stats", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [activeCount, resolvedCount, byType, recent] = await Promise.all([
        pool.query("SELECT COUNT(*) as cnt FROM content_quarantine WHERE resolved_at IS NULL"),
        pool.query("SELECT COUNT(*) as cnt FROM content_quarantine WHERE resolved_at IS NOT NULL"),
        pool.query("SELECT content_type, COUNT(*) as cnt FROM content_quarantine WHERE resolved_at IS NULL GROUP BY content_type"),
        pool.query("SELECT * FROM content_quarantine ORDER BY created_at DESC LIMIT 10"),
      ]);

      res.json({
        active: parseInt(activeCount.rows[0].cnt),
        resolved: parseInt(resolvedCount.rows[0].cnt),
        byType: snakeToCamel(byType.rows),
        recent: snakeToCamel(recent.rows),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-quarantine/check/:contentId", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const contentId = routeParamString(req.params.contentId);
      const quarantined = await isContentQuarantined(contentId);
      const info = quarantined ? await getQuarantineInfo(contentId) : null;

      res.json({ quarantined, info });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-quarantine/fallback/:contentId", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const contentId = routeParamString(req.params.contentId);
      const contentType = queryParamString(req.query.type as string | string[] | undefined) || "content_item";

      const check = await getContentWithQuarantineCheck(contentId, contentType);
      if (!check.quarantined) {
        return res.status(200).json({ quarantined: false });
      }

      if (check.fallback) {
        res.setHeader("X-Content-Source", "quarantine-fallback");
        return res.json({
          quarantined: true,
          fallback: check.fallback,
          message: check.message,
        });
      }

      res.json({
        quarantined: true,
        fallback: null,
        message: check.message,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-quarantine/validate", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId, contentType, data } = req.body;
      if (!contentId || !contentType || !data) {
        return res.status(400).json({ error: "contentId, contentType, and data are required" });
      }

      const result = await runPublishValidationPipeline(contentType, contentId, data, admin.id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-quarantine/validation-history/:contentId", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        "SELECT * FROM content_validation_results WHERE content_id = $1 ORDER BY created_at DESC LIMIT 20",
        [req.params.contentId]
      );
      res.json(snakeToCamel(result.rows));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-quarantine/snapshots/:contentId", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        "SELECT id, content_id, content_type, version, title, slug, snapshot_type, is_last_known_good, validated_at, created_at FROM content_snapshots WHERE content_id = $1 ORDER BY version DESC LIMIT 20",
        [req.params.contentId]
      );
      res.json(snakeToCamel(result.rows));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-quarantine/restore-snapshot", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId, snapshotId } = req.body;
      if (!contentId) return res.status(400).json({ error: "contentId is required" });

      let snapshot: any = null;
      if (snapshotId) {
        const specificResult = await pool.query(
          "SELECT * FROM content_snapshots WHERE id = $1 AND content_id = $2",
          [snapshotId, contentId]
        );
        if (specificResult.rows.length > 0) {
          snapshot = snakeToCamel(specificResult.rows[0]);
        }
      }
      if (!snapshot) {
        snapshot = await getLastKnownGoodSnapshot(contentId);
      }
      if (!snapshot) {
        return res.status(404).json({ error: "No snapshot found for this content" });
      }

      const contentData = typeof snapshot.contentData === "string" ? JSON.parse(snapshot.contentData) : snapshot.contentData;
      const metadata = typeof snapshot.metadata === "string" ? JSON.parse(snapshot.metadata) : snapshot.metadata;

      await pool.query(
        `UPDATE content_items SET title = $1, slug = $2, content = $3, tier = $4, category = $5, status = 'published', updated_at = NOW() WHERE id = $6`,
        [
          snapshot.title, snapshot.slug, JSON.stringify(contentData),
          metadata?.tier || "free", metadata?.category || null, contentId,
        ]
      );

      await resolveQuarantine(contentId, admin.id, "restore");

      res.json({ success: true, restoredVersion: snapshot.version });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-quarantine/repair", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId, contentType } = req.body;
      if (!contentId || !contentType) return res.status(400).json({ error: "contentId and contentType are required" });

      const { autoRepairContent, validateForPublish } = await import("./content-integrity-validation");

      let contentRow: any = null;
      if (contentType === "question") {
        const r = await pool.query(`SELECT * FROM exam_questions WHERE id = $1`, [contentId]);
        contentRow = r.rows[0] ? snakeToCamel(r.rows[0]) : null;
      } else if (contentType === "flashcard") {
        const r = await pool.query(`SELECT * FROM flashcard_bank WHERE id = $1`, [contentId]);
        contentRow = r.rows[0] ? snakeToCamel(r.rows[0]) : null;
      } else {
        const r = await pool.query(`SELECT * FROM content_items WHERE id = $1`, [contentId]);
        contentRow = r.rows[0] ? snakeToCamel(r.rows[0]) : null;
      }

      if (!contentRow) return res.status(404).json({ error: "Content not found" });

      const { repairedData, repairs } = autoRepairContent(contentType, contentRow);
      const validation = validateForPublish(contentType, repairedData);

      res.json({
        contentId,
        contentType,
        repairs,
        validAfterRepair: validation.valid,
        remainingErrors: validation.valid ? [] : validation.errors,
        repairedFields: repairs.map((r: any) => r.field),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-quarantine/audit-history", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { getAuditHistory } = await import("./content-integrity-audit");
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const history = await getAuditHistory(limit);
      res.json({ history });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-quarantine/run-audit", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { runPostPublishIntegrityAudit } = await import("./content-integrity-audit");
      const result = await runPostPublishIntegrityAudit();
      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
