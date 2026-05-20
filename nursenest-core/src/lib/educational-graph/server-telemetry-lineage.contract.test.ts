import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { graphLineageTelemetryProps, buildGraphLineageEnvelope } from "@/lib/educational-graph/graph-lineage-envelope";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

describe("Server telemetry lineage contract", () => {
  it("lineage envelope includes required authenticated fields", () => {
    const lineage = buildGraphLineageEnvelope({
      pathwayId: "us-rn-nclex-rn",
      sourceSurface: "dashboard_feed",
      testingModel: "CAT",
      educationalIntent: "remediation_review",
      topicSlug: "sepsis",
      stepId: "step-1",
    });
    const props = graphLineageTelemetryProps(lineage);
    assert.equal(props.pathway_id, "us-rn-nclex-rn");
    assert.ok(props.graph_version);
    assert.ok(props.ontology_revision);
    assert.ok(props.continuity_checkpoint_id);
    assert.equal(props.testing_model, "CAT");
  });

  it("governed-server-telemetry wires lineage into server capture", () => {
    const src = fs.readFileSync(
      path.join(root, "src/lib/educational-graph/governed-server-telemetry.ts"),
      "utf8",
    );
    assert.match(src, /emitGovernedServerGraphTelemetry/);
    assert.match(src, /lineageProps/);
  });

  it("learner dashboard RSC emits server graph telemetry", () => {
    const page = fs.readFileSync(
      path.join(root, "src/app/(student)/app/(learner)/page.tsx"),
      "utf8",
    );
    assert.match(page, /emitLearnerDashboardGraphTelemetry/);
  });
});
