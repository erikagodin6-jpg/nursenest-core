/**
 * Pathways that use the premium fixed-viewport NCLEX exam shells
 * (`NclexCatRunner`, `NclexPracticeRunner`) instead of the legacy runner board.
 *
 * Derived from `PATHWAY_TESTING_MODEL` — CAT and LOFT licensing tracks only.
 */
import { CNPLE_PATHWAY_ID } from "@/lib/exam-pathways/cnple-pathway";
import {
  getTestingModelForPathwayId,
  isLoftTestingModel,
} from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";

export const PREMIUM_EXAM_SHELL_RN_PATHWAY_IDS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
] as const;

export const PREMIUM_EXAM_SHELL_RPN_PATHWAY_IDS = [
  "ca-rpn-rex-pn",
  "us-lpn-nclex-pn",
] as const;

/** US NP board tracks (CAT). Canadian NP uses LOFT via {@link PREMIUM_EXAM_SHELL_LOFT_PATHWAY_IDS}. */
/** Active US NP catalog pathways with CAT testing model (see `exam-pathways-data-segment-c`). */
export const PREMIUM_EXAM_SHELL_NP_CAT_PATHWAY_IDS = [
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
] as const;

export const PREMIUM_EXAM_SHELL_LOFT_PATHWAY_IDS = [CNPLE_PATHWAY_ID] as const;

const PREMIUM_SHELL_MODELS: ReadonlySet<TestingModel> = new Set(["CAT", "LOFT"]);

export function pathwayUsesPremiumNclexExamShell(pathwayId: string | null | undefined): boolean {
  const model = getTestingModelForPathwayId(pathwayId);
  return PREMIUM_SHELL_MODELS.has(model);
}

/** LOFT presentation (linear licensing simulation chrome) — same layout grid as CAT/practice shells. */
export function pathwayUsesLoftNclexExamPresentation(pathwayId: string | null | undefined): boolean {
  return isLoftTestingModel(getTestingModelForPathwayId(pathwayId));
}

export function premiumExamShellSliceForPathway(
  pathwayId: string | null | undefined,
): "rn" | "rpn" | "np" | "loft" | null {
  const id = (pathwayId ?? "").trim();
  if (!id || !pathwayUsesPremiumNclexExamShell(id)) return null;
  if ((PREMIUM_EXAM_SHELL_LOFT_PATHWAY_IDS as readonly string[]).includes(id)) return "loft";
  if ((PREMIUM_EXAM_SHELL_RN_PATHWAY_IDS as readonly string[]).includes(id)) return "rn";
  if ((PREMIUM_EXAM_SHELL_RPN_PATHWAY_IDS as readonly string[]).includes(id)) return "rpn";
  if ((PREMIUM_EXAM_SHELL_NP_CAT_PATHWAY_IDS as readonly string[]).includes(id)) return "np";
  if (getTestingModelForPathwayId(id) === "CAT") return "np";
  return null;
}
