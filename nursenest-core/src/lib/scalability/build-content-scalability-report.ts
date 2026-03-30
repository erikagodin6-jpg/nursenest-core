import catalog from "@/content/pathway-lessons/catalog.json";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { PATHWAY_CATALOG_LIST_HARD_CAP, PATHWAY_LESSON_DB_TIMEOUT_MS } from "@/lib/lessons/pathway-lesson-loader";
import { ContentStatus } from "@prisma/client";

type CatalogShape = { pathways: Record<string, { lessons: unknown[] }> };

const DB_TIMEOUT = Math.min(PATHWAY_LESSON_DB_TIMEOUT_MS, 8_000);

export type ContentScalabilityReport = {
  generatedAt: string;
  databaseConfigured: boolean;
  pathwayLessons: {
    registryPathways: number;
    rows: Array<{
      pathwayId: string;
      displayName: string;
      registryStatus: string;
      dbPublishedByLocale: Record<string, number>;
      dbPublishedTotal: number;
      catalogCount: number;
      catalogTruncatedForList: boolean;
      runtimeSource: "database" | "catalog" | "none";
    }>;
    summary: {
      pathwaysWithDb: number;
      pathwaysCatalogOnly: number;
      pathwaysEmpty: number;
    };
  };
  questionBank: {
    totalQuestions: number;
    byStatus: Array<{ status: string | null; count: number }>;
    topExams: Array<{ exam: string | null; count: number }>;
    note: string;
  };
};

function catalogCountForPathway(pathwayId: string, cat: CatalogShape): number {
  const n = cat.pathways[pathwayId]?.lessons?.length ?? 0;
  return typeof n === "number" ? n : 0;
}

/**
 * Bounded admin diagnostics: counts and small aggregates only (no lesson/question bodies).
 */
export async function buildContentScalabilityReport(): Promise<ContentScalabilityReport> {
  const generatedAt = new Date().toISOString();
  const databaseConfigured = isDatabaseUrlConfigured();
  const cat = catalog as unknown as CatalogShape;

  const dbLocaleBuckets = databaseConfigured
    ? await withDatabaseFallbackTimeout(
        () =>
          prisma.pathwayLesson.groupBy({
            by: ["pathwayId", "locale"],
            where: { status: ContentStatus.PUBLISHED },
            _count: { _all: true },
          }),
        [],
        DB_TIMEOUT,
      )
    : [];

  const dbByPathway = new Map<string, Record<string, number>>();
  for (const row of dbLocaleBuckets) {
    const m = dbByPathway.get(row.pathwayId) ?? {};
    m[row.locale] = row._count._all;
    dbByPathway.set(row.pathwayId, m);
  }

  const rows: ContentScalabilityReport["pathwayLessons"]["rows"] = [];
  let pathwaysWithDb = 0;
  let pathwaysCatalogOnly = 0;
  let pathwaysEmpty = 0;

  for (const p of EXAM_PATHWAYS) {
    const locMap = dbByPathway.get(p.id) ?? {};
    const dbPublishedTotal = Object.values(locMap).reduce((a, b) => a + b, 0);
    const cCount = catalogCountForPathway(p.id, cat);
    const catalogTruncated = cCount > PATHWAY_CATALOG_LIST_HARD_CAP;
    let runtimeSource: "database" | "catalog" | "none";
    if (dbPublishedTotal > 0) runtimeSource = "database";
    else if (cCount > 0) runtimeSource = "catalog";
    else runtimeSource = "none";

    if (runtimeSource === "database") pathwaysWithDb++;
    else if (runtimeSource === "catalog") pathwaysCatalogOnly++;
    else pathwaysEmpty++;

    rows.push({
      pathwayId: p.id,
      displayName: p.displayName,
      registryStatus: p.status,
      dbPublishedByLocale: locMap,
      dbPublishedTotal,
      catalogCount: cCount,
      catalogTruncatedForList: catalogTruncated,
      runtimeSource,
    });
  }

  const questionBank =
    databaseConfigured
      ? await withDatabaseFallbackTimeout(
          async () => {
            const [totalQuestions, byStatus, byExam] = await Promise.all([
              prisma.examQuestion.count(),
              prisma.examQuestion.groupBy({
                by: ["status"],
                _count: { _all: true },
              }),
              prisma.examQuestion.groupBy({
                by: ["exam"],
                _count: { _all: true },
              }),
            ]);
            const topExams = [...byExam].sort((a, b) => b._count._all - a._count._all).slice(0, 12);
            return {
              totalQuestions,
              byStatus: byStatus
                .map((r) => ({ status: r.status, count: r._count._all }))
                .sort((a, b) => b.count - a.count),
              topExams: topExams.map((r) => ({ exam: r.exam, count: r._count._all })),
              note: "Topic-level buckets omitted here; use /api/questions/discovery (subscriber) or admin QA for capped topic summaries.",
            };
          },
          {
            totalQuestions: -1,
            byStatus: [],
            topExams: [],
            note: "Question bank aggregates unavailable (DB timeout or error).",
          },
          DB_TIMEOUT,
        )
      : {
          totalQuestions: -1,
          byStatus: [] as { status: string | null; count: number }[],
          topExams: [] as { exam: string | null; count: number }[],
          note: "DATABASE_URL not configured in this environment.",
        };

  return {
    generatedAt,
    databaseConfigured,
    pathwayLessons: {
      registryPathways: EXAM_PATHWAYS.length,
      rows,
      summary: {
        pathwaysWithDb,
        pathwaysCatalogOnly,
        pathwaysEmpty,
      },
    },
    questionBank,
  };
}
