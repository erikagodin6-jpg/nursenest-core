import type { PathwayReadinessConfig, PathwayReadinessPublicCopy } from "@/lib/exam-pathways/pathway-readiness-config";

/**
 * Shared bullets for marketing CAT landing and in-app CAT start — keeps adaptive messaging consistent.
 */
export function catHowItWorksBulletItems(
  publicCopy: PathwayReadinessPublicCopy,
  readinessConfig: Pick<PathwayReadinessConfig, "engineType">,
): string[] {
  if (publicCopy.effectiveMode === "production_ready" && readinessConfig.engineType === "CAT") {
    return [
      "Each answer updates the estimate of your ability (θ).",
      "Item difficulty adapts so the exam targets your level efficiently.",
      "Stopping rules mirror exam-style precision rules when enough evidence is gathered.",
    ];
  }
  if (publicCopy.effectiveMode === "mini_adaptive") {
    return [
      "A shorter adaptive run for progress checks between full-length sessions.",
      "Difficulty still responds to performance, with a smaller item budget.",
      "Use results to spot weak categories before a full CAT attempt.",
    ];
  }
  if (publicCopy.effectiveMode === "simulation") {
    return [
      "Scenario-style progression with timed pacing.",
      "High-yield topics weighted for this pathway.",
      "Results highlight follow-up in lessons and the question bank.",
    ];
  }
  return [
    "Adaptive scoring calibrates to your current performance.",
    "Works alongside lessons and targeted question practice.",
    "Coverage expands as the pathway bank grows.",
  ];
}
