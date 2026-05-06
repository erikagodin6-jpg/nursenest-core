import { Prisma } from "@prisma/client";
import type { CountryCode, TierCode } from "@prisma/client";
import { DB_PUBLISHED, examQuestionTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";
import { examQuestionPoolWhereForContext } from "@/lib/exam-context/query-scope";
import {
  GENERAL_STUDY_BANK_MODULE_SCOPE_SQL,
  NON_ECG_GENERAL_BANK_SQL,
} from "@/lib/study-question-pool/study-question-pool-gates";

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
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
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

/** Reused by flashcards hub inventory so category buckets use the same pathway/exam scope as question discovery. */
export function discoveryExamContextScopeSql(ctx: GlobalExamContext | null): Prisma.Sql {
  if (!ctx) return Prisma.empty;
  const scoped = examQuestionPoolWhereForContext(ctx);
  if (scoped.examIn.length === 0 || scoped.tierMatches.length === 0) return Prisma.sql` AND FALSE`;
  return Prisma.sql`
    AND exam IN (${Prisma.join(scoped.examIn)})
    AND lower(coalesce(tier, '')) IN (${Prisma.join(scoped.tierMatches.map((tier) => tier.toLowerCase()))})
  `;
}

/**
 * Like {@link discoveryExamContextScopeSql} but returns `Prisma.empty` (no filter) rather than `AND FALSE`
 * when the exam context has no content keys — used by the flashcard hub fallback so that pathways with
 * empty `contentExamKeys` (e.g., international shells) can still see available exam questions rather
 * than always showing zero. Returns `{ sql, hasScope }` so callers know whether a scope was applied.
 *
 * Use in flashcard-specific paths only — do NOT replace the main `discoveryExamContextScopeSql` call
 * in practice/CAT routes, which intentionally short-circuit with AND FALSE for unregistered keys.
 */
export function discoveryExamContextScopeForFlashcardFallback(ctx: GlobalExamContext | null): {
  sql: Prisma.Sql;
  /** True when non-empty examIn + tierMatches produced an active WHERE fragment. */
  hasScopeFilter: boolean;
} {
  if (!ctx) return { sql: Prisma.empty, hasScopeFilter: false };
  const scoped = examQuestionPoolWhereForContext(ctx);
  if (scoped.examIn.length === 0 || scoped.tierMatches.length === 0) {
    // No content keys configured — skip exam scope entirely (let entitlement WHERE do the scoping).
    return { sql: Prisma.empty, hasScopeFilter: false };
  }
  const sql = Prisma.sql`
    AND exam IN (${Prisma.join(scoped.examIn)})
    AND lower(coalesce(tier, '')) IN (${Prisma.join(scoped.tierMatches.map((t) => t.toLowerCase()))})
  `;
  return { sql, hasScopeFilter: true };
}

export async function loadSubscriberDiscoveryAggregates(
  entitlement: AccessScope,
  examContext: GlobalExamContext | null = null,
): Promise<{
  total: number;
  topicRows: DiscoveryAggregateRow[];
  examRows: DiscoveryExamRow[];
}> {
  const w = examQuestionsDiscoveryWhereSql(entitlement);
  const { sql: primaryScope, hasScopeFilter } = discoveryExamContextScopeForFlashcardFallback(examContext);
  const surfaceGates = Prisma.sql`${NON_ECG_GENERAL_BANK_SQL}${GENERAL_STUDY_BANK_MODULE_SCOPE_SQL}`;

  const runScoped = async (
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    contextScope: Prisma.Sql,
  ) => {
    const [totalRows, topicRows, examRows] = await Promise.all([
      tx.$queryRaw<[{ n: bigint }]>`SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${w}${contextScope}${surfaceGates}`,
      tx.$queryRaw<DiscoveryAggregateRow[]>`
          SELECT topic, COUNT(*)::bigint AS cnt
          FROM exam_questions
          WHERE topic IS NOT NULL AND ${w}${contextScope}${surfaceGates}
          GROUP BY topic
          ORDER BY cnt DESC
          LIMIT ${DISCOVERY_SQL_TOPIC_LIMIT}
        `,
      tx.$queryRaw<DiscoveryExamRow[]>`
          SELECT exam, COUNT(*)::bigint AS cnt
          FROM exam_questions
          WHERE ${w}${contextScope}${surfaceGates}
          GROUP BY exam
          ORDER BY cnt DESC
          LIMIT ${DISCOVERY_SQL_EXAM_LIMIT}
        `,
    ]);
    const rawTotal = totalRows[0]?.n;
    const total = typeof rawTotal === "bigint" ? Number(rawTotal) : Number(rawTotal ?? 0);
    return { total, topicRows, examRows };
  };

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL statement_timeout = '${DISCOVERY_STATEMENT_TIMEOUT_MS}ms'`,
      );

      let out = await runScoped(tx, primaryScope);
      if (out.total === 0 && hasScopeFilter) {
        out = await runScoped(tx, Prisma.empty);
      }
      return out;
    },
    { maxWait: 8_000, timeout: 12_000 },
  );
}
