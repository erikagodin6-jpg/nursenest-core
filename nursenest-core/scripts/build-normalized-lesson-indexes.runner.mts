#!/usr/bin/env node
/**
 * Writes optional marketing lesson index JSON per pathway (see generated-indexes/README.md).
 * Strips existing `*.json` in the output dir first so this run never reads stale disk indexes while calling catalog helpers.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LESSON_CATEGORIES } from "@/lib/lessons/lesson-taxonomy";
import { countMarketingHubLessonsByDisplayCategoryForPathway } from "@/lib/lessons/marketing-lessons-hub-category";
import {
  getCatalogLessonsRaw,
  getCatalogPathwayLessonsSync,
  getLessonCatalogMemoizationStats,
  getLessonSummariesIndex,
  getMarketingHubEffectiveCatalogSlugSet,
  listCatalogPathwayIdsWithLessonsSync,
  resetCatalogLessonsRawMergeCacheForTests,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildLessonNormalizationCoverageReport,
  lessonNormalizationCoverageJsonPath,
  lessonNormalizationCoverageMarkdownPath,
  writeLessonNormalizationCoverageReports,
} from "./lesson-normalization-coverage.mts";

const SCHEMA_V1 = 1;

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(coreRoot, "src", "content", "pathway-lessons", "generated-indexes");

function stripExistingJson(): void {
  if (!fs.existsSync(outDir)) return;
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith(".json")) fs.unlinkSync(path.join(outDir, f));
  }
}

async function main(): Promise<void> {
  fs.mkdirSync(outDir, { recursive: true });
  stripExistingJson();
  resetCatalogLessonsRawMergeCacheForTests();

  const ids = listCatalogPathwayIdsWithLessonsSync();
  const generatedAt = new Date().toISOString();
  const buildStarted = performance.now();

  for (const pathwayId of ids) {
    const safe = pathwayId.trim();
    if (!/^[a-z0-9-]+$/i.test(safe)) {
      console.error(`[build:lesson-indexes] skip invalid pathway id: ${pathwayId}`);
      continue;
    }
    const pathwayStarted = performance.now();
    const rawCount = getCatalogLessonsRaw(safe).length;
    const summaries = getLessonSummariesIndex(safe);
    const lessonsBySlug = new Map(getCatalogPathwayLessonsSync(safe).map((l) => [l.slug.trim(), l]));
    const slugToDisplayTitle: Record<string, string> = {};
    for (const row of summaries) {
      const lesson = lessonsBySlug.get(row.slug.trim());
      slugToDisplayTitle[row.slug] = (lesson?.title ?? row.title).trim();
    }
    const effSet = getMarketingHubEffectiveCatalogSlugSet(safe);
    const marketingEffectiveSlugsLowercase = [...effSet].map((s) => s.toLowerCase()).sort((a, b) => a.localeCompare(b));
    const catMap = countMarketingHubLessonsByDisplayCategoryForPathway(safe);
    const categoryCounts: Record<string, number> = {};
    for (const c of LESSON_CATEGORIES) {
      categoryCounts[c] = catMap.get(c) ?? 0;
    }

    const payload = {
      schemaVersion: SCHEMA_V1,
      pathwayId: safe,
      generatedAt,
      mergedRawLessonCount: rawCount,
      effectiveLessonCount: summaries.length,
      summaries,
      slugToDisplayTitle,
      marketingEffectiveSlugsLowercase,
      categoryCounts,
    };

    fs.writeFileSync(path.join(outDir, `${safe}.json`), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    const pathwayMs = Math.round(performance.now() - pathwayStarted);
    console.info(
      `[build:lesson-indexes] wrote ${safe}.json lessons=${summaries.length} raw=${rawCount} pathwayMs=${pathwayMs}`,
    );
  }
  const memo = getLessonCatalogMemoizationStats();
  safeServerLog("lesson_indexes", "lesson_index_generation_memoization", {
    pathwayCount: ids.length,
    totalMs: Math.round(performance.now() - buildStarted),
    mergedRawHits: memo.mergedRawCatalogHits,
    mergedRawMisses: memo.mergedRawCatalogMisses,
    pathwayNormHits: memo.pathwayNormalizeHits,
    pathwayNormMisses: memo.pathwayNormalizeMisses,
    effectiveHubHits: memo.effectiveHubHits,
    effectiveHubMisses: memo.effectiveHubMisses,
    marketingSlugHits: memo.marketingSlugSetHits,
    marketingSlugMisses: memo.marketingSlugSetMisses,
    summaryHits: memo.summaryIndexHits,
    summaryMisses: memo.summaryIndexMisses,
  });
  const coverage = buildLessonNormalizationCoverageReport();
  writeLessonNormalizationCoverageReports(coverage);
  const collapsed = coverage.pathways.filter((pathway) => pathway.rawCount > 0 && pathway.renderableCount === 0);
  if (collapsed.length > 0) {
    throw new Error(
      `[build:lesson-indexes] pathway(s) collapsed to zero renderable lessons: ${collapsed
        .map((pathway) => pathway.pathwayId)
        .join(", ")}`,
    );
  }
  const exclusionGateFailures = coverage.pathways.filter((pathway) => !pathway.passesExclusionQualityGate);
  if (exclusionGateFailures.length > 0) {
    throw new Error(
      `[build:lesson-indexes] exclusion quality gate failed (>20% unexpected exclusions without allowlist) for: ${exclusionGateFailures
        .map((p) => `${p.pathwayId}(${(p.unexpectedExclusionRate * 100).toFixed(1)}%)`)
        .join(", ")}`,
    );
  }
  console.info(
    `[build:lesson-indexes] wrote coverage reports json=${lessonNormalizationCoverageJsonPath()} md=${lessonNormalizationCoverageMarkdownPath()}`,
  );
  console.info(`[build:lesson-indexes] done pathways=${ids.length} -> ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
