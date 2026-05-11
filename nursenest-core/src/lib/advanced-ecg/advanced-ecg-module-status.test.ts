import assert from "node:assert/strict";
import test from "node:test";
import { buildAdvancedEcgCommercialLaunchState } from "@/lib/advanced-ecg/advanced-ecg-module-status";

test("Advanced ECG commercial launch state blocks public checkout until publish gates clear", () => {
  const blocked = buildAdvancedEcgCommercialLaunchState({
    enabled: true,
    status: "qa_preview",
    counts: {
      readyAdvanced: 24,
      manualReviewMissing: 1,
      publishSafe: 20,
      leakedGeneratedPacemaker: 0,
    },
  });

  assert.equal(blocked.canSellPublicly, false);
  assert.equal(blocked.publishFailures.some((failure) => failure.includes("qa_preview")), true);
  assert.equal(blocked.publishFailures.some((failure) => failure.includes("clinician review")), true);
});

test("Advanced ECG commercial launch state allows public checkout when publish gates are satisfied", () => {
  const ready = buildAdvancedEcgCommercialLaunchState({
    enabled: true,
    status: "published",
    counts: {
      readyAdvanced: 24,
      manualReviewMissing: 0,
      publishSafe: 24,
      leakedGeneratedPacemaker: 0,
    },
  });

  assert.equal(ready.canPublish, true);
  assert.equal(ready.canSellPublicly, true);
  assert.equal(ready.publishFailures.length, 0);
});
