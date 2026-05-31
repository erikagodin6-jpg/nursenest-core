#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { CNPLE_LOFT_CASES } from "../src/content/cases/cnple-case-catalog";
import { cnplePracticalNursingNgnExpansionQuestions } from "../src/content/questions/cnple-practical-nursing-ngn-expansion";
import { nclexTier1FoundationalQuestions } from "../src/content/questions/nclex-tier1-foundational-questions";
import { nclexTier2ClinicalJudgmentQuestions } from "../src/content/questions/nclex-tier2-clinical-judgment-questions";
import { nclexTier3AdvancedReviewQuestions } from "../src/content/questions/nclex-tier3-advanced-review-questions";
import type { CaseStep, PatientCase } from "../src/lib/cases/longitudinal-case-types";
import {
  buildGlobalFlashcardStandardizationReport,
  type FlashcardReadinessDashboard,
  type GlobalFlashcardStandardizationReport,
} from "../src/lib/flashcards/global-flashcard-regeneration-standardization-engine";
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

function dashboardRows(report: GlobalFlashcardStandardizationReport): string[][] {
  const row = (label: string, dashboard: FlashcardReadinessDashboard): string[] => [
    label,
    String(dashboard.totalQuestions),
    String(dashboard.generatedFlashcards),
    String(dashboard.blockedSources),
    String(dashboard.weakFlashcards),
    String(dashboard.definitionOnlyFlashcards),
    String(dashboard.missingClinicalApplication),
    `${dashboard.readinessPercent}%`,
    `${dashboard.monetizationReadinessPercent}%`,
  ];
  return [
    ["Pathway", "Questions", "Generated", "Blocked", "Weak", "Definition-only", "Missing application", "Readiness", "Monetization"],
    row("RN", report.rnFlashcardReadiness),
    row("PN", report.pnFlashcardReadiness),
    row("NP", report.npFlashcardReadiness),
  ];
}

function writeReport(outDir: string, report: GlobalFlashcardStandardizationReport, sourceNote: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, "global-flashcard-regeneration-standardization-audit.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), sourceNote, report }, null, 2),
  );

  const blocked = report.results.filter((result) => result.status !== "GENERATED_FROM_VALIDATED_CONTENT");
  writeFileSync(
    resolve(outDir, "global-flashcard-regeneration-standardization-report.md"),
    [
      "# Global Flashcard Regeneration and Standardization Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      sourceNote,
      "",
      "## Readiness Dashboard",
      "",
      ...mdTable(dashboardRows(report)),
      "",
      "## Duplicate Reduction Report",
      "",
      `- Duplicate pairs: ${report.duplicateReductionReport.duplicatePairs}`,
      `- Exact duplicates: ${report.duplicateReductionReport.exactDuplicates}`,
      `- Near duplicates: ${report.duplicateReductionReport.nearDuplicates}`,
      `- Estimated reduction count: ${report.duplicateReductionReport.estimatedReductionCount}`,
      `- Estimated reduction percent: ${report.duplicateReductionReport.estimatedReductionPercent}%`,
      "",
      "## Duplicate Findings",
      "",
      ...mdTable([
        ["Primary Question", "Duplicate Question", "Similarity", "Reason"],
        ...report.duplicateReductionReport.findings.slice(0, 50).map((finding) => [
          finding.primaryQuestionId,
          finding.duplicateQuestionId,
          String(finding.similarity),
          finding.reason,
        ]),
      ]),
      "",
      "## Blocked Or Rewrite-Required Sources",
      "",
      ...mdTable([
        ["Question", "Role", "Status", "Issues"],
        ...blocked.slice(0, 75).map((result) => [
          result.questionId,
          result.pathwayGroup,
          result.status,
          result.issues.join(", "),
        ]),
      ]),
      "",
      "## Enforcement Rule",
      "",
      "Flashcards are generated only from validated enriched questions. Sources that are not publication-ready and flashcard-ready are blocked instead of producing standalone flashcard content.",
      "",
    ].join("\n"),
  );
}

function commonRnRow(question: {
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
    tags: [...question.hints.map((hint) => `hint:${hint}`), ...(question.adaptiveMetadata?.misconceptionTags ?? [])],
    isMockExamEligible: true,
    isAdaptiveEligible: Boolean(question.adaptiveMetadata),
    isFlashcardSource: true,
    blueprintWeight: question.adaptiveMetadata?.safetyCritical ? 1 : undefined,
  };
}

function staticRnRows(): QuestionEnrichmentAuditRow[] {
  const tier1 = nclexTier1FoundationalQuestions
    .filter((question) => question.exam.includes("NCLEX-RN"))
    .map((question): QuestionEnrichmentAuditRow => {
      const correctOption = question.options.find((option) => option.id === question.correctAnswer);
      return {
        ...commonRnRow(question),
        rationale: [question.rationale.correct, question.rationale.safetyPrinciple, question.rationale.prioritization].join(" "),
        correctAnswerExplanation: correctOption?.rationale,
        clinicalTrap: question.adaptiveMetadata.misconceptionTags.join(", "),
      };
    });
  const tier2 = nclexTier2ClinicalJudgmentQuestions.map((question): QuestionEnrichmentAuditRow => {
    const correctOption = question.options.find((option) => option.id === question.correctAnswer);
    return {
      ...commonRnRow(question),
      rationale: [question.rationale.correct, question.rationale.prioritizationLogic, question.rationale.safetyThinking, question.rationale.ngnReasoning].join(" "),
      correctAnswerExplanation: correctOption?.rationale,
      clinicalReasoning: question.rationale.ngnReasoning,
      clinicalTrap: question.noviceScopeGuardrail,
    };
  });
  const tier3 = nclexTier3AdvancedReviewQuestions.map((question): QuestionEnrichmentAuditRow => {
    const correctOption = question.options.find((option) => option.id === question.correctAnswer);
    return {
      ...commonRnRow(question),
      rationale: [question.rationale.correct, question.rationale.advancedNursingReasoning, question.rationale.escalationLogic, question.rationale.safetyPrinciple].join(" "),
      correctAnswerExplanation: correctOption?.rationale,
      clinicalReasoning: question.rationale.advancedNursingReasoning,
      clinicalTrap: question.advancedScopeGuardrail,
      difficulty: question.adaptiveMetadata.cognitiveLoad,
      cognitiveLevel: "clinical_judgment",
    };
  });
  return [...tier1, ...tier2, ...tier3];
}

function staticPnRows(): QuestionEnrichmentAuditRow[] {
  return cnplePracticalNursingNgnExpansionQuestions.map((question): QuestionEnrichmentAuditRow => {
    const correctOption = question.options.find((option) => option.correct);
    return {
      id: question.id,
      exam: question.adaptiveMetadata.examStyle === "REx-PN" ? "REx-PN" : "CNPLE",
      tier: "RPN",
      countryCode: question.adaptiveMetadata.country,
      languageCode: "en",
      status: "static_catalog",
      questionType: question.questionType,
      stem: [question.scenario, question.stem].join(" "),
      options: question.options.map((option) => option.text),
      correctAnswer: correctOption?.text ?? JSON.stringify(question.correctAnswer),
      rationale: [question.rationale.correct, question.rationale.pathophysiology, question.rationale.prioritizationLogic, question.rationale.safetyImplication].filter(Boolean).join(" "),
      correctAnswerExplanation: correctOption?.rationale,
      distractorRationales: question.rationale.wrongAnswers,
      clinicalReasoning: question.clinicalJudgmentFocus,
      clinicalPearl: question.canadianPracticeNote,
      examStrategy: question.hints.map((hint) => `Hint: ${hint}`).join(" "),
      clinicalTrap: question.adaptiveMetadata.misconceptionTags.join(", "),
      memoryHook: question.adaptiveMetadata.misconceptionTags[0],
      keyTakeaway: question.rationale.safetyImplication,
      difficulty: question.adaptiveMetadata.cognitiveLoad,
      cognitiveLevel: question.adaptiveMetadata.prioritizationLevel >= 3 ? "clinical_judgment" : "application",
      bodySystem: question.domain,
      topic: question.topic,
      subtopic: question.subtopic,
      nclexClientNeedsCategory: "practical-nursing-clinical-judgment",
      nclexClientNeedsSubcategory: question.domain,
      tags: ["blueprint:pn", ...question.hints.map((hint) => `hint:${hint}`), ...question.adaptiveMetadata.misconceptionTags],
      isMockExamEligible: true,
      isAdaptiveEligible: true,
      isFlashcardSource: true,
      blueprintWeight: 1,
    };
  });
}

function staticCnpleStepToRow(patientCase: PatientCase, step: CaseStep): QuestionEnrichmentAuditRow {
  const correct = step.question.options.find((option) => option.id === step.question.correctOptionId);
  return {
    id: `${patientCase.id}:step-${step.index}`,
    exam: "CNPLE",
    tier: "NP",
    countryCode: "CA",
    languageCode: "en",
    status: patientCase.governance?.reviewStatus ?? "static_catalog",
    questionType: step.question.family,
    stem: [patientCase.chiefComplaint, step.scenarioText, step.question.stem].filter(Boolean).join(" "),
    options: step.question.options.map((option) => option.label),
    correctAnswer: correct?.label ?? step.question.correctOptionId,
    rationale: step.question.rationale,
    correctAnswerExplanation: step.question.consequencesByOptionId?.[step.question.correctOptionId]?.outcome,
    distractorRationales: step.question.whyWrongByOptionId,
    incorrectAnswerRationale: step.question.whyWrongByOptionId,
    clinicalReasoning: step.question.clinicalJudgmentFocus,
    clinicalPearl: step.question.clinicalJudgmentFocus,
    examStrategy: `CNPLE-aligned case step. Domain: ${step.cnpleDomain}. Guideline sources: ${(patientCase.governance?.guidelineSources ?? []).join("; ")}`,
    clinicalTrap: Object.values(step.question.whyWrongByOptionId ?? {}).join(" "),
    memoryHook: step.question.family.replace(/-/g, " "),
    keyTakeaway: step.question.consequencesByOptionId?.[step.question.correctOptionId]?.outcome,
    difficulty: patientCase.difficulty,
    cognitiveLevel: "diagnostic_reasoning",
    bodySystem: patientCase.primaryDomain,
    topic: `${step.cnpleDomain} ${step.question.family}`,
    subtopic: step.heading,
    nclexClientNeedsCategory: "CNPLE",
    nclexClientNeedsSubcategory: step.cnpleDomain,
    tags: ["blueprint:cnple", `hint:${step.question.clinicalJudgmentFocus}`, step.cnpleDomain, step.question.family],
    isMockExamEligible: true,
    isAdaptiveEligible: true,
    isFlashcardSource: true,
    blueprintWeight: 1,
  };
}

function staticNpRows(): QuestionEnrichmentAuditRow[] {
  return CNPLE_LOFT_CASES.flatMap((patientCase) => patientCase.steps.map((step) => staticCnpleStepToRow(patientCase, step)));
}

function staticFallbackRows(): QuestionEnrichmentAuditRow[] {
  return [...staticRnRows(), ...staticPnRows(), ...staticNpRows()];
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports/flashcards");
  const staticRows = staticFallbackRows();

  if (!process.env.DATABASE_URL?.trim()) {
    const report = buildGlobalFlashcardStandardizationReport(staticRows);
    writeReport(outDir, report, "DATABASE_URL is unset. Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.");
    console.log("DATABASE_URL is unset; wrote static fallback flashcard regeneration report.");
    return;
  }

  const prisma = new PrismaClient();
  const limit = Math.max(1, Number.parseInt(process.env.NN_FLASHCARD_REGENERATION_AUDIT_LIMIT ?? "100000", 10));

  try {
    const rows = await prisma.examQuestion.findMany({
      where: {
        OR: [
          { exam: { in: ["NCLEX-RN", "NCLEX_RN", "US_NCLEX_RN", "CA_NCLEX_RN", "REx-PN", "REX_PN", "NCLEX-PN", "NCLEX_PN", "CNPLE", "FNP", "AGPCNP", "PMHNP", "PNP-PC", "PNP_PC", "WHNP", "ENP"] } },
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
    const report = buildGlobalFlashcardStandardizationReport(rows);
    writeReport(outDir, report, "Live `exam_questions` flashcard regeneration audit completed.");
    console.log(`Audited ${rows.length.toLocaleString()} question sources for flashcard regeneration.`);
  } catch (error) {
    const report = buildGlobalFlashcardStandardizationReport(staticRows);
    writeReport(
      outDir,
      report,
      [
        "The live `exam_questions` inventory was not audited because the database was unavailable in this environment.",
        "",
        `Reason: ${(error instanceof Error ? error.message : String(error)).replace(/\s+/g, " ").slice(0, 500)}`,
        "",
        "Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.",
      ].join("\n"),
    );
    console.log("Database unavailable; wrote static fallback flashcard regeneration report.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
