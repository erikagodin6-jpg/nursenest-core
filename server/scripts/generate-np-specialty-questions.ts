import { startPipelineRun, NP_FORMAT_MIX } from "../qbank-pipeline";
import { pool } from "../storage";

const NP_SPECIALTY_CONFIGS: Array<{
  examType: string;
  targetCount: number;
  tier: string;
  countryCode: string;
  questionFormatMix: Record<string, number>;
}> = [
  {
    examType: "AANP-FNP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: { ...NP_FORMAT_MIX, "bowtie": 3, "ordered-response": 2 },
  },
  {
    examType: "ANCC-FNP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: { ...NP_FORMAT_MIX, "bowtie": 3, "ordered-response": 2 },
  },
  {
    examType: "AGPCNP-AANP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: { ...NP_FORMAT_MIX, "bowtie": 3, "ordered-response": 2 },
  },
  {
    examType: "AGPCNP-ANCC",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: { ...NP_FORMAT_MIX, "bowtie": 3, "ordered-response": 2 },
  },
  {
    examType: "AGACNP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: {
      MCQ: 45,
      "scenario-based": 22,
      "lab-interpretation": 10,
      prioritization: 8,
      "dosage-calculation": 5,
      SATA: 5,
      "progressive-unfolding": 3,
      "bowtie": 2,
    },
  },
  {
    examType: "PMHNP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: {
      MCQ: 50,
      "scenario-based": 25,
      prioritization: 8,
      SATA: 7,
      "dosage-calculation": 5,
      "progressive-unfolding": 3,
      "bowtie": 2,
    },
  },
  {
    examType: "PNP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: {
      MCQ: 48,
      "scenario-based": 20,
      "dosage-calculation": 10,
      prioritization: 8,
      SATA: 6,
      "lab-interpretation": 5,
      "progressive-unfolding": 3,
    },
  },
  {
    examType: "WHNP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: {
      MCQ: 50,
      "scenario-based": 22,
      prioritization: 8,
      SATA: 7,
      "lab-interpretation": 5,
      "dosage-calculation": 3,
      "progressive-unfolding": 3,
      "bowtie": 2,
    },
  },
  {
    examType: "ENP",
    targetCount: 160,
    tier: "np",
    countryCode: "US",
    questionFormatMix: {
      MCQ: 45,
      "scenario-based": 22,
      prioritization: 12,
      "lab-interpretation": 8,
      SATA: 5,
      "dosage-calculation": 5,
      "progressive-unfolding": 3,
    },
  },
];

export interface NpGenerationResult {
  examType: string;
  runId: string;
  status: string;
  targetCount: number;
}

export async function startNpSpecialtyGeneration(
  examTypes?: string[]
): Promise<NpGenerationResult[]> {
  const results: NpGenerationResult[] = [];

  const configs = examTypes
    ? NP_SPECIALTY_CONFIGS.filter(c => examTypes.includes(c.examType))
    : NP_SPECIALTY_CONFIGS;

  if (configs.length === 0) {
    throw new Error(`No matching NP specialty configs found for: ${examTypes?.join(", ")}`);
  }

  console.log(`[NP-Generation] Starting generation for ${configs.length} NP specialties`);

  for (const config of configs) {
    console.log(`[NP-Generation] Launching ${config.examType} (target: ${config.targetCount} questions)`);

    try {
      const run = await startPipelineRun({
        tier: config.tier,
        examType: config.examType,
        targetCount: config.targetCount,
        questionFormatMix: config.questionFormatMix,
        countryCode: config.countryCode,
        cognitiveDistribution: {
          recall: 10,
          application: 30,
          analysis: 40,
          synthesis: 20,
        },
      });

      results.push({
        examType: config.examType,
        runId: run.id,
        status: run.status,
        targetCount: config.targetCount,
      });

      console.log(`[NP-Generation] ${config.examType} run started: ${run.id}`);
    } catch (err: any) {
      console.error(`[NP-Generation] Failed to start ${config.examType}:`, err.message);
      results.push({
        examType: config.examType,
        runId: "failed",
        status: "failed",
        targetCount: config.targetCount,
      });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}

const ALL_NP_EXAM_TYPES = [
  ...NP_SPECIALTY_CONFIGS.map(c => c.examType),
  "AGNP", "ACNP", "CNPE", "AGPCNP",
];

export async function bulkPublishNpQuestions(): Promise<{ updated: number; byExam: Record<string, number> }> {
  let totalUpdated = 0;
  const byExam: Record<string, number> = {};

  for (const examType of ALL_NP_EXAM_TYPES) {
    const result = await pool.query(
      `UPDATE exam_questions 
       SET status = 'published', published_at = COALESCE(published_at, NOW()), updated_at = NOW()
       WHERE tier = 'np' AND exam = $1 AND status != 'published' AND quality_score >= 60
       RETURNING id`,
      [examType]
    );
    const count = result.rowCount || 0;
    byExam[examType] = count;
    totalUpdated += count;
  }

  console.log(`[NP-Generation] Bulk published ${totalUpdated} questions across NP specialties`);
  return { updated: totalUpdated, byExam };
}

export async function validateNpQuestions(): Promise<{
  summary: Record<string, { total: number; published: number; needsReview: number; duplicates: number }>;
  orphaned: number;
  totalQuestions: number;
}> {
  const summary: Record<string, { total: number; published: number; needsReview: number; duplicates: number }> = {};
  let totalQuestions = 0;

  for (const examType of ALL_NP_EXAM_TYPES) {
    const statusResult = await pool.query(
      `SELECT 
         COUNT(*)::int as total,
         COUNT(*) FILTER (WHERE status = 'published')::int as published,
         COUNT(*) FILTER (WHERE status = 'needs_review')::int as needs_review
       FROM exam_questions WHERE tier = 'np' AND exam = $1`,
      [examType]
    );

    const dupeResult = await pool.query(
      `SELECT COUNT(*)::int as dupes FROM (
         SELECT stem_hash, COUNT(*) as cnt 
         FROM exam_questions WHERE tier = 'np' AND exam = $1 AND stem_hash IS NOT NULL
         GROUP BY stem_hash HAVING COUNT(*) > 1
       ) sub`,
      [examType]
    );

    const row = statusResult.rows[0];
    summary[examType] = {
      total: row.total,
      published: row.published,
      needsReview: row.needs_review,
      duplicates: dupeResult.rows[0]?.dupes || 0,
    };
    totalQuestions += row.total;
  }

  const orphanedResult = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM exam_questions 
     WHERE tier = 'np' AND exam NOT IN (${ALL_NP_EXAM_TYPES.map((_, i) => `$${i + 1}`).join(",")})`,
    ALL_NP_EXAM_TYPES
  );

  return {
    summary,
    orphaned: orphanedResult.rows[0]?.cnt || 0,
    totalQuestions,
  };
}

export async function deduplicateNpQuestions(): Promise<{ removed: number; byExam: Record<string, number> }> {
  let totalRemoved = 0;
  const byExam: Record<string, number> = {};

  for (const examType of ALL_NP_EXAM_TYPES) {
    const result = await pool.query(
      `DELETE FROM exam_questions 
       WHERE id IN (
         SELECT id FROM (
           SELECT id, ROW_NUMBER() OVER (PARTITION BY stem_hash ORDER BY quality_score DESC NULLS LAST, created_at ASC) as rn
           FROM exam_questions WHERE tier = 'np' AND exam = $1 AND stem_hash IS NOT NULL
         ) sub WHERE rn > 1
       ) RETURNING id`,
      [examType]
    );
    const count = result.rowCount || 0;
    byExam[examType] = count;
    totalRemoved += count;
  }

  console.log(`[NP-Generation] Deduplicated ${totalRemoved} questions across NP specialties`);
  return { removed: totalRemoved, byExam };
}

export { NP_SPECIALTY_CONFIGS };
