#!/usr/bin/env node
/**
 * Validates optional `generated-indexes/*.json` against live catalog merge (no disk shortcut during live leg).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { buildLessonNormalizationCoverageReport } from "./lesson-normalization-coverage.mts";
import { getLessonVerifyMode as getLessonVerifyModeFromEnv } from "./lesson-index-verify-mode.mjs";

const examPathwaysModule = await import("@/lib/exam-pathways/exam-pathways-catalog");
const catalogSyncModule = await import("@/lib/lessons/pathway-lesson-catalog-sync");
const generatedIndexModule = await import("@/lib/lessons/pathway-lesson-generated-index");
const lessonRoutesModule = await import("@/lib/lessons/lesson-routes");
const canonicalHubsModule = await import("@/lib/lessons/canonical-lessons-hubs");
const marketingHubModule = await import("@/lib/lessons/marketing-lessons-hub-category");
const safeServerLogModule = await import("@/lib/observability/safe-server-log");

const { getExamPathwayById } = examPathwaysModule.default ?? examPathwaysModule;
const {
  getCatalogLessonsRaw,
  getCatalogLessonsRawFromBundledOnly,
  getLessonCatalogMemoizationStats,
  getLessonSummariesIndex,
  getMarketingHubEffectiveCatalogSlugSet,
  listCatalogPathwayIdsWithLessonsSync,
  resetCatalogLessonsRawMergeCacheForTests,
} = catalogSyncModule.default ?? catalogSyncModule;
const { parsePathwayLessonGeneratedIndexV1 } = generatedIndexModule.default ?? generatedIndexModule;
const { marketingPathwayLessonDetailPath } = lessonRoutesModule.default ?? lessonRoutesModule;
const { ALLIED_MARKETING_CORE_PATHWAY_IDS } = canonicalHubsModule.default ?? canonicalHubsModule;
const { getMarketingLessonsHubCatalogLessons } = marketingHubModule.default ?? marketingHubModule;
const { safeServerLog } = safeServerLogModule.default ?? safeServerLogModule;

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const realIndexDir = path.join(coreRoot, "src", "content", "pathway-lessons", "generated-indexes");
const manifestPath = path.join(realIndexDir, "manifest.json");
export type LessonVerifyMode = "deep" | "light" | "changed-only";

type LessonIndexManifest = {
  schemaVersion: 1;
  generatedAt: string;
  entries: Array<{
    pathwayId: string;
    fileName: string;
    sourceFingerprint?: string;
    fileHash: string;
    lessonCount: number;
    generatedAt: string;
    verifiedAt?: string;
  }>;
};

/** Same semantics as `scripts/run-lesson-indexes-for-build.mjs` (build + verify gates). */
function isNNSkipLessonIndexBuild(): boolean {
  return /^(1|true|yes)$/i.test(String(process.env.NN_SKIP_LESSON_INDEX_BUILD ?? "").trim());
}

function listGeneratedJsonFiles(): string[] {
  if (!fs.existsSync(realIndexDir)) return [];
  return fs.readdirSync(realIndexDir).filter((f) => f.endsWith(".json") && f !== "package.json" && f !== "manifest.json");
}

export function getLessonVerifyMode(env: NodeJS.ProcessEnv = process.env): LessonVerifyMode {
  return getLessonVerifyModeFromEnv(env);
}

function changedPathwaysFromEnv(env: NodeJS.ProcessEnv = process.env): Set<string> {
  return new Set(
    String(env.NN_CHANGED_LESSON_PATHWAYS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export function shouldDeepVerifyPathway(
  pathwayId: string,
  mode: LessonVerifyMode,
  changedPathways: Set<string>,
): boolean {
  if (mode === "deep") return true;
  if (mode === "light") return false;
  if (changedPathways.size === 0) return true;
  return changedPathways.has(pathwayId);
}

function sha256File(filePath: string): string {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readManifest(): LessonIndexManifest | null {
  if (!fs.existsSync(manifestPath)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as LessonIndexManifest;
    if (parsed?.schemaVersion !== 1 || !Array.isArray(parsed.entries)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeManifest(manifest: LessonIndexManifest): void {
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function verifyManifestEntry(
  manifest: LessonIndexManifest | null,
  pathwayId: string,
  fileName: string,
  parsed: NonNullable<ReturnType<typeof parsePathwayLessonGeneratedIndexV1>>,
): void {
  if (!manifest) return;
  const entry = manifest.entries.find((row) => row.pathwayId === pathwayId && row.fileName === fileName);
  if (!entry) {
    throw new Error(`[verify:lesson-indexes] manifest missing entry pathway=${pathwayId} file=${fileName}`);
  }
  const currentHash = sha256File(path.join(realIndexDir, fileName));
  if (entry.fileHash !== currentHash) {
    throw new Error(`[verify:lesson-indexes] manifest hash mismatch pathway=${pathwayId} file=${fileName}`);
  }
  if (entry.lessonCount !== parsed.summaries.length) {
    throw new Error(
      `[verify:lesson-indexes] manifest lesson count mismatch pathway=${pathwayId} manifest=${entry.lessonCount} file=${parsed.summaries.length}`,
    );
  }
  entry.verifiedAt = new Date().toISOString();
}

/**
 * Single “no disk index” session per pathway: avoids duplicating expensive
 * `normalized_pathway_catalog` work (previously two tmpdirs + two normalizes per file).
 */
function liveLessonIndexParityWithoutDisk(pathwayId: string): {
  summaries: ReturnType<typeof getLessonSummariesIndex>;
  marketingEffectiveSlugs: Set<string>;
} {
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-index-live-"));
  const prev = process.env.NN_PATHWAY_LESSON_INDEX_DIR;
  process.env.NN_PATHWAY_LESSON_INDEX_DIR = emptyDir;
  try {
    resetCatalogLessonsRawMergeCacheForTests();
    const summaries = getLessonSummariesIndex(pathwayId);
    const marketingEffectiveSlugs = getMarketingHubEffectiveCatalogSlugSet(pathwayId);
    return { summaries, marketingEffectiveSlugs };
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

  const verifyMode = getLessonVerifyMode();
  const changedPathways = changedPathwaysFromEnv();
  const manifest = readManifest();
  const files = listGeneratedJsonFiles();
  if (files.length === 0) {
    throw new Error(
      `[verify:lesson-indexes] FATAL: no generated *.json under ${realIndexDir}\n` +
        "Run `npm run build:lesson-indexes` (or full `npm run build`, which runs indexes before `next build`).\n" +
        "Constrained builders may set NN_SKIP_LESSON_INDEX_BUILD=true to skip index generation and checks.",
    );
  }

  for (const alliedId of ALLIED_MARKETING_CORE_PATHWAY_IDS) {
    const bundledLen = getCatalogLessonsRawFromBundledOnly(alliedId).length;
    if (bundledLen === 0) {
      throw new Error(
        `[verify:lesson-indexes] FATAL: allied bundled catalog has zero merged lessons for ${alliedId} — cannot validate allied index pipeline.`,
      );
    }
    const rawLen = getCatalogLessonsRaw(alliedId).length;
    const expected = path.join(realIndexDir, `${alliedId}.json`);
    if (!fs.existsSync(expected)) {
      throw new Error(
        `[verify:lesson-indexes] FATAL: required allied index file is missing (would cause ENOENT for consumers).\n` +
          `  expectedPath=${expected}\n` +
          `  pathwayId=${alliedId} mergedRawLessons=${rawLen} bundledOnlyLessons=${bundledLen}\n` +
          `  Run \`npm run build:lesson-indexes\` from the app package root; allied pathways run first — ensure the build phase completes.`,
      );
    }
  }

  const catalogIds = new Set(listCatalogPathwayIdsWithLessonsSync());
  const verifyStarted = performance.now();
  let totalLessonRowsVerified = 0;
  let deepVerifiedPathways = 0;
  let manifestVerifiedPathways = 0;
  const deepVerifiedPathwayIds: string[] = [];

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
    verifyManifestEntry(manifest, pathwayId, file, parsed);
    manifestVerifiedPathways += manifest ? 1 : 0;

    const rawLen = getCatalogLessonsRaw(pathwayId).length;
    if (parsed.mergedRawLessonCount !== rawLen) {
      throw new Error(
        `[verify:lesson-indexes] mergedRawLessonCount mismatch pathway=${pathwayId} file=${parsed.mergedRawLessonCount} live=${rawLen}`,
      );
    }

    const fileSlugs = [...parsed.summaries.map((r) => r.slug)].sort();
    if (shouldDeepVerifyPathway(pathwayId, verifyMode, changedPathways)) {
      const { summaries: liveSummaries, marketingEffectiveSlugs: liveEff } = liveLessonIndexParityWithoutDisk(
        pathwayId,
      );
      if (liveSummaries.length !== parsed.summaries.length) {
        throw new Error(
          `[verify:lesson-indexes] summary count mismatch pathway=${pathwayId} live=${liveSummaries.length} file=${parsed.summaries.length}`,
        );
      }
      const liveSlugs = [...liveSummaries.map((r) => r.slug)].sort();
      if (liveSlugs.join("\0") !== fileSlugs.join("\0")) {
        throw new Error(`[verify:lesson-indexes] slug set mismatch pathway=${pathwayId}`);
      }

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
      deepVerifiedPathways += 1;
      deepVerifiedPathwayIds.push(pathwayId);
    }

    assertDetailHrefs(pathwayId, fileSlugs);
    totalLessonRowsVerified += parsed.summaries.length;
    console.info(`[verify:lesson-indexes] ok pathway=${pathwayId} lessons=${parsed.summaries.length}`);
  }
  console.info(`[verify:lesson-indexes] all ${files.length} file(s) validated.`);

  const verifiedPathwayIds = [...new Set(deepVerifiedPathwayIds)].sort((a, b) =>
    a.localeCompare(b),
  );
  if (verifiedPathwayIds.length > 0) {
    const coverage = buildLessonNormalizationCoverageReport({ pathwayIds: verifiedPathwayIds });
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
  } else {
    console.info("[verify:lesson-indexes] skipped heavy coverage checks reason=light_manifest_mode");
  }
  if (manifest) {
    writeManifest(manifest);
  }

  const memo = getLessonCatalogMemoizationStats();
  warnHighLessonCatalogMemoMissRates(memo);
  safeServerLog("lesson_indexes", "lesson_index_verification_duration_ms", {
    totalMs: Math.round(performance.now() - verifyStarted),
    fileCount: files.length,
    totalLessonRowsVerified,
    verifyMode,
    deepVerifiedPathways,
    manifestVerifiedPathways,
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
        verifyMode,
        deepVerifiedPathways,
        manifestVerifiedPathways,
        verifyMs: Math.round(performance.now() - verifyStarted),
        heapUsedMb: heapMb,
      },
      null,
      2,
    )}`,
  );
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}
