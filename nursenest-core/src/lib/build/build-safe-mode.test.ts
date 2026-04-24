import assert from "node:assert/strict";
import { test } from "node:test";

import {
  isProductionBuildInvocation,
  shouldReduceNonCriticalBuildWork,
} from "./build-safe-mode";

const keys = ["NEXT_PHASE", "NN_BUILD_SAFE_MODE"] as const;

function saveEnv(): Record<(typeof keys)[number], string | undefined> {
  const out = {} as Record<(typeof keys)[number], string | undefined>;
  for (const k of keys) out[k] = process.env[k];
  return out;
}

function restoreEnv(prev: Record<(typeof keys)[number], string | undefined>) {
  for (const k of keys) {
    const v = prev[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

test("isProductionBuildInvocation is true only for phase-production-build", () => {
  const prev = saveEnv();
  try {
    delete process.env.NEXT_PHASE;
    assert.equal(isProductionBuildInvocation(), false);
    process.env.NEXT_PHASE = "phase-development-build";
    assert.equal(isProductionBuildInvocation(), false);
    process.env.NEXT_PHASE = "phase-production-build";
    assert.equal(isProductionBuildInvocation(), true);
  } finally {
    restoreEnv(prev);
  }
});

test("shouldReduceNonCriticalBuildWork respects NN_BUILD_SAFE_MODE", () => {
  const prev = saveEnv();
  try {
    delete process.env.NN_BUILD_SAFE_MODE;
    assert.equal(shouldReduceNonCriticalBuildWork(), false);
    process.env.NN_BUILD_SAFE_MODE = "0";
    assert.equal(shouldReduceNonCriticalBuildWork(), false);
    process.env.NN_BUILD_SAFE_MODE = "1";
    assert.equal(shouldReduceNonCriticalBuildWork(), true);
    process.env.NN_BUILD_SAFE_MODE = "TRUE";
    assert.equal(shouldReduceNonCriticalBuildWork(), true);
  } finally {
    restoreEnv(prev);
  }
});
