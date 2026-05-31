#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import {
  NURSING_EXAM_ECOSYSTEM_TARGETS,
  evaluateNursingExamTargetReadiness,
  getNursingExamPathway,
  rankNursingExamGaps,
  type NursingExamInventory,
  type NursingExamReadiness,
  type NursingExamTarget,
} from "../src/lib/content-governance/nursing-exam-ecosystem-readiness";

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

function questionWhere(target: NursingExamTarget, pathway = getNursingExamPathway(target.pathwayId)): Record<string, unknown> {
  const and: Record<string, unknown>[] = [{ status: { in: ["published", "PUBLISHED"] } }];
  if (target.contentExamKeys.length > 0) and.push({ exam: { in: target.contentExamKeys } });
  if (pathway?.countryCode) and.push({ countryCode: pathway.countryCode });
  if (pathway?.stripeTier) and.push({ tier: pathway.stripeTier });
  return { AND: and };
}

function activeQuestionWhere(target: NursingExamTarget, pathway = getNursingExamPathway(target.pathwayId)): Record<string, unknown> {
  const where = questionWhere(target, pathway);
  return {
    ...where,
    AND: [...((where.AND as Record<string, unknown>[]) ?? []), { isMockExamEligible: true }],
  };
}

async function countQuestionTypes(prisma: PrismaClient, target: NursingExamTarget): Promise<Record<string, number>> {
  const rows = await prisma.examQuestion.groupBy({
    by: ["questionType"],
    where: questionWhere(target) as never,
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((row) => [row.questionType, row._count._all]));
}

async function countInventory(prisma: PrismaClient, target: NursingExamTarget): Promise<NursingExamInventory> {
  const pathway = getNursingExamPathway(target.pathwayId);
  const publishedQuestionWhere = questionWhere(target, pathway);
  const caseStudyWhere = {
    ...publishedQuestionWhere,
    AND: [...((publishedQuestionWhere.AND as Record<string, unknown>[]) ?? []), { OR: [{ isScenario: true }, { caseId: { not: null } }] }],
  };
  const flashcardWhere = pathway
    ? {
        status: "PUBLISHED",
        OR: [
          { deck: { pathwayId: pathway.id } },
          { country: pathway.countryCode, tier: pathway.stripeTier, examFamily: pathway.examFamily },
        ],
      }
    : { status: "PUBLISHED", examFamily: "NP" };

  const [publishedQuestions, activeQuestions, visibleQuestions, publishedLessons, publishedFlashcards, ngnItems, caseStudies, questionTypeCounts] =
    await Promise.all([
      prisma.examQuestion.count({ where: publishedQuestionWhere as never }),
      prisma.examQuestion.count({ where: activeQuestionWhere(target, pathway) as never }),
      prisma.examQuestion.count({ where: { ...(publishedQuestionWhere as object), isAdaptiveEligible: true } as never }),
      pathway ? prisma.pathwayLesson.count({ where: { pathwayId: pathway.id, status: "PUBLISHED", deprecatedAt: null } }) : Promise.resolve(0),
      prisma.flashcard.count({ where: flashcardWhere as never }),
      prisma.examQuestion.count({ where: { ...(publishedQuestionWhere as object), questionType: "NGN_CASE" } as never }),
      prisma.examQuestion.count({ where: caseStudyWhere as never }),
      countQuestionTypes(prisma, target),
    ]);

  return {
    targetId: target.id,
    pathwayId: pathway?.id,
    pathwayStatus: pathway?.status,
    publishedQuestions,
    activeQuestions,
    visibleQuestions,
    publishedLessons,
    publishedFlashcards,
    ngnItems,
    caseStudies,
    questionTypeCounts,
  };
}

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function sanitizeDatabaseError(error?: string): string | undefined {
  if (!error) return undefined;
  if (/Can't reach database server/i.test(error)) {
    return "Database connection failed before inventory counts could be measured.";
  }
  return error.replace(/\s+/g, " ").slice(0, 240);
}

function reportMarkdown(readiness: NursingExamReadiness[], source: "database" | "unavailable", error?: string): string {
  const ranked = rankNursingExamGaps(readiness);
  const unavailable = source === "unavailable";
  const databaseStatus = sanitizeDatabaseError(error);
  const rows = ranked.map((item) =>
    unavailable
      ? [
          item.target.label,
          item.target.priority,
          item.pathway?.status ?? "missing",
          "not measured",
          "not measured",
          "not measured",
          "not measured",
          "not measured",
          "blocked",
          "no",
          item.pathway ? "Live inventory unavailable; publication cannot be certified." : "Missing pathway registry row.",
        ]
      : [
          item.target.label,
          item.target.priority,
          item.pathway?.status ?? "missing",
          String(item.inventory.publishedQuestions),
          String(item.inventory.publishedLessons),
          String(item.inventory.publishedFlashcards),
          String(item.inventory.ngnItems),
          String(item.inventory.caseStudies),
          `${item.score}%`,
          item.publicationReady ? "yes" : "no",
          item.gaps.slice(0, 3).map((gap) => gap.message).join("<br>"),
        ],
  );
  const blockers = unavailable
    ? [
        "- Live database inventory was unavailable, so no content pathway can be certified publication-ready.",
        ...ranked
          .filter((item) => !item.pathway)
          .map((item) => `- ${item.target.label}: missing canonical pathway registry row.`),
      ]
    : ranked.flatMap((item) =>
        item.gaps
          .filter((gap) => gap.severity === "blocker")
          .map((gap) => `- ${item.target.label}: ${gap.message}`),
      );

  return [
    "# Nursing Exam Ecosystem Expansion Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Inventory source: ${source}`,
    databaseStatus ? `Database status: ${databaseStatus}` : "",
    "",
    "## Publication Rule",
    "",
    "No pathway is publication-ready or monetization-ready until measured inventory meets the encoded minimums for questions, lessons, flashcards, NGN items, case studies, and required item-type breadth. This report intentionally does not generate filler content.",
    unavailable
      ? "Because live inventory was unavailable, numeric counts are intentionally marked `not measured` instead of being treated as zero."
      : "",
    "",
    "## Coverage Matrix",
    "",
    ...mdTable([
      ["Pathway", "Priority", "Registry Status", "Questions", "Lessons", "Flashcards", "NGN", "Cases", "Score", "Ready", "Top Gaps"],
      ...rows,
    ]),
    "",
    "## Highest-Impact Blockers",
    "",
    ...(blockers.length ? blockers : ["- No blocker gaps detected." ]),
    "",
    "## Next Production Action",
    "",
    "Use this report as the pre-generation gate: create or import clinically reviewed content only for the ranked gaps above, then rerun `npm run audit:nursing-exam-ecosystem` before enabling publication or paid positioning.",
    "",
  ]
    .join("\n");
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, "nursing-exam-ecosystem-expansion-audit.md");

  if (!process.env.DATABASE_URL?.trim()) {
    const readiness = NURSING_EXAM_ECOSYSTEM_TARGETS.map((target) =>
      evaluateNursingExamTargetReadiness(target, {
        targetId: target.id,
        pathwayId: getNursingExamPathway(target.pathwayId)?.id,
        pathwayStatus: getNursingExamPathway(target.pathwayId)?.status,
        publishedQuestions: 0,
        activeQuestions: 0,
        visibleQuestions: 0,
        publishedLessons: 0,
        publishedFlashcards: 0,
        ngnItems: 0,
        caseStudies: 0,
        questionTypeCounts: {},
      }),
    );
    writeFileSync(outPath, `${reportMarkdown(readiness, "unavailable", "DATABASE_URL is unset")}\n`, "utf8");
    console.log(`[nursing-exam-ecosystem] DATABASE_URL unset; wrote ${outPath}`);
    return;
  }

  const prisma = new PrismaClient();
  try {
    const readiness = await Promise.all(
      NURSING_EXAM_ECOSYSTEM_TARGETS.map(async (target) =>
        evaluateNursingExamTargetReadiness(target, await countInventory(prisma, target)),
      ),
    );
    writeFileSync(outPath, `${reportMarkdown(readiness, "database")}\n`, "utf8");
    const ready = readiness.filter((item) => item.publicationReady).length;
    console.log(`[nursing-exam-ecosystem] ready=${ready}/${readiness.length}`);
    console.log(`[nursing-exam-ecosystem] wrote ${outPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const readiness = NURSING_EXAM_ECOSYSTEM_TARGETS.map((target) =>
      evaluateNursingExamTargetReadiness(target, {
        targetId: target.id,
        pathwayId: getNursingExamPathway(target.pathwayId)?.id,
        pathwayStatus: getNursingExamPathway(target.pathwayId)?.status,
        publishedQuestions: 0,
        activeQuestions: 0,
        visibleQuestions: 0,
        publishedLessons: 0,
        publishedFlashcards: 0,
        ngnItems: 0,
        caseStudies: 0,
        questionTypeCounts: {},
      }),
    );
    writeFileSync(outPath, `${reportMarkdown(readiness, "unavailable", message)}\n`, "utf8");
    console.error(`[nursing-exam-ecosystem] database audit failed; wrote unavailable report: ${sanitizeDatabaseError(message) ?? "unknown error"}`);
    if (process.env.NN_REQUIRE_LIVE_NURSING_ECOSYSTEM_AUDIT === "1") process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
