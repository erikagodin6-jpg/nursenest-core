/**
 * Personalization context resolver.
 *
 * Bridges the GLOBAL MARKET CONTEXT system (region, locale, profession, exam)
 * with the STUDY PERSONALIZATION system (insight engine, adaptive recs,
 * weak areas, readiness, engagement nudges).
 *
 * This module creates a unified "personalization context" that any surface
 * can consume to render market-appropriate, study-appropriate content:
 *
 *   - Dashboard hero copy
 *   - Recommended next actions (region-aware wording)
 *   - Blog/content recommendations
 *   - CTAs tuned to the user's market + study stage
 *   - Pricing messaging adapted to entitlements + region
 *
 * The resolver is a pure composition layer — it does NOT replace the insight
 * engine or adaptive recommendation system. It wraps their output with
 * market context so downstream surfaces can personalize without knowing
 * internals of either system.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import type { MarketSupportTier } from "@/lib/navigation/market-readiness";
import { getMarketReadiness } from "@/lib/navigation/market-readiness";
import type { LearnerInsightSnapshot } from "@/lib/insights/types";

// ── Types ────────────────────────────────────────────────────────────────────

export type StudyStage =
  | "new"           // no study activity yet
  | "onboarding"    // < 3 sessions
  | "building"      // active but not exam-ready
  | "strengthening" // moderate readiness, working on weak areas
  | "exam_ready"    // high readiness
  | "reviewing";    // post-exam or maintenance mode

export type PersonalizationContext = {
  /** Market context */
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  regionDisplayName: string;
  marketSupport: MarketSupportTier;
  profession: string | null;
  exam: string | null;

  /** Entitlement context */
  hasActiveSubscription: boolean;
  isHomeRegion: boolean;
  entitlementTier: string | null;

  /** Study context (derived from insight snapshot when available) */
  studyStage: StudyStage;
  overallAccuracyPct: number | null;
  weakAreaCount: number;
  topWeakTopic: string | null;
  readinessBand: string | null;
  examDaysRemaining: number | null;
  studyStreakDays: number;
  hasExamDate: boolean;

  /** Personalization signals */
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  primaryRecommendationKind: string | null;
  recommendationConfidence: string | null;
};

export type PersonalizationInput = {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;
  hasActiveSubscription: boolean;
  isHomeRegion: boolean;
  entitlementTier: string | null;
  insightSnapshot: LearnerInsightSnapshot | null;
  examDaysRemaining: number | null;
  studyStreakDays: number;
  hasExamDate: boolean;
  hasCompletedOnboarding: boolean;
  totalSessionCount: number;
};

// ── Resolver ─────────────────────────────────────────────────────────────────

/**
 * Build a unified personalization context from market state + study state.
 *
 * Pure function — no DB calls, no side effects.
 * Call this in the dashboard page loader or any server component that
 * needs personalized rendering.
 */
export function buildPersonalizationContext(
  input: PersonalizationInput,
): PersonalizationContext {
  const regionCfg = REGION_CONFIG[input.region];
  const market = getMarketReadiness(input.region);
  const snapshot = input.insightSnapshot;

  const studyStage = deriveStudyStage(input, snapshot);
  const weakAreas = snapshot?.weakAreas ?? [];
  const topWeakTopic = weakAreas.length > 0 ? weakAreas[0].topic : null;
  const primaryRec = snapshot?.recommendations?.primary ?? null;

  return {
    region: input.region,
    locale: input.locale,
    regionDisplayName: regionCfg.displayName,
    marketSupport: market.supportTier,
    profession: input.profession,
    exam: input.exam,

    hasActiveSubscription: input.hasActiveSubscription,
    isHomeRegion: input.isHomeRegion,
    entitlementTier: input.entitlementTier,

    studyStage,
    overallAccuracyPct: snapshot?.performance?.overallAccuracyPct ?? null,
    weakAreaCount: weakAreas.length,
    topWeakTopic,
    readinessBand: snapshot?.readiness?.band ?? null,
    examDaysRemaining: input.examDaysRemaining,
    studyStreakDays: input.studyStreakDays,
    hasExamDate: input.hasExamDate,

    isNewUser: input.totalSessionCount === 0,
    hasCompletedOnboarding: input.hasCompletedOnboarding,
    primaryRecommendationKind: primaryRec?.kind ?? null,
    recommendationConfidence: null,
  };
}

// ── Study stage derivation ───────────────────────────────────────────────────

function deriveStudyStage(
  input: PersonalizationInput,
  snapshot: LearnerInsightSnapshot | null,
): StudyStage {
  if (input.totalSessionCount === 0) return "new";
  if (input.totalSessionCount < 3) return "onboarding";

  if (!snapshot) return "building";

  const band = snapshot.readiness?.band;
  if (band === "ready") return "exam_ready";
  if (band === "near_ready") return "strengthening";
  if (band === "improving") return "building";

  return "building";
}
