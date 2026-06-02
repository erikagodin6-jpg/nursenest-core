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
      "Each response updates the practice ability estimate used for the next item difficulty.",
      "Difficulty tracks performance so the session spends precision where you need it.",
      "Stopping uses pathway min/max plus NurseNest confidence rules — not a published board CAT function.",
    ];
  }
  if (publicCopy.effectiveMode === "mini_adaptive") {
    return [
      "Shorter adaptive run with the same one-at-a-time delivery pattern as full CAT.",
      "Item budget is capped lower than production-ready tracks; timer still applies.",
      "Use the report to decide when to move up to a full-length simulation.",
    ];
  }
  if (publicCopy.effectiveMode === "simulation") {
    return [
      "Scenario-weighted progression with timed pacing for this pathway.",
      "Topic mix reflects pathway scope; pool depth still gates availability.",
      "Results map cleanly into lessons and bank practice on the same track.",
    ];
  }
  return [
    "Adaptive practice scoring calibrates to your current performance.",
    "Designed to complement lessons and targeted question sets.",
    "Pool and rules may evolve while this mode is in beta.",
  ];
}
