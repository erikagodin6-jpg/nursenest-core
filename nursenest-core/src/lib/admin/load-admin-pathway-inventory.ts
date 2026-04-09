/**
 * Pathway-scoped lesson + question counts for admin inventory views.
 */
import { ContentStatus, CountryCode, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { countPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
import { MIN_PATHWAY_LESSONS_SCALE_TARGET, PATHWAY_LESSONS_SCALE_CEILING } from "@/lib/lessons/pathway-lesson-scale";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";

export type AdminPathwayInventoryRow = {
  pathwayId: string;
  displayName: string;
  shortName: string;
  countryCode: CountryCode;
  stripeTier: TierCode;
  /** Published rows in DB for this pathway (all locales). */
  lessonsPublished: number;
  /** Effective total for UX/planning: DB if any published row exists, else catalog.json length (see countPathwayLessons). */
  lessonsEffective: number;
  lessonsDraft: number;
  questionsMatched: number;
  /** True when effective lesson count meets the scale target (150+). */
  meetsLessonScaleTarget: boolean;
  /** True when effective count is within the 500-lesson planning ceiling. */
  withinScaleCeiling: boolean;
  readiness: "ready" | "partial" | "not_ready";
};

export type AdminPathwayInventoryFilter = {
  country?: CountryCode | "ALL";
  tier?: TierCode | "ALL";
};

export async function loadAdminPathwayInventory(filter: AdminPathwayInventoryFilter): Promise<{
  rows: AdminPathwayInventoryRow[];
  degraded: boolean;
}> {
  let degraded = false;
  const [questionDiag, pathwayGroup] = await Promise.all([
    buildQuestionBankCoverageReport().catch(() => {
      degraded = true;
      return null;
    }),
    prisma.pathwayLesson
      .groupBy({
        by: ["pathwayId", "status"],
        _count: { _all: true },
      })
      .catch(() => {
        degraded = true;
        return [] as Array<{ pathwayId: string; status: ContentStatus; _count: { _all: number } }>;
      }),
  ]);

  const pubByPathway = new Map<string, number>();
  const draftByPathway = new Map<string, number>();
  for (const row of pathwayGroup) {
    const n = row._count._all;
    if (row.status === ContentStatus.PUBLISHED) pubByPathway.set(row.pathwayId, (pubByPathway.get(row.pathwayId) ?? 0) + n);
    if (row.status === ContentStatus.DRAFT) draftByPathway.set(row.pathwayId, (draftByPathway.get(row.pathwayId) ?? 0) + n);
  }

  const matchByPathway = new Map(
    (questionDiag?.pathwayPublishedMatch ?? []).map((m) => [m.pathwayId, m.publishedCount]),
  );

  let pathways = EXAM_PATHWAYS;
  if (filter.country && filter.country !== "ALL") {
    pathways = pathways.filter((p) => p.countryCode === filter.country);
  }
  if (filter.tier && filter.tier !== "ALL") {
    pathways = pathways.filter((p) => p.stripeTier === filter.tier);
  }

  const effectiveCounts = await Promise.all(
    pathways.map((p) =>
      countPathwayLessons(p.id).catch(() => {
        degraded = true;
        return -1;
      }),
    ),
  );

  const rows: AdminPathwayInventoryRow[] = pathways.map((p, i) => {
    const lessonsPublished = pubByPathway.get(p.id) ?? 0;
    const lessonsDraft = draftByPathway.get(p.id) ?? 0;
    const questionsMatched = matchByPathway.get(p.id) ?? 0;
    const rawEff = effectiveCounts[i] ?? -1;
    const lessonsEffective = rawEff >= 0 ? rawEff : lessonsPublished;
    const meetsLessonScaleTarget = lessonsEffective >= MIN_PATHWAY_LESSONS_SCALE_TARGET;
    const withinScaleCeiling = lessonsEffective <= PATHWAY_LESSONS_SCALE_CEILING;
    const readiness =
      meetsLessonScaleTarget && questionsMatched >= 200
        ? "ready"
        : lessonsPublished > 0 || lessonsEffective > 0 || questionsMatched > 0
          ? "partial"
          : "not_ready";
    return {
      pathwayId: p.id,
      displayName: p.displayName,
      shortName: p.shortName,
      countryCode: p.countryCode,
      stripeTier: p.stripeTier,
      lessonsPublished,
      lessonsEffective,
      lessonsDraft,
      questionsMatched,
      meetsLessonScaleTarget,
      withinScaleCeiling,
      readiness,
    };
  });

  rows.sort((a, b) => a.countryCode.localeCompare(b.countryCode) || a.displayName.localeCompare(b.displayName));

  return { rows, degraded };
}
