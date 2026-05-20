/**
 * Run: node --import tsx --test src/lib/educational-cognition/ontology-lifecycle.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyOntologyLifecycleToEnvelope } from "@/lib/educational-cognition/ontology-lifecycle-governance";
import { resolveOntologyMigrationPath } from "@/lib/educational-cognition/ontology-migration-registry";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

describe("ontology lifecycle governance", () => {
  it("resolves migration path for legacy revision", () => {
    const path = resolveOntologyMigrationPath("rn_competency_graph.v1");
    assert.ok(path.includes("rn_competency_v1_to_unified"));
  });

  it("migrates envelope competency aliases without reset", () => {
    const env = buildFreshCognitionEnvelope(
      {
        ...EMPTY_LEARNER_STATE("us-rn-nclex-rn"),
        competencyStates: [
          {
            competencyId: "safety_clinical_judgment",
            masteryScore: 40,
            persistentWeak: true,
            volatility: "stable",
            sessionEvidenceCount: 2,
            remediationResponsive: null,
            lastUpdatedAt: new Date().toISOString(),
          },
        ],
      },
      "persisted",
    );
    env.ontologyRevision = "rn_competency_graph.v1";
    const result = applyOntologyLifecycleToEnvelope(env);
    assert.ok(result.operations.length >= 1);
    assert.equal(
      result.envelope.snapshot.competencyStates[0]?.competencyId,
      "clinical_judgment",
    );
  });
});
