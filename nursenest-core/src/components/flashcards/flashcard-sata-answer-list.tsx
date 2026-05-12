"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square, CheckCircle2, XCircle } from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

export type SataOption = {
  letter: string;
  text: string;
};

export type SataRationale = {
  letter: string;
  rationale: string;
  correct: boolean;
};

export type FlashcardSataAnswerListProps = {
  options: SataOption[];
  correctLetters: string[];
  rationaleByLetter?: SataRationale[];
  revealed: boolean;
  answerChoicesHeading?: string;
  revealHint?: string;
  onSelectionsChange?: (letters: string[]) => void;
};

const ROW_BASE =
  "flex w-full min-h-[52px] items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm leading-snug text-[var(--semantic-text-primary)] transition-all duration-150 cursor-pointer select-none";

export function FlashcardSataAnswerList({
  options,
  correctLetters,
  rationaleByLetter = [],
  revealed,
  answerChoicesHeading = "Select all that apply",
  revealHint,
  onSelectionsChange,
}: FlashcardSataAnswerListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const correctSet = new Set(correctLetters);

  useEffect(() => {
    setSelected(new Set());
  }, [options.map((o) => o.letter).join(",")]);

  function toggleLetter(letter: string) {
    if (revealed) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) {
        next.delete(letter);
      } else {
        next.add(letter);
      }
      onSelectionsChange?.([...next]);
      return next;
    });
  }

  function rowClass(letter: string): string {
    if (!revealed) {
      if (selected.has(letter)) {
        return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]`;
      }
      return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_45%,var(--semantic-surface))]`;
    }
    const isCorrect = correctSet.has(letter);
    const wasSelected = selected.has(letter);
    if (isCorrect && wasSelected) {
      return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-success)_60%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))]`;
    }
    if (isCorrect && !wasSelected) {
      return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-warning)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] opacity-80`;
    }
    if (!isCorrect && wasSelected) {
      return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-danger)_50%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))]`;
    }
    return `${ROW_BASE} border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-surface))] opacity-65`;
  }

  const rationaleMap = new Map(rationaleByLetter.map((r) => [r.letter, r]));

  return (
    <div className="nn-flashcard-sata-premium mt-4 space-y-3" data-nn-premium-flashcard-sata>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
        {answerChoicesHeading}
      </p>

      <ul className="space-y-2" aria-label={answerChoicesHeading} role="group">
        {options.map((option) => {
          const isSelected = selected.has(option.letter);
          const isCorrect = correctSet.has(option.letter);
          const rat = rationaleMap.get(option.letter);

          return (
            <li key={option.letter} className="list-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                aria-disabled={revealed}
                onClick={() => toggleLetter(option.letter)}
                className={rowClass(option.letter)}
                data-sata-letter={option.letter}
                data-sata-correct={isCorrect ? "1" : "0"}
                data-sata-selected={isSelected ? "1" : "0"}
              >
                {/* Checkbox icon */}
                <span className="mt-0.5 shrink-0" aria-hidden>
                  {!revealed ? (
                    isSelected ? (
                      <CheckSquare className="h-5 w-5 text-[var(--semantic-brand)]" />
                    ) : (
                      <Square className="h-5 w-5 text-[var(--semantic-text-muted)]" />
                    )
                  ) : isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--semantic-success)]" />
                  ) : (
                    <XCircle className="h-5 w-5 text-[var(--semantic-danger)] opacity-70" />
                  )}
                </span>

                {/* Letter badge */}
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all"
                  style={{
                    borderColor: revealed
                      ? isCorrect
                        ? "var(--semantic-success)"
                        : "var(--semantic-danger)"
                      : isSelected
                        ? "var(--semantic-brand)"
                        : "var(--semantic-border-soft)",
                    background: revealed
                      ? isCorrect
                        ? "color-mix(in srgb, var(--semantic-success) 14%, transparent)"
                        : "transparent"
                      : isSelected
                        ? "color-mix(in srgb, var(--semantic-brand) 10%, transparent)"
                        : "transparent",
                    color: revealed
                      ? isCorrect
                        ? "var(--semantic-success)"
                        : "var(--semantic-text-muted)"
                      : isSelected
                        ? "var(--semantic-brand)"
                        : "var(--semantic-text-secondary)",
                  }}
                  aria-hidden
                >
                  {option.letter}
                </span>

                {/* Text */}
                <FlashcardRichContent
                  text={stripRedundantMcqLetterPrefix(option.text)}
                  className="flex-1 leading-relaxed [&_p]:mb-1 [&_p:last-child]:mb-0"
                />
              </button>

              {/* Rationale (post-reveal) */}
              {revealed && rat ? (
                <p
                  className="mt-1 pl-8 text-xs leading-relaxed text-[var(--semantic-text-secondary)]"
                  data-testid={`sata-rationale-${option.letter}`}
                >
                  <strong className={isCorrect ? "text-[var(--semantic-success)]" : "text-[var(--semantic-danger)]"}>
                    {isCorrect ? "✓ Correct — " : "✗ Incorrect — "}
                  </strong>
                  {rat.rationale}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {!revealed && revealHint ? (
        <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">{revealHint}</p>
      ) : null}
    </div>
  );
}
