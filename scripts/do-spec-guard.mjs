#!/usr/bin/env node
/**
 * DigitalOcean app-spec guard: validates a parsed spec contains all required runtime env var names.
 *
 * WHY: When `doctl apps update APP_ID --spec file.yaml` runs, DigitalOcean removes any secret key
 * that is absent from the spec. A partial or generated spec silently deletes secrets. This guard
 * blocks that by failing loudly before any update command can run.
 *
 * Import as a module from other scripts, or run directly:
 *   node scripts/do-spec-guard.mjs [path/to/spec.yaml]
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, "..");
export const CANONICAL_SPEC_PATH = path.join(ROOT, ".do", "app-nursenest-core-next.yaml");

/**
 * Required runtime env var NAMES that must be present in any spec that is pushed to DigitalOcean.
 * A missing name means that key gets deleted from the live app on next `doctl apps update`.
 * Values/secrets are never checked here — only that the key entry exists.
 */
export const REQUIRED_RUNTIME_ENV_KEYS = Object.freeze([
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "AUTH_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  // ECG module publish flags — must remain set after any spec update.
  "ENABLE_ECG_MODULE",
  "NEXT_PUBLIC_ENABLE_ECG_MODULE",
  "ENABLE_ADVANCED_ECG_MODULE",
  "ALLOW_ECG_EARLY_ACCESS_CHECKOUT",
  // NP subscription Stripe price IDs (canonical keys, required for NP checkout).
  "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",
  // Advanced ECG add-on price ID — separate from base subscription matrix.
  "STRIPE_PRICE_ADVANCED_ECG",
]);

/** At least one of these must be present (AI provider key). */
export const REQUIRED_AI_KEY_GROUP = Object.freeze([
  "AI_INTEGRATIONS_OPENAI_API_KEY",
  "OPENAI_API_KEY",
  "OPENROUTER_API_KEY",
]);

/** Expected web component run_command. Must not change without explicit sign-off. */
export const EXPECTED_RUN_COMMAND = "node scripts/start-standalone.mjs";

/** Expected web component source_dir. Must not change without explicit sign-off. */
export const EXPECTED_SOURCE_DIR = ".";

const RUNTIME_SCOPES = new Set(["RUN_TIME", "RUN_AND_BUILD_TIME"]);

/**
 * Collect all env var entries that are visible at runtime from a parsed spec.
 * Only includes services[].envs entries with scope RUN_TIME or RUN_AND_BUILD_TIME.
 * Returns Map<key, entry>.
 */
export function collectRuntimeEnvMap(spec) {
  const envMap = new Map();
  const services = Array.isArray(spec?.services) ? spec.services : [];
  for (const svc of services) {
    for (const entry of Array.isArray(svc?.envs) ? svc.envs : []) {
      const key = typeof entry?.key === "string" ? entry.key.trim() : "";
      if (!key) continue;
      const scope = entry.scope ?? "RUN_TIME";
      if (!RUNTIME_SCOPES.has(scope)) continue;
      envMap.set(key, entry);
    }
  }
  return envMap;
}

/**
 * Validate a parsed spec object against the required env var contract.
 * @returns {{ ok: boolean, failures: string[], warnings: string[] }}
 */
export function validateSpec(spec) {
  const failures = [];
  const warnings = [];
  const envMap = collectRuntimeEnvMap(spec);

  // Required env keys
  for (const key of REQUIRED_RUNTIME_ENV_KEYS) {
    if (!envMap.has(key)) {
      failures.push(
        `MISSING required env key "${key}" — a doctl apps update with this spec WILL DELETE IT from the live app.`,
      );
    }
  }

  // AI provider key group (at least one required)
  const hasAiKey = REQUIRED_AI_KEY_GROUP.some((k) => envMap.has(k));
  if (!hasAiKey) {
    warnings.push(
      `No AI provider key found (checked: ${REQUIRED_AI_KEY_GROUP.join(", ")}). AI features will be disabled at runtime.`,
    );
  }

  // Web component structural checks
  const services = Array.isArray(spec?.services) ? spec.services : [];
  const web = services.find((s) => s.name === "web");
  if (!web) {
    failures.push('Missing "web" service component — the spec must contain a service named "web".');
  } else {
    if (web.source_dir !== EXPECTED_SOURCE_DIR) {
      failures.push(
        `source_dir is "${web.source_dir}" but must be "${EXPECTED_SOURCE_DIR}". Changing source_dir breaks the standalone startup path.`,
      );
    }
    if (web.run_command !== EXPECTED_RUN_COMMAND) {
      failures.push(
        `run_command is "${web.run_command}" but must be "${EXPECTED_RUN_COMMAND}". Changing run_command bypasses the bootstrap proxy.`,
      );
    }
  }

  return { ok: failures.length === 0, failures, warnings };
}

/**
 * Parse a YAML spec file from disk and validate it.
 * @returns {{ ok: boolean, failures: string[], warnings: string[], spec: object|null }}
 */
export function validateSpecFile(specPath) {
  if (!existsSync(specPath)) {
    return {
      ok: false,
      failures: [`Spec file not found: ${specPath}`],
      warnings: [],
      spec: null,
    };
  }

  let spec;
  try {
    spec = yaml.load(readFileSync(specPath, "utf8"));
  } catch (error) {
    return {
      ok: false,
      failures: [`Failed to parse spec YAML at ${specPath}: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
      spec: null,
    };
  }

  const { ok, failures, warnings } = validateSpec(spec);
  return { ok, failures, warnings, spec };
}

// CLI mode
const isMain =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const specPath = process.argv[2] ?? CANONICAL_SPEC_PATH;
  const { ok, failures, warnings } = validateSpecFile(specPath);

  for (const w of warnings) {
    console.warn(`[do-spec-guard] WARN: ${w}`);
  }
  if (!ok) {
    for (const f of failures) {
      console.error(`[do-spec-guard] FAIL: ${f}`);
    }
    process.exit(1);
  }
  console.log(`[do-spec-guard] OK: ${path.relative(ROOT, specPath)} passes all required env protection checks.`);
  process.exit(0);
}
