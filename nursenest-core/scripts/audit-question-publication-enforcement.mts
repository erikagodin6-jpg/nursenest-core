#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import {
  enforceQuestionPublicationGovernance,
  type QuestionGovernanceEnforcementResult,
} from "../src/lib/questions/question-publication-enforcement-contracts";
import { QUESTION_ENRICHMENT_TARGET_EXAMS } from "../src/lib/questions/question-enrichment-governance";

const DASHBOARDS = [
  ["rn-quality-dashboard.md", "RN Quality Dashboard"],
  ["pn-quality-dashboard.md", "PN Quality Dashboard"],
  ["np-quality-dashboard.md", "NP Quality Dashboard"],
  ["international-quality-dashboard.md", "International Quality Dashboard"],
  ["translation-quality-dashboard.md", "Translation Quality Dashboard"],
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

function writeUnavailable(outDir: string, reason: string): void {
  const body = [
    `Generated: ${new Date().toISOString()}`,
    "",
    "The live `exam_questions` inventory was not audited because the database was unavailable in this environment.",
    "",
    `Reason: ${reason.replace(/\s+/g, " ").slice(0, 500)}`,
    "",
    "Run with a reachable read-only staging or production database:",
    "",
    "`npx tsx scripts/audit-question-publication-enforcement.mts`",
    "",
  ].join("\n");
  for (const [file, title] of DASHBOARDS) {
    writeFileSync(resolve(outDir, file), [`# ${title}`, "", body].join("\n"));
  }
}

function writeDashboard(outDir: string, file: string, title: string, rows: QuestionGovernanceEnforcementResult[]): void {
  const eligible = rows.filter((row) => row.publicationEligible).length;
  const blocked = rows.length - eligible;
  writeFileSync(
    resolve(outDir, file),
    [
      `# ${title}`,
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      `- Questions audited: ${rows.length}`,
      `- Publication eligible: ${eligible} (${pct(eligible, rows.length)}%)`,
      `- Blocked from publication: ${blocked}`,
      `- Flashcard-ready: ${rows.filter((row) => row.flashcardReady).length} (${pct(rows.filter((row) => row.flashcardReady).length, rows.length)}%)`,
      `- Practice-exam-eligible: ${rows.filter((row) => row.practiceExamEligible).length} (${pct(rows.filter((row) => row.practiceExamEligible).length, rows.length)}%)`,
      `- CAT-eligible: ${rows.filter((row) => row.catEligible).length} (${pct(rows.filter((row) => row.catEligible).length, rows.length)}%)`,
      `- Adaptive-ready: ${rows.filter((row) => row.adaptiveReady).length} (${pct(rows.filter((row) => row.adaptiveReady).length, rows.length)}%)`,
      `- Translation-ready: ${rows.filter((row) => row.translationReady).length} (${pct(rows.filter((row) => row.translationReady).length, rows.length)}%)`,
      `- Average overall ecosystem score: ${avg(rows.map((row) => row.scores.overallEcosystemScore))}`,
      "",
      "## Top Blocking Statuses",
      "",
      ...mdTable([
        ["Status", "Count"],
        ...Object.entries(
          rows.flatMap((row) => row.statuses).reduce<Record<string, number>>((acc, status) => {
            acc[status] = (acc[status] ?? 0) + 1;
            return acc;
          }, {}),
        )
          .sort((a, b) => b[1] - a[1])
          .map(([status, count]) => [status, String(count)]),
      ]),
      "",
      "## Weakest Items",
      "",
      ...mdTable([
        ["ID", "Overall", "Publication", "Statuses"],
        ...rows
          .slice()
          .sort((a, b) => a.scores.overallEcosystemScore - b.scores.overallEcosystemScore)
          .slice(0, 50)
          .map((row) => [row.id, String(row.scores.overallEcosystemScore), String(row.scores.publicationReadiness), row.statuses.join(", ")]),
      ]),
      "",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports/question-enforcement");
  mkdirSync(outDir, { recursive: true });

  if (!process.env.DATABASE_URL?.trim()) {
    writeUnavailable(outDir, "DATABASE_URL is unset.");
    console.log("DATABASE_URL is unset; wrote enforcement dashboard stubs.");
    return;
  }

  const prisma = new PrismaClient();
  const limit = Math.max(1, Number.parseInt(process.env.NN_QUESTION_ENFORCEMENT_AUDIT_LIMIT ?? "100000", 10));

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

    const paired = rows.map((row) => ({ row, result: enforceQuestionPublicationGovernance(row) }));
    const results = paired.map((item) => item.result);
    writeFileSync(resolve(outDir, "question-publication-enforcement-audit.json"), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));

    writeDashboard(outDir, "rn-quality-dashboard.md", "RN Quality Dashboard", paired.filter(({ row }) => /nclex[-_ ]?rn|rn/i.test(`${row.exam} ${row.tier}`)).map((item) => item.result));
    writeDashboard(outDir, "pn-quality-dashboard.md", "PN Quality Dashboard", paired.filter(({ row }) => /rex[-_ ]?pn|nclex[-_ ]?pn|rpn|lpn|\bpn\b/i.test(`${row.exam} ${row.tier}`)).map((item) => item.result));
    writeDashboard(outDir, "np-quality-dashboard.md", "NP Quality Dashboard", paired.filter(({ row }) => /cnple|fnp|agpcnp|pmhnp|pnp|whnp|enp|\bnp\b/i.test(`${row.exam} ${row.tier}`)).map((item) => item.result));
    writeDashboard(outDir, "international-quality-dashboard.md", "International Quality Dashboard", results);
    writeDashboard(outDir, "translation-quality-dashboard.md", "Translation Quality Dashboard", results.filter((row) => !row.translationReady || row.scores.translationReadiness < 100));

    console.log(`Audited ${results.length.toLocaleString()} questions for publication enforcement.`);
    console.log(`Publication eligible: ${results.filter((row) => row.publicationEligible).length.toLocaleString()}`);
  } catch (error) {
    writeUnavailable(outDir, error instanceof Error ? error.message : String(error));
    console.log("Database unavailable; wrote enforcement dashboard stubs with failure reason.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
