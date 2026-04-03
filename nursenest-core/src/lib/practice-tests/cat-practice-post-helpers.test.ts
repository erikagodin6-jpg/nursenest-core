import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NCLEX_EXAM_SIMULATION_TIME_LIMIT_SEC } from "@/lib/exams/cat-exam-simulation";
import {
  resolveCatPostExamTimedLimitSec,
  resolveCatSelectionBasisForPost,
} from "@/lib/practice-tests/cat-practice-post-helpers";

describe("resolveCatSelectionBasisForPost", () => {
  it("forces random for exam_simulation even when client requests weak", () => {
    assert.equal(
      resolveCatSelectionBasisForPost("exam_simulation", "weak"),
      "random",
    );
  });

  it("respects client basis for practice CAT", () => {
    assert.equal(resolveCatSelectionBasisForPost("practice", "weak"), "weak");
    assert.equal(resolveCatSelectionBasisForPost("practice", undefined), "random");
  });
});

describe("resolveCatPostExamTimedLimitSec", () => {
  it("defaults timed exam_simulation to NCLEX-style 5h when no limit provided (default pathway)", () => {
    const sec = resolveCatPostExamTimedLimitSec({
      timedMode: true,
      timeLimitSec: undefined,
      questionCount: 85,
      catPresentationMode: "exam_simulation",
      pathway: null,
    });
    assert.equal(sec, NCLEX_EXAM_SIMULATION_TIME_LIMIT_SEC);
    assert.equal(sec, 18_000);
  });

  it("uses explicit timeLimitSec for timed exam_simulation when provided", () => {
    assert.equal(
      resolveCatPostExamTimedLimitSec({
        timedMode: true,
        timeLimitSec: 7200,
        questionCount: 85,
        catPresentationMode: "exam_simulation",
        pathway: null,
      }),
      7200,
    );
  });

  it("returns null when timedMode is off for exam_simulation", () => {
    assert.equal(
      resolveCatPostExamTimedLimitSec({
        timedMode: false,
        timeLimitSec: undefined,
        questionCount: 85,
        catPresentationMode: "exam_simulation",
        pathway: null,
      }),
      null,
    );
  });
});
