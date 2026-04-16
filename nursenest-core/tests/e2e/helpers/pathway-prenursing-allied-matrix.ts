/**
 * Pre-nursing + allied pathway coverage for `pathway-prenursing-allied-access.spec.ts`.
 *
 * - **Pre-nursing:** `TierCode.PRE_NURSING` uses the same onboarding exam goal as RN (`examGoalSlugForTier` in
 *   `scripts/qa-paid-test-account-reset.mts`), so default `learnerPath` resolves to `us-rn-nclex-rn`
 *   (`resolveDefaultPathwayIdForOnboarding("rn", US)`).
 * - **Allied:** `EXAM_PATHWAYS` entries `us-allied-core` / `ca-allied-core`; all `ALLIED_PROFESSIONS` share the
 *   US or CA pathway id (`src/lib/allied/allied-professions-registry.ts`).
 */
export type PrenursingAlliedMatrixRow = {
  key: string;
  label: string;
  pathwayId: string;
  /** Why this id is correct — points to registry / onboarding source */
  routingNote: string;
  credentialPrefixes: string[];
};

export const PRENURSING_ALLIED_PATHWAY_MATRIX: PrenursingAlliedMatrixRow[] = [
  {
    key: "pre-nursing",
    label: "Pre-nursing (PRE_NURSING tier — RN NCLEX hub)",
    pathwayId: "us-rn-nclex-rn",
    routingNote:
      "PRE_NURSING tier maps to exam goal `rn` in qa-paid-test-account-reset; default pathway is us-rn-nclex-rn.",
    credentialPrefixes: ["QA_PRENURSING", "QA_PAID_PRE_NURSING", "QA_PAID_RN"],
  },
  {
    key: "allied-us",
    label: "Allied health — United States (us-allied-core)",
    pathwayId: "us-allied-core",
    routingNote: "EXAM_PATHWAYS id us-allied-core; all US allied professions use this pathwayId.",
    credentialPrefixes: ["QA_ALLIED", "QA_PAID_ALLIED", "QA_ALLIED_US"],
  },
  {
    key: "allied-ca",
    label: "Allied health — Canada (ca-allied-core)",
    pathwayId: "ca-allied-core",
    routingNote: "EXAM_PATHWAYS id ca-allied-core.",
    credentialPrefixes: ["QA_ALLIED_CA", "QA_PAID_ALLIED_CA", "QA_ALLIED"],
  },
];
