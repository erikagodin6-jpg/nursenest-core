import test from "node:test";
import assert from "node:assert/strict";
import { FlashcardItemKind } from "@prisma/client";
import { parseExamMicroQuestionFromDbFields, validateExamMicroQuestionInput } from "@/lib/flashcards/flashcard-exam-style";

test("parseExamMicroQuestionFromDbFields accepts a valid 4-option card", () => {
  const payload = parseExamMicroQuestionFromDbFields({
    examItemKind: FlashcardItemKind.CLINICAL,
    questionStem: "A nurse is caring for a client receiving IV potassium chloride. Which action should the nurse take first if the client reports burning at the IV site?",
    answerOptions: [
      { letter: "A", text: "Slow the infusion rate" },
      { letter: "B", text: "Stop the infusion and assess the site" },
      { letter: "C", text: "Apply a warm compress and continue" },
      { letter: "D", text: "Flush the line with normal saline" },
    ],
    correctAnswer: "B",
    rationaleCorrect: "Stopping the infusion and assessing the site is the priority safety action before other interventions.",
    rationaleIncorrect: [
      { letter: "A", rationale: "Slowing the rate delays removal of a possible irritant when infiltration is suspected." },
      { letter: "C", rationale: "Warm compresses do not replace assessment and may mask worsening injury." },
      { letter: "D", rationale: "Flushing can worsen tissue exposure if infiltration is present." },
    ],
  });
  assert.ok(payload);
  assert.equal(payload!.correctLetter, "B");
  assert.equal(payload!.answerOptions.length, 4);
  assert.equal(payload!.rationaleIncorrect.length, 3);
});

test("parseExamMicroQuestionFromDbFields rejects fewer than 3 options", () => {
  const payload = parseExamMicroQuestionFromDbFields({
    examItemKind: FlashcardItemKind.RECALL,
    questionStem: "Which of the following is most accurate regarding hand hygiene?",
    answerOptions: [
      { letter: "A", text: "Alcohol rub is acceptable when hands are not visibly soiled" },
      { letter: "B", text: "Soap and water are never needed" },
    ],
    correctAnswer: "A",
    rationaleCorrect: "Alcohol-based hand rub is effective when hands are not visibly soiled.",
    rationaleIncorrect: [{ letter: "B", rationale: "Soap and water are required when hands are visibly dirty." }],
  });
  assert.equal(payload, null);
});

test("validateExamMicroQuestionInput mirrors parser", () => {
  const v = validateExamMicroQuestionInput({
    examItemKind: FlashcardItemKind.PRIORITY,
    questionStem: "Which client should the nurse assess first in a busy med-surg unit?",
    answerOptions: [
      { letter: "A", text: "Stable post-op awaiting discharge" },
      { letter: "B", text: "New onset confusion with dropping oxygen saturation" },
      { letter: "C", text: "Chronic pain 3/10 after scheduled analgesic" },
    ],
    correctAnswer: "B",
    rationaleCorrect: "Airway and oxygenation threats plus acute mental status change represent the highest risk.",
    rationaleIncorrect: [
      { letter: "A", rationale: "Stable findings are lower priority than acute deterioration." },
      { letter: "C", rationale: "Controlled chronic pain is lower priority than acute physiological compromise." },
    ],
  });
  assert.equal(v.ok, true);
});
