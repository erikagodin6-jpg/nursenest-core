import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { toTopicHubLearningLinks } from "@/lib/educational-graph/graph-step-adapters";
import { dedupeGraphHrefs, TOPIC_HUB_GRAPH_MAX_LINKS } from "@/lib/educational-graph/graph-governance";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type TopicHubLearningLink = {
  label: string;
  href: string;
  kind: "mechanism" | "interpretation" | "questions" | "flashcards" | "cat";
};

export type TopicHubLearningGraph = {
  topicSlug: string;
  competencyLabel: string | null;
  competencyDescription: string | null;
  studySequence: string[];
  links: TopicHubLearningLink[];
  nextBestAction: { title: string; href: string } | null;
};

export function buildTopicHubLearningGraph(
  pathway: ExamPathwayDefinition,
  topicSlug: string,
  options?: {
    learnerState?: RnLearnerStateSnapshot | null;
    persistentWeakTopics?: readonly string[];
    recentHrefs?: ReadonlySet<string>;
    authenticated?: boolean;
  },
): TopicHubLearningGraph | null {
  const authenticated = options?.authenticated ?? Boolean(options?.learnerState);
  const traversal = orchestrateEducationalGraph({
    topicSlug,
    marketingPathway: pathway,
    pathwayId: pathway.id,
    sourceSurface: authenticated ? "topic_hub_authenticated" : "topic_hub_public",
    learnerState: options?.learnerState ?? null,
    persistentWeakTopics: options?.persistentWeakTopics,
    recentHrefs: options?.recentHrefs,
    maxSteps: TOPIC_HUB_GRAPH_MAX_LINKS + 2,
  });

  if (!traversal.steps.length) return null;

  const links = dedupeGraphHrefs(toTopicHubLearningLinks(traversal.steps, pathway)).slice(
    0,
    TOPIC_HUB_GRAPH_MAX_LINKS,
  );

  const next = traversal.steps[0];
  const competency = traversal.competencyLabel
    ? {
        label: traversal.competencyLabel,
        description:
          authenticated && options?.learnerState?.remediationFatigueScore
            ? "Pace remediation — one competency at a time before reassessment."
            : null,
      }
    : { label: null, description: null };

  return {
    topicSlug: traversal.topicSlug,
    competencyLabel: competency.label,
    competencyDescription: competency.description,
    studySequence: [...traversal.studySequence],
    links,
    nextBestAction: next ? { title: next.title, href: next.href } : null,
  };
}
