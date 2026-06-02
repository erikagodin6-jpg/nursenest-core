/**
 * Verifiable linkage from opaque ai_cache.cache_key values to pipeline generation metadata.
 *
 * Origin: server/content-pipeline.ts stores cache keys as:
 *   buildLanguageScopedCacheKey(
 *     hashContent(`eq_${tier}_${system}_${batchCount}_${runDate}_${difficultyBias || "default"}`),
 *     targetLanguage
 *   )
 * where hashContent is SHA256(lower(trim(text))) hex, and buildLanguageScopedCacheKey is
 * SHA256(`${baseKey}::lang=${lang}`) hex.
 *
 * SHA256 is not reversible; we recover metadata only by recomputing candidate keys from
 * generation_jobs.json (same export bundle) + bounded difficulty-bias / language candidates.
 * No tier→exam guessing: exam is null unless a future sidecar provides it.
 */
import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";

const PIPELINE_BATCH_SIZE = 20;

/** Must match server/content-pipeline.ts */
export function hashContent(text: string): string {
  return createHash("sha256").update(text.toLowerCase().trim()).digest("hex");
}

/** Must match server/language-enforcement.ts buildLanguageScopedCacheKey */
export function buildLanguageScopedCacheKey(baseKey: string, targetLanguage: string): string {
  return createHash("sha256").update(`${baseKey}::lang=${targetLanguage}`).digest("hex");
}

const DIFFICULTY_DISTRIBUTION = { easy: 0.3, moderate: 0.45, hard: 0.25 };

/** Port of server/content-pipeline.ts computeDifficultyBias (sync, no DB). */
export function computeDifficultyBiasSync(dist: { easy: number; moderate: number; hard: number }): string {
  const total = dist.easy + dist.moderate + dist.hard;
  if (total === 0) {
    return "Generate a mix: 30% easy (difficulty 1-2), 45% moderate (difficulty 3), 25% hard (difficulty 4-5).";
  }
  const easyPct = dist.easy / total;
  const modPct = dist.moderate / total;
  const hardPct = dist.hard / total;
  const needs: string[] = [];
  if (easyPct < DIFFICULTY_DISTRIBUTION.easy - 0.05) {
    needs.push(`more easy questions (current: ${Math.round(easyPct * 100)}%, target: 30%)`);
  }
  if (modPct < DIFFICULTY_DISTRIBUTION.moderate - 0.05) {
    needs.push(`more moderate questions (current: ${Math.round(modPct * 100)}%, target: 45%)`);
  }
  if (hardPct < DIFFICULTY_DISTRIBUTION.hard - 0.05) {
    needs.push(`more hard questions (current: ${Math.round(hardPct * 100)}%, target: 25%)`);
  }
  if (needs.length === 0) {
    return "Maintain balanced difficulty: 30% easy (1-2), 45% moderate (3), 25% hard (4-5).";
  }
  return `PRIORITY: Generate ${needs.join(", ")}. Target distribution: 30% easy (difficulty 1-2), 45% moderate (difficulty 3), 25% hard (difficulty 4-5).`;
}

export type PipelineResolution = {
  tier: string;
  /** Never inferred from tier alone (guardrails). Set only if present in trusted sidecar in future. */
  exam: string | null;
  provenance: "generation_job";
  jobId: string;
  system: string;
  runDate: string;
  batchCount: number;
  difficultyLabel: string;
  lang: string;
  detail: string;
};

/** Matches `difficultyBias || "default"` in content-pipeline inner string. */
function biasSegment(difficultyBias: string | undefined): string {
  if (difficultyBias === undefined || difficultyBias === "") return "default";
  return difficultyBias;
}

/** Difficulty bias values to try when reconstructing keys (export has no DB snapshot at job run). */
function defaultDifficultyBiasCandidates(): (string | undefined)[] {
  const out: (string | undefined)[] = [undefined];
  const uniq = new Set<string>();
  for (const s of [
    computeDifficultyBiasSync({ easy: 0, moderate: 0, hard: 0 }),
    computeDifficultyBiasSync({ easy: 100, moderate: 100, hard: 100 }),
    computeDifficultyBiasSync({ easy: 5, moderate: 50, hard: 5 }),
    computeDifficultyBiasSync({ easy: 1, moderate: 1, hard: 98 }),
  ]) {
    if (!uniq.has(s)) {
      uniq.add(s);
      out.push(s);
    }
  }
  return out;
}

function parseTopicPlan(raw: unknown): Array<{ system: string; count: number }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ system: string; count: number }> = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const system = typeof r.system === "string" ? r.system : "";
    const count = typeof r.count === "number" && Number.isFinite(r.count) ? r.count : 0;
    if (system && count > 0) out.push({ system, count });
  }
  return out;
}

/**
 * Build map: final cache_key (hex) → resolution (last job wins on collision; detail lists job id).
 */
export function buildPipelineCacheKeyIndexFromGenerationJobs(
  jobs: Record<string, unknown>[],
  options?: {
    difficultyBiasCandidates?: (string | undefined)[];
    langs?: string[];
  },
): Map<string, PipelineResolution> {
  const biasList = options?.difficultyBiasCandidates ?? defaultDifficultyBiasCandidates();
  const langs = options?.langs ?? ["en"];
  const map = new Map<string, PipelineResolution>();

  for (const job of jobs) {
    const jobId = typeof job.id === "string" ? job.id : "";
    const runDate = typeof job.run_date === "string" ? job.run_date : typeof job.runDate === "string" ? job.runDate : "";
    const tier = typeof job.tier === "string" ? job.tier : "";
    const contentType =
      typeof job.content_type === "string" ? job.content_type : typeof job.contentType === "string" ? job.contentType : "";
    const rawPlan = job.topic_plan_json ?? job.topicPlanJson;
    const topicPlan = parseTopicPlan(rawPlan);

    if (!jobId || !runDate || !tier || contentType !== "exam_questions" || topicPlan.length === 0) continue;

    for (const { system, count } of topicPlan) {
      if (count <= 0) continue;
      const batches = Math.ceil(count / PIPELINE_BATCH_SIZE);
      for (let b = 0; b < batches; b++) {
        const batchCount = Math.min(PIPELINE_BATCH_SIZE, count - b * PIPELINE_BATCH_SIZE);
        for (const bias of biasList) {
          const inner = `eq_${tier}_${system}_${batchCount}_${runDate}_${biasSegment(bias)}`;
          const base = hashContent(inner);
          for (const lang of langs) {
            const cacheKey = buildLanguageScopedCacheKey(base, lang);
            const biasLabel = bias === undefined ? "default" : `${bias.slice(0, 64)}${bias.length > 64 ? "…" : ""}`;
            const detail = `job=${jobId} system=${system} batchCount=${batchCount} runDate=${runDate} bias=${biasLabel} lang=${lang}`;
            map.set(cacheKey, {
              tier,
              exam: null,
              provenance: "generation_job",
              jobId,
              system,
              runDate,
              batchCount,
              difficultyLabel: bias === undefined ? "default" : bias,
              lang,
              detail,
            });
          }
        }
      }
    }
  }
  return map;
}

export function loadGenerationJobsJson(exportDirAbs: string): Record<string, unknown>[] | null {
  const p = path.join(exportDirAbs, "generation_jobs.json");
  if (!fs.existsSync(p)) return null;
  try {
    const raw = fs.readFileSync(p, "utf8");
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? (data as Record<string, unknown>[]) : null;
  } catch {
    return null;
  }
}

const catalogByExportDir = new Map<string, Map<string, PipelineResolution>>();

export function getPipelineCacheKeyIndex(exportDirAbs: string): Map<string, PipelineResolution> {
  const cached = catalogByExportDir.get(exportDirAbs);
  if (cached) return cached;
  const jobs = loadGenerationJobsJson(exportDirAbs);
  const map = jobs ? buildPipelineCacheKeyIndexFromGenerationJobs(jobs) : new Map();
  catalogByExportDir.set(exportDirAbs, map);
  return map;
}

export function clearPipelineCacheKeyIndexCache(): void {
  catalogByExportDir.clear();
}

export function resolveCacheKeyFromExportBundle(
  cacheKey: string | null,
  exportDirAbs: string,
): PipelineResolution | null {
  if (!cacheKey || !cacheKey.trim()) return null;
  const idx = getPipelineCacheKeyIndex(exportDirAbs);
  return idx.get(cacheKey) ?? null;
}
