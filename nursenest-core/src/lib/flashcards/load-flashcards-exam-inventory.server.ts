import "server-only";

import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  applyCountsToBuilderCategories,
  resolveBuilderCategoryId,
  type BuilderCategoryOption,
} from "@/lib/flashcards/flashcard-builder-taxonomy";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getCanonicalExamQuestionWhereForPathway } from "@/lib/study-question-pool/canonical-exam-question-where";

const INVENTORY_CAP = 8000;

export type FlashcardsExamInventoryLoadResult =
  | {
      ok: true;
      total: number;
      categoryOptions: BuilderCategoryOption[];
      countsByBuilderId: Record<string, number>;
    }
  | { ok: false; code: string; message: string };

/**
 * Resolves tier/country for `ExamQuestion` gates when subscription-derived `AccessScope`
 * is missing `country` and/or `tier` (e.g. `planCountry` not yet synced) by coalescing from
 * the `User` row, then the pathway catalog — then verifies pathway coverage like CAT.
 */
export async function resolveAccessScopeForPathwayExamQuestionPool(
  userId: string,
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition,
): Promise<AccessScope | null> {
  if (!entitlement.hasAccess) return null;
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) return entitlement;

  let tier = entitlement.tier;
  let country = entitlement.country;

  if (!tier || !country) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true, country: true },
    });
    if (!tier) tier = user?.tier ?? null;
    if (!country) country = user?.country ?? null;
  }

  tier = tier ?? pathway.stripeTier;
  country = country ?? pathway.countryCode;

  const coalesced: AccessScope = { ...entitlement, tier, country };
  if (!subscriptionCoversPathwayBase(coalesced, pathway)) return null;
  return coalesced;
}

/**
 * ExamQuestion-backed flashcard hub inventory: pathway-scoped pool (CAT-aligned), bounded `findMany`,
 * builder-category counts for hub UI.
 */
export async function loadFlashcardsExamInventoryForPathway(args: {
  userId: string;
  entitlement: AccessScope;
  pathway: ExamPathwayDefinition;
}): Promise<FlashcardsExamInventoryLoadResult> {
  const { userId, entitlement, pathway } = args;
  const poolScope = await resolveAccessScopeForPathwayExamQuestionPool(userId, entitlement, pathway);
  if (!poolScope) {
    return {
      ok: false,
      code: "pathway_not_entitled",
      message: "This pathway is not available for your subscription.",
    };
  }

  const where = getCanonicalExamQuestionWhereForPathway(poolScope, pathway);
  const questions = await prisma.examQuestion.findMany({
    where,
    select: { id: true, bodySystem: true, topic: true },
    take: INVENTORY_CAP,
    orderBy: { id: "asc" },
  });

  safeServerLog("flashcards", "exam_inventory_raw_total", {
    pathwayId: pathway.id,
    userIdPrefix: userId.slice(0, 8),
    total: questions.length,
  });

  if (questions.length === 0) {
    return {
      ok: false,
      code: "CRITICAL_EMPTY_POOL",
      message: "Flashcard pool is empty but should not be",
    };
  }

  const countsByBuilderId: Record<string, number> = {};
  for (const q of questions) {
    const categoryId = resolveBuilderCategoryId({
      label: q.topic?.trim() || q.bodySystem?.trim() || "General",
      topicCode: null,
      pathwayId: pathway.id,
      deckTitle: null,
      front: "",
      back: "",
      examBodySystem: q.bodySystem,
      examTopic: q.topic,
    });
    countsByBuilderId[categoryId] = (countsByBuilderId[categoryId] ?? 0) + 1;
  }

  const categoryOptions = applyCountsToBuilderCategories(pathway.id, countsByBuilderId);
  return {
    ok: true,
    total: questions.length,
    categoryOptions,
    countsByBuilderId,
  };
}
