import {
  evaluateClinicalQuestionQuality,
  type ClinicalQuestionQualityInput,
} from "./clinical-question-quality";
import { scanClinicalRiskLanguage, type ClinicalRiskLanguageInput } from "./clinical-risk-language";
import {
  analyzePsychometricQuestion,
  type PsychometricQuestionInput,
} from "./psychometric-question-analysis";

export type CatItemQualityWeightInput = ClinicalQuestionQualityInput &
  ClinicalRiskLanguageInput &
  PsychometricQuestionInput & {
    id?: string | null;
    isMockExamEligible?: boolean | null;
    isAdaptiveEligible?: boolean | null;
    status?: string | null;
  };

export type CatItemQualityBand = "exclude" | "low" | "standard" | "preferred" | "flagship";

export type CatItemQualityWeightResult = {
  qualityWeight: number;
  qualityBand: CatItemQualityBand;
  clinicalScore: number;
  psychometricScore: number;
  riskPenalty: number;
  exclusionReasons: string[];
  recommendations: string[];
};

function normalizeStatus(status: string | null | undefined): string {
  return String(status ?? "").trim().toLowerCase();
}

function clampWeight(value: number): number {
  return Math.max(0, Math.min(1.25, Number(value.toFixed(2))));
}

function bandFor(weight: number, exclusionReasons: string[]): CatItemQualityBand {
  if (exclusionReasons.length > 0 || weight <= 0) return "exclude";
  if (weight < 0.55) return "low";
  if (weight < 0.9) return "standard";
  if (weight < 1.15) return "preferred";
  return "flagship";
}

export function calculateCatItemQualityWeight(
  input: CatItemQualityWeightInput,
): CatItemQualityWeightResult {
  const clinical = evaluateClinicalQuestionQuality(input);
  const psychometric = analyzePsychometricQuestion(input);
  const risks = scanClinicalRiskLanguage(input);

  const exclusionReasons: string[] = [];
  const recommendations: string[] = [];

  const status = normalizeStatus(input.status);
  if (status && status !== "published") {
    exclusionReasons.push(`status:${status}`);
  }

  if (input.isAdaptiveEligible === false) {
    exclusionReasons.push("adaptive-ineligible");
  }

  if (input.isMockExamEligible === false) {
    recommendations.push("Keep out of mock-exam pools until reviewed.");
  }

  const criticalClinicalIssues = clinical.issues.filter(
    (issue) => issue.severity === "error",
  );
  if (criticalClinicalIssues.some((issue) => issue.code === "CORRECT_ANSWER_MISSING")) {
    exclusionReasons.push("missing-correct-answer");
  }

  if (criticalClinicalIssues.length >= 4) {
    exclusionReasons.push("multiple-clinical-quality-failures");
  }

  const highRiskSignals = risks.filter((risk) => risk.severity === "high");
  if (highRiskSignals.length >= 2) {
    exclusionReasons.push("multiple-high-risk-clinical-flags");
  }

  const highPsychometricIssues = psychometric.issues.filter(
    (issue) => issue.severity === "high",
  );
  if (psychometric.overallScore < 45 || highPsychometricIssues.length >= 2) {
    recommendations.push("Review distractors before CAT exposure.");
  }

  const clinicalContribution = clinical.score / 100;
  const psychometricContribution = psychometric.overallScore / 100;
  const highRiskPenalty = highRiskSignals.length * 0.18;
  const reviewRiskPenalty = risks.filter((risk) => risk.severity === "review").length * 0.05;
  const riskPenalty = Math.min(0.45, highRiskPenalty + reviewRiskPenalty);

  let rawWeight = clinicalContribution * 0.55 + psychometricContribution * 0.45 - riskPenalty;

  if (!clinical.pass) rawWeight -= 0.18;
  if (psychometric.overallScore < 75) rawWeight -= 0.12;
  if (clinical.pass && psychometric.overallScore >= 90 && risks.length === 0) rawWeight += 0.15;

  if (exclusionReasons.length > 0) rawWeight = 0;

  const qualityWeight = clampWeight(rawWeight);
  const clinicalCodes = clinical.issues.slice(0, 4).map((issue) => issue.code);
  const psychCodes = psychometric.issues.slice(0, 4).map((issue) => issue.code);
  const riskCodes = risks.slice(0, 4).map((risk) => risk.code);

  if (clinicalCodes.length > 0) {
    recommendations.push(`Clinical remediation: ${clinicalCodes.join(", ")}`);
  }
  if (psychCodes.length > 0) {
    recommendations.push(`Psychometric remediation: ${psychCodes.join(", ")}`);
  }
  if (riskCodes.length > 0) {
    recommendations.push(`Clinical risk review: ${riskCodes.join(", ")}`);
  }

  return {
    qualityWeight,
    qualityBand: bandFor(qualityWeight, exclusionReasons),
    clinicalScore: clinical.score,
    psychometricScore: psychometric.overallScore,
    riskPenalty: Number(riskPenalty.toFixed(2)),
    exclusionReasons,
    recommendations,
  };
}
