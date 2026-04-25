"use client";

import { useState } from "react";

type Card = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string;
  examMicroQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    rationaleCorrect: string;
    rationaleIncorrect: { option: string; rationale: string }[];
    clinicalPearl?: string;
    keyTakeaway?: string;
  } | null;
};

export function ActiveStudySession({
  cards,
}: {
  cards: Card[];
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const card = cards[index];
  const q = card.examMicroQuestion;

  if (!card || !q) {
    return <div className="p-6">No question data available</div>;
  }

  const isCorrect = selected === q.correctIndex;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Progress */}
      <div className="mb-4">
        <div className="text-sm text-gray-500">
          Question {index + 1} of {cards.length}
        </div>
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: QUESTION */}
        <div className="bg-white rounded-2xl shadow p-6 border">
          <h2 className="text-lg font-semibold mb-4">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectAnswer = i === q.correctIndex;

              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-4 rounded-xl border transition
                    ${
                      isSelected
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-blue-400"
                    }
                    ${
                      selected !== null && isCorrectAnswer
                        ? "border-green-500 bg-green-50"
                        : ""
                    }
                  `}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                setIndex((i) => Math.max(i - 1, 0));
                setSelected(null);
              }}
              className="text-sm text-gray-500"
            >
              ← Previous
            </button>

            <button
              onClick={() => {
                setIndex((i) => Math.min(i + 1, cards.length - 1));
                setSelected(null);
              }}
              className="text-sm text-blue-600 font-semibold"
            >
              Next →
            </button>
          </div>
        </div>

        {/* RIGHT: RATIONALE */}
        <div className="bg-white rounded-2xl shadow p-6 border">
          <h3 className="font-semibold mb-4 text-blue-600">
            Rationale & Review
          </h3>

          {selected !== null && (
            <>
              {/* Correct Answer */}
              <div className="bg-blue-50 border rounded-xl p-4 mb-4">
                <div className="text-xs font-semibold text-blue-600 mb-1">
                  CORRECT ANSWER
                </div>
                <div className="font-medium">
                  {q.options[q.correctIndex]}
                </div>
              </div>

              {/* Why Correct */}
              <div className="border rounded-xl p-4 mb-4">
                <div className="font-semibold mb-1 text-sm">
                  Why this is correct
                </div>
                <p className="text-sm text-gray-600">
                  {q.rationaleCorrect}
                </p>
              </div>

              {/* Incorrect */}
              <div className="border rounded-xl p-4 mb-4">
                <div className="font-semibold text-sm mb-2">
                  Why other options are incorrect
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {q.rationaleIncorrect.map((d, i) => (
                    <div key={i}>
                      <span className="font-medium">{d.option}</span>:{" "}
                      {d.rationale}
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Pearl */}
              {q.clinicalPearl && (
                <div className="bg-yellow-50 border rounded-xl p-4 mb-4">
                  <div className="font-semibold text-sm mb-1">
                    Clinical Pearl
                  </div>
                  <p className="text-sm text-gray-600">
                    {q.clinicalPearl}
                  </p>
                </div>
              )}

              {/* Key Takeaway */}
              {q.keyTakeaway && (
                <div className="bg-blue-50 border rounded-xl p-4">
                  <div className="font-semibold text-sm mb-1">
                    Key Takeaway
                  </div>
                  <p className="text-sm text-gray-600">
                    {q.keyTakeaway}
                  </p>
                </div>
              )}
            </>
          )}

          {selected === null && (
            <div className="text-sm text-gray-400">
              Select an answer to view rationale
            </div>
          )}
        </div>
      </div>
    </div>
  );
}