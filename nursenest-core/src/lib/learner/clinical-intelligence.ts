import type { AlliedProfessionMarketing } from "@/lib/allied/allied-professions-registry";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  filterWeakTopicsForAlliedEntitlement,
  filterWeakTopicsForAlliedProfession,
} from "@/lib/allied/allied-weak-topic-filter";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { subscriberCanonicalAlliedProfessionKey } from "@/lib/entitlements/allied-occupation-entitlement";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

/**
 * Aggregated learner intelligence for dashboards and recommendations.
 * Uses existing weak-topic signals only — no parallel analytics store.
 */
export type ClinicalIntelligenceSnapshot = {
  weakSystems: WeakTopicRow[];
  weakSkills: WeakTopicRow[];
  safetyRisks: WeakTopicRow[];
  recommendedLessons: string[];
  recommendedFlashcards: string[];
  recommendedQuestions: string[];
  recommendedScenarios: string[];
  clinicalSummary: string;
};

/**
 * @deprecated Prefer {@link buildClinicalIntelligenceForAllied} with `entitlement` + `learnerPathwayId`.
 * When `entitlement` is set, delegates to {@link filterWeakTopicsForAlliedEntitlement}.
 */
export function buildClinicalIntelligenceForAlliedProfession(input: {
  weakTopics: WeakTopicRow[];
  profession: AlliedProfessionMarketing | null | undefined;
  entitlement?: AccessScope;
  learnerPathwayId?: string | null;
}): ClinicalIntelligenceSnapshot {
  const scoped =
    input.entitlement != null
      ? filterWeakTopicsForAlliedEntitlement(input.weakTopics, input.entitlement, input.learnerPathwayId ?? null)
      : filterWeakTopicsForAlliedProfession(input.weakTopics, input.profession);

  const pk = input.entitlement != null ? subscriberCanonicalAlliedProfessionKey(input.entitlement) : null;
  const profFromEnt = pk ? getAlliedProfessionByProfessionKey(pk) : null;
  const label = profFromEnt?.h1?.trim() || input.profession?.h1?.trim() || "Allied health";
  return {
    weakSystems: scoped,
    weakSkills: scoped,
    safetyRisks: scoped.filter((r) => /safety|infection|fall|abuse|escalat/i.test(r.topic)),
    recommendedLessons: [],
    recommendedFlashcards: [],
    recommendedQuestions: scoped.slice(0, 6).map((r) => r.topic),
    recommendedScenarios: [],
    clinicalSummary: scoped.length
      ? `${label}: focus on ${scoped[0]!.topic} and related weak areas from recent practice.`
      : `${label}: no weak-topic signals yet — keep mixing lessons and short question bursts.`,
  };
}

/** Preferred entry: Stripe-backed occupation + pathway for weak-topic scoping. */
export function buildClinicalIntelligenceForAllied(input: {
  weakTopics: WeakTopicRow[];
  entitlement: AccessScope;
  learnerPathwayId: string | null;
}): ClinicalIntelligenceSnapshot {
  const pk = subscriberCanonicalAlliedProfessionKey(input.entitlement);
  const prof = pk ? getAlliedProfessionByProfessionKey(pk) : null;
  return buildClinicalIntelligenceForAlliedProfession({
    weakTopics: input.weakTopics,
    profession: prof ?? undefined,
    entitlement: input.entitlement,
    learnerPathwayId: input.learnerPathwayId,
  });
}
