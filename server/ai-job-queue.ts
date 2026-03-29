import { pool } from "./storage";
import crypto from "crypto";
import {
  validateJobLanguage,
  shouldBlockJobCompletion,
  buildLanguageScopedCacheKey,
  validateContentLanguage,
  checkTerminologyConsistency,
  buildValidationReport,
  type LanguageValidationReport,
} from "./language-enforcement";
import { checkAiLimits, recordAiUsage } from "./ai-safety";
import { emitStructuredLog } from "./log-sink";

const GPT4O_MINI_INPUT_COST = 0.00015 / 1000;
const GPT4O_MINI_OUTPUT_COST = 0.0006 / 1000;
const AVG_COST_PER_1K_TOKENS = 0.0004;

import { BoundedMap } from "./bounded-map";
const runningJobs = new BoundedMap<string, { cancel: boolean; pause: boolean }>(50);
const MAX_RUNNING_JOBS = 1;

export const JOB_TYPES = [
  "exam_questions", "cat_questions", "flashcards", "lessons",
  "blog", "rationale_image_linking", "lesson_image_linking",
  "qbank", "allied", "conversion"
] as const;

export const TIERS = [
  "rn_nclex", "rpn_lvn", "np", "allied_health",
  "emergency_nursing", "imaging", "new_grad"
] as const;

export const MODEL_TIERS: Record<string, { model: string; costMultiplier: number }> = {
  cheapest: { model: "gpt-4o-mini", costMultiplier: 1.0 },
  balanced: { model: "gpt-4o", costMultiplier: 5.0 },
  premium: { model: "gpt-4o", costMultiplier: 5.0 },
};

export const BATCH_LIMITS: Record<string, { default: number; max: number }> = {
  exam_questions: { default: 25, max: 50 },
  cat_questions: { default: 25, max: 50 },
  flashcards: { default: 50, max: 100 },
  lessons: { default: 5, max: 10 },
  blog: { default: 3, max: 5 },
  rationale_image_linking: { default: 10, max: 20 },
  lesson_image_linking: { default: 10, max: 20 },
  qbank: { default: 25, max: 50 },
  allied: { default: 25, max: 50 },
  conversion: { default: 10, max: 20 },
};

function getDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getWeekKey(): string {
  const d = new Date();
  const dayOfWeek = d.getUTCDay();
  const diff = d.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setUTCDate(diff);
  return monday.toISOString().slice(0, 10);
}

export async function isKillSwitchActive(): Promise<boolean> {
  try {
    const r = await pool.query("SELECT value FROM system_settings WHERE key = 'ai_kill_switch'");
    if (r.rows.length === 0) return false;
    const val = r.rows[0].value;
    return val?.enabled === true;
  } catch {
    return false;
  }
}

export async function setKillSwitch(enabled: boolean, updatedBy: string): Promise<void> {
  await pool.query(
    `INSERT INTO system_settings (key, value, updated_at, updated_by)
     VALUES ('ai_kill_switch', $1, NOW(), $2)
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW(), updated_by = $2`,
    [JSON.stringify({ enabled }), updatedBy]
  );
  if (enabled) {
    await logBudgetEvent("kill_switch_activated", undefined, undefined, undefined, undefined, `Kill switch activated by ${updatedBy}`);
  }
}

export async function getSpendCaps(): Promise<{ dailyCap: number; weeklyCap: number; perJobCap: number; monthlyCap: number }> {
  try {
    const r = await pool.query("SELECT value FROM system_settings WHERE key = 'ai_spend_caps'");
    if (r.rows.length === 0) return { dailyCap: 10, weeklyCap: 50, perJobCap: 5, monthlyCap: 150 };
    const val = r.rows[0].value;
    return {
      dailyCap: val?.dailyCap ?? 10,
      weeklyCap: val?.weeklyCap ?? 50,
      perJobCap: val?.perJobCap ?? 5,
      monthlyCap: val?.monthlyCap ?? 150,
    };
  } catch {
    return { dailyCap: 10, weeklyCap: 50, perJobCap: 5, monthlyCap: 150 };
  }
}

export async function setSpendCaps(caps: { dailyCap?: number; weeklyCap?: number; perJobCap?: number; monthlyCap?: number }, updatedBy: string): Promise<void> {
  const current = await getSpendCaps();
  const merged = { ...current, ...caps };
  await pool.query(
    `INSERT INTO system_settings (key, value, updated_at, updated_by)
     VALUES ('ai_spend_caps', $1, NOW(), $2)
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW(), updated_by = $2`,
    [JSON.stringify(merged), updatedBy]
  );
  await logBudgetEvent("caps_updated", undefined, undefined, undefined, undefined, `Caps updated by ${updatedBy}: daily=$${merged.dailyCap}, weekly=$${merged.weeklyCap}, monthly=$${merged.monthlyCap}, per-job=$${merged.perJobCap}`);
}

export async function getDailySpend(): Promise<number> {
  const dateKey = getDateKey();
  const r = await pool.query(
    "SELECT COALESCE(SUM(estimated_cost_usd), 0) as total FROM ai_spend_tracking WHERE date_key = $1",
    [dateKey]
  );
  return parseFloat(r.rows[0]?.total || "0");
}

export async function getWeeklySpend(): Promise<number> {
  const weekKey = getWeekKey();
  const r = await pool.query(
    "SELECT COALESCE(SUM(estimated_cost_usd), 0) as total FROM ai_spend_tracking WHERE week_key = $1",
    [weekKey]
  );
  return parseFloat(r.rows[0]?.total || "0");
}

export async function getMonthlySpend(): Promise<number> {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const monthKey = monthStart.toISOString().slice(0, 10);
  const r = await pool.query(
    "SELECT COALESCE(SUM(estimated_cost_usd), 0) as total FROM ai_spend_tracking WHERE date_key >= $1",
    [monthKey]
  );
  return parseFloat(r.rows[0]?.total || "0");
}

export async function getJobSpend(jobId: string): Promise<number> {
  const r = await pool.query(
    "SELECT COALESCE(SUM(estimated_cost_usd), 0) as total FROM ai_spend_tracking WHERE job_id = $1",
    [jobId]
  );
  return parseFloat(r.rows[0]?.total || "0");
}

async function recordSpend(jobId: string, tokens: number, costUsd: number): Promise<void> {
  await pool.query(
    `INSERT INTO ai_spend_tracking (id, job_id, date_key, week_key, token_count, estimated_cost_usd)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [crypto.randomUUID(), jobId, getDateKey(), getWeekKey(), tokens, costUsd]
  );
}

async function logBudgetEvent(eventType: string, jobId?: string, capType?: string, capValue?: number, currentSpend?: number, message?: string): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO ai_budget_logs (id, event_type, job_id, cap_type, cap_value, current_spend, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [crypto.randomUUID(), eventType, jobId || null, capType || null, capValue || null, currentSpend || null, message || null]
    );
  } catch {}
}

async function checkSpendCaps(jobId: string, jobSpendCap?: number): Promise<{ allowed: boolean; reason?: string }> {
  const caps = await getSpendCaps();
  const [dailySpend, weeklySpend, jobSpend] = await Promise.all([
    getDailySpend(),
    getWeeklySpend(),
    getJobSpend(jobId),
  ]);

  if (dailySpend >= caps.dailyCap) {
    await logBudgetEvent("cap_hit", jobId, "daily", caps.dailyCap, dailySpend, `Daily cap hit: $${dailySpend.toFixed(2)} >= $${caps.dailyCap}`);
    return { allowed: false, reason: `Daily spend cap reached ($${dailySpend.toFixed(2)} / $${caps.dailyCap})` };
  }
  if (weeklySpend >= caps.weeklyCap) {
    await logBudgetEvent("cap_hit", jobId, "weekly", caps.weeklyCap, weeklySpend, `Weekly cap hit`);
    return { allowed: false, reason: `Weekly spend cap reached ($${weeklySpend.toFixed(2)} / $${caps.weeklyCap})` };
  }
  if (typeof jobSpendCap === "number" && jobSpendCap > 0 && jobSpend >= jobSpendCap) {
    await logBudgetEvent("cap_hit", jobId, "per_job", jobSpendCap, jobSpend, `Per-job cap hit`);
    return { allowed: false, reason: `Per-job spend cap reached ($${jobSpend.toFixed(2)} / $${jobSpendCap})` };
  }
  if (jobSpend >= caps.perJobCap) {
    await logBudgetEvent("cap_hit", jobId, "per_job_global", caps.perJobCap, jobSpend, `Global per-job cap hit`);
    return { allowed: false, reason: `Global per-job spend cap reached ($${jobSpend.toFixed(2)} / $${caps.perJobCap})` };
  }
  const monthlySpend = await getMonthlySpend();
  if (monthlySpend >= caps.monthlyCap) {
    await logBudgetEvent("cap_hit", jobId, "monthly", caps.monthlyCap, monthlySpend, `Monthly cap hit: $${monthlySpend.toFixed(2)} >= $${caps.monthlyCap}`);
    return { allowed: false, reason: `Monthly spend cap reached ($${monthlySpend.toFixed(2)} / $${caps.monthlyCap})` };
  }
  return { allowed: true };
}

export function verifyProductionEnvironment(): { safe: boolean; env: string; dbHost: string; reason?: string } {
  const nodeEnv = process.env.NODE_ENV || "development";
  const dbUrl = process.env.DATABASE_URL || "";
  const dbHost = dbUrl.replace(/\/\/.*@/, "//***@").split("/")[2] || "unknown";
  if (!dbUrl) {
    return { safe: false, env: nodeEnv, dbHost, reason: "DATABASE_URL not set" };
  }
  if (nodeEnv === "production" && dbUrl.includes("localhost")) {
    return { safe: false, env: nodeEnv, dbHost, reason: "Production env pointing to localhost DB" };
  }
  return { safe: true, env: nodeEnv, dbHost };
}

async function checkDuplicate(type: string, title: string): Promise<boolean> {
  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (type === "blog") {
      const r = await pool.query(
        "SELECT id FROM content_items WHERE LOWER(title) = LOWER($1) OR slug = $2 LIMIT 1",
        [title, slug]
      );
      return r.rows.length > 0;
    }
    if (type === "qbank" || type === "exam_questions" || type === "cat_questions") {
      const r = await pool.query(
        "SELECT id FROM exam_questions WHERE LOWER(stem) = LOWER($1) LIMIT 1",
        [title]
      );
      return r.rows.length > 0;
    }
    if (type === "allied") {
      const r = await pool.query(
        "SELECT id FROM allied_questions WHERE LOWER(stem) = LOWER($1) LIMIT 1",
        [title]
      );
      return r.rows.length > 0;
    }
    if (type === "flashcards") {
      const r = await pool.query(
        "SELECT id FROM flashcards WHERE LOWER(front) = LOWER($1) LIMIT 1",
        [title]
      );
      return r.rows.length > 0;
    }
    if (type === "lessons") {
      const r = await pool.query(
        "SELECT id FROM lessons WHERE LOWER(title) = LOWER($1) LIMIT 1",
        [title]
      );
      return r.rows.length > 0;
    }
  } catch {}
  return false;
}

function addJobLog(jobId: string, logs: any[], message: string): any[] {
  const entry = { timestamp: new Date().toISOString(), message };
  const updated = [...logs, entry];
  if (updated.length > 200) updated.splice(0, updated.length - 200);
  return updated;
}

function getModelForTier(modelTier: string): string {
  return MODEL_TIERS[modelTier]?.model || "gpt-4o-mini";
}

function hasRunningJob(): boolean {
  return runningJobs.size > 0;
}

async function checkAndRecordAiUsage(
  model: string,
  response: any,
  endpoint: string
): Promise<number> {
  const check = await checkAiLimits({ userId: "system_ai_job_engine" });
  if (!check.allowed) {
    throw new Error(`AI limit reached: ${check.reason}`);
  }

  const tokensUsed =
    response?.usage?.total_tokens ||
    Math.ceil((response?.choices?.[0]?.message?.content?.length || 500) / 4);

  await recordAiUsage(1, tokensUsed, {
    userId: "system_ai_job_engine",
    endpoint,
  }).catch((err: unknown) => {
    emitStructuredLog(
      {
        level: "error",
        type: "ai_usage_record_failed",
        provider: "openai",
        route: "ai-job-queue",
        job: endpoint,
        userId: "system_ai_job_engine",
        msg: err instanceof Error ? err.message : String(err),
      },
      "error",
    );
  });

  return tokensUsed;
}

export async function createJob(params: {
  type: string;
  tier?: string;
  contentType?: string;
  itemCount?: number;
  batchSize?: number;
  modelTier?: string;
  spendCap?: number;
  duplicateProtection?: boolean;
  dryRun?: boolean;
  topic?: string;
  specialty?: string;
  framework?: string;
  config?: any;
  createdBy: string;
}): Promise<string> {
  const killSwitch = await isKillSwitchActive();
  if (killSwitch) {
    throw new Error("AI Kill Switch is active. No new jobs can be created.");
  }

  const limits = BATCH_LIMITS[params.type] || { default: 25, max: 50 };
  const batchSize = Math.min(params.batchSize || limits.default, limits.max);
  const itemCount = Math.min(params.itemCount || batchSize, limits.max);
  const modelTier = params.modelTier || "cheapest";
  const model = getModelForTier(modelTier);
  const costMultiplier = MODEL_TIERS[modelTier]?.costMultiplier || 1.0;
  const estimatedCost = itemCount * 0.02 * costMultiplier;

  const id = crypto.randomUUID();

  await pool.query(
    `INSERT INTO ai_jobs (id, type, tier, content_type, status, config, item_count, batch_size, model, model_tier, spend_cap, duplicate_protection, dry_run, topic, specialty, framework, cost_estimate, created_by, logs, progress)
     VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
    [
      id,
      params.type,
      params.tier || null,
      params.contentType || null,
      JSON.stringify(params.config || {}),
      itemCount,
      batchSize,
      model,
      modelTier,
      params.spendCap || null,
      params.duplicateProtection !== false,
      params.dryRun || false,
      params.topic || null,
      params.specialty || null,
      params.framework || null,
      estimatedCost,
      params.createdBy,
      JSON.stringify([{ timestamp: new Date().toISOString(), message: `Job created: ${params.type} x${itemCount} [model: ${model}, tier: ${modelTier}]` }]),
      JSON.stringify({ completed: 0, total: itemCount, duplicatesSkipped: 0, failed: 0 }),
    ]
  );

  await logBudgetEvent("job_created", id, undefined, undefined, undefined, `Job ${params.type} x${itemCount} created by ${params.createdBy}`);
  return id;
}

export async function startJob(jobId: string): Promise<void> {
  const killSwitch = await isKillSwitchActive();
  if (killSwitch) {
    throw new Error("AI Kill Switch is active. Cannot start jobs.");
  }

  if (hasRunningJob()) {
    throw new Error("Another job is currently running. Only one AI job can run at a time.");
  }

  const runningInDb = await pool.query("SELECT id FROM ai_jobs WHERE status = 'running' AND id != $1 LIMIT 1", [jobId]);
  if (runningInDb.rows.length > 0) {
    throw new Error("Another job is currently running in the database. Only one AI job can run at a time.");
  }

  const job = await pool.query("SELECT * FROM ai_jobs WHERE id = $1", [jobId]);
  if (!job.rows[0]) throw new Error("Job not found");
  if (job.rows[0].status !== "pending" && job.rows[0].status !== "paused") {
    throw new Error(`Cannot start job with status: ${job.rows[0].status}`);
  }

  const envCheck = verifyProductionEnvironment();
  let logs = typeof job.rows[0].logs === "string" ? JSON.parse(job.rows[0].logs) : (job.rows[0].logs || []);

  if (!envCheck.safe) {
    logs = addJobLog(jobId, logs, `Environment check FAILED: ${envCheck.reason}`);
    await pool.query(
      "UPDATE ai_jobs SET status = 'failed', error = $2, logs = $3 WHERE id = $1",
      [jobId, `Production safeguard blocked: ${envCheck.reason}`, JSON.stringify(logs)]
    );
    throw new Error(`Production safeguard: ${envCheck.reason}`);
  }

  logs = addJobLog(jobId, logs, `Environment verified: ${envCheck.env}, DB: ${envCheck.dbHost}`);
  logs = addJobLog(jobId, logs, "Runs only when you start it — no automatic execution");

  const isPaused = job.rows[0].status === "paused";
  await pool.query(
    `UPDATE ai_jobs SET status = 'running', started_at = COALESCE(started_at, NOW()), ${isPaused ? "resumed_at = NOW()," : ""} logs = $2, current_stage = 'initializing' WHERE id = $1`,
    [jobId, JSON.stringify(logs)]
  );

  if (runningJobs.size >= MAX_RUNNING_JOBS) {
    await pool.query(
      `UPDATE ai_jobs SET status = 'queued', logs = $2 WHERE id = $1`,
      [jobId, JSON.stringify([...logs, { t: Date.now(), msg: "Deferred: max concurrent jobs reached" }])]
    );
    return;
  }
  runningJobs.set(jobId, { cancel: false, pause: false });

  const freshJob = await pool.query("SELECT * FROM ai_jobs WHERE id = $1", [jobId]);
  executeJob(jobId, freshJob.rows[0]).catch(err => {
    console.error(`[AI Job ${jobId}] Execution error:`, err.message);
  });
}

export async function pauseJob(jobId: string): Promise<void> {
  const control = runningJobs.get(jobId);
  if (control) {
    control.pause = true;
  }
  await pool.query(
    "UPDATE ai_jobs SET status = 'paused', paused_at = NOW() WHERE id = $1 AND status = 'running'",
    [jobId]
  );
}

export async function cancelJob(jobId: string): Promise<void> {
  const control = runningJobs.get(jobId);
  if (control) {
    control.cancel = true;
  }
  await pool.query(
    "UPDATE ai_jobs SET status = 'cancelled', cancelled_at = NOW() WHERE id = $1 AND status IN ('running', 'pending', 'paused')",
    [jobId]
  );
}

export async function retryFailedItems(jobId: string): Promise<void> {
  const job = await pool.query("SELECT * FROM ai_jobs WHERE id = $1", [jobId]);
  if (!job.rows[0]) throw new Error("Job not found");
  const row = job.rows[0];
  if (!["completed", "failed", "stopped", "completed_with_warnings"].includes(row.status)) {
    throw new Error("Can only retry completed/failed/stopped jobs");
  }
  if ((row.retry_count || 0) >= (row.max_retries || 3)) {
    throw new Error(`Max retries (${row.max_retries || 3}) reached for this job`);
  }

  let logs = typeof row.logs === "string" ? JSON.parse(row.logs) : (row.logs || []);
  logs = addJobLog(jobId, logs, `Retry #${(row.retry_count || 0) + 1} initiated`);

  await pool.query(
    `UPDATE ai_jobs SET status = 'pending', error = NULL, retry_count = COALESCE(retry_count, 0) + 1, logs = $2 WHERE id = $1`,
    [jobId, JSON.stringify(logs)]
  );
}

export async function getJobStatus(jobId: string): Promise<any> {
  const r = await pool.query("SELECT * FROM ai_jobs WHERE id = $1", [jobId]);
  return r.rows[0] || null;
}

export async function listJobs(limit: number = 50, offset: number = 0, statusFilter?: string, typeFilter?: string): Promise<any[]> {
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (statusFilter) {
    conditions.push(`status = $${idx++}`);
    params.push(statusFilter);
  }
  if (typeFilter) {
    conditions.push(`type = $${idx++}`);
    params.push(typeFilter);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  params.push(Math.min(limit, 200));
  params.push(offset);

  const r = await pool.query(
    `SELECT * FROM ai_jobs ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
    params
  );
  return r.rows;
}

export async function getJobHistory(limit: number = 100): Promise<any[]> {
  const r = await pool.query(
    "SELECT * FROM ai_jobs WHERE status IN ('completed', 'completed_with_warnings', 'failed', 'cancelled', 'stopped') ORDER BY completed_at DESC NULLS LAST, created_at DESC LIMIT $1",
    [Math.min(limit, 500)]
  );
  return r.rows;
}

export async function getBudgetLogs(limit: number = 100): Promise<any[]> {
  const r = await pool.query(
    "SELECT * FROM ai_budget_logs ORDER BY created_at DESC LIMIT $1",
    [Math.min(limit, 500)]
  );
  return r.rows;
}

async function executeJob(jobId: string, jobRow: any): Promise<void> {
  const type = jobRow.type;
  const itemCount = jobRow.item_count || 1;
  const config = typeof jobRow.config === "string" ? JSON.parse(jobRow.config) : (jobRow.config || {});
  let logs = typeof jobRow.logs === "string" ? JSON.parse(jobRow.logs) : (jobRow.logs || []);
  let completed = jobRow.items_completed || 0;
  let failed = jobRow.items_failed || 0;
  let duplicatesSkipped = jobRow.duplicates_skipped || 0;
  let totalCost = jobRow.actual_cost || 0;
  const startIndex = completed + duplicatesSkipped + failed;
  const modelTier = jobRow.model_tier || "cheapest";
  const model = jobRow.model || getModelForTier(modelTier);
  const duplicateProtection = jobRow.duplicate_protection !== false;
  const dryRun = jobRow.dry_run === true;
  const jobSpendCap = jobRow.spend_cap;
  const maxRetries = jobRow.max_retries || 3;

  const targetLanguage = validateJobLanguage(config);
  if (targetLanguage !== "en") {
    logs = addJobLog(jobId, logs, `Language enforcement active: target=${targetLanguage}`);
  }

  const itemLanguageResults: LanguageValidationReport[] = [];

  logs = addJobLog(jobId, logs, `Execution started: processing items ${startIndex + 1} to ${itemCount}`);
  await updateJobProgress(jobId, "running", completed, failed, duplicatesSkipped, totalCost, logs, itemCount);

  try {
    for (let i = startIndex; i < itemCount; i++) {
      const control = runningJobs.get(jobId);
      if (control?.cancel) {
        logs = addJobLog(jobId, logs, "Job cancelled by admin");
        await pool.query(
          "UPDATE ai_jobs SET status = 'cancelled', cancelled_at = NOW(), items_completed = $2, items_failed = $3, duplicates_skipped = $4, actual_cost = $5, logs = $6, progress = $7, current_stage = 'cancelled' WHERE id = $1",
          [jobId, completed, failed, duplicatesSkipped, totalCost, JSON.stringify(logs), JSON.stringify({ completed, total: itemCount, duplicatesSkipped, failed })]
        );
        runningJobs.delete(jobId);
        return;
      }

      if (control?.pause) {
        logs = addJobLog(jobId, logs, "Job paused by admin");
        await pool.query(
          "UPDATE ai_jobs SET status = 'paused', paused_at = NOW(), items_completed = $2, items_failed = $3, duplicates_skipped = $4, actual_cost = $5, logs = $6, progress = $7, current_stage = 'paused' WHERE id = $1",
          [jobId, completed, failed, duplicatesSkipped, totalCost, JSON.stringify(logs), JSON.stringify({ completed, total: itemCount, duplicatesSkipped, failed })]
        );
        runningJobs.delete(jobId);
        return;
      }

      const killSwitch = await isKillSwitchActive();
      if (killSwitch) {
        logs = addJobLog(jobId, logs, "Job stopped: Kill switch activated");
        await pool.query(
          "UPDATE ai_jobs SET status = 'stopped', items_completed = $2, items_failed = $3, duplicates_skipped = $4, actual_cost = $5, logs = $6, progress = $7, error = 'Kill switch activated', current_stage = 'stopped' WHERE id = $1",
          [jobId, completed, failed, duplicatesSkipped, totalCost, JSON.stringify(logs), JSON.stringify({ completed, total: itemCount, duplicatesSkipped, failed })]
        );
        runningJobs.delete(jobId);
        return;
      }

      const spendCheck = await checkSpendCaps(jobId, jobSpendCap);
      if (!spendCheck.allowed) {
        logs = addJobLog(jobId, logs, `Job stopped: ${spendCheck.reason}`);
        await pool.query(
          "UPDATE ai_jobs SET status = 'stopped', items_completed = $2, items_failed = $3, duplicates_skipped = $4, actual_cost = $5, logs = $6, progress = $7, error = $8, current_stage = 'budget_exceeded' WHERE id = $1",
          [jobId, completed, failed, duplicatesSkipped, totalCost, JSON.stringify(logs), JSON.stringify({ completed, total: itemCount, duplicatesSkipped, failed }), spendCheck.reason]
        );
        runningJobs.delete(jobId);
        return;
      }

      await pool.query("UPDATE ai_jobs SET current_stage = $2 WHERE id = $1", [jobId, `processing_item_${i + 1}`]);

      let itemRetries = 0;
      let itemSuccess = false;
      while (itemRetries <= 2 && !itemSuccess) {
        try {
          if (dryRun) {
            logs = addJobLog(jobId, logs, `Item ${i + 1}: DRY RUN — skipped (would generate ${type})`);
            completed++;
            itemSuccess = true;
          } else {
            const result = await executeJobItem(type, i, { ...config, topic: jobRow.topic, specialty: jobRow.specialty, framework: jobRow.framework, tier: jobRow.tier, targetLanguage }, jobId, logs, model, duplicateProtection);
            if (result.duplicate) {
              duplicatesSkipped++;
              logs = addJobLog(jobId, result.logs || logs, `Item ${i + 1}: Duplicate skipped`);
            } else {
              completed++;
              const costMultiplier = MODEL_TIERS[modelTier]?.costMultiplier || 1.0;
              const itemCost = (result.tokens || 0) * AVG_COST_PER_1K_TOKENS * costMultiplier / 1000;
              totalCost += itemCost;
              await recordSpend(jobId, result.tokens || 0, itemCost);
              logs = addJobLog(jobId, result.logs || logs, `Item ${i + 1}: Generated successfully (${result.tokens || 0} tokens, $${itemCost.toFixed(4)})`);
              if (result.languageValidation) {
                itemLanguageResults.push(result.languageValidation);
              }
            }
            itemSuccess = true;
          }
        } catch (itemErr: any) {
          itemRetries++;
          if (itemRetries > 2) {
            failed++;
            logs = addJobLog(jobId, logs, `Item ${i + 1}: FAILED after ${itemRetries} attempts - ${itemErr.message}`);
          } else {
            logs = addJobLog(jobId, logs, `Item ${i + 1}: Retry ${itemRetries}/2 - ${itemErr.message}`);
            await new Promise(resolve => setTimeout(resolve, 2000 * itemRetries));
          }
        }
      }

      await updateJobProgress(jobId, "running", completed, failed, duplicatesSkipped, totalCost, logs, itemCount);
    }

    let finalStatus = failed > 0 && completed === 0 ? "failed" : (failed > 0 ? "completed_with_warnings" : "completed");

    if (targetLanguage !== "en" && finalStatus !== "failed") {
      const langPassed = itemLanguageResults.length > 0
        ? itemLanguageResults.every(r => r.validation_passed)
        : true;
      const termPassed = itemLanguageResults.length > 0
        ? itemLanguageResults.every(r => r.terminology_check_passed)
        : true;
      const failedLangItems = itemLanguageResults.filter(r => !r.validation_passed).length;

      const aggregatedReport: LanguageValidationReport = {
        requested_language: targetLanguage,
        detected_language: itemLanguageResults[0]?.detected_language || targetLanguage,
        field_validation: itemLanguageResults[0]?.field_validation || {},
        validation_passed: langPassed,
        terminology_check_passed: termPassed,
        retry_count: Math.max(0, ...itemLanguageResults.map(r => r.retry_count)),
        status: langPassed && termPassed ? "validated" : "validation_failed",
      };

      const blockCheck = shouldBlockJobCompletion(aggregatedReport);
      if (blockCheck.blocked) {
        finalStatus = "completed_with_warnings";
        logs = addJobLog(jobId, logs, `Language enforcement warning: ${blockCheck.reason} (${failedLangItems}/${itemLanguageResults.length} items failed validation)`);
      } else if (itemLanguageResults.length > 0) {
        logs = addJobLog(jobId, logs, `Language enforcement: ${itemLanguageResults.length} items validated for ${targetLanguage}`);
      }
    }

    logs = addJobLog(jobId, logs, `Job ${finalStatus}: ${completed} items generated, ${duplicatesSkipped} duplicates skipped, ${failed} failed, $${totalCost.toFixed(4)} total cost`);
    await pool.query(
      "UPDATE ai_jobs SET status = $2, completed_at = NOW(), items_completed = $3, items_failed = $4, duplicates_skipped = $5, actual_cost = $6, logs = $7, progress = $8, current_stage = 'done' WHERE id = $1",
      [jobId, finalStatus, completed, failed, duplicatesSkipped, totalCost, JSON.stringify(logs), JSON.stringify({ completed, total: itemCount, duplicatesSkipped, failed })]
    );
    await logBudgetEvent("job_completed", jobId, undefined, undefined, totalCost, `Job finished: ${completed} items, $${totalCost.toFixed(4)}`);
  } catch (err: any) {
    logs = addJobLog(jobId, logs, `Job failed: ${err.message}`);
    await pool.query(
      "UPDATE ai_jobs SET status = 'failed', error = $2, completed_at = NOW(), items_completed = $3, items_failed = $4, duplicates_skipped = $5, actual_cost = $6, logs = $7, progress = $8, current_stage = 'error' WHERE id = $1",
      [jobId, err.message, completed, failed, duplicatesSkipped, totalCost, JSON.stringify(logs), JSON.stringify({ completed, total: itemCount, duplicatesSkipped, failed })]
    );
  } finally {
    runningJobs.delete(jobId);
  }
}

async function updateJobProgress(jobId: string, status: string, completed: number, failed: number, duplicatesSkipped: number, totalCost: number, logs: any[], total: number): Promise<void> {
  await pool.query(
    "UPDATE ai_jobs SET items_completed = $2, items_failed = $3, duplicates_skipped = $4, actual_cost = $5, logs = $6, progress = $7 WHERE id = $1",
    [jobId, completed, failed, duplicatesSkipped, totalCost, JSON.stringify(logs), JSON.stringify({ completed, total, duplicatesSkipped, failed })]
  );
}

async function executeJobItem(type: string, index: number, config: any, jobId: string, logs: any[], model: string, duplicateProtection: boolean): Promise<{ tokens: number; duplicate: boolean; logs: any[]; languageValidation?: LanguageValidationReport }> {
  if (type === "blog") {
    return executeBlogItem(index, config, jobId, logs);
  }
  if (type === "qbank" || type === "exam_questions" || type === "cat_questions") {
    return executeQBankItem(index, config, jobId, logs, model, type, duplicateProtection);
  }
  if (type === "allied") {
    return executeAlliedItem(index, config, jobId, logs, model, duplicateProtection);
  }
  if (type === "flashcards") {
    return executeFlashcardItem(index, config, jobId, logs, model, duplicateProtection);
  }
  if (type === "lessons") {
    return executeLessonItem(index, config, jobId, logs, model, duplicateProtection);
  }
  if (type === "rationale_image_linking" || type === "lesson_image_linking") {
    return executeImageLinkingItem(type, index, config, jobId, logs);
  }
  if (type === "conversion") {
    return { tokens: 0, duplicate: false, logs: addJobLog(jobId, logs, `Conversion job item ${index + 1}: placeholder`) };
  }
  throw new Error(`Unknown job type: ${type}`);
}

async function executeBlogItem(index: number, config: any, jobId: string, logs: any[]): Promise<{ tokens: number; duplicate: boolean; logs: any[] }> {
  const { generateBlogPost } = await import("./blog-automation");
  const { LONG_TAIL_SEO_TOPICS } = await import("./blog-automation");

  const topic = config.topic || LONG_TAIL_SEO_TOPICS[index % LONG_TAIL_SEO_TOPICS.length]?.topic || `Nursing education topic ${index + 1}`;

  const isDuplicate = await checkDuplicate("blog", topic);
  if (isDuplicate) {
    return { tokens: 0, duplicate: true, logs };
  }

  const result = await generateBlogPost(topic);

  try {
    await pool.query(
      `INSERT INTO content_items (id, title, slug, content, summary, tags, status, tier, seo_title, seo_description, seo_keywords, primary_keyword, content_type, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'draft', 'free', $6, $7, $8, $9, 'blog', NOW(), NOW())`,
      [result.title, result.slug, JSON.stringify(result.content), result.summary, result.tags, result.seoTitle, result.seoDescription, result.seoKeywords, result.primaryKeyword]
    );
  } catch (dbErr: any) {
    if (dbErr.message?.includes("duplicate")) {
      return { tokens: 0, duplicate: true, logs };
    }
    throw dbErr;
  }

  return { tokens: 8000, duplicate: false, logs };
}

async function executeQBankItem(index: number, config: any, jobId: string, logs: any[], model: string, subType: string, duplicateProtection: boolean): Promise<{ tokens: number; duplicate: boolean; logs: any[] }> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const examKey = config.examKey || "nclex-rn";
  const questionsPerItem = config.questionsPerItem || 10;
  const topic = config.topic || `${examKey} practice questions batch ${index + 1}`;
  const tier = config.tier || "rn_nclex";
  const isCAT = subType === "cat_questions";

  const systemPrompt = isCAT
    ? "Generate CAT (Computer Adaptive Testing) style NCLEX questions with adaptive difficulty. Return valid JSON with a 'questions' array of objects with: stem, options (array of 4), correctAnswer (0-3 index), rationale, category, difficulty (1-5), adaptiveLevel (string: 'below_passing', 'near_passing', 'above_passing')."
    : "Generate NCLEX-style practice questions. Return valid JSON with a 'questions' array of objects with: stem, options (array of 4), correctAnswer (0-3 index), rationale, category, difficulty (1-5).";

  const limitCheck = await checkAiLimits({ userId: "system_ai_job_engine" });
  if (!limitCheck.allowed) {
    throw new Error(`AI limit reached: ${limitCheck.reason}`);
  }

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate ${questionsPerItem} ${examKey.toUpperCase()} practice questions about: ${topic}. Return ONLY JSON with a 'questions' array.` },
    ],
    max_tokens: 8000,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const tokens = await checkAndRecordAiUsage(model, response, "ai-job-engine-qbank");
  const content = response.choices[0]?.message?.content || "{}";

  let questions: any[] = [];
  try {
    const parsed = JSON.parse(content);
    questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
  } catch { questions = []; }

  let inserted = 0;
  for (const q of questions) {
    if (duplicateProtection) {
      const isDup = await checkDuplicate("qbank", q.stem || "");
      if (isDup) continue;
    }

    try {
      await pool.query(
        `INSERT INTO exam_questions (id, stem, options, correct_answer, rationale, category, difficulty, tier, status, exam_type, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'draft', $8, NOW())`,
        [q.stem, JSON.stringify(q.options || []), q.correctAnswer || 0, q.rationale || "", q.category || "General", q.difficulty || 3, tier === "rn_nclex" ? "free" : tier, examKey]
      );
      inserted++;
    } catch {}
  }

  return { tokens, duplicate: inserted === 0 && questions.length > 0, logs };
}

async function executeAlliedItem(index: number, config: any, jobId: string, logs: any[], model: string, duplicateProtection: boolean): Promise<{ tokens: number; duplicate: boolean; logs: any[] }> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const career = config.career || "respiratory_therapy";
  const topic = config.topic || `${career} certification practice questions batch ${index + 1}`;

  const limitCheck = await checkAiLimits({ userId: "system_ai_job_engine" });
  if (!limitCheck.allowed) {
    throw new Error(`AI limit reached: ${limitCheck.reason}`);
  }

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "Generate allied health certification practice questions. Return valid JSON with a 'questions' array of objects with: stem, options (array with label and text), correctAnswer (letter), rationale, category, difficulty (1-5), questionType." },
      { role: "user", content: `Generate 10 ${career} certification exam questions about: ${topic}. Return ONLY JSON with a 'questions' array.` },
    ],
    max_tokens: 8000,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const tokens = await checkAndRecordAiUsage(model, response, "ai-job-engine-allied");
  const content = response.choices[0]?.message?.content || "{}";

  let questions: any[] = [];
  try {
    const parsed = JSON.parse(content);
    questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
  } catch { questions = []; }

  let inserted = 0;
  for (const q of questions) {
    if (duplicateProtection) {
      const isDup = await checkDuplicate("allied", q.stem || "");
      if (isDup) continue;
    }

    try {
      await pool.query(
        `INSERT INTO allied_questions (id, stem, options, correct_answer, rationale_long, blueprint_category, difficulty, career_type, status, question_type, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'draft', $8, NOW())`,
        [q.stem, JSON.stringify(q.options || []), q.correctAnswer || "A", q.rationale || "", q.category || "General", q.difficulty || 3, career, q.questionType || "MCQ_SINGLE"]
      );
      inserted++;
    } catch {}
  }

  return { tokens, duplicate: inserted === 0 && questions.length > 0, logs };
}

async function executeFlashcardItem(index: number, config: any, jobId: string, logs: any[], model: string, duplicateProtection: boolean): Promise<{ tokens: number; duplicate: boolean; logs: any[] }> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const topic = config.topic || `Nursing flashcards batch ${index + 1}`;
  const tier = config.tier || "rn_nclex";
  const specialty = config.specialty || "general";

  const limitCheck = await checkAiLimits({ userId: "system_ai_job_engine" });
  if (!limitCheck.allowed) {
    throw new Error(`AI limit reached: ${limitCheck.reason}`);
  }

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "Generate nursing education flashcards. Return valid JSON with a 'flashcards' array of objects with: front (question), back (answer), category, difficulty (1-5), tags (array of strings)." },
      { role: "user", content: `Generate 10 flashcards for ${tier} students about: ${topic} (specialty: ${specialty}). Return ONLY JSON with a 'flashcards' array.` },
    ],
    max_tokens: 4000,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const tokens = await checkAndRecordAiUsage(model, response, "ai-job-engine-flashcards");
  const content = response.choices[0]?.message?.content || "{}";

  let cards: any[] = [];
  try {
    const parsed = JSON.parse(content);
    cards = Array.isArray(parsed) ? parsed : (parsed.flashcards || []);
  } catch { cards = []; }

  let inserted = 0;
  for (const c of cards) {
    if (duplicateProtection) {
      const isDup = await checkDuplicate("flashcards", c.front || "");
      if (isDup) continue;
    }

    try {
      await pool.query(
        `INSERT INTO flashcards (id, front, back, category, difficulty, tags, status, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'draft', NOW())`,
        [c.front, c.back, c.category || "General", c.difficulty || 3, JSON.stringify(c.tags || [])]
      );
      inserted++;
    } catch {}
  }

  return { tokens, duplicate: inserted === 0 && cards.length > 0, logs };
}

async function executeLessonItem(index: number, config: any, jobId: string, logs: any[], model: string, duplicateProtection: boolean): Promise<{ tokens: number; duplicate: boolean; logs: any[] }> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const topic = config.topic || `Nursing lesson topic ${index + 1}`;
  const tier = config.tier || "rn_nclex";

  if (duplicateProtection) {
    const isDup = await checkDuplicate("lessons", topic);
    if (isDup) return { tokens: 0, duplicate: true, logs };
  }

  const limitCheck = await checkAiLimits({ userId: "system_ai_job_engine" });
  if (!limitCheck.allowed) {
    throw new Error(`AI limit reached: ${limitCheck.reason}`);
  }

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "Generate a comprehensive nursing education lesson. Return valid JSON with: title, slug, content (HTML string), summary, category, objectives (array), keyTerms (array of {term, definition}), estimatedMinutes (number)." },
      { role: "user", content: `Generate a lesson for ${tier} students about: ${topic}. Return ONLY valid JSON.` },
    ],
    max_tokens: 8000,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const tokens = await checkAndRecordAiUsage(model, response, "ai-job-engine-lessons");
  const content = response.choices[0]?.message?.content || "{}";

  let lesson: any;
  try {
    lesson = JSON.parse(content);
  } catch {
    throw new Error("Failed to parse lesson JSON");
  }

  try {
    await pool.query(
      `INSERT INTO lessons (id, title, slug, content, summary, category, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'draft', NOW(), NOW())`,
      [lesson.title || topic, lesson.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"), JSON.stringify(lesson.content || ""), lesson.summary || "", lesson.category || "General"]
    );
  } catch (dbErr: any) {
    if (dbErr.message?.includes("duplicate")) {
      return { tokens: 0, duplicate: true, logs };
    }
    throw dbErr;
  }

  return { tokens, duplicate: false, logs };
}

async function executeImageLinkingItem(type: string, index: number, config: any, jobId: string, logs: any[]): Promise<{ tokens: number; duplicate: boolean; logs: any[] }> {
  logs = addJobLog(jobId, logs, `Image linking item ${index + 1}: scanning for unlinked ${type === "rationale_image_linking" ? "rationales" : "lessons"}`);
  return { tokens: 0, duplicate: false, logs };
}

export async function getSpendSummary(): Promise<{
  daily: number;
  weekly: number;
  monthly: number;
  caps: { dailyCap: number; weeklyCap: number; perJobCap: number; monthlyCap: number };
  activeJobs: number;
  environment: { safe: boolean; env: string; dbHost: string };
}> {
  const caps = await getSpendCaps();
  const [daily, weekly, monthly] = await Promise.all([getDailySpend(), getWeeklySpend(), getMonthlySpend()]);
  const activeR = await pool.query("SELECT COUNT(*) as c FROM ai_jobs WHERE status = 'running'");
  const activeJobs = parseInt(activeR.rows[0]?.c || "0");
  const environment = verifyProductionEnvironment();

  return { daily, weekly, monthly, caps, activeJobs, environment };
}

export async function getJobStats(): Promise<{
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  paused: number;
  stopped: number;
  completedWithWarnings: number;
}> {
  const r = await pool.query(`
    SELECT
      COUNT(*)::int as total,
      COUNT(*) FILTER (WHERE status = 'pending')::int as pending,
      COUNT(*) FILTER (WHERE status = 'running')::int as running,
      COUNT(*) FILTER (WHERE status = 'completed')::int as completed,
      COUNT(*) FILTER (WHERE status = 'failed')::int as failed,
      COUNT(*) FILTER (WHERE status = 'cancelled')::int as cancelled,
      COUNT(*) FILTER (WHERE status = 'paused')::int as paused,
      COUNT(*) FILTER (WHERE status = 'stopped')::int as stopped,
      COUNT(*) FILTER (WHERE status = 'completed_with_warnings')::int as completed_with_warnings
    FROM ai_jobs
  `);
  const row = r.rows[0] || {};
  return {
    total: row.total || 0,
    pending: row.pending || 0,
    running: row.running || 0,
    completed: row.completed || 0,
    failed: row.failed || 0,
    cancelled: row.cancelled || 0,
    paused: row.paused || 0,
    stopped: row.stopped || 0,
    completedWithWarnings: row.completed_with_warnings || 0,
  };
}