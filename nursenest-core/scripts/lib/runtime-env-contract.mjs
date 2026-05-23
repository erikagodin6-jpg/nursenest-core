import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const DIGITALOCEAN_RUNTIME_EVIDENCE = Object.freeze({
  appName: "nursenest-core-next",
  componentName: "web",
  sourceDir: ".",
  runCommand: "node scripts/start-production.mjs",
});

export const RUNTIME_ENV_PRESENCE_KEYS = Object.freeze([
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "STRIPE_SECRET_KEY",
  "NEXTAUTH_URL",
  "AUTH_URL",
  "PORT",
  "HOSTNAME",
  "NODE_ENV",
]);

const RUNTIME_ENV_PROBE_KEY_PATTERN = /^(DATABASE|AUTH|STRIPE|POSTGRES|PORT|HOSTNAME|NODE_ENV)/;

const DEPLOYMENT_ID_CANDIDATE_KEYS = Object.freeze([
  "DIGITALOCEAN_DEPLOYMENT_ID",
  "APP_DEPLOYMENT_ID",
  "NN_DO_ACTIVE_DEPLOYMENT_ID",
]);

export function hasRuntimeValue(env, key) {
  return Boolean(String(env?.[key] ?? "").trim());
}

export function runtimeEnvPresenceSnapshot(env = process.env) {
  return Object.fromEntries(
    RUNTIME_ENV_PRESENCE_KEYS.map((key) => [`${key}_present`, hasRuntimeValue(env, key)]),
  );
}

export function buildForwardedRuntimeEnv(baseEnv = process.env, overrides = {}) {
  if (!overrides || Object.keys(overrides).length === 0) {
    return baseEnv;
  }

  return {
    ...baseEnv,
    ...overrides,
  };
}

export function resolveRuntimeDeploymentId(env = process.env) {
  for (const key of DEPLOYMENT_ID_CANDIDATE_KEYS) {
    const value = String(env?.[key] ?? "").trim();
    if (value) return value;
  }

  return null;
}

export function resolveRuntimeScriptPath(scriptPath = process.argv[1]) {
  if (typeof scriptPath !== "string" || scriptPath.trim().length === 0) {
    return null;
  }

  return path.resolve(scriptPath);
}

export function resolveRuntimeContractContext(options = {}) {
  const {
    env = process.env,
    cwd = process.cwd(),
    scriptPath = process.argv[1],
    deploymentId = resolveRuntimeDeploymentId(env),
  } = options;

  return {
    ...DIGITALOCEAN_RUNTIME_EVIDENCE,
    cwd,
    scriptPath: resolveRuntimeScriptPath(scriptPath),
    deploymentId: deploymentId ?? null,
  };
}

export function createEarlyRuntimeDiagnostics(options = {}) {
  const { env = process.env, phase = "runtime_entrypoint", ...rest } = options;

  return {
    phase,
    ...resolveRuntimeContractContext({ env, ...rest }),
    ...runtimeEnvPresenceSnapshot(env),
  };
}

export function runtimeEnvProbeEnabled(env = process.env) {
  const value = String(env?.NN_RUNTIME_ENV_PROBE ?? "")
    .trim()
    .toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

export function collectRuntimeEnvProbeKeys(env = process.env) {
  return Object.keys(env ?? {})
    .filter((key) => RUNTIME_ENV_PROBE_KEY_PATTERN.test(key))
    .sort();
}

export function createRuntimeEnvProbeDiagnostics(options = {}) {
  const { env = process.env, phase = "runtime_env_probe", ...rest } = options;
  const matchingKeys = collectRuntimeEnvProbeKeys(env);

  return {
    event: "runtime_env_probe_keys",
    phase,
    ...resolveRuntimeContractContext({ env, ...rest }),
    matchingKeyCount: matchingKeys.length,
    matchingKeys,
  };
}

export function getDoRuntimeVerificationCachePath(appRoot) {
  return path.join(appRoot, "tmp", "do-runtime-verification.json");
}

export function readDoRuntimeVerificationCache(appRoot, options = {}) {
  const { now = Date.now(), maxAgeMs = 1000 * 60 * 60 * 24 * 7 } = options;
  const cachePath = getDoRuntimeVerificationCachePath(appRoot);

  if (!existsSync(cachePath)) {
    return {
      status: "missing",
      cachePath,
      summary: null,
    };
  }

  try {
    const summary = JSON.parse(readFileSync(cachePath, "utf8"));
    const checkedAtMs = Date.parse(summary?.checkedAt ?? "");

    if (!Number.isFinite(checkedAtMs)) {
      return {
        status: "invalid",
        cachePath,
        summary: null,
      };
    }

    const ageMs = now - checkedAtMs;
    return {
      status: ageMs <= maxAgeMs ? "passed_recently" : "stale",
      cachePath,
      ageMs,
      summary,
    };
  } catch {
    return {
      status: "invalid",
      cachePath,
      summary: null,
    };
  }
}

export function writeDoRuntimeVerificationCache(appRoot, summary) {
  const cachePath = getDoRuntimeVerificationCachePath(appRoot);
  mkdirSync(path.dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  return cachePath;
}

export function formatDoRuntimeVerificationStatus(appRoot, options = {}) {
  const verification = readDoRuntimeVerificationCache(appRoot, options);
  const checkedAt = verification.summary?.checkedAt ?? null;
  const activeDeploymentId = verification.summary?.freshness?.activeDeploymentId ?? null;
  const latestDeploymentId = verification.summary?.freshness?.latestDeploymentId ?? null;

  switch (verification.status) {
    case "passed_recently":
      return `passed_recently checked_at=${checkedAt ?? "(unknown)"} active_deployment_id=${activeDeploymentId ?? "(unknown)"} latest_deployment_id=${latestDeploymentId ?? "(unknown)"}`;
    case "stale":
      return `stale checked_at=${checkedAt ?? "(unknown)"} active_deployment_id=${activeDeploymentId ?? "(unknown)"} latest_deployment_id=${latestDeploymentId ?? "(unknown)"}`;
    case "invalid":
      return `invalid cache_path=${verification.cachePath}`;
    default:
      return `missing cache_path=${verification.cachePath}`;
  }
}

export function buildMissingRuntimeEnvContractMessage(options = {}) {
  const {
    env = process.env,
    appRoot,
    envName = "DATABASE_URL",
    reason = "Runtime env did not reach the first Node process; inspect DigitalOcean env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding.",
    cwd = process.cwd(),
    scriptPath = process.argv[1],
  } = options;

  const context = resolveRuntimeContractContext({ env, cwd, scriptPath });
  const doctlStatus = appRoot
    ? formatDoRuntimeVerificationStatus(appRoot)
    : "unavailable app_root=(missing)";

  return [
    `${envName} is missing in the first runtime Node process (not build ARG).`,
    reason,
    `app_name=${context.appName}`,
    `component_name=${context.componentName}`,
    `source_dir=${context.sourceDir}`,
    `run_command=${context.runCommand}`,
    `cwd=${context.cwd}`,
    `script_path=${context.scriptPath ?? "(unavailable)"}`,
    `deployment_id=${context.deploymentId ?? "(unavailable)"}`,
    `doctl_verify_runtime=${doctlStatus}`,
  ].join(" ");
}
