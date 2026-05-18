export type ReviewerDiscipline =
  | "clinical"
  | "evidence"
  | "psychometric"
  | "editorial"
  | "accessibility";

export type ReviewDecision = "approved" | "rejected" | "changes-requested" | "pending";

export type ReviewRecord = {
  discipline: ReviewerDiscipline;
  reviewerId?: string | null;
  reviewerName?: string | null;
  decision: ReviewDecision;
  reviewedAt?: string | null;
  notes?: string | null;
};

export type GovernanceWorkflowInput = {
  contentId?: string | null;
  riskLevel?: "low" | "moderate" | "high" | "critical";
  disciplinesRequired?: ReviewerDiscipline[] | null;
  reviews?: ReviewRecord[] | null;
};

export type GovernanceWorkflowResult = {
  publishReady: boolean;
  completedDisciplines: ReviewerDiscipline[];
  missingDisciplines: ReviewerDiscipline[];
  blockedBy: string[];
  workflowScore: number;
};

const defaultRequired: ReviewerDiscipline[] = [
  "clinical",
  "evidence",
  "psychometric",
];

export function evaluateReviewerWorkflow(
  input: GovernanceWorkflowInput,
): GovernanceWorkflowResult {
  const reviews = input.reviews ?? [];
  const required = input.disciplinesRequired ?? defaultRequired;
  const blockedBy: string[] = [];

  if (input.riskLevel === "critical") {
    if (!required.includes("editorial")) required.push("editorial");
    if (!required.includes("accessibility")) required.push("accessibility");
  }

  const completedDisciplines: ReviewerDiscipline[] = [];
  const missingDisciplines: ReviewerDiscipline[] = [];

  for (const discipline of required) {
    const approved = reviews.find(
      (review) =>
        review.discipline === discipline &&
        review.decision === "approved" &&
        review.reviewerId &&
        review.reviewedAt,
    );

    const rejected = reviews.find(
      (review) => review.discipline === discipline && review.decision === "rejected",
    );

    if (rejected) {
      blockedBy.push(`${discipline}:rejected`);
    }

    if (approved) {
      completedDisciplines.push(discipline);
    } else {
      missingDisciplines.push(discipline);
    }
  }

  const pendingChanges = reviews.filter(
    (review) => review.decision === "changes-requested",
  );
  if (pendingChanges.length > 0) {
    blockedBy.push("changes-requested");
  }

  const workflowScore = Math.max(
    0,
    Math.round(
      (completedDisciplines.length / Math.max(required.length, 1)) * 100 -
        blockedBy.length * 10,
    ),
  );

  return {
    publishReady:
      missingDisciplines.length === 0 && blockedBy.length === 0 && workflowScore >= 80,
    completedDisciplines,
    missingDisciplines,
    blockedBy,
    workflowScore,
  };
}
