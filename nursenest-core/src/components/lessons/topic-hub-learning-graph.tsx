import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildTopicHubLearningGraph } from "@/lib/educational-graph/topic-hub-learning-graph";
import { TopicHubLearningGraphClient } from "@/components/lessons/topic-hub-learning-graph-client";

/**
 * Dynamic learning hub links — competency framing + governed graph telemetry.
 */
export function TopicHubLearningGraph({ pathway, topicSlug }: { pathway: ExamPathwayDefinition; topicSlug: string }) {
  const graph = buildTopicHubLearningGraph(pathway, topicSlug);
  if (!graph || graph.links.length === 0) return null;

  return <TopicHubLearningGraphClient pathway={pathway} topicSlug={topicSlug} graph={graph} />;
}
