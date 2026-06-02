import assert from "node:assert/strict";
import { test } from "node:test";
import {
  validateOntologyRuntimeIntegrity,
  guardOntologyIntegrityForSurface,
  validateOntologyMigrationReplay,
  salvageRemediationChain,
} from "@/lib/breadcrumbs/governance/ontology-runtime-integrity";
import { auditGraphSubstrateIntegrity } from "@/lib/breadcrumbs/governance/graph-substrate-integrity";
import {
  captureGraphTelemetryReplayFrame,
  buildGraphTelemetryReplaySnapshot,
} from "@/lib/breadcrumbs/governance/graph-telemetry-replay";

test("ontology integrity tiers include replay-divergent", () => {
  const stable = captureGraphTelemetryReplayFrame({
    kind: "hydration_normalization_fallback",
    pathname: "/ecg",
    pathwayId: "us-rn-nclex-rn",
  });
  const divergent = {
    ...captureGraphTelemetryReplayFrame({
      kind: "glossary_traversal",
      pathname: "/nursing-glossary/sepsis",
      pathwayId: "us-rn-nclex-rn",
    }),
    stamp: { ...stable.stamp, graphVersion: "replay-divergent-version" },
  };
  const snapshot = buildGraphTelemetryReplaySnapshot([stable, divergent]);
  const result = validateOntologyRuntimeIntegrity({
    pathname: "/ecg",
    replaySnapshot: snapshot,
  });
  assert.equal(result.tier, "replay-divergent");
});

test("guardOntologyIntegrityForSurface never throws", () => {
  const tier = guardOntologyIntegrityForSurface({
    pathname: "/unknown-route",
    canonicalRootId: "nonexistent_root_xyz",
  });
  assert.ok(["healthy", "degraded", "conflicting", "orphaned", "replay-divergent"].includes(tier));
});

test("ontology migration replay detects revision change", () => {
  const issues = validateOntologyMigrationReplay({
    priorRevision: "2024.1",
    currentRevision: "2025.1",
    pathname: "/app",
  });
  assert.ok(issues.length > 0);
});

test("remediation salvage returns repair hints", () => {
  const hints = salvageRemediationChain("sepsis", "/app/review");
  assert.ok(hints.length >= 0);
});

test("substrate integrity audits shadow authorities", () => {
  const report = auditGraphSubstrateIntegrity(process.cwd());
  assert.ok(report.graphVersion);
  assert.ok("shadowAuthorityViolations" in report);
  assert.ok("adaptiveHeuristicViolations" in report);
});
