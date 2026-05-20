import "server-only";

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  applyCountsToBuilderCategories,
  type BuilderCategoryOption,
} from "@/lib/flashcards/flashcard-builder-taxonomy";
import { flashcardLearnerExamPoolWhereSql } from "@/lib/flashcards/flashcard-learner-exam-pool-sql";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";
import { foldExamQuestionTopicBodyGroupsIntoBuilderCounts } from "@/lib/flashcards/flashcards-exam-inventory-counts";
import type { FlashcardsPoolInventoryDiagnostics } from "@/lib/flashcards/flashcards-hub-types";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { getCanonicalExamQuestionWhereForPathway } from "@/lib/study-question-pool/canonical-exam-question-where";

export type FlashcardsExamInventoryLoadResult =
  | {
      ok: true;
      total: number;
      categoryOptions: BuilderCategoryOption[];
      countsByBuilderId: Record<string, number>;
      diagnostics: FlashcardsPoolInventoryDiagnostics;
    }
  | { ok: false; code: string; message: string };

function bn(v: bigint | number | null | undefined): number {
  if (v == null) return 0;
  return typeof v === "bigint" ? Number(v) : Number(v);
}

export type FlashcardPoolAccessTierCountrySource = "entitlement" | "user_profile" | "pathway_catalog_default";

/** How tier/country were resolved for the exam pool (no user ids). */
export type ResolvedFlashcardPoolAccess = {
  scope: AccessScope | null;
  tierResolutionSource: FlashcardPoolAccessTierCountrySource;
  countryResolutionSource: FlashcardPoolAccessTierCountrySource;
  /** True when a `User` row was read to fill missing tier/country on the entitlement scope. */
  entitlementTierCountryUserRowCoalesce: boolean;
};

function tierCountrySource(
  hadEntitlementValue: boolean,
  hadValueAfterUserCoalesce: boolean,
): FlashcardPoolAccessTierCountrySource {
  if (hadEntitlementValue) return "entitlement";
  if (hadValueAfterUserCoalesce) return "user_profile";
  return "pathway_catalog_default";
}

/**
 * Resolves tier/country for `ExamQuestion` gates when subscription-derived `AccessScope`
 * is missing `country` and/or `tier` (e.g. `planCountry` not yet synced) by coalescing from
 * the `User` row, then the pathway catalog — then verifies pathway coverage like CAT.
 */
export async function resolveAccessScopeForPathwayExamQuestionPool(
  userId: string,
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition,
): Promise<ResolvedFlashcardPoolAccess> {
  function denied(
    tierResolutionSource: FlashcardPoolAccessTierCountrySource,
    countryResolutionSource: FlashcardPoolAccessTierCountrySource,
    entitlementTierCountryUserRowCoalesce: boolean,
  ): ResolvedFlashcardPoolAccess {
    return {
      scope: null,
      tierResolutionSource,
      countryResolutionSource,
      entitlementTierCountryUserRowCoalesce,
    };
  }

  if (!entitlement.hasAccess) return denied("entitlement", "entitlement", false);
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return {
      scope: entitlement,
      tierResolutionSource: "entitlement",
      countryResolutionSource: "entitlement",
      entitlementTierCountryUserRowCoalesce: false,
    };
  }

  const hadEntTier = entitlement.tier != null;
  const hadEntCountry = entitlement.country != null && String(entitlement.country).trim() !== "";

  let tier = entitlement.tier ?? null;
  let country = entitlement.country ?? null;
  let entitlementTierCountryUserRowCoalesce = false;

  if (!tier || !country) {
    entitlementTierCountryUserRowCoalesce = true;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true, country: true },
    });
    if (!tier) tier = user?.tier ?? null;
    if (!country) country = user?.country ?? null;
  }

  const tierAfterUser = tier;
  const countryAfterUser = country;
  tier = tier ?? pathway.stripeTier;
  country = country ?? pathway.countryCode;

  const coalesced: AccessScope = { ...entitlement, tier, country };
  if (!subscriptionCoversPathwayBase(coalesced, pathway)) {
    return denied(
      tierCountrySource(hadEntTier, tierAfterUser != null),
      tierCountrySource(hadEntCountry, countryAfterUser != null),
      entitlementTierCountryUserRowCoalesce,
    );
  }

  return {
    scope: coalesced,
    tierResolutionSource: tierCountrySource(hadEntTier, tierAfterUser != null),
    countryResolutionSource: tierCountrySource(hadEntCountry, countryAfterUser != null),
    entitlementTierCountryUserRowCoalesce,
  };
}

const FLASHCARD_INVENTORY_GROUP_BY_LIMIT = 500;

type GroupRow = { bodySystem: string | null; topic: string | null; cnt: bigint };

/**
 * ExamQuestion-backed flashcard hub inventory: pathway-scoped pool using **normalized exam keys**
 * (same SQL stack as core pathway audits / discovery), plus flashcard usability gates.
 * Uses aggregate queries only (COUNT + bounded GROUP BY) — no `findMany` of full question rows.
 */
export async function loadFlashcardsExamInventoryForPathway(args: {
  userId: string;
  entitlement: AccessScope;
  pathway: ExamPathwayDefinition;
}): Promise<FlashcardsExamInventoryLoadResult> {
  const { userId, entitlement, pathway } = args;
  const loadStarted = performance.now();

  const accessResolved = await resolveAccessScopeForPathwayExamQuestionPool(userId, entitlement, pathway);
  const resolveAccessMs = Math.round(performance.now() - loadStarted);
  const poolScope = accessResolved.scope;
  if (!poolScope) {
    safeServerLog("flashcards", "exam_inventory_access_denied", {
      pathwayId: pathway.id,
      resolveAccessMs,
      tierResolutionSource: accessResolved.tierResolutionSource,
      countryResolutionSource: accessResolved.countryResolutionSource,
      entitlementUserRowCoalesce: accessResolved.entitlementTierCountryUserRowCoalesce,
    });
    return {
      ok: false,
      code: "pathway_not_entitled",
      message: "This pathway is not available for your subscription.",
    };
  }

  const whereSql = flashcardLearnerExamPoolWhereSql(poolScope, pathway);

  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(pathway.id);
  const prismaAggStarted = performance.now();
  const [totalRow, groupRows, dedicatedFlashcardCount] = await Promise.all([
    prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM exam_questions
      WHERE ${whereSql}
    `,
    prisma.$queryRaw<GroupRow[]>`
      SELECT
        body_system AS "bodySystem",
        topic,
        COUNT(*)::bigint AS cnt
      FROM exam_questions
      WHERE ${whereSql}
      GROUP BY body_system, topic
      ORDER BY cnt DESC NULLS LAST
      LIMIT ${FLASHCARD_INVENTORY_GROUP_BY_LIMIT}
    `,
    prisma.flashcard.count({
      where: {
        status: ContentStatus.PUBLISHED,
        AND: [
          flashcardAccessWhere(poolScope, pathwayOpts),
          { deck: { pathwayId: pathway.id } },
        ],
      },
    }),
  ]);
  const prismaParallelAggregateMs = Math.round(performance.now() - prismaAggStarted);

  const total = bn(totalRow[0]?.n);

  let legacyCanonicalPrismaPoolCount: number | null = null;
  let legacyCanonicalPrismaCountMs = 0;
  if (!accessScopeIsStaffLearnerEntitlementBypass(poolScope)) {
    const tLeg = performance.now();
    try {
      const legacyWhere = getCanonicalExamQuestionWhereForPathway(poolScope, pathway);
      legacyCanonicalPrismaPoolCount = await prisma.examQuestion.count({ where: legacyWhere });
    } catch {
      legacyCanonicalPrismaPoolCount = null;
    }
    legacyCanonicalPrismaCountMs = Math.round(performance.now() - tLeg);
  }

  const groups = groupRows.map((g) => ({
    bodySystem: g.bodySystem,
    topic: g.topic,
    _count: { _all: bn(g.cnt) },
  }));

  const summed = groups.reduce((s, g) => s + g._count._all, 0);
  let aggregateSumMismatch = false;
  let groupByCapped = false;
  if (summed !== total && groupRows.length >= FLASHCARD_INVENTORY_GROUP_BY_LIMIT) {
    groupByCapped = true;
    safeServerLog("flashcards", "exam_inventory_groupby_capped", {
      pathwayId: pathway.id,
      total,
      summed,
      cap: FLASHCARD_INVENTORY_GROUP_BY_LIMIT,
    });
  } else if (summed !== total) {
    aggregateSumMismatch = true;
    safeServerLog("flashcards", "exam_inventory_aggregate_sum_mismatch", {
      pathwayId: pathway.id,
      total,
      summed,
      buckets: groups.length,
    });
  }

  const foldStarted = performance.now();
  const countsByBuilderId = foldExamQuestionTopicBodyGroupsIntoBuilderCounts(groups, pathway.id);
  const categoryOptions = applyCountsToBuilderCategories(pathway.id, countsByBuilderId);
  const categoryFoldMs = Math.round(performance.now() - foldStarted);

  const diagnostics: FlashcardsPoolInventoryDiagnostics = {
    pathwayId: pathway.id,
    examQuestionSqlPoolCount: total,
    legacyCanonicalPrismaPoolCount,
    dedicatedFlashcardRowCount: dedicatedFlashcardCount,
    tier: poolScope.tier != null ? String(poolScope.tier) : null,
    country: poolScope.country != null ? String(poolScope.country) : null,
    poolSource: "flashcard_learner_exam_norm_sql_v1",
    ...(total === 0
      ? {
          zeroHint:
            "No rows matched published + entitlement + pathway scope + flashcard quality gates. If audits show a pool, check exam column normalization vs. pathway contentExamKeys, tier/region, or add study_link_pathway_id on rows that belong to this track.",
        }
      : {}),
  };

  const pathwayDefaultUsedForAccess =
    accessResolved.tierResolutionSource === "pathway_catalog_default" ||
    accessResolved.countryResolutionSource === "pathway_catalog_default";

  const totalLoadMs = Math.round(performance.now() - loadStarted);

  if (
    total === 0 &&
    (legacyCanonicalPrismaPoolCount === null || aggregateSumMismatch || groupByCapped)
  ) {
    safeServerLogCritical(
      "flashcards",
      "FLASHCARDS_CRITICAL_EMPTY_POOL",
      {
        pathwayId: pathway.id,
        totalLoadMs,
        prismaParallelAggregateMs,
        legacyCanonicalPrismaCountMs,
        categoryFoldMs,
        legacyCountNull: legacyCanonicalPrismaPoolCount === null ? 1 : 0,
        aggregateSumMismatch: aggregateSumMismatch ? 1 : 0,
        groupByCapped: groupByCapped ? 1 : 0,
      },
      undefined,
      { flow: "flashcards_exam_inventory" },
    );
  }

  safeServerLog("flashcards", "exam_inventory_load_complete", {
    pathwayId: pathway.id,
    totalLoadMs,
    resolveAccessMs,
    prismaParallelAggregateMs,
    legacyCanonicalPrismaCountMs,
    categoryFoldMs,
    total,
    matchingCards: total,
    categoriesReturned: categoryOptions.length,
    distinctTopicBodyBuckets: groups.length,
    dedicatedFlashcardRowCount: dedicatedFlashcardCount,
    legacyCanonicalPrismaPoolCount: legacyCanonicalPrismaPoolCount ?? undefined,
    tierResolutionSource: accessResolved.tierResolutionSource,
    countryResolutionSource: accessResolved.countryResolutionSource,
    entitlementUserRowCoalesce: accessResolved.entitlementTierCountryUserRowCoalesce,
    pathwayCatalogDefaultUsed: pathwayDefaultUsedForAccess ? 1 : 0,
    groupByCapped: groupByCapped ? 1 : 0,
    aggregateSumMismatch: aggregateSumMismatch ? 1 : 0,
  });

  return {
    ok: true,
    total,
    categoryOptions,
    countsByBuilderId,
    diagnostics,
  };
}
