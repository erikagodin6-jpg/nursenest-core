import type { TestingModel } from "@/lib/testing/testing-model-types";

export const CNPLE_PATHWAY_ID = "ca-np-cnple" as const;

export const PATHWAY_TESTING_MODEL: Readonly<Record<string, TestingModel>> = {
  "us-rn-nclex-rn": "CAT",
  "ca-rn-nclex-rn": "CAT",
  "us-lpn-nclex-pn": "CAT",
  "ca-rpn-rex-pn": "CAT",
  "ca-np-cnple": "LOFT",
  "us-np-fnp": "CAT",
  "us-np-agpcnp": "CAT",
  "us-np-pmhnp": "CAT",
  "us-np-whnp": "CAT",
  "us-np-pnp-pc": "CAT",
  "us-np-acnp": "CAT",
  "us-np-nnp": "CAT",
} as const;

export function isCnplePathway(pathwayId: string | null | undefined): boolean {
  return (pathwayId ?? "").trim() === CNPLE_PATHWAY_ID;
}

export function getTestingModelForPathwayId(pathwayId: string | null | undefined): TestingModel {
  const id = (pathwayId ?? "").trim();
  if (!id) return "LINEAR";
  return PATHWAY_TESTING_MODEL[id] ?? "LINEAR";
}

export function isLoftTestingModel(model: TestingModel): boolean {
  return model === "LOFT";
}

export function isCatTestingModel(model: TestingModel): boolean {
  return model === "CAT";
}

export function pathwayUsesLoftEngine(pathwayId: string | null | undefined): boolean {
  return isLoftTestingModel(getTestingModelForPathwayId(pathwayId));
}

export function pathwayUsesCatEngine(pathwayId: string | null | undefined): boolean {
  return isCatTestingModel(getTestingModelForPathwayId(pathwayId));
}
