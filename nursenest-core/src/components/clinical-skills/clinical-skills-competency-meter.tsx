"use client";

import { memoryStrengthLabel } from "@/lib/clinical-skills/clinical-skills-lesson-competency.client";
import { cn } from "@/lib/utils";

export function ClinicalSkillsCompetencyMeter({
  readinessPct,
  stepsDone,
  stepTotal,
  flashcardsDone,
  flashcardTotal,
  className,
}: {
  readinessPct: number;
  stepsDone: number;
  stepTotal: number;
  flashcardsDone: number;
  flashcardTotal: number;
  className?: string;
}) {
  const label = memoryStrengthLabel(readinessPct);
  const fillClass =
    readinessPct >= 85
      ? "nn-progress-fill-semantic-success"
      : readinessPct >= 60
        ? "nn-progress-fill-semantic-info"
        : readinessPct >= 35
          ? "nn-progress-fill-semantic-warning"
          : "nn-progress-fill-semantic-readiness";

  return (
    <div className={cn("nn-clinical-skills-competency-meter", className)}>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">Simulation readiness</p>
          <p className="text-lg font-bold text-[var(--semantic-text-primary)]">{readinessPct}%</p>
          <p className="text-xs text-[var(--semantic-text-secondary)]">{label}</p>
        </div>
        <span className="nn-badge-semantic-info rounded-full px-2 py-0.5 text-[10px] font-semibold">Competency lab</span>
      </div>
      <div className="nn-progress-track-semantic mt-3 h-2.5 overflow-hidden rounded-full" role="progressbar" aria-valuenow={readinessPct} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn("h-full rounded-full transition-[width] duration-500", fillClass)} style={{ width: `${readinessPct}%` }} />
      </div>
      <ul className="mt-3 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
        <li>
          <span className="font-semibold text-[var(--semantic-text-primary)]">Procedure steps:</span> {stepsDone}/{stepTotal}
        </li>
        <li>
          <span className="font-semibold text-[var(--semantic-text-primary)]">Flashcards reviewed:</span> {flashcardsDone}/{flashcardTotal}
        </li>
      </ul>
    </div>
  );
}
