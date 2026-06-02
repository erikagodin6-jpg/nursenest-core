import type { BlueprintCoverageDashboard, BlueprintCoverageExamReport } from "@/lib/blueprints/blueprint-coverage-gap-engine";
import { EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { GLOBAL_EXAM_REGISTRY } from "@/lib/exam-pathways/global-exam-registry";
import { evaluatePathwayLaunchReadiness } from "@/lib/navigation/country-exam-launch-readiness";

export type CommercialLaunchPathway =
  | "NCLEX-RN"
  | "NCLEX-PN"
  | "REx-PN"
  | "CNPLE"
  | "FNP"
  | "NMC CBT"
  | "Australia RN"
  | "New Zealand RN"
  | "Future pathways";

export type CommercialLaunchStatus = "Not Ready" | "Development" | "Beta Candidate" | "Launch Candidate";

export type CommercialReadinessExternalSignals = {
  readonly qualityReadinessByPathway?: Partial<Record<CommercialLaunchPathway, number>>;
  readonly monetizationContractsPass?: boolean;
  readonly conversionFunnelTested?: boolean;
  readonly reliabilityEvidenceByPathway?: Partial<Record<CommercialLaunchPathway, number>>;
};

export type CommercialLaunchGateScores = {
  readonly contentReadiness: number;
  readonly qualityReadiness: number;
  readonly adaptiveReadiness: number;
  readonly seoReadiness: number;
  readonly commercialReadiness: number;
  readonly reliabilityReadiness: number;
  readonly conversionReadiness: number;
  readonly overallLaunchReadiness: number;
};

export type CommercialLaunchGateResult = {
  readonly pathway: CommercialLaunchPathway;
  readonly pathwayId: string | null;
  readonly displayName: string;
  readonly launchStatus: CommercialLaunchStatus;
  readonly scores: CommercialLaunchGateScores;
  readonly launchBlockers: readonly string[];
  readonly estimatedRevenueOpportunity: "very_high" | "high" | "medium" | "low" | "deferred";
  readonly recommendedAction: string;
};

export type CommercialReadinessLaunchDashboard = {
  readonly generatedAt: string;
  readonly launchReadinessDashboard: readonly CommercialLaunchGateResult[];
  readonly commercialReadinessDashboard: readonly Pick<CommercialLaunchGateResult, "pathway" | "pathwayId" | "launchStatus" | "scores" | "launchBlockers">[];
  readonly revenueReadinessDashboard: readonly Pick<CommercialLaunchGateResult, "pathway" | "estimatedRevenueOpportunity" | "recommendedAction">[];
  readonly conversionReadinessDashboard: readonly { pathway: CommercialLaunchPathway; conversionReadiness: number; status: CommercialLaunchStatus }[];
  readonly reliabilityDashboard: readonly { pathway: CommercialLaunchPathway; reliabilityReadiness: number; status: CommercialLaunchStatus; blockers: readonly string[] }[];
  readonly recommendedLaunchOrder: readonly CommercialLaunchGateResult[];
  readonly remainingWorkReport: readonly { pathway: CommercialLaunchPathway; blockers: readonly string[]; nextAction: string }[];
};

type PathwayAuditConfig = {
  readonly pathway: CommercialLaunchPathway;
  readonly pathwayId: string | null;
  readonly blueprintExam?: string;
  readonly fallbackDisplayName: string;
  readonly revenueOpportunity: CommercialLaunchGateResult["estimatedRevenueOpportunity"];
};

const PATHWAYS_TO_AUDIT: readonly PathwayAuditConfig[] = [
  { pathway: "NCLEX-RN", pathwayId: "us-rn-nclex-rn", blueprintExam: "NCLEX-RN", fallbackDisplayName: "NCLEX-RN", revenueOpportunity: "very_high" },
  { pathway: "NCLEX-PN", pathwayId: "us-lpn-nclex-pn", blueprintExam: "NCLEX-PN", fallbackDisplayName: "NCLEX-PN", revenueOpportunity: "high" },
  { pathway: "REx-PN", pathwayId: "ca-rpn-rex-pn", blueprintExam: "REx-PN", fallbackDisplayName: "REx-PN", revenueOpportunity: "high" },
  { pathway: "CNPLE", pathwayId: "ca-np-cnple", blueprintExam: "CNPLE", fallbackDisplayName: "CNPLE", revenueOpportunity: "medium" },
  { pathway: "FNP", pathwayId: "us-np-fnp", blueprintExam: "FNP", fallbackDisplayName: "FNP", revenueOpportunity: "very_high" },
  { pathway: "NMC CBT", pathwayId: "uk-rn-nmc-test-of-competence", fallbackDisplayName: "NMC CBT", revenueOpportunity: "high" },
  { pathway: "Australia RN", pathwayId: "au-rn-iqnm-pathway", fallbackDisplayName: "Australia RN", revenueOpportunity: "high" },
  { pathway: "New Zealand RN", pathwayId: null, fallbackDisplayName: "New Zealand RN", revenueOpportunity: "medium" },
  { pathway: "Future pathways", pathwayId: null, fallbackDisplayName: "Future pathways", revenueOpportunity: "deferred" },
];

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(1))));
}

function statusFor(score: number): CommercialLaunchStatus {
  if (score >= 95) return "Launch Candidate";
  if (score >= 80) return "Beta Candidate";
  if (score >= 60) return "Development";
  return "Not Ready";
}

function coverageReportFor(dashboard: BlueprintCoverageDashboard, exam?: string): BlueprintCoverageExamReport | null {
  if (!exam) return null;
  return dashboard.exams.find((report) => report.exam === exam) ?? null;
}

function scoreSeo(pathway: ExamPathwayDefinition | null): number {
  if (!pathway) return 0;
  const title = pathway.seoTitle.trim();
  const description = pathway.seoDescription.trim();
  const metadataScore = (title.length >= 35 ? 30 : 0) + (description.length >= 80 ? 35 : 0);
  const routeScore = pathway.status === "hidden" ? 0 : 20;
  const acquisitionScore = pathway.acquisitionMode === "subscribe" ? 15 : pathway.acquisitionMode === "waitlist" ? 5 : 0;
  return clampPercent(metadataScore + routeScore + acquisitionScore);
}

function scoreCommercial(pathway: ExamPathwayDefinition | null, signals: CommercialReadinessExternalSignals): number {
  if (!pathway) return 0;
  if (pathway.status === "hidden" || pathway.acquisitionMode !== "subscribe") return 0;
  return signals.monetizationContractsPass === true ? 100 : 65;
}

function scoreConversion(pathway: ExamPathwayDefinition | null, signals: CommercialReadinessExternalSignals): number {
  if (!pathway) return 0;
  if (pathway.status === "hidden") return 0;
  if (pathway.acquisitionMode !== "subscribe") return 35;
  return signals.conversionFunnelTested === true ? 100 : 70;
}

function scoreReliability(pathway: ExamPathwayDefinition | null, pathwayName: CommercialLaunchPathway, signals: CommercialReadinessExternalSignals): { score: number; blockers: string[] } {
  const explicit = signals.reliabilityEvidenceByPathway?.[pathwayName];
  if (typeof explicit === "number") return { score: clampPercent(explicit), blockers: explicit >= 99.9 ? [] : [`Reliability evidence is ${explicit}%; launch requires 99.9%.`] };
  if (!pathway) return { score: 0, blockers: ["No pathway registry entry exists for deterministic reliability checks."] };
  const evaluation = evaluatePathwayLaunchReadiness(pathway);
  const passed = evaluation.checks.filter((check) => check.pass).length;
  const score = evaluation.checks.length > 0 ? clampPercent((passed / evaluation.checks.length) * 100) : 0;
  const blockers = evaluation.checks.filter((check) => !check.pass).map((check) => `${check.label}: ${check.detail ?? "failed"}`);
  return { score: score === 100 ? 99.9 : score, blockers };
}

function scoreInternationalSeoOnly(pathway: CommercialLaunchPathway): number {
  const entry = GLOBAL_EXAM_REGISTRY.find((row) => {
    if (pathway === "New Zealand RN") return row.id === "global-nz-rn-ncnz";
    return false;
  });
  if (!entry) return 0;
  return entry.noindex || !entry.sitemapEligible || !entry.navigationEligible ? 0 : 95;
}

function blockersFor(scores: CommercialLaunchGateScores, reliabilityBlockers: readonly string[]): string[] {
  const blockers: string[] = [];
  if (scores.contentReadiness < 95) blockers.push(`Content gate ${scores.contentReadiness}% is below 95%.`);
  if (scores.qualityReadiness < 95) blockers.push(`Quality gate ${scores.qualityReadiness}% is below 95%.`);
  if (scores.adaptiveReadiness < 95) blockers.push(`Adaptive learning gate ${scores.adaptiveReadiness}% is below 95%.`);
  if (scores.seoReadiness < 95) blockers.push(`SEO gate ${scores.seoReadiness}% is below 95%.`);
  if (scores.commercialReadiness < 100) blockers.push(`Monetization gate ${scores.commercialReadiness}% is below 100%.`);
  if (scores.reliabilityReadiness < 99.9) blockers.push(`Reliability gate ${scores.reliabilityReadiness}% is below 99.9%.`);
  if (scores.conversionReadiness < 95) blockers.push(`Conversion gate ${scores.conversionReadiness}% is not established and tested.`);
  blockers.push(...reliabilityBlockers);
  return [...new Set(blockers)];
}

function recommendedActionFor(blockers: readonly string[]): string {
  if (blockers.length === 0) return "Proceed to final human launch approval.";
  if (blockers.some((blocker) => /Content|Quality|Adaptive/i.test(blocker))) return "Close content, quality, and adaptive-learning gaps before commercial launch work.";
  if (blockers.some((blocker) => /Monetization|checkout|pricing|subscription/i.test(blocker))) return "Fix pricing, checkout, trial, subscription, receipt, and upgrade proof before launch.";
  if (blockers.some((blocker) => /Reliability|loads|route/i.test(blocker))) return "Run and pass route/load reliability checks for learner-critical flows.";
  return "Complete SEO and conversion evidence before launch approval.";
}

export function buildCommercialReadinessLaunchDashboard(
  coverageDashboard: BlueprintCoverageDashboard,
  signals: CommercialReadinessExternalSignals = {},
): CommercialReadinessLaunchDashboard {
  const rows = PATHWAYS_TO_AUDIT.map((config): CommercialLaunchGateResult => {
    const pathway = config.pathwayId ? (getExamPathwayById(config.pathwayId) ?? null) : null;
    const report = coverageReportFor(coverageDashboard, config.blueprintExam);
    const contentReadiness = clampPercent(report?.overallCoveragePercent ?? 0);
    const qualityReadiness = clampPercent(signals.qualityReadinessByPathway?.[config.pathway] ?? report?.publicationPercent ?? 0);
    const adaptiveReadiness = clampPercent(report?.adaptiveLearningPercent ?? 0);
    const seoReadiness = config.pathway === "New Zealand RN" ? scoreInternationalSeoOnly(config.pathway) : scoreSeo(pathway);
    const commercialReadiness = scoreCommercial(pathway, signals);
    const conversionReadiness = scoreConversion(pathway, signals);
    const reliability = scoreReliability(pathway, config.pathway, signals);
    const scores: CommercialLaunchGateScores = {
      contentReadiness,
      qualityReadiness,
      adaptiveReadiness,
      seoReadiness,
      commercialReadiness,
      reliabilityReadiness: reliability.score,
      conversionReadiness,
      overallLaunchReadiness: Math.min(
        contentReadiness,
        qualityReadiness,
        adaptiveReadiness,
        seoReadiness,
        commercialReadiness,
        reliability.score,
        conversionReadiness,
      ),
    };
    const launchBlockers = blockersFor(scores, reliability.blockers);
    return {
      pathway: config.pathway,
      pathwayId: config.pathwayId,
      displayName: pathway?.displayName ?? config.fallbackDisplayName,
      launchStatus: statusFor(scores.overallLaunchReadiness),
      scores,
      launchBlockers,
      estimatedRevenueOpportunity: config.revenueOpportunity,
      recommendedAction: recommendedActionFor(launchBlockers),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    launchReadinessDashboard: rows,
    commercialReadinessDashboard: rows.map(({ pathway, pathwayId, launchStatus, scores, launchBlockers }) => ({
      pathway,
      pathwayId,
      launchStatus,
      scores,
      launchBlockers,
    })),
    revenueReadinessDashboard: rows.map(({ pathway, estimatedRevenueOpportunity, recommendedAction }) => ({
      pathway,
      estimatedRevenueOpportunity,
      recommendedAction,
    })),
    conversionReadinessDashboard: rows.map((row) => ({
      pathway: row.pathway,
      conversionReadiness: row.scores.conversionReadiness,
      status: statusFor(row.scores.conversionReadiness),
    })),
    reliabilityDashboard: rows.map((row) => ({
      pathway: row.pathway,
      reliabilityReadiness: row.scores.reliabilityReadiness,
      status: statusFor(row.scores.reliabilityReadiness),
      blockers: row.launchBlockers.filter((blocker) => /Reliability|route|lessons|questions|published|hub/i.test(blocker)),
    })),
    recommendedLaunchOrder: rows
      .slice()
      .sort((a, b) => b.scores.overallLaunchReadiness - a.scores.overallLaunchReadiness || b.scores.commercialReadiness - a.scores.commercialReadiness),
    remainingWorkReport: rows.map((row) => ({
      pathway: row.pathway,
      blockers: row.launchBlockers,
      nextAction: row.recommendedAction,
    })),
  };
}

export function validateCommercialLaunchGateDashboard(dashboard: CommercialReadinessLaunchDashboard): readonly string[] {
  const issues: string[] = [];
  for (const row of dashboard.launchReadinessDashboard) {
    if (row.launchStatus === "Launch Candidate" && row.launchBlockers.length > 0) {
      issues.push(`${row.pathway} cannot be a Launch Candidate with open blockers.`);
    }
    if (row.scores.commercialReadiness < 100 && row.launchStatus === "Launch Candidate") {
      issues.push(`${row.pathway} cannot launch without 100% commercial readiness.`);
    }
    if (row.scores.reliabilityReadiness < 99.9 && row.launchStatus === "Launch Candidate") {
      issues.push(`${row.pathway} cannot launch without 99.9% reliability readiness.`);
    }
  }
  return issues;
}
