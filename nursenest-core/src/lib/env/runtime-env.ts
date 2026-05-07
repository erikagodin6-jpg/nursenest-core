/**
 * Centralized reads for admin AI + AI provider key env.
 * All `AI_ADMIN_GENERATION_ENABLED` / `AI_PROVIDER` / provider API key
 * access for server logic should go through this module — not scattered `process.env` reads.
 *
 * **No module-level cache:** values are read from `process.env` on every call so the gate
 * always matches the current runtime environment (DigitalOcean/Vercel inject vars at process
 * start; a stale snapshot would otherwise stick until restart). Bracket `process.env[key]`
 * avoids bundler static replacement of `process.env.FOO` for unknown keys.
 */
import { parseBooleanEnv } from "@/lib/env/parse-boolean-env";

export type AdminAiOpenAiRuntimeSnapshot = {
  /** Parsed opt-in flag (true/1/yes/on, trimmed, case-insensitive). */
  adminAiGenerationFlagParsed: boolean;
  /** Either integrations or legacy key is non-empty after trim. */
  hasOpenAiKey: boolean;
  /** Active provider has a usable key (OpenRouter when AI_PROVIDER=openrouter, otherwise OpenAI). */
  hasAiProviderKey: boolean;
  /** Resolved key for outbound calls (integrations preferred). Null if absent. */
  openAiApiKey: string | null;
  /** Raw `process.env.AI_ADMIN_GENERATION_ENABLED` (undefined if unset). */
  rawAiAdminGenerationEnabled: string | undefined;
  aiIntegrationsOpenAiKeyPresent: boolean;
  legacyOpenAiKeyPresent: boolean;
  openRouterApiKeyPresent: boolean;
  aiProvider: "openai" | "openrouter" | "gemini";
};

function readAdminAiEnvString(key: string): string | undefined {
  return process.env[key];
}

function buildAdminAiOpenAiRuntimeSnapshot(): AdminAiOpenAiRuntimeSnapshot {
  const rawAiAdminGenerationEnabled = readAdminAiEnvString("AI_ADMIN_GENERATION_ENABLED");
  const integrationsRaw = readAdminAiEnvString("AI_INTEGRATIONS_OPENAI_API_KEY");
  const legacyRaw = readAdminAiEnvString("OPENAI_API_KEY");
  const openRouterRaw = readAdminAiEnvString("OPENROUTER_API_KEY");
  const aiProviderRaw = readAdminAiEnvString("AI_PROVIDER")?.trim().toLowerCase();
  const integrations = integrationsRaw?.trim() || null;
  const legacy = legacyRaw?.trim() || null;
  const openRouter = openRouterRaw?.trim() || null;
  const aiIntegrationsOpenAiKeyPresent = Boolean(integrations);
  const legacyOpenAiKeyPresent = Boolean(legacy);
  const openRouterApiKeyPresent = Boolean(openRouter);
  const aiProvider = aiProviderRaw === "openrouter" || aiProviderRaw === "gemini" ? aiProviderRaw : "openai";
  const hasOpenAiKey = aiIntegrationsOpenAiKeyPresent || legacyOpenAiKeyPresent;
  const hasAiProviderKey = aiProvider === "openrouter" ? openRouterApiKeyPresent : hasOpenAiKey;
  return {
    rawAiAdminGenerationEnabled,
    adminAiGenerationFlagParsed: parseBooleanEnv(rawAiAdminGenerationEnabled),
    aiIntegrationsOpenAiKeyPresent,
    legacyOpenAiKeyPresent,
    openRouterApiKeyPresent,
    aiProvider,
    hasOpenAiKey,
    hasAiProviderKey,
    openAiApiKey: integrations || legacy || null,
  };
}

/** Reads current `process.env` every call (no cross-request cache). */
export function getAdminAiOpenAiRuntimeSnapshot(): AdminAiOpenAiRuntimeSnapshot {
  return buildAdminAiOpenAiRuntimeSnapshot();
}

/** @internal No-op at runtime (reads are always fresh); kept so tests that reset stay valid. */
export function resetRuntimeEnvSnapshotForTests(): void {
  /* intentionally empty — was used to clear a removed module-level cache */
}

export function isAdminAiEnabled(): boolean {
  return getAdminAiOpenAiRuntimeSnapshot().adminAiGenerationFlagParsed;
}

export function hasOpenAiKey(): boolean {
  return getAdminAiOpenAiRuntimeSnapshot().hasOpenAiKey;
}

export function hasAiProviderKey(): boolean {
  return getAdminAiOpenAiRuntimeSnapshot().hasAiProviderKey;
}

export function getOpenAiApiKeyFromRuntimeEnv(): string | null {
  return getAdminAiOpenAiRuntimeSnapshot().openAiApiKey;
}
