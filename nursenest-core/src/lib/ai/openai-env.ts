import { aiChatUsesOpenRouter, blogChatUsesOpenRouter, getBlogAiChatProvider } from "@/lib/ai/blog-ai-routing";
import { getOpenAiApiKeyFromRuntimeEnv } from "@/lib/env/runtime-env";

/** Default for blog + RN lesson expansion when no env overrides are set. */
export const OPENAI_DEFAULT_BLOG_LESSON_MODEL = "gpt-4.1-mini";

/** Default OpenRouter slug when `OPENROUTER_MODEL` and `BLOG_OPENROUTER_MODEL` are both unset. */
export const OPENROUTER_DEFAULT_CHAT_MODEL = "openai/gpt-4o-mini";

/** Public catalog for choosing a valid model slug (blog + admin diagnostics). */
export const OPENROUTER_MODELS_URL = "https://openrouter.ai/models";

/**
 * True when an error string indicates OpenRouter rejected the configured model slug (404 / no route / no endpoints).
 * Do not treat as a transient throttle class error.
 */
export function openRouterErrorIndicatesInvalidModelSlug(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("could not route this model") ||
    m.includes("no endpoints") ||
    m.includes("no providers found") ||
    m.includes("no endpoints found") ||
    (m.includes("http 404") && m.includes("openrouter"))
  );
}

/**
 * Resolved model slug: `OPENROUTER_MODEL` → `BLOG_OPENROUTER_MODEL` → {@link OPENROUTER_DEFAULT_CHAT_MODEL}.
 */
export function resolveOpenRouterModelSlugFromEnv(): string {
  return (
    process.env.OPENROUTER_MODEL?.trim() ||
    process.env.BLOG_OPENROUTER_MODEL?.trim() ||
    OPENROUTER_DEFAULT_CHAT_MODEL
  );
}

/** Shared OpenAI-compatible HTTP config (server-only). */
export function getOpenAiChatModel(): string {
  return process.env.AI_OPENAI_MODEL?.trim() || process.env.AI_ADMIN_MODEL?.trim() || "gpt-4o-mini";
}

/**
 * Blog AI chat model: `BLOG_OPENAI_MODEL` → `AI_INTEGRATIONS_OPENAI_MODEL` → `gpt-4.1-mini`
 * ({@link OPENAI_DEFAULT_BLOG_LESSON_MODEL}). Scripts should log `Model: …` at startup using this value.
 */
export function getBlogOpenAiChatModel(): string {
  return (
    process.env.BLOG_OPENAI_MODEL?.trim() ||
    process.env.AI_INTEGRATIONS_OPENAI_MODEL?.trim() ||
    OPENAI_DEFAULT_BLOG_LESSON_MODEL
  );
}

/**
 * Model slug for OpenRouter blog chat.
 * Resolution: `OPENROUTER_MODEL` → `BLOG_OPENROUTER_MODEL` → {@link OPENROUTER_DEFAULT_CHAT_MODEL}.
 */
export function getBlogOpenRouterChatModel(): string {
  return resolveOpenRouterModelSlugFromEnv();
}

/** OpenRouter chat model for shared admin/content AI callers (same env resolution as blog). */
export function getOpenRouterChatModel(): string {
  return resolveOpenRouterModelSlugFromEnv();
}

/**
 * Lesson expansion / admin lesson AI: `LESSON_OPENAI_MODEL` → `AI_INTEGRATIONS_OPENAI_MODEL` →
 * `gpt-4.1-mini` ({@link OPENAI_DEFAULT_BLOG_LESSON_MODEL}). Scripts should log `Model: …` at startup using this value.
 */
export function getLessonOpenAiChatModel(): string {
  return (
    process.env.LESSON_OPENAI_MODEL?.trim() ||
    process.env.AI_INTEGRATIONS_OPENAI_MODEL?.trim() ||
    OPENAI_DEFAULT_BLOG_LESSON_MODEL
  );
}

/** API key resolution (integrations key preferred) — reads `@/lib/env/runtime-env` snapshot. */
export function getOpenAiApiKey(): string | null {
  return getOpenAiApiKeyFromRuntimeEnv();
}

/**
 * Blog generation / repair: `BLOG_OPENAI_API_KEY` first, then shared integrations / legacy OpenAI key.
 */
export function getBlogOpenAiApiKey(): string | null {
  const blog = process.env.BLOG_OPENAI_API_KEY?.trim();
  if (blog) return blog;
  return getOpenAiApiKeyFromRuntimeEnv();
}

export function getOpenAiBaseUrl(): string {
  return process.env.AI_INTEGRATIONS_OPENAI_BASE_URL?.trim() || process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";
}

/** Model logged at CLI startup (OpenRouter vs OpenAI blog model). */
export function getBlogGenerationModelLabelForLogs(): string {
  const provider = getBlogAiChatProvider();
  if (provider === "openrouter") return getBlogOpenRouterChatModel();
  if (provider === "openai") return getBlogOpenAiChatModel();
  return "(unconfigured)";
}

/** Provider logged at CLI/runtime startup without exposing secrets. */
export function getBlogGenerationProviderLabelForLogs(): string {
  return getBlogAiChatProvider();
}

/**
 * Ensures shared integration key is populated for legacy helpers when using OpenAI for blog.
 * No-op when blog chat is routed to OpenRouter.
 */
export function primeBlogCliOpenAiIntegrationKey(): void {
  if (blogChatUsesOpenRouter()) return;
  const resolved =
    process.env.BLOG_OPENAI_API_KEY?.trim() || process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() || "";
  if (resolved) {
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY = resolved;
  }
}

export type AssertOpenAiKeyOptions = {
  /** When `"blog"`, accepts `BLOG_OPENAI_API_KEY` before shared integrations / legacy keys. */
  pipeline?: "blog" | "default";
};

export function assertOpenAiKeyConfigured(
  options?: AssertOpenAiKeyOptions,
): { ok: true } | { ok: false; message: string } {
  const expectsOpenRouter =
    (options?.pipeline === "blog" && blogChatUsesOpenRouter()) ||
    (options?.pipeline !== "blog" && aiChatUsesOpenRouter());
  if (expectsOpenRouter) {
    const orKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!orKey) {
      return {
        ok: false,
        message:
          options?.pipeline === "blog"
            ? "OPENROUTER_API_KEY is not configured (AI_PROVIDER=openrouter or BLOG_AI_PROVIDER=openrouter)."
            : "OPENROUTER_API_KEY is not configured (AI_PROVIDER=openrouter).",
      };
    }
    return { ok: true };
  }

  if (options?.pipeline === "blog" && getBlogAiChatProvider() === "unconfigured") {
    return {
      ok: false,
      message:
        "Blog AI provider is not configured. Set BLOG_AI_PROVIDER=openrouter with OPENROUTER_API_KEY, or explicitly set BLOG_AI_PROVIDER=openai with BLOG_OPENAI_API_KEY / AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY.",
    };
  }

  const key = options?.pipeline === "blog" ? getBlogOpenAiApiKey() : getOpenAiApiKey();
  if (!key) {
    return {
      ok: false,
      message:
        options?.pipeline === "blog"
          ? "BLOG_OPENAI_API_KEY (or AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY) is not configured. For OpenRouter, set AI_PROVIDER=openrouter (or BLOG_AI_PROVIDER=openrouter) and OPENROUTER_API_KEY."
          : "AI_INTEGRATIONS_OPENAI_API_KEY (or OPENAI_API_KEY) is not configured.",
    };
  }
  return { ok: true };
}
