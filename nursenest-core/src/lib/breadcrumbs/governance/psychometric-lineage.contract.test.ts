import assert from "node:assert/strict";
import { test } from "node:test";
import {
  resolvePsychometricLineageStamp,
  validatePsychometricLineage,
  validateHydrationLineageParity,
  psychometricTelemetryDedupeKey,
  registerPsychometricTelemetryDedupe,
  resetPsychometricTelemetryDedupeForTests,
} from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";
import { buildSemanticTelemetryLineage } from "@/lib/breadcrumbs/governance/semantic-telemetry-lineage";

test("psychometric stamp includes graph and ontology revision", () => {
  const stamp = resolvePsychometricLineageStamp({
    pathwayId: "us-rn-nclex-rn",
    educationalIntent: "competency",
  });
  assert.ok(stamp.graphVersion);
  assert.ok(stamp.ontologyRevision);
  assert.ok(stamp.testing_model);
  assert.ok(stamp.cognitionReliabilityTier);
});

test("hydration parity detects graph version drift", () => {
  const ssr = resolvePsychometricLineageStamp({ pathwayId: "us-rn-nclex-rn" });
  const hydrated = { ...ssr, graphVersion: "stale-version" };
  const issues = validateHydrationLineageParity({
    ssrStamp: ssr,
    hydratedStamp: hydrated,
    pathname: "/app/coach",
  });
  assert.ok(issues.some((i) => i.code === "hydration_lineage_gap"));
});

test("semantic telemetry lineage propagates psychometric fields", () => {
  const lineage = buildSemanticTelemetryLineage({
    pathname: "/nursing-glossary/sepsis",
    breadcrumbIntent: "education",
    breadcrumbSurface: "glossary",
    breadcrumbDepth: 3,
    canonicalRoot: "glossary",
    schemaOwner: "page",
    pathwayId: "us-rn-nclex-rn",
  });
  assert.ok(lineage.testing_model);
  assert.ok(lineage.graphVersion);
  assert.ok(lineage.ontologyRevision);
  assert.equal(lineage.educationalIntent, "education");
});

test("dedupe registry prevents duplicate psychometric keys", () => {
  resetPsychometricTelemetryDedupeForTests();
  const stamp = resolvePsychometricLineageStamp({ pathwayId: null });
  const key = psychometricTelemetryDedupeKey(stamp, "/ecg", "render");
  assert.equal(registerPsychometricTelemetryDedupe(key), true);
  assert.equal(registerPsychometricTelemetryDedupe(key), false);
});

test("validatePsychometricLineage flags missing graph version", () => {
  const issues = validatePsychometricLineage({
    testing_model: "cat",
    cognitionReliabilityTier: "high",
    graphVersion: "",
    ontologyRevision: "rev",
    educationalIntent: "competency",
    pathwayId: null,
  });
  assert.ok(issues.some((i) => i.code === "missing_graph_version"));
});
