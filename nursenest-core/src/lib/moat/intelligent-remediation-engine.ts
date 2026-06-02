import type { KnowledgeGraph } from "@/lib/moat/knowledge-graph-engine";
import { traverseTopicGraph, type KnowledgeGraphAssetType } from "@/lib/moat/knowledge-graph-engine";
import type { PersonalLearningTwin } from "@/lib/moat/learner-model-engine";

export type RemediationRecommendation = Readonly<{
  topic: string;
  priority: number;
  reason: string;
  activitySequence: readonly KnowledgeGraphAssetType[];
  assetIds: readonly string[];
}>;

const DEFAULT_SEQUENCE: readonly KnowledgeGraphAssetType[] = [
  "lesson",
  "flashcard",
  "question",
  "clinical_skill",
  "simulation",
  "ecg",
  "lab",
  "medication_math",
  "pharmacology",
];

function reasonForTopic(args: {
  topic: string;
  weak: boolean;
  forgotten: boolean;
  misunderstood: boolean;
}): string {
  if (args.misunderstood) return `${args.topic} shows a confidence/accuracy mismatch. Start with reasoning repair before more questions.`;
  if (args.forgotten) return `${args.topic} appears to be decaying. Use retrieval practice and spaced review.`;
  if (args.weak) return `${args.topic} is a weak area. Rebuild from lesson to application.`;
  return `${args.topic} is ready for targeted reinforcement.`;
}

export function buildIntelligentRemediationPlan(args: {
  twin: PersonalLearningTwin;
  graph: KnowledgeGraph;
  maxTopics?: number;
}): readonly RemediationRecommendation[] {
  const maxTopics = args.maxTopics ?? 5;
  return args.twin.nextBestTopics.slice(0, maxTopics).map((topic) => {
    const traversal = traverseTopicGraph(args.graph, topic);
    const availableTypes = new Set(traversal.orderedNodes.map((node) => node.type));
    const activitySequence = DEFAULT_SEQUENCE.filter((type) => availableTypes.has(type));
    const model = args.twin.topics.find((entry) => entry.topic === topic);

    return {
      topic,
      priority: model?.nextStudyPriority ?? 0,
      reason: reasonForTopic({
        topic,
        weak: args.twin.weakAreas.includes(topic),
        forgotten: args.twin.forgottenAreas.includes(topic),
        misunderstood: args.twin.misunderstoodAreas.includes(topic),
      }),
      activitySequence,
      assetIds: traversal.remediationPath.map((node) => node.id),
    };
  });
}
