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
 *
 * SEE: docs/ops/digitalocean-deploy-governance.md
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, "..");

function requireInstalledDependency(specifier) {
  const candidates = [
    path.join(ROOT, "package.json"),
    path.join(ROOT, "nursenest-core", "package.json"),
    path.join(process.cwd(), "package.json"),
  ];
  for (const packageJsonPath of candidates) {
    if (!existsSync(packageJsonPath)) continue;
    try {
      return createRequire(packageJsonPath)(specifier);
    } catch (error) {
      if (error?.code !== "MODULE_NOT_FOUND") throw error;
    }
  }
  return createRequire(import.meta.url)(specifier);
}

const yaml = requireInstalledDependency("js-yaml");

/** The one and only spec file that may be used with doctl apps update. */
export const CANONICAL_SPEC_PATH = path.join(ROOT, ".do", "app-nursenest-core-next.yaml");

/**
 * Spec paths that must NEVER be used with doctl apps update.
 * These files are known to be incomplete and will delete production env vars if deployed.
 * Keyed by relative path from repo root → reason string.
 */
export const FORBIDDEN_SPEC_PATHS = Object.freeze({
  "nursenest-core/live-app-spec.yaml":
    "Dashboard export artifact — incomplete env vars, will wipe STRIPE_SECRET_KEY, DATABASE_URL, ECG flags, and others.",
  "nursenest-core/.do/app.yaml":
    "Stale duplicate — missing CRON_SECRET, SPACES_KEY, SPACES_SECRET and many price IDs.",
  ".do/app.yaml":
    'Legacy spec with wrong app name ("nursenest") and missing 50+ required env vars.',
});

/**
 * Required runtime env var NAMES that must be present in any spec pushed to DigitalOcean.
 * A missing name means that key gets deleted from the live app on next `doctl apps update`.
 * Values/secrets are never checked here — only that the key entry exists.
 *
 * RULE: When a new Stripe product or feature flag is added, add its env key here AND to
 * .do/app-nursenest-core-next.yaml before running doctl apps update.
 */
export const REQUIRED_RUNTIME_ENV_KEYS = Object.freeze([
  // ── Core auth + DB ───────────────────────────────────────────────────────
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "AUTH_URL",
  "NEXT_PUBLIC_APP_URL",

  // ── Stripe API keys ───────────────────────────────────────────────────────
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",

  // ── ECG module publish flags ──────────────────────────────────────────────
  "ENABLE_ECG_MODULE",
  "NEXT_PUBLIC_ENABLE_ECG_MODULE",
  "ENABLE_ADVANCED_ECG_MODULE",
  "ALLOW_ECG_EARLY_ACCESS_CHECKOUT",

  // ── Stripe price IDs: Advanced ECG ───────────────────────────────────────
  "STRIPE_PRICE_ADVANCED_ECG",

  // ── Stripe price IDs: NP (Nurse Practitioner / CNPLE) ─────────────────────
  "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",

  // ── Stripe price IDs: RN (NCLEX-RN) ──────────────────────────────────────
  "STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_1_YEAR_SUBSCRIPTION",

  // ── Stripe price IDs: RPN (REx-PN / NCLEX-PN Canada) ─────────────────────
  "STRIPE_PRICE_NURSENEST_RPN_1_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_YEARLY_SUBSCRIPTION",

  // ── Stripe price IDs: New Grad ────────────────────────────────────────────
  "STRIPE_PRICE_NEW_GRAD_MONTHLY",
  "STRIPE_PRICE_NEW_GRAD_6MONTH",
  "STRIPE_PRICE_NEW_GRAD_YEARLY",

  // ── Stripe price IDs: Allied Health (4 shared prices, all 7 careers) ─────
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_MONTHLY",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_3_MONTHS",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_YEARLY",

  // ── Stripe price IDs: LVN/LPN (NCLEX-PN US) — keys required even if values pending ──
  "STRIPE_PRICE_LVN_LPN_MONTHLY",
  "STRIPE_PRICE_LVN_LPN_3MONTH",
  "STRIPE_PRICE_LVN_LPN_6MONTH",
  "STRIPE_PRICE_LVN_LPN_YEARLY",

  // ── Cron + Storage (deletion causes silent runtime failures) ──────────────
  "CRON_SECRET",
  "SPACES_KEY",
  "SPACES_SECRET",
]);

/**
 * Stripe price ID keys that must have a non-empty plain `value:` in the spec.
 * These are public price IDs (not secrets) — a type:SECRET or empty value means
 * checkout will return "Coming soon" for every plan in production.
 */
export const REQUIRED_CHECKOUT_PRICE_VALUE_KEYS = Object.freeze([
  "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_1_YEAR_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_1_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_YEARLY_SUBSCRIPTION",
  "STRIPE_PRICE_NEW_GRAD_MONTHLY",
  "STRIPE_PRICE_NEW_GRAD_6MONTH",
  "STRIPE_PRICE_NEW_GRAD_YEARLY",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_MONTHLY",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_3_MONTHS",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_YEARLY",
]);

/** At least one of these must be present (AI provider key). */
export const REQUIRED_AI_KEY_GROUP = Object.freeze([
  "AI_INTEGRATIONS_OPENAI_API_KEY",
  "OPENAI_API_KEY",
  "OPENROUTER_API_KEY",
]);

/** Expected web component run_command. Must not change without explicit sign-off. */
export const EXPECTED_RUN_COMMAND = "node scripts/start-standalone.mjs";

/** Valid container registry types for the web service image source. */
export const VALID_REGISTRY_TYPES = Object.freeze(["GHCR", "DOCR", "DOCKER_HUB"]);

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
 * Check if a resolved absolute spec path is one of the known forbidden (non-canonical) files.
 * Returns the reason string if forbidden, undefined if allowed.
 */
export function isForbiddenSpecPath(resolvedAbsPath) {
  for (const [rel, reason] of Object.entries(FORBIDDEN_SPEC_PATHS)) {
    if (resolvedAbsPath === path.resolve(ROOT, rel)) {
      return reason;
    }
  }
  return undefined;
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

  // Stripe price ID value check: must have non-empty plain value (not SECRET) or checkout shows "Coming soon"
  for (const key of REQUIRED_CHECKOUT_PRICE_VALUE_KEYS) {
    const entry = envMap.get(key);
    if (!entry) continue; // already caught by REQUIRED_RUNTIME_ENV_KEYS check above
    const isSecret = entry.type === "SECRET";
    const hasValue = typeof entry.value === "string" && entry.value.trim().startsWith("price_");
    if (isSecret) {
      failures.push(
        `Stripe price key "${key}" has type:SECRET — price IDs are not secrets and must use value: "price_..." directly. ` +
        `Using type:SECRET with no value set causes checkout to show "Coming soon" for every plan in production.`,
      );
    } else if (!hasValue) {
      failures.push(
        `Stripe price key "${key}" is missing a valid value (expected "price_..." string). ` +
        `An empty or placeholder value causes checkout to show "Coming soon" for this plan in production.`,
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
    // Must be image-based deploy — github: source causes the "Selecting branch" clone hang
    if (web.github) {
      failures.push(
        'Web service still has github: source — this causes DigitalOcean to clone the full GitHub repo and hang at "Selecting branch". ' +
        'Remove github:, dockerfile_path:, and source_dir: and replace with an image: block pointing to a pre-built GHCR/DOCR image.',
      );
    }
    if (!web.image) {
      failures.push(
        'Web service is missing image: block. The spec must use a pre-built container image source (image.registry_type: GHCR | DOCR | DOCKER_HUB), not a GitHub source clone.',
      );
    } else {
      if (!VALID_REGISTRY_TYPES.includes(web.image.registry_type)) {
        failures.push(
          `Web service image.registry_type is "${web.image.registry_type}" — must be one of: ${VALID_REGISTRY_TYPES.join(", ")}.`,
        );
      }
      if (!web.image.repository) {
        failures.push("Web service image.repository is missing.");
      }
      if (!web.image.tag && !web.image.digest) {
        failures.push("Web service image must specify tag or digest.");
      }
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
 * Automatically fails with a descriptive message if the path is a known forbidden file.
 * @returns {{ ok: boolean, failures: string[], warnings: string[], spec: object|null }}
 */
export function validateSpecFile(specPath) {
  const resolvedPath = path.resolve(specPath);

  // Hard-block known forbidden paths before even parsing
  const forbiddenReason = isForbiddenSpecPath(resolvedPath);
  if (forbiddenReason) {
    const rel = path.relative(ROOT, resolvedPath);
    return {
      ok: false,
      failures: [
        `FORBIDDEN spec file "${rel}" must never be used with doctl apps update. ${forbiddenReason}`,
        `Use the canonical spec instead: ${path.relative(ROOT, CANONICAL_SPEC_PATH)}`,
      ],
      warnings: [],
      spec: null,
    };
  }

  if (!existsSync(resolvedPath)) {
    return {
      ok: false,
      failures: [`Spec file not found: ${resolvedPath}`],
      warnings: [],
      spec: null,
    };
  }

  let spec;
  try {
    spec = yaml.load(readFileSync(resolvedPath, "utf8"));
  } catch (error) {
    return {
      ok: false,
      failures: [`Failed to parse spec YAML at ${resolvedPath}: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
      spec: null,
    };
  }

  // Null spec means the file was empty or comment-only (valid YAML parses to null)
  if (spec === null || spec === undefined) {
    return {
      ok: false,
      failures: [`Spec file at "${path.relative(ROOT, resolvedPath)}" parsed to null — file is empty or comment-only and cannot be deployed.`],
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
  const resolvedPath = path.resolve(specPath);

  // Warn loudly when validating a non-canonical path
  if (resolvedPath !== path.resolve(CANONICAL_SPEC_PATH)) {
    console.warn(`[do-spec-guard] WARN: Validating non-canonical spec: ${path.relative(ROOT, resolvedPath)}`);
    console.warn(`[do-spec-guard] WARN: The canonical spec for deploy is: ${path.relative(ROOT, CANONICAL_SPEC_PATH)}`);
  }

  const { ok, failures, warnings } = validateSpecFile(resolvedPath);

  for (const w of warnings) {
    console.warn(`[do-spec-guard] WARN: ${w}`);
  }
  if (!ok) {
    for (const f of failures) {
      console.error(`[do-spec-guard] FAIL: ${f}`);
    }
    process.exit(1);
  }
  console.log(`[do-spec-guard] OK: ${path.relative(ROOT, resolvedPath)} passes all required env protection checks.`);
  process.exit(0);
}
