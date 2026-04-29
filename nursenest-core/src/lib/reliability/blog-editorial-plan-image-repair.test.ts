import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA,
  normalizeBlogEditorialPlanCandidate,
} from "@/lib/blog/blog-control-panel-plan-normalize";

/**
 * Reliability suite mirror: admin blog pipeline_plan / generate_ai paths must tolerate
 * weak `imagePlacements` before Zod (see blog-control-panel-plan-normalize.test.ts for full matrix).
 */
describe("blog editorial plan image repair (reliability)", () => {
  it("normalizeBlogEditorialPlanCandidate never throws on garbage imagePlacements root", () => {
    assert.doesNotThrow(() => {
      const out = normalizeBlogEditorialPlanCandidate(
        { imagePlacements: "not-an-array" as unknown as string[] },
        { jobId: "rel-1" },
      ) as Record<string, unknown>;
      assert.ok(Array.isArray(out.imagePlacements));
      assert.ok((out.imagePlacements as unknown[]).length >= 1);
      assert.equal(
        (out.imagePlacements as { promptIdea: string }[])[0]?.promptIdea,
        BLOG_PLAN_FALLBACK_IMAGE_PROMPT_IDEA,
      );
    });
  });
});
