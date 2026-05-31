export type KnowledgeGraphAssetType =
  | "lesson"
  | "flashcard"
  | "question"
  | "clinical_skill"
  | "simulation"
  | "lab"
  | "ecg"
  | "medication_math"
  | "pharmacology"
  | "study_plan"
  | "readiness_domain"
  | "weak_area";

export type KnowledgeGraphRelation =
  | "teaches"
  | "reinforces"
  | "assesses"
  | "applies"
  | "interprets"
  | "simulates"
  | "remediates"
  | "evidences_readiness";

export type KnowledgeGraphNode = Readonly<{
  id: string;
  type: KnowledgeGraphAssetType;
  title: string;
  topic: string;
  pathwayIds?: readonly string[];
  competencyIds?: readonly string[];
}>;

export type KnowledgeGraphEdge = Readonly<{
  fromId: string;
  toId: string;
  relation: KnowledgeGraphRelation;
  weight: number;
}>;

export type KnowledgeGraph = Readonly<{
  nodes: readonly KnowledgeGraphNode[];
  edges: readonly KnowledgeGraphEdge[];
}>;

export type KnowledgeGraphTraversal = Readonly<{
  topic: string;
  orderedNodes: readonly KnowledgeGraphNode[];
  edges: readonly KnowledgeGraphEdge[];
  missingAssetTypes: readonly KnowledgeGraphAssetType[];
  remediationPath: readonly KnowledgeGraphNode[];
}>;

const EXPECTED_TOPIC_SEQUENCE: readonly KnowledgeGraphAssetType[] = [
  "lesson",
  "flashcard",
  "question",
  "ecg",
  "lab",
  "simulation",
  "readiness_domain",
  "study_plan",
];

function normalizeTopic(topic: string): string {
  return topic.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sameTopic(a: string, b: string): boolean {
  return normalizeTopic(a) === normalizeTopic(b);
}

function relationForPair(from: KnowledgeGraphAssetType, to: KnowledgeGraphAssetType): KnowledgeGraphRelation {
  if (from === "lesson" && to === "flashcard") return "reinforces";
  if (from === "flashcard" && to === "question") return "assesses";
  if (to === "clinical_skill") return "applies";
  if (to === "ecg" || to === "lab" || to === "medication_math" || to === "pharmacology") return "interprets";
  if (to === "simulation") return "simulates";
  if (to === "study_plan" || to === "weak_area") return "remediates";
  if (to === "readiness_domain") return "evidences_readiness";
  return "teaches";
}

export function buildKnowledgeGraph(nodes: readonly KnowledgeGraphNode[]): KnowledgeGraph {
  const edges: KnowledgeGraphEdge[] = [];
  const byTopic = new Map<string, KnowledgeGraphNode[]>();

  for (const node of nodes) {
    const key = normalizeTopic(node.topic);
    byTopic.set(key, [...(byTopic.get(key) ?? []), node]);
  }

  for (const topicNodes of byTopic.values()) {
    const ordered = [...topicNodes].sort((a, b) => {
      const aIndex = EXPECTED_TOPIC_SEQUENCE.indexOf(a.type);
      const bIndex = EXPECTED_TOPIC_SEQUENCE.indexOf(b.type);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });

    for (let i = 0; i < ordered.length - 1; i += 1) {
      const from = ordered[i]!;
      const to = ordered[i + 1]!;
      edges.push({
        fromId: from.id,
        toId: to.id,
        relation: relationForPair(from.type, to.type),
        weight: 1,
      });
    }
  }

  return { nodes, edges };
}

export function traverseTopicGraph(graph: KnowledgeGraph, topic: string): KnowledgeGraphTraversal {
  const orderedNodes = graph.nodes
    .filter((node) => sameTopic(node.topic, topic))
    .sort((a, b) => {
      const aIndex = EXPECTED_TOPIC_SEQUENCE.indexOf(a.type);
      const bIndex = EXPECTED_TOPIC_SEQUENCE.indexOf(b.type);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });
  const ids = new Set(orderedNodes.map((node) => node.id));
  const edges = graph.edges.filter((edge) => ids.has(edge.fromId) && ids.has(edge.toId));
  const presentTypes = new Set(orderedNodes.map((node) => node.type));
  const missingAssetTypes = EXPECTED_TOPIC_SEQUENCE.filter((type) => !presentTypes.has(type));
  const remediationPath = EXPECTED_TOPIC_SEQUENCE
    .map((type) => orderedNodes.find((node) => node.type === type))
    .filter((node): node is KnowledgeGraphNode => Boolean(node));

  return {
    topic,
    orderedNodes,
    edges,
    missingAssetTypes,
    remediationPath,
  };
}

export function createHyperkalemiaGraphSeed(): KnowledgeGraph {
  return buildKnowledgeGraph([
    { id: "lesson-hyperkalemia", type: "lesson", title: "Hyperkalemia", topic: "hyperkalemia" },
    { id: "flashcards-hyperkalemia", type: "flashcard", title: "Hyperkalemia Flashcards", topic: "hyperkalemia" },
    { id: "questions-hyperkalemia", type: "question", title: "Hyperkalemia Question Bank", topic: "hyperkalemia" },
    { id: "ecg-hyperkalemia", type: "ecg", title: "Hyperkalemia ECG Changes", topic: "hyperkalemia" },
    { id: "labs-hyperkalemia", type: "lab", title: "Potassium Lab Interpretation", topic: "hyperkalemia" },
    { id: "sim-hyperkalemia", type: "simulation", title: "Hyperkalemia Deterioration Simulation", topic: "hyperkalemia" },
    { id: "readiness-electrolytes", type: "readiness_domain", title: "Electrolyte Readiness", topic: "hyperkalemia" },
    { id: "plan-hyperkalemia", type: "study_plan", title: "Hyperkalemia Remediation Plan", topic: "hyperkalemia" },
  ]);
}
