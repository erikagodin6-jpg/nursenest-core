import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/educational-ontology-constants";
import { ONTOLOGY_REVISION } from "@/lib/educational-cognition/cognition-version-governance";
import { logGraphGovernanceViolation } from "@/lib/educational-graph/graph-governance-observability";

export type OntologyRuntimeIntegrityTier = "healthy" | "degraded" | "conflicting" | "replay_divergent";

export function validateOntologyRevision(observed: string | null | undefined): OntologyRuntimeIntegrityTier {
  const expected = ONTOLOGY_REVISION;
  if (!observed?.trim()) return "degraded";
  if (observed === expected || observed === EDUCATIONAL_ONTOLOGY_NAMESPACE) return "healthy";
  logGraphGovernanceViolation({
    code: "graph_namespace.conflict",
    surface: "ontology_runtime",
    pathwayId: null,
    detail: `Expected ${expected}, got ${observed}`,
  });
  return "conflicting";
}

export function reconcileOntologyRevisionForReplay(stored: string | null): string {
  if (!stored || stored === ONTOLOGY_REVISION || stored === EDUCATIONAL_ONTOLOGY_NAMESPACE) {
    return ONTOLOGY_REVISION;
  }
  return ONTOLOGY_REVISION;
}
