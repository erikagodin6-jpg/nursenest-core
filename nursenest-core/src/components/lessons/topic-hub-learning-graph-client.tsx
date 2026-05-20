"use client";

import type { TopicHubLearningGraph } from "@/lib/educational-graph/topic-hub-learning-graph";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { GovernedGraphInteraction } from "@/components/educational-graph/governed-graph-interaction";
import { GraphTelemetryBoundary } from "@/components/educational-graph/graph-telemetry-boundary";
import type {
  EduGraphStep,
  EduGraphStepKind,
  EducationalIntent,
} from "@/lib/educational-graph/graph-step-contract";

function graphStepKind(kind: TopicHubLearningGraph["links"][number]["kind"]): EduGraphStepKind {
  if (kind === "questions") return "prioritization_drill";
  if (kind === "cat") return "cat_exam";
  return kind;
}

function educationalIntent(kind: EduGraphStepKind): EducationalIntent {
  if (kind === "mechanism") return "mechanism_framing";
  if (kind === "interpretation") return "interpretation";
  if (kind === "flashcards") return "spaced_retention";
  if (kind === "cat_exam") return "reassessment";
  return "prioritization";
}

function stepsFromTopicHubGraph(
  graph: TopicHubLearningGraph,
  pathwayId: string,
): EduGraphStep[] {
  return graph.links.map((link, index) => {
    const stepKind = graphStepKind(link.kind);
    return {
      stepId: `${stepKind}:${link.href}`,
      stepKind,
      competencyId: null,
      topicSlug: graph.topicSlug,
      title: link.label,
      description: link.label,
      href: link.href,
      pathwayId,
      educationalIntent: educationalIntent(stepKind),
      learnerStateReason: null,
      estimatedMinutes: stepKind === "flashcards" ? 5 : 10,
      difficulty: "intermediate",
      remediationPriority: index,
      graphDepth: index,
      sourceSurface: "topic_hub_public",
      telemetryMetadata: {},
    };
  });
}

export function TopicHubLearningGraphClient({
  pathway,
  topicSlug,
  graph,
}: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  graph: TopicHubLearningGraph;
}) {
  const steps = stepsFromTopicHubGraph(graph, pathway.id);
  const primaryStep = steps.find((step) => step.href === graph.nextBestAction?.href) ?? steps[0];

  return (
    <GraphTelemetryBoundary
      topicSlug={topicSlug}
      sourceSurface="topic_hub_public"
      steps={steps}
      pathwayId={pathway.id}
      competencyId={null}
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
          {steps.map((step) => (
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
