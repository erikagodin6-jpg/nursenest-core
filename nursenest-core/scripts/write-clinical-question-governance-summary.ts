#!/usr/bin/env tsx
/** Read-only rollup for NurseNest clinical question-bank governance. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { evaluateClinicalQuestionQuality } from "../src/lib/questions/clinical-question-quality";
import { scanClinicalRiskLanguage } from "../src/lib/questions/clinical-risk-language";
import { EXAM_QUESTION_STATUS_PUBLISHED_SQL } from "../src/lib/questions/exam-question-bank-sql";

type Row = {
  id: string;
  exam: string | null;
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
};

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production"]) {
    const path = resolve(process.cwd(), name);
    if (!existsSync(path)) continue;
    const parsed = parseDotenv(readFileSync(path, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

function pct(part: number, whole: number): number {
  return whole ? Number(((part / whole) * 100).toFixed(1)) : 0;
}

function inc(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

async function main(): Promise<void> {
  loadEnv();
  if (!process.env.DATABASE_URL?.trim()) {
    console.log("DATABASE_URL is unset — skipping clinical governance summary.");
    return;
  }

  const limit = Math.max(1, Number.parseInt(process.env.NN_CLINICAL_GOVERNANCE_LIMIT ?? "10000", 10));
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRaw<Row[]>`
      SELECT id, exam, question_type, stem, options, correct_answer, rationale,
             distractor_rationales, clinical_reasoning, exam_strategy, clinical_trap,
             key_takeaway, topic, body_system, cognitive_level, difficulty, quality_score
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND coalesce(question_format, '') <> 'ecg_video'
      ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
      LIMIT ${limit}
    `;

    let pass = 0;
    let needsWork = 0;
    let riskFlagged = 0;
    let highRiskFlagged = 0;
    const byExam = new Map<string, { total: number; pass: number; needsWork: number; risk: number }>();
    const issueCodes = new Map<string, number>();
    const riskCodes = new Map<string, number>();

    for (const row of rows) {
      const exam = row.exam ?? "(empty)";
      const bucket = byExam.get(exam) ?? { total: 0, pass: 0, needsWork: 0, risk: 0 };
      bucket.total += 1;

      const quality = evaluateClinicalQuestionQuality({
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

      if (quality.pass) {
        pass += 1;
        bucket.pass += 1;
      } else {
        needsWork += 1;
        bucket.needsWork += 1;
        for (const issue of quality.issues) inc(issueCodes, issue.code);
      }

      const risks = scanClinicalRiskLanguage({
        stem: row.stem,
        rationale: row.rationale,
        clinicalReasoning: row.clinical_reasoning,
        examStrategy: row.exam_strategy,
        options: row.options,
        topic: row.topic,
        bodySystem: row.body_system,
      });

      if (risks.length) {
        riskFlagged += 1;
        bucket.risk += 1;
        if (risks.some((risk) => risk.severity === "high")) highRiskFlagged += 1;
        for (const risk of risks) inc(riskCodes, risk.code);
      }

      byExam.set(exam, bucket);
    }

    const readiness = rows.length ? Math.max(0, Math.round(pct(pass, rows.length) - pct(highRiskFlagged, rows.length))) : 0;
    const summary = {
      generatedAt: new Date().toISOString(),
      scannedRows: rows.length,
      premiumClinicalPassRows: pass,
      premiumClinicalPassPercent: pct(pass, rows.length),
      needsWorkRows: needsWork,
      needsWorkPercent: pct(needsWork, rows.length),
      clinicalRiskFlaggedRows: riskFlagged,
      clinicalRiskFlaggedPercent: pct(riskFlagged, rows.length),
      highRiskFlaggedRows: highRiskFlagged,
      highRiskFlaggedPercent: pct(highRiskFlagged, rows.length),
      overallGovernanceReadinessPercent: readiness,
      byExam: [...byExam.entries()].map(([exam, values]) => ({
        exam,
        ...values,
        passPercent: pct(values.pass, values.total),
      })),
      topQualityIssues: [...issueCodes.entries()].sort((a, b) => b[1] - a[1]),
      topRiskSignals: [...riskCodes.entries()].sort((a, b) => b[1] - a[1]),
    };

    const dir = resolve(process.cwd(), "reports");
    mkdirSync(dir, { recursive: true });
    const jsonPath = resolve(dir, "clinical-question-governance-summary.json");
    const mdPath = resolve(dir, "clinical-question-governance-summary.md");
    writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
    writeFileSync(
      mdPath,
      `# Clinical Question Governance Summary\n\n` +
        `Generated: ${summary.generatedAt}\n\n` +
        `- Scanned rows: ${summary.scannedRows}\n` +
        `- Premium clinical pass: ${summary.premiumClinicalPassRows} (${summary.premiumClinicalPassPercent}%)\n` +
        `- Needs work: ${summary.needsWorkRows} (${summary.needsWorkPercent}%)\n` +
        `- Risk-language flags: ${summary.clinicalRiskFlaggedRows} (${summary.clinicalRiskFlaggedPercent}%)\n` +
        `- High-risk flags: ${summary.highRiskFlaggedRows} (${summary.highRiskFlaggedPercent}%)\n` +
        `- Overall governance readiness: ${summary.overallGovernanceReadinessPercent}%\n`,
    );

    console.log(`Clinical question governance readiness: ${readiness}%`);
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
