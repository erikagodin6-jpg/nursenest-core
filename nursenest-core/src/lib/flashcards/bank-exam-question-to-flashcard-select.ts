import type { Prisma } from "@prisma/client";
import { FlashcardItemKind } from "@prisma/client";
import type { ExamQuestionMcqRow } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { examRowToLessonBankItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { buildDistractorNotes } from "@/lib/questions/distractor-notes";
import {
  correctAnswerLine,
  parseExamMicroQuestionFromDbFields,
} from "@/lib/flashcards/flashcard-exam-style";
import type { FlashcardStudySelectRow } from "@/lib/flashcards/flashcard-study-serialize";

/** Extra bank fields used to build NCLEX-style micro questions for flashcard study. */
export type BankExamRowForFlashcard = ExamQuestionMcqRow & {
  distractorRationales?: Prisma.JsonValue | null;
  incorrectAnswerRationale?: Prisma.JsonValue | null;
  correctAnswerExplanation?: string | null;
};

/**
 * Maps a subscriber-accessible `ExamQuestion` row into the narrow shape consumed by
 * {@link serializeFlashcardForCustomSession} when `examItemKind` + micro fields validate.
 */
export function bankExamQuestionRowToFlashcardStudySelectRow(row: BankExamRowForFlashcard): FlashcardStudySelectRow | null {
  const item = examRowToLessonBankItem(row);
  if (!item) return null;

  const letters = item.options.map((_, i) => String.fromCharCode(65 + i));
  const answerOptions = item.options.map((text, i) => ({
    letter: letters[i]!,
    text: String(text ?? "").trim(),
  }));
  const correctLetter = letters[item.correct];
  if (!correctLetter) return null;

  const correctOptionText = String(item.options[item.correct] ?? "").trim();
  const distractorRows = buildDistractorNotes(
    item.options.map((t) => String(t)),
    correctOptionText ? [correctOptionText] : [],
    row.distractorRationales ?? null,
    row.incorrectAnswerRationale ?? null,
  );
  const rationaleIncorrect = letters
    .filter((l) => l !== correctLetter)
    .map((letter) => {
      const idx = letters.indexOf(letter);
      const optText = String(item.options[idx] ?? "").trim();
      const hit =
        distractorRows.find((d) => d.label === letter) ??
        distractorRows.find((d) => d.label === optText);
      const rationale =
        hit?.whyWrong?.trim() ||
        "This option does not address the priority assessment or intervention implied by the stem.";
      return { letter, rationale };
    });

  const rationaleCorrectRaw = [row.rationale, row.correctAnswerExplanation, item.rationale]
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .find((x) => x.length >= 8);
  const rationaleCorrect =
    rationaleCorrectRaw && rationaleCorrectRaw.length >= 8
      ? rationaleCorrectRaw
      : "Review client assessment findings, safety risks, and the highest-priority nursing action before selecting an option.";

  const exam = parseExamMicroQuestionFromDbFields({
    examItemKind: FlashcardItemKind.CLINICAL,
    questionStem: item.question,
    answerOptions: answerOptions as unknown as Prisma.JsonValue,
    correctAnswer: correctLetter,
    rationaleCorrect,
    rationaleIncorrect: rationaleIncorrect as unknown as Prisma.JsonValue,
  });
  if (!exam) return null;

  return {
    id: row.id,
    front: exam.questionStem,
    back: correctAnswerLine(exam),
    sourceKey: `exam_q:${row.id}`,
    examItemKind: exam.itemKind,
    questionStem: exam.questionStem,
    answerOptions: exam.answerOptions as unknown as Prisma.JsonValue,
    correctAnswer: exam.correctLetter,
    rationaleCorrect: exam.rationaleCorrect,
    rationaleIncorrect: exam.rationaleIncorrect as unknown as Prisma.JsonValue,
    category: { name: "", topicCode: null },
    deck: { pathwayId: null },
  };
}
