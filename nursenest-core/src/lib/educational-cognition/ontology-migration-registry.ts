/**
 * Ontology revision lineage and backward-compatible graph mappings.
 */
/** Keep in sync with `EDUCATIONAL_ONTOLOGY_NAMESPACE` in unified-educational-substrate (avoid circular imports). */
export const CURRENT_ONTOLOGY_REVISION = "nursenest.rn.educational_graph.v1";

export type OntologyMigrationStep = {
  id: string;
  fromRevision: string;
  toRevision: string;
  semanticAliases: Record<string, string>;
  deprecatedNodeIds: string[];
  focusAreaRenames: Record<string, string>;
  remediationPathwayRenames: Record<string, string>;
};

/** Ordered migrations — apply when envelope ontologyRevision is behind current. */
export const ONTOLOGY_MIGRATION_REGISTRY: OntologyMigrationStep[] = [
  {
    id: "rn_competency_v1_to_unified",
    fromRevision: "rn_competency_graph.v1",
    toRevision: CURRENT_ONTOLOGY_REVISION,
    semanticAliases: {
      safety_clinical_judgment: "clinical_judgment",
      pharm_pain: "pharmacology_safety",
    },
    deprecatedNodeIds: ["legacy_nclex_drill_only"],
    focusAreaRenames: {
      "focus:medsurg": "focus:medical_surgical",
    },
    remediationPathwayRenames: {
      "remediation:legacy_weak": "remediation:clinical_judgment_safety",
    },
  },
];

export function resolveOntologyMigrationPath(
  fromRevision: string | null | undefined,
  toRevision: string = CURRENT_ONTOLOGY_REVISION,
): string[] {
  if (!fromRevision || fromRevision === toRevision) return ["current"];
  const path: string[] = [];
  let cursor = fromRevision;
  for (const step of ONTOLOGY_MIGRATION_REGISTRY) {
    if (step.fromRevision !== cursor) continue;
    path.push(step.id);
    cursor = step.toRevision;
    if (cursor === toRevision) return path;
  }
  return path.length ? [...path, "partial"] : ["unknown_ontology_revision"];
}

export function lookupOntologyMigration(fromRevision: string): OntologyMigrationStep | null {
  return ONTOLOGY_MIGRATION_REGISTRY.find((s) => s.fromRevision === fromRevision) ?? null;
}
