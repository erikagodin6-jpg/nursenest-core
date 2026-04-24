#!/usr/bin/env npx tsx
/**
 * Mirrors the Canada RN (or any) marketing lessons hub DB → loader → prepare → verify stages.
 *
 * From `nursenest-core/` with `DATABASE_URL`:
 *   npm run data:marketing-lessons-hub-pipeline-probe
 *   PROBE_PATHWAY_ID=us-rn-nclex-rn PROBE_LESSON_LOCALE=en npm run data:marketing-lessons-hub-pipeline-probe
 */
import { ContentStatus, PrismaClient } from "@prisma/client";

import "../../src/lib/db/env-bootstrap";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "../../src/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog";
import {
  getPathwayLessonListWarehouseLocaleForHub,
  getPathwayLessonsPageFresh,
} from "../../src/lib/lessons/pathway-lesson-loader";
import { verifyMarketingHubLessonRowsResolve } from "../../src/lib/lessons/pathway-lesson-hub-link-integrity";
import { pathwayLessonHasRenderableHubSlug } from "../../src/lib/lessons/pathway-lesson-types";
import { marketingPathwayLessonsIndexPath } from "../../src/lib/lessons/lesson-routes";

const DEFAULT_PATHWAY_ID = "ca-rn-nclex-rn";

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const pathwayId = process.env.PROBE_PATHWAY_ID?.trim() || DEFAULT_PATHWAY_ID;
  const pathway = EXAM_PATHWAYS.find((p) => p.id === pathwayId);
  if (!pathway) {
    console.error(`Unknown pathway id: ${pathwayId}`);
    process.exit(1);
  }

  const lessonContentLocale = process.env.PROBE_LESSON_LOCALE?.trim() || "en";
  const page = Math.max(1, Number(process.env.PROBE_PAGE ?? "1") || 1);
  const pageSize = Math.min(200, Math.max(8, Number(process.env.PROBE_PAGE_SIZE ?? "72") || 72));

  const prisma = new PrismaClient();
  try {
    const ping = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1::int as ok`;
    const dbConnected = Array.isArray(ping) && ping[0]?.ok === 1;

    const rawPublishedAnyLocale = await prisma.pathwayLesson.count({
      where: { pathwayId, status: ContentStatus.PUBLISHED },
    });
    const rawPublishedLocaleEn = await prisma.pathwayLesson.count({
      where: { pathwayId, status: ContentStatus.PUBLISHED, locale: "en" },
    });
    const rawPublishedLocaleProbe = await prisma.pathwayLesson.count({
      where: { pathwayId, status: ContentStatus.PUBLISHED, locale: lessonContentLocale },
    });

    const pageResult = await getPathwayLessonsPageFresh(pathwayId, page, pageSize, lessonContentLocale, undefined);
    const ld = pageResult.loadDiagnostics ?? {};
    const renderableAll = pageResult.renderableAll ?? pageResult.items;
    const base = marketingPathwayLessonsIndexPath(pathway);
    const rawSlugSafe = renderableAll.filter(pathwayLessonHasRenderableHubSlug);
    const { lessons: prepared, prepareStages } = prepareLessonsForHubCurriculumWithDiagnostics(rawSlugSafe, {
      pathwayId,
      lessonsBasePath: base,
    });
    const listWarehouseLocale = await getPathwayLessonListWarehouseLocaleForHub(pathwayId, lessonContentLocale);
    const vr = await verifyMarketingHubLessonRowsResolve(pathway, prepared, lessonContentLocale, {
      listWarehouseLocale: listWarehouseLocale ?? undefined,
      prepareStages,
    });

    console.log(
      JSON.stringify(
        {
          dbConnected,
          pathwayId,
          lessonContentLocale,
          page,
          pageSize,
          /** Raw Prisma — any locale */
          dbRawPublishedCountAnyLocale: rawPublishedAnyLocale,
          dbRawPublishedCountLocaleEn: rawPublishedLocaleEn,
          dbRawPublishedCountLocaleProbe: rawPublishedLocaleProbe,
          loader: {
            status: "ok",
            total: pageResult.total,
            renderableAllLen: renderableAll.length,
            itemsLen: pageResult.items.length,
            loadDiagnostics: {
              runtimeSource: ld.runtimeSource,
              rawDbCount: ld.rawDbCount,
              sqlDbPublishedApprox: ld.sqlDbPublishedApprox,
              afterDbWhereCount: ld.afterDbWhereCount,
              afterSlugNormalizeCount: ld.afterSlugNormalizeCount,
              afterPathwayContextCount: ld.afterPathwayContextCount,
              afterPublicCompleteCount: ld.afterPublicCompleteCount,
              afterCountryContextCount: ld.afterCountryContextCount,
              afterDedupeCount: ld.afterDedupeCount,
              truncatedDbScan: ld.truncatedDbScan,
              timingsMs: ld.timingsMs,
            },
          },
          prepareStages,
          verify: {
            kept: vr.kept.length,
            excluded: vr.excluded.length,
            uniqueSlugs: vr.diagnostics.uniqueSlugCount,
            excludedByReason: vr.diagnostics.excludedByReason,
            topReasons: (vr.diagnostics.exclusionReasonsRanked ?? []).slice(0, 8),
          },
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
