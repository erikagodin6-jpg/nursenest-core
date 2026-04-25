"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Lightbulb, X } from "lucide-react";
import { FlashcardRichContent, flashcardTextMayContainMarkup } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

export function FlashcardStudyQuestionStack({
  sessionModeLabel,
  topicLine,
  examMicroQuestion = null,
  itemKindCaption = null,
  prompt,
  answer,
  explanation,
  pearl,
  revealed,
  onReveal,
  mcqInteractionMode,
  labels,
}: any) {
  const exam = examMicroQuestion;
  const tutorMcq = Boolean(exam && (mcqInteractionMode ?? "tutor_select") === "tutor_select");

  const [pickedLetter, setPickedLetter] = useState<string | null>(null);

  useEffect(() => {
    setPickedLetter(null);
  }, [exam?.questionStem, prompt]);

  useEffect(() => {
    if (!pickedLetter || revealed || !tutorMcq || !exam) return;
    const id = requestAnimationFrame(() => onReveal());
    return () => cancelAnimationFrame(id);
  }, [pickedLetter, revealed, tutorMcq, exam, onReveal]);

  const correctOptionText = exam
    ? stripRedundantMcqLetterPrefix(
        exam.answerOptions.find((o) => o.letter === exam.correctLetter)?.text ?? ""
      )
    : "";

  function commitPick(letter: string) {
    if (revealed || !exam || !tutorMcq) return;
    setPickedLetter(letter);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] max-w-6xl mx-auto">

      {/* LEFT PANEL */}
      <div className="bg-white rounded-2xl shadow p-6 border">

        <div className="mb-3 text-xs uppercase text-gray-400">
          {sessionModeLabel}
        </div>

        {topicLine && (
          <div className="text-sm text-gray-500 mb-2">{topicLine}</div>
        )}

        {itemKindCaption && (
          <div className="inline-block mb-3 text-xs px-2 py-1 rounded-full bg-blue-50 border text-blue-600">
            {itemKindCaption}
          </div>
        )}

        {/* QUESTION */}
        <div className="text-lg font-semibold mb-4">
          <FlashcardRichContent text={prompt} />
        </div>

        {/* OPTIONS */}
        {exam && (
          <FlashcardExamMcqAnswerList
            exam={exam}
            revealed={revealed}
            pickedLetter={pickedLetter}
            tutorMcq={tutorMcq}
            answerChoicesHeading={labels.answerChoicesHeading}
            revealHint={labels.revealHint}
            onPickLetter={commitPick}
          />
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white rounded-2xl shadow p-6 border flex flex-col gap-4">

        {!revealed ? (
          <div className="text-sm text-gray-400 text-center py-10">
            {labels.revealHint}
          </div>
        ) : (
          <>
            {/* CORRECT ANSWER */}
            <div className="bg-green-50 border rounded-xl p-4">
              <div className="text-xs uppercase text-green-600 font-bold mb-1">
                {labels.answerHeading}
              </div>

              <div className="flex items-start gap-2">
                <span className="bg-green-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                  {exam?.correctLetter}
                </span>

                <span className="text-sm font-medium">
                  {correctOptionText || answer}
                </span>
              </div>
            </div>

            {/* WHY CORRECT */}
            {explanation && (
              <div className="border rounded-xl p-4">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-1">
                  {labels.whyCorrectHeading}
                </div>
                <FlashcardRichContent text={explanation} />
              </div>
            )}

            {/* WHY INCORRECT */}
            {exam && (
              <div className="border rounded-xl p-4">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                  {labels.whyIncorrectHeading}
                </div>

                <div className="space-y-2 text-sm">
                  {exam.rationaleIncorrect.map((r) => (
                    <div key={r.letter}>
                      <strong>{r.letter}</strong>: {r.rationale}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CLINICAL PEARL */}
            {pearl && (
              <div className="bg-yellow-50 border rounded-xl p-4">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-1">
                  {labels.takeawayHeading}
                </div>
                <FlashcardRichContent text={pearl} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}