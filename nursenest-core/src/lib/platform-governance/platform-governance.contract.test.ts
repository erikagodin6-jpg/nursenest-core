import assert from "node:assert/strict";
import test from "node:test";

import { validateAnalyticsContract } from "./analytics-contract";
import { validateContentGovernanceContract } from "./content-governance-contract";
import { validateMonetizationContract } from "./monetization-contract";
import { PLATFORM_FEATURES } from "./feature-registry";
import { buildLaunchReadinessDashboard } from "./launch-readiness";
import { validateSubscriptionContract } from "./subscription-contract";

test("platform feature registry covers all required product surfaces", () => {
  const ids = new Set(PLATFORM_FEATURES.map((feature) => feature.id));
  for (const required of [
    "lessons",
    "flashcards",
    "cat",
    "practice",
    "study-plans",
    "ecg",
    "clinical-skills",
    "labs",
    "pharmacology",
    "simulations",
    "new-grad",
    "allied-health",
  ]) {
    assert.ok(ids.has(required), `Missing feature registry row: ${required}`);
  }
});

test("platform analytics contract enforces event naming and feature coverage", () => {
  const violations = validateAnalyticsContract();
  assert.deepEqual(violations, []);
});

test("platform monetization contract enforces premium entitlement guards", () => {
  const violations = validateMonetizationContract();
  assert.deepEqual(violations, []);
});

test("platform subscription contract enforces subscriber feature rules", () => {
  const violations = validateSubscriptionContract();
  assert.deepEqual(violations, []);
});

test("platform content governance contract keeps production content lifecycle explicit", () => {
  const violations = validateContentGovernanceContract();
  assert.deepEqual(violations, []);
});

test("launch readiness dashboard gives every feature a scored row", () => {
  const rows = buildLaunchReadinessDashboard();
  assert.equal(rows.length, PLATFORM_FEATURES.length);
  for (const row of rows) {
    assert.ok(row.score >= 0 && row.score <= 100, `${row.feature.id} score out of bounds`);
  }
});
