import type {
  BlueprintCoverageDashboard,
  BlueprintCoverageDomainRow,
  BlueprintCoverageExamReport,
  BlueprintGapContentType,
  BlueprintGapExam,
} from "@/lib/blueprints/blueprint-coverage-gap-engine";
import { GLOBAL_CLINICAL_CORE_REGISTRY } from "@/lib/international-content/global-inheritance-reuse-enforcement-system";

export type GlobalPriorityCategory = "critical" | "high" | "medium" | "low" | "deferred";

export type BlueprintPriorityDomainScore = {
  readonly exam: BlueprintGapExam | "NMC CBT" | "NMBA RN" | "NCNZ RN" | "International RN";
  readonly domainId: string;
  readonly domainLabel: string;
  readonly priorityScore: number;
  readonly priorityCategory: GlobalPriorityCategory;
  readonly examFrequencyScore: number;
  readonly clinicalRiskScore: number;
  readonly blueprintWeightScore: number;
  readonly questionVolumeGapScore: number;
  readonly simulationValueScore: number;
  readonly flashcardValueScore: number;
  readonly adaptiveLearningValueScore: number;
  readonly monetizationImpactScore: number;
  readonly seoImpactScore: number;
  readonly internationalReusePotentialScore: number;
  readonly recommendedReuseLayer: "Global Core" | "Role Overlay" | "Country Overlay" | "Exam Overlay" | "Language Overlay";
  readonly generationRule: "reuse_before_generation" | "generate_missing_overlay_only" | "generation_justified_after_reuse_check";
  readonly rationale: string;
};

export type GlobalBlueprintPrioritizedBacklogItem = {
  readonly rank: number;
  readonly priority: GlobalPriorityCategory;
  readonly priorityScore: number;
  readonly exam: BlueprintPriorityDomainScore["exam"];
  readonly domain: string;
  readonly lessonsNeeded: number;
  readonly questionsNeeded: number;
  readonly flashcardsNeeded: number;
  readonly simulationsNeeded: number;
  readonly ngnCasesNeeded: number;
  readonly expectedRoi: number;
  readonly estimatedCompletionEffortHours: number;
  readonly reuseEvaluation: string;
  readonly buildDecision: "reuse_existing_core" | "build_overlay" | "create_new_content_after_gate";
};

export type GlobalBlueprintMonetizationReadiness = {
  readonly rnReadiness: number;
  readonly pnReadiness: number;
  readonly npReadiness: number;
  readonly ukReadiness: number;
  readonly australiaReadiness: number;
  readonly newZealandReadiness: number;
  readonly internationalReadiness: number;
};

export type GlobalBlueprintPrioritizationDashboard = {
  readonly generatedAt: string;
  readonly sourceCoverageGeneratedAt: string;
  readonly blueprintCoverageDashboard: {
    readonly overallCoveragePercent: number;
    readonly readinessPercent: number;
    readonly publicationPercent: number;
    readonly monetizationPercent: number;
    readonly adaptiveLearningPercent: number;
  };
  readonly gapDashboard: readonly BlueprintPriorityDomainScore[];
  readonly contentRoiDashboard: readonly GlobalBlueprintPrioritizedBacklogItem[];
  readonly monetizationDashboard: GlobalBlueprintMonetizationReadiness;
  readonly reuseDashboard: {
    readonly globalCoreTopics: readonly string[];
    readonly reuseFirstBacklogItems: number;
    readonly overlayFirstBacklogItems: number;
    readonly newContentGateItems: number;
  };
  readonly internationalReadinessDashboard: {
    readonly ukReadiness: number;
    readonly australiaReadiness: number;
    readonly newZealandReadiness: number;
    readonly requiredNextAction: "recover_classify_reuse_then_generate";
  };
  readonly highestRoiNextBuilds: readonly GlobalBlueprintPrioritizedBacklogItem[];
};

type PlannedInternationalDomain = {
  readonly exam: BlueprintPriorityDomainScore["exam"];
  readonly domainId: string;
  readonly domainLabel: string;
  readonly targetPercent: number;
  readonly countryOverlay: boolean;
  readonly examOverlay: boolean;
  readonly clinicalRisk: number;
};

const CONTENT_EFFORT_HOURS: Record<BlueprintGapContentType, number> = {
  lessons: 3,
  questions: 0.35,
  flashcards: 0.08,
  simulations: 10,
  ngnCases: 4,
};

const CRITICAL_DOMAIN_RULES: readonly { pattern: RegExp; score: number }[] = [
  { pattern: /delegat|priorit|scope|leadership/i, score: 96 },
  { pattern: /safety|infection|safeguard|candour|professional/i, score: 95 },
  { pattern: /pharm|medication|prescrib/i, score: 94 },
  { pattern: /diagnos|assessment|clinical management|chronic/i, score: 92 },
  { pattern: /news2|deterioration|shock|sepsis|emergency/i, score: 94 },
  { pattern: /aboriginal|cultural|tiriti|rural/i, score: 91 },
  { pattern: /cardio|respiratory|mental/i, score: 86 },
];

const PLANNED_INTERNATIONAL_DOMAINS: readonly PlannedInternationalDomain[] = [
  { exam: "NMC CBT", domainId: "news2_deterioration", domainLabel: "NEWS2 and Deterioration", targetPercent: 12, countryOverlay: true, examOverlay: true, clinicalRisk: 96 },
  { exam: "NMC CBT", domainId: "safeguarding", domainLabel: "Safeguarding Adults and Children", targetPercent: 10, countryOverlay: true, examOverlay: true, clinicalRisk: 95 },
  { exam: "NMC CBT", domainId: "duty_of_candour", domainLabel: "Duty of Candour", targetPercent: 6, countryOverlay: true, examOverlay: true, clinicalRisk: 93 },
  { exam: "NMBA RN", domainId: "professional_standards", domainLabel: "NMBA Professional Standards", targetPercent: 10, countryOverlay: true, examOverlay: true, clinicalRisk: 92 },
  { exam: "NMBA RN", domainId: "aboriginal_health", domainLabel: "Aboriginal and Torres Strait Islander Health", targetPercent: 12, countryOverlay: true, examOverlay: true, clinicalRisk: 94 },
  { exam: "NMBA RN", domainId: "rural_health", domainLabel: "Rural and Remote Healthcare", targetPercent: 9, countryOverlay: true, examOverlay: true, clinicalRisk: 88 },
  { exam: "NCNZ RN", domainId: "te_tiriti", domainLabel: "Te Tiriti o Waitangi", targetPercent: 12, countryOverlay: true, examOverlay: true, clinicalRisk: 95 },
  { exam: "NCNZ RN", domainId: "cultural_safety", domainLabel: "Cultural Safety", targetPercent: 12, countryOverlay: true, examOverlay: true, clinicalRisk: 94 },
];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : 0;
}

function priorityCategory(score: number): GlobalPriorityCategory {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  if (score >= 30) return "low";
  return "deferred";
}

function clinicalRiskScore(label: string): number {
  return CRITICAL_DOMAIN_RULES.find((rule) => rule.pattern.test(label))?.score ?? 72;
}

function seoImpactScore(label: string): number {
  if (/nclex|rex|cnple|news2|nmc|nmba|ncnz|safeguard|delegat|priorit|pharm|medication/i.test(label)) return 88;
  if (/cardio|respiratory|mental|pediatric|maternal|diagnos/i.test(label)) return 80;
  return 64;
}

function reuseLayerFor(label: string): BlueprintPriorityDomainScore["recommendedReuseLayer"] {
  const coreText = GLOBAL_CLINICAL_CORE_REGISTRY.join(" ");
  if (new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(coreText)) return "Global Core";
  if (/cardio|respiratory|mental|maternal|pediatric|pharm|assessment|infection|fundamental/i.test(label)) return "Global Core";
  if (/delegat|scope|priorit|leadership/i.test(label)) return "Role Overlay";
  if (/news2|safeguard|candour|nmba|ahpra|aboriginal|rural|tiriti|cultural/i.test(label)) return "Country Overlay";
  return "Exam Overlay";
}

function generationRuleFor(layer: BlueprintPriorityDomainScore["recommendedReuseLayer"], coveragePercent: number): BlueprintPriorityDomainScore["generationRule"] {
  if (layer === "Global Core" && coveragePercent > 0) return "reuse_before_generation";
  if (layer === "Role Overlay" || layer === "Country Overlay" || layer === "Exam Overlay") return "generate_missing_overlay_only";
  return "generation_justified_after_reuse_check";
}

function scoreDomain(report: BlueprintCoverageExamReport, row: BlueprintCoverageDomainRow): BlueprintPriorityDomainScore {
  const missingQuestions = row.missingContent.questions ?? 0;
  const missingFlashcards = row.missingContent.flashcards ?? 0;
  const missingSimulations = (row.missingContent.simulations ?? 0) + (row.missingContent.ngnCases ?? 0);
  const gapSeverity = 100 - row.coveragePercent;
  const examFrequencyScore = clampScore(row.targetPercent * 5.5 + (row.priority === "critical" ? 18 : row.priority === "high" ? 10 : 0));
  const riskScore = clinicalRiskScore(row.label);
  const blueprintWeightScore = clampScore(row.targetPercent * 6);
  const questionVolumeGapScore = clampScore((missingQuestions / Math.max(1, report.targets.questions * (row.targetPercent / 100))) * 100);
  const simulationValueScore = clampScore((missingSimulations / Math.max(1, (report.targets.simulations + report.targets.ngnCases) * (row.targetPercent / 100))) * 100);
  const flashcardValueScore = clampScore((missingFlashcards / Math.max(1, report.targets.flashcards * (row.targetPercent / 100))) * 100);
  const adaptiveLearningValueScore = clampScore((100 - report.adaptiveLearningPercent) * 0.45 + gapSeverity * 0.55);
  const monetizationImpactScore = clampScore((100 - report.monetizationPercent) * 0.55 + (report.exam === "NCLEX-RN" || report.exam === "FNP" || report.exam === "CNPLE" ? 35 : 25));
  const seoScore = seoImpactScore(row.label);
  const reusePotentialScore = clampScore(reuseLayerFor(row.label) === "Global Core" ? 92 : reuseLayerFor(row.label) === "Role Overlay" ? 78 : 68);

  const priorityScore = clampScore(
    examFrequencyScore * 0.15 +
      riskScore * 0.18 +
      blueprintWeightScore * 0.12 +
      questionVolumeGapScore * 0.14 +
      simulationValueScore * 0.11 +
      flashcardValueScore * 0.08 +
      adaptiveLearningValueScore * 0.1 +
      monetizationImpactScore * 0.07 +
      seoScore * 0.03 +
      reusePotentialScore * 0.02,
  );
  const layer = reuseLayerFor(row.label);

  return {
    exam: report.exam,
    domainId: row.domainId,
    domainLabel: row.label,
    priorityScore,
    priorityCategory: priorityCategory(priorityScore),
    examFrequencyScore,
    clinicalRiskScore: riskScore,
    blueprintWeightScore,
    questionVolumeGapScore,
    simulationValueScore,
    flashcardValueScore,
    adaptiveLearningValueScore,
    monetizationImpactScore,
    seoImpactScore: seoScore,
    internationalReusePotentialScore: reusePotentialScore,
    recommendedReuseLayer: layer,
    generationRule: generationRuleFor(layer, row.coveragePercent),
    rationale: `${row.label} has ${row.coveragePercent}% coverage for ${report.exam}, ${row.targetPercent}% blueprint weight, and ${riskScore}/100 clinical-risk priority. Reuse check points to ${layer}.`,
  };
}

function plannedInternationalScore(domain: PlannedInternationalDomain): BlueprintPriorityDomainScore {
  const reuseLayer = domain.countryOverlay ? "Country Overlay" : "Exam Overlay";
  const examFrequencyScore = clampScore(domain.targetPercent * 6 + 15);
  const blueprintWeightScore = clampScore(domain.targetPercent * 6);
  const seoScore = seoImpactScore(domain.domainLabel);
  const priorityScore = clampScore(
    examFrequencyScore * 0.15 +
      domain.clinicalRisk * 0.2 +
      blueprintWeightScore * 0.12 +
      100 * 0.14 +
      95 * 0.11 +
      95 * 0.08 +
      90 * 0.1 +
      60 * 0.07 +
      seoScore * 0.03 +
      72 * 0.02,
  );

  return {
    exam: domain.exam,
    domainId: domain.domainId,
    domainLabel: domain.domainLabel,
    priorityScore,
    priorityCategory: priorityCategory(priorityScore),
    examFrequencyScore,
    clinicalRiskScore: domain.clinicalRisk,
    blueprintWeightScore,
    questionVolumeGapScore: 100,
    simulationValueScore: 95,
    flashcardValueScore: 95,
    adaptiveLearningValueScore: 90,
    monetizationImpactScore: 60,
    seoImpactScore: seoScore,
    internationalReusePotentialScore: 72,
    recommendedReuseLayer: reuseLayer,
    generationRule: "generate_missing_overlay_only",
    rationale: `${domain.domainLabel} is a hidden international pathway requirement and should be built as a ${reuseLayer} after recovery and reuse classification.`,
  };
}

function backlogFromScore(
  score: BlueprintPriorityDomainScore,
  report?: BlueprintCoverageExamReport,
): Omit<GlobalBlueprintPrioritizedBacklogItem, "rank"> {
  const domainRow = report?.domainRows.find((row) => row.domainId === score.domainId);
  const lessonsNeeded = domainRow?.missingContent.lessons ?? (score.recommendedReuseLayer === "Country Overlay" ? 20 : 30);
  const questionsNeeded = domainRow?.missingContent.questions ?? (score.recommendedReuseLayer === "Country Overlay" ? 150 : 250);
  const flashcardsNeeded = domainRow?.missingContent.flashcards ?? (score.recommendedReuseLayer === "Country Overlay" ? 250 : 400);
  const simulationsNeeded = domainRow?.missingContent.simulations ?? (score.recommendedReuseLayer === "Country Overlay" ? 6 : 8);
  const ngnCasesNeeded = domainRow?.missingContent.ngnCases ?? (score.recommendedReuseLayer === "Country Overlay" ? 6 : 8);
  const estimatedCompletionEffortHours = Math.round(
    lessonsNeeded * CONTENT_EFFORT_HOURS.lessons +
      questionsNeeded * CONTENT_EFFORT_HOURS.questions +
      flashcardsNeeded * CONTENT_EFFORT_HOURS.flashcards +
      simulationsNeeded * CONTENT_EFFORT_HOURS.simulations +
      ngnCasesNeeded * CONTENT_EFFORT_HOURS.ngnCases,
  );
  const expectedRoi = clampScore(score.priorityScore * 0.68 + score.monetizationImpactScore * 0.2 + score.seoImpactScore * 0.12);
  const buildDecision =
    score.generationRule === "reuse_before_generation"
      ? "reuse_existing_core"
      : score.generationRule === "generate_missing_overlay_only"
        ? "build_overlay"
        : "create_new_content_after_gate";

  return {
    priority: score.priorityCategory,
    priorityScore: score.priorityScore,
    exam: score.exam,
    domain: score.domainLabel,
    lessonsNeeded,
    questionsNeeded,
    flashcardsNeeded,
    simulationsNeeded,
    ngnCasesNeeded,
    expectedRoi,
    estimatedCompletionEffortHours,
    reuseEvaluation: `Check ${score.recommendedReuseLayer} first. ${score.generationRule.replace(/_/g, " ")}.`,
    buildDecision,
  };
}

function groupReadiness(dashboard: BlueprintCoverageDashboard): GlobalBlueprintMonetizationReadiness {
  const exam = (name: BlueprintGapExam) => dashboard.exams.find((report) => report.exam === name)?.readinessPercent ?? 0;
  const rnReadiness = exam("NCLEX-RN");
  const pnReadiness = average([exam("REx-PN"), exam("NCLEX-PN")]);
  const npReadiness = average(["CNPLE", "FNP", "AGPCNP", "PMHNP", "PNP-PC", "WHNP", "ENP"].map((name) => exam(name as BlueprintGapExam)));
  return {
    rnReadiness,
    pnReadiness,
    npReadiness,
    ukReadiness: 0,
    australiaReadiness: 0,
    newZealandReadiness: 0,
    internationalReadiness: average([0, 0, 0]),
  };
}

export function buildGlobalBlueprintPrioritizationDashboard(
  coverageDashboard: BlueprintCoverageDashboard,
): GlobalBlueprintPrioritizationDashboard {
  const domesticScores = coverageDashboard.exams.flatMap((report) => report.domainRows.map((row) => scoreDomain(report, row)));
  const plannedInternationalScores = PLANNED_INTERNATIONAL_DOMAINS.map(plannedInternationalScore);
  const gapDashboard = [...domesticScores, ...plannedInternationalScores].sort((a, b) => b.priorityScore - a.priorityScore);
  const reportsByExam = new Map(coverageDashboard.exams.map((report) => [report.exam, report]));
  const contentRoiDashboard = gapDashboard
    .map((score) => backlogFromScore(score, typeof score.exam === "string" ? reportsByExam.get(score.exam as BlueprintGapExam) : undefined))
    .sort((a, b) => b.expectedRoi - a.expectedRoi || b.priorityScore - a.priorityScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  const monetizationDashboard = groupReadiness(coverageDashboard);

  return {
    generatedAt: new Date().toISOString(),
    sourceCoverageGeneratedAt: coverageDashboard.generatedAt,
    blueprintCoverageDashboard: {
      overallCoveragePercent: coverageDashboard.overallCoveragePercent,
      readinessPercent: coverageDashboard.readinessPercent,
      publicationPercent: coverageDashboard.publicationPercent,
      monetizationPercent: coverageDashboard.monetizationPercent,
      adaptiveLearningPercent: coverageDashboard.adaptiveLearningPercent,
    },
    gapDashboard,
    contentRoiDashboard,
    monetizationDashboard,
    reuseDashboard: {
      globalCoreTopics: GLOBAL_CLINICAL_CORE_REGISTRY,
      reuseFirstBacklogItems: contentRoiDashboard.filter((item) => item.buildDecision === "reuse_existing_core").length,
      overlayFirstBacklogItems: contentRoiDashboard.filter((item) => item.buildDecision === "build_overlay").length,
      newContentGateItems: contentRoiDashboard.filter((item) => item.buildDecision === "create_new_content_after_gate").length,
    },
    internationalReadinessDashboard: {
      ukReadiness: monetizationDashboard.ukReadiness,
      australiaReadiness: monetizationDashboard.australiaReadiness,
      newZealandReadiness: monetizationDashboard.newZealandReadiness,
      requiredNextAction: "recover_classify_reuse_then_generate",
    },
    highestRoiNextBuilds: contentRoiDashboard.slice(0, 25),
  };
}
