export type OnboardingExamGoalSlug = "rn" | "rpn" | "np" | "pre_nursing" | "allied";

export type OnboardingExamGoalRow = {
  id: OnboardingExamGoalSlug;
  label: string;
  description: string;
};

/** Account `country` from signup — drives PN copy (US NCLEX-PN vs CA REx-PN) without changing pathway resolution. */
export type OnboardingAccountCountry = "US" | "CA" | "OTHER";

export function normalizeOnboardingCountry(raw: string | null | undefined): OnboardingAccountCountry {
  const c = (raw ?? "").trim().toUpperCase();
  if (c === "US") return "US";
  if (c === "CA") return "CA";
  return "OTHER";
}

/** Labels for step 0 of {@link import("@/components/onboarding/trial-onboarding-flow") TrialOnboardingFlow}. */
export function examGoalRowsForCountry(country: OnboardingAccountCountry): OnboardingExamGoalRow[] {
  const rpn: OnboardingExamGoalRow =
    country === "US"
      ? {
          id: "rpn",
          label: "PN (NCLEX-PN)",
          description: "US practical / vocational nursing — NCLEX-PN pathway.",
        }
      : country === "CA"
        ? {
            id: "rpn",
            label: "RPN (REx-PN)",
            description: "Canadian Practical Nurse — REx-PN pathway.",
          }
        : {
            id: "rpn",
            label: "RPN / LPN",
            description: "Canada: REx-PN · US: NCLEX-PN — we match your account country after setup.",
          };

  return [
    { id: "rn", label: "RN", description: "NCLEX-RN or REx-RN" },
    rpn,
    { id: "np", label: "NP", description: "Nurse Practitioner certification" },
    { id: "pre_nursing", label: "Pre-Nursing", description: "Foundational anatomy, terminology, and entrance prep" },
    { id: "allied", label: "Allied Health", description: "Allied health profession exams" },
  ];
}
