import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessCatPracticeHydrateInvariants } from "./cat-session-surface-invariants";

describe("assessCatPracticeHydrateInvariants", () => {
  it("blocks CAT in progress with zero questions", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "IN_PROGRESS",
      questionIds: [],
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, "cat_in_progress_no_questions");
  });

  it("allows CAT completed with empty ids (server-owned terminal state)", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: true,
      status: "COMPLETED",
      questionIds: [],
    });
    assert.equal(r.ok, true);
  });

  it("allows linear in progress with ids", () => {
    const r = assessCatPracticeHydrateInvariants({
      catMode: false,
      status: "IN_PROGRESS",
      questionIds: ["q1"],
    });
    assert.equal(r.ok, true);
  });
});
