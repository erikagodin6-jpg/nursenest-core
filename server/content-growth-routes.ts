import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  ensureTables,
  analyzeContentGaps,
  executeContentGrowthRun,
  startContentGrowthScheduler,
  stopContentGrowthScheduler,
} from "./content-growth-engine";

export function setupContentGrowthRoutes(app: Express): void {
  ensureTables().catch(err => console.error("[ContentGrowth] Table init error:", err.message));

  app.get("/api/admin/content-growth/schedules", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const r = await pool.query("SELECT * FROM content_growth_schedules ORDER BY created_at DESC");
      res.json({ schedules: r.rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-growth/schedules", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { contentType, cadence = "daily", enabled = false, itemsPerRun = 5, runTimeHour = 3, maxDailyRuns = 1, priorityTopics = [], targetTier = "rn" } = req.body;

      if (!contentType) {
        return res.status(400).json({ error: "contentType is required" });
      }

      const validTypes = ["blog_post", "flashcards", "lessons", "exam_questions", "specialty_guides"];
      if (!validTypes.includes(contentType)) {
        return res.status(400).json({ error: `Invalid contentType. Must be one of: ${validTypes.join(", ")}` });
      }

      const nextRunAt = enabled ? calculateNextRunAt(cadence, runTimeHour) : null;

      const r = await pool.query(
        `INSERT INTO content_growth_schedules (content_type, cadence, enabled, items_per_run, run_time_hour, max_daily_runs, priority_topics, target_tier, next_run_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [contentType, cadence, enabled, itemsPerRun, runTimeHour, maxDailyRuns, priorityTopics, targetTier, nextRunAt]
      );

      res.json({ schedule: r.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/content-growth/schedules/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const { cadence, enabled, itemsPerRun, runTimeHour, maxDailyRuns, priorityTopics, targetTier } = req.body;

      const existing = await pool.query("SELECT * FROM content_growth_schedules WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Schedule not found" });

      const current = existing.rows[0];
      const newEnabled = enabled ?? current.enabled;
      const newCadence = cadence ?? current.cadence;
      const newRunTimeHour = runTimeHour ?? current.run_time_hour;

      const nextRunAt = newEnabled ? calculateNextRunAt(newCadence, newRunTimeHour) : null;

      const r = await pool.query(
        `UPDATE content_growth_schedules SET
          cadence = COALESCE($1, cadence),
          enabled = COALESCE($2, enabled),
          items_per_run = COALESCE($3, items_per_run),
          run_time_hour = COALESCE($4, run_time_hour),
          max_daily_runs = COALESCE($5, max_daily_runs),
          priority_topics = COALESCE($6, priority_topics),
          target_tier = COALESCE($7, target_tier),
          next_run_at = $8,
          updated_at = NOW()
        WHERE id = $9 RETURNING *`,
        [cadence, enabled, itemsPerRun, runTimeHour, maxDailyRuns, priorityTopics, targetTier, nextRunAt, id]
      );

      res.json({ schedule: r.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/content-growth/schedules/:id/toggle", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT * FROM content_growth_schedules WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Schedule not found" });

      const current = existing.rows[0];
      const newEnabled = !current.enabled;
      const nextRunAt = newEnabled
        ? calculateNextRunAt(current.cadence || "daily", current.run_time_hour ?? 3)
        : null;

      const r = await pool.query(
        "UPDATE content_growth_schedules SET enabled = $1, next_run_at = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
        [newEnabled, nextRunAt, id]
      );

      res.json({ schedule: r.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/content-growth/schedules/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const r = await pool.query("DELETE FROM content_growth_schedules WHERE id = $1 RETURNING id", [id]);
      if (!r.rows[0]) return res.status(404).json({ error: "Schedule not found" });
      res.json({ deleted: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-growth/runs", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const limit = Math.min(parseInt(String(req.query.limit || "50")), 200);
      const status = req.query.status as string | undefined;
      const contentType = req.query.contentType as string | undefined;

      let query = "SELECT * FROM content_growth_runs WHERE 1=1";
      const params: any[] = [];
      let idx = 1;

      if (status) {
        query += ` AND status = $${idx++}`;
        params.push(status);
      }
      if (contentType) {
        query += ` AND content_type = $${idx++}`;
        params.push(contentType);
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx}`;
      params.push(limit);

      const r = await pool.query(query, params);
      res.json({ runs: r.rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-growth/runs", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { contentType, targetCount = 5, scheduleId, targetTier = "rn" } = req.body;

      if (!contentType) {
        return res.status(400).json({ error: "contentType is required" });
      }

      const validTypes = ["blog_post", "flashcards", "lessons", "exam_questions", "specialty_guides"];
      if (!validTypes.includes(contentType)) {
        return res.status(400).json({ error: `Invalid contentType. Must be one of: ${validTypes.join(", ")}` });
      }

      const r = await pool.query(
        `INSERT INTO content_growth_runs (schedule_id, content_type, target_tier, status, target_count, triggered_by)
         VALUES ($1, $2, $3, 'queued', $4, 'manual') RETURNING *`,
        [scheduleId || null, contentType, targetTier || 'rn', Math.min(targetCount, 20)]
      );

      const run = r.rows[0];

      executeContentGrowthRun(run.id).catch(err => {
        console.error(`[ContentGrowth] Manual run failed:`, err.message);
      });

      res.json({ run, message: "Content generation run started" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-growth/runs/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const r = await pool.query("SELECT * FROM content_growth_runs WHERE id = $1", [req.params.id]);
      if (!r.rows[0]) return res.status(404).json({ error: "Run not found" });
      res.json({ run: r.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-growth/gap-analysis", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const analysis = await analyzeContentGaps();
      res.json(analysis);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-growth/stats", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const scheduleStats = await pool.query(`
        SELECT
          COUNT(*)::int as total_schedules,
          COUNT(*) FILTER (WHERE enabled = true)::int as active_schedules
        FROM content_growth_schedules
      `);

      const runStats = await pool.query(`
        SELECT
          COUNT(*)::int as total_runs,
          COUNT(*) FILTER (WHERE status = 'completed')::int as completed_runs,
          COUNT(*) FILTER (WHERE status = 'failed')::int as failed_runs,
          COUNT(*) FILTER (WHERE status = 'running')::int as running_runs,
          COUNT(*) FILTER (WHERE status = 'queued')::int as queued_runs,
          COALESCE(SUM(generated_count), 0)::int as total_generated,
          COALESCE(SUM(accepted_count), 0)::int as total_accepted,
          COALESCE(SUM(rejected_count), 0)::int as total_rejected
        FROM content_growth_runs
      `);

      const recentRuns = await pool.query(
        "SELECT * FROM content_growth_runs ORDER BY created_at DESC LIMIT 10"
      );

      const draftContent = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'draft')::int as draft_count,
          COUNT(*) FILTER (WHERE status = 'needs_review')::int as needs_review_count,
          COUNT(*) FILTER (WHERE status = 'published')::int as published_count
        FROM content_items
        WHERE updated_by_ai = true
      `);

      const pendingFlashcards = await pool.query(
        "SELECT COUNT(*)::int as c FROM flashcard_bank WHERE status = 'needs_review'"
      );

      const pendingQuestions = await pool.query(
        "SELECT COUNT(*)::int as c FROM exam_questions WHERE status = 'needs_review'"
      );

      res.json({
        schedules: scheduleStats.rows[0],
        runs: runStats.rows[0],
        recentRuns: recentRuns.rows,
        pendingReview: {
          contentItems: draftContent.rows[0],
          flashcards: pendingFlashcards.rows[0]?.c || 0,
          examQuestions: pendingQuestions.rows[0]?.c || 0,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-growth/pending-drafts", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const limit = Math.min(parseInt(String(req.query.limit || "50")), 200);
      const type = req.query.type as string | undefined;

      let query = "SELECT id, title, slug, type, body_system, status, summary, seo_title, tags, created_at, updated_at FROM content_items WHERE status IN ('draft', 'needs_review') AND updated_by_ai = true";
      const params: any[] = [];
      let idx = 1;

      if (type) {
        query += ` AND type = $${idx++}`;
        params.push(type);
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx}`;
      params.push(limit);

      const r = await pool.query(query, params);
      res.json({ drafts: r.rows, total: r.rows.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/content-growth/drafts/:id/approve", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const r = await pool.query(
        "UPDATE content_items SET status = 'published', published_at = NOW(), updated_at = NOW() WHERE id = $1 AND status IN ('draft', 'needs_review') RETURNING id, title, status",
        [id]
      );
      if (!r.rows[0]) return res.status(404).json({ error: "Draft not found or already published" });
      res.json({ item: r.rows[0], message: "Content approved and published" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/content-growth/drafts/:id/reject", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const { reason } = req.body;
      const r = await pool.query(
        "UPDATE content_items SET status = 'rejected', updated_at = NOW() WHERE id = $1 AND status IN ('draft', 'needs_review') RETURNING id, title, status",
        [id]
      );
      if (!r.rows[0]) return res.status(404).json({ error: "Draft not found or already processed" });
      res.json({ item: r.rows[0], message: "Content rejected" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-growth/scheduler/start", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    startContentGrowthScheduler();
    res.json({ message: "Content growth scheduler started" });
  });

  app.post("/api/admin/content-growth/scheduler/stop", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    stopContentGrowthScheduler();
    res.json({ message: "Content growth scheduler stopped" });
  });
}

function calculateNextRunAt(cadence: string, runTimeHour: number): Date {
  const now = new Date();
  const next = new Date(now);
  next.setUTCMinutes(0, 0, 0);
  next.setUTCHours(runTimeHour);

  if (next <= now) {
    next.setUTCDate(next.getUTCDate() + 1);
  }

  if (cadence === "weekly") {
    const dayOfWeek = next.getUTCDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    if (daysUntilMonday > 0) {
      next.setUTCDate(next.getUTCDate() + daysUntilMonday);
    }
  }

  return next;
}
