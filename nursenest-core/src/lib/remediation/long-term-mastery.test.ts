import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeLongTermMasterySignals } from "@/lib/remediation/long-term-mastery";

describe("long-term mastery tracking", () => {
  const now = new Date("2026-05-28T12:00:00.000Z");

  it("surfaces high-risk medication topics before mastery decays", () => {
    const signals = computeLongTermMasterySignals(
      [
        {
          topic: "Insulin medication safety",
          correctCount: 12,
          wrongCount: 2,
          wrongStreak: 0,
          lastWrongAt: new Date("2026-04-10T12:00:00.000Z"),
          lastAttemptAt: new Date("2026-05-10T12:00:00.000Z"),
          remediationEvents: [],
        },
      ],
      now,
    );

    assert.equal(signals[0]?.focus, "medication_safety");
    assert.equal(signals[0]?.riskLevel, "critical");
    assert.ok((signals[0]?.conceptDecayRisk ?? 0) >= 45);
    assert.ok((signals[0]?.priorityScore ?? 0) >= 55);
  });

  it("detects relapse into unsafe reasoning after previously strong accuracy", () => {
    const signals = computeLongTermMasterySignals(
      [
        {
          topic: "Delegation and prioritization",
          correctCount: 18,
          wrongCount: 4,
          wrongStreak: 2,
          lastWrongAt: new Date("2026-05-26T12:00:00.000Z"),
          lastAttemptAt: new Date("2026-05-26T12:00:00.000Z"),
          remediationEvents: [
            { mistakeType: "delegation", createdAt: new Date("2026-05-26T12:00:00.000Z") },
            { mistakeType: "prioritization", createdAt: new Date("2026-05-27T12:00:00.000Z") },
          ],
        },
      ],
      now,
    );

    assert.equal(signals[0]?.focus, "delegation");
    assert.ok((signals[0]?.unsafeRelapseRisk ?? 0) >= 50);
    assert.ok((signals[0]?.prioritizationConsistency ?? 100) < 70);
  });

  it("does not over-prioritize stable recent low-risk mastery", () => {
    const signals = computeLongTermMasterySignals(
      [
        {
          topic: "Hand hygiene",
          correctCount: 20,
          wrongCount: 1,
          wrongStreak: 0,
          lastWrongAt: new Date("2026-04-20T12:00:00.000Z"),
          lastAttemptAt: new Date("2026-05-27T12:00:00.000Z"),
          remediationEvents: [],
        },
      ],
      now,
    );

    assert.equal(signals.length, 0);
  });
});
