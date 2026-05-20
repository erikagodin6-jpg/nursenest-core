import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  pathwayLessonProgressStatusFromRow,
  syntheticPathwayLessonId,
} from "@/lib/lessons/pathway-lesson-progress";

describe("pathway-lesson-progress", () => {
  it("builds stable synthetic ids", () => {
    assert.equal(syntheticPathwayLessonId("us-rn-nclex-rn", "sepsis-gold"), "pathway:us-rn-nclex-rn:sepsis-gold");
  });

  it("maps DB rows to status", () => {
    assert.equal(pathwayLessonProgressStatusFromRow(null), "not_started");
    assert.equal(pathwayLessonProgressStatusFromRow({ completed: false }), "in_progress");
    assert.equal(pathwayLessonProgressStatusFromRow({ completed: true }), "completed");
  });
});
