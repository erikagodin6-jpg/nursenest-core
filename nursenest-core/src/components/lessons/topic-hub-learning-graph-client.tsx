"use client";

import type { TopicHubLearningGraph } from "@/lib/educational-graph/topic-hub-learning-graph";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { GovernedGraphInteraction } from "@/components/educational-graph/governed-graph-interaction";
import { GraphTelemetryBoundary } from "@/components/educational-graph/graph-telemetry-boundary";

export function TopicHubLearningGraphClient({
  pathway,
  topicSlug,
  graph,
}: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  graph: TopicHubLearningGraph;
}) {
  const traversal = orchestrateEducationalGraph({
    topicSlug,
    marketingPathway: pathway,
    pathwayId: pathway.id,
    sourceSurface: "topic_hub_public",
    maxSteps: graph.links.length + 2,
  });
  const primaryStep = traversal.steps[0];

  return (
    <GraphTelemetryBoundary
      topicSlug={topicSlug}
      sourceSurface="topic_hub_public"
      steps={traversal.steps}
      pathwayId={pathway.id}
      competencyId={traversal.competencyId}
    >
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
        {graph.nextBestAction && primaryStep ? (
          <p className="mt-3 text-sm">
            <span className="text-[var(--semantic-text-secondary)]">Next best action: </span>
            <GovernedGraphInteraction
              step={primaryStep}
              clickEvent="next_best_action_clicked"
              className="font-semibold text-primary hover:underline"
            >
              {graph.nextBestAction.title}
            </GovernedGraphInteraction>
          </p>
        ) : null}
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-[var(--semantic-text-secondary)]">
          {graph.studySequence.slice(0, 4).map((step) => (
            <li key={step.slice(0, 40)}>{step}</li>
          ))}
        </ol>
        <ul className="mt-3 flex flex-wrap gap-2">
          {traversal.steps.slice(0, graph.links.length).map((step) => (
            <li key={step.stepId}>
              <GovernedGraphInteraction
                step={step}
                clickEvent={
                  step.stepKind === "reassessment" ? "reassessment_route_opened" : "graph_step_clicked"
                }
                className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-medium text-primary hover:underline"
              >
                {step.title}
              </GovernedGraphInteraction>
            </li>
          ))}
        </ul>
      </section>
    </GraphTelemetryBoundary>
  );
}
