export type FacultyReviewRole =
  | "clinician"
  | "educator"
  | "psychometrician"
  | "editorial";

export type FacultyReviewDecision =
  | "approved"
  | "approved-with-revisions"
  | "needs-remediation"
  | "rejected";

export type FacultyReviewEntry = {
  role: FacultyReviewRole;
  reviewerId?: string | null;
  decision: FacultyReviewDecision;
  reviewedAt?: string | Date | null;
  notes?: string | null;
};

export type FacultyGovernanceInput = {
  questionId?: string | null;
  reviews?: FacultyReviewEntry[] | null;
  clinicalRiskFlags?: number | null;
  psychometricScore?: number | null;
  clinicalQualityScore?: number | null;
};

export type FacultyGovernanceResult = {
  governanceStatus:
    | "pending"
    | "provisionally-approved"
    | "approved"
    | "restricted"
    | "rejected";
  approvalScore: number;
  missingReviews: FacultyReviewRole[];
  recommendations: string[];
  publishEligible: boolean;
};

const REQUIRED_ROLES: FacultyReviewRole[] = [
  "clinician",
  "educator",
  "psychometrician",
];

function normalizeDecision(decision: FacultyReviewDecision): FacultyReviewDecision {
  return decision;
}

export function evaluateFacultyReviewGovernance(
  input: FacultyGovernanceInput,
): FacultyGovernanceResult {
  const reviews = input.reviews ?? [];
  const recommendations: string[] = [];

  const approvedRoles = new Set<FacultyReviewRole>();
  let rejectionCount = 0;
  let remediationCount = 0;

  for (const review of reviews) {
    const decision = normalizeDecision(review.decision);

    if (decision === "approved" || decision === "approved-with-revisions") {
      approvedRoles.add(review.role);
    }

    if (decision === "rejected") rejectionCount += 1;
    if (decision === "needs-remediation") remediationCount += 1;
  }

  const missingReviews = REQUIRED_ROLES.filter((role) => !approvedRoles.has(role));

  let approvalScore = approvedRoles.size / REQUIRED_ROLES.length;

  if ((input.clinicalRiskFlags ?? 0) >= 2) {
    approvalScore -= 0.2;
    recommendations.push("Resolve high-risk clinical findings before approval.");
  }

  if ((input.psychometricScore ?? 100) < 70) {
    approvalScore -= 0.15;
    recommendations.push("Improve psychometric quality before release.");
  }

  if ((input.clinicalQualityScore ?? 100) < 75) {
    approvalScore -= 0.15;
    recommendations.push("Improve clinical rationale quality before release.");
  }

  approvalScore -= rejectionCount * 0.35;
  approvalScore -= remediationCount * 0.12;

  approvalScore = Math.max(0, Math.min(1, Number(approvalScore.toFixed(2))));

  let governanceStatus: FacultyGovernanceResult["governanceStatus"] = "pending";

  if (rejectionCount > 0) {
    governanceStatus = "rejected";
  } else if (approvalScore >= 0.95 && missingReviews.length === 0) {
    governanceStatus = "approved";
  } else if (approvalScore >= 0.7) {
    governanceStatus = "provisionally-approved";
  }

  if ((input.clinicalRiskFlags ?? 0) >= 3) {
    governanceStatus = "restricted";
    recommendations.push("Restrict exposure until faculty escalation is complete.");
  }

  if (missingReviews.length > 0) {
    recommendations.push(`Missing required reviews: ${missingReviews.join(", ")}`);
  }

  return {
    governanceStatus,
    approvalScore,
    missingReviews,
    recommendations,
    publishEligible:
      governanceStatus === "approved" ||
      governanceStatus === "provisionally-approved",
  };
}
