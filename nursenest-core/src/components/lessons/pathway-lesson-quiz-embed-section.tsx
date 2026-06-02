"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, CircleCheck, CircleX, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EmbedQuestion } from "@/lib/lessons/lesson-quiz-embeds";
import { resolveQuizEmbedQuestionsForLessonSlug } from "@/lib/lessons/lesson-quiz-embeds";

export type PathwayLessonQuizEmbedLinks = {
  practiceExamsHref: string;
  flashcardsHref: string;
  practiceQuestionsHref: string;
  relatedLessonsHref: string;
};

type PerQuestion = { selected: number | null; revealed: boolean };

export function PathwayLessonQuizEmbedSection({
  lessonSlug,
  links,
  className,
}: {
  lessonSlug: string;
  links: PathwayLessonQuizEmbedLinks;
  className?: string;
}) {
  const questions = useMemo(
    () => resolveQuizEmbedQuestionsForLessonSlug(lessonSlug),
    [lessonSlug],
  );
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [rows, setRows] = useState<PerQuestion[]>(() =>
    questions?.length ? questions.map(() => ({ selected: null, revealed: false })) : [],
  );

  useEffect(() => {
    if (!questions?.length) return;
    setRows(questions.map(() => ({ selected: null, revealed: false })));
  }, [lessonSlug, questions]);

  const setSelected = useCallback((qi: number, oi: number) => {
    setRows((prev) => {
      const next = [...prev];
      const cur = next[qi];
      if (!cur || cur.revealed) return prev;
      next[qi] = { ...cur, selected: oi };
      return next;
    });
  }, []);

  const reveal = useCallback((qi: number) => {
    setRows((prev) => {
      const next = [...prev];
      const cur = next[qi];
      if (!cur || cur.selected === null || cur.revealed) return prev;
      next[qi] = { ...cur, revealed: true };
      return next;
    });
  }, []);

  const scrollToNext = useCallback((qi: number) => {
    const el = itemRefs.current[qi + 1];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      el?.querySelector<HTMLButtonElement>("button[data-quiz-option]")?.focus();
    } catch {
      /* ignore */
    }
  }, []);

  if (!questions?.length) return null;

  return (
    <section
      className={cn(
        "mt-10 max-w-5xl rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)]",
        "bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,transparent)] p-5 sm:p-7 shadow-sm",
        className,
      )}
      aria-labelledby="pathway-lesson-quiz-embed-heading"
      data-testid="pathway-lesson-quiz-embed"
    >
      <div className="mb-6 flex flex-wrap items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,transparent)]"
          aria-hidden
        >
          <ClipboardList className="h-5 w-5 text-[var(--semantic-info)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id="pathway-lesson-quiz-embed-heading"
            className="text-lg font-semibold tracking-tight text-[var(--theme-foreground)] sm:text-xl"
          >
            Practice questions
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--theme-muted-text)]">
            Active recall — check each answer, read the rationale, then move on when you are ready.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {questions.map((q, qi) => (
          <QuizEmbedQuestionCard
            key={qi}
            cardRef={(el) => {
              itemRefs.current[qi] = el;
            }}
            index={qi}
            total={questions.length}
            q={q}
            state={rows[qi] ?? { selected: null, revealed: false }}
            onSelect={(oi) => setSelected(qi, oi)}
            onCheck={() => reveal(qi)}
            onNext={() => scrollToNext(qi)}
          />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_28%,transparent)] p-4 sm:p-5">
        <p className="text-sm font-medium text-[var(--theme-foreground)]">Keep studying</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
          <li>
            <Link
              href={links.practiceExamsHref}
              className="font-medium text-[var(--semantic-brand)] underline-offset-4 hover:underline"
            >
              Practice exams
            </Link>
          </li>
          <li>
            <Link
              href={links.flashcardsHref}
              className="font-medium text-[var(--semantic-brand)] underline-offset-4 hover:underline"
            >
              Flashcards
            </Link>
          </li>
          <li>
            <Link
              href={links.practiceQuestionsHref}
              className="font-medium text-[var(--semantic-brand)] underline-offset-4 hover:underline"
            >
              Question bank
            </Link>
          </li>
          <li>
            <Link
              href={links.relatedLessonsHref}
              className="font-medium text-[var(--semantic-brand)] underline-offset-4 hover:underline"
            >
              Related lessons
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

const QuizEmbedQuestionCard = ({
  cardRef,
  index,
  total,
  q,
  state,
  onSelect,
  onCheck,
  onNext,
}: {
  cardRef?: (el: HTMLDivElement | null) => void;
  index: number;
  total: number;
  q: EmbedQuestion;
  state: PerQuestion;
  onSelect: (oi: number) => void;
  onCheck: () => void;
  onNext: () => void;
}) => {
  const { selected, revealed } = state;
  const isCorrect = revealed && selected === q.correct;
  const isWrong = revealed && selected !== null && selected !== q.correct;

  return (
    <div
      ref={cardRef}
      className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_94%,var(--semantic-panel-cool))] p-4 sm:p-5"
    >
      <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
        Question {index + 1} of {total}
      </p>
      <p className="mt-2 text-base font-medium leading-snug text-[var(--theme-foreground)]">{q.question}</p>

      <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label={`Question ${index + 1} choices`}>
        {q.options.map((opt, oi) => {
          const picked = selected === oi;
          const isAnswer = oi === q.correct;
          let ring = "border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_96%,transparent)]";
          if (!revealed && picked) {
            ring = "border-[color-mix(in_srgb,var(--semantic-info)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,transparent)]";
          }
          if (revealed && isAnswer) {
            ring = "border-[color-mix(in_srgb,var(--semantic-success)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,transparent)]";
          }
          if (revealed && picked && !isAnswer) {
            ring = "border-[color-mix(in_srgb,var(--semantic-danger)_50%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,transparent)]";
          }
          if (revealed && !picked && !isAnswer) {
            ring = "border-[color-mix(in_srgb,var(--semantic-border-soft)_95%,transparent)] opacity-80";
          }

          return (
            <button
              key={oi}
              type="button"
              data-quiz-option
              disabled={revealed}
              onClick={() => onSelect(oi)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm leading-snug transition-colors",
                ring,
                !revealed && "hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]",
              )}
            >
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] text-[0.65rem] font-bold text-[var(--theme-muted-text)]">
                {String.fromCharCode(65 + oi)}
              </span>
              <span className="text-[var(--theme-foreground)]">{opt}</span>
              {revealed && isAnswer ? (
                <CircleCheck className="ml-auto mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              ) : null}
              {revealed && picked && !isAnswer ? (
                <CircleX className="ml-auto mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          disabled={selected === null || revealed}
          onClick={onCheck}
          className="nn-touch-target"
        >
          Check answer
        </Button>
        {index < total - 1 ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1 border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)]"
            onClick={onNext}
          >
            Next question
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </div>

      {revealed ? (
        <div
          className={cn(
            "mt-4 rounded-lg border p-3 text-sm leading-relaxed sm:p-4",
            isCorrect
              ? "border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,transparent)] text-[var(--theme-foreground)]"
              : "border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,transparent)] text-[var(--theme-foreground)]",
          )}
          role="status"
        >
          <p className="font-semibold">
            {isCorrect ? "Correct" : isWrong ? "Incorrect" : "Answer"}
          </p>
          <p className="mt-1 text-[var(--theme-muted-text)] [&_strong]:text-[var(--theme-foreground)]">
            {q.rationale}
          </p>
        </div>
      ) : null}
    </div>
  );
};
