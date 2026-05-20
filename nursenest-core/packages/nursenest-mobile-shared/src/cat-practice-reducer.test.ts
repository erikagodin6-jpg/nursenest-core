import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reduceCatPracticePhase, type CatPracticePhase } from "./cat-practice-reducer";

describe("CAT practice reducer", () => {
  it("transitions running -> completed on catCompleted", () => {
    let s: CatPracticePhase = { kind: "idle" };
    s = reduceCatPracticePhase(s, { type: "session_loaded", practiceTestId: "p1", status: "IN_PROGRESS", selectionMode: "cat" });
    assert.equal(s.kind, "running");
    s = reduceCatPracticePhase(s, {
      type: "patch_cat_advance_response",
      practiceTestId: "p1",
      body: { ok: true, catCompleted: true, results: { score: 1 } },
    });
    assert.equal(s.kind, "completed");
    if (s.kind === "completed") assert.deepEqual(s.results, { score: 1 });
  });

  it("handles study reveal", () => {
    let s: CatPracticePhase = { kind: "idle" };
    s = reduceCatPracticePhase(s, { type: "session_loaded", practiceTestId: "p1", status: "IN_PROGRESS", selectionMode: "cat" });
    s = reduceCatPracticePhase(s, {
      type: "patch_cat_advance_response",
      practiceTestId: "p1",
      body: { ok: true, catStudyReveal: true },
    });
    assert.equal(s.kind, "study_reveal");
  });
});
