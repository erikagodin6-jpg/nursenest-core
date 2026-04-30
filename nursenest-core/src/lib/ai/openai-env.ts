import { getOpenAiApiKeyFromRuntimeEnv } from "@/lib/env/runtime-env";

/** Default for blog + RN lesson expansion when no env overrides are set. */
export const OPENAI_DEFAULT_BLOG_LESSON_MODEL = "gpt-4.1-mini";

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

export type AssertOpenAiKeyOptions = {
  /** When `"blog"`, accepts `BLOG_OPENAI_API_KEY` before shared integrations / legacy keys. */
  pipeline?: "blog" | "default";
};

export function assertOpenAiKeyConfigured(
  options?: AssertOpenAiKeyOptions,
): { ok: true } | { ok: false; message: string } {
  const key = options?.pipeline === "blog" ? getBlogOpenAiApiKey() : getOpenAiApiKey();
  if (!key) {
    return {
      ok: false,
      message:
        options?.pipeline === "blog"
          ? "BLOG_OPENAI_API_KEY (or AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY) is not configured."
          : "AI_INTEGRATIONS_OPENAI_API_KEY (or OPENAI_API_KEY) is not configured.",
    };
  }
  return { ok: true };
}
