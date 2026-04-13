import { CountryCode, ExamFamily } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

/** Exam goal from {@link TrialOnboardingFlow} step 0. */
export type OnboardingExamGoalSlug = "rn" | "rpn" | "np" | "allied";

function pathwayById(id: string): string | null {
  const p = EXAM_PATHWAYS.find((row) => row.id === id);
  if (!p || p.status === "hidden") return null;
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
    return pathwayById(us ? "us-rn-nclex-rn" : "ca-rn-nclex-rn");
  }
  if (g === "rpn") {
    return pathwayById(us ? "us-lpn-nclex-pn" : "ca-rpn-rex-pn");
  }
  if (g === "np") {
    if (us) return pathwayById("us-np-fnp");
    const caNp = pathwayById("ca-np-cnple");
    if (caNp) return caNp;
    return pathwayById("ca-rn-nclex-rn");
  }
  if (g === "allied") {
    return pathwayById(us ? "us-allied-core" : "ca-allied-core");
  }

  const fallback = EXAM_PATHWAYS.find(
    (p) => p.countryCode === country && p.status !== "hidden" && p.examFamily === ExamFamily.NCLEX_RN && p.roleTrack === "rn",
  );
  return fallback?.id ?? EXAM_PATHWAYS.find((p) => p.countryCode === country && p.status !== "hidden")?.id ?? null;
}
