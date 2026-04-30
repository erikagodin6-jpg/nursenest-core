import type { ClinicalNursingScenarioTier } from "@prisma/client";
import { ALL_RAW_TOPICS } from "@/lib/clinical-scenarios/branching-scenario-raw-topics";
import { rawTopicToSpec } from "@/lib/clinical-scenarios/branching-scenario-seed-build-topic";
import type { BranchingSeedScenarioSpec } from "@/lib/clinical-scenarios/branching-scenario-seed-types";

const TIERS: ClinicalNursingScenarioTier[] = ["RN_NCLEX_RN", "RPN_PN", "NP", "NEW_GRAD"];

const DIFFICULTY_ROTATION = ["FOUNDATION", "INTERMEDIATE", "ADVANCED"] as const;

/** 15 clinical domains × 4 tiers = 60 branching seed scenarios. */
export function allBranchingClinicalSeedSpecs(): BranchingSeedScenarioSpec[] {
  const out: BranchingSeedScenarioSpec[] = [];
  let i = 0;
  for (const tier of TIERS) {
    for (const topic of ALL_RAW_TOPICS) {
      out.push(rawTopicToSpec(tier, DIFFICULTY_ROTATION[i++ % DIFFICULTY_ROTATION.length]!, topic));
    }
  }
  return out;
}

export function branchingCatalogCounts(): { total: number; topics: number; tiers: number; perTier: number } {
  const topics = ALL_RAW_TOPICS.length;
  const tiers = TIERS.length;
  return { total: topics * tiers, topics, tiers, perTier: topics };
}
