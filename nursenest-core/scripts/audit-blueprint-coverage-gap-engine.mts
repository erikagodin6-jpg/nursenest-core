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
  buildBlueprintCoverageDashboard,
  type BlueprintCoverageContentItem,
  type BlueprintCoverageDashboard,
  type BlueprintCoverageExamReport,
} from "../src/lib/blueprints/blueprint-coverage-gap-engine";

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

function isNgnType(value: unknown): boolean {
  return /\b(ngn|case|case-study|bowtie|matrix|trend|cloze|chart|hotspot|extended|ordered|sata)\b/i.test(String(value ?? ""));
}

function reportRows(dashboard: BlueprintCoverageDashboard): string[][] {
  return [
    ["Exam", "Coverage", "Blueprint", "Readiness", "Publication", "Adaptive", "Monetization", "Weakest Domains"],
    ...dashboard.exams.map((report) => [
      report.exam,
      `${report.overallCoveragePercent}%`,
      `${report.blueprintCompliancePercent}%`,
      `${report.readinessPercent}%`,
      `${report.publicationPercent}%`,
      `${report.adaptiveLearningPercent}%`,
      `${report.monetizationPercent}%`,
      report.weakestDomains.map((domain) => `${domain.label} ${domain.coveragePercent}%`).join("; "),
    ]),
  ];
}

function contentTotalsRows(report: BlueprintCoverageExamReport): string[][] {
  return [
    ["Content Type", "Actual", "Target", "Coverage"],
    ...Object.entries(report.totals).map(([type, count]) => [
      type,
      String(count),
      String(report.targets[type as keyof typeof report.targets]),
      `${Math.min(100, Number(((count / report.targets[type as keyof typeof report.targets]) * 100).toFixed(1)))}%`,
    ]),
  ];
}

function writeReport(outDir: string, dashboard: BlueprintCoverageDashboard, sourceNote: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, "blueprint-coverage-dashboard.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), sourceNote, dashboard }, null, 2),
  );

  const topBacklog = dashboard.rankedContentBacklog.slice(0, 50);
  writeFileSync(
    resolve(outDir, "blueprint-coverage-dashboard-report.md"),
    [
      "# Blueprint Coverage Dashboard and Content Gap Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      sourceNote,
      "",
      "## Executive Summary",
      "",
      `- Overall Coverage: ${dashboard.overallCoveragePercent}%`,
      `- Readiness: ${dashboard.readinessPercent}%`,
      `- Publication: ${dashboard.publicationPercent}%`,
      `- Adaptive Learning: ${dashboard.adaptiveLearningPercent}%`,
      `- Monetization: ${dashboard.monetizationPercent}%`,
      `- Ranked Backlog Items: ${dashboard.rankedContentBacklog.length}`,
      `- Unmapped Items: ${dashboard.unmappedItems.length}`,
      "",
      "## Exam Coverage",
      "",
      ...mdTable(reportRows(dashboard)),
      "",
      "## Per-Exam Content Totals",
      "",
      ...dashboard.exams.flatMap((report) => [
        `### ${report.exam}`,
        "",
        ...mdTable(contentTotalsRows(report)),
        "",
      ]),
      "## Ranked Content Backlog",
      "",
      ...mdTable([
        ["Rank", "Exam", "Domain", "Content Type", "Missing", "Priority Score", "Rationale"],
        ...topBacklog.map((item) => [
          String(item.rank),
          item.exam,
          item.domainLabel,
          item.contentType,
          String(item.missingCount),
          String(item.priorityScore),
          item.rationale,
        ]),
      ]),
      "",
      "## Missing Content By Weakest Domains",
      "",
      ...dashboard.exams.flatMap((report) => [
        `### ${report.exam}`,
        "",
        ...mdTable([
          ["Domain", "Status", "Coverage", "Actual %", "Target %", "Missing Content"],
          ...report.weakestDomains.map((domain) => [
            domain.label,
            domain.status,
            `${domain.coveragePercent}%`,
            `${domain.actualPercent}%`,
            `${domain.targetPercent}%`,
            Object.entries(domain.missingContent).map(([type, count]) => `${type}: ${count}`).join("; "),
          ]),
        ]),
        "",
      ]),
      "## Governance Note",
      "",
      "This dashboard measures inventory and blueprint distribution. It does not mark content publishable unless the source rows are already published or publication-ready, adaptive-ready, and monetization-ready in their source metadata.",
      "",
    ].join("\n"),
  );
}

function staticRnItems(): BlueprintCoverageContentItem[] {
  const rows = [
    ...nclexTier1FoundationalQuestions.filter((question) => question.exam.includes("NCLEX-RN")),
    ...nclexTier2ClinicalJudgmentQuestions,
    ...nclexTier3AdvancedReviewQuestions,
  ];
  return rows.flatMap((question) => {
    const base: BlueprintCoverageContentItem = {
      id: question.id,
      exam: "NCLEX-RN",
      contentType: "questions",
      bodySystem: question.domain,
      topic: question.topic,
      subtopic: question.subtopic,
      signals: [question.stem, question.questionType, ...(question.adaptiveMetadata?.misconceptionTags ?? [])],
      published: false,
      publicationReady: false,
      monetizationReady: false,
      adaptiveReady: Boolean(question.adaptiveMetadata),
    };
    return isNgnType(question.questionType) ? [base, { ...base, id: `${base.id}:ngn`, contentType: "ngnCases" }] : [base];
  });
}

function staticPnItems(): BlueprintCoverageContentItem[] {
  return cnplePracticalNursingNgnExpansionQuestions.flatMap((question) => {
    const exam = question.adaptiveMetadata.examStyle === "REx-PN" ? "REx-PN" : "REx-PN";
    const base: BlueprintCoverageContentItem = {
      id: question.id,
      exam,
      contentType: "questions",
      bodySystem: question.domain,
      topic: question.topic,
      subtopic: question.subtopic,
      signals: [question.scenario, question.stem, question.questionType, question.clinicalJudgmentFocus],
      published: false,
      publicationReady: false,
      monetizationReady: false,
      adaptiveReady: true,
    };
    return isNgnType(question.questionType) ? [base, { ...base, id: `${base.id}:ngn`, contentType: "ngnCases" }] : [base];
  });
}

function staticNpStepToItems(patientCase: PatientCase, step: CaseStep): BlueprintCoverageContentItem[] {
  const base: BlueprintCoverageContentItem = {
    id: `${patientCase.id}:step-${step.index}`,
    exam: "CNPLE",
    contentType: "questions",
    bodySystem: patientCase.primaryDomain,
    topic: step.cnpleDomain,
    subtopic: step.heading,
    signals: [patientCase.chiefComplaint, step.scenarioText, step.question.stem, step.question.family, step.question.clinicalJudgmentFocus],
    published: false,
    publicationReady: false,
    monetizationReady: false,
    adaptiveReady: true,
  };
  return [base, { ...base, id: `${base.id}:ngn`, contentType: "ngnCases" }];
}

function staticFallbackItems(): BlueprintCoverageContentItem[] {
  return [
    ...staticRnItems(),
    ...staticPnItems(),
    ...CNPLE_LOFT_CASES.flatMap((patientCase) => patientCase.steps.flatMap((step) => staticNpStepToItems(patientCase, step))),
  ];
}

function examFromPathwayLike(value: unknown): string | null {
  const text = String(value ?? "").toLowerCase();
  if (/nclex.*rn|rn.*nclex|us-rn|ca-rn/.test(text)) return "NCLEX-RN";
  if (/rex.*pn|rpn/.test(text)) return "REx-PN";
  if (/nclex.*pn/.test(text)) return "NCLEX-PN";
  if (/cnple|ca-np|np-cnple/.test(text)) return "CNPLE";
  return null;
}

async function liveItems(prisma: PrismaClient, limit: number): Promise<BlueprintCoverageContentItem[]> {
  const db = prisma as unknown as {
    examQuestion: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> };
    pathwayLesson: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> };
    flashcard: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> };
    clinicalNursingScenario: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> };
  };
  const [questions, lessons, flashcards, simulations] = await Promise.all([
    db.examQuestion.findMany({
      where: {
        OR: [
          { exam: { in: ["NCLEX-RN", "NCLEX_RN", "US_NCLEX_RN", "CA_NCLEX_RN", "REx-PN", "REX_PN", "NCLEX-PN", "NCLEX_PN", "CNPLE", "FNP", "AGPCNP", "PMHNP", "PNP-PC", "PNP_PC", "WHNP", "ENP"] } },
          { tier: { in: ["RN", "RPN", "PN", "LPN", "NP"] } },
        ],
      },
      take: limit,
      select: {
        id: true,
        exam: true,
        tier: true,
        status: true,
        questionType: true,
        stem: true,
        bodySystem: true,
        topic: true,
        subtopic: true,
        nclexClientNeedsCategory: true,
        nclexClientNeedsSubcategory: true,
        isMockExamEligible: true,
        isAdaptiveEligible: true,
        isFlashcardSource: true,
      },
    }),
    db.pathwayLesson.findMany({
      take: limit,
      select: {
        id: true,
        pathwayId: true,
        status: true,
        bodySystem: true,
        topic: true,
        topicSlug: true,
        title: true,
      },
    }),
    db.flashcard.findMany({
      take: limit,
      select: {
        id: true,
        status: true,
        tier: true,
        examFamily: true,
        country: true,
        front: true,
        questionStem: true,
        deck: { select: { pathwayId: true } },
        category: { select: { name: true, slug: true, topicCode: true } },
      },
    }),
    db.clinicalNursingScenario.findMany({
      take: limit,
      select: {
        id: true,
        pathwayId: true,
        publishStatus: true,
        canonicalCategoryId: true,
        tierFocus: true,
        title: true,
      },
    }),
  ]);

  const items: BlueprintCoverageContentItem[] = [];
  for (const row of questions) {
    const exam = examFromPathwayLike(row.exam) ?? examFromPathwayLike(row.tier);
    if (!exam) continue;
    const base: BlueprintCoverageContentItem = {
      id: String(row.id),
      exam,
      contentType: "questions",
      bodySystem: String(row.bodySystem ?? ""),
      topic: String(row.topic ?? ""),
      subtopic: String(row.subtopic ?? ""),
      signals: [
        String(row.nclexClientNeedsCategory ?? ""),
        String(row.nclexClientNeedsSubcategory ?? ""),
        String(row.questionType ?? ""),
        String(row.stem ?? ""),
      ],
      published: /^published$/i.test(String(row.status ?? "")),
      publicationReady: /^published$/i.test(String(row.status ?? "")),
      monetizationReady: row.isMockExamEligible === true,
      adaptiveReady: row.isAdaptiveEligible === true,
    };
    items.push(base);
    if (isNgnType(row.questionType)) items.push({ ...base, id: `${base.id}:ngn`, contentType: "ngnCases" });
  }
  for (const row of lessons) {
    const exam = examFromPathwayLike(row.pathwayId);
    if (!exam) continue;
    items.push({
      id: String(row.id),
      exam,
      contentType: "lessons",
      bodySystem: String(row.bodySystem ?? ""),
      topic: String(row.topic ?? ""),
      subtopic: String(row.topicSlug ?? ""),
      signals: [String(row.title ?? ""), String(row.pathwayId ?? "")],
      published: /^published$/i.test(String(row.status ?? "")),
      publicationReady: /^published$/i.test(String(row.status ?? "")),
      monetizationReady: /^published$/i.test(String(row.status ?? "")),
      adaptiveReady: true,
    });
  }
  for (const row of flashcards) {
    const exam = examFromPathwayLike(row.examFamily) ?? examFromPathwayLike((row.deck as { pathwayId?: unknown } | undefined)?.pathwayId) ?? examFromPathwayLike(row.tier);
    if (!exam) continue;
    const category = row.category as { name?: unknown; slug?: unknown; topicCode?: unknown } | undefined;
    items.push({
      id: String(row.id),
      exam,
      contentType: "flashcards",
      bodySystem: String(category?.topicCode ?? ""),
      topic: String(category?.name ?? ""),
      subtopic: String(category?.slug ?? ""),
      signals: [String(row.front ?? ""), String(row.questionStem ?? "")],
      published: /^published$/i.test(String(row.status ?? "")),
      publicationReady: /^published$/i.test(String(row.status ?? "")),
      monetizationReady: /^published$/i.test(String(row.status ?? "")),
      adaptiveReady: true,
    });
  }
  for (const row of simulations) {
    const exam = examFromPathwayLike(row.pathwayId) ?? examFromPathwayLike(row.tierFocus);
    if (!exam) continue;
    items.push({
      id: String(row.id),
      exam,
      contentType: "simulations",
      bodySystem: String(row.canonicalCategoryId ?? ""),
      topic: String(row.tierFocus ?? ""),
      signals: [String(row.title ?? ""), String(row.pathwayId ?? "")],
      published: /^approved$/i.test(String(row.publishStatus ?? "")),
      publicationReady: /^approved$/i.test(String(row.publishStatus ?? "")),
      monetizationReady: /^approved$/i.test(String(row.publishStatus ?? "")),
      adaptiveReady: true,
    });
  }
  return items;
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports/blueprint-coverage");
  const fallback = staticFallbackItems();
  const limit = Math.max(1, Number.parseInt(process.env.NN_BLUEPRINT_COVERAGE_AUDIT_LIMIT ?? "100000", 10));

  if (!process.env.DATABASE_URL?.trim()) {
    const dashboard = buildBlueprintCoverageDashboard(fallback);
    writeReport(outDir, dashboard, "DATABASE_URL is unset. Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.");
    console.log("DATABASE_URL is unset; wrote static fallback blueprint coverage report.");
    return;
  }

  const prisma = new PrismaClient();
  try {
    const items = await liveItems(prisma, limit);
    const dashboard = buildBlueprintCoverageDashboard(items);
    writeReport(outDir, dashboard, "Live database blueprint coverage audit completed.");
    console.log(`Audited ${items.length.toLocaleString()} blueprint-mapped content items.`);
  } catch (error) {
    const dashboard = buildBlueprintCoverageDashboard(fallback);
    writeReport(
      outDir,
      dashboard,
      [
        "The live database inventory was not audited because the database was unavailable in this environment.",
        "",
        `Reason: ${(error instanceof Error ? error.message : String(error)).replace(/\s+/g, " ").slice(0, 500)}`,
        "",
        "Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.",
      ].join("\n"),
    );
    console.log("Database unavailable; wrote static fallback blueprint coverage report.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
