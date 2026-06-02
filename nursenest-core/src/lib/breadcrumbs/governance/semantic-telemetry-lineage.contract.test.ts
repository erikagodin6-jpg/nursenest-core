import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSemanticTelemetryLineage,
  validateTelemetryLineage,
} from "@/lib/breadcrumbs/governance/semantic-telemetry-lineage";

test("learner lineage rejects SEO intent leakage", () => {
  const lineage = buildSemanticTelemetryLineage({
    pathname: "/app/dashboard",
    breadcrumbIntent: "seo",
    breadcrumbSurface: "dashboard",
    breadcrumbDepth: 2,
    canonicalRoot: "lessons",
    schemaOwner: "forbidden",
    ontologyNamespace: "learner.dashboard",
  });
  const issues = validateTelemetryLineage(lineage);
  assert.ok(issues.some((i) => i.code === "learner_seo_leakage"));
});

test("governed marketing lineage includes graph version", () => {
  const lineage = buildSemanticTelemetryLineage({
    pathname: "/ecg",
    breadcrumbIntent: "education",
    breadcrumbSurface: "academy",
    breadcrumbDepth: 2,
    canonicalRoot: "academy.ecg",
    schemaOwner: "page",
    ontologyNamespace: "academy.ecg",
  });
  assert.equal(lineage.semanticRouteKind, "academy");
  assert.ok(lineage.graphVersion.length > 0);
  assert.equal(validateTelemetryLineage(lineage).length, 0);
});
