import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBlueprintCoverageDashboard,
  type BlueprintCoverageContentItem,
} from "./blueprint-coverage-gap-engine";
import { buildGlobalBlueprintPrioritizationDashboard } from "./global-blueprint-gap-prioritization-engine";

const sampleItems: BlueprintCoverageContentItem[] = [
  {
    id: "rn-delegation-q1",
    exam: "NCLEX-RN",
    contentType: "questions",
    bodySystem: "Leadership",
    topic: "Delegation and prioritization",
    published: false,
    publicationReady: false,
    monetizationReady: false,
    adaptiveReady: true,
  },
  {
    id: "rn-pharm-q1",
    exam: "NCLEX-RN",
    contentType: "questions",
    bodySystem: "Pharmacology",
    topic: "Medication safety",
    published: false,
    publicationReady: false,
    monetizationReady: false,
    adaptiveReady: true,
  },
  {
    id: "np-dx-q1",
    exam: "CNPLE",
    contentType: "questions",
    bodySystem: "Assessment",
    topic: "Differential diagnosis",
    published: false,
    publicationReady: false,
    monetizationReady: false,
    adaptiveReady: true,
  },
];

test("global blueprint prioritization scores domains beyond raw missing counts", () => {
  const coverage = buildBlueprintCoverageDashboard(sampleItems, ["NCLEX-RN", "CNPLE"]);
  const dashboard = buildGlobalBlueprintPrioritizationDashboard(coverage);

  assert.ok(dashboard.gapDashboard.length > 0);
  assert.ok(dashboard.gapDashboard.every((row) => row.priorityScore >= 0 && row.priorityScore <= 100));
  assert.ok(dashboard.gapDashboard.some((row) => row.domainLabel.match(/Pharmacology|Leadership|Assessment|Diagnosis/i)));
});

test("global blueprint prioritization enforces reuse-first build decisions", () => {
  const coverage = buildBlueprintCoverageDashboard(sampleItems, ["NCLEX-RN", "CNPLE"]);
  const dashboard = buildGlobalBlueprintPrioritizationDashboard(coverage);

  assert.ok(dashboard.contentRoiDashboard.length > 0);
  assert.ok(dashboard.reuseDashboard.overlayFirstBacklogItems > 0);
  assert.ok(dashboard.reuseDashboard.newContentGateItems > 0);
  assert.ok(dashboard.contentRoiDashboard.every((item) => item.reuseEvaluation.includes("Check")));
});

test("global blueprint prioritization includes hidden international overlay priorities", () => {
  const coverage = buildBlueprintCoverageDashboard(sampleItems, ["NCLEX-RN"]);
  const dashboard = buildGlobalBlueprintPrioritizationDashboard(coverage);

  assert.ok(dashboard.gapDashboard.some((row) => row.exam === "NMC CBT" && row.domainLabel.includes("NEWS2")));
  assert.ok(dashboard.gapDashboard.some((row) => row.exam === "NMBA RN" && row.domainLabel.includes("Aboriginal")));
  assert.ok(dashboard.gapDashboard.some((row) => row.exam === "NCNZ RN" && row.domainLabel.includes("Te Tiriti")));
  assert.equal(dashboard.internationalReadinessDashboard.requiredNextAction, "recover_classify_reuse_then_generate");
});

test("global blueprint prioritization reports monetization readiness by pathway family", () => {
  const coverage = buildBlueprintCoverageDashboard(sampleItems, ["NCLEX-RN", "REx-PN", "CNPLE"]);
  const dashboard = buildGlobalBlueprintPrioritizationDashboard(coverage);

  assert.equal(typeof dashboard.monetizationDashboard.rnReadiness, "number");
  assert.equal(typeof dashboard.monetizationDashboard.pnReadiness, "number");
  assert.equal(typeof dashboard.monetizationDashboard.npReadiness, "number");
  assert.equal(dashboard.monetizationDashboard.ukReadiness, 0);
});
