import type { ClinicalNursingScenarioDifficulty, ClinicalNursingScenarioTier } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { ALL_RAW_TOPICS } from "@/lib/clinical-scenarios/branching-scenario-raw-topics";
import { rawTopicToSpec } from "@/lib/clinical-scenarios/branching-scenario-seed-build-topic";
import type { BranchingSeedScenarioSpec } from "@/lib/clinical-scenarios/branching-scenario-seed-types";

const TIERS: ClinicalNursingScenarioTier[] = ["RN_NCLEX_RN", "RPN_PN", "NP", "NEW_GRAD"];
const DIFF_ROTATION: ClinicalNursingScenarioDifficulty[] = ["FOUNDATION", "INTERMEDIATE", "ADVANCED"];

/**
 * Five high-acuity domains (MI, sepsis, respiratory failure, electrolyte crisis, COPD distress).
 * Each raw topic defines five branching stages aligned with the multi-stage consequence engine.
 */
const REAL_SLUGS = ["mi-acs", "sepsis-shock", "ards-vent", "dka", "copd-exac"] as const;

/**
 * 20 premium-flagged branching scenarios (5 topics × 4 tiers) for monetized simulation catalog.
 * Content is sourced from the same clinical packs as the 60-scenario catalog (not placeholder stubs).
 */
export function realTwentyPremiumSpecs(): BranchingSeedScenarioSpec[] {
  const topics = REAL_SLUGS.map((slug) => {
    const t = ALL_RAW_TOPICS.find((x) => x.slug === slug);
    if (!t) throw new Error(`Missing raw topic slug: ${slug}`);
    return t;
  });

  const out: BranchingSeedScenarioSpec[] = [];
  let i = 0;
  for (const tier of TIERS) {
    for (const topic of topics) {
      const spec = rawTopicToSpec(tier, DIFF_ROTATION[i++ % DIFF_ROTATION.length]!, topic);
      const seedKey = `real-v1-${tier}-${topic.slug}`;
      const baseRefs = Array.isArray(spec.referencesJson) ? spec.referencesJson : [];
      const referencesJson = [...baseRefs, { kind: "premium_simulation", isPremium: true }] as unknown as Prisma.InputJsonValue;
      out.push({
        ...spec,
        seedKey,
        title: `[seed:${seedKey}] ${topic.titleBase}`.slice(0, 240),
        referencesJson,
      });
    }
  }
  return out;
}

export function realTwentyPremiumCount(): number {
  return TIERS.length * REAL_SLUGS.length;
}
