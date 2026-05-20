import type { EducationalGraphTraversal } from "@/lib/educational-graph/graph-step-contract";

export type UnifiedEducationalSubstrate = {
  traversal: EducationalGraphTraversal;
  generatedAt: string;
};

export function buildUnifiedEducationalSubstrate(
  traversal: EducationalGraphTraversal,
): UnifiedEducationalSubstrate {
  return {
    traversal,
    generatedAt: new Date(0).toISOString(),
  };
}
