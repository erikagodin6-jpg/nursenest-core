#!/usr/bin/env npx tsx
/**
 * Diagnose why prepared marketing hub lessons fail strict verify (same pipeline as
 * `/[country]/[role]/[exam]/lessons` — loader → prepare → verify).
 *
 * From `nursenest-core/` (requires {@link scripts/stub-server-only.cjs} so `pathway-lesson-loader` can load under tsx):
 *
 *   NODE_OPTIONS='--require ./scripts/stub-server-only.cjs' DOTENV_CONFIG_PATH=.env.local \
 *     ./node_modules/.bin/tsx --import dotenv/config scripts/lessons/lesson-hub-visibility-diagnostics.mts \
 *     --pathway ca-rn-nclex-rn --country canada --locale en --limit 50 --sample-excluded 20
 */
import { ContentStatus } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "../../src/components/pathway-lessons/pathway-lessons-curriculum-hub";
import {
  PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN,
  PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR,
  pathwayLessonsSchemaDriftFromPrismaErrorMessage,
  pathwayLessonsStructuralPublicCompleteColumnPresent,
} from "../../src/lib/db/pathway-lessons-schema-contract";
import { prisma } from "../../src/lib/db";
import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog";
import { maskDatabaseUrlHostForLog } from "../../src/lib/env/require-database-env";
import { buildLessonHubVisibilityDiagnosticsReport } from "../../src/lib/lessons/lesson-hub-visibility-diagnostics";
import {
  getPathwayLessonListWarehouseLocaleForHub,
  getPathwayLessonsPageFresh,
} from "../../src/lib/lessons/pathway-lesson-loader";
import { verifyMarketingHubLessonRowsResolve } from "../../src/lib/lessons/pathway-lesson-hub-link-integrity";
import { PATHWAY_HUB_PAGE_SIZE_DEFAULT } from "../../src/lib/lessons/pathway-lesson-scale";
import { marketingPathwayLessonsIndexPath } from "../../src/lib/lessons/lesson-routes";
import { pathwayLessonHasRenderableHubSlug } from "../../src/lib/lessons/pathway-lesson-types";

function argValue(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  if (i < 0) return undefined;
  return argv[i + 1]?.trim() || undefined;
}

function parseArgs(argv: string[]): {
  pathwayId: string;
  countrySlug: string;
  locale: string;
  sampleKept: number;
  sampleExcluded: number;
} {
  const pathwayId = argValue(argv, "--pathway") ?? "ca-rn-nclex-rn";
  const countrySlug = (argValue(argv, "--country") ?? "canada").toLowerCase();
  const locale = argValue(argv, "--locale") ?? "en";
  const limitRaw = argValue(argv, "--limit");
  const sampleKept = Math.min(200, Math.max(0, Number(limitRaw ?? "50") || 50));
  const sampleExcludedRaw = argValue(argv, "--sample-excluded");
  const sampleExcluded = Math.min(500, Math.max(0, Number(sampleExcludedRaw ?? "20") || 20));
  return { pathwayId, countrySlug, locale, sampleKept, sampleExcluded };
}

function maskedDbTarget(): string {
  const raw = process.env.DATABASE_URL?.trim() ?? "";
  if (!raw) return "(none)";
  const { host, port } = maskDatabaseUrlHostForLog(raw);
  return `${host}:${port}`;
}

async function printSchemaDriftAndExit(payload: Record<string, unknown>): Promise<never> {
  console.log(JSON.stringify(payload, null, 2));
  try {
    await prisma.$disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
}

async function prismaStatusBySlugs(
  pathwayId: string,
  slugs: readonly string[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const uniq = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  if (uniq.length === 0) return out;
  const rows = await prisma.pathwayLesson.findMany({
    where: { pathwayId, slug: { in: uniq } },
    select: { slug: true, status: true },
  });
  for (const r of rows) {
    out.set(r.slug.trim(), r.status === ContentStatus.PUBLISHED ? "PUBLISHED" : String(r.status));
  }
  return out;
}

async function main(): Promise<void> {
  const { pathwayId, countrySlug, locale, sampleKept, sampleExcluded } = parseArgs(process.argv);
  const pathway = EXAM_PATHWAYS.find((p) => p.id === pathwayId);
  if (!pathway) {
    console.error(JSON.stringify({ error: "unknown_pathway", pathwayId }));
    process.exit(1);
  }
  if (pathway.countrySlug !== countrySlug) {
    console.error(
      JSON.stringify({
        error: "country_pathway_mismatch",
        pathwayId,
        pathwayCountry: pathway.countrySlug,
        countryArg: countrySlug,
      }),
    );
    process.exit(1);
  }

  try {
    let structuralColumnPresent = false;
    try {
      structuralColumnPresent = await pathwayLessonsStructuralPublicCompleteColumnPresent(prisma);
    } catch (probeErr) {
      const msg = probeErr instanceof Error ? probeErr.message : String(probeErr);
      await printSchemaDriftAndExit({
        error: "schema_drift",
        code: "pathway_lessons_schema_probe_failed",
        databaseHostMasked: maskedDbTarget(),
        message: msg.slice(0, 500),
        remediation: `Verify DATABASE_URL targets the intended Postgres and that prisma/schema.prisma matches that database.`,
      });
    }
    if (!structuralColumnPresent) {
      await printSchemaDriftAndExit({
        error: "schema_drift",
        code: "missing_structural_public_complete",
        databaseHostMasked: maskedDbTarget(),
        prismaModel: "PathwayLesson",
        table: "pathway_lessons",
        column: PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN,
        migrationDirectory: PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR,
        remediation: `Apply pending Prisma migrations (includes ${PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR}), e.g. npx prisma migrate deploy`,
      });
    }

    let pageResult: Awaited<ReturnType<typeof getPathwayLessonsPageFresh>>;
    try {
      pageResult = await getPathwayLessonsPageFresh(
        pathway.id,
        1,
        PATHWAY_HUB_PAGE_SIZE_DEFAULT,
        locale,
        undefined,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const drift = pathwayLessonsSchemaDriftFromPrismaErrorMessage(msg);
      if (drift) {
        await printSchemaDriftAndExit({
          error: "schema_drift",
          code: drift.code,
          databaseHostMasked: maskedDbTarget(),
          message: drift.message,
          remediation: drift.remediation,
        });
      }
      throw e;
    }

    const renderableAll = pageResult.renderableAll ?? pageResult.items;
    const rawHubLessonRows = renderableAll.filter(pathwayLessonHasRenderableHubSlug);
    const base = marketingPathwayLessonsIndexPath(pathway);
    const { lessons: prepared, prepareStages } = prepareLessonsForHubCurriculumWithDiagnostics(rawHubLessonRows, {
      pathwayId: pathway.id,
      lessonsBasePath: base,
    });
    const listWarehouseLocale = await getPathwayLessonListWarehouseLocaleForHub(pathway.id, locale);

    let vr: Awaited<ReturnType<typeof verifyMarketingHubLessonRowsResolve>>;
    try {
      vr = await verifyMarketingHubLessonRowsResolve(pathway, prepared, locale, {
        listWarehouseLocale: listWarehouseLocale ?? undefined,
        prepareStages,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const drift = pathwayLessonsSchemaDriftFromPrismaErrorMessage(msg);
      if (drift) {
        await printSchemaDriftAndExit({
          error: "schema_drift",
          code: drift.code,
          databaseHostMasked: maskedDbTarget(),
          message: drift.message,
          remediation: drift.remediation,
        });
      }
      throw e;
    }

    const sampleSlugs = [
      ...vr.kept.filter((l) => !l.hubMarketingDegraded).slice(0, sampleKept).map((l) => l.slug.trim()),
      ...vr.excluded.slice(0, sampleExcluded).map((e) => e.slug.trim()),
    ];
    let statusMap: Map<string, string>;
    try {
      statusMap = await prismaStatusBySlugs(pathway.id, sampleSlugs);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const drift = pathwayLessonsSchemaDriftFromPrismaErrorMessage(msg);
      if (drift) {
        await printSchemaDriftAndExit({
          error: "schema_drift",
          code: drift.code,
          databaseHostMasked: maskedDbTarget(),
          message: drift.message,
          remediation: drift.remediation,
        });
      }
      throw e;
    }

    const report = await buildLessonHubVisibilityDiagnosticsReport({
      pathway,
      countrySlug,
      lessonContentLocale: locale,
      prepared,
      verifyKept: vr.kept,
      verifyExcluded: vr.excluded,
      sampleKept,
      sampleExcluded,
      prismaStatusBySlug: statusMap,
    });

    console.log(
      JSON.stringify(
        {
          pathwayId: report.pathwayId,
          country: report.country,
          locale: report.locale,
          totalPrepared: report.totalPrepared,
          totalVerifyKept: report.totalVerifyKept,
          totalExcluded: report.totalExcluded,
          exclusionReasonCounts: report.exclusionReasonCounts,
          keptSamples: report.keptSamples,
          excludedSamples: report.excludedSamples,
          diagnosticPipelineMeta: {
            prepareStages,
            loaderTotal: pageResult.total,
            loaderRenderableSlugSafeCount: rawHubLessonRows.length,
          },
        },
        null,
        2,
      ),
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch {
      /* ignore */
    }
  }
}

main().catch(async (e) => {
  const msg = e instanceof Error ? e.message : String(e);
  const drift = pathwayLessonsSchemaDriftFromPrismaErrorMessage(msg);
  if (drift) {
    console.log(
      JSON.stringify(
        {
          error: "schema_drift",
          code: drift.code,
          databaseHostMasked: maskedDbTarget(),
          message: drift.message,
          remediation: drift.remediation,
        },
        null,
        2,
      ),
    );
    try {
      await prisma.$disconnect();
    } catch {
      /* ignore */
    }
    process.exit(1);
    return;
  }
  console.error(e);
  try {
    await prisma.$disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
