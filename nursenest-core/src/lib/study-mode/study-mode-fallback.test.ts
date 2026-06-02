import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeStudyOptional } from "@/lib/study-mode/study-mode-fallback";

describe("safeStudyOptional", () => {
  it("returns the fallback when adaptive learning fails", async () => {
    const result = await safeStudyOptional("adaptive_learning", "flashcards", async () => {
      throw new Error("adaptive unavailable");
    }, []);

    assert.deepEqual(result, []);
  });

  it("returns the fallback when analytics fails", async () => {
    const result = await safeStudyOptional("analytics", "practice_questions", async () => {
      throw new Error("analytics unavailable");
    }, "activity_launched");

    assert.equal(result, "activity_launched");
  });

  it("returns the fallback when recommendations fail", async () => {
    const result = await safeStudyOptional("recommendations", "cat", async () => {
      throw new Error("recommendations unavailable");
    }, null);

    assert.equal(result, null);
  });
});
