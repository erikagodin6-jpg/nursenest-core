/**
 * Pre-nursing + allied coverage for `pathway-prenursing-allied-access.spec.ts`.
 *
 * **Pre-nursing (canonical product surfaces)** — not an `EXAM_PATHWAYS` pathway id:
 * - `EXAM_PATHWAYS` / `exam-product-registry.ts` has **no** `TierCode.PRE_NURSING` catalog row.
 * - Learner-facing URLs are `PRE_NURSING_LESSONS_INDEX_PATH` and related routes in `src/lib/lessons/lesson-routes.ts`.
 * - Module list: `PRE_NURSING_MODULE_REGISTRY` (`src/content/pre-nursing/pre-nursing-registry.ts`).
 * - Adaptive exam: `/pre-nursing/mini-cat` (`PreNursingMiniCatRunner`), **not** NCLEX CAT (`/app/practice-tests?cat=1` + RN pathway).
 *
 * **Allied (EXAM pathway rows)** — `us-allied-core` / `ca-allied-core` in `EXAM_PATHWAYS`; all entries in
 * `ALLIED_PROFESSIONS` share the same `pathwayId` per country (`src/lib/allied/allied-professions-registry.ts`).
 * Readiness engine for both is **SIMULATION** (`pathway-readiness-config.ts`), not NCLEX-style CAT.
 */
export type PrenursingAlliedMatrixRow =
  | {
      coverage: "learnerPreNursingCanonical";
      key: "pre-nursing";
      label: string;
      /** Always null — there is no `pathwayId` for pre-nursing in `EXAM_PATHWAYS`. */
      pathwayId: null;
      /** Subscription should resolve to `PRE_NURSING` tier for this row (enforced in the spec via session). */
      requiredSessionTier: "PRE_NURSING";
      credentialPrefixes: string[];
      routingNote: string;
    }
  | {
      coverage: "learnerAlliedPathway";
      key: "allied-us" | "allied-ca";
      label: string;
      pathwayId: "us-allied-core" | "ca-allied-core";
      displayName: string;
      requiredSessionCountry: "US" | "CA";
      /**
       * Profession is selected via `User.alliedProfessionKey`; entitlement checks use pathway + profession.
       * Per-profession **learner** routing is still `pathwayId` + profile — not a distinct pathway id per profession.
       */
      professionScopingNote: string;
      /** From `pathway-readiness-config.ts` — practice-tests “CAT mode” is not the product claim for allied. */
      readinessEngineType: "SIMULATION";
      credentialPrefixes: string[];
      routingNote: string;
    };

export const PRENURSING_ALLIED_PATHWAY_MATRIX: PrenursingAlliedMatrixRow[] = [
  {
    coverage: "learnerPreNursingCanonical",
    key: "pre-nursing",
    label: 'Pre-nursing — canonical /pre-nursing/* (not mapped to RN `pathwayId`)',
    pathwayId: null,
    requiredSessionTier: "PRE_NURSING",
    credentialPrefixes: ["QA_PRENURSING", "QA_PAID_PRE_NURSING", "QA_PAID"],
    routingNote:
      "No `us-rn-nclex-rn` mapping: `EXAM_PATHWAYS` has no PRE_NURSING row. Product surfaces are `/pre-nursing/lessons`, `/pre-nursing/mini-cat`, etc. (see `lesson-routes.ts`, `pre-nursing-registry.ts`).",
  },
  {
    coverage: "learnerAlliedPathway",
    key: "allied-us",
    label: "Allied health — United States (`us-allied-core`)",
    pathwayId: "us-allied-core",
    displayName: "US Allied Core",
    requiredSessionCountry: "US",
    professionScopingNote:
      "All `ALLIED_PROFESSIONS` use `pathwayId` us-allied-core; profession key is on the user profile.",
    readinessEngineType: "SIMULATION",
    credentialPrefixes: ["QA_ALLIED_US", "QA_ALLIED", "QA_PAID_ALLIED", "QA_PAID"],
    routingNote: "`EXAM_PATHWAYS` id `us-allied-core`; `pathway-readiness-config.ts` → SIMULATION.",
  },
  {
    coverage: "learnerAlliedPathway",
    key: "allied-ca",
    label: "Allied health — Canada (`ca-allied-core`)",
    pathwayId: "ca-allied-core",
    displayName: "CA Allied Core",
    requiredSessionCountry: "CA",
    professionScopingNote:
      "Requires a Canada-profile paid allied account — do not reuse a US-only QA account for this row.",
    readinessEngineType: "SIMULATION",
    credentialPrefixes: ["QA_ALLIED_CA", "QA_PAID_ALLIED_CA", "QA_PAID"],
    routingNote: "`EXAM_PATHWAYS` id `ca-allied-core`; `pathway-readiness-config.ts` → SIMULATION.",
  },
];
