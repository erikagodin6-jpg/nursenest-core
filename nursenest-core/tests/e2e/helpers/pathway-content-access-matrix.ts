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
  tier: "RN" | "RPN" | "LVN_LPN" | "NP";
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
];
