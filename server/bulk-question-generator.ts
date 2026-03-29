import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { runBatchGeneration } from "./qbank-generator";
import crypto from "crypto";

interface BulkBatchSpec {
  templateKey: string;
  variantKey: string;
  count: number;
  tier: string;
  label: string;
}

const BULK_GENERATION_PLAN: BulkBatchSpec[] = [
  { templateKey: "ngn_batch_v1", variantKey: "nclexrn_us", count: 800, tier: "rn", label: "NCLEX-RN US" },
  { templateKey: "ngn_batch_v1", variantKey: "nclexrn_can", count: 800, tier: "rn", label: "NCLEX-RN Canada" },
  { templateKey: "ngn_batch_v1", variantKey: "rn_international", count: 700, tier: "rn", label: "RN International" },
  { templateKey: "ngn_batch_v1", variantKey: "rn_bridging", count: 700, tier: "rn", label: "RN Bridging" },

  { templateKey: "np_us_v1", variantKey: "aanp_fnp", count: 350, tier: "np", label: "AANP-FNP" },
  { templateKey: "np_us_v1", variantKey: "ancc_fnp", count: 250, tier: "np", label: "ANCC-FNP" },
  { templateKey: "np_us_v1", variantKey: "agnp", count: 300, tier: "np", label: "AGNP" },
  { templateKey: "np_us_v1", variantKey: "agpcnp_aanp", count: 250, tier: "np", label: "AGPCNP (AANP)" },
  { templateKey: "np_us_v1", variantKey: "agpcnp_ancc", count: 250, tier: "np", label: "AGPCNP (ANCC)" },
  { templateKey: "np_us_v1", variantKey: "agacnp", count: 250, tier: "np", label: "AGACNP" },
  { templateKey: "np_us_v1", variantKey: "pmhnp", count: 300, tier: "np", label: "PMHNP" },
  { templateKey: "np_us_v1", variantKey: "acnp", count: 250, tier: "np", label: "ACNP" },
  { templateKey: "np_us_v1", variantKey: "pnp", count: 200, tier: "np", label: "PNP" },
  { templateKey: "np_us_v1", variantKey: "nnp", count: 175, tier: "np", label: "NNP" },
  { templateKey: "np_us_v1", variantKey: "enp", count: 200, tier: "np", label: "ENP" },
  { templateKey: "np_us_v1", variantKey: "whnp", count: 175, tier: "np", label: "WHNP" },

  { templateKey: "ngn_batch_v1", variantKey: "nclexpn_us", count: 750, tier: "rpn_lvn", label: "LVN (US)" },
  { templateKey: "ngn_batch_v1", variantKey: "rexpn_can", count: 375, tier: "rpn_lvn", label: "RPN (Canada REx-PN)" },
  { templateKey: "ngn_batch_v1", variantKey: "nclexpn_can", count: 375, tier: "rpn_lvn", label: "RPN (Canada NCLEX-PN)" },

  { templateKey: "allied_batch_v1", variantKey: "rrt", count: 250, tier: "allied", label: "Respiratory Therapist" },
  { templateKey: "allied_batch_v1", variantKey: "pharm_tech", count: 200, tier: "allied", label: "Pharmacy Technician" },
  { templateKey: "allied_batch_v1", variantKey: "mlt", count: 200, tier: "allied", label: "Medical Lab Technician" },
  { templateKey: "allied_batch_v1", variantKey: "imaging", count: 200, tier: "allied", label: "Radiologic Technologist" },
  { templateKey: "allied_batch_v1", variantKey: "sonographer", count: 150, tier: "allied", label: "Sonographer" },
  { templateKey: "allied_batch_v1", variantKey: "paramedic", count: 250, tier: "allied", label: "Paramedic" },
  { templateKey: "allied_batch_v1", variantKey: "psychotherapist", count: 150, tier: "allied", label: "Psychotherapist" },
  { templateKey: "allied_batch_v1", variantKey: "addictions_worker", count: 150, tier: "allied", label: "Addictions Counsellor" },
  { templateKey: "allied_batch_v1", variantKey: "social_worker", count: 250, tier: "allied", label: "Social Worker" },
  { templateKey: "allied_batch_v1", variantKey: "him", count: 150, tier: "allied", label: "Health Info Management" },
  { templateKey: "allied_batch_v1", variantKey: "ota", count: 150, tier: "allied", label: "OT Assistant" },
  { templateKey: "allied_batch_v1", variantKey: "pta", count: 150, tier: "allied", label: "PT Assistant" },
  { templateKey: "allied_batch_v1", variantKey: "ot", count: 200, tier: "allied", label: "Occupational Therapy" },
  { templateKey: "allied_batch_v1", variantKey: "pt", count: 200, tier: "allied", label: "Physical Therapy" },

  { templateKey: "certification_v1", variantKey: "ccrn", count: 120, tier: "cert", label: "CCRN" },
  { templateKey: "certification_v1", variantKey: "cen", count: 120, tier: "cert", label: "CEN" },
  { templateKey: "certification_v1", variantKey: "cnor", count: 80, tier: "cert", label: "CNOR" },
  { templateKey: "certification_v1", variantKey: "ocn", count: 80, tier: "cert", label: "OCN" },
  { templateKey: "certification_v1", variantKey: "cpn", count: 80, tier: "cert", label: "CPN" },
  { templateKey: "certification_v1", variantKey: "acls", count: 100, tier: "cert", label: "ACLS" },
  { templateKey: "certification_v1", variantKey: "pals", count: 100, tier: "cert", label: "PALS" },
  { templateKey: "certification_v1", variantKey: "bls", count: 80, tier: "cert", label: "BLS" },
  { templateKey: "certification_v1", variantKey: "nrp", count: 80, tier: "cert", label: "NRP" },
  { templateKey: "certification_v1", variantKey: "tncc", count: 80, tier: "cert", label: "TNCC" },
  { templateKey: "certification_v1", variantKey: "enpc", count: 80, tier: "cert", label: "ENPC" },
];

interface BulkGenerationRun {
  id: string;
  status: string;
  totalTarget: number;
  totalGenerated: number;
  totalAccepted: number;
  totalRejected: number;
  batchesTotal: number;
  batchesCompleted: number;
  batchesFailed: number;
  tierSummary: Record<string, { target: number; generated: number; accepted: number }>;
  formatDistribution: Record<string, number>;
  currentBatch: string | null;
  startedAt: string | null;
  completedAt: string | null;
  errorLog: string[];
}

async function ensureBulkGenerationTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bulk_generation_runs (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      status TEXT NOT NULL DEFAULT 'pending',
      total_target INTEGER NOT NULL,
      total_generated INTEGER DEFAULT 0,
      total_accepted INTEGER DEFAULT 0,
      total_rejected INTEGER DEFAULT 0,
      batches_total INTEGER DEFAULT 0,
      batches_completed INTEGER DEFAULT 0,
      batches_failed INTEGER DEFAULT 0,
      tier_summary JSONB DEFAULT '{}'::jsonb,
      format_distribution JSONB DEFAULT '{}'::jsonb,
      current_batch TEXT,
      batch_results JSONB DEFAULT '[]'::jsonb,
      error_log JSONB DEFAULT '[]'::jsonb,
      model TEXT DEFAULT 'gpt-4o-mini',
      triggered_by TEXT DEFAULT 'manual',
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

function splitIntoBatches(totalCount: number, maxBatchSize: number = 50): number[] {
  const batches: number[] = [];
  let remaining = totalCount;
  while (remaining > 0) {
    const batchSize = Math.min(remaining, maxBatchSize);
    batches.push(batchSize);
    remaining -= batchSize;
  }
  return batches;
}

export async function runBulkGeneration(params: {
  model: string;
  triggeredBy: string;
  dryRun: boolean;
  maxConcurrent?: number;
  batchSize?: number;
  tierFilter?: string[];
}): Promise<string> {
  await ensureBulkGenerationTable();

  const filteredPlan = params.tierFilter && params.tierFilter.length > 0
    ? BULK_GENERATION_PLAN.filter(b => params.tierFilter!.includes(b.tier))
    : BULK_GENERATION_PLAN;

  const totalTarget = filteredPlan.reduce((sum, b) => sum + b.count, 0);

  let totalBatches = 0;
  const batchSize = params.batchSize || 50;
  for (const spec of filteredPlan) {
    totalBatches += splitIntoBatches(spec.count, batchSize).length;
  }

  const tierSummary: Record<string, { target: number; generated: number; accepted: number }> = {};
  for (const spec of filteredPlan) {
    if (!tierSummary[spec.tier]) {
      tierSummary[spec.tier] = { target: 0, generated: 0, accepted: 0 };
    }
    tierSummary[spec.tier].target += spec.count;
  }

  const runRes = await pool.query(
    `INSERT INTO bulk_generation_runs (status, total_target, batches_total, tier_summary, model, triggered_by, started_at)
     VALUES ('running', $1, $2, $3, $4, $5, NOW()) RETURNING id`,
    [totalTarget, totalBatches, JSON.stringify(tierSummary), params.model, params.triggeredBy]
  );
  const bulkRunId = runRes.rows[0].id;

  processBulkGeneration(bulkRunId, filteredPlan, params).catch(err => {
    console.error(`[Bulk Generation] Fatal error in run ${bulkRunId}:`, err.message);
    pool.query(
      `UPDATE bulk_generation_runs SET status = 'failed', error_log = error_log || $2::jsonb, completed_at = NOW() WHERE id = $1`,
      [bulkRunId, JSON.stringify([`Fatal: ${err.message}`])]
    ).catch(() => {});
  });

  return bulkRunId;
}

async function processBulkGeneration(
  bulkRunId: string,
  plan: BulkBatchSpec[],
  params: { model: string; triggeredBy: string; dryRun: boolean; batchSize?: number }
): Promise<void> {
  const batchSize = params.batchSize || 50;
  let totalGenerated = 0;
  let totalAccepted = 0;
  let totalRejected = 0;
  let batchesCompleted = 0;
  let batchesFailed = 0;
  const formatDist: Record<string, number> = {};
  const tierSummary: Record<string, { target: number; generated: number; accepted: number }> = {};
  const errorLog: string[] = [];
  const batchResults: any[] = [];

  for (const spec of plan) {
    if (!tierSummary[spec.tier]) {
      tierSummary[spec.tier] = { target: 0, generated: 0, accepted: 0 };
    }
    tierSummary[spec.tier].target += spec.count;
  }

  for (const spec of plan) {
    const subBatches = splitIntoBatches(spec.count, batchSize);

    for (let i = 0; i < subBatches.length; i++) {
      const subCount = subBatches[i];
      const batchLabel = `${spec.label} (batch ${i + 1}/${subBatches.length}, ${subCount} items)`;

      await pool.query(
        `UPDATE bulk_generation_runs SET current_batch = $2 WHERE id = $1`,
        [bulkRunId, batchLabel]
      );

      try {
        console.log(`[Bulk Generation] Starting: ${batchLabel}`);

        const result = await runBatchGeneration({
          templateKey: spec.templateKey,
          variantKey: spec.variantKey,
          count: subCount,
          rationaleMinWords: 250,
          dryRun: params.dryRun,
          ingest: !params.dryRun,
          autoPublish: false,
          model: params.model,
          triggeredBy: `bulk_${bulkRunId}`,
        });

        totalGenerated += result.totalGenerated;
        totalAccepted += result.totalAccepted;
        totalRejected += result.totalRejected;
        batchesCompleted++;

        tierSummary[spec.tier].generated += result.totalGenerated;
        tierSummary[spec.tier].accepted += result.totalAccepted;

        if (result.previewItems) {
          for (const item of result.previewItems) {
            const fmt = item.questionType || "UNKNOWN";
            formatDist[fmt] = (formatDist[fmt] || 0) + 1;
          }
        }

        batchResults.push({
          label: batchLabel,
          runId: result.runId,
          status: "completed",
          generated: result.totalGenerated,
          accepted: result.totalAccepted,
          rejected: result.totalRejected,
        });

        console.log(`[Bulk Generation] Completed: ${batchLabel} — ${result.totalAccepted}/${result.totalGenerated} accepted`);
      } catch (err: any) {
        batchesFailed++;
        const errMsg = `Failed: ${batchLabel} — ${err.message}`;
        errorLog.push(errMsg);
        console.error(`[Bulk Generation] ${errMsg}`);

        batchResults.push({
          label: batchLabel,
          status: "failed",
          error: err.message,
        });
      }

      await pool.query(
        `UPDATE bulk_generation_runs SET
          total_generated = $2, total_accepted = $3, total_rejected = $4,
          batches_completed = $5, batches_failed = $6,
          tier_summary = $7, format_distribution = $8,
          error_log = $9, batch_results = $10
         WHERE id = $1`,
        [
          bulkRunId, totalGenerated, totalAccepted, totalRejected,
          batchesCompleted, batchesFailed,
          JSON.stringify(tierSummary), JSON.stringify(formatDist),
          JSON.stringify(errorLog), JSON.stringify(batchResults),
        ]
      );
    }
  }

  const finalStatus = batchesFailed === 0 ? "completed" : (batchesCompleted > 0 ? "completed_with_errors" : "failed");

  await pool.query(
    `UPDATE bulk_generation_runs SET
      status = $2, current_batch = NULL, completed_at = NOW()
     WHERE id = $1`,
    [bulkRunId, finalStatus]
  );

  console.log(`[Bulk Generation] Run ${bulkRunId} finished: ${finalStatus} — ${totalAccepted}/${totalGenerated} accepted across ${batchesCompleted} batches`);
}

async function runIntegrityValidation(): Promise<{
  totalQuestions: number;
  duplicateStems: number;
  missingRationales: number;
  invalidFormats: number;
  brokenAnswerKeys: number;
  duplicateIds: number;
  tierBreakdown: Record<string, number>;
  formatBreakdown: Record<string, number>;
  issues: { type: string; questionId: string; detail: string }[];
}> {
  const issues: { type: string; questionId: string; detail: string }[] = [];

  const totalRes = await pool.query("SELECT COUNT(*)::int as count FROM exam_questions");
  const totalQuestions = totalRes.rows[0].count;

  const dupStemRes = await pool.query(`
    SELECT stem_hash, COUNT(*)::int as cnt, array_agg(id) as ids
    FROM exam_questions
    WHERE stem_hash IS NOT NULL
    GROUP BY stem_hash
    HAVING COUNT(*) > 1
    LIMIT 100
  `);
  let duplicateStems = 0;
  for (const row of dupStemRes.rows) {
    duplicateStems += row.cnt - 1;
    issues.push({
      type: "duplicate_stem",
      questionId: row.ids[0],
      detail: `Stem hash ${row.stem_hash} appears ${row.cnt} times`,
    });
  }

  const missingRatRes = await pool.query(`
    SELECT id FROM exam_questions
    WHERE (rationale IS NULL OR LENGTH(TRIM(rationale)) < 50)
    LIMIT 200
  `);
  const missingRationales = missingRatRes.rows.length;
  for (const row of missingRatRes.rows.slice(0, 20)) {
    issues.push({
      type: "missing_rationale",
      questionId: row.id,
      detail: "Rationale is missing or too short (< 50 chars)",
    });
  }

  const invalidFmtRes = await pool.query(`
    SELECT id, question_type FROM exam_questions
    WHERE question_type IS NULL OR LENGTH(TRIM(question_type)) = 0
    LIMIT 100
  `);
  const invalidFormats = invalidFmtRes.rows.length;
  for (const row of invalidFmtRes.rows.slice(0, 20)) {
    issues.push({
      type: "invalid_format",
      questionId: row.id,
      detail: `Invalid question type: "${row.question_type}"`,
    });
  }

  const brokenAnswerRes = await pool.query(`
    SELECT id FROM exam_questions
    WHERE correct_answer IS NULL
       OR correct_answer::text = '[]'
       OR correct_answer::text = 'null'
       OR correct_answer::text = '{}'
    LIMIT 200
  `);
  const brokenAnswerKeys = brokenAnswerRes.rows.length;
  for (const row of brokenAnswerRes.rows.slice(0, 20)) {
    issues.push({
      type: "broken_answer_key",
      questionId: row.id,
      detail: "Correct answer is missing or empty",
    });
  }

  const dupIdRes = await pool.query(`
    SELECT id, COUNT(*)::int as cnt
    FROM exam_questions
    GROUP BY id
    HAVING COUNT(*) > 1
    LIMIT 50
  `);
  const duplicateIds = dupIdRes.rows.length;

  const tierRes = await pool.query(`
    SELECT tier, COUNT(*)::int as cnt FROM exam_questions GROUP BY tier ORDER BY cnt DESC
  `);
  const tierBreakdown: Record<string, number> = {};
  for (const row of tierRes.rows) {
    tierBreakdown[row.tier || "unknown"] = row.cnt;
  }

  const fmtRes = await pool.query(`
    SELECT question_type, COUNT(*)::int as cnt FROM exam_questions GROUP BY question_type ORDER BY cnt DESC
  `);
  const formatBreakdown: Record<string, number> = {};
  for (const row of fmtRes.rows) {
    formatBreakdown[row.question_type || "unknown"] = row.cnt;
  }

  const alliedTotalRes = await pool.query("SELECT COUNT(*)::int as count FROM allied_questions");
  if (alliedTotalRes.rows[0].count > 0) {
    tierBreakdown["allied_questions_table"] = alliedTotalRes.rows[0].count;
  }

  return {
    totalQuestions,
    duplicateStems,
    missingRationales,
    invalidFormats,
    brokenAnswerKeys,
    duplicateIds,
    tierBreakdown,
    formatBreakdown,
    issues,
  };
}

async function computeStemHashes(): Promise<number> {
  const res = await pool.query(`
    UPDATE exam_questions
    SET stem_hash = md5(lower(trim(stem)))
    WHERE stem_hash IS NULL AND stem IS NOT NULL
  `);
  return res.rowCount || 0;
}

function getGenerationPlanSummary(tierFilter?: string[]): {
  totalQuestions: number;
  tiers: Record<string, { count: number; variants: { label: string; count: number }[] }>;
  totalBatches: number;
} {
  const filtered = tierFilter && tierFilter.length > 0
    ? BULK_GENERATION_PLAN.filter(b => tierFilter.includes(b.tier))
    : BULK_GENERATION_PLAN;

  const tiers: Record<string, { count: number; variants: { label: string; count: number }[] }> = {};
  for (const spec of filtered) {
    if (!tiers[spec.tier]) {
      tiers[spec.tier] = { count: 0, variants: [] };
    }
    tiers[spec.tier].count += spec.count;
    tiers[spec.tier].variants.push({ label: spec.label, count: spec.count });
  }

  let totalBatches = 0;
  for (const spec of filtered) {
    totalBatches += splitIntoBatches(spec.count, 50).length;
  }

  return {
    totalQuestions: filtered.reduce((sum, b) => sum + b.count, 0),
    tiers,
    totalBatches,
  };
}

export function setupBulkGeneratorRoutes(app: Express): void {
  app.get("/api/admin/qbank/bulk-generation/plan", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const tierFilter = req.query.tiers ? String(req.query.tiers).split(",") : undefined;
      const plan = getGenerationPlanSummary(tierFilter);
      res.json(plan);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/qbank/bulk-generation/start", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const {
        model = "gpt-4o-mini",
        dryRun = true,
        batchSize = 50,
        tiers,
      } = req.body;

      const tierFilter = tiers ? (Array.isArray(tiers) ? tiers : String(tiers).split(",")) : undefined;

      const { createBgJob } = await import("./job-queue");
      const jobId = await createBgJob({
        type: "bulk_question_generate",
        payload: {
          model,
          dryRun,
          batchSize: Math.min(Math.max(batchSize, 10), 100),
          tierFilter,
          triggeredBy: admin.username || "admin",
        },
        totalItems: 1,
        batchSize: 1,
        createdBy: admin.username || "admin",
      });

      console.log(`[BulkGenerator] Job queued by admin: ${admin.username} (bgJobId: ${jobId})`);
      res.json({
        jobId,
        status: "queued",
        message: "Bulk generation queued for worker processing. Poll status endpoint for progress.",
      });
    } catch (err: any) {
      console.error("[Bulk Generator] Queue error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/qbank/bulk-generation/status/:runId", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await ensureBulkGenerationTable();
      const r = await pool.query("SELECT * FROM bulk_generation_runs WHERE id = $1", [req.params.runId]);
      if (!r.rows[0]) return res.status(404).json({ error: "Bulk run not found" });

      const run = r.rows[0];
      res.json({
        id: run.id,
        status: run.status,
        totalTarget: run.total_target,
        totalGenerated: run.total_generated,
        totalAccepted: run.total_accepted,
        totalRejected: run.total_rejected,
        batchesTotal: run.batches_total,
        batchesCompleted: run.batches_completed,
        batchesFailed: run.batches_failed,
        tierSummary: run.tier_summary,
        formatDistribution: run.format_distribution,
        currentBatch: run.current_batch,
        errorLog: run.error_log,
        model: run.model,
        triggeredBy: run.triggered_by,
        startedAt: run.started_at,
        completedAt: run.completed_at,
        progress: run.batches_total > 0
          ? Math.round(((run.batches_completed + run.batches_failed) / run.batches_total) * 100)
          : 0,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/qbank/bulk-generation/runs", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await ensureBulkGenerationTable();
      const r = await pool.query("SELECT * FROM bulk_generation_runs ORDER BY created_at DESC LIMIT 20");
      res.json(r.rows.map((run: any) => ({
        id: run.id,
        status: run.status,
        totalTarget: run.total_target,
        totalGenerated: run.total_generated,
        totalAccepted: run.total_accepted,
        batchesTotal: run.batches_total,
        batchesCompleted: run.batches_completed,
        batchesFailed: run.batches_failed,
        model: run.model,
        triggeredBy: run.triggered_by,
        startedAt: run.started_at,
        completedAt: run.completed_at,
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/qbank/integrity-validation", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const hashesUpdated = await computeStemHashes();
      const report = await runIntegrityValidation();

      res.json({
        ...report,
        hashesUpdated,
        passed: report.duplicateStems === 0 && report.missingRationales === 0 && report.invalidFormats === 0 && report.brokenAnswerKeys === 0 && report.duplicateIds === 0,
      });
    } catch (err: any) {
      console.error("[Integrity Validation] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/qbank/question-stats", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const examQRes = await pool.query(`
        SELECT
          tier,
          exam,
          question_type,
          status,
          COUNT(*)::int as count
        FROM exam_questions
        GROUP BY tier, exam, question_type, status
        ORDER BY tier, exam, question_type
      `);

      const alliedRes = await pool.query(`
        SELECT
          career_type,
          question_type,
          status,
          COUNT(*)::int as count
        FROM allied_questions
        GROUP BY career_type, question_type, status
        ORDER BY career_type, question_type
      `);

      const totalExam = await pool.query("SELECT COUNT(*)::int as count FROM exam_questions");
      const totalAllied = await pool.query("SELECT COUNT(*)::int as count FROM allied_questions");

      const tierTotals: Record<string, number> = {};
      for (const row of examQRes.rows) {
        tierTotals[row.tier] = (tierTotals[row.tier] || 0) + row.count;
      }

      const formatTotals: Record<string, number> = {};
      for (const row of examQRes.rows) {
        formatTotals[row.question_type] = (formatTotals[row.question_type] || 0) + row.count;
      }
      for (const row of alliedRes.rows) {
        formatTotals[row.question_type] = (formatTotals[row.question_type] || 0) + row.count;
      }

      res.json({
        totalExamQuestions: totalExam.rows[0].count,
        totalAlliedQuestions: totalAllied.rows[0].count,
        grandTotal: totalExam.rows[0].count + totalAllied.rows[0].count,
        tierTotals,
        formatTotals,
        examBreakdown: examQRes.rows,
        alliedBreakdown: alliedRes.rows,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/qbank/bulk-generation/cancel/:runId", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await ensureBulkGenerationTable();
      await pool.query(
        `UPDATE bulk_generation_runs SET status = 'cancelled', completed_at = NOW() WHERE id = $1 AND status = 'running'`,
        [req.params.runId]
      );
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
