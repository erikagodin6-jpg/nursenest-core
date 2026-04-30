import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  normalizeQuestionBodySystem,
  PRACTICE_BODY_SYSTEM_HUB_META,
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
  const ids: PracticeBodySystemHubId[] = [
    "cardiovascular",
    "respiratory",
    "neurological",
    "gastrointestinal",
    "endocrine",
    "renal_urinary",
    "musculoskeletal",
    "integumentary",
    "hematology_oncology",
    "immune_infection",
    "maternity_reproductive",
    "pediatrics",
    "mental_health",
    "pharmacology",
    "fundamentals_safety",
    "leadership_prioritization",
    "community_public_health",
    "emergency_critical_care",
    "uncategorized",
  ];
  for (const id of ids) {
    out[id] = { count: 0, topics: new Set(), bodySystems: new Set() };
  }
  return out;
}

async function computeAggregates(pathway: ExamPathwayDefinition): Promise<PracticeBodySystemHubAggregate[]> {
  const base = pathwayExamQuestionMarketingWhere(pathway);
  const rows = await prisma.examQuestion.groupBy({
    by: ["bodySystem", "topic"],
    where: base,
    _count: { _all: true },
  });

  const acc = emptyAccumulators();
  for (const row of rows) {
    const hub = normalizeQuestionBodySystem({
      bodySystem: row.bodySystem,
      topic: row.topic,
    });
    const bucket = acc[hub];
    bucket.count += row._count._all;
    const t = row.topic?.trim();
    if (t) bucket.topics.add(t);
    const b = row.bodySystem?.trim();
    if (b) bucket.bodySystems.add(b);
  }

  const ordered: PracticeBodySystemHubAggregate[] = [];

  for (const meta of PRACTICE_BODY_SYSTEM_HUB_META) {
    const a = acc[meta.id];
    if (!a || a.count === 0) continue;
    ordered.push({
      id: meta.id,
      label: meta.label,
      description: meta.description,
      questionCount: a.count,
      matchingTopics: [...a.topics],
      matchingBodySystems: [...a.bodySystems],
    });
  }

  const un = acc.uncategorized;
  if (un && un.count > 0) {
    ordered.push({
      id: "uncategorized",
      label: "Other / multi-topic",
      description: "Items that did not map cleanly to a single body system from current metadata.",
      questionCount: un.count,
      matchingTopics: [...un.topics],
      matchingBodySystems: [...un.bodySystems],
    });
  }

  return ordered;
}

export async function loadPathwayPracticeBodySystemHubAggregates(
  pathwayId: string,
): Promise<PracticeBodySystemHubAggregate[]> {
  try {
    return await unstable_cache(
      async () => {
        const pathway = getExamPathwayById(pathwayId);
        if (!pathway) return [];
        return computeAggregates(pathway);
      },
      ["pathway-practice-body-system-aggregates", pathwayId],
      { revalidate: REVALIDATE_SECONDS, tags: [`pathway-questions:${pathwayId}`] },
    )();
  } catch {
    return [];
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
