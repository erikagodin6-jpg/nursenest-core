import {
  normalizeQuestionBodySystem,
  PRACTICE_BODY_SYSTEM_HUB_META,
  PRACTICE_BODY_SYSTEM_HUB_IDS,
  type PracticeBodySystemHubId,
} from "@/lib/questions/normalize-question-body-system";

export type PracticeBodySystemHubAggregate = {
  id: PracticeBodySystemHubId;
  label: string;
  description: string;
  questionCount: number;
  /** Raw `topic` values on rows grouped into this hub (for `/api/questions` IN filter). */
  matchingTopics: string[];
  /** Raw `bodySystem` values on rows grouped into this hub. */
  matchingBodySystems: string[];
};

type HubAccumulator = {
  count: number;
  topics: Set<string>;
  bodySystems: Set<string>;
};

function emptyAccumulators(): Record<PracticeBodySystemHubId, HubAccumulator> {
  const out = {} as Record<PracticeBodySystemHubId, HubAccumulator>;
  for (const id of PRACTICE_BODY_SYSTEM_HUB_IDS) {
    out[id] = { count: 0, topics: new Set(), bodySystems: new Set() };
  }
  return out;
}

/** Full hub_inventory skeleton (lessons / flashcards parity): every canonical hub row, including zero counts. */
export function buildSkeletonPracticeHubAggregates(): PracticeBodySystemHubAggregate[] {
  const ordered: PracticeBodySystemHubAggregate[] = PRACTICE_BODY_SYSTEM_HUB_META.map((meta) => ({
    id: meta.id,
    label: meta.label,
    description: meta.description,
    questionCount: 0,
    matchingTopics: [],
    matchingBodySystems: [],
  }));
  ordered.push({
    id: "uncategorized",
    label: "Other / multi-topic",
    description: "Items that did not map cleanly to a single body system from current metadata.",
    questionCount: 0,
    matchingTopics: [],
    matchingBodySystems: [],
  });
  return ordered;
}

export type PracticeHubGroupByRow = {
  bodySystem: string | null;
  topic: string | null;
  nclexClientNeedsCategory: string | null;
  _count: { _all: number };
};

/**
 * Pure merge of `groupBy` rows into the canonical hub skeleton (for tests and SSR hydration).
 */
export function hydratePracticeHubAggregatesFromGroupByRows(
  rows: readonly PracticeHubGroupByRow[],
): PracticeBodySystemHubAggregate[] {
  const acc = emptyAccumulators();
  for (const row of rows) {
    const hub = normalizeQuestionBodySystem({
      bodySystem: row.bodySystem,
      topic: row.topic,
      nclexClientNeedsCategory: row.nclexClientNeedsCategory,
    });
    const bucket = acc[hub];
    bucket.count += row._count._all;
    const t = row.topic?.trim();
    if (t) bucket.topics.add(t);
    const b = row.bodySystem?.trim();
    if (b) bucket.bodySystems.add(b);
  }

  const skeleton = buildSkeletonPracticeHubAggregates();
  const byId = new Map(skeleton.map((s) => [s.id, s]));

  for (const meta of PRACTICE_BODY_SYSTEM_HUB_META) {
    const a = acc[meta.id];
    const row = byId.get(meta.id)!;
    row.questionCount = a?.count ?? 0;
    row.matchingTopics = a ? [...a.topics] : [];
    row.matchingBodySystems = a ? [...a.bodySystems] : [];
  }
  const unRow = byId.get("uncategorized")!;
  const un = acc.uncategorized;
  unRow.questionCount = un?.count ?? 0;
  unRow.matchingTopics = un ? [...un.topics] : [];
  unRow.matchingBodySystems = un ? [...un.bodySystems] : [];

  return skeleton;
}
