"use client";

import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";
import { GraphTelemetryBoundary } from "@/components/educational-graph/graph-telemetry-boundary";
import { GovernedGraphInteraction } from "@/components/educational-graph/governed-graph-interaction";

const KIND_LABEL: Record<string, string> = {
  mechanism: "Mechanism",
  lesson: "Lesson",
  foundational_lesson: "Lesson",
  interpretation: "Interpret",
  prioritization_drill: "Prioritize",
  flashcards: "Flashcards",
  mixed_reassessment: "Reassess",
  reassessment: "Reassess",
};

export function PathwayLessonRemediationChainClient({
  traversal,
  competencyHeading,
}: {
  traversal: EducationalGraphTraversal;
  competencyHeading: string;
}) {
  const steps = traversal.steps;
  if (steps.length < 3) return null;

  return (
    <GraphTelemetryBoundary
      topicSlug={traversal.topicSlug}
      sourceSurface={traversal.sourceSurface}
      steps={steps}
      competencyId={traversal.competencyId}
      pathwayId={steps[0]?.pathwayId}
    >
      <nav
        className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-warning)_6%)] bg-[color-mix(in_srgb,var(--semantic-surface)_94%,var(--semantic-panel-warm)_6%)] px-4 py-4 sm:px-5"
        aria-labelledby="lesson-remediation-heading"
        data-nn-lesson-remediation-chain
      >
        <h2 id="lesson-remediation-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
          {competencyHeading}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
          Progressive ladder — mechanism and interpretation first, then judgment practice and reassessment.
        </p>
        <ol className="mt-3 space-y-3">
          {steps.map((step, i) => (
            <li key={step.stepId} className="flex gap-3 text-sm">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] text-xs font-semibold text-primary"
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <span className="mr-2 text-[10px] font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                  {KIND_LABEL[step.stepKind] ?? step.stepKind}
                </span>
                <GovernedGraphInteraction step={step} className="font-medium text-primary underline-offset-4 hover:underline">
                  {step.title}
                </GovernedGraphInteraction>
                <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </GraphTelemetryBoundary>
  );
}
