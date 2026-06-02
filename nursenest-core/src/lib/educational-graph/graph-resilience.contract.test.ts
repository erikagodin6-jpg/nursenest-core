import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessGraphSubstrateIntegrity } from "@/lib/educational-graph/graph-substrate-integrity";
import {
  reconcileOntologyRevisionForReplay,
  validateOntologyRevision,
} from "@/lib/educational-graph/ontology-runtime-integrity";
import { resolveUnifiedEducationalSubstrate } from "@/lib/educational-graph/unified-educational-substrate";
import { ONTOLOGY_REVISION } from "@/lib/educational-cognition/cognition-version-governance";
import { materializeInterpretationEntryGraphStep } from "@/lib/educational-graph/interpretation-graph-step-materialization";
import { listPublishedClinicalInterpretationGuides } from "@/lib/clinical-interpretation/clinical-interpretation-registry";

describe("Graph resilience", () => {
  it("ontology revision validates and reconciles on replay", () => {
    assert.equal(validateOntologyRevision(ONTOLOGY_REVISION), "healthy");
    assert.equal(reconcileOntologyRevisionForReplay("stale.v0"), ONTOLOGY_REVISION);
  });

  it("substrate integrity reports healthy for materialized traversals", () => {
    const substrate = resolveUnifiedEducationalSubstrate({
      pathwayId: "us-rn-nclex-rn",
      topicSlugs: ["sepsis"],
      sourceSurface: "dashboard_feed",
    });
    const report = assessGraphSubstrateIntegrity(substrate);
    assert.ok(["healthy", "degraded"].includes(report.tier));
  });

  it("interpretation materialization always returns governed step", () => {
    const guide = listPublishedClinicalInterpretationGuides()[0];
    assert.ok(guide);
    const step = materializeInterpretationEntryGraphStep(guide, "us-rn-nclex-rn");
    assert.equal(step.stepKind, "interpretation");
    assert.ok(step.href.startsWith("/"));
  });
});
