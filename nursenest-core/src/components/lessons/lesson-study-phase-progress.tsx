import { Check, Circle, Sparkles } from "lucide-react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type StudyPhase = "prime" | "learn" | "recall" | "mastered";

const PHASES: { id: StudyPhase; label: string; percent: number; hint: string }[] = [
  { id: "prime", label: "Prime", percent: 12, hint: "Preview the cues" },
  { id: "learn", label: "Learn", percent: 42, hint: "Build the mental model" },
  { id: "recall", label: "Recall", percent: 72, hint: "Retrieve before reviewing" },
  { id: "mastered", label: "Master", percent: 100, hint: "Ready to apply" },
];

function phaseFromProgress(progress: PathwayLessonProgressStatus | null | undefined): StudyPhase {
  if (progress === "completed") return "mastered";
  if (progress === "in_progress") return "learn";
  return "prime";
}

function phaseIndex(phase: StudyPhase): number {
  return PHASES.findIndex((p) => p.id === phase);
}

export function lessonStudyPhaseLabel(progress: PathwayLessonProgressStatus | null | undefined): string {
  return PHASES[phaseIndex(phaseFromProgress(progress))]?.label ?? "Prime";
}

export function lessonStudyProgressPercent(progress: PathwayLessonProgressStatus | null | undefined): number {
  return PHASES[phaseIndex(phaseFromProgress(progress))]?.percent ?? 12;
}

export function LessonStudyPhaseProgress({
  progress,
  persisted,
  compact = false,
}: {
  progress?: PathwayLessonProgressStatus | null;
  /** True only when the viewer is allowed to see persisted lesson progress. */
  persisted: boolean;
  compact?: boolean;
}) {
  const activePhase = phaseFromProgress(persisted ? progress : "not_started");
  const activeIndex = phaseIndex(activePhase);
  const percent = persisted ? lessonStudyProgressPercent(progress) : 12;

  return (
    <section
      className={compact ? "nn-lesson-phase-strip nn-lesson-phase-strip--compact" : "nn-lesson-phase-strip"}
      aria-label="Lesson study progress"
      data-persisted={persisted ? "true" : "false"}
      data-nn-premium-individual-lesson-progress
    >
      <div className="nn-lesson-phase-strip__top">
        <span className="nn-lesson-phase-strip__label">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Study loop
        </span>
        <span className="nn-lesson-phase-strip__percent">
          {persisted ? `${percent}%` : "Local read"}
        </span>
      </div>
      <div className="nn-lesson-phase-strip__bar" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <ol className="nn-lesson-phase-strip__steps">
        {PHASES.map((phase, index) => {
          const complete = persisted && index < activeIndex;
          const active = index === activeIndex;
          return (
            <li key={phase.id} data-complete={complete ? "true" : undefined} data-active={active ? "true" : undefined}>
              <span className="nn-lesson-phase-strip__dot" aria-hidden>
                {complete ? <Check className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5" />}
              </span>
              <span className="nn-lesson-phase-strip__step-copy">
                <strong>{phase.label}</strong>
                <small>{phase.hint}</small>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
