import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeImportedQuestionCorrectAnswer,
  normalizeImportedQuestionOptions,
  normalizeImportedQuestionShape,
  questionShapeNeedsRepair,
} from "./stage-prisma-import-normalize";

describe("stage prisma import question normalization", () => {
  it("converts object options and letter answer keys into array-based question data", () => {
    const rawOptions = {
      A: "First option",
      B: "Second option",
      C: "Third option",
      D: "Fourth option",
    };

    const options = normalizeImportedQuestionOptions(rawOptions);
    const correctAnswer = normalizeImportedQuestionCorrectAnswer("B", rawOptions, options);

    assert.deepEqual(options, ["First option", "Second option", "Third option", "Fourth option"]);
    assert.deepEqual(correctAnswer, ["Second option"]);
  });

  it("preserves array options and textual correct answers", () => {
    const rawOptions = ["Alpha", "Beta", "Gamma", "Delta"];
    const normalized = normalizeImportedQuestionShape(rawOptions, ["Beta", "Delta"]);

    assert.deepEqual(normalized.options, rawOptions);
    assert.deepEqual(normalized.correctAnswer, ["Beta", "Delta"]);
  });

  it("flags pre-existing non-array stored shapes for repair", () => {
    const normalized = normalizeImportedQuestionShape(
      { A: "Alpha", B: "Beta", C: "Gamma", D: "Delta" },
      "C",
    );

    assert.equal(
      questionShapeNeedsRepair(
        { A: "Alpha", B: "Beta", C: "Gamma", D: "Delta" },
        "C",
        normalized.options,
        normalized.correctAnswer,
      ),
      true,
    );
    assert.equal(
      questionShapeNeedsRepair(
        normalized.options,
        normalized.correctAnswer,
        normalized.options,
        normalized.correctAnswer,
      ),
      false,
    );
  });
});
