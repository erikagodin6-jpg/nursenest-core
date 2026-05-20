import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

export function orderGraphStepsForLearnerState(steps: readonly EduGraphStep[]): EduGraphStep[] {
  return [...steps].sort((a, b) => a.depth - b.depth);
}
