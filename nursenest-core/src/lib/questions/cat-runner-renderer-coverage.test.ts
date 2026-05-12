import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertCatCompleteRowRenderableOrThrow,
  catRunnerRowUsesUnsupportedFallback,
  CAT_QUESTION_TYPE_RUNTIME_MATRIX,
} from "@/lib/questions/cat-runner-renderer-coverage";

import {
  classifyPracticeRunnerPayloadShape,
  practiceRunnerNeedsUnsupportedFallback,
  runnerQuestionTypeLooksUnrecognized,
} from "@/lib/questions/practice-runner-question-support";

describe("cat-runner-renderer-coverage", () => {
  it("treats plain MCQ as renderable", () => {
    assert.equal(
      catRunnerRowUsesUnsupportedFallback({
        questionType: "MCQ",
        stem: "Pick one.",
        options: ["A", "B", "C", "D"],
      }),
      false,
    );
  });

  it("treats SATA as renderable", () => {
    assert.equal(
      catRunnerRowUsesUnsupportedFallback({
        questionType: "SATA",
        stem: "Pick all.",
        options: ["W", "X", "Y", "Z"],
      }),
      false,
    );
  });

  it("treats valid bowtie payload as renderable", () => {
    assert.equal(
      catRunnerRowUsesUnsupportedFallback({
        questionType: "Bowtie",
        stem: "Scenario in stem.",
        options: {
          format: "bowtie",
          bank: [
            { id: "a", text: "A" },
            { id: "b", text: "B" },
            { id: "c", text: "C" },
            { id: "d", text: "D" },
          ],
        },
      }),
      false,
    );
  });

  it("flags structured matrix options as unsupported", () => {
    assert.equal(
      catRunnerRowUsesUnsupportedFallback({
        questionType: "MCQ",
        stem: "Match.",
        options: { rows: [{ id: "r1" }], columns: [{ id: "c1" }] },
      }),
      true,
    );
  });

  it("assertCatCompleteRowRenderableOrThrow throws on unsupported complete-shaped row", () => {
    assert.throws(
      () =>
        assertCatCompleteRowRenderableOrThrow(
          {
            id: "cmj000000000",
            questionType: "MATRIX_GRID",
            stem: "x",
            options: { rows: [] },
          },
          { questionTypeLabel: "MATRIX_GRID" },
        ),
      /\[CAT pool\]/,
    );
  });
});

// ─── Runtime matrix completeness ─────────────────────────────────────────────

describe("CAT_QUESTION_TYPE_RUNTIME_MATRIX coverage", () => {
  const EXPECTED_IDS = ["mcq", "sata", "bowtie_trend"] as const;

  it("matrix contains entries for mcq, sata, and bowtie_trend", () => {
    const ids = CAT_QUESTION_TYPE_RUNTIME_MATRIX.map((r) => r.id);
    for (const expected of EXPECTED_IDS) {
      assert.ok(ids.includes(expected), `matrix must include entry id="${expected}"`);
    }
  });

  it("every entry has a non-empty runtimeRenderer field", () => {
    for (const row of CAT_QUESTION_TYPE_RUNTIME_MATRIX) {
      assert.ok(
        typeof row.runtimeRenderer === "string" && row.runtimeRenderer.length > 0,
        `entry id="${row.id}" must have a non-empty runtimeRenderer`,
      );
    }
  });

  it("every entry has at least one questionTypeExample", () => {
    for (const row of CAT_QUESTION_TYPE_RUNTIME_MATRIX) {
      assert.ok(
        Array.isArray(row.questionTypeExamples) && row.questionTypeExamples.length > 0,
        `entry id="${row.id}" must have at least one questionTypeExample`,
      );
    }
  });

  it("unsupported entries have an exclusionReason", () => {
    for (const row of CAT_QUESTION_TYPE_RUNTIME_MATRIX) {
      if (row.runtimeRenderer === "unsupported_fallback") {
        assert.ok(
          typeof row.exclusionReason === "string" && row.exclusionReason.length > 0,
          `unsupported entry id="${row.id}" must document an exclusionReason`,
        );
      }
    }
  });

  it("bowtie_trend entry maps to bowtie renderer (NGN BOWTIE format)", () => {
    const bowEntry = CAT_QUESTION_TYPE_RUNTIME_MATRIX.find((r) => r.id === "bowtie_trend");
    assert.ok(bowEntry !== undefined, "bowtie_trend entry must exist");
    assert.equal(bowEntry!.runtimeRenderer, "bowtie");
    assert.ok(
      bowEntry!.questionTypeExamples.some((t) => /bowtie/i.test(t)),
      "bowtie_trend entry must include a Bowtie type example",
    );
  });
});

// ─── Question type catalog coverage ──────────────────────────────────────────

describe("question type support catalog", () => {
  const SUPPORTED_TYPES: [string, boolean][] = [
    ["mcq", false],
    ["SATA", false],
    ["multiple_choice", false],
    ["SELECT_ALL_THAT_APPLY", false],
  ];

  for (const [type, expectUnsupported] of SUPPORTED_TYPES) {
    it(`practiceRunnerNeedsUnsupportedFallback("${type}", ["a","b"], 2, false) returns ${expectUnsupported}`, () => {
      assert.equal(
        practiceRunnerNeedsUnsupportedFallback(type, ["a", "b"], 2, false),
        expectUnsupported,
      );
    });
  }

  const UNSUPPORTED_TYPES = ["MATRIX", "MATRIX_GRID", "CLOZE", "DRAG_DROP", "ORDERING"] as const;

  for (const type of UNSUPPORTED_TYPES) {
    it(`${type} with structured options requires unsupported fallback`, () => {
      assert.equal(
        practiceRunnerNeedsUnsupportedFallback(type, { rows: [] }, 0, false),
        true,
        `${type} with structured options must use unsupported fallback`,
      );
    });
  }

  it("unsupported type does not throw — returns a defined fallback classification", () => {
    let result: ReturnType<typeof classifyPracticeRunnerPayloadShape> | undefined;
    assert.doesNotThrow(() => {
      result = classifyPracticeRunnerPayloadShape({ complex: true });
    });
    assert.ok(result !== undefined);
    assert.equal(result!.kind, "unsupported_shape");
  });

  it("unknown question type label is flagged as unrecognized (not undefined)", () => {
    // Must not contain any catalog token (mcq, sata, box, tie, etc.)
    const result = runnerQuestionTypeLooksUnrecognized("COMPLETELY_WEIRD_FORMAT_ZZZ");
    assert.equal(typeof result, "boolean");
    assert.equal(result, true);
  });

  it("fill_blank token is recognized by the catalog pattern", () => {
    assert.equal(runnerQuestionTypeLooksUnrecognized("fill_blank"), false);
  });

  it("case_study token is recognized by the catalog pattern", () => {
    assert.equal(runnerQuestionTypeLooksUnrecognized("CASE_STUDY"), false);
  });

  it("drag_drop token is recognized by the catalog pattern", () => {
    assert.equal(runnerQuestionTypeLooksUnrecognized("drag_drop"), false);
  });
});

// ─── Bowtie NGN format constant ───────────────────────────────────────────────

describe("bowtie NGN format routing", () => {
  it("catRunnerRowUsesUnsupportedFallback returns false for a well-formed bowtie payload", () => {
    assert.equal(
      catRunnerRowUsesUnsupportedFallback({
        questionType: "NGN_BOWTIE",
        stem: "A nurse assesses a patient with COPD.",
        options: {
          format: "bowtie",
          bank: [
            { id: "a1", text: "Administer oxygen" },
            { id: "a2", text: "Elevate head of bed" },
            { id: "a3", text: "Obtain IV access" },
            { id: "a4", text: "Notify physician" },
          ],
        },
      }),
      false,
    );
  });

  it("BOWTIE type is never flagged unsupported regardless of options shape", () => {
    assert.equal(
      practiceRunnerNeedsUnsupportedFallback("BOWTIE", {}, 0, true),
      false,
    );
  });

  it("bowtie_trend matrix entry example strings include NGN_BOWTIE", () => {
    const bowEntry = CAT_QUESTION_TYPE_RUNTIME_MATRIX.find((r) => r.id === "bowtie_trend");
    assert.ok(
      bowEntry!.questionTypeExamples.includes("NGN_BOWTIE"),
      "bowtie_trend examples must include 'NGN_BOWTIE'",
    );
  });
});
