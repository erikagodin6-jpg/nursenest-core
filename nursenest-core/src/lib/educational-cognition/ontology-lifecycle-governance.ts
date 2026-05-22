import type { DurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { RnCompetencyId } from "@/lib/educational-graph/rn-competency-ontology";
import type { ClinicalJudgmentPattern } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import {
  CURRENT_ONTOLOGY_REVISION,
  lookupOntologyMigration,
  ONTOLOGY_MIGRATION_REGISTRY,
  resolveOntologyMigrationPath,
} from "@/lib/educational-cognition/ontology-migration-registry";
import { GRAPH_VERSION } from "@/lib/educational-cognition/cognition-version-governance";

export type OntologyLifecycleResult = {
  envelope: DurableLearnerCognitionEnvelope;
  migrationPath: string;
  operations: string[];
};

function applyAliasesToSnapshot(
  snapshot: RnLearnerStateSnapshot,
  aliases: Record<string, string>,
  focusRenames: Record<string, string>,
  ops: string[],
): RnLearnerStateSnapshot {
  let competencyStates = snapshot.competencyStates.map((c) => {
    const next = aliases[c.competencyId];
    if (!next) return c;
    ops.push(`alias_competency:${c.competencyId}->${next}`);
    return { ...c, competencyId: next as RnCompetencyId };
  });
  const measurementWeaknesses = (snapshot.measurementWeaknesses ?? []).map((slug: string) => {
    const next = focusRenames[slug] ?? aliases[slug];
    if (!next) return slug;
    ops.push(`rename_focus:${slug}->${next}`);
    return next;
  });
  const reasoningPatterns = (snapshot.reasoningPatterns ?? []).map((p) => (aliases[p] ?? p) as ClinicalJudgmentPattern);
  return { ...snapshot, competencyStates, measurementWeaknesses, reasoningPatterns };
}

function reconcileGraphContinuity(
  envelope: DurableLearnerCognitionEnvelope,
  remediationRenames: Record<string, string>,
  deprecatedNodes: string[],
  ops: string[],
): DurableLearnerCognitionEnvelope {
  const c = envelope.graphContinuity;
  if (!c) return envelope;
  const remediationPathwayIds = c.remediationPathwayIds
    .map((href) => remediationRenames[href] ?? href)
    .filter((href) => !deprecatedNodes.some((d) => href.includes(d)));
  if (remediationPathwayIds.length !== c.remediationPathwayIds.length) {
    ops.push("prune_deprecated_graph_nodes");
  }
  return {
    ...envelope,
    graphContinuity: {
      ...c,
      remediationPathwayIds,
      graphVersion: GRAPH_VERSION,
    },
  };
}

/**
 * Applies ontology lifecycle migrations without destructive learner resets.
 */
export function applyOntologyLifecycleToEnvelope(
  envelope: DurableLearnerCognitionEnvelope,
): OntologyLifecycleResult {
  const operations: string[] = [];
  const fromRevision = envelope.ontologyRevision ?? "unknown";
  const migrationSteps = resolveOntologyMigrationPath(fromRevision, CURRENT_ONTOLOGY_REVISION);
  let next: DurableLearnerCognitionEnvelope = { ...envelope, ontologyRevision: CURRENT_ONTOLOGY_REVISION };

  for (const stepId of migrationSteps) {
    if (stepId === "current") break;
    const step = ONTOLOGY_MIGRATION_REGISTRY.find((s) => s.id === stepId) ?? lookupOntologyMigration(fromRevision);
    if (!step) continue;
    next = {
      ...next,
      snapshot: applyAliasesToSnapshot(
        next.snapshot,
        step.semanticAliases,
        step.focusAreaRenames,
        operations,
      ),
    };
    next = reconcileGraphContinuity(next, step.remediationPathwayRenames, step.deprecatedNodeIds, operations);
    operations.push(`ontology_migration:${step.id}`);
  }

  const migrationPath = [envelope.migrationPath, ...migrationSteps].filter(Boolean).join(">");
  return {
    envelope: { ...next, migrationPath: migrationPath || "current" },
    migrationPath,
    operations,
  };
}
