"use client";

import { PreNursingLessonCheckpointCard } from "@/components/pre-nursing/pre-nursing-lesson-checkpoint-card";
import {
  PRE_NURSING_FOUNDATION_CHECKPOINTS,
  type PreNursingCheckpointDefinition,
} from "@/content/pre-nursing/pre-nursing-interactive-checkpoints";
import type { PreNursingMasteryEvent } from "@/lib/pre-nursing/pre-nursing-mastery-events";

export type PreNursingCheckpointClusterProps = {
  ids: readonly string[];
  title?: string;
  description?: string;
  onAnswered?: (event: PreNursingMasteryEvent) => void;
};

export function PreNursingCheckpointCluster({
  ids,
  title = "Interactive checkpoints",
  description = "Practice the core ideas as you learn. These checkpoints are low-stakes and built to reinforce understanding, not punish mistakes.",
  onAnswered,
}: PreNursingCheckpointClusterProps) {
  const checkpoints = ids
    .map((id) => PRE_NURSING_FOUNDATION_CHECKPOINTS[id])
    .filter((checkpoint): checkpoint is PreNursingCheckpointDefinition => Boolean(checkpoint));

  if (checkpoints.length === 0) return null;

  return (
    <section
      className="my-10 rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))] p-4 sm:p-5"
      data-prenursing-checkpoint-cluster=""
    >
      <div className="mb-5 max-w-2xl">
        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
          Active learning
        </p>
        <h2 className="m-0 text-lg font-bold tracking-[-0.02em] text-[var(--theme-heading-text)] sm:text-xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-[1.65] text-[var(--semantic-text-secondary)]">
          {description}
        </p>
      </div>

      <div className="space-y-5">
        {checkpoints.map((checkpoint) => (
          <PreNursingLessonCheckpointCard
            key={checkpoint.conceptId}
            {...checkpoint}
            onAnswered={onAnswered}
          />
        ))}
      </div>
    </section>
  );
}
