/**
 * Admin AI batch tools — opt-in kill switch + OpenAI key requirement (server-only).
 *
 * - `AI_ADMIN_GENERATION_ENABLED` — truthy when set to true/1/yes/on (case-insensitive, trimmed).
 * - `AI_INTEGRATIONS_OPENAI_API_KEY` or `OPENAI_API_KEY` — required when enabled.
 *
 * Env reads are centralized in `@/lib/env/runtime-env` (fresh `process.env` each evaluation — no
 * stale module cache). **This module is the only gate** for enabled / misconfigured / disabled
 * decisions (`getAdminAiGenerationGate`).
 */
import { NextResponse } from "next/server";
import { parseBooleanEnv } from "@/lib/env/parse-boolean-env";
import {
  getAdminAiOpenAiRuntimeSnapshot,
  isAdminAiEnabled as isAdminAiEnabledFromRuntime,
} from "@/lib/env/runtime-env";
import { validateRuntimeEnvOrThrow } from "@/lib/env/runtime-env-guard";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type AdminAiGenerationMode = "enabled" | "disabled" | "misconfigured";

/** How the generation flag env was interpreted (no raw values). */
export type AdminAiGenerationFlagClass = "unset" | "empty" | "enabled" | "disabled_explicit" | "unrecognized";

/** Serializable gate for admin layout + client islands (no secrets). */
export type AdminAiGenerationGate = {
  mode: AdminAiGenerationMode;
  /** True only when the env flag is true and an OpenAI API key is configured. */
  runnable: boolean;
  flagEnabled: boolean;
  openAiKeyPresent: boolean;
  /** Short admin-facing explanation (safe to show in UI). */
  summaryLine: string;
  /** Redacted diagnostics for logs / support (never includes secret material). */
  diagnostics: {
    aiAdminGenerationEnvPresent: boolean;
    aiAdminGenerationFlagClass: AdminAiGenerationFlagClass;
    aiIntegrationsOpenAiKeyPresent: boolean;
    legacyOpenAiKeyPresent: boolean;
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

function misconfiguredSummaryLine(): string {
  return "AI generation disabled: no OpenAI API key configured (set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY on this server process).";
}

export function isAdminAiGenerationEnabled(): boolean {
  return isAdminAiEnabledFromRuntime();
}

/**
 * Full runtime gate: flag + key. Use for UI and for `adminAiGenerationHttpBlock`.
 * Evaluated at **call time** — reads live `process.env` via `@/lib/env/runtime-env` on each call.
 */
export function getAdminAiGenerationGate(): AdminAiGenerationGate {
  validateRuntimeEnvOrThrow();
  const snap = getAdminAiOpenAiRuntimeSnapshot();
  const rawFlag = snap.rawAiAdminGenerationEnabled;
  const flagClass = classifyAdminGenerationFlag(rawFlag);
  const flagEnabled = flagClass === "enabled";
  const openAiKeyPresent = snap.hasOpenAiKey;

  const diagnostics: AdminAiGenerationGate["diagnostics"] = {
    aiAdminGenerationEnvPresent: rawFlag !== undefined,
    aiAdminGenerationFlagClass: flagClass,
    aiIntegrationsOpenAiKeyPresent: snap.aiIntegrationsOpenAiKeyPresent,
    legacyOpenAiKeyPresent: snap.legacyOpenAiKeyPresent,
    adminAiGenerationFlagNormalized: snap.adminAiGenerationFlagParsed,
  };

  let gate: AdminAiGenerationGate;

  if (!flagEnabled) {
    gate = {
      mode: "disabled",
      runnable: false,
      flagEnabled: false,
      openAiKeyPresent,
      summaryLine: disabledFlagSummaryLine(flagClass),
      diagnostics,
    };
  } else if (!openAiKeyPresent) {
    gate = {
      mode: "misconfigured",
      runnable: false,
      flagEnabled: true,
      openAiKeyPresent: false,
      summaryLine: misconfiguredSummaryLine(),
      diagnostics,
    };
  } else {
    gate = {
      mode: "enabled",
      runnable: true,
      flagEnabled: true,
      openAiKeyPresent: true,
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
      ? "Enable AI_ADMIN_GENERATION_ENABLED (true, 1, yes, or on) and set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY."
      : gate.summaryLine;

  return NextResponse.json({ error, code, hint, mode: gate.mode }, { status });
}
