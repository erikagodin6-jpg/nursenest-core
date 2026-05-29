import "server-only";

import { ClinicalNursingScenarioPublishStatus, ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import {
  buildBlueprintComplianceReport,
  type BlueprintContentType,
  type BlueprintDomainContentCount,
} from "@/lib/blueprints/blueprint-compliance-engine";
import { blueprintForPathway, type ExamBlueprintDefinition } from "@/lib/blueprints/exam-blueprint-definitions";
import { normalizeBlueprintDomain } from "@/lib/blueprints/domain-normalization";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import type {
  AdminBlueprintComplianceDashboard,
  PathwayBlueprintComplianceReport,
} from "@/lib/blueprints/blueprint-compliance-types";

function visibleBlueprintPathways(): ExamPathwayDefinition[] {
  return EXAM_PATHWAYS.filter((pathway) => pathway.status !== "hidden" && pathway.contentExamKeys.length > 0);
}

function increment(
  map: Map<string, BlueprintDomainContentCount>,
  domainId: string,
  type: BlueprintContentType,
  count: number,
) {
  const existing =
    map.get(domainId) ??
    ({ domainId, questions: 0, flashcards: 0, lessons: 0, simulations: 0 } satisfies BlueprintDomainContentCount);
  existing[type] += count;
  map.set(domainId, existing);
}

function rememberUnmapped(
  unmapped: Array<{ contentType: BlueprintContentType; label: string; count: number }>,
  type: BlueprintContentType,
  signals: readonly (string | null | undefined)[],
  count: number,
) {
  const label = signals.filter(Boolean).join(" · ").trim();
  if (!label) return;
  unmapped.push({ contentType: type, label: label.slice(0, 160), count });
}

async function collectQuestionCounts(pathway: ExamPathwayDefinition, blueprint: ExamBlueprintDefinition) {
  const counts = new Map<string, BlueprintDomainContentCount>();
  const unmapped: PathwayBlueprintComplianceReport["unmappedSignals"] = [];
  const rows = await prisma.examQuestion.groupBy({
    by: ["bodySystem", "topic", "subtopic", "nclexClientNeedsCategory"],
    where: {
      AND: [
        pathwayExamQuestionMarketingWhere(pathway),
        { status: { equals: DB_PUBLISHED, mode: "insensitive" } },
      ],
    },
    _count: { _all: true },
  });
  for (const row of rows) {
    const count = row._count._all;
    const domainId = normalizeBlueprintDomain(blueprint, [
      row.nclexClientNeedsCategory,
      row.bodySystem,
      row.topic,
      row.subtopic,
    ]);
    if (domainId) increment(counts, domainId, "questions", count);
    else rememberUnmapped(unmapped, "questions", [row.bodySystem, row.topic, row.subtopic], count);
  }
  return { counts: [...counts.values()], unmapped, total: rows.reduce((sum, row) => sum + row._count._all, 0) };
}

async function collectLessonCounts(pathway: ExamPathwayDefinition, blueprint: ExamBlueprintDefinition) {
  const counts = new Map<string, BlueprintDomainContentCount>();
  const unmapped: PathwayBlueprintComplianceReport["unmappedSignals"] = [];
  const rows = await prisma.pathwayLesson.groupBy({
    by: ["bodySystem", "topic", "topicSlug"],
    where: {
      pathwayId: pathway.id,
      status: ContentStatus.PUBLISHED,
      locale: "en",
      canonicalLessonId: null,
      deprecatedAt: null,
    },
    _count: { _all: true },
  });
  for (const row of rows) {
    const count = row._count._all;
    const domainId = normalizeBlueprintDomain(blueprint, [row.bodySystem, row.topic, row.topicSlug]);
    if (domainId) increment(counts, domainId, "lessons", count);
    else rememberUnmapped(unmapped, "lessons", [row.bodySystem, row.topic, row.topicSlug], count);
  }
  return { counts: [...counts.values()], unmapped, total: rows.reduce((sum, row) => sum + row._count._all, 0) };
}

async function collectFlashcardCounts(pathway: ExamPathwayDefinition, blueprint: ExamBlueprintDefinition) {
  const counts = new Map<string, BlueprintDomainContentCount>();
  const unmapped: PathwayBlueprintComplianceReport["unmappedSignals"] = [];
  const rows = await prisma.flashcard.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      OR: [
        { deck: { pathwayId: pathway.id } },
        { country: pathway.countryCode, tier: pathway.stripeTier, examFamily: pathway.examFamily },
      ],
    },
    select: {
      category: { select: { name: true, slug: true, topicCode: true } },
      questionStem: true,
      front: true,
    },
    take: 50_000,
  });
  for (const row of rows) {
    const domainId = normalizeBlueprintDomain(blueprint, [
      row.category.topicCode,
      row.category.name,
      row.category.slug,
      row.questionStem,
      row.front,
    ]);
    if (domainId) increment(counts, domainId, "flashcards", 1);
    else rememberUnmapped(unmapped, "flashcards", [row.category.name, row.category.slug], 1);
  }
  return { counts: [...counts.values()], unmapped, total: rows.length };
}

async function collectSimulationCounts(pathway: ExamPathwayDefinition, blueprint: ExamBlueprintDefinition) {
  const counts = new Map<string, BlueprintDomainContentCount>();
  const unmapped: PathwayBlueprintComplianceReport["unmappedSignals"] = [];
  const rows = await prisma.clinicalNursingScenario.groupBy({
    by: ["canonicalCategoryId", "tierFocus"],
      where: { pathwayId: pathway.id, publishStatus: ClinicalNursingScenarioPublishStatus.APPROVED },
    _count: { id: true },
  });
  for (const row of rows) {
    const count = row._count.id;
    const domainId = normalizeBlueprintDomain(blueprint, [row.canonicalCategoryId, row.tierFocus]);
    if (domainId) increment(counts, domainId, "simulations", count);
    else rememberUnmapped(unmapped, "simulations", [row.canonicalCategoryId, row.tierFocus], count);
  }
  return { counts: [...counts.values()], unmapped, total: rows.reduce((sum, row) => sum + row._count.id, 0) };
}

function mergeCounts(parts: readonly BlueprintDomainContentCount[][]): BlueprintDomainContentCount[] {
  const merged = new Map<string, BlueprintDomainContentCount>();
  for (const rows of parts) {
    for (const row of rows) {
      increment(merged, row.domainId, "questions", row.questions);
      increment(merged, row.domainId, "flashcards", row.flashcards);
      increment(merged, row.domainId, "lessons", row.lessons);
      increment(merged, row.domainId, "simulations", row.simulations);
    }
  }
  return [...merged.values()];
}

async function loadPathwayReport(pathway: ExamPathwayDefinition): Promise<PathwayBlueprintComplianceReport> {
  const blueprint = blueprintForPathway(pathway);
  const [questions, flashcards, lessons, simulations] = await Promise.all([
    collectQuestionCounts(pathway, blueprint),
    collectFlashcardCounts(pathway, blueprint),
    collectLessonCounts(pathway, blueprint),
    collectSimulationCounts(pathway, blueprint),
  ]);
  const report = buildBlueprintComplianceReport(
    blueprint,
    mergeCounts([questions.counts, flashcards.counts, lessons.counts, simulations.counts]),
  );
  return {
    pathwayId: pathway.id,
    pathwayName: pathway.displayName,
    countryCode: pathway.countryCode,
    tier: pathway.stripeTier,
    examKey: pathway.examKey,
    blueprint,
    report,
    contentTotals: {
      questions: questions.total,
      flashcards: flashcards.total,
      lessons: lessons.total,
      simulations: simulations.total,
    },
    unmappedSignals: [
      ...questions.unmapped,
      ...flashcards.unmapped,
      ...lessons.unmapped,
      ...simulations.unmapped,
    ]
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
  };
}

export async function loadAdminBlueprintComplianceDashboard(
  selectedPathwayId?: string | null,
): Promise<AdminBlueprintComplianceDashboard | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;

  const available = visibleBlueprintPathways();
  const selectedPathway =
    (selectedPathwayId ? getExamPathwayById(selectedPathwayId) : null) ?? available[0] ?? null;
  if (!selectedPathway) {
    return {
      generatedAt: new Date().toISOString(),
      degraded: false,
      selectedPathwayId: "",
      reports: [],
      selected: null,
      summary: { pathwaysAudited: 0, averageComplianceScore: null, criticalGaps: 0, totalItems: 0 },
      notes: ["No blueprint-supported pathways are configured."],
    };
  }

  const auditPathways = [
    selectedPathway,
    ...available.filter((pathway) => pathway.id !== selectedPathway.id).slice(0, 11),
  ];
  const settled = await Promise.allSettled(auditPathways.map((pathway) => loadPathwayReport(pathway)));
  const reports = settled
    .filter((result): result is PromiseFulfilledResult<PathwayBlueprintComplianceReport> => result.status === "fulfilled")
    .map((result) => result.value);
  const selected = reports.find((report) => report.pathwayId === selectedPathway.id) ?? reports[0] ?? null;
  const totalScore = reports.reduce((sum, report) => sum + report.report.complianceScore, 0);
  const totalItems = reports.reduce((sum, report) => sum + report.report.totalItems, 0);

  return {
    generatedAt: new Date().toISOString(),
    degraded: settled.some((result) => result.status === "rejected"),
    selectedPathwayId: selectedPathway.id,
    reports,
    selected,
    summary: {
      pathwaysAudited: reports.length,
      averageComplianceScore: reports.length > 0 ? Math.round(totalScore / reports.length) : null,
      criticalGaps: reports.reduce(
        (sum, report) => sum + report.report.rows.filter((row) => row.priority === "critical").length,
        0,
      ),
      totalItems,
    },
    notes: [
      "Actual percentages combine published questions, flashcards, English lessons, and published clinical simulations mapped to blueprint domains.",
      "Unmapped content is excluded from percentages and listed for taxonomy cleanup.",
      "Blueprint source URLs are stored with each definition so target tables can be reviewed as official exam plans change.",
    ],
  };
}

export function blueprintPathwayOptions() {
  return visibleBlueprintPathways().map((pathway) => ({
    id: pathway.id,
    label: pathway.displayName,
    examKey: pathway.examKey,
  }));
}

export function pathwayFilterSql(pathwayId: string | null): Prisma.Sql {
  return pathwayId ? Prisma.sql`AND pathway_id = ${pathwayId}` : Prisma.empty;
}
