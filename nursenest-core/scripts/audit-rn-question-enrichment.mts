#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { nclexTier1FoundationalQuestions } from "../src/content/questions/nclex-tier1-foundational-questions";
import { nclexTier2ClinicalJudgmentQuestions } from "../src/content/questions/nclex-tier2-clinical-judgment-questions";
import { nclexTier3AdvancedReviewQuestions } from "../src/content/questions/nclex-tier3-advanced-review-questions";
import {
  auditRnQuestionEnrichmentBatch,
  summarizeRnQuestionEnrichment,
  type RnQuestionEnrichmentAuditResult,
} from "../src/lib/questions/rn-question-enrichment-remediation-engine";
import type { QuestionEnrichmentAuditRow } from "../src/lib/questions/question-enrichment-governance";

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

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function writeUnavailableReport(outDir: string, reason: string, staticResults: readonly RnQuestionEnrichmentAuditResult[]): void {
  const staticSummary = summarizeRnQuestionEnrichment(staticResults);
  writeFileSync(
    resolve(outDir, "rn-question-enrichment-audit-remediation-report.md"),
    [
      "# RN Question Enrichment Audit and Remediation Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      "The live `exam_questions` inventory was not audited because the database was unavailable in this environment.",
      "",
      `Reason: ${reason.replace(/\s+/g, " ").slice(0, 500)}`,
      "",
      "## Static Repository RN Audit Fallback",
      "",
      `- Static RN Questions Audited: ${staticSummary.totalRnQuestions}`,
      `- Missing Rationales: ${staticSummary.missingRationales}`,
      `- Missing Hints: ${staticSummary.missingHints}`,
      `- Missing Pearls: ${staticSummary.missingPearls}`,
      `- Missing Distractor Rationales: ${staticSummary.missingDistractorRationales}`,
      `- Missing Memory Anchors: ${staticSummary.missingMemoryAnchors}`,
      `- Missing Metadata: ${staticSummary.missingMetadata}`,
      `- Missing Blueprint Mapping: ${staticSummary.missingBlueprintMapping}`,
      `- Missing Flashcard Generation: ${staticSummary.missingFlashcardGeneration}`,
      `- CAT Eligible: ${staticSummary.catEligible}`,
      `- Adaptive Eligible: ${staticSummary.adaptiveEligible}`,
      `- Publication Readiness %: ${staticSummary.publicationReadinessPercent}`,
      `- Monetization Readiness %: ${staticSummary.monetizationReadinessPercent}`,
      "",
      "## Static Scope Counts",
      "",
      ...mdTable([
        ["Scope", "Questions"],
        ...Object.entries(staticSummary.scopeCounts).map(([scope, count]) => [scope, String(count)]),
      ]),
      "",
      "## Remediation Plan",
      "",
      ...staticSummary.remediationPlan.map((item) => `- ${item}`),
      "",
      "This fallback covers repository-authored static RN catalogs only. It is not a substitute for the live `exam_questions` database audit.",
      "",
      "Run against a reachable read-only staging or production database:",
      "",
      "`npx tsx scripts/audit-rn-question-enrichment.mts`",
      "",
      "The RN enrichment engine and contract tests remain available without database access.",
      "",
    ].join("\n"),
  );
}

function weakestRows(results: readonly RnQuestionEnrichmentAuditResult[], limit = 50): string[][] {
  return [
    ["ID", "Exam", "Scopes", "Score", "Missing Fields"],
    ...results
      .slice()
      .sort((a, b) => a.scores.overallQuality - b.scores.overallQuality)
      .slice(0, limit)
      .map((result) => [
        result.id,
        result.exam,
        result.rnScopes.join(", "),
        String(result.scores.overallQuality),
        result.missingFields.join(", "),
      ]),
  ];
}

function writeReport(outDir: string, results: readonly RnQuestionEnrichmentAuditResult[]): void {
  const summary = summarizeRnQuestionEnrichment(results);
  const blocked = results.filter((result) => result.rnPublicationBlocked);

  writeFileSync(
    resolve(outDir, "rn-question-enrichment-audit.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), summary, results }, null, 2),
  );

  writeFileSync(
    resolve(outDir, "rn-question-enrichment-audit-remediation-report.md"),
    [
      "# RN Question Enrichment Audit and Remediation Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      "## Executive Output",
      "",
      `- Total RN Questions: ${summary.totalRnQuestions}`,
      `- Missing Rationales: ${summary.missingRationales}`,
      `- Missing Distractor Rationales: ${summary.missingDistractorRationales}`,
      `- Missing Hints: ${summary.missingHints}`,
      `- Missing Pearls: ${summary.missingPearls}`,
      `- Missing Memory Anchors: ${summary.missingMemoryAnchors}`,
      `- Missing Metadata: ${summary.missingMetadata}`,
      `- Missing Blueprint Mapping: ${summary.missingBlueprintMapping}`,
      `- Missing Flashcard Generation: ${summary.missingFlashcardGeneration}`,
      `- CAT Eligible: ${summary.catEligible}`,
      `- Adaptive Eligible: ${summary.adaptiveEligible}`,
      `- Publication Readiness %: ${summary.publicationReadinessPercent}`,
      `- Monetization Readiness %: ${summary.monetizationReadinessPercent}`,
      "",
      "## Scope Counts",
      "",
      ...mdTable([
        ["Scope", "Questions"],
        ...Object.entries(summary.scopeCounts).map(([scope, count]) => [scope, String(count)]),
      ]),
      "",
      "## Publication-Blocked RN Questions",
      "",
      ...mdTable(weakestRows(blocked)),
      "",
      "## Remediation Plan",
      "",
      ...summary.remediationPlan.map((item) => `- ${item}`),
      "",
      "## Remediation Safety",
      "",
      "Generated missing-component drafts are authoring aids only. They remain `publishable=false` until clinical, educational, blueprint, and adaptive-learning review gates pass.",
      "",
    ].join("\n"),
  );
}

function commonRow(question: {
  readonly id: string;
  readonly exam?: readonly string[];
  readonly domain?: string;
  readonly topic?: string;
  readonly subtopic?: string;
  readonly questionType?: string;
  readonly stem: string;
  readonly correctAnswer: string;
  readonly options: readonly { readonly id: string; readonly text: string; readonly correct: boolean; readonly rationale: string }[];
  readonly hints: readonly string[];
  readonly teachingPoint?: string;
  readonly adaptiveMetadata?: {
    readonly cognitiveLoad?: number;
    readonly safetyCritical?: boolean;
    readonly prioritizationLevel?: number;
    readonly misconceptionTags?: readonly string[];
  };
}): QuestionEnrichmentAuditRow {
  const correctOption = question.options.find((option) => option.id === question.correctAnswer || option.correct);
  return {
    id: question.id,
    exam: question.exam?.includes("NCLEX-RN") ? "NCLEX-RN" : question.exam?.[0] ?? "NCLEX-RN",
    tier: "RN",
    countryCode: "US",
    languageCode: "en",
    status: "static_catalog",
    questionType: question.questionType ?? "multiple_choice",
    stem: question.stem,
    options: question.options.map((option) => option.text),
    correctAnswer: correctOption?.text ?? question.correctAnswer,
    distractorRationales: Object.fromEntries(question.options.filter((option) => !option.correct).map((option) => [option.id, option.rationale])),
    clinicalPearl: question.teachingPoint,
    examStrategy: question.hints[0] ? `Hint: ${question.hints[0]}` : undefined,
    memoryHook: question.adaptiveMetadata?.misconceptionTags?.[0],
    keyTakeaway: question.teachingPoint,
    difficulty: question.adaptiveMetadata?.cognitiveLoad,
    cognitiveLevel: question.adaptiveMetadata?.prioritizationLevel && question.adaptiveMetadata.prioritizationLevel >= 3 ? "clinical_judgment" : "application",
    bodySystem: question.domain,
    topic: question.topic,
    subtopic: question.subtopic,
    nclexClientNeedsCategory: question.adaptiveMetadata?.safetyCritical ? "safe-effective-care-environment" : undefined,
    tags: [
      ...question.hints.map((hint) => `hint:${hint}`),
      ...(question.adaptiveMetadata?.misconceptionTags ?? []),
    ],
    isMockExamEligible: true,
    isAdaptiveEligible: Boolean(question.adaptiveMetadata),
    isFlashcardSource: true,
    blueprintWeight: question.adaptiveMetadata?.safetyCritical ? 1 : undefined,
  };
}

function tier1Row(question: (typeof nclexTier1FoundationalQuestions)[number]): QuestionEnrichmentAuditRow {
  const correctOption = question.options.find((option) => option.id === question.correctAnswer);
  return {
    ...commonRow(question),
    exam: question.exam.includes("NCLEX-RN") ? "NCLEX-RN" : question.exam[0],
    rationale: [question.rationale.correct, question.rationale.safetyPrinciple, question.rationale.prioritization].join(" "),
    correctAnswerExplanation: correctOption?.rationale,
    clinicalTrap: question.adaptiveMetadata.misconceptionTags.join(", "),
  };
}

function tier2Row(question: (typeof nclexTier2ClinicalJudgmentQuestions)[number]): QuestionEnrichmentAuditRow {
  const correctOption = question.options.find((option) => option.id === question.correctAnswer);
  return {
    ...commonRow(question),
    rationale: [question.rationale.correct, question.rationale.prioritizationLogic, question.rationale.safetyThinking, question.rationale.ngnReasoning].join(" "),
    correctAnswerExplanation: correctOption?.rationale,
    clinicalReasoning: question.rationale.ngnReasoning,
    clinicalTrap: question.noviceScopeGuardrail,
  };
}

function tier3Row(question: (typeof nclexTier3AdvancedReviewQuestions)[number]): QuestionEnrichmentAuditRow {
  const correctOption = question.options.find((option) => option.id === question.correctAnswer);
  return {
    ...commonRow(question),
    rationale: [question.rationale.correct, question.rationale.advancedNursingReasoning, question.rationale.escalationLogic, question.rationale.safetyPrinciple].join(" "),
    correctAnswerExplanation: correctOption?.rationale,
    clinicalReasoning: question.rationale.advancedNursingReasoning,
    clinicalTrap: question.advancedScopeGuardrail,
    difficulty: question.adaptiveMetadata.cognitiveLoad,
    cognitiveLevel: "clinical_judgment",
  };
}

function auditStaticRnQuestionCatalogs(): readonly RnQuestionEnrichmentAuditResult[] {
  return auditRnQuestionEnrichmentBatch([
    ...nclexTier1FoundationalQuestions.filter((question) => question.exam.includes("NCLEX-RN")).map(tier1Row),
    ...nclexTier2ClinicalJudgmentQuestions.map(tier2Row),
    ...nclexTier3AdvancedReviewQuestions.map(tier3Row),
  ]);
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports/question-enrichment");
  mkdirSync(outDir, { recursive: true });
  const staticResults = auditStaticRnQuestionCatalogs();

  if (!process.env.DATABASE_URL?.trim()) {
    writeUnavailableReport(outDir, "DATABASE_URL is unset.", staticResults);
    console.log("DATABASE_URL is unset; wrote RN audit unavailable report.");
    return;
  }

  const prisma = new PrismaClient();
  const limit = Math.max(1, Number.parseInt(process.env.NN_RN_QUESTION_ENRICHMENT_AUDIT_LIMIT ?? "100000", 10));

  try {
    const rows = await prisma.examQuestion.findMany({
      where: {
        OR: [
          { tier: "RN" },
          { exam: { in: ["NCLEX-RN", "NCLEX_RN", "US_NCLEX_RN", "CA_NCLEX_RN"] } },
          { topic: { contains: "ECG", mode: "insensitive" } },
          { topic: { contains: "lab", mode: "insensitive" } },
          { topic: { contains: "clinical skill", mode: "insensitive" } },
          { bodySystem: { contains: "ECG", mode: "insensitive" } },
          { bodySystem: { contains: "lab", mode: "insensitive" } },
          { tags: { hasSome: ["new grad", "new-grad", "ecg", "labs", "clinical-skills", "clinical skills"] } },
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

    const results = auditRnQuestionEnrichmentBatch(rows);
    writeReport(outDir, results);
    console.log(`Audited ${results.length.toLocaleString()} RN questions.`);
  } catch (error) {
    writeUnavailableReport(outDir, error instanceof Error ? error.message : String(error), staticResults);
    console.log("Database unavailable; wrote RN audit unavailable report.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
