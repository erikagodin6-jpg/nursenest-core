import assert from "node:assert/strict";
import test from "node:test";
import { NextResponse } from "next/server";
import { postAdminAiAssistant, type AdminAiAssistantRouteDeps } from "@/app/api/admin/ai-assistant/route-handler";

test("POST /api/admin/ai-assistant blocks non-admin callers", async () => {
  const deps: AdminAiAssistantRouteDeps = {
    requireAdmin: async () => ({
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }),
    adminAiGenerationHttpBlock: () => null,
    openAiChatCompletion: async () => ({ content: "unused" }),
  };

  const res = await postAdminAiAssistant(
    new Request("http://localhost/api/admin/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskType: "draft_blog_post", input: "Test" }),
    }),
    deps,
  );

  assert.equal(res.status, 403);
});

test("POST /api/admin/ai-assistant requires OpenAI configuration", async () => {
  const deps: AdminAiAssistantRouteDeps = {
    requireAdmin: async () => ({
      ok: true as const,
      admin: { userId: "admin_123", role: "ADMIN", tier: "super" },
    }),
    adminAiGenerationHttpBlock: () =>
      NextResponse.json(
        {
          error: "AI admin generation is misconfigured.",
          hint: "AI generation disabled: no OpenAI API key configured (set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY on this server process).",
        },
        { status: 503 },
      ),
    openAiChatCompletion: async () => ({ content: "unused" }),
  };

  const res = await postAdminAiAssistant(
    new Request("http://localhost/api/admin/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskType: "draft_blog_post", input: "Test" }),
    }),
    deps,
  );
  const json = (await res.json()) as { error?: string; hint?: string };

  assert.equal(res.status, 503);
  assert.match(String(json.hint ?? ""), /OPENAI_API_KEY/);
});

test("POST /api/admin/ai-assistant returns draft-only output for admins", async () => {
  const deps: AdminAiAssistantRouteDeps = {
    requireAdmin: async () => ({
      ok: true as const,
      admin: { userId: "admin_123", role: "ADMIN", tier: "super" },
    }),
    adminAiGenerationHttpBlock: () => null,
    openAiChatCompletion: async () => ({
      content: "Here is a support reply the admin can review.",
      totalTokens: 222,
    }),
  };

  const res = await postAdminAiAssistant(
    new Request("http://localhost/api/admin/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskType: "draft_support_reply", input: "Subscriber asked for a refund." }),
    }),
    deps,
  );
  const json = (await res.json()) as { ok?: boolean; output?: string; notice?: string };

  assert.equal(res.status, 200);
  assert.equal(json.ok, true);
  assert.match(String(json.output ?? ""), /^Draft:/);
  assert.match(String(json.notice ?? ""), /Draft only/i);
});
