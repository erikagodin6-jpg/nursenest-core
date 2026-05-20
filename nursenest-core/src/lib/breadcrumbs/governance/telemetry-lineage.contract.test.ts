import assert from "node:assert/strict";
import { test } from "node:test";
import {
  enrichNavigationTelemetryLineage,
  inferSemanticRouteKind,
  resetTelemetryLineageDedupeForTests,
  validateTelemetryLineage,
} from "@/lib/breadcrumbs/governance/telemetry-lineage-governance";

test("infers semantic route kinds", () => {
  assert.equal(inferSemanticRouteKind("/nursing-glossary/foo"), "glossary");
  assert.equal(inferSemanticRouteKind("/app/account/focus-areas/sepsis"), "learner_focus");
  assert.equal(inferSemanticRouteKind("/ecg"), "academy");
});

test("lineage includes graph version and ontology revision", () => {
  resetTelemetryLineageDedupeForTests();
  const lineage = enrichNavigationTelemetryLineage(
    {
      event: "breadcrumb_rendered",
      breadcrumbIntent: "education",
      pathname: "/ecg",
      ontologyNamespace: "academy.ecg",
    },
    { testing_model: "cat_adaptive" },
  );
  assert.ok(lineage.graphVersion);
  assert.ok(lineage.ontologyRevision);
  assert.equal(lineage.testing_model, "cat_adaptive");
  assert.deepEqual(validateTelemetryLineage(lineage), []);
});
