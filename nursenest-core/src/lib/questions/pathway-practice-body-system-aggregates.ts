import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  normalizeQuestionBodySystem,
  PRACTICE_BODY_SYSTEM_HUB_META,
  PRACTICE_BODY_SYSTEM_HUB_IDS,
  type PracticeBodySystemHubId,
} from "@/lib/questions/normalize-question-body-system";

const REVALIDATE_SECONDS = 3600;

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

async function computeAggregates(pathway: ExamPathwayDefinition): Promise<PracticeBodySystemHubAggregate[]> {
  const base = pathwayExamQuestionMarketingWhere(pathway);
  const rows = await prisma.examQuestion.groupBy({
    by: ["bodySystem", "topic", "nclexClientNeedsCategory"],
    where: base,
    _count: { _all: true },
  });
  return hydratePracticeHubAggregatesFromGroupByRows(rows);
}

export async function loadPathwayPracticeBodySystemHubAggregates(
  pathwayId: string,
): Promise<PracticeBodySystemHubAggregate[]> {
  const fallback = buildSkeletonPracticeHubAggregates();
  try {
    return await unstable_cache(
      async () => {
        const pathway = getExamPathwayById(pathwayId);
        if (!pathway) return fallback;
        return computeAggregates(pathway);
      },
      ["pathway-practice-body-system-aggregates", pathwayId],
      { revalidate: REVALIDATE_SECONDS, tags: [`pathway-questions:${pathwayId}`] },
    )();
  } catch {
    return fallback;
  }
}

/**
 * Merges raw DB topic / bodySystem values for selected hubs (union) for API filtering.
 */
export function mergePracticeHubPoolForApi(
  aggregates: readonly PracticeBodySystemHubAggregate[],
  hubIds: readonly PracticeBodySystemHubId[],
): { topics: string[]; bodySystems: string[] } {
  const topics = new Set<string>();
  const bodySystems = new Set<string>();
  const byId = new Map(aggregates.map((a) => [a.id, a]));
  for (const id of hubIds) {
    const row = byId.get(id);
    if (!row) continue;
    for (const t of row.matchingTopics) {
      if (t.trim()) topics.add(t.trim());
    }
    for (const b of row.matchingBodySystems) {
      if (b.trim()) bodySystems.add(b.trim());
    }
  }
  return { topics: [...topics], bodySystems: [...bodySystems] };
}

/** Raw SQL fragment: (topic IN (...) OR body_system IN (...)) */
export function practiceHubPoolSql(topics: readonly string[], bodySystems: readonly string[]): Prisma.Sql {
  const t = topics.filter(Boolean);
  const b = bodySystems.filter(Boolean);
  const parts: Prisma.Sql[] = [];
  if (t.length > 0) {
    parts.push(Prisma.sql`topic IN (${Prisma.join(t)})`);
  }
  if (b.length > 0) {
    parts.push(Prisma.sql`"body_system" IN (${Prisma.join(b)})`);
  }
  if (parts.length === 0) return Prisma.empty;
  if (parts.length === 1) return Prisma.sql` AND (${parts[0]!})`;
  return Prisma.sql` AND (${Prisma.join(parts, " OR ")})`;
}

export function prismaWhereForPracticeHubPool(
  topics: readonly string[],
  bodySystems: readonly string[],
): Prisma.ExamQuestionWhereInput | null {
  const t = topics.map((x) => x.trim()).filter(Boolean);
  const bs = bodySystems.map((x) => x.trim()).filter(Boolean);
  const or: Prisma.ExamQuestionWhereInput[] = [];
  if (t.length > 0) or.push({ topic: { in: t } });
  if (bs.length > 0) or.push({ bodySystem: { in: bs } });
  if (or.length === 0) return null;
  if (or.length === 1) return or[0]!;
  return { OR: or };
}
