"use client";

import { useMemo, useState } from "react";

import { PreNursingLessonCheckpointCard } from "@/components/pre-nursing/pre-nursing-lesson-checkpoint-card";
import type { PreNursingCheckpointDefinition } from "@/content/pre-nursing/pre-nursing-interactive-checkpoints";
import type { PreNursingMasteryEvent } from "@/lib/pre-nursing/pre-nursing-mastery-events";

export type PreNursingLessonMiniAssessmentProps = {
  title: string;
  description: string;
  checkpoints: readonly PreNursingCheckpointDefinition[];
  masteryThreshold?: number;
  onCompleted?: (summary: {
    total: number;
    correct: number;
    masteryPercent: number;
    events: PreNursingMasteryEvent[];
  }) => void;
};

export function PreNursingLessonMiniAssessment({
  title,
  description,
  checkpoints,
  masteryThreshold = 80,
  onCompleted,
}: PreNursingLessonMiniAssessmentProps) {
  const [events, setEvents] = useState<PreNursingMasteryEvent[]>([]);

  const answeredConceptIds = useMemo(
    () => new Set(events.map((event) => event.conceptId)),
    [events],
  );

  const total = checkpoints.length;
  const correct = events.filter((event) => event.correct).length;
  const masteryPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const complete = total > 0 && answeredConceptIds.size >= total;
  const metMastery = complete && masteryPercent >= masteryThreshold;

  function handleAnswered(event: PreNursingMasteryEvent) {
    setEvents((current) => {
      const next = current.some((existing) => existing.conceptId === event.conceptId)
        ? current
        : [...current, event];

      const nextAnswered = new Set(next.map((item) => item.conceptId));
      const nextCorrect = next.filter((item) => item.correct).length;
      const nextMasteryPercent = total > 0 ? Math.round((nextCorrect / total) * 100) : 0;

      if (total > 0 && nextAnswered.size >= total) {
        onCompleted?.({
          total,
          correct: nextCorrect,
          masteryPercent: nextMasteryPercent,
          events: next,
        });
      }

      return next;
    });
  }

  if (total === 0) return null;

  return (
    <section
      className="my-10 rounded-[1.6rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      data-prenursing-mini-assessment=""
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
            Lesson mastery check
          </p>
          <h2 className="m-0 text-xl font-bold tracking-[-0.025em] text-[var(--theme-heading-text)] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-[1.7] text-[var(--semantic-text-secondary)]">
            {description}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_18%,var(--semantic-surface))] px-4 py-3 text-right">
          <p className="m-0 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            Mastery
          </p>
          <p className="m-0 text-2xl font-extrabold text-[var(--theme-heading-text)]">
            {masteryPercent}%
          </p>
          <p className="m-0 text-xs text-[var(--semantic-text-muted)]">
            {correct}/{total} correct
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {checkpoints.map((checkpoint) => (
          <PreNursingLessonCheckpointCard
            key={checkpoint.conceptId}
            {...checkpoint}
            onAnswered={handleAnswered}
          />
        ))}
      </div>

      {complete ? (
        <div
          className="mt-6 rounded-xl border px-4 py-3"
          data-prenursing-mini-assessment-result=""
          style={{
            borderColor: metMastery
              ? "color-mix(in srgb, var(--semantic-success) 30%, var(--semantic-border-soft))"
              : "color-mix(in srgb, var(--semantic-warning) 30%, var(--semantic-border-soft))",
            background: metMastery
              ? "color-mix(in srgb, var(--semantic-success) 7%, var(--semantic-surface))"
              : "color-mix(in srgb, var(--semantic-warning) 7%, var(--semantic-surface))",
          }}
        >
          <p
            className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: metMastery ? "var(--semantic-success)" : "var(--semantic-warning)" }}
          >
            {metMastery ? "Ready to move forward" : "Review recommended"}
          </p>
          <p className="m-0 text-sm leading-[1.65] text-[var(--semantic-text-secondary)]">
            {metMastery
              ? "You met the mastery target for this lesson. Keep reinforcing the concept through flashcards and mixed practice."
              : "You are building the concept, but another review pass will help. Revisit the rationales, then try a short weak-area practice set."}
          </p>
        </div>
      ) : null}
    </section>
  );
}
