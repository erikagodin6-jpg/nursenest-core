/**
 * Run: `npx tsx --test src/lib/content/ai-draft-validation.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { QuestionType } from "@prisma/client";
import { normalizeAiQuestionItem, withQuestionDraftContext } from "./ai-draft-validation";

describe("normalizeAiQuestionItem", () => {
  it("normalizes MCQ with metadata", () => {
    const r = normalizeAiQuestionItem({
      stem: "A nurse is caring for a client with acute hypoxemia. Which action first?",
      type: "mcq",
      options: ["A", "B", "C", "D"],
      correctIndex: 2,
      rationale: "x ".repeat(45),
      tags: ["respiratory", "safety"],
      difficulty: "INTERMEDIATE",
      wrongAnswerRationales: ["w0", "w1", "", "w3"],
      lessonLinkSuggestions: [{ title: "Oxygen therapy", reason: "Aligns with escalation of care" }],
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.value.questionType, QuestionType.MCQ);
    assert.deepEqual(r.value.answerKey, ["C"]);
    assert.equal(r.value.metadata?.difficultyLabel, "INTERMEDIATE");
    assert.equal(r.value.metadata?.wrongAnswerRationales?.length, 4);
  });

  it("normalizes SATA with multiple correct indices", () => {
    const r = normalizeAiQuestionItem({
      stem: "Select all that apply for safe transfusion practice. ".repeat(2),
      type: "sata",
      options: ["Verify identity", "Warm blood in microwave", "Stay with first 15 min", "Skip consent if urgent"],
      correctIndices: [0, 2],
      rationale: "y ".repeat(45),
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.value.questionType, QuestionType.SATA);
    assert.deepEqual(r.value.answerKey, ["Verify identity", "Stay with first 15 min"]);
  });
});

describe("withQuestionDraftContext", () => {
  it("merges pathway labels into metadata", () => {
    const base = normalizeAiQuestionItem({
      stem: "Clinical scenario text here for length. ".repeat(2),
      options: ["a", "b", "c", "d"],
      correctIndex: 0,
      rationale: "z ".repeat(45),
    });
    assert.equal(base.ok, true);
    if (!base.ok) return;
    const w = withQuestionDraftContext(base.value, { pathwayLabel: "FNP", examContextLabel: "NP · US" });
    assert.equal(w.metadata?.pathwayLabel, "FNP");
    assert.equal(w.metadata?.examContextLabel, "NP · US");
  });
});
