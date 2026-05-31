#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import {
  auditQuestionEditorialStandardization,
  summarizeEditorialStandardization,
  type EditorialStandardizationDimension,
  type EditorialStandardizationResult,
} from "../src/lib/questions/question-editorial-standardization";
import {
  QUESTION_ENRICHMENT_TARGET_EXAMS,
  type QuestionEnrichmentPathwayGroup,
} from "../src/lib/questions/question-enrichment-governance";

const REPORT_FILES = [
  ["rn-standardization-audit.md", "RN Standardization Audit"],
  ["pn-standardization-audit.md", "PN Standardization Audit"],
  ["np-standardization-audit.md", "NP Standardization Audit"],
  ["rationale-consistency-report.md", "Rationale Consistency Report"],
  ["hint-consistency-report.md", "Hint Consistency Report"],
  ["clinical-pearl-consistency-report.md", "Clinical Pearl Consistency Report"],
  ["flashcard-consistency-report.md", "Flashcard Consistency Report"],
  ["ngn-consistency-report.md", "NGN Consistency Report"],
  ["translation-readiness-report.md", "Translation Readiness Report"],
  ["ecosystem-quality-score.md", "Ecosystem Quality Score"],
] as const;

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

function avg(values: number[]): number {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function group(results: EditorialStandardizationResult[], pathwayGroup: QuestionEnrichmentPathwayGroup): EditorialStandardizationResult[] {
  return results.filter((result) => result.pathwayGroup === pathwayGroup);
}

function weakestRows(results: EditorialStandardizationResult[], dimension?: EditorialStandardizationDimension, limit = 50): string[][] {
  return [
    ["ID", "Exam", "Score", "Dimension Score", "Issues"],
    ...results
      .slice()
      .sort((a, b) => (dimension ? a.dimensions[dimension] - b.dimensions[dimension] : a.score - b.score))
      .slice(0, limit)
      .map((result) => [
        result.id,
        result.exam,
        String(result.score),
        dimension ? String(result.dimensions[dimension]) : "-",
        result.issues.slice(0, 4).map((issue) => issue.code).join(", "),
      ]),
  ];
}

function writeUnavailableReports(outDir: string, reason: string): void {
  const generatedAt = new Date().toISOString();
  const body = [
    `Generated: ${generatedAt}`,
    "",
    "The live `exam_questions` inventory was not audited because the database was unavailable in this environment.",
    "",
    `Reason: ${reason.replace(/\s+/g, " ").slice(0, 500)}`,
    "",
    "Run with a reachable read-only staging or production database:",
    "",
    "`npx tsx scripts/audit-question-ecosystem-standardization.mts`",
    "",
  ].join("\n");

  for (const [file, title] of REPORT_FILES) {
    writeFileSync(resolve(outDir, file), [`# ${title}`, "", body].join("\n"));
  }
}

function writePathwayReport(outDir: string, file: string, title: string, rows: EditorialStandardizationResult[]): void {
  writeFileSync(
    resolve(outDir, file),
    [
      `# ${title}`,
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      `- Questions audited: ${rows.length}`,
      `- Standardized: ${rows.filter((row) => row.standardized).length} (${pct(rows.filter((row) => row.standardized).length, rows.length)}%)`,
      `- Average score: ${avg(rows.map((row) => row.score))}`,
      "",
      "## Weakest Items",
      "",
      ...mdTable(weakestRows(rows)),
      "",
    ].join("\n"),
  );
}

function writeDimensionReport(outDir: string, file: string, title: string, rows: EditorialStandardizationResult[], dimension: EditorialStandardizationDimension): void {
  writeFileSync(
    resolve(outDir, file),
    [
      `# ${title}`,
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      `- Average ${dimension}: ${avg(rows.map((row) => row.dimensions[dimension]))}`,
      `- Below 90: ${rows.filter((row) => row.dimensions[dimension] < 90).length}`,
      "",
      "## Weakest Items",
      "",
      ...mdTable(weakestRows(rows, dimension)),
      "",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports/question-standardization");
  mkdirSync(outDir, { recursive: true });

  if (!process.env.DATABASE_URL?.trim()) {
    writeUnavailableReports(outDir, "DATABASE_URL is unset.");
    console.log("DATABASE_URL is unset; wrote standardization report stubs.");
    return;
  }

  const prisma = new PrismaClient();
  const limit = Math.max(1, Number.parseInt(process.env.NN_QUESTION_STANDARDIZATION_AUDIT_LIMIT ?? "100000", 10));

  try {
    const rows = await prisma.examQuestion.findMany({
      where: {
        OR: [
          { exam: { in: [...QUESTION_ENRICHMENT_TARGET_EXAMS] } },
          { tier: { in: ["RN", "RPN", "PN", "LPN", "NP"] } },
        ],
      },
      orderBy: [{ updatedAt: "desc" }],
      take: limit,
      select: {
        id: true,
        exam: true,
        tier: true,
        countryCode: true,
        languageCode: true,
        status: true,
        questionType: true,
        stem: true,
        options: true,
        correctAnswer: true,
        rationale: true,
        correctAnswerExplanation: true,
        distractorRationales: true,
        incorrectAnswerRationale: true,
        clinicalReasoning: true,
        clinicalPearl: true,
        examStrategy: true,
        clinicalTrap: true,
        memoryHook: true,
        mnemonic: true,
        keyTakeaway: true,
        difficulty: true,
        cognitiveLevel: true,
        bodySystem: true,
        topic: true,
        subtopic: true,
        nclexClientNeedsCategory: true,
        nclexClientNeedsSubcategory: true,
        tags: true,
        isMockExamEligible: true,
        isAdaptiveEligible: true,
        isFlashcardSource: true,
        blueprintWeight: true,
      },
    });

    const results = rows.map((row) => auditQuestionEditorialStandardization(row));
    const summary = summarizeEditorialStandardization(results);

    writeFileSync(resolve(outDir, "question-standardization-audit.json"), JSON.stringify({ generatedAt: new Date().toISOString(), summary, results }, null, 2));
    writePathwayReport(outDir, "rn-standardization-audit.md", "RN Standardization Audit", group(results, "RN"));
    writePathwayReport(outDir, "pn-standardization-audit.md", "PN Standardization Audit", group(results, "RPN_PN"));
    writePathwayReport(outDir, "np-standardization-audit.md", "NP Standardization Audit", group(results, "NP"));
    writeDimensionReport(outDir, "rationale-consistency-report.md", "Rationale Consistency Report", results, "rationaleConsistency");
    writeDimensionReport(outDir, "hint-consistency-report.md", "Hint Consistency Report", results, "hintConsistency");
    writeDimensionReport(outDir, "clinical-pearl-consistency-report.md", "Clinical Pearl Consistency Report", results, "clinicalPearlConsistency");
    writeDimensionReport(outDir, "flashcard-consistency-report.md", "Flashcard Consistency Report", results, "flashcardConsistency");
    writeDimensionReport(outDir, "ngn-consistency-report.md", "NGN Consistency Report", results, "ngnConsistency");
    writeDimensionReport(outDir, "translation-readiness-report.md", "Translation Readiness Report", results, "translationReadiness");

    writeFileSync(
      resolve(outDir, "ecosystem-quality-score.md"),
      [
        "# Ecosystem Quality Score",
        "",
        `Generated: ${new Date().toISOString()}`,
        "",
        `- Total questions audited: ${summary.totalQuestionsAudited}`,
        `- Ecosystem quality score: ${summary.ecosystemQualityScore}`,
        `- Standardized questions: ${summary.standardizedQuestions} (${pct(summary.standardizedQuestions, summary.totalQuestionsAudited)}%)`,
        "",
        "## Pathway Scores",
        "",
        ...mdTable([
          ["Pathway", "Total", "Standardized", "Average Score"],
          ...Object.entries(summary.byPathwayGroup).map(([pathway, row]) => [
            pathway,
            String(row.total),
            String(row.standardized),
            String(row.averageScore),
          ]),
        ]),
        "",
        "## Dimension Scores",
        "",
        ...mdTable([
          ["Dimension", "Average Score"],
          ...Object.entries(summary.byDimension).map(([dimension, score]) => [dimension, String(score)]),
        ]),
        "",
      ].join("\n"),
    );

    console.log(`Audited ${results.length.toLocaleString()} questions for editorial standardization.`);
    console.log(`Ecosystem quality score: ${summary.ecosystemQualityScore}`);
    console.log(`Reports written to ${outDir}`);
  } catch (error) {
    writeUnavailableReports(outDir, error instanceof Error ? error.message : String(error));
    console.log("Database unavailable; wrote standardization report stubs with failure reason.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
