import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeRejectedTask } from "@/lib/loading/critical-load-outcome";

describe("describeRejectedTask", () => {
  it("marks timeout-ish messages retryable", () => {
    const r = describeRejectedTask("question_snapshot", new Error("connect ETIMEDOUT"));
    assert.equal(r.retryable, true);
  });

  it("marks generic errors non-retryable by default", () => {
    const r = describeRejectedTask("lesson_count", new Error("relation does not exist"));
    assert.equal(r.retryable, false);
    assert.match(r.reason, /^lesson_count:/);
  });
});
