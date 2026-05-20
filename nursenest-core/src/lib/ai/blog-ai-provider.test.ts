/**
 * Run: npx tsx --test src/lib/ai/blog-ai-provider.test.ts
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { openRouterChatCompletion } from "@/lib/ai/blog-ai-provider";

const KEYS = ["OPENROUTER_API_KEY", "OPENROUTER_MODEL", "OPENROUTER_HTTP_REFERER", "OPENROUTER_APP_TITLE"] as const;

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

describe("openRouterChatCompletion", () => {
  let savedEnv: Record<string, string | undefined>;
  let savedFetch: typeof globalThis.fetch;

  beforeEach(() => {
    savedEnv = snapshotEnv();
    savedFetch = globalThis.fetch;
  });

  afterEach(() => {
    restoreEnv(savedEnv);
    globalThis.fetch = savedFetch;
  });

  it("posts to OpenRouter with Authorization and model headers", async () => {
    process.env.OPENROUTER_API_KEY = "or-test-key";
    process.env.OPENROUTER_MODEL = "anthropic/claude-3.5-haiku";
    let seenUrl = "";
    let seenHeaders: Headers | null = null;
    let seenBody: { model?: string; messages?: unknown[] } = {};

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      seenUrl = String(input);
      seenHeaders = new Headers(init?.headers);
      seenBody = JSON.parse(String(init?.body ?? "{}")) as typeof seenBody;
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: "<p>ok</p>" } }],
          usage: { total_tokens: 12 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof globalThis.fetch;

    const out = await openRouterChatCompletion({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: "Write one line." }],
      temperature: 0.2,
      maxTokens: 64,
      user: "blog-test",
    });

    assert.equal(seenUrl, "https://openrouter.ai/api/v1/chat/completions");
    assert.ok(seenHeaders);
    assert.equal(seenHeaders.get("authorization"), "Bearer or-test-key");
    assert.equal(seenHeaders.get("content-type"), "application/json");
    assert.equal(seenHeaders.get("http-referer"), "https://nursenest.ca");
    assert.equal(seenHeaders.get("x-title"), "NurseNest");
    assert.equal(seenBody.model, "anthropic/claude-3.5-haiku");
    assert.equal(out.content, "<p>ok</p>");
    assert.equal(out.totalTokens, 12);
  });

  it("rejects keys with Bearer prefix before sending", async () => {
    process.env.OPENROUTER_API_KEY = "Bearer sk-or-v1-test";
    process.env.OPENROUTER_MODEL = "anthropic/claude-3.5-haiku";
    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response("{}", { status: 200 });
    }) as typeof globalThis.fetch;

    await assert.rejects(
      () =>
        openRouterChatCompletion({
          messages: [{ role: "user", content: "x" }],
          temperature: 0.2,
          maxTokens: 16,
        }),
      /raw key only/,
    );
    assert.equal(called, false);
  });

  it("maps OpenRouter 401 to actionable configuration guidance", async () => {
    process.env.OPENROUTER_API_KEY = "sk-or-v1-test";
    process.env.OPENROUTER_MODEL = "anthropic/claude-3.5-haiku";
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: { message: "No auth" } }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })) as typeof globalThis.fetch;

    await assert.rejects(
      () =>
        openRouterChatCompletion({
          messages: [{ role: "user", content: "x" }],
          temperature: 0.2,
          maxTokens: 16,
        }),
      /OpenRouter rejected the API key.*OPENROUTER_API_KEY.*account credits.*model access.*shell env loading/,
    );
  });
});
