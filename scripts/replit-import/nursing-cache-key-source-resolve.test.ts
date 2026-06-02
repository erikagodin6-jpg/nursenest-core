import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { describe, test, expect, beforeEach } from "vitest";
import {
  hashContent,
  buildLanguageScopedCacheKey,
  buildPipelineCacheKeyIndexFromGenerationJobs,
  clearPipelineCacheKeyIndexCache,
  resolveCacheKeyFromExportBundle,
} from "./nursing-cache-key-source-resolve";

describe("nursing-cache-key-source-resolve", () => {
  beforeEach(() => {
    clearPipelineCacheKeyIndexCache();
  });

  test("matches content-pipeline exam batch cache key (en)", () => {
    const tier = "rn";
    const system = "Cardiovascular";
    const batchCount = 20;
    const runDate = "2026-03-01";
    const inner = `eq_${tier}_${system}_${batchCount}_${runDate}_default`;
    const base = hashContent(inner);
    const cacheKey = buildLanguageScopedCacheKey(base, "en");

    const jobs: Record<string, unknown>[] = [
      {
        id: "job-1",
        run_date: runDate,
        tier,
        content_type: "exam_questions",
        topic_plan_json: [{ system, count: 25 }],
      },
    ];
    const idx = buildPipelineCacheKeyIndexFromGenerationJobs(jobs, {
      difficultyBiasCandidates: [undefined],
      langs: ["en"],
    });
    expect(idx.get(cacheKey)?.tier).toBe("rn");
    expect(idx.get(cacheKey)?.jobId).toBe("job-1");
    expect(idx.get(cacheKey)?.exam).toBeNull();
  });

  test("resolveCacheKeyFromExportBundle uses cached index per export dir", () => {
    const runDate = "2026-03-02";
    const inner = `eq_np_Respiratory_5_${runDate}_default`;
    const ck = buildLanguageScopedCacheKey(hashContent(inner), "en");

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nursing-resolve-"));
    try {
      fs.writeFileSync(
        path.join(tmp, "generation_jobs.json"),
        JSON.stringify([
          {
            id: "j2",
            run_date: runDate,
            tier: "np",
            content_type: "exam_questions",
            topic_plan_json: [{ system: "Respiratory", count: 5 }],
          },
        ]),
      );
      const r = resolveCacheKeyFromExportBundle(ck, tmp);
      expect(r?.tier).toBe("np");
      expect(r?.provenance).toBe("generation_job");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
      clearPipelineCacheKeyIndexCache();
    }
  });
});
