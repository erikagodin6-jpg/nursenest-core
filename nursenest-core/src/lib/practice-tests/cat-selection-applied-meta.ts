import type {
  CatPoolSelectionStrictness,
  CatPracticePoolBuildMeta,
  CatSelectionAppliedMeta,
  CatSelectionBasis,
  CatSelectionExpansionTier,
} from "@/lib/practice-tests/types";

function expansionTier(params: {
  usedRelaxedFilters: boolean;
  basisCoerced: boolean;
}): CatSelectionExpansionTier {
  if (params.usedRelaxedFilters) return "broad";
  if (params.basisCoerced) return "soft";
  return "exact";
}

function basisCoercionReason(from: CatSelectionBasis, to: CatSelectionBasis): string | undefined {
  if (from === to) return undefined;
  if (to === "random" && from === "weak") return "weak_areas_empty_coerced_random";
  if (to === "random" && from === "missed") return "missed_items_empty_coerced_random";
  if (to === "random" && from === "starred") return "starred_items_empty_coerced_random";
  return `selection_basis_coerced_${from}_to_${to}`;
}

/**
 * Builds the learner-visible selection summary for adaptive practice creates.
 * `usedRelaxedFilters` means topic/specialty filters were dropped to pathway-wide eligible items (soft pool widen).
 */
export function buildCatSelectionAppliedMeta(input: {
  sim: boolean;
  requestedCatBasis: CatSelectionBasis;
  appliedPoolBasis: CatSelectionBasis;
  poolStrictness: CatPoolSelectionStrictness;
  topicNames: string[];
  buildMeta: CatPracticePoolBuildMeta;
  finalPoolSize: number;
  candidatePoolSize?: number;
}): CatSelectionAppliedMeta {
  const topicNames = [...input.topicNames];
  const base = {
    requestedFilters: {
      topicNames,
      catSelectionBasis: input.requestedCatBasis,
      poolRequestStrictness: input.poolStrictness,
    },
    appliedFilters: {
      topicNames,
      catSelectionBasis: input.appliedPoolBasis,
      poolRequestStrictness: input.poolStrictness,
    },
    matchedCountBeforeExpansion: input.buildMeta.strictCompleteRowCount,
    finalPoolSize: input.finalPoolSize,
    ...(typeof input.candidatePoolSize === "number" ? { candidatePoolSize: input.candidatePoolSize } : {}),
  };

  if (input.sim) {
    const tier: CatSelectionExpansionTier = input.buildMeta.usedRelaxedFilters ? "broad" : "exact";
    const parts: string[] = [];
    if (input.buildMeta.usedRelaxedFilters) parts.push("relaxed_pathway_pool");
    if (input.requestedCatBasis !== input.appliedPoolBasis) {
      parts.push("exam_simulation_basis_random");
    }
    return {
      selectionStrictness: tier,
      ...base,
      ...(parts.length > 0 ? { fallbackReason: parts.join("|") } : {}),
    };
  }

  const basisCoerced = input.requestedCatBasis !== input.appliedPoolBasis;
  const tier = expansionTier({
    usedRelaxedFilters: input.buildMeta.usedRelaxedFilters,
    basisCoerced,
  });
  const parts: string[] = [];
  if (input.buildMeta.usedRelaxedFilters) {
    parts.push("relaxed_pathway_pool");
  }
  const bc = basisCoercionReason(input.requestedCatBasis, input.appliedPoolBasis);
  if (bc) parts.push(bc);

  return {
    selectionStrictness: tier,
    ...base,
    ...(parts.length > 0 ? { fallbackReason: parts.join("|") } : {}),
  };
}
