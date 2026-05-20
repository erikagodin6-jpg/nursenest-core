/**
 * V1 mobile onboarding — RN, RPN/PN, NP only.
 * IDs must match `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-*.ts`.
 */
export type MobileV1PathwayRole = "rn" | "rpn_pn" | "np";

export type MobileV1PathwayDefinition = {
  id: string;
  role: MobileV1PathwayRole;
  /** Short label for pickers (not marketing SEO copy). */
  label: string;
};

/** Default when nothing persisted (server PATCH should still validate). */
export const DEFAULT_MOBILE_V1_PATHWAY_ID = "us-rn-nclex-rn" as const;

export const MOBILE_V1_PATHWAYS: readonly MobileV1PathwayDefinition[] = [
  { id: "us-rn-nclex-rn", role: "rn", label: "US — NCLEX-RN" },
  { id: "us-rn-new-grad-transition", role: "rn", label: "US — New grad transition (RN)" },
  { id: "ca-rn-nclex-rn", role: "rn", label: "Canada — NCLEX-RN" },
  { id: "ca-rpn-rex-pn", role: "rpn_pn", label: "Canada — REx-PN (RPN)" },
  { id: "us-lpn-nclex-pn", role: "rpn_pn", label: "US — NCLEX-PN (LPN/LVN)" },
  { id: "us-np-fnp", role: "np", label: "US — NP (FNP)" },
  { id: "us-np-agpcnp", role: "np", label: "US — NP (AGPCNP)" },
  { id: "us-np-pmhnp", role: "np", label: "US — NP (PMHNP)" },
  { id: "us-np-whnp", role: "np", label: "US — NP (WHNP)" },
  { id: "us-np-pnp-pc", role: "np", label: "US — NP (PNP-PC)" },
  { id: "ca-np-cnple", role: "np", label: "Canada — NP (CNPLE track)" },
] as const;

/** Pathway IDs in the same order as {@link MOBILE_V1_PATHWAYS}. */
export const MOBILE_V1_PATHWAY_IDS: readonly string[] = MOBILE_V1_PATHWAYS.map((p) => p.id);

const MOBILE_V1_PATHWAY_ID_SET = new Set(MOBILE_V1_PATHWAY_IDS);

export function isMobileV1PathwayId(id: string | null | undefined): id is string {
  return Boolean(id && MOBILE_V1_PATHWAY_ID_SET.has(id));
}

export function mobileV1PathwayById(id: string): MobileV1PathwayDefinition | undefined {
  return MOBILE_V1_PATHWAYS.find((p) => p.id === id);
}
