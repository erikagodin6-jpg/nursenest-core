import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  generateNursingPage,
  generateAlliedHealthPage,
  generateNewGradNursePage,
  generatePracticeQuestionPage,
  generateAlliedHealthQuestions,
  generateSocialWorkQuestions,
  generateVisualDiagram,
  generateAlliedHealthInfographic,
  generateInfographicPage,
  generatePracticeSEOPage,
  generateCourseContent,
  generateFlashcards,
  generateSEOCluster,
  generatePinterestPins,
  generateInternalLinkMap,
  generateQuestionBankProduct,
} from "./content-generators";
import { createBgJob } from "./job-queue";

const DEFAULT_ENGINES = [
  { engineKey: "blog_engine", name: "Blog Engine", description: "Generate SEO blog clusters and articles" },
  { engineKey: "question_factory", name: "Question Factory", description: "Batch generate exam questions with validation" },
  { engineKey: "visual_factory", name: "Visual Factory", description: "Generate anatomy, pathophysiology, drug, and lab diagrams" },
  { engineKey: "practice_seo", name: "Practice SEO Engine", description: "Generate practice question pages for SEO" },
  { engineKey: "pinterest_scheduler", name: "Pinterest Scheduler", description: "Schedule and publish Pinterest pins" },
  { engineKey: "social_media", name: "Social Media Engine", description: "Generate and schedule social media posts" },
  { engineKey: "course_builder", name: "Course Builder", description: "Build courses from topics with 1-click generation" },
  { engineKey: "lifecycle_email", name: "Lifecycle Email Engine", description: "Automated email sequences and triggers" },
  { engineKey: "keyword_discovery", name: "Keyword Discovery", description: "Discover and cluster keywords for content strategy" },
  { engineKey: "auto_expansion", name: "Auto Expansion", description: "Automatically expand top-performing pages" },
];

let seeded = false;

async function seedDefaultEngines(): Promise<void> {
  if (seeded) return;
  try {
    const existing = await pool.query("SELECT COUNT(*)::int AS c FROM autopilot_engines");
    if (parseInt(existing.rows[0]?.c || "0") > 0) {
      seeded = true;
      return;
    }
    for (const engine of DEFAULT_ENGINES) {
      await pool.query(
        `INSERT INTO autopilot_engines (engine_key, name, description, enabled, config)
         VALUES ($1, $2, $3, false, '{}')
         ON CONFLICT (engine_key) DO NOTHING`,
        [engine.engineKey, engine.name, engine.description]
      );
    }
    seeded = true;
  } catch (err: any) {
    console.error("[Autopilot] Seed error:", err.message);
  }
}

export async function processAutopilotJob(jobId: string, engineKey: string, payload: any): Promise<void> {
  const targetLang = payload.target_language || payload.targetLanguage || "en";
  try {
    switch (engineKey) {
      case "blog_engine":
        if (payload.contentType === "allied_health" && payload.career) {
          await generateAlliedHealthPage(
            payload.topic || "General Allied Health",
            payload.targetKeyword || payload.topic || "",
            payload.career,
            payload.wordCount || 1800,
            jobId,
            targetLang
          );
        } else if (payload.contentType === "new_grad") {
          await generateNewGradNursePage(
            payload.topic || "New Grad Nursing",
            payload.targetKeyword || payload.topic || "",
            payload.wordCount || 1500,
            jobId,
            targetLang
          );
        } else {
          await generateNursingPage(
            payload.topic || "General Nursing",
            payload.targetKeyword || payload.topic || "",
            payload.examType || "nclex-rn",
            payload.wordCount || 2000,
            jobId,
            targetLang
          );
        }
        break;

      case "question_factory":
        if (payload.contentType === "social_work") {
          await generateSocialWorkQuestions(
            payload.topic || "General Social Work",
            payload.domain || "Ethics & Professional Practice",
            payload.batchSize || 50,
            payload.difficultyDistribution || "35% Easy, 45% Moderate, 20% Hard",
            jobId,
            targetLang
          );
        } else if (payload.contentType === "allied_health" && payload.career) {
          await generateAlliedHealthQuestions(
            payload.topic || "General Allied Health",
            payload.career,
            payload.difficultyRange || "2-4",
            payload.autoValidate !== false,
            jobId,
            targetLang
          );
        } else {
          await generatePracticeQuestionPage(
            payload.topic || payload.category || "General Nursing",
            payload.category || "nursing_ngn",
            payload.batchSize || 25,
            payload.difficultyRange || "2-4",
            payload.autoValidate !== false,
            jobId,
            targetLang
          );
        }
        break;

      case "visual_factory":
        if (payload.contentType === "allied_health" && payload.career) {
          await generateAlliedHealthInfographic(
            payload.topic || "Allied Health Diagram",
            payload.career,
            payload.diagramType || payload.type || "clinical",
            jobId,
            targetLang
          );
        } else if (payload.contentType === "infographic_page") {
          await generateInfographicPage(
            payload.topic || "Infographic",
            payload.style || "clinical",
            jobId,
            targetLang
          );
        } else {
          await generateVisualDiagram(
            payload.type || "anatomy",
            payload.topic || "Heart Anatomy",
            payload.style || "clinical",
            jobId,
            targetLang
          );
        }
        break;

      case "practice_seo":
        await generatePracticeSEOPage(
          payload.title || "Practice Questions",
          payload.bodySystem || "cardiovascular",
          payload.questionCount || 10,
          payload.tier || "rn",
          jobId,
          targetLang
        );
        break;

      case "course_builder":
        if (payload.contentType === "flashcard") {
          await generateFlashcards(
            payload.topic || "Nursing Fundamentals",
            payload.exam || payload.examType || "nclex-rn",
            jobId,
            targetLang
          );
        } else if (payload.contentType === "product") {
          await generateQuestionBankProduct(
            payload.topic || "Nursing Questions",
            payload.questionCount || 250,
            payload.exam || payload.examType || "nclex-rn",
            jobId,
            targetLang
          );
        } else {
          await generateCourseContent(
            payload.topic || "Nursing Fundamentals",
            payload.exam || "nclex-rn",
            payload.difficulty || "intermediate",
            jobId,
            targetLang
          );
        }
        break;

      case "keyword_discovery":
        if (payload.contentType === "cluster") {
          await generateSEOCluster(
            payload.topic || "Nursing Topic",
            payload.targetKeyword || payload.topic || "",
            payload.examType || "nclex-rn",
            jobId,
            targetLang
          );
        } else {
          await pool.query(
            "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
            [JSON.stringify({ message: "Keyword analysis queued", keywords: payload.keywords }), jobId]
          );
        }
        break;

      case "pinterest_scheduler":
        if (payload.contentType === "generate_pins") {
          await generatePinterestPins(
            payload.topic || "Nursing Tips",
            payload.pageSlug || "",
            payload.board || "nursing-tips",
            jobId,
            targetLang
          );
        } else {
          await pool.query(
            "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
            [JSON.stringify({ message: "Pin scheduled", title: payload.title, board: payload.board }), jobId]
          );
        }
        break;

      case "auto_expansion":
        if (payload.contentType === "internal_links") {
          await generateInternalLinkMap(
            payload.pageSlug || "",
            payload.pageTitle || "",
            payload.clusterTopic || "",
            jobId,
            targetLang
          );
        } else {
          await pool.query(
            "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
            [JSON.stringify({ message: `Expansion scan queued`, mode: payload.mode }), jobId]
          );
        }
        break;

      default:
        await pool.query(
          "UPDATE autopilot_jobs SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2",
          [JSON.stringify({ message: `Job queued for ${engineKey} (manual processing required)` }), jobId]
        );
        break;
    }
  } catch (err: any) {
    console.error(`[Autopilot] processJob error for ${engineKey}:`, err.message);
  }
}

export function setupAutopilotRoutes(app: Express): void {

  app.get("/api/admin/autopilot/engines", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await seedDefaultEngines();
      const r = await pool.query("SELECT * FROM autopilot_engines ORDER BY created_at ASC");
      res.json({
        engines: r.rows.map((row: any) => ({
          id: row.id,
          engineKey: row.engine_key,
          name: row.name,
          description: row.description,
          enabled: row.enabled,
          config: row.config,
          lastRunAt: row.last_run_at,
          createdAt: row.created_at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/engines/:key/toggle", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { key } = req.params;
      const existing = await pool.query("SELECT * FROM autopilot_engines WHERE engine_key = $1", [key]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Engine not found" });

      const newEnabled = !existing.rows[0].enabled;
      const r = await pool.query(
        "UPDATE autopilot_engines SET enabled = $1 WHERE engine_key = $2 RETURNING *",
        [newEnabled, key]
      );
      const row = r.rows[0];
      res.json({
        engine: {
          id: row.id,
          engineKey: row.engine_key,
          name: row.name,
          description: row.description,
          enabled: row.enabled,
          config: row.config,
          lastRunAt: row.last_run_at,
          createdAt: row.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/autopilot/jobs", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { engineKey, status, limit = "50" } = req.query;
      let query = "SELECT * FROM autopilot_jobs WHERE 1=1";
      const params: any[] = [];
      let idx = 1;

      if (engineKey) {
        query += ` AND engine_key = $${idx++}`;
        params.push(engineKey);
      }
      if (status) {
        query += ` AND status = $${idx++}`;
        params.push(status);
      }
      query += ` ORDER BY created_at DESC LIMIT $${idx++}`;
      params.push(Math.min(parseInt(String(limit)) || 50, 200));

      const r = await pool.query(query, params);
      res.json({
        jobs: r.rows.map((row: any) => ({
          id: row.id,
          engineKey: row.engine_key,
          status: row.status,
          payload: row.payload,
          result: row.result,
          error: row.error,
          startedAt: row.started_at,
          completedAt: row.completed_at,
          scheduledFor: row.scheduled_for,
          createdAt: row.created_at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/jobs", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { engineKey, payload, scheduledFor } = req.body as any;
      if (!engineKey) {
        return res.status(400).json({ error: "engineKey is required" });
      }

      const engineCheck = await pool.query("SELECT id FROM autopilot_engines WHERE engine_key = $1", [engineKey]);
      if (!engineCheck.rows[0]) {
        return res.status(404).json({ error: "Engine not found" });
      }

      const r = await pool.query(
        `INSERT INTO autopilot_jobs (engine_key, status, payload, scheduled_for)
         VALUES ($1, 'queued', $2, $3) RETURNING *`,
        [engineKey, JSON.stringify(payload || {}), scheduledFor || null]
      );

      const row = r.rows[0];
      const jobId = row.id;

      if (!scheduledFor) {
        processAutopilotJob(jobId, engineKey, payload || {}).catch((err) => {
          console.error(`[Autopilot] Job ${jobId} (${engineKey}) failed:`, err.message);
        });
      }

      res.json({
        job: {
          id: row.id,
          engineKey: row.engine_key,
          status: row.status,
          payload: row.payload,
          result: row.result,
          error: row.error,
          startedAt: row.started_at,
          completedAt: row.completed_at,
          scheduledFor: row.scheduled_for,
          createdAt: row.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/jobs/batch", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { jobs } = req.body as any;
      if (!Array.isArray(jobs) || jobs.length === 0) {
        return res.status(400).json({ error: "jobs array is required" });
      }
      if (jobs.length > 50) {
        return res.status(400).json({ error: "Maximum 50 jobs per batch" });
      }

      const created: any[] = [];
      for (const job of jobs) {
        const { engineKey, payload } = job;
        if (!engineKey) continue;

        const engineCheck = await pool.query("SELECT id FROM autopilot_engines WHERE engine_key = $1", [engineKey]);
        if (!engineCheck.rows[0]) continue;

        const r = await pool.query(
          `INSERT INTO autopilot_jobs (engine_key, status, payload)
           VALUES ($1, 'queued', $2) RETURNING *`,
          [engineKey, JSON.stringify(payload || {})]
        );

        const row = r.rows[0];
        created.push({ id: row.id, engineKey: row.engine_key, status: row.status });

        processAutopilotJob(row.id, engineKey, payload || {}).catch((err) => {
          console.error(`[Autopilot Batch] Job ${row.id} (${engineKey}) failed:`, err.message);
        });
      }

      res.json({ created: created.length, jobs: created });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/autopilot/queue", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { status, contentType, limit = "50" } = req.query;
      let query = "SELECT * FROM publishing_queue WHERE 1=1";
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
      query += ` ORDER BY created_at DESC LIMIT $${idx++}`;
      params.push(Math.min(parseInt(String(limit)) || 50, 200));

      const r = await pool.query(query, params);
      res.json({
        items: r.rows.map((row: any) => ({
          id: row.id,
          engineKey: row.engine_key,
          contentType: row.content_type,
          title: row.title,
          content: row.content,
          status: row.status,
          previewUrl: row.preview_url,
          metadata: row.metadata,
          createdBy: row.created_by,
          approvedBy: row.approved_by,
          publishedAt: row.published_at,
          createdAt: row.created_at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/queue/:id/approve", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT id, status FROM publishing_queue WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Queue item not found" });

      if (existing.rows[0].status !== "pending_review" && existing.rows[0].status !== "draft") {
        return res.status(400).json({ error: "Item is not in a reviewable state" });
      }

      const r = await pool.query(
        "UPDATE publishing_queue SET status = 'approved', approved_by = $1 WHERE id = $2 RETURNING *",
        [admin.id, id]
      );
      const row = r.rows[0];
      res.json({
        item: {
          id: row.id,
          engineKey: row.engine_key,
          contentType: row.content_type,
          title: row.title,
          status: row.status,
          approvedBy: row.approved_by,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/queue/:id/reject", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT id, status FROM publishing_queue WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Queue item not found" });

      const r = await pool.query(
        "UPDATE publishing_queue SET status = 'rejected' WHERE id = $1 RETURNING *",
        [id]
      );
      const row = r.rows[0];
      res.json({
        item: {
          id: row.id,
          engineKey: row.engine_key,
          contentType: row.content_type,
          title: row.title,
          status: row.status,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/queue/:id/publish", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT id, status FROM publishing_queue WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Queue item not found" });

      if (existing.rows[0].status !== "approved") {
        return res.status(400).json({ error: "Item must be approved before publishing" });
      }

      const r = await pool.query(
        "UPDATE publishing_queue SET status = 'published', published_at = NOW() WHERE id = $1 RETURNING *",
        [id]
      );
      const row = r.rows[0];
      res.json({
        item: {
          id: row.id,
          engineKey: row.engine_key,
          contentType: row.content_type,
          title: row.title,
          status: row.status,
          publishedAt: row.published_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/autopilot/schedules", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const r = await pool.query("SELECT * FROM autopilot_schedules ORDER BY created_at DESC");
      res.json({
        schedules: r.rows.map((row: any) => ({
          id: row.id,
          engineKey: row.engine_key,
          frequency: row.frequency,
          cronExpression: row.cron_expression,
          enabled: row.enabled,
          config: row.config,
          nextRunAt: row.next_run_at,
          lastRunAt: row.last_run_at,
          createdAt: row.created_at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/schedules", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id, engineKey, frequency, cronExpression, enabled, config, nextRunAt } = req.body as any;
      if (!engineKey || !frequency) {
        return res.status(400).json({ error: "engineKey and frequency are required" });
      }

      if (id) {
        const existing = await pool.query("SELECT id FROM autopilot_schedules WHERE id = $1", [id]);
        if (existing.rows[0]) {
          const r = await pool.query(
            `UPDATE autopilot_schedules SET
              engine_key = $1, frequency = $2, cron_expression = $3,
              enabled = $4, config = $5, next_run_at = $6
            WHERE id = $7 RETURNING *`,
            [engineKey, frequency, cronExpression || null, !!enabled, JSON.stringify(config || {}), nextRunAt || null, id]
          );
          const row = r.rows[0];
          return res.json({
            schedule: {
              id: row.id,
              engineKey: row.engine_key,
              frequency: row.frequency,
              cronExpression: row.cron_expression,
              enabled: row.enabled,
              config: row.config,
              nextRunAt: row.next_run_at,
              lastRunAt: row.last_run_at,
              createdAt: row.created_at,
            },
          });
        }
      }

      const r = await pool.query(
        `INSERT INTO autopilot_schedules (engine_key, frequency, cron_expression, enabled, config, next_run_at)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [engineKey, frequency, cronExpression || null, !!enabled, JSON.stringify(config || {}), nextRunAt || null]
      );
      const row = r.rows[0];
      res.json({
        schedule: {
          id: row.id,
          engineKey: row.engine_key,
          frequency: row.frequency,
          cronExpression: row.cron_expression,
          enabled: row.enabled,
          config: row.config,
          nextRunAt: row.next_run_at,
          lastRunAt: row.last_run_at,
          createdAt: row.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/schedules/:id/toggle", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT * FROM autopilot_schedules WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Schedule not found" });

      const newEnabled = !existing.rows[0].enabled;
      const r = await pool.query(
        "UPDATE autopilot_schedules SET enabled = $1 WHERE id = $2 RETURNING *",
        [newEnabled, id]
      );
      const row = r.rows[0];
      res.json({
        schedule: {
          id: row.id,
          engineKey: row.engine_key,
          frequency: row.frequency,
          cronExpression: row.cron_expression,
          enabled: row.enabled,
          config: row.config,
          nextRunAt: row.next_run_at,
          lastRunAt: row.last_run_at,
          createdAt: row.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/jobs/bg", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { engineKey, payload, totalItems, batchSize, priority } = req.body as any;
      if (!engineKey) return res.status(400).json({ error: "engineKey is required" });

      const jobId = await createBgJob({
        type: "autopilot_content",
        engineKey,
        payload: { ...payload, engineKey },
        totalItems: totalItems || 1,
        batchSize: batchSize || 1,
        priority: priority || 0,
        createdBy: admin.id,
      });

      res.json({ jobId, status: "queued", message: "Background job created" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/autopilot/stats", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await seedDefaultEngines();

      const enginesResult = await pool.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE enabled = true)::int AS active FROM autopilot_engines");
      const jobsResult = await pool.query(`
        SELECT
          COUNT(*)::int AS total_jobs,
          COUNT(*) FILTER (WHERE status = 'queued')::int AS queued,
          COUNT(*) FILTER (WHERE status = 'running')::int AS running,
          COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
          COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
          COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled
        FROM autopilot_jobs
      `);
      const queueResult = await pool.query(`
        SELECT
          COUNT(*)::int AS total_items,
          COUNT(*) FILTER (WHERE status = 'draft')::int AS draft,
          COUNT(*) FILTER (WHERE status = 'pending_review')::int AS pending_review,
          COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
          COUNT(*) FILTER (WHERE status = 'published')::int AS published,
          COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
        FROM publishing_queue
      `);
      const schedulesResult = await pool.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE enabled = true)::int AS active FROM autopilot_schedules");

      const recentJobsResult = await pool.query(
        "SELECT * FROM autopilot_jobs ORDER BY created_at DESC LIMIT 10"
      );

      const engines = enginesResult.rows[0] || {};
      const jobs = jobsResult.rows[0] || {};
      const queue = queueResult.rows[0] || {};
      const schedules = schedulesResult.rows[0] || {};

      res.json({
        engines: {
          total: engines.total || 0,
          active: engines.active || 0,
        },
        jobs: {
          total: jobs.total_jobs || 0,
          queued: jobs.queued || 0,
          running: jobs.running || 0,
          completed: jobs.completed || 0,
          failed: jobs.failed || 0,
          cancelled: jobs.cancelled || 0,
        },
        queue: {
          total: queue.total_items || 0,
          draft: queue.draft || 0,
          pendingReview: queue.pending_review || 0,
          approved: queue.approved || 0,
          published: queue.published || 0,
          rejected: queue.rejected || 0,
        },
        schedules: {
          total: schedules.total || 0,
          active: schedules.active || 0,
        },
        recentJobs: recentJobsResult.rows.map((row: any) => ({
          id: row.id,
          engineKey: row.engine_key,
          status: row.status,
          createdAt: row.created_at,
          completedAt: row.completed_at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/autopilot/queue/validation-failures", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const offset = (page - 1) * limit;

      const countResult = await pool.query(
        `SELECT COUNT(*)::int as total FROM publishing_queue
         WHERE status = 'validation_failed'
            OR metadata->>'validation_status' = 'validation_failed'`
      );
      const total = countResult.rows[0]?.total || 0;

      const result = await pool.query(
        `SELECT id, engine_key, content_type, title, content, status,
                preview_url, metadata, created_by, approved_by,
                published_at, created_at
         FROM publishing_queue
         WHERE status = 'validation_failed'
            OR metadata->>'validation_status' = 'validation_failed'
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      res.json({
        items: result.rows.map((row: any) => ({
          id: row.id,
          engineKey: row.engine_key,
          contentType: row.content_type,
          title: row.title,
          content: row.content,
          status: row.status,
          previewUrl: row.preview_url,
          metadata: row.metadata,
          createdBy: row.created_by,
          approvedBy: row.approved_by,
          publishedAt: row.published_at,
          createdAt: row.created_at,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/queue/:id/approve-validation", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT id, status, metadata FROM publishing_queue WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Queue item not found" });

      const row = existing.rows[0];
      if (row.status !== "validation_failed" && row.metadata?.validation_status !== "validation_failed") {
        return res.status(400).json({ error: "Item is not in validation_failed state" });
      }

      const r = await pool.query(
        `UPDATE publishing_queue
         SET status = 'approved',
             approved_by = $1,
             metadata = jsonb_set(
               COALESCE(metadata, '{}'::jsonb),
               '{validation_status}',
               '"manually_approved"'
             )
         WHERE id = $2 RETURNING *`,
        [admin.id, id]
      );

      const updated = r.rows[0];
      res.json({
        item: {
          id: updated.id,
          engineKey: updated.engine_key,
          contentType: updated.content_type,
          title: updated.title,
          status: updated.status,
          approvedBy: updated.approved_by,
          metadata: updated.metadata,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/autopilot/queue/:id/regenerate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT id, status, metadata, engine_key, content_type FROM publishing_queue WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Queue item not found" });

      const row = existing.rows[0];
      if (row.status !== "validation_failed" && row.metadata?.validation_status !== "validation_failed") {
        return res.status(400).json({ error: "Item is not in validation_failed state" });
      }

      await pool.query(
        `UPDATE publishing_queue
         SET status = 'rejected',
             metadata = jsonb_set(
               COALESCE(metadata, '{}'::jsonb),
               '{validation_status}',
               '"rejected_for_regeneration"'
             )
         WHERE id = $1`,
        [id]
      );

      res.json({ message: "Item rejected for regeneration", id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
