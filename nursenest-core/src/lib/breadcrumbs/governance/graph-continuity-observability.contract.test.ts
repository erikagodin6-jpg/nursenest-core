import assert from "node:assert/strict";
import { test } from "node:test";
import {
  recordGraphContinuityRecovered,
  recordNormalizationFallbackTriggered,
  recordRemediationReturnSuccess,
} from "@/lib/breadcrumbs/graph-navigation-observability";

test("graph continuity observability helpers are callable", () => {
  assert.doesNotThrow(() => {
    recordGraphContinuityRecovered("/app/account/focus-areas", "ca-rn-nclex-rn:sepsis");
    recordRemediationReturnSuccess("ca-rn-nclex-rn:sepsis");
    recordNormalizationFallbackTriggered("/ecg", undefined, "/ecg");
  });
});
