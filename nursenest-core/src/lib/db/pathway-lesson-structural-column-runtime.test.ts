import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import {
  resetPathwayLessonStructuralColumnRuntimeCacheForTests,
  withPrismaPathwayLessonStructuralDriftRetry,
} from "@/lib/db/pathway-lesson-structural-column-runtime";

describe("pathway-lesson-structural-column-runtime", () => {
  beforeEach(() => {
    resetPathwayLessonStructuralColumnRuntimeCacheForTests();
  });

  it("withPrismaPathwayLessonStructuralDriftRetry retries once on structural_public_complete drift", async () => {
    let calls = 0;
    const result = await withPrismaPathwayLessonStructuralDriftRetry(async (_getReadOmit) => {
      calls += 1;
      if (calls === 1) {
        throw new Error(
          "Invalid prisma.pathwayLesson.findMany() invocation: The column pathway_lessons.structural_public_complete does not exist in the current database.",
        );
      }
      return "ok";
    });
    assert.equal(result, "ok");
    assert.equal(calls, 2);
  });

  it("withPrismaPathwayLessonStructuralDriftRetry does not swallow unrelated errors", async () => {
    await assert.rejects(() =>
      withPrismaPathwayLessonStructuralDriftRetry(async (_getReadOmit) => {
        throw new Error("connection refused");
      }),
    );
  });
});
