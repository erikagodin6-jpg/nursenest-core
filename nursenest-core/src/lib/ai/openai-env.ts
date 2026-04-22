import { getOpenAiApiKeyFromRuntimeEnv } from "@/lib/env/runtime-env";

/** Shared OpenAI-compatible HTTP config (server-only). */
export function getOpenAiChatModel(): string {
  return process.env.AI_OPENAI_MODEL?.trim() || process.env.AI_ADMIN_MODEL?.trim() || "gpt-4o-mini";
}

/** API key resolution (integrations key preferred) — reads `@/lib/env/runtime-env` snapshot. */
export function getOpenAiApiKey(): string | null {
  return getOpenAiApiKeyFromRuntimeEnv();
}

export function getOpenAiBaseUrl(): string {
  return process.env.AI_INTEGRATIONS_OPENAI_BASE_URL?.trim() || process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";
}

export function assertOpenAiKeyConfigured(): { ok: true } | { ok: false; message: string } {
  const key = getOpenAiApiKey();
  if (!key) {
    return { ok: false, message: "AI_INTEGRATIONS_OPENAI_API_KEY (or OPENAI_API_KEY) is not configured." };
  }
  return { ok: true };
}
