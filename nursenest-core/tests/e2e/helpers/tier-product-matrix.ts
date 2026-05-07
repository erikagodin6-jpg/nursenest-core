/**
 * Canonical `pathwayId` values + learner URLs for tier / entitlement E2E.
 *
 * IDs align with `EXAM_PATHWAYS` / `pathway-learning-structure.ts` — do not invent pathway strings here.
 * Query aliases (`ca-np`, `allied-health`, …) are resolved server-side; tests may use canonical IDs only.
 */
import type { SignupExamFocusValue } from "@/lib/marketing/signup-exam-focus-options";

/** Pathways included in cross-tier gating + marketing coverage (canonical IDs). */
export const TIER_MATRIX_CANONICAL_PATHWAY_IDS: readonly string[] = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "ca-rpn-rex-pn",
  "us-lpn-nclex-pn",
  "us-np-fnp",
  "ca-np-cnple",
  "us-allied-core",
  "us-rn-new-grad-transition",
] as const;

export function learnerLessonsUrl(pathwayId: string): string {
  return `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}`;
}

export function learnerFlashcardsUrl(pathwayId: string): string {
  return `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}`;
}

export function learnerQuestionsUrl(pathwayId: string): string {
  return `/app/questions?pathwayId=${encodeURIComponent(pathwayId)}`;
}

/** Primary practice builder (canonical App Router path). */
export function learnerPracticeTestsUrl(pathwayId: string): string {
  return `/app/practice-tests?pathwayId=${encodeURIComponent(pathwayId)}`;
}

/** Legacy alias; must redirect to `/app/practice-tests` preserving `pathwayId`. */
export function learnerPracticeAliasUrl(pathwayId: string): string {
  return `/app/practice?pathwayId=${encodeURIComponent(pathwayId)}`;
}

export function learnerCatHubUrl(pathwayId: string): string {
  return `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pathwayId)}`;
}

export type TierMatrixSignupRow = {
  key: string;
  label: string;
  /** `data-nn-home-tier-card` on homepage exam selection. */
  homeTierCardId: "rn" | "pn" | "np" | "allied" | "newgrad";
  /** Passed to `seedUsMarketingCookie` / `seedCaMarketingCookie` (`canada` = CA exam marketing). */
  marketingRegionCookie: "us" | "canada";
  signupCountry: "US" | "CA";
  signupTier: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";
  signupExamFocus: SignupExamFocusValue;
  /** `learnerPath` select value (`new_grad` for New Grad card). */
  signupLearnerPath: "new_grad" | "experienced" | "career_change";
  /** After hub navigation, URL should match (pathname). */
  hubPathnameRegex: RegExp;
};

/**
 * Homepage → marketing hub → signup field presets per product tier.
 * Requires `QA_SIGNUP_EMAIL_DOMAIN` + Turnstile bypass or unset widget (see `rn-student-signup-flow.spec.ts`).
 */
export const TIER_MATRIX_SIGNUP_ROWS: readonly TierMatrixSignupRow[] = [
  {
    key: "rn",
    label: "RN (US NCLEX-RN)",
    homeTierCardId: "rn",
    marketingRegionCookie: "us",
    signupCountry: "US",
    signupTier: "RN",
    signupExamFocus: "nclex_rn",
    signupLearnerPath: "experienced",
    hubPathnameRegex: /\/us\/rn\/nclex-rn/i,
  },
  {
    key: "pn",
    label: "PN / RPN (CA REx-PN)",
    homeTierCardId: "pn",
    marketingRegionCookie: "canada",
    signupCountry: "CA",
    signupTier: "RPN",
    signupExamFocus: "rex_pn",
    signupLearnerPath: "experienced",
    hubPathnameRegex: /\/ca\/pn\/rex-pn|\/ca\/rpn/i,
  },
  {
    key: "np",
    label: "NP (US board)",
    homeTierCardId: "np",
    marketingRegionCookie: "us",
    signupCountry: "US",
    signupTier: "NP",
    signupExamFocus: "np_board",
    signupLearnerPath: "experienced",
    hubPathnameRegex: /\/us\/np\//i,
  },
  {
    key: "allied",
    label: "Allied Health",
    homeTierCardId: "allied",
    marketingRegionCookie: "us",
    signupCountry: "US",
    signupTier: "ALLIED",
    signupExamFocus: "allied_cert",
    signupLearnerPath: "experienced",
    hubPathnameRegex: /\/us\/allied|allied-health|allied-core/i,
  },
  {
    key: "newgrad",
    label: "New Grad transition",
    homeTierCardId: "newgrad",
    marketingRegionCookie: "us",
    signupCountry: "US",
    signupTier: "RN",
    signupExamFocus: "nclex_rn",
    signupLearnerPath: "new_grad",
    hubPathnameRegex: /\/us\/new-grad|\/us\/rn\/new-grad-transition/i,
  },
];

/** Parse `E2E_ENTITLED_PATHWAY_IDS` (comma-separated). Defaults to US RN if unset. */
export function parseEntitledPathwayIdsFromEnv(defaultPathwayId: string): string[] {
  const raw = process.env.E2E_ENTITLED_PATHWAY_IDS?.trim();
  if (!raw) return [defaultPathwayId.trim()].filter(Boolean);
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
