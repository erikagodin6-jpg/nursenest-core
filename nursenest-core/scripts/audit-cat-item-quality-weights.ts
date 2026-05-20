#!/usr/bin/env tsx
/**
 * Read-only CAT item quality-weight audit.
 *
 * Produces:
 * - reports/cat-item-quality-weight-audit.json
 * - reports/cat-item-quality-weight-audit.md
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { calculateCatItemQualityWeight } from "../src/lib/questions/cat-item-quality-weight";
import { EXAM_QUESTION_STATUS_PUBLISHED_SQL } from "../src/lib/questions/exam-question-bank-sql";

type QuestionRow = {
  id: string;
  exam: string | null;
  tier: string | null;
  status: string | null;
  question_type: string | null;
  stem: string | null;
  options: unknown;
  correct_answer: unknown;
  rationale: string | null;
  distractor_rationales: unknown;
  clinical_reasoning: string | null;
  exam_strategy: string | null;
  clinical_trap: string | null;
  key_takeaway: string | null;
  topic: string | null;
  body_system: string | null;
  cognitive_level: string | null;
  difficulty: number | null;
  quality_score: number | null;
  is_mock_exam_eligible: boolean | null;
  is_adaptive_eligible: boolean | null;
};

type Band = "exclude" | "low" | "standard" | "preferred" | "flagship";

type WeakItem = {
  id: string;
  exam: string | null;
  topic: string | null;
  qualityWeight: number;
  qualityBand: Band;
  clinicalScore: number;
  psychometricScore: number;
  riskPenalty: number;
  exclusionReasons: string[];
  recommendations: string[];
  stemPreview: string;
};

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production"]) {
    const file = resolve(process.cwd(), name);
    if (!existsSync(file)) continue;
    const parsed = parseDotenv(readFileSync(file, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

function pct(part: number, whole: number): number {
  return whole ? Number(((part / whole) * 100).toFixed(1)) : 0;
}

function mean(values: number[]): number {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0;
}

function incBand(record: Record<Band, number>, band: Band): void {
  record[band] += 1;
}

async function main(): Promise<void> {
  loadEnv();

  if (!process.env.DATABASE_URL?.trim()) {
    console.log("DATABASE_URL is unset — skipping CAT item quality-weight audit.");
    return;
  }

  const limit = Math.max(1, Number.parseInt(process.env.NN_CAT_ITEM_WEIGHT_AUDIT_LIMIT ?? "10000", 10));
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRaw<QuestionRow[]>`
      SELECT
        id,
        exam,
        tier,
        status,
        question_type,
        stem,
        options,
        correct_answer,
        rationale,
        distractor_rationales,
        clinical_reasoning,
        exam_strategy,
        clinical_trap,
        key_takeaway,
        topic,
        body_system,
        cognitive_level,
        difficulty,
        quality_score,
        is_mock_exam_eligible,
        is_adaptive_eligible
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND coalesce(question_format, '') <> 'ecg_video'
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT ${limit}
    `;

    const bands: Record<Band, number> = {
      exclude: 0,
      low: 0,
      standard: 0,
      preferred: 0,
      flagship: 0,
    };
    const weights: number[] = [];
    const clinicalScores: number[] = [];
    const psychometricScores: number[] = [];
    const weakItems: WeakItem[] = [];
    const byExam = new Map<string, { total: number; averageWeight: number; weights: number[]; bands: Record<Band, number> }>();

    for (const row of rows) {
      const result = calculateCatItemQualityWeight({
        id: row.id,
        status: row.status,
        isMockExamEligible: row.is_mock_exam_eligible,
        isAdaptiveEligible: row.is_adaptive_eligible,
        stem: row.stem,
        options: row.options,
        correctAnswer: row.correct_answer,
        rationale: row.rationale,
        distractorRationales: row.distractor_rationales,
        clinicalReasoning: row.clinical_reasoning,
        examStrategy: row.exam_strategy,
        clinicalTrap: row.clinical_trap,
        keyTakeaway: row.key_takeaway,
        topic: row.topic,
        bodySystem: row.body_system,
        cognitiveLevel: row.cognitive_level,
        difficulty: row.difficulty,
        qualityScore: row.quality_score,
        questionType: row.question_type,
      });

      incBand(bands, result.qualityBand);
      weights.push(result.qualityWeight);
      clinicalScores.push(result.clinicalScore);
      psychometricScores.push(result.psychometricScore);

      const exam = row.exam ?? "(empty)";
      const bucket = byExam.get(exam) ?? {
        total: 0,
        averageWeight: 0,
        weights: [],
        bands: { exclude: 0, low: 0, standard: 0, preferred: 0, flagship: 0 },
      };
      bucket.total += 1;
      bucket.weights.push(result.qualityWeight);
      incBand(bucket.bands, result.qualityBand);
      byExam.set(exam, bucket);

      if (result.qualityBand === "exclude" || result.qualityBand === "low") {
        weakItems.push({
          id: row.id,
          exam: row.exam,
          topic: row.topic,
          qualityWeight: result.qualityWeight,
          qualityBand: result.qualityBand,
          clinicalScore: result.clinicalScore,
          psychometricScore: result.psychometricScore,
          riskPenalty: result.riskPenalty,
          exclusionReasons: result.exclusionReasons,
          recommendations: result.recommendations,
          stemPreview: String(row.stem ?? "").replace(/\s+/g, " ").slice(0, 180),
        });
      }
    }

    const preferredOrBetter = bands.preferred + bands.flagship;
    const standardOrBetter = preferredOrBetter + bands.standard;
    const report = {
      generatedAt: new Date().toISOString(),
      scannedRows: rows.length,
      averageQualityWeight: mean(weights),
      averageClinicalScore: mean(clinicalScores),
      averagePsychometricScore: mean(psychometricScores),
      bandCounts: bands,
      preferredOrBetterPercent: pct(preferredOrBetter, rows.length),
      standardOrBetterPercent: pct(standardOrBetter, rows.length),
      lowOrExcludedPercent: pct(bands.low + bands.exclude, rows.length),
      catPoolReadinessPercent: Math.max(
        0,
        Math.round(pct(standardOrBetter, rows.length) - pct(bands.exclude, rows.length) * 0.5),
      ),
      byExam: [...byExam.entries()]
        .map(([exam, value]) => ({
          exam,
          total: value.total,
          averageWeight: mean(value.weights),
          bandCounts: value.bands,
          preferredOrBetterPercent: pct(value.bands.preferred + value.bands.flagship, value.total),
        }))
        .sort((a, b) => a.averageWeight - b.averageWeight),
      weakestItems: weakItems.sort((a, b) => a.qualityWeight - b.qualityWeight).slice(0, 100),
    };

    const reportsDir = resolve(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });
    const jsonPath = resolve(reportsDir, "cat-item-quality-weight-audit.json");
    const mdPath = resolve(reportsDir, "cat-item-quality-weight-audit.md");

    writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    writeFileSync(
      mdPath,
      [
        "# CAT Item Quality Weight Audit",
        "",
        `Generated: ${report.generatedAt}`,
        "",
        `- Scanned rows: ${report.scannedRows}`,
        `- Average quality weight: ${report.averageQualityWeight}`,
        `- Average clinical score: ${report.averageClinicalScore}`,
        `- Average psychometric score: ${report.averagePsychometricScore}`,
        `- Preferred or better: ${report.preferredOrBetterPercent}%`,
        `- Standard or better: ${report.standardOrBetterPercent}%`,
        `- Low or excluded: ${report.lowOrExcludedPercent}%`,
        `- CAT pool readiness: ${report.catPoolReadinessPercent}%`,
        "",
        "## Band Counts",
        "",
        `- Flagship: ${bands.flagship}`,
        `- Preferred: ${bands.preferred}`,
        `- Standard: ${bands.standard}`,
        `- Low: ${bands.low}`,
        `- Exclude: ${bands.exclude}`,
        "",
      ].join("\n"),
    );

    console.log(`CAT pool readiness: ${report.catPoolReadinessPercent}%`);
    console.log(`Preferred or better: ${report.preferredOrBetterPercent}%`);
    console.log(`Low or excluded: ${report.lowOrExcludedPercent}%`);
    console.log(`Wrote ${jsonPath}`);
    console.log(`Wrote ${mdPath}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
