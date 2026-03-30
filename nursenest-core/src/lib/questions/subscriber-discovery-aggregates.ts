import { Prisma } from "@prisma/client";
import type { CountryCode, TierCode } from "@prisma/client";
import { DB_PUBLISHED, examQuestionTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";

/** Match {@link DISCOVERY_TOPIC_BUCKET_CAP} in the route (SQL LIMIT — avoids unbounded groupBy in Node). */
export const DISCOVERY_SQL_TOPIC_LIMIT = 250;
/** Match {@link DISCOVERY_EXAM_BUCKET_CAP} in the route. */
export const DISCOVERY_SQL_EXAM_LIMIT = 120;

/** Postgres cancels discovery queries that exceed this (per transaction). */
export const DISCOVERY_STATEMENT_TIMEOUT_MS = 5_500;

/**
 * SQL fragment mirroring {@link questionAccessWhere} for `exam_questions` (subscriber / admin_override).
 * Keeps discovery aggregates bounded at the database (top-N groups only).
 */
export function examQuestionsDiscoveryWhereSql(entitlement: AccessScope): Prisma.Sql {
  if (!entitlement.hasAccess) return Prisma.sql`FALSE`;
  if (entitlement.reason === "admin_override") {
    return Prisma.sql`status = ${DB_PUBLISHED}`;
  }
  const country = entitlement.country as CountryCode | null;
  const tier = entitlement.tier as TierCode | null;
  if (!country || !tier) return Prisma.sql`FALSE`;
  const tiers = examQuestionTiersForUserTier(tier);
  if (tiers.length === 0) return Prisma.sql`FALSE`;
  const region =
    country === "CA"
      ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
      : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
  return Prisma.sql`status = ${DB_PUBLISHED} AND tier IN (${Prisma.join(tiers)}) AND ${region}`;
}

export type DiscoveryAggregateRow = { topic: string; cnt: bigint };
export type DiscoveryExamRow = { exam: string | null; cnt: bigint };

export async function loadSubscriberDiscoveryAggregates(entitlement: AccessScope): Promise<{
  total: number;
  topicRows: DiscoveryAggregateRow[];
  examRows: DiscoveryExamRow[];
}> {
  const w = examQuestionsDiscoveryWhereSql(entitlement);

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL statement_timeout = '${DISCOVERY_STATEMENT_TIMEOUT_MS}ms'`,
      );

      const [totalRows, topicRows, examRows] = await Promise.all([
        tx.$queryRaw<[{ n: bigint }]>`SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${w}`,
        tx.$queryRaw<DiscoveryAggregateRow[]>`
          SELECT topic, COUNT(*)::bigint AS cnt
          FROM exam_questions
          WHERE topic IS NOT NULL AND ${w}
          GROUP BY topic
          ORDER BY cnt DESC
          LIMIT ${DISCOVERY_SQL_TOPIC_LIMIT}
        `,
        tx.$queryRaw<DiscoveryExamRow[]>`
          SELECT exam, COUNT(*)::bigint AS cnt
          FROM exam_questions
          WHERE ${w}
          GROUP BY exam
          ORDER BY cnt DESC
          LIMIT ${DISCOVERY_SQL_EXAM_LIMIT}
        `,
      ]);

      const rawTotal = totalRows[0]?.n;
      const total = typeof rawTotal === "bigint" ? Number(rawTotal) : Number(rawTotal ?? 0);
      return { total, topicRows, examRows };
    },
    { maxWait: 8_000, timeout: 12_000 },
  );
}
