import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { medMathQuestions, MED_MATH_LEGACY_CORPUS_ROUNDING_POLICY } from "@legacy-client/data/med-math-questions";
import {
  decimalPlaces,
  hasRoundingInstruction,
  isQuarterTabletIncrement,
  validateMedMathNumericCorpus,
  validateMedMathNumericQuestion,
  type MedMathNumericQuestion,
} from "./validate-med-math-answer-realism";

describe("med-math answer realism validator", () => {
  it("flags non-integer gtt/min", () => {
    const q: MedMathNumericQuestion = {
      id: "x",
      statement: "Drip rate?",
      answer: 31.25,
      unit: "gtt/min",
      steps: ["Round to nearest whole drop"],
    };
    assert.deepEqual(validateMedMathNumericQuestion(q), [`x: gtt/min must be a whole number (got 31.25)`]);
  });

  it("flags mL/hr with more than one decimal", () => {
    const q: MedMathNumericQuestion = {
      id: "y",
      statement: "Pump rate?",
      answer: 166.67,
      unit: "mL/hr",
      steps: ["Round to nearest tenth"],
    };
    assert.deepEqual(validateMedMathNumericQuestion(q), [`y: mL/hr should have at most 1 decimal (166.67)`]);
  });

  it("flags tablet answers not on quarter-tab increments", () => {
    assert.equal(isQuarterTabletIncrement(1.38), false);
    assert.equal(isQuarterTabletIncrement(1.5), true);
    const q: MedMathNumericQuestion = {
      id: "z",
      statement: "Tablets?",
      answer: 1.38,
      unit: "tablet(s)",
      steps: ["Round"],
    };
    assert.ok(validateMedMathNumericQuestion(q).some((m) => m.includes("workable fractions")));
  });

  it("requires rounding signal unless global policy is passed", () => {
    const q: MedMathNumericQuestion = {
      id: "r",
      statement: "How many tablets should you administer for this order?",
      answer: 2,
      unit: "tablet(s)",
      steps: ["Calc only"],
    };
    assert.ok(validateMedMathNumericQuestion(q).some((m) => m.includes("missing rounding")));
    const withPolicy = validateMedMathNumericQuestion(q, { globalCorpusPolicy: MED_MATH_LEGACY_CORPUS_ROUNDING_POLICY });
    assert.deepEqual(withPolicy, [], withPolicy.join("; "));
  });

  it("legacy medMathQuestions corpus passes with deck rounding policy", () => {
    const issues = validateMedMathNumericCorpus(medMathQuestions, {
      globalCorpusPolicy: MED_MATH_LEGACY_CORPUS_ROUNDING_POLICY,
    });
    assert.deepEqual(issues, [], issues.join("\n"));
  });

  it("hasRoundingInstruction detects common wording", () => {
    assert.equal(
      hasRoundingInstruction({
        id: "a",
        statement: "Round to the nearest tenth",
        answer: 1,
        unit: "mL",
      }),
      true,
    );
  });

  it("decimalPlaces handles typical floats", () => {
    assert.equal(decimalPlaces(31), 0);
    assert.equal(decimalPlaces(166.7), 1);
    assert.equal(decimalPlaces(2.25), 2);
  });
});
