"use client";

import { useMemo, useState } from "react";

type CustomStudyCard = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string | null;
  examMicroQuestion?: {
    question?: string;
    questionStem?: string;
    options?: string[];
    answerOptions?: Array<{ letter: string; text: string }>;
    correctIndex?: number;
    correctLetter?: string;
    rationaleCorrect?: string;
    rationaleIncorrect?: Array<{ option?: string; letter?: string; rationale: string }>;
    clinicalPearl?: string;
    keyTakeaway?: string;
  } | null;
};

type FlashcardCustomStudyClientProps = {
  cards?: CustomStudyCard[];
};

function getQuestionText(card: CustomStudyCard): string {
  return card.examMicroQuestion?.questionStem ?? card.examMicroQuestion?.question ?? card.prompt ?? "Question unavailable";
}

function getOptions(card: CustomStudyCard): Array<{ label: string; text: string; index: number }> {
  const exam = card.examMicroQuestion;

  if (exam?.answerOptions?.length) {
    return exam.answerOptions.map((option, index) => ({
      label: option.letter,
      text: option.text,
      index,
    }));
  }

  if (exam?.options?.length) {
    return exam.options.map((text, index) => ({
      label: String.fromCharCode(65 + index),
      text,
      index,
    }));
  }

  return [];
}

function getCorrectIndex(card: CustomStudyCard, options: Array<{ label: string; text: string; index: number }>): number | null {
  const exam = card.examMicroQuestion;

  if (typeof exam?.correctIndex === "number") return exam.correctIndex;

  if (exam?.correctLetter) {
    const found = options.find((option) => option.label === exam.correctLetter);
    return found?.index ?? null;
  }

  return null;
}

export function FlashcardCustomStudyClient({ cards = [] }: FlashcardCustomStudyClientProps) {
  const safeCards = useMemo(() => cards.filter((card) => card?.id), [cards]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const card = safeCards[index] ?? null;
  const options = card ? getOptions(card) : [];
  const correctIndex = card ? getCorrectIndex(card, options) : null;
  const selectedIsCorrect = selected !== null && correctIndex !== null && selected === correctIndex;

  if (!card) {
    return (
      <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-6 text-sm text-[var(--theme-muted-text)]">
        No custom study cards are available yet.
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-4">
        <div className="text-sm text-gray-500">
          Question {index + 1} of {safeCards.length}
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${((index + 1) / Math.max(1, safeCards.length)) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">{getQuestionText(card)}</h2>

          {options.length > 0 ? (
            <div className="space-y-3">
              {options.map((option) => {
                const isSelected = selected === option.index;
                const isCorrectAnswer = correctIndex === option.index;

                return (
                  <button
                    key={`${option.label}-${option.index}`}
                    type="button"
                    onClick={() => setSelected(option.index)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? selectedIsCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-blue-400"
                    } ${selected !== null && isCorrectAnswer ? "border-green-500 bg-green-50" : ""}`}
                  >
                    <span className="mr-2 font-medium">{option.label}.</span>
                    {option.text}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              {card.answer}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => {
                setIndex((i) => Math.max(i - 1, 0));
                setSelected(null);
              }}
              disabled={index === 0}
              className="text-sm text-gray-500 disabled:opacity-40"
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={() => {
                setIndex((i) => Math.min(i + 1, safeCards.length - 1));
                setSelected(null);
              }}
              disabled={index >= safeCards.length - 1}
              className="text-sm font-semibold text-blue-600 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow">
          <h3 className="mb-4 font-semibold text-blue-600">Rationale & Review</h3>

          {selected !== null || options.length === 0 ? (
            <>
              <div className="mb-4 rounded-xl border bg-blue-50 p-4">
                <div className="mb-1 text-xs font-semibold text-blue-600">CORRECT ANSWER</div>
                <div className="font-medium">
                  {correctIndex !== null ? options[correctIndex]?.text ?? card.answer : card.answer}
                </div>
              </div>

              <div className="mb-4 rounded-xl border p-4">
                <div className="mb-1 text-sm font-semibold">Why this is correct</div>
                <p className="text-sm text-gray-600">
                  {card.examMicroQuestion?.rationaleCorrect ?? card.explanation ?? "Review the answer and related lesson content."}
                </p>
              </div>

              {card.examMicroQuestion?.rationaleIncorrect?.length ? (
                <div className="mb-4 rounded-xl border p-4">
                  <div className="mb-2 text-sm font-semibold">Why other options are incorrect</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {card.examMicroQuestion.rationaleIncorrect.map((row, i) => (
                      <div key={`${row.option ?? row.letter ?? i}`}>
                        <span className="font-medium">{row.option ?? row.letter ?? String.fromCharCode(65 + i)}</span>:{" "}
                        {row.rationale}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {card.examMicroQuestion?.clinicalPearl ? (
                <div className="mb-4 rounded-xl border bg-yellow-50 p-4">
                  <div className="mb-1 text-sm font-semibold">Clinical Pearl</div>
                  <p className="text-sm text-gray-600">{card.examMicroQuestion.clinicalPearl}</p>
                </div>
              ) : null}

              {card.examMicroQuestion?.keyTakeaway ? (
                <div className="rounded-xl border bg-blue-50 p-4">
                  <div className="mb-1 text-sm font-semibold">Key Takeaway</div>
                  <p className="text-sm text-gray-600">{card.examMicroQuestion.keyTakeaway}</p>
                </div>
              ) : null}
            </>
          ) : (
            <div className="text-sm text-gray-400">Select an answer to view rationale.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export { FlashcardCustomStudyClient as ActiveStudySession };