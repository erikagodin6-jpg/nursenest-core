/**
 * Marketing hub list shape: no full lesson bodies or assessments on the hub index path.
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPathwayLesson, stripPathwayLessonToHubListShape } from "@/lib/lessons/pathway-lesson-loader";

describe("stripPathwayLessonToHubListShape", () => {
  it("drops section bodies, preTest, postTest, and question id arrays for hub index rows", async () => {
    const full = await getPathwayLesson("ca-rn-nclex-rn", "fluid-balance-acute-care");
    assert.ok(full);
    assert.ok((full!.sections?.length ?? 0) > 0 || (full!.preTest?.length ?? 0) > 0);
    const slim = stripPathwayLessonToHubListShape(full!);
    assert.equal(slim.sections.length, 0);
    assert.equal(slim.preTest, undefined);
    assert.equal(slim.postTest, undefined);
    assert.equal(slim.preTestQuestionIds, undefined);
    assert.equal(slim.postTestQuestionIds, undefined);
    assert.ok(typeof slim.title === "string" && slim.title.trim().length > 0);
    assert.ok(typeof slim.slug === "string" && slim.slug.trim().length > 0);
  });
});
