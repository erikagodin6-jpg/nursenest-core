#!/usr/bin/env tsx
/**
 * Read-only psychometric audit for published question-bank items.
 *
 * Produces:
 * - reports/psychometric-question-quality-audit.json
 * - reports/psychometric-question-quality-audit.md
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { analyzePsychometricQuestion } from "../src/lib/questions/psychometric-question-analysis";
import { EXAM_QUESTION_STATUS_PUBLISHED_SQL } from "../src/lib/questions/exam-question-bank-sql";

type QuestionRow = {
  id: string;
  exam: string | null;
  topic: string | null;
  body_system: string | null;
  question_type: string | null;
  stem: string | null;
  options: unknown;
  correct_answer: unknown;
  rationale: string | null;
};

type PsychometricAuditItem = {
  id: string;
  exam: string | null;
  topic: string | null;
  bodySystem: string | null;
  questionType: string | null;
  overallScore: number;
  guessingRiskScore: number;
  distractorQualityScore: number;
  structuralQualityScore: number;
  issueCodes: string[];
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
  return whole > 0 ? Number(((part / whole) * 100).toFixed(1)) : 0;
}

function inc(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function mean(values: number[]): number {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : 0;
}

async function main(): Promise<void> {
  loadEnv();

  if (!process.env.DATABASE_URL?.trim()) {
    console.log("DATABASE_URL is unset — skipping psychometric question quality audit.");
    return;
  }

  const limit = Math.max(1, Number.parseInt(process.env.NN_PSYCHOMETRIC_AUDIT_LIMIT ?? "10000", 10));
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRaw<QuestionRow[]>`
      SELECT id, exam, topic, body_system, question_type, stem, options, correct_answer, rationale
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND coalesce(question_format, '') <> 'ecg_video'
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT ${limit}
    `;

    const issueCounts = new Map<string, number>();
    const weakItems: PsychometricAuditItem[] = [];
    const allScores: number[] = [];
    const guessingScores: number[] = [];
    const distractorScores: number[] = [];
    const structuralScores: number[] = [];
    const byExam = new Map<string, { total: number; weak: number; averageScore: number; scores: number[] }>();

    for (const row of rows) {
      const result = analyzePsychometricQuestion({
        stem: row.stem,
        options: row.options,
        correctAnswer: row.correct_answer,
        rationale: row.rationale,
      });

      allScores.push(result.overallScore);
      guessingScores.push(result.guessingRiskScore);
      distractorScores.push(result.distractorQualityScore);
      structuralScores.push(result.structuralQualityScore);

      const exam = row.exam ?? "(empty)";
      const bucket = byExam.get(exam) ?? { total: 0, weak: 0, averageScore: 0, scores: [] };
      bucket.total += 1;
      bucket.scores.push(result.overallScore);

      for (const issue of result.issues) inc(issueCounts, issue.code);

      if (result.overallScore < 75 || result.issues.some((issue) => issue.severity === "high")) {
        bucket.weak += 1;
        weakItems.push({
          id: row.id,
          exam: row.exam,
          topic: row.topic,
          bodySystem: row.body_system,
          questionType: row.question_type,
          overallScore: result.overallScore,
          guessingRiskScore: result.guessingRiskScore,
          distractorQualityScore: result.distractorQualityScore,
          structuralQualityScore: result.structuralQualityScore,
          issueCodes: result.issues.map((issue) => issue.code),
          stemPreview: String(row.stem ?? "").replace(/\s+/g, " ").slice(0, 180),
        });
      }

      byExam.set(exam, bucket);
    }

    const examSummaries = [...byExam.entries()].map(([exam, bucket]) => ({
      exam,
      total: bucket.total,
      weak: bucket.weak,
      weakPercent: pct(bucket.weak, bucket.total),
      averageScore: mean(bucket.scores),
    }));

    const report = {
      generatedAt: new Date().toISOString(),
      scannedRows: rows.length,
      averageOverallScore: mean(allScores),
      averageGuessingRiskScore: mean(guessingScores),
      averageDistractorQualityScore: mean(distractorScores),
      averageStructuralQualityScore: mean(structuralScores),
      weakPsychometricRows: weakItems.length,
      weakPsychometricPercent: pct(weakItems.length, rows.length),
      psychometricReadinessPercent: Math.max(0, Math.round(mean(allScores) - pct(weakItems.length, rows.length) * 0.25)),
      byExam: examSummaries.sort((a, b) => a.averageScore - b.averageScore),
      topIssueCodes: [...issueCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([code, count]) => ({ code, count })),
      weakestItems: weakItems.sort((a, b) => a.overallScore - b.overallScore).slice(0, 100),
    };

    const reportsDir = resolve(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });
    const jsonPath = resolve(reportsDir, "psychometric-question-quality-audit.json");
    const mdPath = resolve(reportsDir, "psychometric-question-quality-audit.md");

    writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    writeFileSync(
      mdPath,
      [
        "# Psychometric Question Quality Audit",
        "",
        `Generated: ${report.generatedAt}`,
        "",
        `- Scanned rows: ${report.scannedRows}`,
        `- Average overall psychometric score: ${report.averageOverallScore}`,
        `- Average guessing-risk score: ${report.averageGuessingRiskScore}`,
        `- Average distractor-quality score: ${report.averageDistractorQualityScore}`,
        `- Average structural-quality score: ${report.averageStructuralQualityScore}`,
        `- Weak psychometric rows: ${report.weakPsychometricRows} (${report.weakPsychometricPercent}%)`,
        `- Psychometric readiness: ${report.psychometricReadinessPercent}%`,
        "",
        "## Top Issue Codes",
        "",
        ...report.topIssueCodes.slice(0, 20).map((entry) => `- ${entry.code}: ${entry.count}`),
        "",
      ].join("\n"),
    );

    console.log(`Psychometric readiness: ${report.psychometricReadinessPercent}%`);
    console.log(`Weak psychometric rows: ${report.weakPsychometricRows.toLocaleString()} (${report.weakPsychometricPercent}%)`);
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
