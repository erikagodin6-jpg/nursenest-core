import type { ClinicalNursingScenarioTier } from "@prisma/client";
import { ALL_RAW_TOPICS } from "@/lib/clinical-scenarios/branching-scenario-raw-topics";
import { rawTopicToSpec } from "@/lib/clinical-scenarios/branching-scenario-seed-build-topic";
import type { BranchingSeedScenarioSpec } from "@/lib/clinical-scenarios/branching-scenario-seed-types";

/**
 * 15 high-acuity authoring packs × 4 tiers = 60 scenarios. Each pack is five-stage branching with
 * trajectory-linked consequences (`patient improves|unchanged|deteriorates`) for the learner UI.
 *
 * Topic coverage maps many curriculum headings into these packs (examples): MI/ACS, HF exacerbation,
 * sepsis/shock, DKA, PE, COPD, ARDS, stroke, GI bleed, postpartum hemorrhage, peds asthma, seizures,
 * electrolyte/arrhythmia contexts, post-op complications, transfusion, opioid/CNS depression, LTC fever,
 * anticoagulation, hypertension, anemia/CKD, mental health risk, infectious disease, and new-grad
 * escalation patterns. Additional one-topic-per-row expansions should extend `ALL_RAW_TOPICS`, not
 * parallel seed systems.
 */
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
