/**
 * Admin AI batch tools — opt-in kill switch + OpenAI key requirement (server-only).
 *
 * - `AI_ADMIN_GENERATION_ENABLED=true` — intent to allow admin-side generation routes.
 * - `AI_INTEGRATIONS_OPENAI_API_KEY` or `OPENAI_API_KEY` — required when enabled.
 */
import { NextResponse } from "next/server";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type AdminAiGenerationMode = "enabled" | "disabled" | "misconfigured";

/** Serializable gate for admin layout + client islands (no secrets). */
export type AdminAiGenerationGate = {
  mode: AdminAiGenerationMode;
  /** True only when the env flag is true and an OpenAI API key is configured. */
  runnable: boolean;
  flagEnabled: boolean;
  openAiKeyPresent: boolean;
  /** Short admin-facing explanation (safe to show in UI). */
  summaryLine: string;
};

let loggedMisconfiguration = false;

export function isAdminAiGenerationEnabled(): boolean {
  return process.env.AI_ADMIN_GENERATION_ENABLED === "true";
}

/**
 * Full runtime gate: flag + key. Use for UI and for `adminAiGenerationHttpBlock`.
 */
export function getAdminAiGenerationGate(): AdminAiGenerationGate {
  const flagEnabled = isAdminAiGenerationEnabled();
  const keyCheck = assertOpenAiKeyConfigured();
  const openAiKeyPresent = keyCheck.ok;

  if (!flagEnabled) {
    return {
      mode: "disabled",
      runnable: false,
      flagEnabled: false,
      openAiKeyPresent,
      summaryLine:
        "AI admin generation is disabled (AI_ADMIN_GENERATION_ENABLED is not set to true).",
    };
  }
  if (!openAiKeyPresent) {
    return {
      mode: "misconfigured",
      runnable: false,
      flagEnabled: true,
      openAiKeyPresent: false,
      summaryLine: keyCheck.message,
    };
  }
  return {
    mode: "enabled",
    runnable: true,
    flagEnabled: true,
    openAiKeyPresent: true,
    summaryLine: "AI admin generation is enabled and OpenAI credentials are present.",
  };
}

/** Log once per process when flag is on but keys are missing (avoids log spam on every request). */
export function warnAdminAiGenerationMisconfigurationIfNeeded(gate: AdminAiGenerationGate): void {
  if (gate.mode !== "misconfigured" || loggedMisconfiguration) return;
  loggedMisconfiguration = true;
  safeServerLog("admin_ai_generation", "misconfigured", {
    message: gate.summaryLine,
  });
}

/**
 * When admin AI generation cannot run, return a JSON error response; otherwise `null`.
 * Replaces separate flag + key checks on generation routes (consistent codes + status).
 */
export function adminAiGenerationHttpBlock(): NextResponse | null {
  const gate = getAdminAiGenerationGate();
  if (gate.runnable) return null;

  const status = gate.mode === "misconfigured" ? 503 : 403;
  const code = gate.mode === "misconfigured" ? "ADMIN_AI_MISCONFIGURED" : "ADMIN_AI_DISABLED";
  const error =
    gate.mode === "disabled"
      ? "AI admin generation is disabled."
      : "AI admin generation is misconfigured.";
  const hint =
    gate.mode === "disabled"
      ? "Set AI_ADMIN_GENERATION_ENABLED=true and configure AI_INTEGRATIONS_OPENAI_API_KEY (or OPENAI_API_KEY)."
      : gate.summaryLine;

  return NextResponse.json({ error, code, hint, mode: gate.mode }, { status });
}
