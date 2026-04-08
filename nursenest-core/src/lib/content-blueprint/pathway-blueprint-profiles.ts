/**
 * Per-pathway operational targets (weights + minimum question depth per blueprint cell).
 * Weights sum to ~1.0 per pathway for domain mix planning — not exam percentages.
 */

import type { BlueprintDomainId } from "./blueprint-domain";
import type { ClinicalSystemId } from "./clinical-system-id";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { inferPathwayFamilyFromExamKeys } from "@/lib/questions/question-bank-taxonomy";
import { MIN_PUBLISHED_BY_BUCKET } from "@/lib/questions/question-bank-coverage-thresholds";

export type DomainTarget = {
  /** Planning weight (0–1). */
  weight: number;
  /** Minimum published questions in-scope before domain is not "missing" at scale. */
  minQuestions: number;
  /** "Covered" band — editorial stretch target. */
  stretchQuestions: number;
};

export type SystemTarget = {
  minQuestions: number;
  stretchQuestions: number;
};

export type PathwayBlueprintProfile = {
  pathwayId: string;
  displayName: string;
  /** Minimum total published items before pathway-level "thin" warnings dominate. */
  minTotalQuestions: number;
  domainTargets: Partial<Record<BlueprintDomainId, DomainTarget>>;
  systemTargets: Partial<Record<ClinicalSystemId, SystemTarget>>;
  /** Minimum distinct medication bucket hits (see inferMedicationBuckets). */
  minMedicationBuckets: number;
  /** Minimum items in management + prioritization-heavy domains (approximation). */
  minClinicalJudgmentSignals: number;
  /** If thin-rationale share exceeds this (0–100), flag as a planning gap. */
  maxPctThinRationale: number;
  /** If missing-rationale share exceeds this (0–100), flag as a planning gap. */
  maxPctMissingRationale: number;
  notes?: string[];
};

function floorFromBucket(family: "nclex_rn" | "nclex_pn" | "np", share: number): number {
  const base =
    family === "nclex_rn"
      ? MIN_PUBLISHED_BY_BUCKET.rn
      : family === "nclex_pn"
        ? MIN_PUBLISHED_BY_BUCKET.pn
        : MIN_PUBLISHED_BY_BUCKET.np;
  return Math.max(10, Math.floor(base * share));
}

function defaultNclexRnDomains(): PathwayBlueprintProfile["domainTargets"] {
  const w = (p: number) => Math.max(10, floorFromBucket("nclex_rn", p));
  return {
    management_of_care: { weight: 0.2, minQuestions: w(0.04), stretchQuestions: w(0.12) },
    safety_and_infection: { weight: 0.14, minQuestions: w(0.035), stretchQuestions: w(0.1) },
    health_promotion_maintenance: { weight: 0.12, minQuestions: w(0.03), stretchQuestions: w(0.09) },
    psychosocial_integrity: { weight: 0.1, minQuestions: w(0.025), stretchQuestions: w(0.08) },
    basic_care_comfort: { weight: 0.1, minQuestions: w(0.025), stretchQuestions: w(0.08) },
    pharmacological_therapies: { weight: 0.14, minQuestions: w(0.04), stretchQuestions: w(0.11) },
    risk_reduction: { weight: 0.1, minQuestions: w(0.025), stretchQuestions: w(0.08) },
    physiological_adaptation: { weight: 0.1, minQuestions: w(0.03), stretchQuestions: w(0.1) },
  };
}

function defaultNclexPnDomains(): PathwayBlueprintProfile["domainTargets"] {
  const w = (p: number) => Math.max(10, floorFromBucket("nclex_pn", p));
  return {
    management_of_care: { weight: 0.18, minQuestions: w(0.045), stretchQuestions: w(0.12) },
    safety_and_infection: { weight: 0.16, minQuestions: w(0.04), stretchQuestions: w(0.11) },
    health_promotion_maintenance: { weight: 0.12, minQuestions: w(0.03), stretchQuestions: w(0.09) },
    psychosocial_integrity: { weight: 0.1, minQuestions: w(0.028), stretchQuestions: w(0.08) },
    basic_care_comfort: { weight: 0.14, minQuestions: w(0.035), stretchQuestions: w(0.1) },
    pharmacological_therapies: { weight: 0.12, minQuestions: w(0.03), stretchQuestions: w(0.09) },
    risk_reduction: { weight: 0.1, minQuestions: w(0.028), stretchQuestions: w(0.08) },
    physiological_adaptation: { weight: 0.08, minQuestions: w(0.025), stretchQuestions: w(0.08) },
  };
}

function defaultNpDomains(): PathwayBlueprintProfile["domainTargets"] {
  const w = (p: number) => Math.max(12, floorFromBucket("np", p));
  return {
    management_of_care: { weight: 0.18, minQuestions: w(0.05), stretchQuestions: w(0.14) },
    pharmacological_therapies: { weight: 0.22, minQuestions: w(0.06), stretchQuestions: w(0.16) },
    physiological_adaptation: { weight: 0.2, minQuestions: w(0.055), stretchQuestions: w(0.15) },
    risk_reduction: { weight: 0.12, minQuestions: w(0.04), stretchQuestions: w(0.1) },
    safety_and_infection: { weight: 0.1, minQuestions: w(0.035), stretchQuestions: w(0.09) },
    psychosocial_integrity: { weight: 0.08, minQuestions: w(0.03), stretchQuestions: w(0.08) },
    health_promotion_maintenance: { weight: 0.06, minQuestions: w(0.025), stretchQuestions: w(0.07) },
    basic_care_comfort: { weight: 0.06, minQuestions: w(0.025), stretchQuestions: w(0.07) },
  };
}

const DEFAULT_SYSTEMS: ClinicalSystemId[] = [
  "cardio",
  "respiratory",
  "neuro",
  "renal",
  "endocrine",
  "gi",
  "fluids_electrolytes",
  "infection_sepsis",
  "maternity",
  "peds",
  "mental_health",
];

function defaultSystemTargets(family: "nclex_rn" | "nclex_pn" | "np"): Partial<Record<ClinicalSystemId, SystemTarget>> {
  const min = family === "nclex_rn" ? 18 : family === "nclex_pn" ? 15 : 20;
  const stretch = min * 3;
  const o: Partial<Record<ClinicalSystemId, SystemTarget>> = {};
  for (const s of DEFAULT_SYSTEMS) o[s] = { minQuestions: min, stretchQuestions: stretch };
  o.general = { minQuestions: Math.max(8, Math.floor(min / 2)), stretchQuestions: min * 2 };
  return o;
}

/** Active nursing pathways requested for blueprint reporting (excludes allied/upcoming unless extended). */
export const BLUEPRINT_REPORT_PATHWAY_IDS = [
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-np-fnp",
] as const;

export function buildPathwayBlueprintProfile(p: ExamPathwayDefinition): PathwayBlueprintProfile {
  const keys = p.contentExamKeys;
  const family = inferPathwayFamilyFromExamKeys(keys);
  const notes: string[] = [
    "Domain/system mins are operational floors for planning — not NCSBN percentages.",
    `Country ${p.countryCode}; tier ${p.stripeTier}; exam keys: ${keys.join(", ")}.`,
  ];

  if (family === "nclex_rn") {
    return {
      pathwayId: p.id,
      displayName: p.displayName,
      minTotalQuestions: MIN_PUBLISHED_BY_BUCKET.rn,
      domainTargets: defaultNclexRnDomains(),
      systemTargets: defaultSystemTargets("nclex_rn"),
      minMedicationBuckets: 5,
      minClinicalJudgmentSignals: floorFromBucket("nclex_rn", 0.06),
      maxPctThinRationale: 22,
      maxPctMissingRationale: 4,
      notes,
    };
  }
  if (family === "nclex_pn") {
    return {
      pathwayId: p.id,
      displayName: p.displayName,
      minTotalQuestions: MIN_PUBLISHED_BY_BUCKET.pn,
      domainTargets: defaultNclexPnDomains(),
      systemTargets: defaultSystemTargets("nclex_pn"),
      minMedicationBuckets: 5,
      minClinicalJudgmentSignals: floorFromBucket("nclex_pn", 0.06),
      maxPctThinRationale: 24,
      maxPctMissingRationale: 5,
      notes,
    };
  }
  if (family === "np") {
    return {
      pathwayId: p.id,
      displayName: p.displayName,
      minTotalQuestions: MIN_PUBLISHED_BY_BUCKET.np,
      domainTargets: defaultNpDomains(),
      systemTargets: defaultSystemTargets("np"),
      minMedicationBuckets: 6,
      minClinicalJudgmentSignals: floorFromBucket("np", 0.08),
      maxPctThinRationale: 18,
      maxPctMissingRationale: 3,
      notes: [...notes, "NP profile is FNP-oriented when pathway is us-np-fnp; tune per NP track if split pools."],
    };
  }

  return {
    pathwayId: p.id,
    displayName: p.displayName,
    minTotalQuestions: 0,
    domainTargets: {},
    systemTargets: {},
    minMedicationBuckets: 0,
    minClinicalJudgmentSignals: 0,
    maxPctThinRationale: 100,
    maxPctMissingRationale: 100,
    notes: [...notes, "Pathway family not in blueprint scope (e.g. allied) — extend profiles if needed."],
  };
}
