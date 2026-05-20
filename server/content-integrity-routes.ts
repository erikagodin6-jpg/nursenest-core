import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { runContentScan } from "./content-integrity-scanner";
import { runBatchRepair, repairMissingRationales, repairMissingMetadata, repairMissingFlashcards, repairMissingSeo, repairDeepRationales, runDeepRationaleUpgrade } from "./content-integrity-repair";
import { countNonCATRationaleAudit } from "./content-integrity-scanner";
import { validateForPublish } from "./content-integrity-validation";
import { runLightweightScan, runDeepScan, runScanAndRepair, createScanRun, completeScanRun, persistScanIssues, routeToManualReview, startScheduledJobs, stopScheduledJobs, getJobStatus } from "./content-integrity-jobs";

export function registerContentIntegrityRoutes(app: Express) {

  app.post("/api/admin/content-integrity/scan", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { mode = "lightweight", contentTypes, tiers } = req.body;
      const validContentTypes = Array.isArray(contentTypes) ? contentTypes.filter((t: any) => typeof t === "string") : undefined;
      const validTiers = Array.isArray(tiers) ? tiers.filter((t: any) => typeof t === "string") : undefined;

      const result = mode === "deep"
        ? await runDeepScan(validContentTypes, validTiers)
        : await runLightweightScan(validContentTypes, validTiers);

      res.json(result);
    } catch (err: any) {
      console.error("[ContentIntegrity] Scan error:", err.message);
      res.status(500).json({ error: "Scan failed", details: err.message });
    }
  });

  app.post("/api/admin/content-integrity/scan-and-repair", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { mode = "deep", repairTypes, batchSize } = req.body;
      const result = await runScanAndRepair(mode, repairTypes, batchSize);
      res.json(result);
    } catch (err: any) {
      console.error("[ContentIntegrity] Scan-and-repair error:", err.message);
      res.status(500).json({ error: "Scan and repair failed", details: err.message });
    }
  });

  app.post("/api/admin/content-integrity/repair", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { repairTypes, batchSize = 50, scanRunId } = req.body;
      const result = await runBatchRepair(scanRunId || null, repairTypes, batchSize);
      res.json(result);
    } catch (err: any) {
      console.error("[ContentIntegrity] Repair error:", err.message);
      res.status(500).json({ error: "Repair failed", details: err.message });
    }
  });

  app.post("/api/admin/content-integrity/repair/rationales", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { batchSize = 50 } = req.body;
      const result = await repairMissingRationales(null, batchSize);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/repair/metadata", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { batchSize = 50 } = req.body;
      const result = await repairMissingMetadata(null, batchSize);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/repair/flashcards", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { batchSize = 50 } = req.body;
      const result = await repairMissingFlashcards(null, batchSize);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/repair/seo", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { batchSize = 50 } = req.body;
      const result = await repairMissingSeo(null, batchSize);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/rationale-audit", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const audit = await countNonCATRationaleAudit();
      res.json(audit);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/repair/deep-rationales", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { batchSize = 50 } = req.body;
      const result = await repairDeepRationales(null, Math.min(batchSize, 100));
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/deep-rationale-upgrade", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { batchSize = 50 } = req.body;
      const result = await runDeepRationaleUpgrade(Math.min(batchSize, 100));
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/scan-runs", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { limit = 20, offset = 0 } = req.query;
      const result = await pool.query(
        `SELECT id, scan_type, status, content_types, tiers, total_records, scanned_records,
                issues_found, issues_by_severity, issues_by_type, auto_fixable,
                repairs_attempted, repairs_succeeded, error, started_at, completed_at, created_at
         FROM integrity_scan_runs
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [Number(limit), Number(offset)]
      );

      const countResult = await pool.query(`SELECT COUNT(*) as total FROM integrity_scan_runs`);

      res.json({
        runs: result.rows,
        total: parseInt(countResult.rows[0]?.total || "0"),
        limit: Number(limit),
        offset: Number(offset),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/scan-runs/:id", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT * FROM integrity_scan_runs WHERE id = $1`,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Scan run not found" });
      }

      const issuesResult = await pool.query(
        `SELECT content_type, issue_type, severity, COUNT(*) as count
         FROM content_health_records
         WHERE scan_run_id = $1
         GROUP BY content_type, issue_type, severity
         ORDER BY severity, content_type`,
        [req.params.id]
      );

      res.json({
        run: result.rows[0],
        issueBreakdown: issuesResult.rows,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/issues", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, issueType, severity, repairStatus, tier, scanRunId, limit = 50, offset = 0 } = req.query;
      let query = `SELECT * FROM content_health_records WHERE 1=1`;
      const params: any[] = [];
      let paramIdx = 1;

      if (contentType) { query += ` AND content_type = $${paramIdx++}`; params.push(contentType); }
      if (issueType) { query += ` AND issue_type = $${paramIdx++}`; params.push(issueType); }
      if (severity) { query += ` AND severity = $${paramIdx++}`; params.push(severity); }
      if (repairStatus) { query += ` AND repair_status = $${paramIdx++}`; params.push(repairStatus); }
      if (tier) { query += ` AND tier = $${paramIdx++}`; params.push(tier); }
      if (scanRunId) { query += ` AND scan_run_id = $${paramIdx++}`; params.push(scanRunId); }

      query += ` ORDER BY detected_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
      params.push(Number(limit), Number(offset));

      const result = await pool.query(query, params);

      let countQuery = `SELECT COUNT(*) as total FROM content_health_records WHERE 1=1`;
      const countParams: any[] = [];
      let countIdx = 1;
      if (contentType) { countQuery += ` AND content_type = $${countIdx++}`; countParams.push(contentType); }
      if (issueType) { countQuery += ` AND issue_type = $${countIdx++}`; countParams.push(issueType); }
      if (severity) { countQuery += ` AND severity = $${countIdx++}`; countParams.push(severity); }
      if (repairStatus) { countQuery += ` AND repair_status = $${countIdx++}`; countParams.push(repairStatus); }
      if (tier) { countQuery += ` AND tier = $${countIdx++}`; countParams.push(tier); }
      if (scanRunId) { countQuery += ` AND scan_run_id = $${countIdx++}`; countParams.push(scanRunId); }

      const countResult = await pool.query(countQuery, countParams);

      res.json({
        issues: result.rows,
        total: parseInt(countResult.rows[0]?.total || "0"),
        limit: Number(limit),
        offset: Number(offset),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/review-queue", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { status = "pending", contentType, severity, limit = 50, offset = 0 } = req.query;
      let query = `SELECT * FROM manual_review_queue WHERE 1=1`;
      const params: any[] = [];
      let paramIdx = 1;

      if (status) { query += ` AND status = $${paramIdx++}`; params.push(status); }
      if (contentType) { query += ` AND content_type = $${paramIdx++}`; params.push(contentType); }
      if (severity) { query += ` AND severity = $${paramIdx++}`; params.push(severity); }

      query += ` ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END, created_at DESC`;
      query += ` LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
      params.push(Number(limit), Number(offset));

      const result = await pool.query(query, params);

      let countQuery = `SELECT COUNT(*) as total FROM manual_review_queue WHERE 1=1`;
      const countParams: any[] = [];
      let countIdx = 1;
      if (status) { countQuery += ` AND status = $${countIdx++}`; countParams.push(status); }
      if (contentType) { countQuery += ` AND content_type = $${countIdx++}`; countParams.push(contentType); }
      if (severity) { countQuery += ` AND severity = $${countIdx++}`; countParams.push(severity); }

      const countResult = await pool.query(countQuery, countParams);

      res.json({
        items: result.rows,
        total: parseInt(countResult.rows[0]?.total || "0"),
        limit: Number(limit),
        offset: Number(offset),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/review-queue/:id/approve", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { reviewNotes } = req.body;
      const result = await pool.query(
        `UPDATE manual_review_queue SET status = 'approved', reviewed_by = $1, reviewed_at = NOW(), review_notes = $2
         WHERE id = $3 RETURNING *`,
        [admin.id || admin.username, reviewNotes || null, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Review item not found" });
      }

      res.json({ item: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/review-queue/:id/reject", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { reviewNotes } = req.body;
      const result = await pool.query(
        `UPDATE manual_review_queue SET status = 'rejected', reviewed_by = $1, reviewed_at = NOW(), review_notes = $2
         WHERE id = $3 RETURNING *`,
        [admin.id || admin.username, reviewNotes || null, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Review item not found" });
      }

      res.json({ item: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/repair-log", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, repairType, status, scanRunId, limit = 50, offset = 0 } = req.query;
      let query = `SELECT * FROM content_repair_log WHERE 1=1`;
      const params: any[] = [];
      let paramIdx = 1;

      if (contentType) { query += ` AND content_type = $${paramIdx++}`; params.push(contentType); }
      if (repairType) { query += ` AND repair_type = $${paramIdx++}`; params.push(repairType); }
      if (status) { query += ` AND status = $${paramIdx++}`; params.push(status); }
      if (scanRunId) { query += ` AND scan_run_id = $${paramIdx++}`; params.push(scanRunId); }

      query += ` ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
      params.push(Number(limit), Number(offset));

      const result = await pool.query(query, params);

      const countQuery = `SELECT COUNT(*) as total FROM content_repair_log`;
      const countResult = await pool.query(countQuery);

      res.json({
        repairs: result.rows,
        total: parseInt(countResult.rows[0]?.total || "0"),
        limit: Number(limit),
        offset: Number(offset),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/repair-log/:id/rollback", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const repairResult = await pool.query(
        `SELECT * FROM content_repair_log WHERE id = $1`,
        [req.params.id]
      );

      if (repairResult.rows.length === 0) {
        return res.status(404).json({ error: "Repair log entry not found" });
      }

      const repair = repairResult.rows[0];
      if (repair.rolled_back) {
        return res.status(400).json({ error: "This repair has already been rolled back" });
      }

      if (repair.before_value !== null) {
        const tableName = getTableForContentType(repair.content_type);
        if (!tableName) {
          return res.status(400).json({ error: `Unknown content type: ${repair.content_type}` });
        }
        const columnName = getValidRollbackColumn(tableName, repair.field);
        if (!columnName) {
          return res.status(400).json({ error: `Rollback not supported for field: ${repair.field}` });
        }
        try {
          await pool.query(
            `UPDATE ${tableName} SET ${columnName} = $1 WHERE id = $2`,
            [repair.before_value, repair.content_id]
          );
        } catch (updateErr: any) {
          return res.status(500).json({ error: `Failed to rollback: ${updateErr.message}` });
        }
      }

      await pool.query(
        `UPDATE content_repair_log SET rolled_back = true, rolled_back_at = NOW(), rolled_back_by = $1
         WHERE id = $2`,
        [admin.id || admin.username, req.params.id]
      );

      res.json({ success: true, message: "Repair rolled back successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/validate", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, data } = req.body;
      if (!contentType || !data) {
        return res.status(400).json({ error: "contentType and data are required" });
      }

      const result = validateForPublish(contentType, data);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/jobs/status", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const status = getJobStatus();
      const lastRuns = await pool.query(
        `SELECT scan_type, status, total_records, issues_found, started_at, completed_at
         FROM integrity_scan_runs
         ORDER BY created_at DESC
         LIMIT 5`
      );

      res.json({ ...status, recentRuns: lastRuns.rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/jobs/start", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      startScheduledJobs();
      res.json({ success: true, message: "Scheduled jobs started" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-integrity/jobs/stop", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      stopScheduledJobs();
      res.json({ success: true, message: "Scheduled jobs stopped" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/diagnostics", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [
        questionCounts,
        flashcardCounts,
        lessonCounts,
        blogCounts,
        quarantinedQuestions,
        quarantinedReasons,
        recentRepairs,
        recentScanRuns,
        healthRecordStats,
      ] = await Promise.all([
        pool.query(`SELECT status, COUNT(*)::int as count FROM exam_questions GROUP BY status`),
        pool.query(`SELECT status, COUNT(*)::int as count FROM flashcard_bank GROUP BY status`).catch(() => ({ rows: [] })),
        pool.query(`SELECT status, COUNT(*)::int as count FROM content_items WHERE type = 'lesson' GROUP BY status`).catch(() => ({ rows: [] })),
        pool.query(`SELECT status, COUNT(*)::int as count FROM content_items WHERE type IN ('blog', 'blog-post', 'article') GROUP BY status`).catch(() => ({ rows: [] })),
        pool.query(`SELECT COUNT(*)::int as count FROM exam_questions WHERE quarantined_at IS NOT NULL`),
        pool.query(`SELECT quarantine_reason, COUNT(*)::int as count FROM exam_questions WHERE quarantined_at IS NOT NULL AND quarantine_reason IS NOT NULL GROUP BY quarantine_reason ORDER BY count DESC LIMIT 20`),
        pool.query(`SELECT content_type, repair_type, status, COUNT(*)::int as count FROM content_repair_log WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY content_type, repair_type, status ORDER BY count DESC LIMIT 50`),
        pool.query(`SELECT id, scan_type, status, total_records, scanned_records, issues_found, auto_fixable, repairs_attempted, repairs_succeeded, started_at, completed_at FROM integrity_scan_runs ORDER BY created_at DESC LIMIT 10`),
        pool.query(`SELECT content_type, severity, COUNT(*)::int as count FROM content_health_records WHERE repair_status = 'pending' GROUP BY content_type, severity ORDER BY severity, content_type`),
      ]);

      const statusToObj = (rows: any[]) => {
        const obj: Record<string, number> = {};
        for (const r of rows) obj[r.status || "unknown"] = r.count;
        return obj;
      };

      const recentRuns = recentScanRuns.rows;
      const passRate = recentRuns.length > 0
        ? recentRuns.reduce((acc: number, r: any) => {
            const total = r.total_records || 1;
            const issues = r.issues_found || 0;
            return acc + ((total - issues) / total);
          }, 0) / recentRuns.length
        : 1;

      const totalQuestions = questionCounts.rows.reduce((s: number, r: any) => s + r.count, 0);
      const totalFlashcards = flashcardCounts.rows.reduce((s: number, r: any) => s + r.count, 0);
      const totalLessons = lessonCounts.rows.reduce((s: number, r: any) => s + r.count, 0);
      const totalBlogs = blogCounts.rows.reduce((s: number, r: any) => s + r.count, 0);

      const healthScores: Record<string, number> = {};
      const pendingByType: Record<string, number> = {};
      for (const r of healthRecordStats.rows) {
        pendingByType[r.content_type] = (pendingByType[r.content_type] || 0) + r.count;
      }
      const typeToTotal: Record<string, number> = { questions: totalQuestions, flashcards: totalFlashcards, lessons: totalLessons, blogs: totalBlogs };
      for (const [ct, pending] of Object.entries(pendingByType)) {
        const total = typeToTotal[ct] || 1;
        healthScores[ct] = Math.round(((total - pending) / total) * 100);
      }

      res.json({
        contentCounts: {
          questions: statusToObj(questionCounts.rows),
          flashcards: statusToObj(flashcardCounts.rows),
          lessons: statusToObj(lessonCounts.rows),
          blogs: statusToObj(blogCounts.rows),
          totals: { questions: totalQuestions, flashcards: totalFlashcards, lessons: totalLessons, blogs: totalBlogs },
        },
        quarantine: {
          totalQuarantined: quarantinedQuestions.rows[0]?.count || 0,
          reasons: quarantinedReasons.rows,
        },
        recentRepairs: recentRepairs.rows,
        recentScanRuns: recentRuns,
        validationPassRate: Math.round(passRate * 100),
        healthScores,
        pendingIssuesByType: pendingByType,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-integrity/summary", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [issueStats, repairStats, reviewStats, lastScan] = await Promise.all([
        pool.query(
          `SELECT severity, COUNT(*) as count FROM content_health_records
           WHERE repair_status = 'pending'
           GROUP BY severity ORDER BY severity`
        ),
        pool.query(
          `SELECT status, COUNT(*) as count FROM content_repair_log
           GROUP BY status`
        ),
        pool.query(
          `SELECT status, COUNT(*) as count FROM manual_review_queue
           GROUP BY status`
        ),
        pool.query(
          `SELECT * FROM integrity_scan_runs ORDER BY created_at DESC LIMIT 1`
        ),
      ]);

      res.json({
        pendingIssues: issueStats.rows,
        repairStats: repairStats.rows,
        reviewQueueStats: reviewStats.rows,
        lastScan: lastScan.rows[0] || null,
        jobStatus: getJobStatus(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}

const ALLOWED_ROLLBACK_TABLES: Record<string, string> = {
  questions: "exam_questions",
  flashcards: "deck_flashcards",
  flashcard_decks: "flashcard_decks",
  lessons: "lessons",
  blogs: "content_items",
  media: "image_assets",
};

const ALLOWED_ROLLBACK_COLUMNS: Record<string, Set<string>> = {
  exam_questions: new Set(["rationale", "body_system", "topic", "tags", "difficulty", "cognitive_level", "distractor_rationales", "scenario", "correct_answer_explanation", "clinical_pearl"]),
  deck_flashcards: new Set(["front", "back", "tags", "rationale"]),
  lessons: new Set(["seo_title", "seo_description", "seo_keywords", "summary", "related_lesson_slugs"]),
  content_items: new Set(["meta_title", "meta_description", "primary_keyword"]),
  image_assets: new Set(["alt_text"]),
};

function getTableForContentType(contentType: string): string | null {
  return ALLOWED_ROLLBACK_TABLES[contentType] || null;
}

function getValidRollbackColumn(tableName: string, field: string): string | null {
  const snakeField = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  const allowedCols = ALLOWED_ROLLBACK_COLUMNS[tableName];
  if (!allowedCols) return null;
  if (allowedCols.has(snakeField)) return snakeField;
  if (allowedCols.has(field)) return field;
  return null;
}
