/**
 * Admin AI batch tools — opt-in kill switch + AI provider key requirement (server-only).
 *
 * - `AI_ADMIN_GENERATION_ENABLED` — truthy when set to true/1/yes/on (case-insensitive, trimmed).
 * - Blog routes use `BLOG_AI_PROVIDER` / `OPENROUTER_API_KEY`; other routes use `AI_PROVIDER`.
 *
 * Env reads are centralized in `@/lib/env/runtime-env` (fresh `process.env` each evaluation — no
 * stale module cache). `getAdminAiGenerationGate` calls `validateRuntimeEnvOrThrow()` from
 * `@/lib/env/runtime-env-guard` first so missing critical env cannot fail silently.
 * **This module is the only gate** for enabled / misconfigured / disabled decisions.
 */
import { NextResponse } from "next/server";
import { getBlogAiChatProvider, type BlogAiChatProvider } from "@/lib/ai/blog-ai-routing";
import { parseBooleanEnv } from "@/lib/env/parse-boolean-env";
import {
  getAdminAiOpenAiRuntimeSnapshot,
  isAdminAiEnabled as isAdminAiEnabledFromRuntime,
} from "@/lib/env/runtime-env";
import { validateRuntimeEnvOrThrow } from "@/lib/env/runtime-env-guard";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type AdminAiGenerationMode = "enabled" | "disabled" | "misconfigured";
export type AdminAiGenerationPipeline = "default" | "blog";

/** How the generation flag env was interpreted (no raw values). */
export type AdminAiGenerationFlagClass = "unset" | "empty" | "enabled" | "disabled_explicit" | "unrecognized";

/** Serializable gate for admin layout + client islands (no secrets). */
export type AdminAiGenerationGate = {
  mode: AdminAiGenerationMode;
  /** True only when the env flag is true and the selected provider has an API key configured. */
  runnable: boolean;
  flagEnabled: boolean;
  aiProvider: BlogAiChatProvider;
  aiProviderKeyPresent: boolean;
  openAiKeyPresent: boolean;
  /** Short admin-facing explanation (safe to show in UI). */
  summaryLine: string;
  /** Redacted diagnostics for logs / support (never includes secret material). */
  diagnostics: {
    aiAdminGenerationEnvPresent: boolean;
    aiAdminGenerationFlagClass: AdminAiGenerationFlagClass;
    aiIntegrationsOpenAiKeyPresent: boolean;
    legacyOpenAiKeyPresent: boolean;
    openRouterApiKeyPresent: boolean;
    aiProvider: BlogAiChatProvider;
    /** Parsed boolean from flag after trim/case rules (for boot logs). */
    adminAiGenerationFlagNormalized: boolean;
  };
};

let loggedMisconfiguration = false;
let loggedVerboseGateSnapshot = false;

/** Opt-in: set `NN_ADMIN_AI_GATE_DIAGNOSTIC_LOG=1` for one extra redacted snapshot on first gate evaluation (often duplicates boot). */
function maybeLogVerboseAdminAiGateSnapshotOnce(gate: AdminAiGenerationGate): void {
  if (loggedVerboseGateSnapshot) return;
  if (!parseBooleanEnv(process.env["NN_ADMIN_AI_GATE_DIAGNOSTIC_LOG"])) return;
  loggedVerboseGateSnapshot = true;
  safeServerLog("admin_ai_generation", "env_gate_snapshot_verbose", {
    AI_ADMIN_GENERATION_ENABLED_present: gate.diagnostics.aiAdminGenerationEnvPresent,
    AI_ADMIN_GENERATION_ENABLED_flag_class: gate.diagnostics.aiAdminGenerationFlagClass,
    AI_ADMIN_GENERATION_ENABLED_normalized: gate.diagnostics.adminAiGenerationFlagNormalized,
    AI_INTEGRATIONS_OPENAI_API_KEY_present: gate.diagnostics.aiIntegrationsOpenAiKeyPresent,
    OPENAI_API_KEY_present: gate.diagnostics.legacyOpenAiKeyPresent,
    OPENROUTER_API_KEY_present: gate.diagnostics.openRouterApiKeyPresent,
    AI_PROVIDER: gate.diagnostics.aiProvider,
    final_gate_runnable: gate.runnable,
    final_gate_mode: gate.mode,
  });
}

function classifyAdminGenerationFlag(raw: string | undefined): AdminAiGenerationFlagClass {
  if (raw === undefined) return "unset";
  const t = raw.trim();
  if (!t) return "empty";
  if (parseBooleanEnv(raw)) return "enabled";
  const l = t.toLowerCase();
  if (l === "false" || l === "0" || l === "no" || l === "off") return "disabled_explicit";
  return "unrecognized";
}

function disabledFlagSummaryLine(flagClass: AdminAiGenerationFlagClass): string {
  switch (flagClass) {
    case "unset":
      return "AI generation disabled: generation flag is unset (AI_ADMIN_GENERATION_ENABLED is not defined on this server process).";
    case "empty":
      return "AI generation disabled: generation flag is empty (AI_ADMIN_GENERATION_ENABLED is blank after trim).";
    case "disabled_explicit":
      return "AI generation disabled: generation flag is explicitly off (false, 0, no, or off).";
    case "unrecognized":
      return "AI generation disabled: generation flag is not a recognized truthy value (use true, 1, yes, or on; trim whitespace).";
    default:
      return "AI generation disabled: generation flag is off.";
  }
}

function misconfiguredSummaryLine(provider: BlogAiChatProvider): string {
  if (provider === "openrouter") {
    return "AI generation disabled: OpenRouter is selected for this generation path but OPENROUTER_API_KEY is not configured on this server process.";
  }
  if (provider === "gemini") {
    return "AI generation disabled: AI_PROVIDER=gemini is not supported by the shared OpenAI-compatible admin generation routes; use Gemini-specific tools or set AI_PROVIDER=openai|openrouter.";
  }
  if (provider === "unconfigured") {
    return "AI generation disabled: blog AI provider is not configured. Set BLOG_AI_PROVIDER=openrouter with OPENROUTER_API_KEY, or explicitly set BLOG_AI_PROVIDER=openai with BLOG_OPENAI_API_KEY / AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY.";
  }
  return "AI generation disabled: no funded AI provider key configured (set AI_PROVIDER=openrouter with OPENROUTER_API_KEY, or set AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY).";
}

export function isAdminAiGenerationEnabled(): boolean {
  return isAdminAiEnabledFromRuntime();
}

/**
 * Full runtime gate: flag + key. Use for UI and for `adminAiGenerationHttpBlock`.
 * Evaluated at **call time** — reads live `process.env` via `@/lib/env/runtime-env` on each call.
 */
export function getAdminAiGenerationGate(options?: { pipeline?: AdminAiGenerationPipeline }): AdminAiGenerationGate {
  validateRuntimeEnvOrThrow();
  const snap = getAdminAiOpenAiRuntimeSnapshot();
  const pipeline = options?.pipeline ?? "default";
  const provider: BlogAiChatProvider = pipeline === "blog" ? getBlogAiChatProvider() : snap.aiProvider;
  const rawFlag = snap.rawAiAdminGenerationEnabled;
  const flagClass = classifyAdminGenerationFlag(rawFlag);
  const flagEnabled = flagClass === "enabled";
  const aiProviderKeyPresent =
    provider === "openrouter"
      ? snap.openRouterApiKeyPresent
      : provider === "openai"
        ? snap.hasOpenAiKey
        : false;
  const openAiKeyPresent = snap.hasOpenAiKey;

  const diagnostics: AdminAiGenerationGate["diagnostics"] = {
    aiAdminGenerationEnvPresent: rawFlag !== undefined,
    aiAdminGenerationFlagClass: flagClass,
    aiIntegrationsOpenAiKeyPresent: snap.aiIntegrationsOpenAiKeyPresent,
    legacyOpenAiKeyPresent: snap.legacyOpenAiKeyPresent,
    openRouterApiKeyPresent: snap.openRouterApiKeyPresent,
    aiProvider: provider,
    adminAiGenerationFlagNormalized: snap.adminAiGenerationFlagParsed,
  };

  let gate: AdminAiGenerationGate;

  if (!flagEnabled) {
    gate = {
      mode: "disabled",
      runnable: false,
      flagEnabled: false,
      aiProvider: provider,
      aiProviderKeyPresent,
      openAiKeyPresent,
      summaryLine: disabledFlagSummaryLine(flagClass),
      diagnostics,
    };
  } else if (!aiProviderKeyPresent || provider === "gemini" || provider === "unconfigured") {
    gate = {
      mode: "misconfigured",
      runnable: false,
      flagEnabled: true,
      aiProvider: provider,
      aiProviderKeyPresent: false,
      openAiKeyPresent,
      summaryLine: misconfiguredSummaryLine(provider),
      diagnostics,
    };
  } else {
    gate = {
      mode: "enabled",
      runnable: true,
      flagEnabled: true,
      aiProvider: provider,
      aiProviderKeyPresent: true,
      openAiKeyPresent,
      summaryLine: "AI generation enabled",
      diagnostics,
    };
  }

  maybeLogVerboseAdminAiGateSnapshotOnce(gate);
  return gate;
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
export function adminAiGenerationHttpBlock(options?: { pipeline?: AdminAiGenerationPipeline }): NextResponse | null {
  const gate = getAdminAiGenerationGate(options);
  if (gate.runnable) return null;

  const status = gate.mode === "misconfigured" ? 503 : 403;
  const code = gate.mode === "misconfigured" ? "ADMIN_AI_MISCONFIGURED" : "ADMIN_AI_DISABLED";
  const error =
    gate.mode === "disabled"
      ? "AI admin generation is disabled."
      : "AI admin generation is misconfigured.";
  const hint =
    gate.mode === "disabled"
      ? "Enable AI_ADMIN_GENERATION_ENABLED (true, 1, yes, or on) and configure a funded provider: AI_PROVIDER=openrouter with OPENROUTER_API_KEY, or OpenAI with AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY."
      : gate.summaryLine;

  return NextResponse.json({ error, code, hint, mode: gate.mode }, { status });
}
