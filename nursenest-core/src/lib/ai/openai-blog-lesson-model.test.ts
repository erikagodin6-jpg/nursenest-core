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
  getLessonOpenAiChatModel,
  OPENAI_DEFAULT_BLOG_LESSON_MODEL,
} from "@/lib/ai/openai-env";

const KEYS = [
  "BLOG_OPENAI_MODEL",
  "LESSON_OPENAI_MODEL",
  "AI_INTEGRATIONS_OPENAI_MODEL",
  "BLOG_OPENAI_API_KEY",
  "AI_INTEGRATIONS_OPENAI_API_KEY",
  "OPENAI_API_KEY",
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

describe("OPENAI_DEFAULT_BLOG_LESSON_MODEL", () => {
  it("matches gpt-4.1-mini fallback for blog and lesson pipelines", () => {
    assert.equal(OPENAI_DEFAULT_BLOG_LESSON_MODEL, "gpt-4.1-mini");
  });
});

describe("getBlogOpenAiApiKey + assertOpenAiKeyConfigured", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
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
});

describe("getBlogOpenAiChatModel", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
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

describe("getLessonOpenAiChatModel", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
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
