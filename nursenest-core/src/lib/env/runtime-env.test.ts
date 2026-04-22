import test from "node:test";
import assert from "node:assert/strict";
import {
  getAdminAiOpenAiRuntimeSnapshot,
  hasOpenAiKey,
  isAdminAiEnabled,
  resetRuntimeEnvSnapshotForTests,
} from "@/lib/env/runtime-env";

function withEnv<T>(patch: Record<string, string | undefined>, fn: () => T): T {
  const prev: Record<string, string | undefined> = {};
  for (const k of Object.keys(patch)) {
    prev[k] = process.env[k];
    const v = patch[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    resetRuntimeEnvSnapshotForTests();
    return fn();
  } finally {
    for (const k of Object.keys(patch)) {
      const old = prev[k];
      if (old === undefined) delete process.env[k];
      else process.env[k] = old;
    }
    resetRuntimeEnvSnapshotForTests();
  }
}

test("runtime env: boolean spellings for admin flag", () => {
  for (const v of ["true", "TRUE", "1", "yes", " Yes ", "on", "ON"]) {
    withEnv({ AI_ADMIN_GENERATION_ENABLED: v }, () => {
      assert.equal(isAdminAiEnabled(), true, v);
      assert.equal(getAdminAiOpenAiRuntimeSnapshot().adminAiGenerationFlagParsed, true, v);
    });
  }
});

test("runtime env: whitespace-only flag is off", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "   " }, () => {
    assert.equal(isAdminAiEnabled(), false);
  });
});

test("runtime env: missing keys", () => {
  withEnv(
    {
      AI_ADMIN_GENERATION_ENABLED: "true",
      AI_INTEGRATIONS_OPENAI_API_KEY: undefined,
      OPENAI_API_KEY: undefined,
    },
    () => {
      assert.equal(hasOpenAiKey(), false);
      assert.equal(getAdminAiOpenAiRuntimeSnapshot().openAiApiKey, null);
    },
  );
});

test("runtime env: integrations key preferred over legacy", () => {
  withEnv(
    {
      AI_INTEGRATIONS_OPENAI_API_KEY: "sk-int",
      OPENAI_API_KEY: "sk-leg",
    },
    () => {
      assert.equal(getAdminAiOpenAiRuntimeSnapshot().openAiApiKey, "sk-int");
    },
  );
});

test("runtime env: valid config snapshot", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true", OPENAI_API_KEY: "sk-x" }, () => {
    const s = getAdminAiOpenAiRuntimeSnapshot();
    assert.equal(s.adminAiGenerationFlagParsed, true);
    assert.equal(s.hasOpenAiKey, true);
    assert.equal(s.openAiApiKey, "sk-x");
    assert.equal(s.legacyOpenAiKeyPresent, true);
    assert.equal(s.aiIntegrationsOpenAiKeyPresent, false);
  });
});

test("runtime env: each snapshot read reflects current process.env (no module cache)", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "false" }, () => {
    assert.equal(getAdminAiOpenAiRuntimeSnapshot().adminAiGenerationFlagParsed, false);
    process.env.AI_ADMIN_GENERATION_ENABLED = "true";
    assert.equal(getAdminAiOpenAiRuntimeSnapshot().adminAiGenerationFlagParsed, true);
  });
});
