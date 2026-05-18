import type { PrescribingRecommendation } from "./types";

export interface RenalDosingInput {
  age: number;
  weightKg: number;
  serumCreatinine: number;
  sex: "male" | "female";
}

export interface RenalDosingResult {
  creatinineClearance: number;
  category:
    | "normal"
    | "mild-impairment"
    | "moderate-impairment"
    | "severe-impairment";
  recommendations: string[];
  monitoring: string[];
  warnings: string[];
}

export function estimateCreatinineClearance(input: RenalDosingInput): number {
  if (input.age <= 0 || input.weightKg <= 0 || input.serumCreatinine <= 0) {
    throw new Error("Renal dosing inputs must be positive numbers.");
  }

  const base = ((140 - input.age) * input.weightKg) / (72 * input.serumCreatinine);
  const sexAdjusted = input.sex === "female" ? base * 0.85 : base;

  return Math.max(0, Math.round(sexAdjusted * 10) / 10);
}

export function buildRenalDosingResult(input: RenalDosingInput): RenalDosingResult {
  const creatinineClearance = estimateCreatinineClearance(input);

  if (creatinineClearance < 30) {
    return {
      creatinineClearance,
      category: "severe-impairment",
      recommendations: [
        "Use renal-adjusted dosing for renally cleared antimicrobials.",
        "Avoid nephrotoxic combinations when safer alternatives exist.",
        "Consider specialist consultation for high-risk infectious syndromes."
      ],
      monitoring: ["serum creatinine trend", "drug levels when indicated", "clinical response"],
      warnings: [
        "High risk of medication accumulation.",
        "Broad-spectrum therapy still requires daily reassessment."
      ]
    };
  }

  if (creatinineClearance < 60) {
    return {
      creatinineClearance,
      category: "moderate-impairment",
      recommendations: [
        "Review renal adjustment guidance before prescribing.",
        "Consider interval adjustment for renally cleared agents."
      ],
      monitoring: ["renal function", "treatment response"],
      warnings: ["Renal function can worsen during acute infection or dehydration."]
    };
  }

  if (creatinineClearance < 90) {
    return {
      creatinineClearance,
      category: "mild-impairment",
      recommendations: ["Standard dosing is often appropriate, but verify agent-specific guidance."],
      monitoring: ["renal function if therapy is prolonged"],
      warnings: []
    };
  }

  return {
    creatinineClearance,
    category: "normal",
    recommendations: ["Standard dosing is generally appropriate unless other risks are present."],
    monitoring: ["clinical response"],
    warnings: []
  };
}

export function addRenalSafetyToRecommendation(
  recommendation: PrescribingRecommendation,
  renal: RenalDosingResult
): PrescribingRecommendation {
  if (renal.category === "normal" || renal.category === "mild-impairment") {
    return recommendation;
  }

  return {
    ...recommendation,
    monitoring: [...recommendation.monitoring, ...renal.monitoring],
    rationale: [
      ...recommendation.rationale,
      "Renal impairment changes prescribing safety and follow-up intensity."
    ],
    avoid: [...recommendation.avoid, "unadjusted renally cleared therapy"]
  };
}
