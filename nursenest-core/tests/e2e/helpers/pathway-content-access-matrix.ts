/**
 * Pathways exercised by `pathway-content-access.spec.ts`.
 * IDs align with `EXAM_PATHWAYS` in `src/lib/exam-pathways/exam-product-registry.ts` (active nursing products).
 */
export type PathwayContentAccessRow = {
  /** `pathwayId` query value for `/app/*` hubs */
  pathwayId: string;
  /** Human-readable label for logs / diagnostics */
  label: string;
  country: "US" | "CA";
  /** Approximate tier / track for reporting */
  tier: "RN" | "RPN" | "LVN_LPN" | "NP" | "ALLIED" | "NEW_GRAD";
  /**
   * `cat` — adaptive CAT entry from `/app/practice-tests?cat=1` (NCLEX-style pathways).
   * `linear` — scenario / simulation linear exam (`pathwayLinearPracticeExamSurface`) for allied tracks.
   */
  readinessSurface?: "cat" | "linear";
  /**
   * Env prefix(es) for dedicated QA accounts, e.g. `QA_PAID_RN` → `QA_PAID_RN_EMAIL` / `QA_PAID_RN_PASSWORD`.
   * First matching pair wins; then falls back to generic `QA_PAID_EMAIL` / `E2E_PAID_*` (see `pathway-content-credentials.ts`).
   */
  credentialPrefixes: string[];
};

export const PATHWAY_CONTENT_ACCESS_MATRIX: PathwayContentAccessRow[] = [
  {
    pathwayId: "us-rn-nclex-rn",
    label: "US RN — NCLEX-RN",
    country: "US",
    tier: "RN",
    credentialPrefixes: ["QA_PAID_US_RN", "QA_PAID_RN"],
  },
  {
    pathwayId: "ca-rpn-rex-pn",
    label: "Canada RPN — REx-PN",
    country: "CA",
    tier: "RPN",
    credentialPrefixes: ["QA_PAID_CA_RPN", "QA_PAID_RPN"],
  },
  {
    pathwayId: "us-lpn-nclex-pn",
    label: "US LVN/LPN — NCLEX-PN",
    country: "US",
    tier: "LVN_LPN",
    credentialPrefixes: ["QA_PAID_US_PN", "QA_PAID_PN", "QA_PAID_LPN"],
  },
  {
    pathwayId: "us-np-fnp",
    label: "US NP — FNP",
    country: "US",
    tier: "NP",
    credentialPrefixes: ["QA_PAID_NP", "QA_PAID_US_NP"],
  },
  {
    pathwayId: "ca-rn-nclex-rn",
    label: "Canada RN — NCLEX-RN",
    country: "CA",
    tier: "RN",
    credentialPrefixes: ["QA_PAID_CA_RN", "QA_PAID_RN"],
  },
  {
    pathwayId: "ca-np-cnple",
    label: "Canada NP — CNPLE",
    country: "CA",
    tier: "NP",
    credentialPrefixes: ["QA_PAID_CA_NP", "QA_PAID_NP"],
  },
  {
    pathwayId: "us-allied-core",
    label: "US Allied Health — core",
    country: "US",
    tier: "ALLIED",
    readinessSurface: "linear",
    credentialPrefixes: ["QA_PAID_ALLIED_US", "QA_PAID_ALLIED", "QA_PAID_US_ALLIED"],
  },
  {
    pathwayId: "us-rn-new-grad-transition",
    label: "US RN — New Grad transition",
    country: "US",
    tier: "NEW_GRAD",
    credentialPrefixes: ["QA_PAID_NEW_GRAD", "QA_PAID_NEWGRAD", "QA_PAID_RN"],
  },
];
