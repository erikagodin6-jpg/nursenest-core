import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ENTRY_LEVEL_RN_QUESTION_SCOPE,
  normalizePracticeQuestionType,
  practiceQuestionSupportsImmediateRationale,
  resolvePracticeQuestionLayoutMode,
} from "@/lib/practice-tests/practice-question-rendering-engine";

test("normalizes CAT and Next Gen question type aliases", () => {
  assert.equal(normalizePracticeQuestionType("MCQ"), "single");
  assert.equal(normalizePracticeQuestionType("multiple_choice"), "single");
  assert.equal(normalizePracticeQuestionType("SATA"), "multiple");
  assert.equal(normalizePracticeQuestionType("select all that apply"), "multiple");
  assert.equal(normalizePracticeQuestionType("ordered_response"), "ordered");
  assert.equal(normalizePracticeQuestionType("drag-drop"), "ordered");
  assert.equal(normalizePracticeQuestionType("matrix"), "matrix");
  assert.equal(normalizePracticeQuestionType("dropdown"), "cloze");
  assert.equal(normalizePracticeQuestionType("image_selection"), "hotspot");
  assert.equal(normalizePracticeQuestionType("case-study"), "case-study");
  assert.equal(normalizePracticeQuestionType("select-in-passage"), "highlight");
  assert.equal(normalizePracticeQuestionType("trend-chart"), "trend");
  assert.equal(normalizePracticeQuestionType("priority_ranking"), "ranking");
  assert.equal(normalizePracticeQuestionType("clinical judgment"), "clinical-judgment");
});

test("uses parsed bowtie payload as the strongest question type signal", () => {
  assert.equal(normalizePracticeQuestionType("MCQ", true), "bowtie");
});

test("resolves the flashcard split layout only for rationale-enabled study mode", () => {
  assert.equal(
    resolvePracticeQuestionLayoutMode({ splitRationale: true, examStyle: false }),
    "flashcard-split-study",
  );
  assert.equal(
    resolvePracticeQuestionLayoutMode({ splitRationale: true, examStyle: true }),
    "exam-single-pane",
  );
});

test("documents entry-level RN question scope for practice exam content", () => {
  assert.ok(ENTRY_LEVEL_RN_QUESTION_SCOPE.prioritize.includes("patient safety"));
  assert.ok(ENTRY_LEVEL_RN_QUESTION_SCOPE.avoid.includes("advanced ventilator management"));
});

test("defers case-study rationale until the multipart interaction is complete", () => {
  assert.equal(practiceQuestionSupportsImmediateRationale("single"), true);
  assert.equal(practiceQuestionSupportsImmediateRationale("case-study"), false);
});

