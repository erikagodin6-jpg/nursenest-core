import {
  calculateCatItemQualityWeight,
  type CatItemQualityWeightInput,
  type CatItemQualityWeightResult,
} from "./cat-item-quality-weight";
import {
  balanceCatItemExposure,
  type CatExposureBalancingInput,
  type CatExposureBalancingResult,
} from "./cat-item-exposure-balancing";
import {
  balanceCatBlueprintDiversity,
  type CatBlueprintBalancingInput,
  type CatBlueprintBalancingResult,
} from "./cat-blueprint-balancing";

export type CatCandidateSelectionInput = CatItemQualityWeightInput & {
  exposure?: Omit<CatExposureBalancingInput, "qualityWeight" | "qualityBand">;
  blueprint?: Omit<CatBlueprintBalancingInput, "baseWeight">;
};

export type CatCandidateSelectionResult = {
  selectionScore: number;
  eligible: boolean;
  quality: CatItemQualityWeightResult;
  exposure: CatExposureBalancingResult;
  blueprint: CatBlueprintBalancingResult;
  suppressionReasons: string[];
  recommendations: string[];
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(1.35, Number(value.toFixed(2))));
}

export function calculateCatCandidateSelectionScore(
  input: CatCandidateSelectionInput,
): CatCandidateSelectionResult {
  const quality = calculateCatItemQualityWeight(input);

  const exposure = balanceCatItemExposure({
    ...(input.exposure ?? {}),
    qualityWeight: quality.qualityWeight,
    qualityBand: quality.qualityBand,
  });

  const blueprint = balanceCatBlueprintDiversity({
    ...(input.blueprint ?? {}),
    questionId: input.id ?? input.blueprint?.questionId,
    topic: input.topic ?? input.blueprint?.topic,
    bodySystem: input.bodySystem ?? input.blueprint?.bodySystem,
    cognitiveLevel: input.cognitiveLevel ?? input.blueprint?.cognitiveLevel,
    difficulty: input.difficulty ?? input.blueprint?.difficulty,
    baseWeight: exposure.adjustedWeight,
  });

  const suppressionReasons: string[] = [];
  if (quality.qualityBand === "exclude") suppressionReasons.push("quality-excluded");
  if (exposure.exposureBand === "retire") suppressionReasons.push("exposure-retired");
  if (!blueprint.recommended) suppressionReasons.push("blueprint-not-recommended");

  const eligible = suppressionReasons.length === 0 && blueprint.adjustedWeight > 0;
  const selectionScore = eligible ? clampScore(blueprint.adjustedWeight) : 0;

  return {
    selectionScore,
    eligible,
    quality,
    exposure,
    blueprint,
    suppressionReasons,
    recommendations: [
      ...quality.recommendations,
      ...exposure.recommendations,
      ...blueprint.reasons,
    ],
  };
}

export function rankCatCandidates<T extends CatCandidateSelectionInput>(
  candidates: T[],
): Array<T & { selection: CatCandidateSelectionResult }> {
  return candidates
    .map((candidate) => ({
      ...candidate,
      selection: calculateCatCandidateSelectionScore(candidate),
    }))
    .sort((a, b) => b.selection.selectionScore - a.selection.selectionScore);
}
