import assert from "node:assert/strict";
import test from "node:test";
import { computeSemanticRouteCoverage } from "@/lib/breadcrumbs/governance/semantic-route-coverage";

test("semantic route coverage report is generated", () => {
  const report = computeSemanticRouteCoverage();
  assert.ok(report.semanticCoverageScore >= 0 && report.semanticCoverageScore <= 100);
  assert.ok(report.academyRegistryCount > 0);
  assert.ok(typeof report.shadowAuthorityCount === "number");
});
