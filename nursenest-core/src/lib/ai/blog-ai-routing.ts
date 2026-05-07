/**
 * Blog / marketing content chat routing (OpenAI-compatible path).
 * `BLOG_AI_PROVIDER` wins over `AI_PROVIDER` when set to a known value.
 */

export type BlogAiChatProvider = "openai" | "openrouter" | "gemini" | "unconfigured";
export type AiChatProvider = "openai" | "openrouter" | "gemini";

function normalizedBlogProvider(): string | undefined {
  const raw = process.env.BLOG_AI_PROVIDER?.trim().toLowerCase();
  return raw && raw.length > 0 ? raw : undefined;
}

function normalizedAiProvider(): string | undefined {
  const raw = process.env.AI_PROVIDER?.trim().toLowerCase();
  return raw && raw.length > 0 ? raw : undefined;
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
  if (process.env.OPENROUTER_API_KEY?.trim()) {
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
