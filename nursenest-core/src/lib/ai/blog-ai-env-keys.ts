/**
 * Canonical env key names and **non-secret** presence helpers for blog / admin generation.
 *
 * Expected DigitalOcean runtime names:
 * - `AI_ADMIN_GENERATION_ENABLED` enables admin AI generation (`true`, `1`, `yes`, `on`).
 * - `BLOG_AI_PROVIDER` selects the blog provider (`openrouter`, `openai`, or `gemini`).
 * - `BLOG_OPENROUTER_MODEL` overrides OpenRouter for blog generation; `OPENROUTER_MODEL` is the shared fallback.
 * - Keys are read as booleans only in diagnostics: `OPENROUTER_API_KEY` / `BLOG_OPENROUTER_API_KEY`,
 *   `BLOG_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_API_KEY` / `OPENAI_API_KEY`, and `GEMINI_API_KEY`.
 *
 * Common DO misconfigurations this module exposes without secrets:
 * - Typo flag `AI_ADMIN_GENERation` instead of `AI_ADMIN_GENERATION_ENABLED` (accepted as a legacy alias).
 * - Blog-scoped OpenRouter key set as `BLOG_OPENROUTER_API_KEY` while older gate checks looked only for
 *   `OPENROUTER_API_KEY`.
 *
 * Call sites that previously read only `process.env.OPENROUTER_API_KEY` should use
 * {@link getOpenRouterApiKeyTrimmedFromEnv} so both keys are honored consistently.
 */

function stripCrLf(s: string): string {
  return s.replace(/\r|\n/g, "");
}

/** Trimmed secret material for outbound calls, or empty string if unset. */
export function getOpenRouterApiKeyTrimmedFromEnv(): string {
  const a = stripCrLf(process.env.OPENROUTER_API_KEY ?? "").trim();
  if (a.length > 0) return a;
  return stripCrLf(process.env.BLOG_OPENROUTER_API_KEY ?? "").trim();
}

export function openRouterApiKeyEnvPresent(): boolean {
  return getOpenRouterApiKeyTrimmedFromEnv().length > 0;
}

/** Presence flags only — safe for admin diagnostics and logs. */
export function getBlogAiRelatedEnvKeyPresence(): {
  AI_ADMIN_GENERATION_ENABLED: boolean;
  AI_ADMIN_GENERation: boolean;
  OPENROUTER_API_KEY: boolean;
  BLOG_OPENROUTER_API_KEY: boolean;
  OPENROUTER_MODEL: boolean;
  BLOG_OPENROUTER_MODEL: boolean;
  BLOG_OPENAI_API_KEY: boolean;
  AI_INTEGRATIONS_OPENAI_API_KEY: boolean;
  OPENAI_API_KEY: boolean;
  GEMINI_API_KEY: boolean;
  GEMINI_MODEL: boolean;
  BLOG_GEMINI_MODEL: boolean;
  BLOG_AI_PROVIDER: boolean;
  AI_PROVIDER: boolean;
} {
  return {
    AI_ADMIN_GENERATION_ENABLED: Boolean(process.env.AI_ADMIN_GENERATION_ENABLED?.trim()),
    AI_ADMIN_GENERation: Boolean(process.env.AI_ADMIN_GENERation?.trim()),
    OPENROUTER_API_KEY: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
    BLOG_OPENROUTER_API_KEY: Boolean(process.env.BLOG_OPENROUTER_API_KEY?.trim()),
    OPENROUTER_MODEL: Boolean(process.env.OPENROUTER_MODEL?.trim()),
    BLOG_OPENROUTER_MODEL: Boolean(process.env.BLOG_OPENROUTER_MODEL?.trim()),
    BLOG_OPENAI_API_KEY: Boolean(process.env.BLOG_OPENAI_API_KEY?.trim()),
    AI_INTEGRATIONS_OPENAI_API_KEY: Boolean(process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim()),
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY?.trim()),
    GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY?.trim()),
    GEMINI_MODEL: Boolean(process.env.GEMINI_MODEL?.trim()),
    BLOG_GEMINI_MODEL: Boolean(process.env.BLOG_GEMINI_MODEL?.trim()),
    BLOG_AI_PROVIDER: Boolean(process.env.BLOG_AI_PROVIDER?.trim()),
    AI_PROVIDER: Boolean(process.env.AI_PROVIDER?.trim()),
  };
}
