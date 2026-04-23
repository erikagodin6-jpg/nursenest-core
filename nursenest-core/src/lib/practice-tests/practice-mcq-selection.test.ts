import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computePracticeMcqOptionRowState } from "@/lib/practice-tests/practice-mcq-selection";

describe("computePracticeMcqOptionRowState (linear / legacy parity)", () => {
  it("does not reveal correctness before feedback (selection only)", () => {
    const st = computePracticeMcqOptionRowState({
      answer: "A",
      canonical: "A",
      linearEngineActive: true,
      currentCommitted: true,
      rationaleVisibility: "after_each",
      feedback: undefined,
    });
    assert.equal(st, "selected");
  });

  it("after_each + feedback: correct keys only after commit (matches CAT-style reveal)", () => {
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: "A",
        canonical: "B",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "after_each",
        feedback: { correctKeys: ["B"] },
      }),
      "correct",
    );
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: "A",
        canonical: "C",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "after_each",
        feedback: { correctKeys: ["B"] },
      }),
      "dim",
    );
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: "B",
        canonical: "B",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "after_each",
        feedback: { correctKeys: ["B"] },
      }),
      "correct",
    );
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: "A",
        canonical: "A",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "after_each",
        feedback: { correctKeys: ["B"] },
      }),
      "incorrect",
    );
  });

  it("end_of_exam: hides correctness; selected vs dim only", () => {
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: "A",
        canonical: "A",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "end_of_exam",
        feedback: { correctKeys: ["B"] },
      }),
      "selected",
    );
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: "A",
        canonical: "B",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "end_of_exam",
        feedback: { correctKeys: ["B"] },
      }),
      "dim",
    );
  });

  it("SATA: incorrect only when selected and not in correctKeys", () => {
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: ["A", "B"],
        canonical: "A",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "after_each",
        feedback: { correctKeys: ["B", "C"] },
      }),
      "incorrect",
    );
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: ["A", "B"],
        canonical: "B",
        linearEngineActive: true,
        currentCommitted: true,
        rationaleVisibility: "after_each",
        feedback: { correctKeys: ["B", "C"] },
      }),
      "correct",
    );
  });

  it("legacy (no linear engine): never shows correct/incorrect from this helper", () => {
    assert.equal(
      computePracticeMcqOptionRowState({
        answer: "X",
        canonical: "X",
        linearEngineActive: false,
        currentCommitted: true,
        rationaleVisibility: "after_each",
        feedback: { correctKeys: ["Y"] },
      }),
      "selected",
    );
  });
});
