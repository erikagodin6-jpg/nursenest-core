import type { SeoPageProfile, SearchConsolePerformanceRow } from "@/lib/seo/search-console-optimization-engine";

export type FreshnessPageKind =
  | "certification_guide"
  | "medication_page"
  | "disease_page"
  | "lab_page"
  | "career_page"
  | "salary_page"
  | "school_page"
  | "interview_guide"
  | "care_plan"
  | "clinical_skill"
  | "article";

export type ReviewStatus = "current" | "needs_review" | "needs_refresh" | "needs_expansion" | "needs_consolidation" | "needs_removal";
export type ContentFreshnessBadge = "Recently Updated" | "Clinically Reviewed" | "2026 Edition" | "Current Guide" | "Evidence Reviewed";

export type UpdateWorkflowCheck =
  | "clinical_accuracy"
  | "guidelines"
  | "references"
  | "statistics"
  | "salaries"
  | "admissions_requirements"
  | "certification_changes"
  | "career_outlook"
  | "regulatory_changes";

export type CertificationTracker = "NCLEX" | "REx-PN" | "CNPLE" | "FNP" | "PMHNP" | "AGPCNP" | "WHNP" | "PNP-PC" | "TEAS" | "HESI" | "CASPER";
export type CareerSalaryUpdateSignal = "provincial_salaries" | "licensing_changes" | "admission_changes" | "program_changes" | "healthcare_workforce_trends";

export type ContentDateState = {
  publishedAt: string;
  reviewedAt: string;
  updatedAt: string;
  ageScore: number;
  freshnessScore: number;
  reviewStatus: ReviewStatus;
};

export type ReviewCyclePolicy = {
  pageKind: FreshnessPageKind;
  reviewEveryMonths: number;
};

export type StaleContentFinding = {
  url: string;
  pageKind: FreshnessPageKind;
  daysSinceReview: number;
  daysSinceUpdate: number;
  reviewStatus: ReviewStatus;
  badges: readonly ContentFreshnessBadge[];
  recommendedActions: readonly UpdateWorkflowCheck[];
};

export type ContentDecaySignal = {
  url: string;
  trafficLossPercent: number;
  rankingLoss: number;
  ctrLossPercent: number;
  impressionLossPercent: number;
  authorityDeclinePercent: number;
  recommendations: readonly string[];
};

export type FreshnessOpportunity = {
  url: string;
  impressions: number;
  ctr: number;
  position: number;
  opportunity: "low_ctr" | "position_5_to_20" | "high_impression_refresh";
  priority: "high" | "medium" | "low";
};

export type CertificationUpdateImpact = {
  certification: CertificationTracker;
  blueprintChanged: boolean;
  affectedContentTypes: readonly FreshnessPageKind[];
  action: "monitor" | "review_affected_content" | "refresh_immediately";
};

export type FreshnessDashboard = {
  pagesUpdatedThisMonth: number;
  pagesNeedingReview: number;
  pagesAtRisk: number;
  pagesWithTrafficDecline: number;
  pagesSuccessfullyRefreshed: number;
  freshnessCoveragePercent: number;
};

export type AuthorityScoreImpact = {
  trafficChangePercent: number;
  rankingChange: number;
  ctrChangePercent: number;
  conversionChangePercent: number;
};

export type ExecutiveFreshnessReport = {
  updateThisMonth: readonly string[];
  becomingStale: readonly string[];
  losingAuthority: readonly string[];
  highestSeoImpact: readonly string[];
};

export type ContentFreshnessEngineDashboard = {
  reviewPolicies: number;
  certificationTrackers: number;
  workflowChecks: number;
  careerSalarySignals: number;
  freshnessBadges: number;
};

export const REVIEW_CYCLE_POLICIES: readonly ReviewCyclePolicy[] = [
  policy("certification_guide", 6),
  policy("medication_page", 12),
  policy("disease_page", 12),
  policy("lab_page", 12),
  policy("career_page", 6),
  policy("salary_page", 6),
  policy("school_page", 6),
  policy("interview_guide", 12),
] as const;

export const UPDATE_WORKFLOW_CHECKS = [
  "clinical_accuracy",
  "guidelines",
  "references",
  "statistics",
  "salaries",
  "admissions_requirements",
  "certification_changes",
  "career_outlook",
  "regulatory_changes",
] as const satisfies readonly UpdateWorkflowCheck[];

export const CERTIFICATION_UPDATE_TRACKERS = ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "AGPCNP", "WHNP", "PNP-PC", "TEAS", "HESI", "CASPER"] as const satisfies readonly CertificationTracker[];
export const CAREER_SALARY_UPDATE_SIGNALS = ["provincial_salaries", "licensing_changes", "admission_changes", "program_changes", "healthcare_workforce_trends"] as const satisfies readonly CareerSalaryUpdateSignal[];
export const CONTENT_FRESHNESS_BADGES = ["Recently Updated", "Clinically Reviewed", "2026 Edition", "Current Guide", "Evidence Reviewed"] as const satisfies readonly ContentFreshnessBadge[];

export function getReviewCycleMonths(pageKind: FreshnessPageKind): number {
  return REVIEW_CYCLE_POLICIES.find((policyItem) => policyItem.pageKind === pageKind)?.reviewEveryMonths ?? 12;
}

export function evaluateContentDateState(args: {
  pageKind: FreshnessPageKind;
  publishedAt: string;
  reviewedAt: string;
  updatedAt: string;
  asOf?: Date;
}): ContentDateState {
  const asOf = args.asOf ?? new Date();
  const reviewCycleDays = getReviewCycleMonths(args.pageKind) * 30;
  const daysSincePublish = daysBetween(args.publishedAt, asOf);
  const daysSinceReview = daysBetween(args.reviewedAt, asOf);
  const daysSinceUpdate = daysBetween(args.updatedAt, asOf);
  const ageScore = clampScore(100 - Math.round((daysSincePublish / 1460) * 100));
  const freshnessScore = clampScore(100 - Math.round((Math.max(daysSinceReview, daysSinceUpdate) / reviewCycleDays) * 100));
  return {
    publishedAt: args.publishedAt,
    reviewedAt: args.reviewedAt,
    updatedAt: args.updatedAt,
    ageScore,
    freshnessScore,
    reviewStatus: statusForFreshness(daysSinceReview, daysSinceUpdate, reviewCycleDays),
  };
}

export function detectStaleContent(profile: SeoPageProfile & { pageKind?: FreshnessPageKind }, asOf: Date = new Date()): StaleContentFinding {
  const pageKind = profile.pageKind ?? mapProfileContentType(profile.contentType);
  const updatedAt = profile.updatedAt ?? "1970-01-01";
  const reviewedAt = profile.updatedAt ?? "1970-01-01";
  const dateState = evaluateContentDateState({
    pageKind,
    publishedAt: updatedAt,
    reviewedAt,
    updatedAt,
    asOf,
  });
  return {
    url: profile.url,
    pageKind,
    daysSinceReview: daysBetween(reviewedAt, asOf),
    daysSinceUpdate: daysBetween(updatedAt, asOf),
    reviewStatus: dateState.reviewStatus,
    badges: badgesForProfile(profile, dateState),
    recommendedActions: workflowChecksForPageKind(pageKind),
  };
}

export function detectContentDecay(args: {
  current: SearchConsolePerformanceRow;
  previous: SearchConsolePerformanceRow;
  authorityScorePrevious: number;
  authorityScoreCurrent: number;
}): ContentDecaySignal {
  const trafficLossPercent = percentLoss(args.previous.clicks, args.current.clicks);
  const impressionLossPercent = percentLoss(args.previous.impressions, args.current.impressions);
  const ctrLossPercent = percentLoss(args.previous.ctr, args.current.ctr);
  const rankingLoss = Math.max(0, args.current.position - args.previous.position);
  const authorityDeclinePercent = percentLoss(args.authorityScorePrevious, args.authorityScoreCurrent);
  const recommendations: string[] = [];
  if (trafficLossPercent >= 20) recommendations.push("Refresh title, introduction, internal links, and high-intent sections.");
  if (rankingLoss >= 3) recommendations.push("Expand topical depth and add stronger related resources.");
  if (ctrLossPercent >= 20) recommendations.push("Rewrite SEO title and meta description for search intent match.");
  if (impressionLossPercent >= 20) recommendations.push("Review indexing, seasonality, and cluster support pages.");
  if (authorityDeclinePercent >= 10) recommendations.push("Update references, reviewer metadata, and entity links.");
  return {
    url: args.current.page,
    trafficLossPercent,
    rankingLoss,
    ctrLossPercent,
    impressionLossPercent,
    authorityDeclinePercent,
    recommendations,
  };
}

export function findFreshnessOpportunity(row: SearchConsolePerformanceRow): FreshnessOpportunity | undefined {
  if (row.impressions < 500) return undefined;
  if (row.position >= 5 && row.position <= 20) {
    return {
      url: row.page,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      opportunity: row.ctr < 0.03 ? "low_ctr" : "position_5_to_20",
      priority: row.impressions >= 2000 || row.ctr < 0.015 ? "high" : "medium",
    };
  }
  if (row.impressions >= 2000 && row.ctr < 0.02) {
    return { url: row.page, impressions: row.impressions, ctr: row.ctr, position: row.position, opportunity: "high_impression_refresh", priority: "high" };
  }
  return undefined;
}

export function assessCertificationUpdateImpact(certification: CertificationTracker, blueprintChanged: boolean): CertificationUpdateImpact {
  const affectedContentTypes: readonly FreshnessPageKind[] = ["certification_guide", "article", "care_plan"];
  return {
    certification,
    blueprintChanged,
    affectedContentTypes,
    action: blueprintChanged ? "refresh_immediately" : "monitor",
  };
}

export function calculateAuthorityScoreImpact(before: { traffic: number; ranking: number; ctr: number; conversions: number }, after: { traffic: number; ranking: number; ctr: number; conversions: number }): AuthorityScoreImpact {
  return {
    trafficChangePercent: percentChange(before.traffic, after.traffic),
    rankingChange: Math.round((before.ranking - after.ranking) * 10) / 10,
    ctrChangePercent: percentChange(before.ctr, after.ctr),
    conversionChangePercent: percentChange(before.conversions, after.conversions),
  };
}

export function buildFreshnessDashboard(findings: readonly StaleContentFinding[], decaySignals: readonly ContentDecaySignal[], refreshedUrls: readonly string[] = []): FreshnessDashboard {
  const pagesNeedingReview = findings.filter((finding) => finding.reviewStatus !== "current").length;
  const total = findings.length || 1;
  return {
    pagesUpdatedThisMonth: findings.filter((finding) => finding.daysSinceUpdate <= 31).length,
    pagesNeedingReview,
    pagesAtRisk: findings.filter((finding) => ["needs_consolidation", "needs_removal"].includes(finding.reviewStatus)).length,
    pagesWithTrafficDecline: decaySignals.filter((signal) => signal.recommendations.length > 0).length,
    pagesSuccessfullyRefreshed: refreshedUrls.length,
    freshnessCoveragePercent: Math.round(((total - pagesNeedingReview) / total) * 100),
  };
}

export function buildExecutiveFreshnessReport(args: {
  staleFindings: readonly StaleContentFinding[];
  decaySignals: readonly ContentDecaySignal[];
  opportunities: readonly FreshnessOpportunity[];
}): ExecutiveFreshnessReport {
  return {
    updateThisMonth: args.staleFindings.filter((finding) => finding.reviewStatus === "needs_review" || finding.reviewStatus === "needs_refresh").map((finding) => finding.url),
    becomingStale: args.staleFindings.filter((finding) => finding.reviewStatus !== "current").map((finding) => finding.url),
    losingAuthority: args.decaySignals.filter((signal) => signal.recommendations.length > 0).map((signal) => signal.url),
    highestSeoImpact: args.opportunities.filter((opportunity) => opportunity.priority === "high").map((opportunity) => opportunity.url),
  };
}

export function buildContentFreshnessEngineDashboard(): ContentFreshnessEngineDashboard {
  return {
    reviewPolicies: REVIEW_CYCLE_POLICIES.length,
    certificationTrackers: CERTIFICATION_UPDATE_TRACKERS.length,
    workflowChecks: UPDATE_WORKFLOW_CHECKS.length,
    careerSalarySignals: CAREER_SALARY_UPDATE_SIGNALS.length,
    freshnessBadges: CONTENT_FRESHNESS_BADGES.length,
  };
}

function policy(pageKind: FreshnessPageKind, reviewEveryMonths: number): ReviewCyclePolicy {
  return { pageKind, reviewEveryMonths };
}

function statusForFreshness(daysSinceReview: number, daysSinceUpdate: number, reviewCycleDays: number): ReviewStatus {
  const staleBy = Math.max(daysSinceReview, daysSinceUpdate) - reviewCycleDays;
  if (staleBy <= 0) return "current";
  if (staleBy <= 45) return "needs_review";
  if (staleBy <= 120) return "needs_refresh";
  if (staleBy <= 240) return "needs_expansion";
  if (staleBy <= 365) return "needs_consolidation";
  return "needs_removal";
}

function workflowChecksForPageKind(pageKind: FreshnessPageKind): readonly UpdateWorkflowCheck[] {
  if (pageKind === "salary_page") return ["statistics", "salaries", "career_outlook", "references"];
  if (pageKind === "school_page") return ["admissions_requirements", "statistics", "references"];
  if (pageKind === "certification_guide") return ["certification_changes", "guidelines", "references"];
  if (pageKind === "career_page") return ["career_outlook", "regulatory_changes", "statistics"];
  if (["medication_page", "disease_page", "lab_page", "care_plan", "clinical_skill"].includes(pageKind)) return ["clinical_accuracy", "guidelines", "references"];
  return ["references", "statistics"];
}

function badgesForProfile(profile: SeoPageProfile, dateState: ContentDateState): readonly ContentFreshnessBadge[] {
  const badges: ContentFreshnessBadge[] = [];
  if (daysBetween(dateState.updatedAt, new Date("2026-05-31")) <= 90) badges.push("Recently Updated");
  if (profile.clinicalReviewStatus === "clinically_reviewed") badges.push("Clinically Reviewed");
  if (dateState.updatedAt.startsWith("2026") || dateState.reviewedAt.startsWith("2026")) badges.push("2026 Edition");
  if (dateState.reviewStatus === "current") badges.push("Current Guide");
  if ((profile.referencesCount ?? 0) > 0) badges.push("Evidence Reviewed");
  return badges;
}

function mapProfileContentType(contentType: SeoPageProfile["contentType"]): FreshnessPageKind {
  if (contentType === "medication") return "medication_page";
  if (contentType === "disease") return "disease_page";
  if (contentType === "care-plan") return "care_plan";
  if (contentType === "lab") return "lab_page";
  if (contentType === "skill") return "clinical_skill";
  if (contentType === "career") return "career_page";
  if (contentType === "certification") return "certification_guide";
  return "article";
}

function daysBetween(dateIso: string, asOf: Date): number {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return 9999;
  return Math.max(0, Math.floor((asOf.getTime() - date.getTime()) / 86_400_000));
}

function percentLoss(previous: number, current: number): number {
  if (previous <= 0) return 0;
  return Math.max(0, Math.round(((previous - current) / previous) * 100));
}

function percentChange(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}
