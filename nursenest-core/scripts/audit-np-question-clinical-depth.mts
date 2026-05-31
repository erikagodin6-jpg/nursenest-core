#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { CNPLE_LOFT_CASES } from "../src/content/cases/cnple-case-catalog";
import type { CaseStep, PatientCase } from "../src/lib/cases/longitudinal-case-types";
import {
  auditNpQuestionClinicalDepthBatch,
  buildNpReadinessDashboard,
  type NpQuestionClinicalDepthAuditResult,
} from "../src/lib/questions/np-question-enrichment-clinical-depth-engine";
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

function weakestRows(results: readonly NpQuestionClinicalDepthAuditResult[], limit = 50): string[][] {
  return [
    ["ID", "Pathways", "Depth Score", "Publication Blocked", "Depth Gaps"],
    ...results
      .slice()
      .sort((a, b) => a.clinicalDepthScores.npDepthScore - b.clinicalDepthScores.npDepthScore)
      .slice(0, limit)
      .map((result) => [
        result.id,
        result.npPathways.join(", "),
        String(result.clinicalDepthScores.npDepthScore),
        String(result.npPublicationBlocked),
        result.clinicalDepthGaps.join(", "),
      ]),
  ];
}

function writeReport(outDir: string, results: readonly NpQuestionClinicalDepthAuditResult[], sourceNote: string): void {
  const dashboard = buildNpReadinessDashboard(results);

  writeFileSync(
    resolve(outDir, "np-question-clinical-depth-audit.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), sourceNote, dashboard, results }, null, 2),
  );

  writeFileSync(
    resolve(outDir, "np-question-clinical-depth-audit-report.md"),
    [
      "# NP Question Enrichment Audit and Clinical Depth Expansion Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      sourceNote,
      "",
      "## NP Readiness Dashboard",
      "",
      `- Total NP Questions: ${dashboard.totalNpQuestions}`,
      `- Diagnostic Reasoning Coverage: ${dashboard.diagnosticReasoningCoverage}%`,
      `- Differential Diagnosis Coverage: ${dashboard.differentialDiagnosisCoverage}%`,
      `- Prescribing Coverage: ${dashboard.prescribingCoverage}%`,
      `- Guideline-Based Management Coverage: ${dashboard.guidelineManagementCoverage}%`,
      `- Follow-Up Planning Coverage: ${dashboard.followUpPlanningCoverage}%`,
      `- Blueprint Coverage: ${dashboard.blueprintCoverage}%`,
      `- Publication Readiness: ${dashboard.publicationReadinessPercent}%`,
      `- Monetization Readiness: ${dashboard.monetizationReadinessPercent}%`,
      "",
      "## Pathway Coverage",
      "",
      ...mdTable([
        ["Pathway", "Total", "Publication Ready", "Monetization Ready", "Average Depth Score"],
        ...Object.entries(dashboard.byPathway).map(([pathway, row]) => [
          pathway,
          String(row.total),
          String(row.publicationReady),
          String(row.monetizationReady),
          String(row.averageDepthScore),
        ]),
      ]),
      "",
      "## Weakest Items",
      "",
      ...mdTable(weakestRows(results)),
      "",
      "## Remediation Plan",
      "",
      ...dashboard.remediationPlan.map((item) => `- ${item}`),
      "",
      "## Remediation Safety",
      "",
      "Generated NP expansion drafts are non-publishable authoring scaffolds. They must pass advanced-practice clinical review, blueprint review, prescribing-safety review, and educational review before publication.",
      "",
    ].join("\n"),
  );
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
    tags: [
      "blueprint:cnple",
      step.cnpleDomain,
      step.question.family,
      ...(patientCase.governance?.guidelineSources ?? []),
      ...(step.diagnosticArtifacts.length ? ["diagnostic reasoning", "labs imaging diagnostic interpretation"] : []),
      ...(step.medicationChanges.length ? ["prescribing relevance", "medication management"] : []),
      ...(step.followUpInterval ? ["follow-up planning"] : []),
    ],
    isMockExamEligible: true,
    isAdaptiveEligible: true,
    isFlashcardSource: true,
    blueprintWeight: 1,
  };
}

function auditStaticCnpleCases(): readonly NpQuestionClinicalDepthAuditResult[] {
  return auditNpQuestionClinicalDepthBatch(
    CNPLE_LOFT_CASES.flatMap((patientCase) => patientCase.steps.map((step) => staticCnpleStepToRow(patientCase, step))),
  );
}

function writeUnavailableReport(outDir: string, reason: string, staticResults: readonly NpQuestionClinicalDepthAuditResult[]): void {
  writeReport(
    outDir,
    staticResults,
    [
      "The live `exam_questions` inventory was not audited because the database was unavailable in this environment.",
      "",
      `Reason: ${reason.replace(/\s+/g, " ").slice(0, 500)}`,
      "",
      "Static fallback covers CNPLE LOFT case-step questions only. It is not a substitute for the live NP question-bank audit.",
      "",
      "Run against a reachable read-only staging or production database:",
      "",
      "`npx tsx scripts/audit-np-question-clinical-depth.mts`",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports/question-enrichment");
  mkdirSync(outDir, { recursive: true });
  const staticResults = auditStaticCnpleCases();

  if (!process.env.DATABASE_URL?.trim()) {
    writeUnavailableReport(outDir, "DATABASE_URL is unset.", staticResults);
    console.log("DATABASE_URL is unset; wrote NP static fallback report.");
    return;
  }

  const prisma = new PrismaClient();
  const limit = Math.max(1, Number.parseInt(process.env.NN_NP_QUESTION_DEPTH_AUDIT_LIMIT ?? "100000", 10));

  try {
    const rows = await prisma.examQuestion.findMany({
      where: {
        OR: [
          { tier: "NP" },
          { exam: { in: ["CNPLE", "FNP", "AGPCNP", "PMHNP", "PNP-PC", "PNP_PC", "WHNP", "ENP", "AANP-FNP", "ANCC-FNP", "ANCC-AGPCNP"] } },
          { topic: { contains: "nurse practitioner", mode: "insensitive" } },
          { topic: { contains: "diagnostic", mode: "insensitive" } },
          { topic: { contains: "prescribing", mode: "insensitive" } },
          { tags: { hasSome: ["np", "nurse-practitioner", "diagnostic-reasoning", "prescribing", "cnple", "fnp", "agpcnp", "pmhnp", "pnp-pc", "whnp", "enp"] } },
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

    const results = auditNpQuestionClinicalDepthBatch(rows);
    writeReport(outDir, results, "Live `exam_questions` NP audit completed.");
    console.log(`Audited ${results.length.toLocaleString()} NP questions.`);
  } catch (error) {
    writeUnavailableReport(outDir, error instanceof Error ? error.message : String(error), staticResults);
    console.log("Database unavailable; wrote NP static fallback report.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
