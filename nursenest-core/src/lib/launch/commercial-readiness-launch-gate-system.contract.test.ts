import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBlueprintCoverageDashboard,
  type BlueprintCoverageContentItem,
} from "@/lib/blueprints/blueprint-coverage-gap-engine";
import {
  buildCommercialReadinessLaunchDashboard,
  validateCommercialLaunchGateDashboard,
} from "./commercial-readiness-launch-gate-system";

const completeNclexRnRows: BlueprintCoverageContentItem[] = [
  {
    id: "rn-ready-q",
    exam: "NCLEX-RN",
    contentType: "questions",
    bodySystem: "Pharmacology",
    topic: "Medication safety",
    published: true,
    publicationReady: true,
    monetizationReady: true,
    adaptiveReady: true,
  },
];

test("commercial launch gate blocks pathways when content alone is insufficient", () => {
  const coverage = buildBlueprintCoverageDashboard(completeNclexRnRows, ["NCLEX-RN", "NCLEX-PN", "REx-PN", "CNPLE", "FNP"]);
  const dashboard = buildCommercialReadinessLaunchDashboard(coverage, {
    monetizationContractsPass: true,
    conversionFunnelTested: true,
  });
  const nclexRn = dashboard.launchReadinessDashboard.find((row) => row.pathway === "NCLEX-RN");

  assert.ok(nclexRn);
  assert.notEqual(nclexRn.launchStatus, "Launch Candidate");
  assert.ok(nclexRn.launchBlockers.some((blocker) => blocker.includes("Content gate")));
  assert.equal(validateCommercialLaunchGateDashboard(dashboard).length, 0);
});

test("commercial launch gate requires 100% monetization and tested conversion", () => {
  const coverage = buildBlueprintCoverageDashboard([], ["NCLEX-RN"]);
  const dashboard = buildCommercialReadinessLaunchDashboard(coverage, {
    monetizationContractsPass: false,
    conversionFunnelTested: false,
  });
  const nclexRn = dashboard.launchReadinessDashboard.find((row) => row.pathway === "NCLEX-RN");

  assert.ok(nclexRn);
  assert.ok(nclexRn.launchBlockers.some((blocker) => blocker.includes("Monetization gate")));
  assert.ok(nclexRn.launchBlockers.some((blocker) => blocker.includes("Conversion gate")));
});

test("commercial launch gate keeps hidden international pathways not ready", () => {
  const coverage = buildBlueprintCoverageDashboard([], ["NCLEX-RN"]);
  const dashboard = buildCommercialReadinessLaunchDashboard(coverage);
  const uk = dashboard.launchReadinessDashboard.find((row) => row.pathway === "NMC CBT");
  const nz = dashboard.launchReadinessDashboard.find((row) => row.pathway === "New Zealand RN");

  assert.ok(uk);
  assert.ok(nz);
  assert.equal(uk.launchStatus, "Not Ready");
  assert.equal(nz.launchStatus, "Not Ready");
  assert.equal(uk.scores.commercialReadiness, 0);
  assert.equal(nz.scores.seoReadiness, 0);
});

test("commercial launch gate produces launch order and remaining work report", () => {
  const coverage = buildBlueprintCoverageDashboard([], ["NCLEX-RN", "NCLEX-PN", "REx-PN", "CNPLE", "FNP"]);
  const dashboard = buildCommercialReadinessLaunchDashboard(coverage);

  assert.ok(dashboard.recommendedLaunchOrder.length > 0);
  assert.ok(dashboard.remainingWorkReport.length > 0);
  assert.ok(dashboard.reliabilityDashboard.every((row) => typeof row.reliabilityReadiness === "number"));
});
