/**
 * Blog / marketing content chat routing (OpenAI-compatible path).
 * `BLOG_AI_PROVIDER` wins over `AI_PROVIDER` when set to a known value.
 */

export type BlogAiChatProvider = "openai" | "openrouter" | "gemini" | "unconfigured";
export type AiChatProvider = "openai" | "openrouter" | "gemini";

/** Trim + strip BOM / stray CR/LF so platform-specific env files cannot break routing. */
export function sanitizeEnvProviderToken(raw: string | undefined): string | undefined {
  if (raw == null) return undefined;
  const t = raw
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/\r|\n/g, "")
    .trim()
    .toLowerCase();
  return t.length > 0 ? t : undefined;
}

/** Non-empty secret/env value after trimming (never lowercase — API keys must stay raw). */
export function envSecretLooksPresent(raw: string | undefined): boolean {
  if (raw == null) return false;
  return raw.replace(/\r|\n/g, "").trim().length > 0;
}

function normalizedBlogProvider(): string | undefined {
  return sanitizeEnvProviderToken(process.env.BLOG_AI_PROVIDER);
}

function normalizedAiProvider(): string | undefined {
  return sanitizeEnvProviderToken(process.env.AI_PROVIDER);
}

/**
 * When operators set `BLOG_AI_PROVIDER=openrouter`, routing must resolve to OpenRouter or fail loudly
 * (never silently fall through to OpenAI).
 */
export function assertBlogAiExplicitOpenRouterHonored(provider: BlogAiChatProvider): void {
  const explicit = sanitizeEnvProviderToken(process.env.BLOG_AI_PROVIDER);
  if (explicit === "openrouter" && provider !== "openrouter") {
    throw new Error(
      `[BlogAI] BLOG_AI_PROVIDER=openrouter but resolved provider=${provider}. Ensure OPENROUTER_API_KEY is set and loaded in this Node/runtime process.`,
    );
  }
}

/** Global provider for OpenAI-compatible chat callers outside blog-specific routes. */
export function getAiChatProvider(): AiChatProvider {
  const ai = normalizedAiProvider();
  if (ai === "openrouter") return "openrouter";
  if (ai === "gemini") return "gemini";
  return "openai";
}

/** Blog chat provider for `openAiChatCompletion({ useBlogOpenAiApiKey: true })`. */
export function getBlogAiChatProvider(): BlogAiChatProvider {
  const blog = normalizedBlogProvider();
  if (blog === "openrouter" || blog === "gemini" || blog === "openai") {
    return blog;
  }
  if (envSecretLooksPresent(process.env.OPENROUTER_API_KEY)) {
    return "openrouter";
  }
  const ai = normalizedAiProvider();
  if (ai === "openrouter") return "openrouter";
  if (ai === "gemini") return "gemini";
  if (ai === "openai") return "openai";
  return "unconfigured";
}

/** True when blog chat completions should use OpenRouter (requires OPENROUTER_API_KEY). */
export function blogChatUsesOpenRouter(): boolean {
  return getBlogAiChatProvider() === "openrouter";
}

/** True when general OpenAI-compatible chat completions should use OpenRouter. */
export function aiChatUsesOpenRouter(): boolean {
  return getAiChatProvider() === "openrouter";
}
