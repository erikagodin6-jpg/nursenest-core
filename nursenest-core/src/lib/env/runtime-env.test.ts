import test from "node:test";
import assert from "node:assert/strict";
import {
  getAdminAiOpenAiRuntimeSnapshot,
  hasAiProviderKey,
  hasOpenAiKey,
  isAdminAiEnabled,
  resetRuntimeEnvSnapshotForTests,
} from "@/lib/env/runtime-env";

function withEnv<T>(patch: Record<string, string | undefined>, fn: () => T): T {
  const effectivePatch = {
    AI_PROVIDER: undefined,
    BLOG_AI_PROVIDER: undefined,
    OPENROUTER_API_KEY: undefined,
    BLOG_OPENROUTER_API_KEY: undefined,
    AI_ADMIN_GENERation: undefined,
    ...patch,
  };
  const prev: Record<string, string | undefined> = {};
  for (const k of Object.keys(effectivePatch)) {
    prev[k] = process.env[k];
    const v = effectivePatch[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    resetRuntimeEnvSnapshotForTests();
    return fn();
  } finally {
    for (const k of Object.keys(effectivePatch)) {
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
      OPENROUTER_API_KEY: undefined,
      AI_PROVIDER: undefined,
    },
    () => {
      assert.equal(hasOpenAiKey(), false);
      assert.equal(hasAiProviderKey(), false);
      assert.equal(getAdminAiOpenAiRuntimeSnapshot().openAiApiKey, null);
    },
  );
});

test("runtime env: OpenRouter provider key satisfies selected provider", () => {
  withEnv(
    {
      AI_PROVIDER: "openrouter",
      OPENROUTER_API_KEY: "or-test",
      AI_INTEGRATIONS_OPENAI_API_KEY: undefined,
      OPENAI_API_KEY: undefined,
    },
    () => {
      const s = getAdminAiOpenAiRuntimeSnapshot();
      assert.equal(hasOpenAiKey(), false);
      assert.equal(hasAiProviderKey(), true);
      assert.equal(s.aiProvider, "openrouter");
      assert.equal(s.openRouterApiKeyPresent, true);
      assert.equal(s.openRouterCanonicalKeyPresent, true);
      assert.equal(s.blogOpenRouterKeyPresent, false);
      assert.equal(s.hasAiProviderKey, true);
    },
  );
});

test("runtime env: blog-scoped OpenRouter key satisfies selected provider", () => {
  withEnv(
    {
      AI_PROVIDER: "openrouter",
      OPENROUTER_API_KEY: undefined,
      BLOG_OPENROUTER_API_KEY: "or-blog-test",
      AI_INTEGRATIONS_OPENAI_API_KEY: undefined,
      OPENAI_API_KEY: undefined,
    },
    () => {
      const s = getAdminAiOpenAiRuntimeSnapshot();
      assert.equal(hasOpenAiKey(), false);
      assert.equal(hasAiProviderKey(), true);
      assert.equal(s.aiProvider, "openrouter");
      assert.equal(s.openRouterApiKeyPresent, true);
      assert.equal(s.blogOpenRouterKeyPresent, true);
      assert.equal(s.openRouterCanonicalKeyPresent, false);
      assert.equal(s.hasAiProviderKey, true);
    },
  );
});

test("runtime env: canonical admin flag wins over legacy typo alias", () => {
  withEnv(
    {
      AI_ADMIN_GENERATION_ENABLED: "false",
      AI_ADMIN_GENERation: "true",
    },
    () => {
      const s = getAdminAiOpenAiRuntimeSnapshot();
      assert.equal(s.rawAiAdminGenerationEnabled, "false");
      assert.equal(s.aiAdminGenerationFlagSourceKey, "AI_ADMIN_GENERATION_ENABLED");
      assert.equal(s.adminAiGenerationFlagParsed, false);
    },
  );
});

test("runtime env: legacy typo admin flag alias is accepted when canonical flag is absent", () => {
  withEnv(
    {
      AI_ADMIN_GENERATION_ENABLED: undefined,
      AI_ADMIN_GENERation: "true",
    },
    () => {
      const s = getAdminAiOpenAiRuntimeSnapshot();
      assert.equal(s.rawAiAdminGenerationEnabled, "true");
      assert.equal(s.aiAdminGenerationFlagSourceKey, "AI_ADMIN_GENERation");
      assert.equal(s.adminAiGenerationFlagParsed, true);
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
