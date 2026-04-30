/**
 * Read-only inventory: Allied pathway lessons (bundled catalog + optional DB counts).
 *
 * Run: cd nursenest-core && npx tsx scripts/report-allied-health-lessons.mts [--json]
 *
 * Does not mutate data. DB section is skipped when DATABASE_URL is unset or unreachable.
 */
import { ContentStatus } from "@prisma/client";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { countTotalWordsInLessonSections, evaluatePathwayLessonStructuralGate } from "@/lib/lessons/pathway-lesson-premium";
import { getCatalogPathwayLessonsSync, getCatalogLessonsRaw } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

const ALLIED_PATHWAY_IDS = ["us-allied-core", "ca-allied-core"] as const;

const MIN_SECTIONS_TARGET = 5;
const MIN_WORDS_SOFT = 900;
const MIN_WORDS_HARD = 400;

function filterLessonsByTopicSlugs<T extends { topicSlug?: string }>(
  lessons: T[],
  topicSlugsIn: string[] | undefined,
): T[] {
  if (!topicSlugsIn?.length) return lessons;
  const set = new Set(topicSlugsIn.map((s) => s.trim()).filter(Boolean));
  if (set.size === 0) return lessons;
  return lessons.filter((row) => set.has(String(row.topicSlug ?? "").trim()));
}

function lessonMetrics(lesson: ReturnType<typeof getCatalogPathwayLessonsSync>[number]) {
  const wc = countTotalWordsInLessonSections(lesson.sections);
  const gate = evaluatePathwayLessonStructuralGate(lesson);
  const sections = lesson.sections?.length ?? 0;
  const incompleteReasons: string[] = [];
  if (!gate.publicComplete) incompleteReasons.push("structural_public_incomplete");
  if (sections < MIN_SECTIONS_TARGET) incompleteReasons.push(`sections_lt_${MIN_SECTIONS_TARGET}`);
  if (wc < MIN_WORDS_SOFT) incompleteReasons.push(`words_lt_${MIN_WORDS_SOFT}`);
  if (wc < MIN_WORDS_HARD) incompleteReasons.push(`words_lt_${MIN_WORDS_HARD}`);
  return {
    slug: lesson.slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
    sectionCount: sections,
    wordCount: wc,
    publicMarketingSurface: pathwayLessonEligibleForPublicMarketingSurface(lesson),
    structuralMode: gate.structureMode,
    structuralIssues: gate.issues.slice(0, 6),
    incompleteReasons,
    thin: incompleteReasons.length > 0,
  };
}

async function dbSnapshot(pathwayId: string) {
  if (!isDatabaseUrlConfigured()) {
    return {
      available: false as const,
      reason: "DATABASE_URL not configured",
    };
  }
  try {
    const rows = await prisma.pathwayLesson.groupBy({
      by: ["status"],
      where: { pathwayId },
      _count: { _all: true },
    });
    const byStatus: Record<string, number> = {};
    for (const r of rows) {
      byStatus[r.status] = r._count._all;
    }
    const dupSlug = await prisma.$queryRaw<{ c: bigint }[]>`
      SELECT COUNT(*)::bigint AS c FROM (
        SELECT slug FROM pathway_lessons
        WHERE pathway_id = ${pathwayId} AND locale = 'en'
        GROUP BY slug HAVING COUNT(*) > 1
      ) t
    `;
    return {
      available: true as const,
      byStatus,
      duplicateSlugGroups: Number(dupSlug[0]?.c ?? 0),
    };
  } catch (e) {
    return {
      available: false as const,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}

function catalogDuplicateSlugs(pathwayId: string): string[] {
  const raw = getCatalogLessonsRaw(pathwayId);
  const seen = new Map<string, number>();
  for (const r of raw) {
    const s = String(r.slug ?? "").trim().toLowerCase();
    if (!s) continue;
    seen.set(s, (seen.get(s) ?? 0) + 1);
  }
  return [...seen.entries()].filter(([, n]) => n > 1).map(([slug]) => slug);
}

async function main() {
  const jsonMode = process.argv.includes("--json");

  const occupations = ALLIED_PROFESSIONS.map((p) => ({
    professionKey: p.professionKey,
    pathwayId: p.pathwayId,
    title: p.title,
    hubCategory: p.hubCategory,
    topicSlugsIn: p.topicSlugsIn,
  }));

  const pathways = await Promise.all(
    ALLIED_PATHWAY_IDS.map(async (pathwayId) => {
      const def = getExamPathwayById(pathwayId);
      const lessons = getCatalogPathwayLessonsSync(pathwayId);
      const metrics = lessons.map(lessonMetrics);
      const publishedMarketing = metrics.filter((m) => m.publicMarketingSurface).length;
      const thin = metrics.filter((m) => m.thin).length;
      const words = metrics.map((m) => m.wordCount);
      const db = await dbSnapshot(pathwayId);
      const dupCatalog = catalogDuplicateSlugs(pathwayId);

      const sourceTruth =
        db.available && Object.values(db.byStatus).some((n) => n > 0)
          ? ("db_pathway_lesson_primary_with_catalog_fallback" as const)
          : ("bundled_catalog_only_no_db_rows_reported" as const);

      return {
        pathwayId,
        displayName: def?.displayName ?? pathwayId,
        country: def?.countrySlug ?? null,
        catalogLessonTotal: lessons.length,
        catalogPublishedMarketingSurface: publishedMarketing,
        catalogThinOrIncompleteHeuristic: thin,
        catalogWordCount: {
          min: words.length ? Math.min(...words) : 0,
          max: words.length ? Math.max(...words) : 0,
          avg: words.length ? Math.round(words.reduce((a, b) => a + b, 0) / words.length) : 0,
        },
        liveMarketingLessonDetailPattern: `/{locale}/${def?.countrySlug === "canada" ? "canada" : "us"}/allied/allied-health/lessons/{slug}`,
        liveLearnerLessonPattern: "/app/lessons/{pathwayLessonId}",
        sourceTruthNarrative: sourceTruth,
        database: db,
        suspiciousDuplicateCatalogSlugs: dupCatalog,
      };
    }),
  );

  const byProfession = occupations.map((p) => {
    const lessons = getCatalogPathwayLessonsSync(p.pathwayId);
    const scoped = filterLessonsByTopicSlugs(lessons, p.topicSlugsIn);
    const m = scoped.map(lessonMetrics);
    return {
      ...p,
      catalogScopedTotal: scoped.length,
      catalogScopedThin: m.filter((x) => x.thin).length,
      catalogScopedPublicMarketing: m.filter((x) => x.publicMarketingSurface).length,
    };
  });

  const out = {
    generatedAt: new Date().toISOString(),
    alliedPathwayIds: [...ALLIED_PATHWAY_IDS],
    occupationCount: occupations.length,
    noteRegistryPathway:
      "ALLIED_PROFESSIONS entries currently use pathwayId `us-allied-core` for marketing URLs; Canada exams use `ca-allied-core` catalog in parallel — verify product intent if CA occupation hubs are required.",
    pathways,
    occupations: byProfession,
    renderChainNotes: [
      "Authoring: /admin/pathway-lessons + /api/admin/pathway-lessons/* → PathwayLesson rows (Prisma).",
      "Marketing detail: pathway-lesson-loader getPathwayLesson → published DB PathwayLesson when publicComplete; else catalog JSON if publicComplete.",
      "Learner /app/lessons/[id]: getPublishedPathwayLessonRecordById (DB by id) then getPathwayLesson slug fallback — see app-subscriber-lesson-detail-resolve.ts.",
      "ContentItem → PathwayLesson sync is intentionally a no-op (sync-content-item-to-pathway-lesson.ts).",
    ],
  };

  if (jsonMode) {
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  console.log("=== Allied health pathway lesson report (read-only) ===\n");
  console.log(`Occupations (registry): ${out.occupationCount}`);
  console.log(`Pathways: ${out.alliedPathwayIds.join(", ")}\n`);
  for (const pw of pathways) {
    console.log(`--- ${pw.pathwayId} (${pw.displayName}) ---`);
    console.log(`  Catalog lessons (normalized): ${pw.catalogLessonTotal}`);
    console.log(`  Catalog publicComplete (marketing surface): ${pw.catalogPublishedMarketingSurface}`);
    console.log(`  Catalog thin/incomplete (heuristic): ${pw.catalogThinOrIncompleteHeuristic}`);
    console.log(`  Words min/avg/max: ${pw.catalogWordCount.min} / ${pw.catalogWordCount.avg} / ${pw.catalogWordCount.max}`);
    console.log(`  Source-of-truth label: ${pw.sourceTruthNarrative}`);
    if (pw.suspiciousDuplicateCatalogSlugs.length) {
      console.log(`  DUPLICATE SLUGS in merged catalog: ${pw.suspiciousDuplicateCatalogSlugs.join(", ")}`);
    }
    if (pw.database.available) {
      console.log(`  DB rows by status: ${JSON.stringify(pw.database.byStatus)}`);
      console.log(`  DB duplicate slug groups (en): ${pw.database.duplicateSlugGroups}`);
    } else {
      console.log(`  DB: unavailable (${pw.database.reason})`);
    }
    console.log(`  Marketing URL pattern: ${pw.liveMarketingLessonDetailPattern}`);
    console.log("");
  }
  console.log("Per-occupation scoped catalog counts (topicSlugsIn filter when set):");
  for (const row of byProfession) {
    console.log(
      `  ${row.professionKey} | pathway=${row.pathwayId} | scoped=${row.catalogScopedTotal} | public=${row.catalogScopedPublicMarketing} | thin=${row.catalogScopedThin}`,
    );
  }
  console.log("\nDone. Re-run with --json for machine-readable output.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
