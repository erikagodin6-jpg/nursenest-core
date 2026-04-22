import test from "node:test";
import assert from "node:assert/strict";
import {
  adminAiGenerationHttpBlock,
  getAdminAiGenerationGate,
  isAdminAiGenerationEnabled,
} from "@/lib/ai/admin-ai-policy";
import { parseBooleanEnv } from "@/lib/env/parse-boolean-env";
import { resetRuntimeEnvSnapshotForTests } from "@/lib/env/runtime-env";

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

test("parseBooleanEnv: common env spellings", () => {
  assert.equal(parseBooleanEnv(undefined), false);
  assert.equal(parseBooleanEnv(""), false);
  assert.equal(parseBooleanEnv("  "), false);
  assert.equal(parseBooleanEnv("true"), true);
  assert.equal(parseBooleanEnv("TRUE"), true);
  assert.equal(parseBooleanEnv(" 1 "), true);
  assert.equal(parseBooleanEnv("yes"), true);
  assert.equal(parseBooleanEnv("On"), true);
  assert.equal(parseBooleanEnv("false"), false);
  assert.equal(parseBooleanEnv("0"), false);
  assert.equal(parseBooleanEnv("maybe"), false);
});

test("isAdminAiGenerationEnabled accepts normalized truthy env", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "1" }, () => assert.equal(isAdminAiGenerationEnabled(), true));
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true" }, () => assert.equal(isAdminAiGenerationEnabled(), true));
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "  True  " }, () => assert.equal(isAdminAiGenerationEnabled(), true));
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "FALSE" }, () => assert.equal(isAdminAiGenerationEnabled(), false));
});

test("getAdminAiGenerationGate: disabled when flag off", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: undefined, AI_INTEGRATIONS_OPENAI_API_KEY: "sk-test" }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "disabled");
    assert.equal(g.runnable, false);
    assert.equal(g.diagnostics.aiAdminGenerationFlagClass, "unset");
    assert.equal(
      g.summaryLine,
      "AI generation disabled: generation flag is unset (AI_ADMIN_GENERATION_ENABLED is not defined on this server process).",
    );
  });
});

test("getAdminAiGenerationGate: disabled when flag unrecognized", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "enabled", OPENAI_API_KEY: "sk-x" }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "disabled");
    assert.equal(g.diagnostics.aiAdminGenerationFlagClass, "unrecognized");
    assert.equal(
      g.summaryLine,
      "AI generation disabled: generation flag is not a recognized truthy value (use true, 1, yes, or on; trim whitespace).",
    );
  });
});

test("getAdminAiGenerationGate: misconfigured when flag on but no key", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true", AI_INTEGRATIONS_OPENAI_API_KEY: undefined, OPENAI_API_KEY: undefined }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "misconfigured");
    assert.equal(g.runnable, false);
    assert.equal(
      g.summaryLine,
      "AI generation disabled: no OpenAI API key configured (set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY on this server process).",
    );
  });
});

test("getAdminAiGenerationGate: enabled when flag on and OPENAI_API_KEY set", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true", AI_INTEGRATIONS_OPENAI_API_KEY: undefined, OPENAI_API_KEY: "sk-x" }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "enabled");
    assert.equal(g.runnable, true);
    assert.equal(g.summaryLine, "AI generation enabled");
  });
});

test("getAdminAiGenerationGate: enabled when flag is numeric 1 and key set", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "1", OPENAI_API_KEY: "sk-x" }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "enabled");
    assert.equal(g.runnable, true);
    assert.equal(g.diagnostics.aiAdminGenerationFlagClass, "enabled");
    assert.equal(g.summaryLine, "AI generation enabled");
  });
});

test("adminAiGenerationHttpBlock returns 403 JSON when disabled", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: undefined }, () => {
    const res = adminAiGenerationHttpBlock();
    assert.ok(res);
    assert.equal(res.status, 403);
  });
});

test("adminAiGenerationHttpBlock returns 503 when misconfigured (flag on, no key)", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true", OPENAI_API_KEY: undefined, AI_INTEGRATIONS_OPENAI_API_KEY: undefined }, () => {
    const res = adminAiGenerationHttpBlock();
    assert.ok(res);
    assert.equal(res.status, 503);
  });
});

test("adminAiGenerationHttpBlock returns null when runnable", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true", OPENAI_API_KEY: "sk-test" }, () => {
    assert.equal(adminAiGenerationHttpBlock(), null);
  });
});
