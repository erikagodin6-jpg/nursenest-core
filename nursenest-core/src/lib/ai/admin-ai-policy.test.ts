import test from "node:test";
import assert from "node:assert/strict";
import {
  adminAiGenerationHttpBlock,
  getAdminAiGenerationGate,
  isAdminAiGenerationEnabled,
} from "@/lib/ai/admin-ai-policy";

function withEnv<T>(patch: Record<string, string | undefined>, fn: () => T): T {
  const prev: Record<string, string | undefined> = {};
  for (const k of Object.keys(patch)) {
    prev[k] = process.env[k];
    const v = patch[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const k of Object.keys(patch)) {
      const old = prev[k];
      if (old === undefined) delete process.env[k];
      else process.env[k] = old;
    }
  }
}

test("isAdminAiGenerationEnabled is strict true string", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "1" }, () => assert.equal(isAdminAiGenerationEnabled(), false));
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true" }, () => assert.equal(isAdminAiGenerationEnabled(), true));
});

test("getAdminAiGenerationGate: disabled when flag off", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: undefined, AI_INTEGRATIONS_OPENAI_API_KEY: "sk-test" }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "disabled");
    assert.equal(g.runnable, false);
  });
});

test("getAdminAiGenerationGate: misconfigured when flag on but no key", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true", AI_INTEGRATIONS_OPENAI_API_KEY: undefined, OPENAI_API_KEY: undefined }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "misconfigured");
    assert.equal(g.runnable, false);
    assert.match(g.summaryLine, /not configured/i);
  });
});

test("getAdminAiGenerationGate: enabled when flag on and OPENAI_API_KEY set", () => {
  withEnv({ AI_ADMIN_GENERATION_ENABLED: "true", AI_INTEGRATIONS_OPENAI_API_KEY: undefined, OPENAI_API_KEY: "sk-x" }, () => {
    const g = getAdminAiGenerationGate();
    assert.equal(g.mode, "enabled");
    assert.equal(g.runnable, true);
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
