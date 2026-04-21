/**
 * Ops-facing matrix: registry pathways vs pathway_lessons DB vs static catalog.json.
 * Used by `npm run ops:pathway-lesson-sources` and admin scalability-style tooling.
 */
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { PATHWAY_LESSON_DB_TIMEOUT_MS } from "@/lib/lessons/pathway-lesson-loader-config";
import { ContentStatus } from "@prisma/client";

type CatalogShape = { pathways: Record<string, { lessons: unknown[] }> };

const DB_TIMEOUT = Math.min(PATHWAY_LESSON_DB_TIMEOUT_MS, 8_000);
let catalogCache: CatalogShape | null = null;

function getCatalog(): CatalogShape {
  if (catalogCache) return catalogCache;
  catalogCache = require("@/content/pathway-lessons/catalog.json") as CatalogShape;
  return catalogCache;
}

function catalogLessonCount(pathwayId: string, cat: CatalogShape): number {
  const n = cat.pathways[pathwayId]?.lessons?.length ?? 0;
  return typeof n === "number" ? n : 0;
}

export type RegistryPathwayLessonSourceRow = {
  pathwayId: string;
  displayName: string;
  registryStatus: string;
  dbPublishedTotal: number;
  dbPublishedByLocale: Record<string, number>;
  catalogLessonCount: number;
  /** Matches loader: any published DB row → database; else catalog if JSON has lessons. */
  primaryRuntimeSource: "database" | "catalog" | "none";
  /** Catalog defines lessons but DB has zero published rows — run `npm run db:seed-pathway-lessons`. */
  flaggedMissingDb: boolean;
};

export type RegistryPathwayLessonSourceReport = {
  generatedAt: string;
  databaseConfigured: boolean;
  note: string;
  pathways: RegistryPathwayLessonSourceRow[];
  dbBackedPathwayIds: string[];
  catalogFallbackPathwayIds: string[];
  emptyPathwayIds: string[];
  flaggedMissingDbPathwayIds: string[];
};

export async function buildRegistryPathwayLessonSourceReport(): Promise<RegistryPathwayLessonSourceReport> {
  const { EXAM_PATHWAYS } = await import("@/lib/exam-pathways/exam-product-registry");
  const generatedAt = new Date().toISOString();
  const databaseConfigured = isDatabaseUrlConfigured();
  const cat = getCatalog();

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

  const pathways: RegistryPathwayLessonSourceRow[] = [];
  const dbBackedPathwayIds: string[] = [];
  const catalogFallbackPathwayIds: string[] = [];
  const emptyPathwayIds: string[] = [];
  const flaggedMissingDbPathwayIds: string[] = [];

  for (const p of EXAM_PATHWAYS) {
    const locMap = dbByPathway.get(p.id) ?? {};
    const dbPublishedTotal = Object.values(locMap).reduce((a, b) => a + b, 0);
    const cCount = catalogLessonCount(p.id, cat);
    let primaryRuntimeSource: RegistryPathwayLessonSourceRow["primaryRuntimeSource"];
    if (dbPublishedTotal > 0) primaryRuntimeSource = "database";
    else if (cCount > 0) primaryRuntimeSource = "catalog";
    else primaryRuntimeSource = "none";

    const flaggedMissingDb = cCount > 0 && dbPublishedTotal === 0;

    if (primaryRuntimeSource === "database") dbBackedPathwayIds.push(p.id);
    else if (primaryRuntimeSource === "catalog") catalogFallbackPathwayIds.push(p.id);
    else emptyPathwayIds.push(p.id);
    if (flaggedMissingDb) flaggedMissingDbPathwayIds.push(p.id);

    pathways.push({
      pathwayId: p.id,
      displayName: p.displayName,
      registryStatus: p.status,
      dbPublishedTotal,
      dbPublishedByLocale: locMap,
      catalogLessonCount: cCount,
      primaryRuntimeSource,
      flaggedMissingDb,
    });
  }

  return {
    generatedAt,
    databaseConfigured,
    note:
      "Loader prefers pathway_lessons (any locale) when at least one PUBLISHED row exists; otherwise catalog.json; lesson detail falls back to catalog if slug missing in DB but present in JSON (logged as lesson_detail_catalog_supplement).",
    pathways,
    dbBackedPathwayIds,
    catalogFallbackPathwayIds,
    emptyPathwayIds,
    flaggedMissingDbPathwayIds,
  };
}
