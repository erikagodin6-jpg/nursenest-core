"use client";

import { useEffect, useState } from "react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

type PromptImageSplit = {
  imageHtml: string | null;
  remainingPrompt: string;
};

export function splitPromptLeadingImage(prompt: string | null | undefined): PromptImageSplit {
  const raw = String(prompt ?? "").trim();

  if (!raw) {
    return { imageHtml: null, remainingPrompt: "" };
  }

  const leadingImageMatch = raw.match(/^<img\b[^>]*>\s*/i);

  if (!leadingImageMatch) {
    return { imageHtml: null, remainingPrompt: raw };
  }

  return {
    imageHtml: leadingImageMatch[0].trim(),
    remainingPrompt: raw.slice(leadingImageMatch[0].length).trim(),
  };
}

export function firstTeachingLine(text: string | null | undefined): string {
  const raw = String(text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) return "";

  const sentenceMatch = raw.match(/^(.+?[.!?])(\s|$)/);
  return sentenceMatch?.[1]?.trim() ?? raw;
}

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

    const id = requestAnimationFrame(() => onReveal?.());
    return () => cancelAnimationFrame(id);
  }, [pickedLetter, revealed, tutorMcq, exam, onReveal]);

  const correctOptionText = exam
    ? stripRedundantMcqLetterPrefix(
        exam.answerOptions.find((o: any) => o.letter === exam.correctLetter)?.text ?? "",
      )
    : "";

  function commitPick(letter: string) {
    if (revealed || !exam || !tutorMcq) return;
    setPickedLetter(letter);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border bg-white p-6 shadow">
        <div className="mb-3 text-xs uppercase text-gray-400">{sessionModeLabel}</div>

        {topicLine ? <div className="mb-2 text-sm text-gray-500">{topicLine}</div> : null}

        {itemKindCaption ? (
          <div className="mb-3 inline-block rounded-full border bg-blue-50 px-2 py-1 text-xs text-blue-600">
            {itemKindCaption}
          </div>
        ) : null}

        <div className="mb-4 text-lg font-semibold">
          <FlashcardRichContent text={String(prompt ?? "")} />
        </div>

        {exam ? (
          <FlashcardExamMcqAnswerList
            exam={exam}
            revealed={revealed}
            pickedLetter={pickedLetter}
            tutorMcq={tutorMcq}
            answerChoicesHeading={labels?.answerChoicesHeading ?? "Answer choices"}
            revealHint={labels?.revealHint ?? "Choose an answer to reveal the rationale."}
            onPickLetter={commitPick}
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow">
        {!revealed ? (
          <div className="py-10 text-center text-sm text-gray-400">
            {labels?.revealHint ?? "Reveal the answer to review the rationale."}
          </div>
        ) : (
          <>
            <div className="rounded-xl border bg-green-50 p-4">
              <div className="mb-1 text-xs font-bold uppercase text-green-600">
                {labels?.answerHeading ?? "Answer"}
              </div>

              <div className="flex items-start gap-2">
                {exam?.correctLetter ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                    {exam.correctLetter}
                  </span>
                ) : null}

                <span className="text-sm font-medium">{correctOptionText || answer}</span>
              </div>
            </div>

            {explanation ? (
              <div className="rounded-xl border p-4">
                <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                  {labels?.whyCorrectHeading ?? "Why this is correct"}
                </div>
                <FlashcardRichContent text={String(explanation)} />
              </div>
            ) : null}

            {exam?.rationaleIncorrect?.length ? (
              <div className="rounded-xl border p-4">
                <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                  {labels?.whyIncorrectHeading ?? "Why the others are incorrect"}
                </div>

                <div className="space-y-2 text-sm">
                  {exam.rationaleIncorrect.map((r: any) => (
                    <div key={r.letter}>
                      <strong>{r.letter}</strong>: {r.rationale}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {pearl ? (
              <div className="rounded-xl border bg-yellow-50 p-4">
                <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
                  {labels?.takeawayHeading ?? "Clinical pearl"}
                </div>
                <FlashcardRichContent text={String(pearl)} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}