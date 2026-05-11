import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertCatCompleteRowRenderableOrThrow,
  catRunnerRowUsesUnsupportedFallback,
} from "@/lib/questions/cat-runner-renderer-coverage";

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
