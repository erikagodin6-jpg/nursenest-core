/**
 * Governed RN educational ontology slice — competency graph + measurement + reasoning semantics.
 */
import { RN_COMPETENCY_NODES } from "@/lib/educational-graph/rn-competency-ontology";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { EducationalOntologySlice } from "@/lib/educational-cognition/educational-cognition-types";

export function buildEducationalOntologySlice(
  learnerState: RnLearnerStateSnapshot,
): EducationalOntologySlice {
  const competencyIds =
    learnerState.competencyStates.length > 0
      ? learnerState.competencyStates.map((c) => c.competencyId)
      : RN_COMPETENCY_NODES.slice(0, 6).map((n) => n.id);

  const remediationPathwayIds = learnerState.competencyStates
    .filter((c) => c.persistentWeak || c.masteryScore < 55)
    .map((c) => `remediation:${c.competencyId}`)
    .slice(0, 12);

  return {
    competencyIds: [...new Set(competencyIds)],
    measurementWeaknessTags: learnerState.measurementWeaknesses.slice(0, 12),
    reasoningPatternCodes: learnerState.reasoningPatterns.slice(0, 10),
    telemetryNamespaces: ["cognition", "study_loop", "measurement", "remediation"],
    remediationPathwayIds,
  };
}
