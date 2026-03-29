#!/usr/bin/env npx tsx
/**
 * Report: pipeline hash resolution vs ambiguous cache_key families (read-only).
 */
import * as fs from "fs";
import * as path from "path";
import { loadJsonRows } from "./json-load";
import {
  buildPipelineCacheKeyIndexFromGenerationJobs,
  clearPipelineCacheKeyIndexCache,
  loadGenerationJobsJson,
  resolveCacheKeyFromExportBundle,
} from "./nursing-cache-key-source-resolve";

function parseArgs(argv: string[]) {
  const dirIdx = argv.indexOf("--dir");
  const dirAbs =
    dirIdx >= 0 && argv[dirIdx + 1] ? path.resolve(argv[dirIdx + 1]) : path.resolve("data/replit-exports");
  return { dirAbs };
}

function topFamilies(keys: string[], n: number): { prefix: string; count: number }[] {
  const m = new Map<string, number>();
  for (const k of keys) {
    const p = k.length >= 12 ? k.slice(0, 12) : k;
    m.set(p, (m.get(p) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([prefix, count]) => ({ prefix, count }));
}

async function main() {
  const { dirAbs } = parseArgs(process.argv.slice(2));
  clearPipelineCacheKeyIndexCache();

  const aiPath = path.join(dirAbs, "ai_cache.json");
  const jobsPath = path.join(dirAbs, "generation_jobs.json");

  if (!fs.existsSync(aiPath)) {
    console.log(
      JSON.stringify(
        {
          type: "nursing_resolution_report",
          error: "ai_cache.json not found",
          dirAbs,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const rows = loadJsonRows(aiPath) as Record<string, unknown>[];
  const cacheKeys: string[] = [];
  for (const row of rows) {
    const ck =
      typeof row.cache_key === "string"
        ? row.cache_key
        : typeof row.cacheKey === "string"
          ? row.cacheKey
          : null;
    if (ck) cacheKeys.push(ck);
  }

  const uniqueKeys = [...new Set(cacheKeys)];
  const jobs = loadGenerationJobsJson(dirAbs);
  const index = jobs ? buildPipelineCacheKeyIndexFromGenerationJobs(jobs) : new Map();

  let resolvedTierFromPipeline = 0;
  const unresolvedKeys: string[] = [];
  const examplesResolved: { cacheKey: string; tier: string; jobId: string }[] = [];
  for (const ck of uniqueKeys) {
    const r = resolveCacheKeyFromExportBundle(ck, dirAbs);
    if (r?.tier) {
      resolvedTierFromPipeline++;
      if (examplesResolved.length < 5) {
        examplesResolved.push({ cacheKey: ck, tier: r.tier, jobId: r.jobId });
      }
    } else {
      unresolvedKeys.push(ck);
    }
  }

  console.log(
    JSON.stringify(
      {
        type: "nursing_resolution_report",
        dirAbs,
        aiCacheRows: rows.length,
        cacheKeyOccurrences: cacheKeys.length,
        uniqueCacheKeys: uniqueKeys.length,
        generationJobsFilePresent: fs.existsSync(jobsPath),
        generationJobsRows: jobs?.length ?? 0,
        pipelineIndexSize: index.size,
        uniqueKeysWithResolvableTierFromJobs: resolvedTierFromPipeline,
        uniqueKeysStillUnresolvedByPipelineIndex: unresolvedKeys.length,
        topUnresolvedKeyFamilies: topFamilies(unresolvedKeys, 15),
        exampleResolvedPaths: examplesResolved,
        notes: [
          "Opaque keys are SHA256(language-scoped(pipeline input)); reversible only by matching recomputed keys from generation_jobs.json (same bundle).",
          "Exam is never inferred from tier here; use manual mapping or explicit item/parent metadata.",
        ],
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
