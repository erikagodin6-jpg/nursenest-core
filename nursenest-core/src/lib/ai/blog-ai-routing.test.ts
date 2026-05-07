/**
 * Run: npx tsx --test src/lib/ai/blog-ai-routing.test.ts
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getBlogAiChatProvider } from "@/lib/ai/blog-ai-routing";

const KEYS = ["BLOG_AI_PROVIDER", "AI_PROVIDER", "OPENROUTER_API_KEY"] as const;

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

describe("getBlogAiChatProvider", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = snapshotEnv();
  });
  afterEach(() => {
    restoreEnv(saved);
  });

  it("uses BLOG_AI_PROVIDER when set to a known value (overrides AI_PROVIDER)", () => {
    process.env.AI_PROVIDER = "openrouter";
    process.env.BLOG_AI_PROVIDER = "openai";
    process.env.OPENROUTER_API_KEY = "or-test";
    assert.equal(getBlogAiChatProvider(), "openai");
  });

  it("uses OpenRouter when only OPENROUTER_API_KEY is present", () => {
    delete process.env.BLOG_AI_PROVIDER;
    delete process.env.AI_PROVIDER;
    process.env.OPENROUTER_API_KEY = "or-test";
    assert.equal(getBlogAiChatProvider(), "openrouter");
  });

  it("falls back to AI_PROVIDER=openrouter when BLOG_AI_PROVIDER is unset", () => {
    delete process.env.BLOG_AI_PROVIDER;
    delete process.env.OPENROUTER_API_KEY;
    process.env.AI_PROVIDER = "openrouter";
    assert.equal(getBlogAiChatProvider(), "openrouter");
  });

  it("does not default blog generation to OpenAI without explicit provider config", () => {
    delete process.env.BLOG_AI_PROVIDER;
    delete process.env.AI_PROVIDER;
    delete process.env.OPENROUTER_API_KEY;
    assert.equal(getBlogAiChatProvider(), "unconfigured");
  });
});
