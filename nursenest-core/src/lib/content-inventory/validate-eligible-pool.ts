/**
 * validateEligiblePool — shared pool-availability validator for all learning surfaces.
 *
 * Used by Flashcards, CAT, Practice Tests, Study Plans, Weak Areas, and Readiness Analytics
 * to guard against surfacing recommendations for empty content pools.
 *
 * All surfaces route through the same canonical WHERE so counts are consistent.
 */
import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { normalizePathwayIdForStudySurfaces } from "@/lib/study-question-pool/study-pathway-normalize";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { contentInventoryResolver } from "@/lib/content-inventory/content-inventory-resolver";
import type { ContentInventorySurface } from "@/lib/content-inventory/content-inventory-resolver";

// ─── Public types ──────────────────────────────────────────────────────────────

export type PoolEligibilityCode =
  | "eligible"           // Pool has content for this surface
  | "empty_exam_pool"    // ExamQuestion eligible count = 0
  | "empty_flashcard_pool"  // Flashcard total pool = 0
  | "empty_all_pools"    // Both exam and flashcard pools = 0
  | "access_denied"      // Entitlement doesn't cover pathway
  | "pathway_not_found"; // Pathway ID not in registry

export type EntitlementResult = {
  ok: boolean;
  hasAccess: boolean;
  tier: string;
  country: string;
  pathway: string;
};

export type EligiblePoolResult = {
  /** Count of eligible questions/cards for this surface. */
  poolCount: number;
  /** Machine-readable eligibility code. */
  eligibilityCode: PoolEligibilityCode;
  /** Human-readable reason string, safe for log events. */
  eligibilityReason: string;
  /** Entitlement gate outcome for diagnostics. */
  entitlementResult: EntitlementResult;
  /**
   * Per-surface breakdown — same data as contentInventoryResolver.bySurface
   * but typed specifically for the requested surface.
   */
  surfacePoolCount: number;
  /** True when the pool is non-empty and the surface can offer content. */
  canStudy: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function surfacePoolCount(
  surface: ContentInventorySurface,
  bySurface: {
    catPool: number;
    practicePool: number;
    flashcardExamPool: number;
    flashcardDedicatedPool: number;
    flashcardTotalPool: number;
    studyPlanEffectivePool: number;
  },
): number {
  switch (surface) {
    case "cat":       return bySurface.catPool;
    case "practice":  return bySurface.practicePool;
    case "flashcards": return bySurface.flashcardTotalPool;
    case "study_plan":
    case "weak_areas":
    case "readiness": return bySurface.studyPlanEffectivePool;
  }
}

function deriveEligibilityCode(
  surface: ContentInventorySurface,
  bySurface: {
    catPool: number;
    flashcardTotalPool: number;
    studyPlanEffectivePool: number;
  },
): PoolEligibilityCode {
  const cat = bySurface.catPool;
  const fc = bySurface.flashcardTotalPool;
  if (surface === "flashcards") {
    return fc > 0 ? "eligible" : "empty_flashcard_pool";
  }
  if (surface === "cat" || surface === "practice") {
    return cat > 0 ? "eligible" : "empty_exam_pool";
  }
  // study_plan, weak_areas, readiness: check combined
  const combined = bySurface.studyPlanEffectivePool;
  if (combined > 0) return "eligible";
  if (cat === 0 && fc === 0) return "empty_all_pools";
  if (cat === 0) return "empty_exam_pool";
  return "empty_flashcard_pool";
}

function reasonForCode(
  code: PoolEligibilityCode,
  surface: ContentInventorySurface,
  pathwayId: string,
  tier: string,
  country: string,
): string {
  switch (code) {
    case "eligible":
      return `Pool has content for surface=${surface} pathway=${pathwayId} tier=${tier} country=${country}`;
    case "empty_exam_pool":
      return `ExamQuestion pool is 0 for pathway=${pathwayId} tier=${tier} country=${country}. Check exam column normalization vs. contentExamKeys, tier ladder, and region scope.`;
    case "empty_flashcard_pool":
      return `Flashcard pool (exam-backed + dedicated) is 0 for pathway=${pathwayId} tier=${tier} country=${country}. Check flashcardAccessWhere and deck.pathwayId matching.`;
    case "empty_all_pools":
      return `Both exam and flashcard pools are 0 for pathway=${pathwayId} tier=${tier} country=${country}. All study surfaces unavailable.`;
    case "access_denied":
      return `Entitlement does not cover pathway=${pathwayId} tier=${tier} country=${country}`;
    case "pathway_not_found":
      return `Pathway ${pathwayId} not found in exam registry`;
  }
}

// ─── Primary export ────────────────────────────────────────────────────────────

/**
 * Validate whether a study surface has an eligible content pool for the given entitlement
 * and pathway.
 *
 * Callers should suppress recommendations and log a diagnostic event when `canStudy` is false.
 *
 * @param suppressLog - Pass true to skip internal log events (e.g., already logging at call site).
 */
export async function validateEligiblePool(args: {
  entitlement: AccessScope;
  pathwayId: string;
  surface: ContentInventorySurface;
  suppressLog?: boolean;
}): Promise<EligiblePoolResult> {
  const { entitlement, surface } = args;
  const normalizedPathwayId = normalizePathwayIdForStudySurfaces(args.pathwayId, entitlement.country);
  const pathway = getExamPathwayById(normalizedPathwayId) ?? null;

  const tier = String(entitlement.tier ?? "");
  const country = String(entitlement.country ?? "");

  if (!pathway) {
    return {
      poolCount: 0,
      eligibilityCode: "pathway_not_found",
      eligibilityReason: reasonForCode("pathway_not_found", surface, normalizedPathwayId, tier, country),
      entitlementResult: { ok: false, hasAccess: entitlement.hasAccess, tier, country, pathway: normalizedPathwayId },
      surfacePoolCount: 0,
      canStudy: false,
    };
  }

  if (!entitlement.hasAccess) {
    return {
      poolCount: 0,
      eligibilityCode: "access_denied",
      eligibilityReason: reasonForCode("access_denied", surface, normalizedPathwayId, tier, country),
      entitlementResult: { ok: false, hasAccess: false, tier, country, pathway: normalizedPathwayId },
      surfacePoolCount: 0,
      canStudy: false,
    };
  }

  const resolved = await contentInventoryResolver({ entitlement, pathwayId: args.pathwayId, surface });

  const count = surfacePoolCount(surface, resolved.bySurface);
  const code = deriveEligibilityCode(surface, resolved.bySurface);
  const reason = reasonForCode(code, surface, normalizedPathwayId, tier, country);
  const canStudy = code === "eligible";

  if (!canStudy && !args.suppressLog) {
    safeServerLog("content_inventory", "validate_eligible_pool_empty", {
      surface,
      pathwayId: normalizedPathwayId,
      tier,
      country,
      eligibilityCode: code,
      catPool: resolved.bySurface.catPool,
      flashcardTotalPool: resolved.bySurface.flashcardTotalPool,
      studyPlanEffectivePool: resolved.bySurface.studyPlanEffectivePool,
      parityOk: resolved.examPoolParityOk ? 1 : 0,
      parityDelta: resolved.examPoolParityDelta,
    });
  }

  return {
    poolCount: count,
    eligibilityCode: code,
    eligibilityReason: reason,
    entitlementResult: { ok: true, hasAccess: true, tier, country, pathway: normalizedPathwayId },
    surfacePoolCount: count,
    canStudy,
  };
}
