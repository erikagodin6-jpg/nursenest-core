import { REMEDIATION_LADDER_MAX_STEPS, TOPIC_HUB_GRAPH_MAX_LINKS } from "@/lib/educational-graph/graph-governance";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";

export function graphSurfaceStepCap(surface: GraphSourceSurface): number {
  if (surface === "topic_hub_public" || surface === "topic_hub_authenticated") return TOPIC_HUB_GRAPH_MAX_LINKS;
  return REMEDIATION_LADDER_MAX_STEPS;
}
