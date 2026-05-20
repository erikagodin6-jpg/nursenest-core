import type { NextAction } from "@/lib/learner/adaptive-recommendations";
import type { EduGraphStep, EduGraphStepKind } from "@/lib/educational-graph/graph-step-contract";

function nextActionKind(stepKind: EduGraphStepKind): NextAction["kind"] {
  switch (stepKind) {
    case "lesson":
    case "mechanism":
      return "lesson";
    case "flashcards":
      return "review";
    case "prioritization_drill":
    case "mixed_case":
    case "remediation_review":
      return "quiz";
    case "reassessment":
    case "cat_exam":
    case "loft_simulation":
      return "cat";
    case "interpretation":
    case "glossary":
      return "continue";
    default:
      return "continue";
  }
}

/** Canonical NextAction projection from EduGraphStep — single mapper for dashboard/adaptive/tutor. */
export function nextActionFromGraphStep(step: EduGraphStep): NextAction {
  return {
    title: step.title,
    href: step.href,
    reason: step.description,
    kind: nextActionKind(step.stepKind),
  };
}

export function graphStepForTelemetryEvent(
  stepKind: EduGraphStepKind,
): import("@/lib/educational-graph/graph-telemetry").GraphTelemetryEventName {
  if (stepKind === "reassessment" || stepKind === "cat_exam" || stepKind === "loft_simulation") {
    return "reassessment_route_opened";
  }
  if (stepKind === "interpretation") return "interpretation_path_opened";
  if (stepKind === "glossary") return "glossary_node_opened";
  return "graph_step_clicked";
}
