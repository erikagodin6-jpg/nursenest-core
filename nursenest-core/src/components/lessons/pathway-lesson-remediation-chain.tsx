import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildMarketingRemediationLadderV2 } from "@/lib/educational-graph/remediation-ladder-v2";
import { resolveRnCompetencyForTopic } from "@/lib/educational-graph/rn-competency-ontology";

const KIND_LABEL: Record<string, string> = {
  mechanism: "Mechanism",
  foundational_lesson: "Lesson",
  interpretation: "Interpret",
  prioritization_drill: "Prioritize",
  flashcards: "Flashcards",
  mixed_reassessment: "Reassess",
};

/**
 * Remediation ladder V2 on public lesson detail — progressive competency scaffolding.
 */
export function PathwayLessonRemediationChain({
  pathway,
  topicSlug,
  topicLabel,
  lessonSlug,
}: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  lessonSlug: string;
}) {
  const steps = buildMarketingRemediationLadderV2({
    pathway,
    topicSlug,
    topicLabel,
    anchorLessonSlug: lessonSlug,
    maxLessonSteps: 2,
  });
  if (steps.length < 3) return null;

  const competency = resolveRnCompetencyForTopic(topicSlug);

  return (
    <nav
      className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-warning)_6%)] bg-[color-mix(in_srgb,var(--semantic-surface)_94%,var(--semantic-panel-warm)_6%)] px-4 py-4 sm:px-5"
      aria-labelledby="lesson-remediation-heading"
      data-nn-lesson-remediation-chain
    >
      <h2 id="lesson-remediation-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
        {competency ? `Strengthen: ${competency.label}` : "Remediation pathway"}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
        Progressive ladder — mechanism and interpretation first, then judgment practice and reassessment.
      </p>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li key={`${step.kind}:${step.href}`} className="flex gap-3 text-sm">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] text-xs font-semibold text-primary"
              aria-hidden
            >
              {i + 1}
            </span>
            <div>
              <span className="mr-2 text-[10px] font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {KIND_LABEL[step.kind] ?? step.kind}
              </span>
              <Link href={step.href} className="font-medium text-primary underline-offset-4 hover:underline">
                {step.label}
              </Link>
              <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{step.reason}</p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
