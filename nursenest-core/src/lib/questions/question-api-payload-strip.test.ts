import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  finalizeQuestionApiTeachingExposure,
  stripTeachingFieldsFromQuestionApiPayload,
} from "@/lib/questions/question-api-payload-strip";

describe("question-api-payload-strip (unpaid / preview API shaping)", () => {
  it("removes teaching and answer keys from merged payloads", () => {
    const dirty = {
      id: "q1",
      stem: "stem",
      topic: "Cardiac",
      rationale: "secret",
      clinicalPearl: "secret2",
      correctAnswer: ["A"],
      overlayApplied: true,
    };
    const clean = stripTeachingFieldsFromQuestionApiPayload(dirty);
    assert.equal(clean.rationale, undefined);
    assert.equal(clean.correctAnswer, undefined);
    assert.equal(clean.clinicalPearl, undefined);
    assert.equal(clean.overlayApplied, undefined);
    assert.equal(clean.topic, "Cardiac");
  });

  it("finalize none matches strip; finalize full preserves", () => {
    const row = { rationale: "r", stem: "s" };
    assert.deepEqual(finalizeQuestionApiTeachingExposure(row, "none"), { stem: "s" });
    assert.deepEqual(finalizeQuestionApiTeachingExposure(row, "full"), row);
  });
});
