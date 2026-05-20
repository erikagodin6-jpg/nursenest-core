import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FlashcardItemKind } from "@prisma/client";
import { flashcardExamMcqOptionClass, optionLetterCircleClass } from "@/components/flashcards/flashcard-exam-mcq-styles";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

const exam: ExamMicroQuestionPayload = {
  itemKind: FlashcardItemKind.CLINICAL,
  questionStem: "Stem",
  answerOptions: [
    { letter: "A", text: "One" },
    { letter: "B", text: "Two" },
    { letter: "C", text: "Three" },
    { letter: "D", text: "Four" },
  ],
  correctLetter: "B",
  rationaleCorrect: "Because B is correct for the scenario described.",
  rationaleIncorrect: [
    { letter: "A", rationale: "Not first." },
    { letter: "C", rationale: "Not first." },
    { letter: "D", rationale: "Not first." },
  ],
};

describe("flashcardExamMcqOptionClass", () => {
  it("unanswered interactive row is neutral with hover token", () => {
    const c = flashcardExamMcqOptionClass({
      letter: "A",
      exam,
      revealed: false,
      pickedLetter: null,
      interactive: true,
    });
    assert.match(c, /hover:/);
    assert.ok(!c.includes("semantic-success") && !c.includes("semantic-danger"));
  });

  it("selected-before-reveal uses brand tint, not success/danger", () => {
    const c = flashcardExamMcqOptionClass({
      letter: "C",
      exam,
      revealed: false,
      pickedLetter: "C",
      interactive: true,
    });
    assert.match(c, /semantic-brand/);
    assert.ok(!c.includes("semantic-success") && !c.includes("semantic-danger"));
  });

  it("revealed correct row uses success", () => {
    const c = flashcardExamMcqOptionClass({
      letter: "B",
      exam,
      revealed: true,
      pickedLetter: "C",
      interactive: false,
    });
    assert.match(c, /semantic-success/);
  });

  it("revealed incorrect pick uses danger", () => {
    const c = flashcardExamMcqOptionClass({
      letter: "C",
      exam,
      revealed: true,
      pickedLetter: "C",
      interactive: false,
    });
    assert.match(c, /semantic-danger/);
  });
});

describe("optionLetterCircleClass", () => {
  it("stays aligned with row: selected-before-reveal uses brand", () => {
    const c = optionLetterCircleClass({
      letter: "D",
      exam,
      revealed: false,
      pickedLetter: "D",
      interactive: true,
    });
    assert.match(c, /semantic-brand/);
  });
});
