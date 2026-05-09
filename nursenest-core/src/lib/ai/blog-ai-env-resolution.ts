/**
 * Blog admin AI — **single documented surface** for operator-facing diagnostics and provider resolution.
 *
 * ## Provider id (`resolveBlogAiProvider`)
 * Same as {@link getBlogAiChatProvider}: explicit `BLOG_AI_PROVIDER` (openai|openrouter|gemini) wins;
 * otherwise OpenRouter when any OpenRouter key is present ({@link getOpenRouterApiKeyTrimmedFromEnv});
 * otherwise `AI_PROVIDER`; else `unconfigured`.
 *
 * ## OpenRouter API key precedence
 * See `@/lib/ai/blog-ai-env-keys` — `OPENROUTER_API_KEY` then `BLOG_OPENROUTER_API_KEY`.
 *
 * ## Admin generation flag
 * Canonical `AI_ADMIN_GENERATION_ENABLED`; accepted typo alias `AI_ADMIN_GENERation` when canonical is absent
 * (see `@/lib/env/runtime-env`).
 */
import { getAdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";
import { getBlogAiRelatedEnvKeyPresence } from "@/lib/ai/blog-ai-env-keys";
import { resolveBlogAiProvider } from "@/lib/ai/blog-ai-routing";
import { getBlogGenerationModelLabelForLogs } from "@/lib/ai/openai-env";

export { resolveBlogAiProvider } from "@/lib/ai/blog-ai-routing";

/** Serializable, staff-safe snapshot for `GET /api/admin/blog/ai-env-diagnostics`. */
export function getBlogAiRuntimeDiagnostics() {
  const blogGate = getAdminAiGenerationGate({ pipeline: "blog" });
  const keys = getBlogAiRelatedEnvKeyPresence();
  return {
    nodeEnv: process.env.NODE_ENV ?? null,
    aiGenerationFlagEnabled: blogGate.flagEnabled,
    aiGenerationRunnable: blogGate.runnable,
    aiGenerationMode: blogGate.mode,
    providerSelected: resolveBlogAiProvider(),
    modelSelected: getBlogGenerationModelLabelForLogs(),
    missingEnvVarNames: blogGate.missingEnvVarNames ?? [],
    diagnostics: {
      ...keys,
      aiAdminGenerationFlagSourceKey: blogGate.diagnostics.aiAdminGenerationFlagSourceKey,
      openRouterResolvedPresent: blogGate.diagnostics.openRouterApiKeyPresent,
      openRouterCanonicalKeyPresent: blogGate.diagnostics.openRouterCanonicalKeyPresent,
      blogOpenRouterKeyPresent: blogGate.diagnostics.blogOpenRouterKeyPresent,
      openAiIntegrationsPresent: blogGate.diagnostics.aiIntegrationsOpenAiKeyPresent,
      openAiLegacyPresent: blogGate.diagnostics.legacyOpenAiKeyPresent,
    },
  };
}
