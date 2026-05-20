import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildTopicHubLearningGraph } from "@/lib/educational-graph/topic-hub-learning-graph";

/**
 * Dynamic learning hub links — competency framing + bounded study sequence (not link spam).
 */
export function TopicHubLearningGraph({ pathway, topicSlug }: { pathway: ExamPathwayDefinition; topicSlug: string }) {
  const graph = buildTopicHubLearningGraph(pathway, topicSlug);
  if (!graph || graph.links.length === 0) return null;

  return (
    <section
      className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand)_6%)] bg-[color-mix(in_srgb,var(--semantic-surface)_95%,var(--semantic-panel-positive)_5%)] px-4 py-4 sm:px-5"
      aria-labelledby="topic-hub-graph-heading"
      data-nn-topic-hub-learning-graph
    >
      {graph.competencyLabel ? (
        <>
          <h3 id="topic-hub-graph-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
            RN competency: {graph.competencyLabel}
          </h3>
          {graph.competencyDescription ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {graph.competencyDescription}
            </p>
          ) : null}
        </>
      ) : (
        <h3 id="topic-hub-graph-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
          Recommended study path
        </h3>
      )}
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-[var(--semantic-text-secondary)]">
        {graph.studySequence.slice(0, 4).map((step) => (
          <li key={step.slice(0, 40)}>{step}</li>
        ))}
      </ol>
      <ul className="mt-3 flex flex-wrap gap-2">
        {graph.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-medium text-primary hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
