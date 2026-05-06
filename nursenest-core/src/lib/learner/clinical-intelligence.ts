import type { AlliedProfessionMarketing } from "@/lib/allied/allied-professions-registry";
import { filterWeakTopicsForAlliedProfession } from "@/lib/allied/allied-weak-topic-filter";
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

export function buildClinicalIntelligenceForAlliedProfession(input: {
  weakTopics: WeakTopicRow[];
  profession: AlliedProfessionMarketing | null | undefined;
}): ClinicalIntelligenceSnapshot {
  const scoped = filterWeakTopicsForAlliedProfession(input.weakTopics, input.profession);
  const label = input.profession?.h1?.trim() || "Allied health";
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
