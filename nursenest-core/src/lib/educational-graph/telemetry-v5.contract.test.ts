import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  graphTelemetryPayload,
  remediationPathStartedPayload,
} from "@/lib/educational-graph/graph-telemetry";
import { toGovernedGraphCaptureProps } from "@/lib/educational-graph/governed-graph-telemetry-props";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(thisDir, "..", "..", "..");

describe("Graph telemetry V5 — governed payloads", () => {
  it("graphTelemetryPayload includes graphDepth and required fields", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const traversal = orchestrateEducationalGraph({
      topicSlug: "sepsis",
      marketingPathway: pathway,
      sourceSurface: "marketing_lesson",
      anchorLessonSlug: "sepsis-1",
    });
    const step = traversal.steps[0];
    assert.ok(step);
    const payload = graphTelemetryPayload("graph_step_clicked", step);
    assert.equal(payload.competencyId, step.competencyId);
    assert.equal(payload.graphDepth, step.graphDepth);
    assert.equal(payload.sourceSurface, "marketing_lesson");
    assert.ok(payload.topicSlug);
  });

  it("remediation_path_started payload is structurally valid", () => {
    const p = remediationPathStartedPayload({
      topicSlug: "sepsis",
      sourceSurface: "topic_hub_public",
      stepCount: 4,
      competencyId: "infection_sepsis",
    });
    assert.equal(p.event, "remediation_path_started");
    assert.equal(p.graphDepth, 0);
  });

  it("governed UI wrappers exist and use capture layer", () => {
    const files = [
      "src/components/educational-graph/governed-graph-interaction.tsx",
      "src/components/educational-graph/graph-telemetry-boundary.tsx",
      "src/components/educational-graph/governed-remediation-cta.tsx",
      "src/components/educational-graph/governed-glossary-traversal.tsx",
      "src/lib/educational-graph/capture-governed-graph-telemetry.ts",
    ];
    for (const rel of files) {
      const text = fs.readFileSync(path.join(appRoot, rel), "utf8");
      assert.match(text, /captureGovernedGraphTelemetry|graphTelemetryPayload/);
      assert.doesNotMatch(text, /posthog\.capture\(/);
    }
  });

  it("toGovernedGraphCaptureProps maps ontology namespace", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const traversal = orchestrateEducationalGraph({
      topicSlug: "heart-failure",
      marketingPathway: pathway,
      sourceSurface: "topic_hub_public",
    });
    const step = traversal.steps[0];
    assert.ok(step);
    const props = toGovernedGraphCaptureProps(
      graphTelemetryPayload("next_best_action_clicked", step, { ontologyNamespace: "nursenest.rn.educational_graph.v1" }),
    );
    assert.equal(props.ontology_namespace, "nursenest.rn.educational_graph.v1");
    assert.ok(props.testing_model);
  });
});
