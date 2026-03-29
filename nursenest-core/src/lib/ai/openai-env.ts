/** Shared OpenAI-compatible HTTP config (server-only). */
export function getOpenAiChatModel(): string {
  return process.env.AI_OPENAI_MODEL?.trim() || process.env.AI_ADMIN_MODEL?.trim() || "gpt-4o-mini";
}

export function assertOpenAiKeyConfigured(): { ok: true } | { ok: false; message: string } {
  const key = process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim();
  if (!key) {
    return { ok: false, message: "AI_INTEGRATIONS_OPENAI_API_KEY is not configured." };
  }
  return { ok: true };
}
