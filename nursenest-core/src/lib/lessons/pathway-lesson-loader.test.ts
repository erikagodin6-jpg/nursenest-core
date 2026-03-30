import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPathwayLesson } from "./pathway-lesson-loader";

describe("pathway-lesson-loader normalization", () => {
  it("returns five ordered sections for a known catalog lesson", async () => {
    const lesson = await getPathwayLesson("ca-rn-nclex-rn", "fluid-balance-acute-care");
    assert.ok(lesson);
    assert.equal(lesson!.sections.length, 5);
    const kinds = lesson!.sections.map((s) => s.kind);
    assert.deepEqual(kinds, [
      "clinical_meaning",
      "exam_relevance",
      "core_concept",
      "clinical_scenario",
      "takeaways",
    ]);
    for (const s of lesson!.sections) {
      assert.ok(typeof s.body === "string" && s.body.length > 0, `empty body for ${s.kind}`);
    }
    assert.ok(lesson!.previewSectionCount >= 1 && lesson!.previewSectionCount <= lesson!.sections.length);
  });

  it("returns undefined for unknown slug", async () => {
    assert.equal(await getPathwayLesson("ca-rn-nclex-rn", "does-not-exist-zzz"), undefined);
  });
});
