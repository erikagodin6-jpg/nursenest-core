#!/usr/bin/env node
/**
 * Validates optional `generated-indexes/*.json` against live catalog merge (no disk shortcut during live leg).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  getCatalogLessonsRaw,
  getLessonCatalogMemoizationStats,
  getLessonSummariesIndex,
  getMarketingHubEffectiveCatalogSlugSet,
  listCatalogPathwayIdsWithLessonsSync,
  resetCatalogLessonsRawMergeCacheForTests,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { parsePathwayLessonGeneratedIndexV1 } from "@/lib/lessons/pathway-lesson-generated-index";
import { marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";
import { getMarketingLessonsHubCatalogLessons } from "@/lib/lessons/marketing-lessons-hub-category";
import { buildLessonNormalizationCoverageReport } from "./lesson-normalization-coverage.mts";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const realIndexDir = path.join(coreRoot, "src", "content", "pathway-lessons", "generated-indexes");

/** Same semantics as `scripts/run-lesson-indexes-for-build.mjs` (build + verify gates). */
function isNNSkipLessonIndexBuild(): boolean {
  return /^(1|true|yes)$/i.test(String(process.env.NN_SKIP_LESSON_INDEX_BUILD ?? "").trim());
}

function listGeneratedJsonFiles(): string[] {
  if (!fs.existsSync(realIndexDir)) return [];
  return fs.readdirSync(realIndexDir).filter((f) => f.endsWith(".json") && f !== "package.json");
}

function liveSummariesWithoutDiskIndex(pathwayId: string): ReturnType<typeof getLessonSummariesIndex> {
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-index-live-"));
  const prev = process.env.NN_PATHWAY_LESSON_INDEX_DIR;
  process.env.NN_PATHWAY_LESSON_INDEX_DIR = emptyDir;
  try {
    resetCatalogLessonsRawMergeCacheForTests();
    return getLessonSummariesIndex(pathwayId);
  } finally {
    if (prev === undefined) delete process.env.NN_PATHWAY_LESSON_INDEX_DIR;
    else process.env.NN_PATHWAY_LESSON_INDEX_DIR = prev;
    resetCatalogLessonsRawMergeCacheForTests();
  }
}

function liveMarketingSlugSetWithoutDisk(pathwayId: string): Set<string> {
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-index-live-"));
  const prev = process.env.NN_PATHWAY_LESSON_INDEX_DIR;
  process.env.NN_PATHWAY_LESSON_INDEX_DIR = emptyDir;
  try {
    resetCatalogLessonsRawMergeCacheForTests();
    return getMarketingHubEffectiveCatalogSlugSet(pathwayId);
  } finally {
    if (prev === undefined) delete process.env.NN_PATHWAY_LESSON_INDEX_DIR;
    else process.env.NN_PATHWAY_LESSON_INDEX_DIR = prev;
    resetCatalogLessonsRawMergeCacheForTests();
  }
}

function assertDetailHrefs(pathwayId: string, slugs: string[]): void {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return;
  for (const slug of slugs) {
    const href = marketingPathwayLessonDetailPath(pathway, slug);
    if (!href || !href.includes(`/lessons/`)) {
      throw new Error(`[verify:lesson-indexes] broken detail href pathway=${pathwayId} slug=${slug} href=${href}`);
    }
  }
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
        phase: "verify",
        missRate: Number(rate.toFixed(4)),
        hits: g.hits,
        misses: g.misses,
        threshold,
      });
      console.error(
        `[nursenest-core] lesson_indexes lesson_catalog_memo_miss_rate_warn ${JSON.stringify({
          gauge: g.label,
          phase: "verify",
          missRate: Number(rate.toFixed(4)),
          threshold,
        })}`,
      );
    }
  }
}

async function main(): Promise<void> {
  if (isNNSkipLessonIndexBuild()) {
    console.info("[verify:lesson-indexes] skipped reason=NN_SKIP_LESSON_INDEX_BUILD");
    return;
  }

  const files = listGeneratedJsonFiles();
  if (files.length === 0) {
    throw new Error(
      `[verify:lesson-indexes] FATAL: no generated *.json under ${realIndexDir}\n` +
        "Run `npm run build:lesson-indexes` (or full `npm run build`, which runs indexes before `next build`).\n" +
        "Constrained builders may set NN_SKIP_LESSON_INDEX_BUILD=true to skip index generation and checks.",
    );
  }

  const catalogIds = new Set(listCatalogPathwayIdsWithLessonsSync());
  const verifyStarted = performance.now();
  let totalLessonRowsVerified = 0;

  for (const file of files) {
    const pathwayId = file.replace(/\.json$/i, "");
    if (!catalogIds.has(pathwayId)) {
      throw new Error(`[verify:lesson-indexes] generated file for unknown pathway: ${file}`);
    }
    const raw = JSON.parse(fs.readFileSync(path.join(realIndexDir, file), "utf8")) as unknown;
    const parsed = parsePathwayLessonGeneratedIndexV1(raw, pathwayId);
    if (!parsed) {
      throw new Error(`[verify:lesson-indexes] invalid JSON schema: ${file}`);
    }

    const rawLen = getCatalogLessonsRaw(pathwayId).length;
    if (parsed.mergedRawLessonCount !== rawLen) {
      throw new Error(
        `[verify:lesson-indexes] mergedRawLessonCount mismatch pathway=${pathwayId} file=${parsed.mergedRawLessonCount} live=${rawLen}`,
      );
    }

    const liveSummaries = liveSummariesWithoutDiskIndex(pathwayId);
    if (liveSummaries.length !== parsed.summaries.length) {
      throw new Error(
        `[verify:lesson-indexes] summary count mismatch pathway=${pathwayId} live=${liveSummaries.length} file=${parsed.summaries.length}`,
      );
    }
    const liveSlugs = [...liveSummaries.map((r) => r.slug)].sort();
    const fileSlugs = [...parsed.summaries.map((r) => r.slug)].sort();
    if (liveSlugs.join("\0") !== fileSlugs.join("\0")) {
      throw new Error(`[verify:lesson-indexes] slug set mismatch pathway=${pathwayId}`);
    }

    const liveEff = liveMarketingSlugSetWithoutDisk(pathwayId);
    const fileEff = new Set(parsed.marketingEffectiveSlugsLowercase.map((s) => s.toLowerCase()));
    if (liveEff.size !== fileEff.size) {
      throw new Error(
        `[verify:lesson-indexes] marketing effective slug count mismatch pathway=${pathwayId} live=${liveEff.size} file=${fileEff.size}`,
      );
    }
    for (const s of liveEff) {
      if (!fileEff.has(s)) {
        throw new Error(`[verify:lesson-indexes] marketing slug missing in file pathway=${pathwayId} slug=${s}`);
      }
    }

    assertDetailHrefs(pathwayId, fileSlugs);
    totalLessonRowsVerified += parsed.summaries.length;
    console.info(`[verify:lesson-indexes] ok pathway=${pathwayId} lessons=${parsed.summaries.length}`);
  }
  console.info(`[verify:lesson-indexes] all ${files.length} file(s) validated.`);

  const coverage = buildLessonNormalizationCoverageReport();
  for (const pathway of coverage.pathways) {
    if (pathway.rawCount > 0 && pathway.renderableCount === 0) {
      throw new Error(
        `[verify:lesson-indexes] pathway collapsed to zero renderable lessons pathway=${pathway.pathwayId} raw=${pathway.rawCount}`,
      );
    }
    for (const exclusion of pathway.exclusions) {
      if (!exclusion.reason.trim()) {
        throw new Error(
          `[verify:lesson-indexes] exclusion missing reason pathway=${pathway.pathwayId} slug=${exclusion.slug}`,
        );
      }
    }

    for (const lesson of getMarketingLessonsHubCatalogLessons(pathway.pathwayId)) {
      if (!lesson.slug.trim()) {
        throw new Error(`[verify:lesson-indexes] lesson missing slug pathway=${pathway.pathwayId}`);
      }
      if (!lesson.title.trim()) {
        throw new Error(`[verify:lesson-indexes] lesson missing title pathway=${pathway.pathwayId} slug=${lesson.slug}`);
      }
      if (!lesson.topic.trim() || !lesson.topicSlug.trim()) {
        throw new Error(
          `[verify:lesson-indexes] lesson missing topic metadata pathway=${pathway.pathwayId} slug=${lesson.slug}`,
        );
      }
      const pathwayDef = getExamPathwayById(pathway.pathwayId);
      if (!pathwayDef || !marketingPathwayLessonDetailPath(pathwayDef, lesson.slug)) {
        throw new Error(
          `[verify:lesson-indexes] lesson missing public detail route pathway=${pathway.pathwayId} slug=${lesson.slug}`,
        );
      }
    }
  }

  const unmappedAllied = coverage.alliedProfessionCoverage.filter((entry) => entry.status !== "mapped");
  if (unmappedAllied.length > 0) {
    throw new Error(
      `[verify:lesson-indexes] allied profession pages missing lesson mappings: ${unmappedAllied
        .map((entry) => entry.professionKey)
        .join(", ")}`,
    );
  }

  const memo = getLessonCatalogMemoizationStats();
  warnHighLessonCatalogMemoMissRates(memo);
  safeServerLog("lesson_indexes", "lesson_index_verification_duration_ms", {
    totalMs: Math.round(performance.now() - verifyStarted),
    fileCount: files.length,
    totalLessonRowsVerified,
    summaryHits: memo.summaryIndexHits,
    summaryMisses: memo.summaryIndexMisses,
    pathwayNormHits: memo.pathwayNormalizeHits,
    pathwayNormMisses: memo.pathwayNormalizeMisses,
  });

  const heapMb = Math.round(process.memoryUsage().heapUsed / (1024 * 1024));
  console.error(
    `[nursenest-core] lesson_index_verify_phase_summary\n${JSON.stringify(
      {
        fileCount: files.length,
        totalLessonRowsVerified,
        verifyMs: Math.round(performance.now() - verifyStarted),
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
