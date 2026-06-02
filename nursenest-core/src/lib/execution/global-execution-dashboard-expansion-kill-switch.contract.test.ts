import assert from "node:assert/strict";
import test from "node:test";

import {
  buildGlobalExecutionDashboard,
  validateGlobalExecutionDashboard,
  type ExecutionPathwaySignals,
} from "./global-execution-dashboard-expansion-kill-switch";

const readySignals: ExecutionPathwaySignals = {
  contentQuality: 96,
  questionEnrichment: 96,
  flashcards: 96,
  cat: 96,
  practiceExams: 96,
  reliability: 99.9,
  countrySupplements: 96,
  seo: 96,
  conversion: 96,
  revenue: 96,
  monetizationTested: true,
  conversionFunnelTested: true,
  supportSystemsReady: true,
};

const weakSignals: ExecutionPathwaySignals = {
  contentQuality: 20,
  questionEnrichment: 0,
  flashcards: 0,
  cat: 40,
  practiceExams: 20,
  reliability: 80,
  countrySupplements: 0,
  seo: 50,
  conversion: 0,
  revenue: 0,
  monetizationTested: false,
  conversionFunnelTested: false,
  supportSystemsReady: false,
};

test("global execution dashboard pauses expansion when core readiness is below 90%", () => {
  const dashboard = buildGlobalExecutionDashboard({
    rn: weakSignals,
    pn: weakSignals,
    np: weakSignals,
    usExpansion: weakSignals,
    uk: weakSignals,
    australia: weakSignals,
    newZealand: weakSignals,
  });

  assert.equal(dashboard.killSwitchStatus, "PAUSE_NEW_COUNTRY_EXPANSION");
  assert.ok(dashboard.killSwitchReasons.some((reason) => reason.includes("RN Quality Readiness")));
  assert.equal(dashboard.resourceAllocation.recommendedCoreEcosystemPercent, 90);
  assert.equal(dashboard.currentPriorityRanking.find((tier) => tier.tier === 4)?.status, "paused");
});

test("global execution dashboard allows controlled expansion only when core gates clear", () => {
  const dashboard = buildGlobalExecutionDashboard({
    rn: readySignals,
    pn: readySignals,
    np: readySignals,
    usExpansion: readySignals,
    uk: readySignals,
    australia: readySignals,
    newZealand: readySignals,
    ireland: readySignals,
  });

  assert.equal(dashboard.killSwitchStatus, "ALLOW_CONTROLLED_EXPANSION");
  assert.equal(dashboard.killSwitchReasons.length, 0);
  assert.ok(dashboard.countryLaunchGates.every((gate) => gate.pass));
});

test("global execution dashboard validates launch approval rules", () => {
  const dashboard = buildGlobalExecutionDashboard({
    rn: weakSignals,
    pn: readySignals,
    np: readySignals,
    usExpansion: weakSignals,
    uk: weakSignals,
    australia: weakSignals,
    newZealand: weakSignals,
  });

  assert.ok(dashboard.launchApprovalFindings.some((finding) => finding.includes("question quality")));
  assert.equal(validateGlobalExecutionDashboard(dashboard).length, 0);
});
