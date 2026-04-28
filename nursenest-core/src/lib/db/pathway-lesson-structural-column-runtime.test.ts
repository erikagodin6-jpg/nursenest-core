import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { resetPathwayLessonStructuralColumnRuntimeCacheForTests } from "@/lib/db/pathway-lesson-structural-column-runtime";

describe("pathway-lesson-structural-column-runtime", () => {
  beforeEach(() => {
    resetPathwayLessonStructuralColumnRuntimeCacheForTests();
  });

  it("exposes a test-only cache reset so column-probe memoization does not leak across cases", () => {
    resetPathwayLessonStructuralColumnRuntimeCacheForTests();
    assert.equal(typeof resetPathwayLessonStructuralColumnRuntimeCacheForTests, "function");
  });
});
