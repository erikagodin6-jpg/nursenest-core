import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingHubInventoryWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { PracticeBodySystemHubId } from "@/lib/questions/normalize-question-body-system";
import {
  buildSkeletonPracticeHubAggregates,
  hydratePracticeHubAggregatesFromGroupByRows,
  type PracticeBodySystemHubAggregate,
} from "@/lib/questions/pathway-practice-hub-inventory";

export type { PracticeBodySystemHubAggregate, PracticeHubGroupByRow } from "@/lib/questions/pathway-practice-hub-inventory";

export { buildSkeletonPracticeHubAggregates, hydratePracticeHubAggregatesFromGroupByRows } from "@/lib/questions/pathway-practice-hub-inventory";

const AGGREGATE_TIMEOUT_MS = 1200;
const REVALIDATE_SECONDS = 3600;

async function computeAggregates(pathway: ExamPathwayDefinition): Promise<PracticeBodySystemHubAggregate[]> {
  const where = pathwayExamQuestionMarketingHubInventoryWhere(pathway);
  const rows = await withDatabaseFallbackTimeout(
    () =>
      prisma.examQuestion.groupBy({
        by: ["bodySystem", "topic", "nclexClientNeedsCategory"],
        where,
        _count: { _all: true },
      }),
    [],
    AGGREGATE_TIMEOUT_MS,
    { scope: "practice_questions_hub", label: `body_system_aggregates:${pathway.id}` },
  );
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
