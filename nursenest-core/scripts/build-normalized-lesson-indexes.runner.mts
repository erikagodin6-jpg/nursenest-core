#!/usr/bin/env node
/**
 * Writes optional marketing lesson index JSON per pathway (see generated-indexes/README.md).
 * Strips existing `*.json` in the output dir first so this run never reads stale disk indexes while calling catalog helpers.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  buildLessonNormalizationCoverageReport,
  lessonNormalizationCoverageJsonPath,
  lessonNormalizationCoverageMarkdownPath,
  writeLessonNormalizationCoverageReports,
} from "./lesson-normalization-coverage.mts";

const canonicalHubsModule = await import("@/lib/lessons/canonical-lessons-hubs");
const lessonTaxonomyModule = await import("@/lib/lessons/lesson-taxonomy");
const marketingHubModule = await import("@/lib/lessons/marketing-lessons-hub-category");
const catalogSyncModule = await import("@/lib/lessons/pathway-lesson-catalog-sync");
const safeServerLogModule = await import("@/lib/observability/safe-server-log");

const { ALLIED_MARKETING_CORE_PATHWAY_IDS } = canonicalHubsModule.default ?? canonicalHubsModule;
const { LESSON_CATEGORIES } = lessonTaxonomyModule.default ?? lessonTaxonomyModule;
const { countMarketingHubLessonsByDisplayCategoryForPathway } = marketingHubModule.default ?? marketingHubModule;
const {
  getCatalogLessonsRaw,
  getCatalogLessonsRawFromBundledOnly,
  getCatalogPathwayLessonsSync,
  getLessonCatalogMemoizationStats,
  getLessonSummariesIndex,
  getMarketingHubEffectiveCatalogSlugSet,
  listCatalogPathwayIdsWithLessonsSync,
  resetCatalogLessonsRawMergeCacheForTests,
} = catalogSyncModule.default ?? catalogSyncModule;
const { safeServerLog } = safeServerLogModule.default ?? safeServerLogModule;

const SCHEMA_V1 = 1;
const MANIFEST_SCHEMA_V1 = 1;

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(coreRoot, "src", "content", "pathway-lessons", "generated-indexes");
const manifestPath = path.join(outDir, "manifest.json");

function sha256File(filePath: string): string {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function sha256Json(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
}

function sortPathwayIdsAlliedFirst(ids: readonly string[]): string[] {
  const set = new Set(ids);
  const alliedFirst = ALLIED_MARKETING_CORE_PATHWAY_IDS.filter((id) => set.has(id));
  const rest = [...set].filter((id) => !(ALLIED_MARKETING_CORE_PATHWAY_IDS as readonly string[]).includes(id));
  rest.sort((a, b) => a.localeCompare(b));
  return [...alliedFirst, ...rest];
}

function warnHighLessonCatalogMemoMissRates(memo: ReturnType<typeof getLessonCatalogMemoizationStats>): void {
  const raw = process.env.NN_LESSON_CATALOG_MEMO_MISS_WARN_RATE ?? "0.35";
  const threshold = Number(raw);
  if (!Number.isFinite(threshold) || threshold <= 0 || threshold > 1) return;
  const gauges: Array<{ label: string; hits: number; misses: number }> = [
    { label: "merged_raw_catalog", hits: memo.mergedRawCatalogHits, misses: memo.mergedRawCatalogMisses },
    { label: "pathway_normalize", hits: memo.pathwayNormalizeHits, misses: memo.pathwayNormalizeMisses },
    { label: "effective_hub", hits: memo.effectiveHubHits, misses: memo.effectiveHubMisses },
    { label: "marketing_slug_set", hits: memo.marketingSlugSetHits, misses: memo.marketingSlugSetMisses },
    { label: "summary_index", hits: memo.summaryIndexHits, misses: memo.summaryIndexMisses },
  ];
  for (const g of gauges) {
    const denom = g.hits + g.misses;
    if (denom < 50) continue;
    const rate = g.misses / denom;
    if (rate >= threshold) {
      safeServerLog("lesson_indexes", "lesson_catalog_memo_miss_rate_warn", {
        gauge: g.label,
        missRate: Number(rate.toFixed(4)),
        hits: g.hits,
        misses: g.misses,
        threshold,
      });
      console.error(
        `[nursenest-core] lesson_indexes lesson_catalog_memo_miss_rate_warn ${JSON.stringify({
          gauge: g.label,
          missRate: Number(rate.toFixed(4)),
          threshold,
        })}`,
      );
    }
  }
}

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

  const fromCatalog = listCatalogPathwayIdsWithLessonsSync();
  /** Fail fast if allied-bundled merge yields nothing (sparse checkout, corrupt JSON, merge regression). */
  for (const alliedId of ALLIED_MARKETING_CORE_PATHWAY_IDS) {
    const bundledOnly = getCatalogLessonsRawFromBundledOnly(alliedId);
    if (bundledOnly.length === 0) {
      throw new Error(
        `[build:lesson-indexes] FATAL: allied bundled catalog produced zero merged rows for ${alliedId}. ` +
          `Verify src/content/pathway-lessons/allied-bundled-catalog.json and pathway-lesson-catalog-sync merge.`,
      );
    }
  }
  /** Defensive union: allied hubs must not be dropped if merge/catalog enumeration drifts. */
  const mandatoryAllied = ALLIED_MARKETING_CORE_PATHWAY_IDS.filter((id) => getCatalogLessonsRaw(id).length > 0);
  const ids = sortPathwayIdsAlliedFirst([...new Set([...mandatoryAllied, ...fromCatalog])]);
  console.info(
    `[build:lesson-indexes] plan outputDir=${outDir} pathwayCount=${ids.length} ` +
      `mandatoryAlliedWithLessons=${mandatoryAllied.join(",") || "(none)"}`,
  );
  const generatedAt = new Date().toISOString();
  const buildStarted = performance.now();
  let totalIndexedLessons = 0;
  const manifestEntries: Array<{
    pathwayId: string;
    fileName: string;
    sourceFingerprint: string;
    fileHash: string;
    lessonCount: number;
    generatedAt: string;
  }> = [];

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

    // Compact JSON: smaller on-disk + faster parse in `next build` (schema unchanged).
    const fileName = `${safe}.json`;
    const filePath = path.join(outDir, fileName);
    fs.writeFileSync(filePath, `${JSON.stringify(payload)}\n`, "utf8");
    manifestEntries.push({
      pathwayId: safe,
      fileName,
      sourceFingerprint: sha256Json({
        pathwayId: safe,
        mergedRawLessonCount: rawCount,
        effectiveLessonCount: summaries.length,
        slugs: summaries.map((row) => row.slug).sort((a, b) => a.localeCompare(b)),
        marketingEffectiveSlugsLowercase,
        categoryCounts,
      }),
      fileHash: sha256File(filePath),
      lessonCount: summaries.length,
      generatedAt,
    });
    const pathwayMs = Math.round(performance.now() - pathwayStarted);
    totalIndexedLessons += summaries.length;
    console.info(
      `[build:lesson-indexes] wrote ${path.join(outDir, `${safe}.json`)} lessons=${summaries.length} raw=${rawCount} pathwayMs=${pathwayMs}`,
    );
  }
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        schemaVersion: MANIFEST_SCHEMA_V1,
        generatedAt,
        entries: manifestEntries.sort((a, b) => a.pathwayId.localeCompare(b.pathwayId)),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.info(`[build:lesson-indexes] wrote manifest ${manifestPath} entries=${manifestEntries.length}`);

  for (const alliedId of ALLIED_MARKETING_CORE_PATHWAY_IDS) {
    const rawN = getCatalogLessonsRaw(alliedId).length;
    const fp = path.join(outDir, `${alliedId}.json`);
    if (rawN > 0 && !fs.existsSync(fp)) {
      throw new Error(
        `[build:lesson-indexes] FATAL: allied marketing pathway index missing after generation.\n` +
          `  expectedFile=${fp}\n` +
          `  pathwayId=${alliedId} mergedRawLessons=${rawN}\n` +
          `  Fix catalog merge / allied-bundled-catalog.json visibility, or index build order.`,
      );
    }
  }

  const memo = getLessonCatalogMemoizationStats();
  warnHighLessonCatalogMemoMissRates(memo);
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
  const coverage = buildLessonNormalizationCoverageReport({ pathwayIds: ids });
  const debugExclusions = process.env.NN_DEBUG_LESSON_INDEX_EXCLUSIONS === "1";
  const debugExclusionsPathwayFilter = process.env.NN_DEBUG_LESSON_INDEX_EXCLUSIONS_PATHWAY?.trim();
  if (debugExclusions) {
    for (const pathway of coverage.pathways) {
      if (debugExclusionsPathwayFilter && pathway.pathwayId !== debugExclusionsPathwayFilter) continue;
      if (pathway.exclusions.length === 0) continue;
      for (const ex of pathway.exclusions) {
        console.error(
          `[lesson-index-exclusion] pathway=${pathway.pathwayId} slug=${ex.slug} title=${JSON.stringify(ex.title)} reasonCode=${ex.reasonCode} allowed=${ex.allowed ? "yes" : "no"} reason=${JSON.stringify(ex.reason)}`,
        );
      }
    }
  }
  const skipHeavyReports = /^(1|true|yes)$/i.test(String(process.env.NN_SKIP_HEAVY_BUILD_REPORTS ?? "").trim());
  if (skipHeavyReports) {
    console.info(
      "[build:lesson-indexes] skipped disk coverage report write reason=NN_SKIP_HEAVY_BUILD_REPORTS (in-memory gates unchanged)",
    );
  } else {
    writeLessonNormalizationCoverageReports(coverage);
    console.info(
      `[build:lesson-indexes] wrote coverage reports json=${lessonNormalizationCoverageJsonPath()} md=${lessonNormalizationCoverageMarkdownPath()}`,
    );
  }
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
  console.info(`[build:lesson-indexes] done pathways=${ids.length} -> ${outDir}`);
  safeServerLog("lesson_indexes", "lesson_index_generation_complete_ms", {
    totalMs: Math.round(performance.now() - buildStarted),
    pathwayCount: ids.length,
  });

  const heapMb = Math.round(process.memoryUsage().heapUsed / (1024 * 1024));
  console.error(
    `[nursenest-core] lesson_index_build_phase_summary\n${JSON.stringify(
      {
        pathwayCount: ids.length,
        totalIndexedLessons,
        totalBuildMs: Math.round(performance.now() - buildStarted),
        heapUsedMb: heapMb,
      },
      null,
      2,
    )}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
