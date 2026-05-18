"use client";

import { useMemo, useState } from "react";
import type { AnswerOptionState } from "@/components/study/cat-question-card";
import { AnswerOptionRow } from "@/components/study/cat-question-card";

type CheckpointOption = {
  id: string;
  label: string;
  rationale: string;
};

export type PreNursingLessonCheckpointCardProps = {
  conceptId: string;
  eyebrow?: string;
  title?: string;
  stem: string;
  options: CheckpointOption[];
  correctOptionId: string;
  clinicalRelevance?: string;
  memoryAnchor?: string;
  misconceptionNote?: string;
  onAnswered?: (event: {
    conceptId: string;
    selectedOptionId: string;
    correct: boolean;
  }) => void;
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function PreNursingLessonCheckpointCard({
  conceptId,
  eyebrow = "Interactive checkpoint",
  title = "Check your understanding",
  stem,
  options,
  correctOptionId,
  clinicalRelevance,
  memoryAnchor,
  misconceptionNote,
  onAnswered,
}: PreNursingLessonCheckpointCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const answered = selectedOptionId != null;
  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedOptionId) ?? null,
    [options, selectedOptionId],
  );
  const correctOption = useMemo(
    () => options.find((option) => option.id === correctOptionId) ?? null,
    [options, correctOptionId],
  );
  const isCorrect = selectedOptionId === correctOptionId;

  function optionState(optionId: string): AnswerOptionState {
    if (!answered) return selectedOptionId === optionId ? "selected" : "default";
    if (optionId === correctOptionId) return "correct";
    if (optionId === selectedOptionId) return "incorrect";
    return "dim";
  }

  function handleSelect(optionId: string) {
    if (answered) return;
    setSelectedOptionId(optionId);
    onAnswered?.({
      conceptId,
      selectedOptionId: optionId,
      correct: optionId === correctOptionId,
    });
  }

  return (
    <section
      className="my-8 rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      data-prenursing-lesson-checkpoint=""
      data-concept-id={conceptId}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
            {eyebrow}
          </p>
          <h3 className="m-0 text-[1.05rem] font-bold tracking-[-0.015em] text-[var(--theme-heading-text)] sm:text-[1.18rem]">
            {title}
          </h3>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{
            borderColor: "var(--semantic-border-soft)",
            color: "var(--semantic-text-muted)",
            background: "color-mix(in srgb, var(--semantic-panel-muted) 30%, var(--semantic-surface))",
          }}
        >
          Low-stakes practice
        </span>
      </div>

      <p className="mb-5 text-[0.98rem] leading-[1.65] text-[var(--semantic-text-primary)]">
        {stem}
      </p>

      <ul className="nn-cat-opt-list" role="radiogroup" aria-label={stem}>
        {options.map((option, index) => (
          <li key={option.id}>
            <div className="md:flex md:items-stretch md:gap-3">
              <div className="min-w-0 flex-1">
                <AnswerOptionRow
                  letter={OPTION_LETTERS[index] ?? String(index + 1)}
                  text={option.label}
                  state={optionState(option.id)}
                  disabled={answered}
                  onClick={() => handleSelect(option.id)}
                />
              </div>
              {answered && (option.id === selectedOptionId || option.id === correctOptionId) ? (
                <LessonOptionRationale
                  state={optionState(option.id)}
                  title={option.id === correctOptionId ? "Why this is correct" : "Why this was tempting"}
                  text={option.rationale}
                />
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {answered ? (
        <div
          className="mt-5 rounded-xl border px-4 py-3"
          data-prenursing-checkpoint-feedback=""
          style={{
            borderColor: isCorrect
              ? "color-mix(in srgb, var(--semantic-success) 32%, var(--semantic-border-soft))"
              : "color-mix(in srgb, var(--semantic-danger) 28%, var(--semantic-border-soft))",
            background: isCorrect
              ? "color-mix(in srgb, var(--semantic-success) 7%, var(--semantic-surface))"
              : "color-mix(in srgb, var(--semantic-danger) 5%, var(--semantic-surface))",
          }}
        >
          <p
            className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: isCorrect ? "var(--semantic-success)" : "var(--semantic-danger)" }}
          >
            {isCorrect ? "Nice work" : "Let’s strengthen this concept"}
          </p>
          <p className="m-0 text-sm leading-[1.6] text-[var(--semantic-text-secondary)]">
            {isCorrect
              ? selectedOption?.rationale
              : selectedOption?.rationale ?? correctOption?.rationale}
          </p>
          {clinicalRelevance ? (
            <p className="mt-3 text-sm leading-[1.6] text-[var(--semantic-text-primary)]">
              <strong>Why this matters in nursing:</strong> {clinicalRelevance}
            </p>
          ) : null}
          {memoryAnchor ? (
            <p className="mt-2 text-sm leading-[1.6] text-[var(--semantic-text-secondary)]">
              <strong>Memory anchor:</strong> {memoryAnchor}
            </p>
          ) : null}
          {!isCorrect && misconceptionNote ? (
            <p className="mt-2 text-sm leading-[1.6] text-[var(--semantic-text-secondary)]">
              <strong>Common beginner trap:</strong> {misconceptionNote}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function LessonOptionRationale({
  state,
  title,
  text,
}: {
  state: AnswerOptionState;
  title: string;
  text: string;
}) {
  const isCorrect = state === "correct";
  const isIncorrect = state === "incorrect";
  return (
    <aside
      className="mt-2 rounded-lg border px-3 py-2 text-[12.5px] leading-[1.5] md:mt-0 md:min-w-[17.5rem] md:max-w-[24rem] md:flex-[0_0_36%]"
      data-prenursing-option-rationale=""
      style={{
        borderColor: isCorrect
          ? "color-mix(in srgb, var(--semantic-success) 28%, var(--semantic-border-soft))"
          : isIncorrect
            ? "color-mix(in srgb, var(--semantic-danger) 24%, var(--semantic-border-soft))"
            : "var(--semantic-border-soft)",
        background: isCorrect
          ? "color-mix(in srgb, var(--semantic-success) 7%, var(--semantic-surface))"
          : isIncorrect
            ? "color-mix(in srgb, var(--semantic-danger) 6%, var(--semantic-surface))"
            : "var(--semantic-surface)",
        color: "var(--semantic-text-secondary)",
      }}
    >
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
        {title}
      </p>
      <p className="m-0">{text}</p>
    </aside>
  );
}
