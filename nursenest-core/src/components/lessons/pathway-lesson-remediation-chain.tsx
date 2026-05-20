import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildMarketingLessonRemediationChain } from "@/lib/lessons/marketing-lesson-remediation-chain";

/**
 * Competency remediation chain on public lesson detail (complements prev/next linear nav).
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
  const steps = buildMarketingLessonRemediationChain({
    pathway,
    topicSlug,
    topicLabel,
    anchorLessonSlug: lessonSlug,
    maxLessonSteps: 3,
  });
  const lessonSteps = steps.filter((s) => s.kind === "lesson");
  if (lessonSteps.length < 2) return null;

  return (
    <nav
      className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-warning)_6%)] bg-[color-mix(in_srgb,var(--semantic-surface)_94%,var(--semantic-panel-warm)_6%)] px-4 py-4 sm:px-5"
      aria-labelledby="lesson-remediation-heading"
      data-nn-lesson-remediation-chain
    >
      <h2 id="lesson-remediation-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
        Strengthen this competency
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
        If this topic felt difficult, work through related lessons in order, then practice and drill recall.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
        {steps.map((step) => (
          <li key={`${step.kind}:${step.href}`}>
            <Link href={step.href} className="font-medium text-primary underline-offset-4 hover:underline">
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
