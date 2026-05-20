import assert from "node:assert/strict";
import test from "node:test";
import { appendOpenRouterHintIfQuotaError } from "@/lib/ai/openai-quota-hint";

test("appendOpenRouterHintIfQuotaError adds OpenRouter setup guidance for insufficient quota", () => {
  const error = appendOpenRouterHintIfQuotaError(
    new Error('OpenAI HTTP 429: {"error":{"code":"insufficient_quota"}}'),
  );

  assert.match(error.message, /AI_PROVIDER=openrouter/);
  assert.match(error.message, /OPENROUTER_API_KEY/);
});

test("appendOpenRouterHintIfQuotaError leaves unrelated errors unchanged", () => {
  const error = appendOpenRouterHintIfQuotaError(new Error("OpenAI HTTP 500"));
  assert.equal(error.message, "OpenAI HTTP 500");
});
