import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyPracticeRunnerPayloadShape,
  logUnknownCatalogQuestionTypeDev,
  practiceRunnerNeedsUnsupportedFallback,
  runnerQuestionTypeLooksUnrecognized,
} from "@/lib/questions/practice-runner-question-support";

describe("practice-runner-question-support", () => {
  it("treats plain string option arrays as supported", () => {
    assert.equal(classifyPracticeRunnerPayloadShape(["A", "B", "C"]).kind, "supported");
  });

  it("flags structured JSON options as unsupported_shape", () => {
    const r = classifyPracticeRunnerPayloadShape({ rows: [{ id: "a" }] });
    assert.equal(r.kind, "unsupported_shape");
    if (r.kind === "unsupported_shape") assert.equal(r.reason, "structured_options_object");
  });

  it("flags specialized question types when options do not parse as MCQ list", () => {
    assert.equal(
      practiceRunnerNeedsUnsupportedFallback("MATRIX_MULTI_SELECT", [], 0, false),
      true,
    );
    assert.equal(practiceRunnerNeedsUnsupportedFallback("MCQ", ["a", "b"], 2, false), false);
  });

  it("never flags bowtie branch as unsupported", () => {
    assert.equal(practiceRunnerNeedsUnsupportedFallback("BOWTIE", {}, 0, true), false);
  });

  it("recognizes legacy and uppercase MCQ / SATA labels", () => {
    assert.equal(runnerQuestionTypeLooksUnrecognized("multiple_choice"), false);
    assert.equal(runnerQuestionTypeLooksUnrecognized("SATA"), false);
    assert.equal(runnerQuestionTypeLooksUnrecognized("NGN_CASE"), false);
  });

  it("flags empty or arbitrary labels as unrecognized", () => {
    assert.equal(runnerQuestionTypeLooksUnrecognized(""), true);
    assert.equal(runnerQuestionTypeLooksUnrecognized("TYPO_XYZ"), true);
  });

  it("logUnknownCatalogQuestionTypeDev is silent in production-like env", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    logUnknownCatalogQuestionTypeDev("id-full-length", "TYPO", 4);
    process.env.NODE_ENV = prev;
  });
});
