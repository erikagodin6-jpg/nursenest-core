import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildDailyStudyPlan } from "./build-daily-study-plan";
import {
  computeNextActions,
  determineReadinessTrend,
  readinessTone,
  type LearnerState,
} from "./study-orchestrator";

describe("guided study orchestrator", () => {
  it("prioritizes post-CAT review before new work", () => {
    const state: LearnerState = {
      userId: "learner-1",
      weakAreas: ["Delegation"],
      readinessScore: 68,
      lastSessionType: "cat",
    };

    const actions = computeNextActions(state);

    assert.equal(actions[0]?.type, "review");
    assert.match(actions[0]?.reason ?? "", /remediation/i);
    assert.equal(actions[0]?.focusArea, "Delegation");
  });

  it("uses high-risk readiness domains ahead of generic weak areas", () => {
    const state: LearnerState = {
      userId: "learner-2",
      weakAreas: ["Pharmacology"],
      readinessScore: 61,
      readinessDomains: [
        { id: "pharmacology", label: "Pharmacology", score: 62, previousScore: 60, trend: "stable" },
        { id: "delegation", label: "Delegation", score: 44, previousScore: 51, trend: "down", highRisk: true },
      ],
    };

    const actions = computeNextActions(state);

    assert.equal(actions[0]?.focusArea, "Delegation");
    assert.match(actions[0]?.title ?? "", /Delegation/);
  });

  it("adds a mini simulation when readiness is high enough", () => {
    const state: LearnerState = {
      userId: "learner-3",
      weakAreas: ["Respiratory"],
      readinessScore: 78,
    };

    const actions = computeNextActions(state);

    assert.ok(actions.some((action) => action.type === "cat-mini"));
  });

  it("keeps daily plans short enough to reduce overwhelm", () => {
    const plan = buildDailyStudyPlan({
      userId: "learner-4",
      weakAreas: ["Medication Safety"],
      readinessScore: 55,
    });

    assert.equal(plan.focusArea, "Medication Safety");
    assert.ok(plan.estimatedMinutes <= 45);
    assert.equal(plan.lowOverwhelmMode, true);
    assert.ok(plan.actions.length <= 3);
  });

  it("classifies readiness trends and tone", () => {
    assert.equal(determineReadinessTrend(65, 60), "up");
    assert.equal(determineReadinessTrend(52, 58), "down");
    assert.equal(determineReadinessTrend(70, 68), "stable");
    assert.match(readinessTone(74), /Approaching readiness/);
  });
});
