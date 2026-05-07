/**
 * Env resolution for blog vs lesson OpenAI chat models.
 * Run: npx tsx --test src/lib/ai/openai-blog-lesson-model.test.ts
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  assertOpenAiKeyConfigured,
  getBlogOpenAiApiKey,
  getBlogOpenAiChatModel,
  getBlogOpenRouterChatModel,
  getLessonOpenAiChatModel,
  getOpenRouterChatModel,
  OPENAI_DEFAULT_BLOG_LESSON_MODEL,
  OPENROUTER_DEFAULT_BLOG_MODEL,
  OPENROUTER_DEFAULT_CHAT_MODEL,
} from "@/lib/ai/openai-env";

const KEYS = [
  "BLOG_OPENAI_MODEL",
  "LESSON_OPENAI_MODEL",
  "AI_INTEGRATIONS_OPENAI_MODEL",
  "BLOG_OPENAI_API_KEY",
  "AI_INTEGRATIONS_OPENAI_API_KEY",
  "OPENAI_API_KEY",
  "AI_PROVIDER",
  "BLOG_AI_PROVIDER",
  "OPENROUTER_API_KEY",
  "OPENROUTER_MODEL",
] as const;

function snapshotEnv(): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const k of KEYS) out[k] = process.env[k];
  return out;
}

function restoreEnv(prev: Record<string, string | undefined>): void {
  for (const k of KEYS) {
    const v = prev[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

function clearProviderSelectionEnv(): void {
  delete process.env.AI_PROVIDER;
  delete process.env.BLOG_AI_PROVIDER;
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_MODEL;
}

describe("OPENAI_DEFAULT_BLOG_LESSON_MODEL", () => {
  it("matches gpt-4.1-mini fallback for blog and lesson pipelines", () => {
    assert.equal(OPENAI_DEFAULT_BLOG_LESSON_MODEL, "gpt-4.1-mini");
  });
});

describe("getBlogOpenAiApiKey + assertOpenAiKeyConfigured", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
    clearProviderSelectionEnv();
  });
  afterEach(() => {
    restoreEnv(saved);
  });

  it("prefers BLOG_OPENAI_API_KEY for getBlogOpenAiApiKey", () => {
    delete process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const blogOnly = ["m", "o", "c", "k", "-", "b", "l", "o", "g"].join("");
    process.env.BLOG_OPENAI_API_KEY = blogOnly;
    assert.equal(getBlogOpenAiApiKey(), blogOnly);
  });

  it("assertOpenAiKeyConfigured({ pipeline: 'blog' }) ok when only BLOG_OPENAI_API_KEY is set", () => {
    delete process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    process.env.BLOG_OPENAI_API_KEY = ["m", "o", "c", "k", "-", "b", "l", "o", "g"].join("");
    assert.equal(assertOpenAiKeyConfigured({ pipeline: "blog" }).ok, true);
    assert.equal(assertOpenAiKeyConfigured().ok, false);
  });

  it("assertOpenAiKeyConfigured({ pipeline: 'blog' }) ok when only AI_INTEGRATIONS_OPENAI_API_KEY is set", () => {
    delete process.env.BLOG_OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY = ["m", "o", "c", "k", "-", "i", "n", "t"].join("");
    assert.equal(assertOpenAiKeyConfigured({ pipeline: "blog" }).ok, true);
  });

  it("assertOpenAiKeyConfigured({ pipeline: 'blog' }) accepts OpenRouter when selected", () => {
    delete process.env.BLOG_OPENAI_API_KEY;
    delete process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    process.env.AI_PROVIDER = "openrouter";
    process.env.OPENROUTER_API_KEY = ["o", "r", "-", "m", "o", "c", "k"].join("");
    assert.equal(assertOpenAiKeyConfigured({ pipeline: "blog" }).ok, true);
    assert.equal(assertOpenAiKeyConfigured().ok, true);
  });

  it("assertOpenAiKeyConfigured({ pipeline: 'blog' }) names OpenRouter when selected without key", () => {
    delete process.env.BLOG_OPENAI_API_KEY;
    delete process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    process.env.AI_PROVIDER = "openrouter";
    const result = assertOpenAiKeyConfigured({ pipeline: "blog" });
    assert.equal(result.ok, false);
    assert.match(result.message, /OPENROUTER_API_KEY/);
  });
});

describe("getBlogOpenAiChatModel", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
    clearProviderSelectionEnv();
  });
  afterEach(() => {
    restoreEnv(saved);
  });

  it("prefers BLOG_OPENAI_MODEL over AI_INTEGRATIONS_OPENAI_MODEL", () => {
    process.env.BLOG_OPENAI_MODEL = "gpt-4o";
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "gpt-4.1-mini";
    assert.equal(getBlogOpenAiChatModel(), "gpt-4o");
  });

  it("falls back to AI_INTEGRATIONS_OPENAI_MODEL then default", () => {
    delete process.env.BLOG_OPENAI_MODEL;
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "gpt-4o-mini";
    assert.equal(getBlogOpenAiChatModel(), "gpt-4o-mini");
    delete process.env.AI_INTEGRATIONS_OPENAI_MODEL;
    assert.equal(getBlogOpenAiChatModel(), OPENAI_DEFAULT_BLOG_LESSON_MODEL);
  });

  it("ignores whitespace-only BLOG_OPENAI_MODEL (falls through)", () => {
    process.env.BLOG_OPENAI_MODEL = "   ";
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "gpt-4.1-nano";
    assert.equal(getBlogOpenAiChatModel(), "gpt-4.1-nano");
  });
});

describe("getBlogOpenRouterChatModel", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
  });
  afterEach(() => {
    restoreEnv(saved);
  });

  it("prefers OPENROUTER_MODEL", () => {
    process.env.OPENROUTER_MODEL = "anthropic/claude-3.5-haiku";
    process.env.BLOG_OPENAI_MODEL = "gpt-4o";
    assert.equal(getBlogOpenRouterChatModel(), "anthropic/claude-3.5-haiku");
  });

  it("falls back to default slug when unset", () => {
    delete process.env.OPENROUTER_MODEL;
    delete process.env.BLOG_OPENAI_MODEL;
    delete process.env.AI_INTEGRATIONS_OPENAI_MODEL;
    assert.equal(getBlogOpenRouterChatModel(), OPENROUTER_DEFAULT_BLOG_MODEL);
  });
});

describe("getOpenRouterChatModel", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
    clearProviderSelectionEnv();
  });
  afterEach(() => {
    restoreEnv(saved);
  });

  it("uses OPENROUTER_MODEL for shared OpenRouter chat", () => {
    process.env.OPENROUTER_MODEL = "anthropic/claude-3.5-sonnet";
    assert.equal(getOpenRouterChatModel(), "anthropic/claude-3.5-sonnet");
  });

  it("uses OpenRouter default when unset", () => {
    delete process.env.OPENROUTER_MODEL;
    assert.equal(getOpenRouterChatModel(), OPENROUTER_DEFAULT_CHAT_MODEL);
  });

  it("allows blog model fallback only for blog OpenRouter routing", () => {
    delete process.env.OPENROUTER_MODEL;
    process.env.BLOG_OPENAI_MODEL = "openai/gpt-4.1-mini";
    assert.equal(getBlogOpenRouterChatModel(), "openai/gpt-4.1-mini");
    assert.equal(getOpenRouterChatModel(), OPENROUTER_DEFAULT_CHAT_MODEL);
  });
});

describe("getLessonOpenAiChatModel", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
    clearProviderSelectionEnv();
  });
  afterEach(() => {
    restoreEnv(saved);
  });

  it("prefers LESSON_OPENAI_MODEL over AI_INTEGRATIONS_OPENAI_MODEL", () => {
    process.env.LESSON_OPENAI_MODEL = "gpt-4o";
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "gpt-4.1-mini";
    assert.equal(getLessonOpenAiChatModel(), "gpt-4o");
  });

  it("falls back to shared integrations model then default", () => {
    delete process.env.LESSON_OPENAI_MODEL;
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "o4-mini";
    assert.equal(getLessonOpenAiChatModel(), "o4-mini");
    delete process.env.AI_INTEGRATIONS_OPENAI_MODEL;
    assert.equal(getLessonOpenAiChatModel(), OPENAI_DEFAULT_BLOG_LESSON_MODEL);
  });

  it("ignores whitespace-only LESSON_OPENAI_MODEL (falls through)", () => {
    process.env.LESSON_OPENAI_MODEL = "\t";
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "o4-mini";
    assert.equal(getLessonOpenAiChatModel(), "o4-mini");
  });
});
