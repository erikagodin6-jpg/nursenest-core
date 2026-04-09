/**
 * Server-side CAT (adaptive practice) eligibility — **source of truth** for marketing CAT page and API hardening.
 * Client UI must mirror this for UX only; never rely on client checks for security.
 */
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  pathwayAllowsCatAdaptiveStart,
  subscriptionCoversPathwayBase,
} from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { assessCatPracticeReadinessForPathway } from "@/lib/practice-tests/cat-practice-readiness";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { marketingCatPathForPathway } from "@/lib/exam-pathways/practice-exams-cat-start";

/** Log / metrics codes — safe for server logs, not shown verbatim to users. */
export type CatEligibilityLogCode =
  | "CAT_OK"
  | "CAT_UNAUTHENTICATED"
  | "CAT_INVALID_PATHWAY"
  | "CAT_PATHWAY_UPCOMING"
  | "CAT_PATHWAY_WAITLIST"
  | "CAT_PATHWAY_INFO_ONLY"
  | "CAT_NO_SUBSCRIPTION"
  | "CAT_WRONG_TIER_OR_REGION"
  | "CAT_ENTITLEMENT_VERIFY_FAILED"
  | "CAT_POOL_TOO_SMALL"
  | "CAT_INTERNAL_ERROR";

export type CatEligibilityReason =
  | "ok"
  | "unauthenticated"
  | "invalid_pathway"
  | "pathway_upcoming"
  | "pathway_waitlist"
  | "pathway_info_only"
  | "no_subscription"
  | "wrong_subscription_tier"
  | "entitlement_verify_failed"
  | "insufficient_cat_pool"
  | "internal_error";

export type CatEligibilityNextAction =
  | "start_cat_app"
  | "login"
  | "upgrade"
  | "switch_pathway"
  | "join_waitlist"
  | "use_question_bank"
  | "browse_lessons"
  | "browse_pathway_hub"
  | "retry";

/** Primary action on the public marketing CAT page (never misleading). */
export type CatMarketingPrimaryCta = "sign_in_to_cat" | "open_app_cat" | "none";

export type CatEligibilityAssessment = {
  /** True when a signed-in subscriber may start CAT in-app immediately (all server gates pass). */
  eligible: boolean;
  reason: CatEligibilityReason;
  nextAction: CatEligibilityNextAction;
  safeUserMessage: string;
  marketingPrimaryCta: CatMarketingPrimaryCta;
  pathway: ExamPathwayDefinition | null;
  pathwayId: string | null;
  /** Public marketing CAT path when pathway is known */
  marketingCatPath: string | null;
  /** App deep link when signed-in user may start CAT in-app */
  appCatStartPath: string | null;
  logCode: CatEligibilityLogCode;
  /** Optional server-only detail (never send to client) */
  debugDetail?: string;
};

const MIN_ADAPTIVE_MARKETING_SNAPSHOT = 8;

function pathwayWaitlistOrUpcomingBlock(pathway: ExamPathwayDefinition): CatEligibilityAssessment | null {
  if (pathway.acquisitionMode === "info_only") {
    return {
      eligible: false,
      reason: "pathway_info_only",
      nextAction: "browse_pathway_hub",
      marketingPrimaryCta: "none",
      safeUserMessage:
        "Adaptive CAT is not offered on this track yet. Use lessons and the question bank from the pathway hub.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath: marketingCatPathForPathway(pathway),
      appCatStartPath: null,
      logCode: "CAT_PATHWAY_INFO_ONLY",
    };
  }
  if (pathway.status === "upcoming" && pathway.acquisitionMode === "waitlist") {
    return {
      eligible: false,
      reason: "pathway_waitlist",
      nextAction: "join_waitlist",
      marketingPrimaryCta: "none",
      safeUserMessage:
        "This pathway is on waitlist prep. You can still study lessons and the question bank; CAT opens when the track goes live.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath: marketingCatPathForPathway(pathway),
      appCatStartPath: null,
      logCode: "CAT_PATHWAY_WAITLIST",
    };
  }
  if (pathway.status === "upcoming") {
    return {
      eligible: false,
      reason: "pathway_upcoming",
      nextAction: "browse_lessons",
      marketingPrimaryCta: "none",
      safeUserMessage:
        "This pathway is still ramping. Lessons and the question bank are available; CAT starts once the adaptive pool meets quality checks.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath: marketingCatPathForPathway(pathway),
      appCatStartPath: null,
      logCode: "CAT_PATHWAY_UPCOMING",
    };
  }
  if (!pathwayAllowsCatAdaptiveStart(pathway)) {
    return {
      eligible: false,
      reason: "pathway_upcoming",
      nextAction: "browse_pathway_hub",
      marketingPrimaryCta: "none",
      safeUserMessage: "Adaptive CAT is not available for this track right now. Use lessons and the question bank instead.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath: marketingCatPathForPathway(pathway),
      appCatStartPath: null,
      logCode: "CAT_PATHWAY_UPCOMING",
    };
  }
  return null;
}

/**
 * Marketing CAT surface: signed-out or light checks using question snapshot only (no entitlement).
 */
export function assessMarketingCatSurfaceWithoutAuth(
  pathway: ExamPathwayDefinition,
  questionSnapshot: PathwayQuestionBankSnapshot,
): CatEligibilityAssessment {
  const block = pathwayWaitlistOrUpcomingBlock(pathway);
  if (block) return block;

  const marketingCatPath = marketingCatPathForPathway(pathway);
  const poolOk =
    questionSnapshot.status === "ok" && questionSnapshot.adaptiveEligibleCount >= MIN_ADAPTIVE_MARKETING_SNAPSHOT;

  if (!poolOk) {
    return {
      eligible: false,
      reason: "insufficient_cat_pool",
      nextAction: "use_question_bank",
      marketingPrimaryCta: "none",
      safeUserMessage:
        "The adaptive question pool for this pathway is still building. Use the question bank and lessons — CAT will unlock when enough items pass quality checks.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath,
      appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
      logCode: "CAT_POOL_TOO_SMALL",
    };
  }

  return {
    eligible: false,
    reason: "unauthenticated",
    nextAction: "login",
    marketingPrimaryCta: "sign_in_to_cat",
    safeUserMessage: "Sign in with a plan that includes this pathway to start an adaptive session.",
    pathway,
    pathwayId: pathway.id,
    marketingCatPath,
    appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
    logCode: "CAT_UNAUTHENTICATED",
  };
}

type SubscriberInput = {
  userId: string;
  entitlement: AccessScope | "error";
  pathway: ExamPathwayDefinition;
};

/**
 * Full eligibility for a signed-in user (or explicit no-access scope). Always re-run on the server before creating a session.
 */
export async function assessCatEligibilityForSubscriberAndPathway(input: SubscriberInput): Promise<CatEligibilityAssessment> {
  const { userId, entitlement, pathway } = input;
  const marketingCatPath = marketingCatPathForPathway(pathway);

  if (entitlement === "error") {
    return {
      eligible: false,
      reason: "internal_error",
      nextAction: "retry",
      marketingPrimaryCta: "none",
      safeUserMessage: "We could not verify your subscription. Try again in a moment or contact support if this persists.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath,
      appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
      logCode: "CAT_ENTITLEMENT_VERIFY_FAILED",
    };
  }

  if (!entitlement.hasAccess) {
    return {
      eligible: false,
      reason: "no_subscription",
      nextAction: "upgrade",
      marketingPrimaryCta: "none",
      safeUserMessage: "An active subscription that covers this exam track is required for adaptive CAT sessions.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath,
      appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
      logCode: "CAT_NO_SUBSCRIPTION",
    };
  }

  const block = pathwayWaitlistOrUpcomingBlock(pathway);
  if (block) return block;

  if (!subscriptionCoversPathwayBase(entitlement, pathway)) {
    return {
      eligible: false,
      reason: "wrong_subscription_tier",
      nextAction: "switch_pathway",
      marketingPrimaryCta: "none",
      safeUserMessage:
        "Your current plan does not include this pathway or region. Switch to a matching track under Account, or review Billing to upgrade.",
      pathway,
      pathwayId: pathway.id,
      marketingCatPath,
      appCatStartPath: null,
      logCode: "CAT_WRONG_TIER_OR_REGION",
    };
  }

  const readiness = await assessCatPracticeReadinessForPathway(userId, entitlement, pathway.id);
  if (!readiness.ok) {
    const poolTooSmall = readiness.code === "cat_pool_invalid";
    return {
      eligible: false,
      reason: poolTooSmall ? "insufficient_cat_pool" : "internal_error",
      nextAction: poolTooSmall ? "use_question_bank" : "browse_pathway_hub",
      marketingPrimaryCta: "none",
      safeUserMessage: readiness.message,
      pathway,
      pathwayId: pathway.id,
      marketingCatPath,
      appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
      logCode: poolTooSmall ? "CAT_POOL_TOO_SMALL" : "CAT_INTERNAL_ERROR",
      debugDetail: readiness.code,
    };
  }

  return {
    eligible: true,
    reason: "ok",
    nextAction: "start_cat_app",
    marketingPrimaryCta: "open_app_cat",
    safeUserMessage: "You can start an adaptive CAT session in the app for this pathway.",
    pathway,
    pathwayId: pathway.id,
    marketingCatPath,
    appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
    logCode: "CAT_OK",
  };
}

/** Resolve pathway by id string; returns assessment with invalid_pathway when unknown. */
export function catEligibilityInvalidPathway(pathwayIdRaw: string): CatEligibilityAssessment {
  return {
    eligible: false,
    reason: "invalid_pathway",
    nextAction: "browse_pathway_hub",
    marketingPrimaryCta: "none",
    safeUserMessage: "That exam pathway is not recognized. Choose a track from the practice exams or exam hub menu.",
    pathway: null,
    pathwayId: null,
    marketingCatPath: null,
    appCatStartPath: null,
    logCode: "CAT_INVALID_PATHWAY",
    debugDetail: pathwayIdRaw.slice(0, 80),
  };
}
