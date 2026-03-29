import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { emitStructuredLog } from "./log-sink";
import { requireAdmin } from "./admin-auth";
import { tryAcquireSchedulerLease, SCHEDULER_LOCK_NAMES } from "./scheduler-db-lock";

/* =========================
   SCHEDULER STATE
========================= */

let schedulerInterval: NodeJS.Timeout | null = null;
let schedulerTickRunning = false;

/* =========================
   TIME HELPERS
========================= */

function getNextRunAt(
  frequency: string,
  hour: number,
  customDays?: number[]
): Date {
  const now = new Date();
  const next = new Date(now);

  next.setUTCMinutes(0, 0, 0);
  next.setUTCHours(hour);

  if (next <= now) next.setUTCDate(next.getUTCDate() + 1);

  if (frequency === "daily") return next;

  if (frequency === "weekly") {
    const day = next.getUTCDay();
    const offset = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    if (offset > 0) next.setUTCDate(next.getUTCDate() + offset);
    return next;
  }

  if (frequency === "custom" && customDays?.length) {
    const sorted = [...customDays].sort((a, b) => a - b);

    for (let i = 0; i < 7; i++) {
      const candidate = new Date(now);
      candidate.setUTCDate(candidate.getUTCDate() + i);
      candidate.setUTCHours(hour, 0, 0, 0);

      if (candidate > now && sorted.includes(candidate.getUTCDay())) {
        return candidate;
      }
    }
  }

  return next;
}

/* =========================
   RUN LIMIT CHECK
========================= */

async function getRunsToday(scheduleId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];

  const r = await pool.query(
    `SELECT COUNT(*)::int AS c
     FROM qbank_generation_runs
     WHERE schedule_id = $1
       AND created_at::date = $2::date`,
    [scheduleId, today]
  );

  return r.rows[0]?.c || 0;
}

/* =========================
   CORE EXECUTION
========================= */

async function createRun(schedule: any): Promise<string> {
  const r = await pool.query(
    `INSERT INTO qbank_generation_runs
     (template_key, variant_key, exam_key, region, target_count, status, is_dry_run, triggered_by, schedule_id, model)
     VALUES ($1,$2,$3,$4,$5,'queued',$6,'schedule',$7,'gpt-4o-mini')
     RETURNING id`,
    [
      schedule.template_key,
      schedule.variant_key,
      schedule.exam_key,
      schedule.region,
      schedule.questions_per_run || 25,
      !schedule.auto_ingest,
      schedule.id,
    ]
  );

  return r.rows[0].id;
}

async function updateScheduleAfterRun(schedule: any) {
  await pool.query(
    `UPDATE qbank_generation_schedules
     SET last_run_at = NOW(),
         total_runs_completed = COALESCE(total_runs_completed, 0) + 1,
         next_run_at = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [
      getNextRunAt(
        schedule.frequency || "daily",
        schedule.run_time_hour ?? 3,
        schedule.custom_cron_days
      ),
      schedule.id,
    ]
  );
}

/* =========================
   GENERATION
========================= */

async function runGeneration(runId: string, schedule: any) {
  try {
    const { renderPromptForVariant } = await import("./prompts/qbank-templates");

    const rendered = await renderPromptForVariant(
      schedule.template_key,
      schedule.variant_key,
      {
        count: schedule.questions_per_run || 25,
        rationaleMinWords: schedule.rationale_min_words || 250,
      }
    );

    if (!rendered) throw new Error("Template not found");

    await pool.query(
      `UPDATE qbank_generation_runs
       SET status='running', started_at=NOW()
       WHERE id=$1`,
      [runId]
    );

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: rendered.systemPrompt },
        { role: "user", content: rendered.userPrompt },
      ],
      max_tokens: 16000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "";
    const questions = extractQuestions(content);

    await finalizeRun(runId, schedule, questions, response.usage?.total_tokens || 0);

  } catch (err: any) {
    await pool.query(
      `UPDATE qbank_generation_runs
       SET status='failed', error_message=$1, completed_at=NOW()
       WHERE id=$2`,
      [err.message, runId]
    );
  }
}

/* =========================
   PARSING
========================= */

function extractQuestions(content: string): any[] {
  try {
    const arr = content.match(/\[[\s\S]*\]/);
    if (arr) return JSON.parse(arr[0]);

    const obj = content.match(/\{[\s\S]*\}/);
    if (obj) return [JSON.parse(obj[0])];
  } catch {}

  return [];
}

/* =========================
   FINALIZE
========================= */

async function finalizeRun(
  runId: string,
  schedule: any,
  questions: any[],
  tokens: number
) {
  const accepted = questions.filter((q) => q.stem || q.questionType);

  await pool.query(
    `UPDATE qbank_generation_runs SET
      status='completed',
      generated_count=$1,
      accepted_count=$2,
      rejected_count=$3,
      generated_items=$4,
      preview_items=$5,
      token_cost=$6,
      completed_at=NOW()
     WHERE id=$7`,
    [
      questions.length,
      accepted.length,
      questions.length - accepted.length,
      JSON.stringify(questions),
      JSON.stringify(questions.slice(0, 5)),
      tokens,
      runId,
    ]
  );

  if (schedule.auto_ingest && accepted.length) {
    await pool.query(
      `UPDATE qbank_generation_runs SET ingested=true WHERE id=$1`,
      [runId]
    );
  }
}

/* =========================
   SCHEDULER LOOP
========================= */

async function checkSchedules() {
  if (schedulerTickRunning) {
    emitStructuredLog(
      {
        level: "warn",
        type: "scheduler_skip",
        job: "standalone_qbank_scheduler",
        reason: "overlapping_tick",
      },
      "warn",
    );
    return;
  }
  const dbLease = await tryAcquireSchedulerLease(SCHEDULER_LOCK_NAMES.STANDALONE_QBANK, 540);
  if (!dbLease) {
    emitStructuredLog({
      level: "info",
      type: "scheduler_skip",
      job: "standalone_qbank_scheduler",
      reason: "db_lease_held",
    });
    return;
  }
  schedulerTickRunning = true;
  try {
  const now = new Date();

  const r = await pool.query(
    `SELECT * FROM qbank_generation_schedules
     WHERE enabled = true
       AND next_run_at <= $1`,
    [now]
  );

  for (const schedule of r.rows) {
    const runsToday = await getRunsToday(schedule.id);

    if (runsToday >= (schedule.max_daily_runs || 1)) {
      await updateScheduleAfterRun(schedule);
      continue;
    }

    const runId = await createRun(schedule);
    await updateScheduleAfterRun(schedule);
    runGeneration(runId, schedule); // async fire-and-forget
  }
  } finally {
    schedulerTickRunning = false;
  }
}

/* =========================
   START / STOP
========================= */

export function startScheduler(): void {
  emitStructuredLog({
    level: "info",
    type: "scheduler_start",
    job: "standalone_qbank_scheduler",
    msg: "Started",
  });

  schedulerInterval = setInterval(checkSchedules, 5 * 60 * 1000);
  setTimeout(checkSchedules, 30_000);
}

export function stopScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    emitStructuredLog({
      level: "info",
      type: "scheduler_stop",
      job: "standalone_qbank_scheduler",
      msg: "Stopped",
    });
  }
}

/* =========================
   ROUTES
========================= */

export function registerScheduleRoutes(app: Express): void {
  app.get("/api/admin/qbank/schedules", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const r = await pool.query(`SELECT * FROM qbank_generation_schedules ORDER BY created_at DESC`);
    res.json({ schedules: r.rows });
  });

  app.post("/api/admin/qbank/schedules", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const {
      name,
      templateKey,
      variantKey,
      examKey,
      region,
      frequency = "daily",
      runTimeHour = 3,
      enabled = false,
    } = req.body;

    if (!name || !templateKey || !variantKey || !examKey || !region) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const nextRunAt = enabled
      ? getNextRunAt(frequency, runTimeHour)
      : null;

    const r = await pool.query(
      `INSERT INTO qbank_generation_schedules
       (name, template_key, variant_key, exam_key, region, frequency, run_time_hour, enabled, next_run_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [name, templateKey, variantKey, examKey, region, frequency, runTimeHour, enabled, nextRunAt]
    );

    res.json({ schedule: r.rows[0] });
  });
}