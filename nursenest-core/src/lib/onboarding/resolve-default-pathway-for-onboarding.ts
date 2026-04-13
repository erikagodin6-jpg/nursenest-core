import { CountryCode, ExamFamily } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

/** Exam goal from {@link TrialOnboardingFlow} step 0. */
export type OnboardingExamGoalSlug = "rn" | "rpn" | "np" | "allied";

/** Pathway ids we may assign to `User.learnerPath` (active / legacy / beta — not waitlist-only). */
function assignablePathwayId(id: string): string | null {
  const p = EXAM_PATHWAYS.find((row) => row.id === id);
  if (!p || p.status === "hidden" || p.status === "upcoming") return null;
  return p.id;
}

/**
 * Maps onboarding exam selection + profile country to a default registry pathway id.
 * Aligns `User.learnerPath` / `User.targetExamPathwayId` with {@link pathwayFromLearnerPath} expectations.
 */
export function resolveDefaultPathwayIdForOnboarding(
  examGoal: string | null | undefined,
  country: CountryCode,
): string | null {
  const g = (examGoal ?? "").toLowerCase() as OnboardingExamGoalSlug | "";
  const us = country === CountryCode.US;

  if (g === "rn") {
    return assignablePathwayId(us ? "us-rn-nclex-rn" : "ca-rn-nclex-rn");
  }
  if (g === "rpn") {
    return assignablePathwayId(us ? "us-lpn-nclex-pn" : "ca-rpn-rex-pn");
  }
  if (g === "np") {
    if (us) return assignablePathwayId("us-np-fnp");
    return assignablePathwayId("ca-np-cnple") ?? assignablePathwayId("ca-rn-nclex-rn");
  }
  if (g === "allied") {
    return assignablePathwayId(us ? "us-allied-core" : "ca-allied-core");
  }

  const fallback = EXAM_PATHWAYS.find(
    (p) => p.countryCode === country && p.status !== "hidden" && p.examFamily === ExamFamily.NCLEX_RN && p.roleTrack === "rn",
  );
  return fallback?.id ?? EXAM_PATHWAYS.find((p) => p.countryCode === country && p.status !== "hidden")?.id ?? null;
}
