import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { checkAiLimits } from "./ai-safety";

const WORKER_ID = `worker_${process.pid}_${Date.now()}`;
const POLL_INTERVAL_MS = 5000;
const STALE_HEARTBEAT_MS = 120000;

interface JobQueueSettings {
  maxParentJobs: number;
  maxChildBatchesPerJob: number;
  maxRequestsPerProvider: number;
  defaultBatchSize: number;
  retryLimit: number;
  retryBackoffMs: number;
  maxRuntimePerBatch: number;
  stalledJobTimeoutMs: number;
}

const DEFAULT_SETTINGS: JobQueueSettings = {
  maxParentJobs: 5,
  maxChildBatchesPerJob: 3,
  maxRequestsPerProvider: 10,
  defaultBatchSize: 50,
  retryLimit: 3,
  retryBackoffMs: 5000,
  maxRuntimePerBatch: 300000,
  stalledJobTimeoutMs: STALE_HEARTBEAT_MS,
};

let currentSettings: JobQueueSettings = { ...DEFAULT_SETTINGS };
let workerInterval: NodeJS.Timeout | null = null;
let isProcessing = false;

async function loadSettings(): Promise<JobQueueSettings> {
  try {
    const r = await pool.query("SELECT value FROM bg_job_settings WHERE key = 'queue_config'");
    if (r.rows[0]?.value) {
      const stored = typeof r.rows[0].value === "string" ? JSON.parse(r.rows[0].value) : r.rows[0].value;
      currentSettings = { ...DEFAULT_SETTINGS, ...stored };
    }
  } catch (err: any) {
    console.warn("[JobQueue] Failed to load settings, using defaults:", err.message);
  }
  return currentSettings;
}

async function saveSettings(settings: Partial<JobQueueSettings>): Promise<JobQueueSettings> {
  currentSettings = { ...currentSettings, ...settings };
  await pool.query(
    `INSERT INTO bg_job_settings (key, value, updated_at)
     VALUES ('queue_config', $1, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
    [JSON.stringify(currentSettings)]
  );
  return currentSettings;
}

export async function createBgJob(params: {
  type: string;
  engineKey?: string;
  payload?: any;
  totalItems?: number;
  batchSize?: number;
  concurrencyLimit?: number;
  createdBy?: string;
  priority?: number;
}): Promise<string> {
  const settings = await loadSettings();
  const batchSize = params.batchSize || settings.defaultBatchSize;
  const totalItems = params.totalItems || 0;
  const totalBatches = totalItems > 0 ? Math.ceil(totalItems / batchSize) : 1;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const r = await client.query(
      `INSERT INTO bg_jobs (type, engine_key, status, priority, payload, total_items, batch_size, concurrency_limit, total_batches, created_by)
       VALUES ($1, $2, 'queued', $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        params.type,
        params.engineKey || null,
        params.priority || 0,
        JSON.stringify(params.payload || {}),
        totalItems,
        batchSize,
        params.concurrencyLimit || settings.maxChildBatchesPerJob,
        totalBatches,
        params.createdBy || null,
      ]
    );
    const jobId = r.rows[0].id;

    if (totalItems > 0) {
      for (let i = 0; i < totalBatches; i++) {
        const batchItemCount = Math.min(batchSize, totalItems - i * batchSize);
        await client.query(
          `INSERT INTO bg_job_batches (job_id, batch_index, status, total_items, max_retries, payload)
           VALUES ($1, $2, 'queued', $3, $4, $5)`,
          [
            jobId,
            i,
            batchItemCount,
            settings.retryLimit,
            JSON.stringify({ ...params.payload, batchIndex: i, batchItemCount }),
          ]
        );
      }
    } else {
      await client.query(
        `INSERT INTO bg_job_batches (job_id, batch_index, status, total_items, max_retries, payload)
         VALUES ($1, 0, 'queued', 0, $2, $3)`,
        [jobId, settings.retryLimit, JSON.stringify(params.payload || {})]
      );
    }

    await client.query("COMMIT");
    console.log(`[JobQueue] Created job ${jobId} (${params.type}) with ${totalBatches} batches`);
    return jobId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function claimNextJob(): Promise<any | null> {
  const settings = currentSettings;

  const r = await pool.query(
    `UPDATE bg_jobs SET status = 'running', claimed_by = $1, started_at = COALESCE(started_at, NOW()), heartbeat_at = NOW()
     WHERE id = (
       SELECT j.id FROM bg_jobs j
       WHERE j.status = 'queued'
         AND (SELECT COUNT(*) FROM bg_jobs WHERE status = 'running') < $2
       ORDER BY j.priority DESC, j.created_at ASC
       LIMIT 1
       FOR UPDATE OF j SKIP LOCKED
     ) RETURNING *`,
    [WORKER_ID, settings.maxParentJobs]
  );

  return r.rows[0] || null;
}

async function claimNextBatch(jobId: string): Promise<any | null> {
  const settings = currentSettings;

  const r = await pool.query(
    `UPDATE bg_job_batches SET status = 'running', claimed_by = $1, started_at = COALESCE(started_at, NOW()), heartbeat_at = NOW()
     WHERE id = (
       SELECT b.id FROM bg_job_batches b
       WHERE b.job_id = $2 AND b.status = 'queued'
         AND (SELECT COUNT(*) FROM bg_job_batches WHERE job_id = $2 AND status = 'running') < $3
       ORDER BY b.batch_index ASC
       LIMIT 1
       FOR UPDATE OF b SKIP LOCKED
     ) RETURNING *`,
    [WORKER_ID, jobId, settings.maxChildBatchesPerJob]
  );

  return r.rows[0] || null;
}

async function updateHeartbeat(jobId: string, batchId?: string): Promise<void> {
  await pool.query("UPDATE bg_jobs SET heartbeat_at = NOW() WHERE id = $1", [jobId]);
  if (batchId) {
    await pool.query("UPDATE bg_job_batches SET heartbeat_at = NOW() WHERE id = $1", [batchId]);
  }
}

export async function saveJobItem(params: {
  jobId: string;
  batchId: string;
  itemIndex: number;
  contentType: string;
  contentPayload: any;
}): Promise<string> {
  const r = await pool.query(
    `INSERT INTO bg_job_items (job_id, batch_id, item_index, status, content_type, content_payload, saved_at)
     VALUES ($1, $2, $3, 'completed', $4, $5, NOW()) RETURNING id`,
    [params.jobId, params.batchId, params.itemIndex, params.contentType, JSON.stringify(params.contentPayload)]
  );

  await pool.query(
    "UPDATE bg_job_batches SET completed_items = completed_items + 1 WHERE id = $1",
    [params.batchId]
  );
  await pool.query(
    "UPDATE bg_jobs SET completed_items = completed_items + 1 WHERE id = $1",
    [params.jobId]
  );

  return r.rows[0].id;
}

async function completeBatch(batchId: string, result?: any): Promise<void> {
  await pool.query(
    `UPDATE bg_job_batches SET status = 'completed', result = $1, completed_at = NOW() WHERE id = $2`,
    [JSON.stringify(result || {}), batchId]
  );

  const batch = await pool.query("SELECT job_id FROM bg_job_batches WHERE id = $1", [batchId]);
  if (batch.rows[0]) {
    await pool.query(
      "UPDATE bg_jobs SET completed_batches = completed_batches + 1 WHERE id = $1",
      [batch.rows[0].job_id]
    );
  }
}

async function failBatch(batchId: string, error: string): Promise<void> {
  const batch = await pool.query("SELECT * FROM bg_job_batches WHERE id = $1", [batchId]);
  if (!batch.rows[0]) return;

  const b = batch.rows[0];
  const retryCount = (b.retry_count || 0) + 1;
  const maxRetries = b.max_retries || currentSettings.retryLimit;

  if (retryCount < maxRetries) {
    await pool.query(
      `UPDATE bg_job_batches SET status = 'queued', retry_count = $1, error = $2, claimed_by = NULL, heartbeat_at = NULL WHERE id = $3`,
      [retryCount, error, batchId]
    );
    console.log(`[JobQueue] Batch ${batchId} failed (attempt ${retryCount}/${maxRetries}), requeued`);
  } else {
    await pool.query(
      `UPDATE bg_job_batches SET status = 'failed', retry_count = $1, error = $2, completed_at = NOW() WHERE id = $3`,
      [retryCount, error, batchId]
    );
    await pool.query(
      "UPDATE bg_jobs SET failed_batches = failed_batches + 1 WHERE id = $1",
      [b.job_id]
    );
    console.log(`[JobQueue] Batch ${batchId} failed permanently after ${retryCount} attempts`);
  }
}

async function checkJobCompletion(jobId: string): Promise<void> {
  const r = await pool.query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status = 'completed')::int AS done,
       COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
       COUNT(*) FILTER (WHERE status IN ('queued', 'running'))::int AS pending
     FROM bg_job_batches WHERE job_id = $1`,
    [jobId]
  );

  const { done, failed, pending } = r.rows[0];

  if (pending === 0) {
    const finalStatus = failed > 0 && done === 0 ? "failed" : failed > 0 ? "partial" : "completed";
    await pool.query(
      `UPDATE bg_jobs SET status = $1, completed_at = NOW() WHERE id = $2 AND status NOT IN ('cancelled', 'paused')`,
      [finalStatus, jobId]
    );
    console.log(`[JobQueue] Job ${jobId} finished: ${finalStatus} (${done} done, ${failed} failed)`);
  }
}

async function detectStalledJobs(): Promise<void> {
  const threshold = new Date(Date.now() - currentSettings.stalledJobTimeoutMs);

  const stalledBatches = await pool.query(
    `UPDATE bg_job_batches SET status = 'queued', claimed_by = NULL, heartbeat_at = NULL
     WHERE status = 'running' AND heartbeat_at < $1 RETURNING id, job_id`,
    [threshold]
  );

  if (stalledBatches.rows.length > 0) {
    console.log(`[JobQueue] Recovered ${stalledBatches.rows.length} stalled batches`);
  }

  const stalledJobs = await pool.query(
    `SELECT id FROM bg_jobs WHERE status = 'running' AND heartbeat_at < $1`,
    [threshold]
  );

  for (const job of stalledJobs.rows) {
    const hasPending = await pool.query(
      "SELECT COUNT(*)::int AS c FROM bg_job_batches WHERE job_id = $1 AND status IN ('queued', 'running')",
      [job.id]
    );
    if (parseInt(hasPending.rows[0].c) === 0) {
      await checkJobCompletion(job.id);
    } else {
      await pool.query("UPDATE bg_jobs SET heartbeat_at = NOW() WHERE id = $1", [job.id]);
    }
  }
}

async function processBatch(job: any, batch: any): Promise<void> {
  const batchPayload =
    typeof batch.payload === "string"
      ? JSON.parse(batch.payload)
      : batch.payload || {};

  try {
    const check = await checkAiLimits({ role: "admin" });

    if (!check.allowed) {
      await failBatch(batch.id, `AI safety limit: ${check.reason}`);
      return;
    }

    const jobStatus = await pool.query("SELECT status FROM bg_jobs WHERE id = $1", [job.id]);

    if (
      !jobStatus.rows[0] ||
      jobStatus.rows[0].status === "paused" ||
      jobStatus.rows[0].status === "cancelled"
    ) {
      await pool.query(
        "UPDATE bg_job_batches SET status = 'queued', claimed_by = NULL WHERE id = $1",
        [batch.id]
      );
      return;
    }

    await updateHeartbeat(job.id, batch.id);

    const handler = getJobHandler(job.type);
    if (!handler) {
      await failBatch(batch.id, `No handler for job type: ${job.type}`);
      return;
    }

    await handler(job, batch, batchPayload);
    await completeBatch(batch.id, { processedAt: new Date().toISOString() });
  } catch (err: any) {
    const retryCount = batch.retry_count || 0;
    const backoffMs = currentSettings.retryBackoffMs * Math.pow(2, retryCount);
    console.error(`[JobQueue] Batch ${batch.id} error (backoff ${backoffMs}ms):`, err.message);

    if (retryCount < (batch.max_retries || currentSettings.retryLimit)) {
      await new Promise(resolve => setTimeout(resolve, Math.min(backoffMs, 30000)));
    }
    await failBatch(batch.id, err.message || "Unknown error");
  }
}

type JobHandler = (job: any, batch: any, payload: any) => Promise<void>;
const jobHandlers: Map<string, JobHandler> = new Map();

export function registerJobHandler(type: string, handler: JobHandler): void {
  jobHandlers.set(type, handler);
}

function getJobHandler(type: string): JobHandler | undefined {
  return jobHandlers.get(type);
}

async function pollAndProcess(): Promise<void> {
  if (isProcessing) return;

  try {
    const { shouldPauseBackgroundJobs } = await import("./memory-monitor");
    if (shouldPauseBackgroundJobs()) {
      console.warn("[JobQueue] Skipping poll cycle: memory pressure active");
      return;
    }
  } catch {}

  isProcessing = true;

  try {
    let memoryPaused = false;
    try {
      const { shouldPauseBackgroundJobs, isMemoryProtectionActive } = await import("./memory-monitor");
      if (shouldPauseBackgroundJobs() || isMemoryProtectionActive()) {
        memoryPaused = true;
        console.log("[JobQueue] Skipping poll — memory pressure active, deferring work");
      }
    } catch {}

    await loadSettings();
    await detectStalledJobs();

    if (memoryPaused) {
      return;
    }

    const runningJobs = await pool.query(
      "SELECT * FROM bg_jobs WHERE status = 'running' ORDER BY priority DESC, started_at ASC"
    );

    for (const job of runningJobs.rows) {
      await updateHeartbeat(job.id);

      const batch = await claimNextBatch(job.id);
      if (batch) {
        processBatch(job, batch).then(() => checkJobCompletion(job.id)).catch((e) => {
          console.error(`[JobQueue] Processing error:`, e.message);
          checkJobCompletion(job.id).catch(() => {});
        });
      } else {
        await checkJobCompletion(job.id);
      }
    }

    const newJob = await claimNextJob();
    if (newJob) {
      const batch = await claimNextBatch(newJob.id);
      if (batch) {
        processBatch(newJob, batch).then(() => checkJobCompletion(newJob.id)).catch((e) => {
          console.error(`[JobQueue] Processing error:`, e.message);
          checkJobCompletion(newJob.id).catch(() => {});
        });
      }
    }
  } catch (err: any) {
    console.error("[JobQueue] Poll error:", err.message);
  } finally {
    isProcessing = false;
  }
}

export async function getJobQueueDepth(): Promise<{ queued: number; running: number; total: number }> {
  try {
    const r = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'queued')::int AS queued,
        COUNT(*) FILTER (WHERE status = 'running')::int AS running,
        COUNT(*)::int AS total
      FROM bg_jobs WHERE status IN ('queued', 'running')
    `);
    return r.rows[0] || { queued: 0, running: 0, total: 0 };
  } catch {
    return { queued: 0, running: 0, total: 0 };
  }
}

export function startJobQueueWorker(): void {
  if (workerInterval) {
    console.log(`[JobQueue] Worker ${WORKER_ID} already running, skipping duplicate start`);
    return;
  }
  console.log(`[JobQueue] Worker ${WORKER_ID} starting, poll interval ${POLL_INTERVAL_MS}ms`);
  loadSettings().catch((err: any) => console.warn("[JobQueue] Initial settings load failed:", err.message));
  workerInterval = setInterval(pollAndProcess, POLL_INTERVAL_MS);
  setTimeout(pollAndProcess, 2000);
}

export function stopJobQueueWorker(): void {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
    console.log("[JobQueue] Worker stopped");
  }
}

export function setupJobQueueRoutes(app: Express): void {
  app.get("/api/admin/bg-jobs/stats", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const jobStats = await pool.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'queued')::int AS queued,
          COUNT(*) FILTER (WHERE status = 'running')::int AS running,
          COUNT(*) FILTER (WHERE status = 'paused')::int AS paused,
          COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
          COUNT(*) FILTER (WHERE status = 'partial')::int AS partial,
          COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
          COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled
        FROM bg_jobs
      `);

      const batchStats = await pool.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'running')::int AS running,
          COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
          COUNT(*) FILTER (WHERE status = 'failed')::int AS failed
        FROM bg_job_batches
      `);

      const itemStats = await pool.query(`
        SELECT COUNT(*)::int AS total FROM bg_job_items WHERE status = 'completed'
      `);

      res.json({
        jobs: jobStats.rows[0],
        batches: batchStats.rows[0],
        itemsSaved: itemStats.rows[0]?.total || 0,
        workerId: WORKER_ID,
        settings: currentSettings,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/bg-jobs/settings", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const settings = await loadSettings();
      res.json({ settings });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/bg-jobs/settings", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const updates: Partial<JobQueueSettings> = {};
      const body = req.body;

      if (typeof body.maxParentJobs === "number" && body.maxParentJobs > 0) updates.maxParentJobs = body.maxParentJobs;
      if (typeof body.maxChildBatchesPerJob === "number" && body.maxChildBatchesPerJob > 0) updates.maxChildBatchesPerJob = body.maxChildBatchesPerJob;
      if (typeof body.maxRequestsPerProvider === "number" && body.maxRequestsPerProvider > 0) updates.maxRequestsPerProvider = body.maxRequestsPerProvider;
      if (typeof body.defaultBatchSize === "number" && body.defaultBatchSize > 0) updates.defaultBatchSize = body.defaultBatchSize;
      if (typeof body.retryLimit === "number" && body.retryLimit >= 0) updates.retryLimit = body.retryLimit;
      if (typeof body.retryBackoffMs === "number" && body.retryBackoffMs >= 0) updates.retryBackoffMs = body.retryBackoffMs;
      if (typeof body.maxRuntimePerBatch === "number" && body.maxRuntimePerBatch > 0) updates.maxRuntimePerBatch = body.maxRuntimePerBatch;
      if (typeof body.stalledJobTimeoutMs === "number" && body.stalledJobTimeoutMs > 0) updates.stalledJobTimeoutMs = body.stalledJobTimeoutMs;

      const saved = await saveSettings(updates);
      res.json({ settings: saved });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/bg-jobs", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { status, type, limit = "50" } = req.query;
      let query = "SELECT * FROM bg_jobs WHERE 1=1";
      const params: any[] = [];
      let idx = 1;

      if (status) {
        query += ` AND status = $${idx++}`;
        params.push(status);
      }
      if (type) {
        query += ` AND type = $${idx++}`;
        params.push(type);
      }
      query += ` ORDER BY created_at DESC LIMIT $${idx++}`;
      params.push(Math.min(parseInt(String(limit)) || 50, 200));

      const r = await pool.query(query, params);
      res.json({
        jobs: r.rows.map((row: any) => ({
          id: row.id,
          type: row.type,
          engineKey: row.engine_key,
          status: row.status,
          priority: row.priority,
          payload: row.payload,
          result: row.result,
          error: row.error,
          totalItems: row.total_items,
          completedItems: row.completed_items,
          failedItems: row.failed_items,
          totalBatches: row.total_batches,
          completedBatches: row.completed_batches,
          failedBatches: row.failed_batches,
          batchSize: row.batch_size,
          concurrencyLimit: row.concurrency_limit,
          createdBy: row.created_by,
          claimedBy: row.claimed_by,
          heartbeatAt: row.heartbeat_at,
          startedAt: row.started_at,
          completedAt: row.completed_at,
          cancelledAt: row.cancelled_at,
          createdAt: row.created_at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/bg-jobs", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { type, engineKey, payload, totalItems, batchSize, priority } = req.body;
      if (!type) return res.status(400).json({ error: "type is required" });

      const jobId = await createBgJob({
        type,
        engineKey,
        payload,
        totalItems: totalItems || 0,
        batchSize,
        priority,
        createdBy: admin.id,
      });

      res.json({ jobId, status: "queued" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/bg-jobs/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const r = await pool.query("SELECT * FROM bg_jobs WHERE id = $1", [req.params.id]);
      if (!r.rows[0]) return res.status(404).json({ error: "Job not found" });

      const row = r.rows[0];
      const batches = await pool.query(
        "SELECT * FROM bg_job_batches WHERE job_id = $1 ORDER BY batch_index ASC",
        [row.id]
      );

      res.json({
        job: {
          id: row.id,
          type: row.type,
          engineKey: row.engine_key,
          status: row.status,
          priority: row.priority,
          payload: row.payload,
          result: row.result,
          error: row.error,
          totalItems: row.total_items,
          completedItems: row.completed_items,
          failedItems: row.failed_items,
          totalBatches: row.total_batches,
          completedBatches: row.completed_batches,
          failedBatches: row.failed_batches,
          batchSize: row.batch_size,
          createdBy: row.created_by,
          heartbeatAt: row.heartbeat_at,
          startedAt: row.started_at,
          completedAt: row.completed_at,
          cancelledAt: row.cancelled_at,
          createdAt: row.created_at,
        },
        batches: batches.rows.map((b: any) => ({
          id: b.id,
          batchIndex: b.batch_index,
          status: b.status,
          totalItems: b.total_items,
          completedItems: b.completed_items,
          failedItems: b.failed_items,
          error: b.error,
          retryCount: b.retry_count,
          maxRetries: b.max_retries,
          heartbeatAt: b.heartbeat_at,
          startedAt: b.started_at,
          completedAt: b.completed_at,
          createdAt: b.created_at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/bg-jobs/:id/pause", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT status FROM bg_jobs WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Job not found" });
      if (!["queued", "running"].includes(existing.rows[0].status)) {
        return res.status(400).json({ error: `Cannot pause job with status: ${existing.rows[0].status}` });
      }

      await pool.query("UPDATE bg_jobs SET status = 'paused' WHERE id = $1", [id]);
      await pool.query(
        "UPDATE bg_job_batches SET status = 'queued', claimed_by = NULL WHERE job_id = $1 AND status = 'queued'",
        [id]
      );

      res.json({ success: true, status: "paused" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/bg-jobs/:id/resume", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT status FROM bg_jobs WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Job not found" });
      if (existing.rows[0].status !== "paused") {
        return res.status(400).json({ error: `Cannot resume job with status: ${existing.rows[0].status}` });
      }

      await pool.query("UPDATE bg_jobs SET status = 'running', heartbeat_at = NOW() WHERE id = $1", [id]);
      res.json({ success: true, status: "running" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/bg-jobs/:id/cancel", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id } = req.params;
      const existing = await pool.query("SELECT status FROM bg_jobs WHERE id = $1", [id]);
      if (!existing.rows[0]) return res.status(404).json({ error: "Job not found" });
      if (["completed", "cancelled"].includes(existing.rows[0].status)) {
        return res.status(400).json({ error: `Cannot cancel job with status: ${existing.rows[0].status}` });
      }

      await pool.query(
        "UPDATE bg_jobs SET status = 'cancelled', cancelled_at = NOW(), completed_at = NOW() WHERE id = $1",
        [id]
      );
      await pool.query(
        "UPDATE bg_job_batches SET status = 'cancelled', completed_at = NOW() WHERE job_id = $1 AND status IN ('queued')",
        [id]
      );

      res.json({ success: true, status: "cancelled" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/bg-jobs/:id/batches/:batchId/retry", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { id, batchId } = req.params;
      const batch = await pool.query(
        "SELECT * FROM bg_job_batches WHERE id = $1 AND job_id = $2",
        [batchId, id]
      );
      if (!batch.rows[0]) return res.status(404).json({ error: "Batch not found" });
      if (batch.rows[0].status !== "failed") {
        return res.status(400).json({ error: `Cannot retry batch with status: ${batch.rows[0].status}` });
      }

      await pool.query(
        `UPDATE bg_job_batches SET status = 'queued', error = NULL, claimed_by = NULL, heartbeat_at = NULL WHERE id = $1`,
        [batchId]
      );

      const jobStatus = await pool.query("SELECT status FROM bg_jobs WHERE id = $1", [id]);
      if (jobStatus.rows[0] && ["partial", "failed"].includes(jobStatus.rows[0].status)) {
        await pool.query("UPDATE bg_jobs SET status = 'running', heartbeat_at = NOW(), completed_at = NULL WHERE id = $1", [id]);
      }

      res.json({ success: true, status: "queued" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}