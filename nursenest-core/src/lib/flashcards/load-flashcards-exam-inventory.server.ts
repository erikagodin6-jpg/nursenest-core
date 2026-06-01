import "server-only";

import { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  applyCountsToBuilderCategories,
  type BuilderCategoryOption,
} from "@/lib/flashcards/flashcard-builder-taxonomy";
import {
  flashcardLearnerExamPoolCandidateScopes,
  flashcardLearnerExamPoolWhereSql,
} from "@/lib/flashcards/flashcard-learner-exam-pool-sql";
import { getStudyLinkPathwayColumnExists } from "@/lib/flashcards/flashcard-exam-pool-column-guard";
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

export type ScopeResolutionDenialCode =
  | "subscription_no_access"
  | "missing_tier_after_coalesce"
  | "missing_country_after_coalesce"
  | "country_mismatch"
  | "tier_ladder_mismatch"
  | "pathway_hidden";

/** How tier/country were resolved for the exam pool (no user ids). */
export type ResolvedFlashcardPoolAccess = {
  scope: AccessScope | null;
  tierResolutionSource: FlashcardPoolAccessTierCountrySource;
  countryResolutionSource: FlashcardPoolAccessTierCountrySource;
  /** True when a `User` row was read to fill missing tier/country on the entitlement scope. */
  entitlementTierCountryUserRowCoalesce: boolean;
  /** Populated when scope is null — machine-readable denial reason for diagnostics. */
  denialCode?: ScopeResolutionDenialCode;
  /** Human-readable denial detail for log events. Never null when denialCode is set. */
  denialDetail?: string;
};

function tierCountrySource(
  hadEntitlementValue: boolean,
  hadValueAfterUserCoalesce: boolean,
): FlashcardPoolAccessTierCountrySource {
  if (hadEntitlementValue) return "entitlement";
  if (hadValueAfterUserCoalesce) return "user_profile";
  return "pathway_catalog_default";
}

function buildDenialDetail(args: {
  code: ScopeResolutionDenialCode;
  userTier: string;
  userCountry: string;
  pathwayId: string;
  pathwayTier: string;
  pathwayCountry: string;
  tierSource: FlashcardPoolAccessTierCountrySource;
  countrySource: FlashcardPoolAccessTierCountrySource;
}): string {
  switch (args.code) {
    case "subscription_no_access":
      return `User subscription does not grant hasAccess=true. Pathway: ${args.pathwayId}`;
    case "missing_tier_after_coalesce":
      return `tier is null after entitlement + User row coalesce. Pathway requires tier=${args.pathwayTier}. tierSource=${args.tierSource}`;
    case "missing_country_after_coalesce":
      return `country is null after entitlement + User row coalesce. Pathway requires country=${args.pathwayCountry}. countrySource=${args.countrySource}`;
    case "country_mismatch":
      return `User country=${args.userCountry} does not match pathway country=${args.pathwayCountry} (pathway=${args.pathwayId}). countrySource=${args.countrySource}`;
    case "tier_ladder_mismatch":
      return `User tier=${args.userTier} is not in the tier ladder for pathway stripeTier=${args.pathwayTier} (pathway=${args.pathwayId}). tierSource=${args.tierSource}`;
    case "pathway_hidden":
      return `Pathway ${args.pathwayId} is hidden (status=hidden); access denied for all subscribers.`;
  }
}

/**
 * Resolves tier/country for `ExamQuestion` gates when subscription-derived `AccessScope`
 * is missing `country` and/or `tier` (e.g. `planCountry` not yet synced) by coalescing from
 * the `User` row, then the pathway catalog — then verifies pathway coverage like CAT.
 *
 * Never returns scope:null silently — denial always includes a denialCode + denialDetail for
 * structured log events. Callers must log the denialCode when scope is null.
 *
 * Phase 3C: in-process memoization with 30-second TTL.
 * Within a single session-launch the same (userId, tier, country, pathwayId) tuple may be
 * called from the eager pool chain AND from loadFlashcardsExamInventoryForPathway.
 * Caching the result eliminates the duplicate User row lookup.
 */
type AccessMemoEntry = { result: ResolvedFlashcardPoolAccess; expiresAt: number };
const _accessMemoMap = new Map<string, AccessMemoEntry>();
const ACCESS_MEMO_TTL_MS = 30_000;

function accessMemoKey(userId: string, entitlement: AccessScope, pathwayId: string): string {
  return `${userId}:${String(entitlement.tier)}:${String(entitlement.country)}:${pathwayId}`;
}

export async function resolveAccessScopeForPathwayExamQuestionPool(
  userId: string,
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition,
): Promise<ResolvedFlashcardPoolAccess> {
  // Phase 3C: return cached result if still fresh (avoids User row DB lookup on repeated calls).
  const memoKey = accessMemoKey(userId, entitlement, pathway.id);
  const now = Date.now();
  const memoHit = _accessMemoMap.get(memoKey);
  if (memoHit && memoHit.expiresAt > now) return memoHit.result;

  function denied(
    code: ScopeResolutionDenialCode,
    tierResolutionSource: FlashcardPoolAccessTierCountrySource,
    countryResolutionSource: FlashcardPoolAccessTierCountrySource,
    entitlementTierCountryUserRowCoalesce: boolean,
    resolvedTier: string,
    resolvedCountry: string,
  ): ResolvedFlashcardPoolAccess {
    const denialDetail = buildDenialDetail({
      code,
      userTier: resolvedTier,
      userCountry: resolvedCountry,
      pathwayId: pathway.id,
      pathwayTier: pathway.stripeTier,
      pathwayCountry: pathway.countryCode,
      tierSource: tierResolutionSource,
      countrySource: countryResolutionSource,
    });
    return {
      scope: null,
      tierResolutionSource,
      countryResolutionSource,
      entitlementTierCountryUserRowCoalesce,
      denialCode: code,
      denialDetail,
    };
  }

  if (!entitlement.hasAccess) {
    return denied(
      "subscription_no_access",
      "entitlement",
      "entitlement",
      false,
      String(entitlement.tier ?? ""),
      String(entitlement.country ?? ""),
    );
  }

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
  const tierSrc = tierCountrySource(hadEntTier, tierAfterUser != null);
  const countrySrc = tierCountrySource(hadEntCountry, countryAfterUser != null);

  tier = tier ?? pathway.stripeTier;
  country = country ?? pathway.countryCode;

  // Diagnose the specific denial reason so callers can log actionable detail.
  if (!tier) {
    return denied("missing_tier_after_coalesce", tierSrc, countrySrc, entitlementTierCountryUserRowCoalesce, "", String(country ?? ""));
  }
  if (!country) {
    return denied("missing_country_after_coalesce", tierSrc, countrySrc, entitlementTierCountryUserRowCoalesce, String(tier), "");
  }
  if (pathway.status === "hidden") {
    return denied("pathway_hidden", tierSrc, countrySrc, entitlementTierCountryUserRowCoalesce, String(tier), String(country));
  }
  if (country !== pathway.countryCode) {
    return denied("country_mismatch", tierSrc, countrySrc, entitlementTierCountryUserRowCoalesce, String(tier), String(country));
  }
  const accessibleTiers = prismaTierCodesForProfileTier(tier as Parameters<typeof prismaTierCodesForProfileTier>[0]);
  if (!accessibleTiers.includes(pathway.stripeTier)) {
    return denied("tier_ladder_mismatch", tierSrc, countrySrc, entitlementTierCountryUserRowCoalesce, String(tier), String(country));
  }

  const coalesced: AccessScope = { ...entitlement, tier, country };
  // Belt-and-suspenders: re-run the canonical check in case the pathway policy adds more rules.
  if (!subscriptionCoversPathwayBase(coalesced, pathway)) {
    return denied("tier_ladder_mismatch", tierSrc, countrySrc, entitlementTierCountryUserRowCoalesce, String(tier), String(country));
  }

  const result: ResolvedFlashcardPoolAccess = {
    scope: coalesced,
    tierResolutionSource: tierSrc,
    countryResolutionSource: countrySrc,
    entitlementTierCountryUserRowCoalesce,
  };
  // Memoize successful access resolution — avoids redundant User row lookup within TTL window.
  if (_accessMemoMap.size > 500) _accessMemoMap.clear(); // Prevent unbounded growth across long-lived processes.
  _accessMemoMap.set(memoKey, { result, expiresAt: Date.now() + ACCESS_MEMO_TTL_MS });
  return result;
}

const FLASHCARD_INVENTORY_GROUP_BY_LIMIT = 500;

function flashcardsInventoryStatementTimeoutMs(): number {
  const raw = process.env.NN_FLASHCARDS_INVENTORY_STATEMENT_TIMEOUT_MS?.trim();
  const n = raw ? Number(raw) : 8000;
  if (!Number.isFinite(n)) return 8000;
  return Math.max(1500, Math.min(30_000, Math.floor(n)));
}

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
      denialCode: accessResolved.denialCode ?? "unknown",
      denialDetail: accessResolved.denialDetail?.slice(0, 400) ?? "",
    });
    return {
      ok: false,
      code: accessResolved.denialCode ?? "pathway_not_entitled",
      message: "This pathway is not available for your subscription.",
    };
  }

  const hasStudyLinkCol = await getStudyLinkPathwayColumnExists();

  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(pathway.id);
  const statementTimeoutMs = flashcardsInventoryStatementTimeoutMs();

  let legacyWhereForPrisma: ReturnType<typeof getCanonicalExamQuestionWhereForPathway> | null = null;
  if (!accessScopeIsStaffLearnerEntitlementBypass(poolScope)) {
    try {
      legacyWhereForPrisma = getCanonicalExamQuestionWhereForPathway(poolScope, pathway);
    } catch {
      legacyWhereForPrisma = null;
    }
  }

  const prismaAggStarted = performance.now();
  const candidateScopes = flashcardLearnerExamPoolCandidateScopes(poolScope, pathway);
  const txResult = await prisma.$transaction(
    async (tx) => {
      // Bound aggregate queries so a single slow exam_questions scan doesn't wedge learner study surfaces.
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = ${statementTimeoutMs}`);

      let selectedTotalRow: [{ n: bigint }] = [{ n: BigInt(0) }];
      let selectedGroupRows: GroupRow[] = [];
      let selectedPoolScope = poolScope;
      let regionalFallbackUsed = false;

      for (let i = 0; i < candidateScopes.length; i += 1) {
        const candidateScope = candidateScopes[i] ?? poolScope;
        const whereSql = flashcardLearnerExamPoolWhereSql(candidateScope, pathway, hasStudyLinkCol);
        const [totalRow, groupRows] = await Promise.all([
          tx.$queryRaw<[{ n: bigint }]>`
            SELECT COUNT(*)::bigint AS n FROM exam_questions
            WHERE ${whereSql}
          `,
          tx.$queryRaw<GroupRow[]>`
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
        ]);
        selectedTotalRow = totalRow;
        selectedGroupRows = groupRows;
        selectedPoolScope = candidateScope;
        regionalFallbackUsed = i > 0;
        if (bn(totalRow[0]?.n) > 0 || i === candidateScopes.length - 1) break;

        safeServerLog("flashcards", "exam_inventory_candidate_scope_zero", {
          pathwayId: pathway.id,
          country: candidateScope.country != null ? String(candidateScope.country) : "",
          tier: candidateScope.tier != null ? String(candidateScope.tier) : "",
          nextCandidateAvailable: i + 1 < candidateScopes.length ? 1 : 0,
        });
      }

      return {
        totalRow: selectedTotalRow,
        groupRows: selectedGroupRows,
        selectedPoolScope,
        regionalFallbackUsed,
      };
    },
    {
      maxWait: 10_000,
      timeout: Math.min(60_000, statementTimeoutMs + 10_000),
    },
  );

  const prismaParallelAggregateMs = Math.round(performance.now() - prismaAggStarted);

  const total = bn(txResult.totalRow[0]?.n);
  const groupRows = txResult.groupRows;
  const loadDiagnosticCounts = process.env.FLASHCARD_INVENTORY_DIAGNOSTIC_COUNTS === "1";
  const [dedicatedFlashcardCount, legacyCanonicalPrismaPoolCount] = loadDiagnosticCounts
    ? await Promise.all([
        prisma.flashcard
          .count({
            where: {
              status: ContentStatus.PUBLISHED,
              AND: [
                flashcardAccessWhere(poolScope, pathwayOpts),
                { deck: { pathwayId: pathway.id } },
              ],
            },
          })
          .catch((error) => {
            safeServerLog("flashcards", "exam_inventory_dedicated_flashcard_count_failed", {
              pathwayId: pathway.id,
              error: error instanceof Error ? error.message.slice(0, 240) : "unknown",
            });
            return 0;
          }),
        legacyWhereForPrisma
          ? prisma.examQuestion
              .count({ where: legacyWhereForPrisma })
              .catch((error) => {
                safeServerLog("flashcards", "exam_inventory_legacy_prisma_count_failed", {
                  pathwayId: pathway.id,
                  error: error instanceof Error ? error.message.slice(0, 240) : "unknown",
                });
                return null;
              })
          : Promise.resolve(null),
      ])
    : [0, null];
  const legacyCanonicalPrismaCountMs = 0;

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
    tier: txResult.selectedPoolScope.tier != null ? String(txResult.selectedPoolScope.tier) : null,
    country: txResult.selectedPoolScope.country != null ? String(txResult.selectedPoolScope.country) : null,
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
    regionalFallbackUsed: txResult.regionalFallbackUsed ? 1 : 0,
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
