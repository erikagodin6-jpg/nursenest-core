import { CountryCode, ExamFamily } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

/** Exam goal from {@link TrialOnboardingFlow} step 0. */
export type OnboardingExamGoalSlug = "rn" | "rpn" | "np" | "allied";
export type SignupTierSlug = "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";
export type SignupExamFocusSlug =
  | "nclex_rn"
  | "nclex_pn"
  | "rex_pn"
  | "np_board"
  | "np_fnp"
  | "np_agpcnp"
  | "np_pmhnp"
  | "np_whnp"
  | "np_pnp_pc"
  | "allied_cert";

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

  const assignable = (p: (typeof EXAM_PATHWAYS)[number]) =>
    p.status !== "hidden" && p.status !== "upcoming";

  const fallback = EXAM_PATHWAYS.find(
    (p) => p.countryCode === country && assignable(p) && p.examFamily === ExamFamily.NCLEX_RN && p.roleTrack === "rn",
  );
  return (
    fallback?.id ??
    EXAM_PATHWAYS.find((p) => p.countryCode === country && assignable(p))?.id ??
    null
  );
}

function resolveDefaultPathwayIdForUsNpSignupFocus(examFocus: string | null | undefined): string | null {
  switch ((examFocus ?? "").toLowerCase() as SignupExamFocusSlug | "") {
    case "np_agpcnp":
      return assignablePathwayId("us-np-agpcnp") ?? assignablePathwayId("us-np-fnp");
    case "np_pmhnp":
      return assignablePathwayId("us-np-pmhnp") ?? assignablePathwayId("us-np-fnp");
    case "np_whnp":
      return assignablePathwayId("us-np-whnp") ?? assignablePathwayId("us-np-fnp");
    case "np_pnp_pc":
      return assignablePathwayId("us-np-pnp-pc") ?? assignablePathwayId("us-np-fnp");
    case "np_fnp":
      return assignablePathwayId("us-np-fnp");
    default:
      return null;
  }
}

function resolveOnboardingGoalForSignup(
  examFocus: string | null | undefined,
  tier: SignupTierSlug,
): OnboardingExamGoalSlug {
  switch ((examFocus ?? "").toLowerCase() as SignupExamFocusSlug | "") {
    case "nclex_rn":
      return "rn";
    case "nclex_pn":
    case "rex_pn":
      return "rpn";
    case "np_board":
    case "np_fnp":
    case "np_agpcnp":
    case "np_pmhnp":
    case "np_whnp":
    case "np_pnp_pc":
      return "np";
    case "allied_cert":
      return "allied";
    default:
      if (tier === "RN") return "rn";
      if (tier === "RPN" || tier === "LVN_LPN") return "rpn";
      if (tier === "NP") return "np";
      return "allied";
  }
}

export function resolveDefaultPathwayIdForSignup(args: {
  examFocus: string | null | undefined;
  tier: SignupTierSlug;
  country: CountryCode;
}): string | null {
  if (args.tier === "NP" && args.country === CountryCode.US) {
    return (
      resolveDefaultPathwayIdForUsNpSignupFocus(args.examFocus) ??
      resolveDefaultPathwayIdForOnboarding(resolveOnboardingGoalForSignup(args.examFocus, args.tier), args.country)
    );
  }

  return resolveDefaultPathwayIdForOnboarding(resolveOnboardingGoalForSignup(args.examFocus, args.tier), args.country);
}

export function resolveSignupPathwayAssignment(args: {
  examFocus: string | null | undefined;
  tier: SignupTierSlug;
  country: CountryCode;
  studyGoal: string | null | undefined;
  dailyStudyMinutes: number | null | undefined;
}): {
  learnerPath: string | null;
  targetExamPathwayId: string | null;
  onboardingCompletedAt: Date | null;
  examGoalSetAt: Date | null;
} {
  const pathwayId = resolveDefaultPathwayIdForSignup({
    examFocus: args.examFocus,
    tier: args.tier,
    country: args.country,
  });
  const hasOnboardingFields =
    typeof args.examFocus === "string" &&
    args.examFocus.trim().length > 0 &&
    typeof args.studyGoal === "string" &&
    args.studyGoal.trim().length > 0 &&
    typeof args.dailyStudyMinutes === "number" &&
    Number.isFinite(args.dailyStudyMinutes);
  const completedAt = hasOnboardingFields ? new Date() : null;

  return {
    learnerPath: pathwayId,
    targetExamPathwayId: pathwayId,
    onboardingCompletedAt: completedAt,
    examGoalSetAt: completedAt,
  };
}
