/**
 * Regression guard: DATABASE_URL contract + standalone bootstrap ordering (DigitalOcean / Next standalone).
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/runtime-env-contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { isDatabaseContractSkippedPhase } from "../../src/lib/env/require-database-env";

const ROOT = process.cwd();
const START_STANDALONE = path.join(ROOT, "scripts", "start-standalone.mjs");

function stripEnv(keys: string[]) {
  const prev: Record<string, string | undefined> = {};
  for (const k of keys) {
    prev[k] = process.env[k];
    delete process.env[k];
  }
  return prev;
}

function restoreEnv(prev: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(prev)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

describe("runtime env contract — DB skip phases", () => {
  it("skips during NEXT_PHASE=phase-production-build (compile)", () => {
    const keys = [
      "NN_SKIP_DATABASE_ENV_CONTRACT",
      "NEXT_PHASE",
      "npm_lifecycle_event",
      "NN_APP_PLATFORM_BUILD",
    ];
    const prev = stripEnv(keys);
    try {
      process.env.NEXT_PHASE = "phase-production-build";
      assert.equal(isDatabaseContractSkippedPhase(), true);
    } finally {
      restoreEnv(prev);
    }
  });

  it("does not skip production runtime solely because NN_APP_PLATFORM_BUILD=true", () => {
    const keys = [
      "NN_SKIP_DATABASE_ENV_CONTRACT",
      "NEXT_PHASE",
      "npm_lifecycle_event",
      "NN_APP_PLATFORM_BUILD",
    ];
    const prev = stripEnv(keys);
    try {
      process.env.NN_APP_PLATFORM_BUILD = "true";
      assert.equal(isDatabaseContractSkippedPhase(), false);
    } finally {
      restoreEnv(prev);
    }
  });
});

describe("standalone bootstrap ordering", () => {
  it("hydrates disk env before validateRuntimeEnvOrThrow", () => {
    const src = fs.readFileSync(START_STANDALONE, "utf8");
    const hydrateIdx = src.indexOf("hydrateProcessEnvFromDisk();");
    const runtimeEnvFileIdx = src.indexOf("loadRuntimeEnvFileFallback();");
    const validateIdx = src.indexOf("validateRuntimeEnvOrThrow();");
    assert.ok(hydrateIdx > 0, "expected hydrateProcessEnvFromDisk call in start-standalone.mjs");
    assert.ok(runtimeEnvFileIdx > 0, "expected loadRuntimeEnvFileFallback call in start-standalone.mjs");
    assert.ok(validateIdx > 0, "expected validateRuntimeEnvOrThrow() call in start-standalone.mjs");
    assert.ok(hydrateIdx < runtimeEnvFileIdx, "disk hydrate must run before runtime env file fallback");
    assert.ok(runtimeEnvFileIdx < validateIdx, "runtime env file fallback must run before validateRuntimeEnvOrThrow");
  });

  it("documents prisma-safe generate as a compile-only argv shape (grep)", () => {
    const guardPath = path.join(ROOT, "src", "lib", "env", "require-database-env.ts");
    const guardSrc = fs.readFileSync(guardPath, "utf8");
    assert.ok(guardSrc.includes("prisma-safe.mjs"), "expected prisma-safe.mjs argv guard in require-database-env.ts");
  });
});
