#!/usr/bin/env tsx
/**
 * Builds an actionable remediation queue for published exam questions that do not meet
 * NurseNest clinical teaching standards.
 *
 * Output:
 * - reports/clinical-question-remediation-queue.json
 * - reports/clinical-question-remediation-queue.csv
 *
 * This script is read-only. It never edits or quarantines rows.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import {
  evaluateClinicalQuestionQuality,
  type ClinicalQuestionQualityIssue,
} from "../src/lib/questions/clinical-question-quality";
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
  updated_at: Date | null;
};

type RemediationQueueItem = {
  id: string;
  exam: string | null;
  tier: string | null;
  topic: string | null;
  bodySystem: string | null;
  score: number;
  priority: "P0" | "P1" | "P2";
  primaryIssueCodes: string[];
  issueCount: number;
  errorCount: number;
  warningCount: number;
  stemPreview: string;
  remediationSummary: string;
  issues: ClinicalQuestionQualityIssue[];
  updatedAt: string | null;
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

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (!/[",\n]/.test(s)) return s;
  return `"${s.replace(/"/g, '""')}"`;
}

function summarizeIssues(issues: ClinicalQuestionQualityIssue[]): string {
  return issues
    .slice(0, 4)
    .map((issue) => `${issue.code}: ${issue.remediation}`)
    .join(" | ");
}

function priorityFor(score: number, issues: ClinicalQuestionQualityIssue[]): RemediationQueueItem["priority"] {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const hasSafetyOrAnswerIssue = issues.some((issue) =>
    ["CORRECT_ANSWER_MISSING", "UNSAFE_ABSOLUTE_LANGUAGE", "QUALITY_SCORE_LOW"].includes(issue.code),
  );
  if (hasSafetyOrAnswerIssue || score < 55 || errorCount >= 4) return "P0";
  if (score < 80 || errorCount > 0) return "P1";
  return "P2";
}

function buildQueueItem(row: ExamQuestionRow): RemediationQueueItem | null {
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

  if (result.pass) return null;

  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");

  return {
    id: row.id,
    exam: row.exam,
    tier: row.tier,
    topic: row.topic,
    bodySystem: row.body_system,
    score: result.score,
    priority: priorityFor(result.score, result.issues),
    primaryIssueCodes: result.issues.slice(0, 5).map((issue) => issue.code),
    issueCount: result.issues.length,
    errorCount: errors.length,
    warningCount: warnings.length,
    stemPreview: String(row.stem ?? "").replace(/\s+/g, " ").slice(0, 180),
    remediationSummary: summarizeIssues(result.issues),
    issues: result.issues,
    updatedAt: row.updated_at ? row.updated_at.toISOString() : null,
  };
}

function writeOutputs(queue: RemediationQueueItem[]): void {
  const reportsDir = resolve(process.cwd(), "reports");
  mkdirSync(reportsDir, { recursive: true });

  const jsonPath = resolve(reportsDir, "clinical-question-remediation-queue.json");
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: queue.length,
        byPriority: {
          P0: queue.filter((item) => item.priority === "P0").length,
          P1: queue.filter((item) => item.priority === "P1").length,
          P2: queue.filter((item) => item.priority === "P2").length,
        },
        items: queue,
      },
      null,
      2,
    ),
  );

  const csvPath = resolve(reportsDir, "clinical-question-remediation-queue.csv");
  const header = [
    "priority",
    "score",
    "id",
    "exam",
    "tier",
    "topic",
    "bodySystem",
    "errorCount",
    "warningCount",
    "primaryIssueCodes",
    "stemPreview",
    "remediationSummary",
    "updatedAt",
  ];
  const rows = queue.map((item) =>
    [
      item.priority,
      item.score,
      item.id,
      item.exam,
      item.tier,
      item.topic,
      item.bodySystem,
      item.errorCount,
      item.warningCount,
      item.primaryIssueCodes.join(";"),
      item.stemPreview,
      item.remediationSummary,
      item.updatedAt,
    ]
      .map(csvEscape)
      .join(","),
  );
  writeFileSync(csvPath, [header.join(","), ...rows].join("\n") + "\n");

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${csvPath}`);
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();

  const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!rawUrl) {
    console.log("DATABASE_URL is unset — skipping clinical remediation queue build.");
    process.exit(0);
  }

  const limit = Math.max(1, Number.parseInt(process.env.NN_REMEDIATION_QUEUE_LIMIT ?? "5000", 10));
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
        updated_at
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND coalesce(question_format, '') <> 'ecg_video'
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT ${limit}
    `;

    const queue = rows
      .map(buildQueueItem)
      .filter((item): item is RemediationQueueItem => item !== null)
      .sort((a, b) => {
        const priorityRank = { P0: 0, P1: 1, P2: 2 } as const;
        return priorityRank[a.priority] - priorityRank[b.priority] || a.score - b.score;
      });

    console.log("\n╔══════════════════════════════════════════════════════════════════════╗");
    console.log("║  Clinical question remediation queue                                ║");
    console.log("╚══════════════════════════════════════════════════════════════════════╝\n");
    console.log(`Scanned published non-ECG rows : ${rows.length.toLocaleString()}`);
    console.log(`Queued for remediation         : ${queue.length.toLocaleString()}`);
    console.log(`P0 safety/depth priority       : ${queue.filter((item) => item.priority === "P0").length.toLocaleString()}`);
    console.log(`P1 quality priority            : ${queue.filter((item) => item.priority === "P1").length.toLocaleString()}`);
    console.log(`P2 polish priority             : ${queue.filter((item) => item.priority === "P2").length.toLocaleString()}`);

    for (const item of queue.slice(0, 10)) {
      console.log(`\n[${item.priority}] ${item.id} | score ${item.score} | ${item.exam ?? "(exam?)"} | ${item.topic ?? "(topic?)"}`);
      console.log(`  ${item.primaryIssueCodes.join(", ")}`);
      console.log(`  ${item.stemPreview}`);
    }

    writeOutputs(queue);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
