import test from "node:test";
import assert from "node:assert/strict";

import {
  bankExamQuestionRowToFlashcardStudySelectRow,
} from "@/lib/flashcards/bank-exam-question-to-flashcard-select";

test(
  "bankExamQuestionRowToFlashcardStudySelectRow: maps MCQ row to exam-style flashcard select shape",
  () => {
    const row = {
      id: "q-test-1",

      stem:
        "A client with heart failure has new crackles and dyspnea. Which action is priority?",

      options: [
        {
          letter: "A",
          text: "Increase oral fluid intake",
        },
        {
          letter: "B",
          text:
            "Assess oxygenation and notify provider per protocol",
        },
        {
          letter: "C",
          text:
            "Ambulate the client independently",
        },
        {
          letter: "D",
          text:
            "Hold all cardiac medications",
        },
      ],

      correctAnswer: "B",

      questionType: "MCQ",

      rationale:
        "Crackles and dyspnea suggest fluid overload and impaired gas exchange; assessing oxygenation and escalating per severity is the priority nursing action.",

      distractorRationales: null,
      incorrectAnswerRationale: null,
      correctAnswerExplanation: null,
    };

    const out =
      bankExamQuestionRowToFlashcardStudySelectRow(
        row,
      );

    assert.ok(out);

    assert.equal(out?.id, "q-test-1");

    assert.ok(
      out?.questionStem?.includes(
        "heart failure",
      ),
    );

    assert.ok(
      typeof out?.rationaleCorrect ===
        "string" &&
        out.rationaleCorrect.length >= 8,
    );
  },
);

test(
  "bankExamQuestionRowToFlashcardStudySelectRow: returns null for SATA",
  () => {
    const row = {
      id: "q-sata",

      stem:
        "Select all that apply for sepsis screening.",

      options: [
        "A",
        "B",
        "C",
        "D",
      ],

      correctAnswer: ["0", "1"],

      questionType: "SATA",

      rationale: "SATA example",
    };

    assert.equal(
      bankExamQuestionRowToFlashcardStudySelectRow(
        row,
      ),
      null,
    );
  },
);

test(
  "bankExamQuestionRowToFlashcardStudySelectRow: returns null for malformed row",
  () => {
    const row = {
      id: "",
      stem: null,
      options: null,
      correctAnswer: null,
      questionType: "MCQ",
      rationale: null,
    };

    assert.doesNotThrow(() => {
      bankExamQuestionRowToFlashcardStudySelectRow(
        row as never,
      );
    });
  },
);

test(
  "bankExamQuestionRowToFlashcardStudySelectRow: tolerates missing rationale fields",
  () => {
    const row = {
      id: "q-test-2",

      stem:
        "A nurse assesses a client with atrial fibrillation.",

      options: [
        {
          letter: "A",
          text: "Prepare for synchronized cardioversion",
        },
      ],

      correctAnswer: "A",

      questionType: "MCQ",

      rationale: "",

      distractorRationales: undefined,
      incorrectAnswerRationale: undefined,
      correctAnswerExplanation: undefined,
    };

    assert.doesNotThrow(() => {
      bankExamQuestionRowToFlashcardStudySelectRow(
        row as never,
      );
    });
  },
);