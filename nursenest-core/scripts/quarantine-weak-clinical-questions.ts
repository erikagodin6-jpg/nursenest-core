#!/usr/bin/env tsx
/**
 * Quarantine weak published exam questions using the shared clinical quality evaluator.
 *
 * Default mode is DRY RUN.
 * Apply mode requires BOTH:
 *   --apply
 *   NN_ALLOW_CLINICAL_QUESTION_QUARANTINE=1
 *
 * What apply mode does:
 * - status -> quarantined
 * - is_mock_exam_eligible -> false
 * - is_adaptive_eligible -> false
 * - is_flashcard_source -> false
 * - quality_feedback merged with quarantine metadata
 *
 * This deliberately avoids deleting rows so historical attempts and audit trails stay intact.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient, Prisma } from "@prisma/client";

import { evaluateClinicalQuestionQuality } from "../src/lib/questions/clinical-question-quality";
import { EXAM_QUESTION_STATUS_PUBLISHED_SQL } from "../src/lib/questions/exam-question-bank-sql";

type ExamQuestionRow = {
  id: string;
  exam: string | null;
  tier: string | null;
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
  quality_feedback: unknown;
};

type QuarantineCandidate = {
  id: string;
  exam: string | null;
  topic: string | null;
  score: number;
  reasonCodes: string[];
  hardFailureCount: number;
  stemPreview: string;
  qualityFeedback: Prisma.InputJsonValue;
};

function loadDotenvFromPackageRoot(): void {
  const root = process.cwd();
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = resolve(root, name);
    if (!existsSync(p)) continue;
    const parsed = parseDotenv(readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function shouldQuarantine(score: number, reasonCodes: string[], hardFailureCount: number): boolean {
  if (reasonCodes.includes("CORRECT_ANSWER_MISSING")) return true;
  if (reasonCodes.includes("QUALITY_SCORE_LOW")) return true;
  if (score < 55) return true;
  if (hardFailureCount >= 4) return true;
  return false;
}

function buildCandidate(row: ExamQuestionRow): QuarantineCandidate | null {
  const result = evaluateClinicalQuestionQuality({
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

  const errors = result.issues.filter((issue) => issue.severity === "error");
  const reasonCodes = result.issues.map((issue) => issue.code);
  if (!shouldQuarantine(result.score, reasonCodes, errors.length)) return null;

  const existingFeedback = asRecord(row.quality_feedback);
  const quarantineFeedback = {
    ...existingFeedback,
    clinicalQualityQuarantine: {
      at: new Date().toISOString(),
      score: result.score,
      reasonCodes,
      issues: result.issues,
      policy: "NurseNest premium clinical quality gate v1",
      action: "status=quarantined; eligibility=false",
    },
  } satisfies Prisma.InputJsonObject;

  return {
    id: row.id,
    exam: row.exam,
    topic: row.topic,
    score: result.score,
    reasonCodes,
    hardFailureCount: errors.length,
    stemPreview: String(row.stem ?? "").replace(/\s+/g, " ").slice(0, 160),
    qualityFeedback: quarantineFeedback,
  };
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();

  const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!rawUrl) {
    console.log("DATABASE_URL is unset — skipping quarantine workflow.");
    process.exit(0);
  }

  const apply = process.argv.includes("--apply");
  const applyAllowed = process.env.NN_ALLOW_CLINICAL_QUESTION_QUARANTINE === "1";
  const limit = Math.max(1, Number.parseInt(process.env.NN_QUARANTINE_SCAN_LIMIT ?? "5000", 10));
  const maxApply = Math.max(1, Number.parseInt(process.env.NN_QUARANTINE_MAX_APPLY ?? "100", 10));

  if (apply && !applyAllowed) {
    console.error("Refusing apply mode. Set NN_ALLOW_CLINICAL_QUESTION_QUARANTINE=1 to confirm.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRaw<ExamQuestionRow[]>`
      SELECT
        id,
        exam,
        tier,
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
        quality_feedback
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND coalesce(question_format, '') <> 'ecg_video'
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT ${limit}
    `;

    const candidates = rows
      .map(buildCandidate)
      .filter((candidate): candidate is QuarantineCandidate => candidate !== null)
      .sort((a, b) => a.score - b.score || b.hardFailureCount - a.hardFailureCount);

    console.log("\n╔══════════════════════════════════════════════════════════════════════╗");
    console.log("║  Clinical question quarantine workflow                              ║");
    console.log("╚══════════════════════════════════════════════════════════════════════╝\n");
    console.log(`Mode                   : ${apply ? "APPLY" : "DRY RUN"}`);
    console.log(`Scanned published rows : ${rows.length.toLocaleString()}`);
    console.log(`Quarantine candidates  : ${candidates.length.toLocaleString()}`);
    console.log(`Apply cap              : ${maxApply.toLocaleString()}`);

    for (const candidate of candidates.slice(0, 15)) {
      console.log(`\n${candidate.id} | score ${candidate.score} | ${candidate.exam ?? "(exam?)"} | ${candidate.topic ?? "(topic?)"}`);
      console.log(`  ${candidate.reasonCodes.slice(0, 6).join(", ")}`);
      console.log(`  ${candidate.stemPreview}`);
    }

    if (!apply) {
      console.log("\nDry run only. To apply: NN_ALLOW_CLINICAL_QUESTION_QUARANTINE=1 npx tsx scripts/quarantine-weak-clinical-questions.ts --apply");
      return;
    }

    const applySet = candidates.slice(0, maxApply);
    for (const candidate of applySet) {
      await prisma.examQuestion.update({
        where: { id: candidate.id },
        data: {
          status: "quarantined",
          isMockExamEligible: false,
          isAdaptiveEligible: false,
          isFlashcardSource: false,
          qualityFeedback: candidate.qualityFeedback,
        },
      });
    }

    console.log(`\nQuarantined ${applySet.length.toLocaleString()} question(s).`);
    console.log("Re-run npm run audit:exam-bank and npm run audit:exam-remediation-queue after applying.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
