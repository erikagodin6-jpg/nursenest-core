/**
 * Centralized reads for admin AI + OpenAI API key env (single snapshot per process).
 * All `AI_ADMIN_GENERATION_ENABLED` / `AI_INTEGRATIONS_OPENAI_API_KEY` / `OPENAI_API_KEY`
 * access for server logic should go through this module — not scattered `process.env` reads.
 */
import { parseBooleanEnv } from "@/lib/env/parse-boolean-env";

export type AdminAiOpenAiRuntimeSnapshot = {
  /** Parsed opt-in flag (true/1/yes/on, trimmed, case-insensitive). */
  adminAiGenerationFlagParsed: boolean;
  /** Either integrations or legacy key is non-empty after trim. */
  hasOpenAiKey: boolean;
  /** Resolved key for outbound calls (integrations preferred). Null if absent. */
  openAiApiKey: string | null;
  /** Raw `process.env.AI_ADMIN_GENERATION_ENABLED` (undefined if unset). */
  rawAiAdminGenerationEnabled: string | undefined;
  aiIntegrationsOpenAiKeyPresent: boolean;
  legacyOpenAiKeyPresent: boolean;
};

let cachedSnapshot: AdminAiOpenAiRuntimeSnapshot | null = null;

function buildAdminAiOpenAiRuntimeSnapshot(): AdminAiOpenAiRuntimeSnapshot {
  const rawAiAdminGenerationEnabled = process.env.AI_ADMIN_GENERATION_ENABLED;
  const integrations = process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() || null;
  const legacy = process.env.OPENAI_API_KEY?.trim() || null;
  const aiIntegrationsOpenAiKeyPresent = Boolean(integrations);
  const legacyOpenAiKeyPresent = Boolean(legacy);
  return {
    rawAiAdminGenerationEnabled,
    adminAiGenerationFlagParsed: parseBooleanEnv(rawAiAdminGenerationEnabled),
    aiIntegrationsOpenAiKeyPresent,
    legacyOpenAiKeyPresent,
    hasOpenAiKey: aiIntegrationsOpenAiKeyPresent || legacyOpenAiKeyPresent,
    openAiApiKey: integrations || legacy || null,
  };
}

/** Single read path; safe to call from any server module. */
export function getAdminAiOpenAiRuntimeSnapshot(): AdminAiOpenAiRuntimeSnapshot {
  if (!cachedSnapshot) cachedSnapshot = buildAdminAiOpenAiRuntimeSnapshot();
  return cachedSnapshot;
}

/** @internal Tests that mutate `process.env` must reset the cache. */
export function resetRuntimeEnvSnapshotForTests(): void {
  cachedSnapshot = null;
}

export function isAdminAiEnabled(): boolean {
  return getAdminAiOpenAiRuntimeSnapshot().adminAiGenerationFlagParsed;
}

export function hasOpenAiKey(): boolean {
  return getAdminAiOpenAiRuntimeSnapshot().hasOpenAiKey;
}

export function getOpenAiApiKeyFromRuntimeEnv(): string | null {
  return getAdminAiOpenAiRuntimeSnapshot().openAiApiKey;
}
