import OpenAI from "openai";

let _client: OpenAI | null = null;

function resolveOpenAIApiKey(): string | undefined {
  const k =
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim();
  return k || undefined;
}

/** True when a key is present; use to avoid constructing the SDK at module load or boot. */
export function isOpenAIConfigured(): boolean {
  return Boolean(resolveOpenAIApiKey());
}

/**
 * Shared OpenAI client for server routes.
 * Lazily constructs only when called and a key exists (supports AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY).
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = resolveOpenAIApiKey();
  if (!apiKey) {
    throw new Error(
      "OpenAI is not configured: set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY",
    );
  }
  if (!_client) {
    _client = new OpenAI({
      apiKey,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      timeout: 30_000,
    });
  }
  return _client;
}
