import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const boardParts = readFileSync(
  join(root, "src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx"),
  "utf-8",
);
const runner = readFileSync(
  join(root, "src/components/student/practice-test-runner-client.tsx"),
  "utf-8",
);

describe("Practice Exam per-option rationale UI", () => {
  it("extends the shared CAT MCQ option list instead of creating a separate answer system", () => {
    assert.ok(boardParts.includes("PracticeTestMcqRadiogroupOptions"));
    assert.ok(boardParts.includes("AnswerOptionRow"));
    assert.ok(boardParts.includes("state={state}"));
  });

  it("supports desktop side rationales and mobile stacked rationales", () => {
    assert.ok(boardParts.includes("data-nn-practice-option-rationale"));
    assert.ok(boardParts.includes("data-nn-practice-option-rationales"));
    assert.ok(boardParts.includes("md:flex"));
    assert.ok(boardParts.includes("md:flex-[0_0_36%]"));
    assert.ok(boardParts.includes("mt-2"));
  });

  it("uses semantic success and danger treatment for rationale panels", () => {
    assert.ok(boardParts.includes("var(--semantic-success)"));
    assert.ok(boardParts.includes("var(--semantic-danger)"));
    assert.ok(boardParts.includes("var(--semantic-surface)"));
  });

  it("does not invent missing rationale copy inside the option renderer", () => {
    assert.ok(boardParts.includes("optionTeachingMap?.[canonical]?.trim()"));
    assert.ok(!boardParts.includes("No option-specific rationale available"));
  });

  it("keeps CAT exam and SATA/bowtie pathways separate from option-rationale rendering", () => {
    assert.ok(runner.includes("isSata ?"));
    assert.ok(runner.includes("isBowtie && bowtiePayload"));
    assert.ok(runner.includes("catMode"));
  });

  it("wires the live linear MCQ runner to per-option rationales after submit", () => {
    assert.ok(
      runner.includes("optionTeachingMap"),
      "practice-test-runner-client.tsx must pass optionTeachingMap into PracticeTestMcqRadiogroupOptions for live MCQ practice review.",
    );
    assert.ok(
      runner.includes("showOptionTeaching"),
      "practice-test-runner-client.tsx must enable showOptionTeaching after answer commit in linear practice mode.",
    );
    assert.ok(
      runner.includes("linearFeedback?.distractorRationalesMap"),
      "live per-option rationale wiring must consume stored distractorRationalesMap, not invented client copy.",
    );
  });
});
