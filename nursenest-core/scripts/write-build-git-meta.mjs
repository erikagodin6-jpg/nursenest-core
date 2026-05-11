#!/usr/bin/env node
/**
 * Writes `public/nn-build-meta.json` for runtime `/api/version` and startup logs.
 * Resolves commit/branch from CI/App Platform env vars first, then git CLI (never throws).
 *
 * Commit priority (first non-empty wins): NN_BUILD_COMMIT → SOURCE_COMMIT →
 * DIGITALOCEAN_GIT_COMMIT_SHA → GITHUB_SHA → VERCEL_GIT_COMMIT_SHA → git CLI.
 *
 * Branch priority: NN_BUILD_BRANCH → SOURCE_BRANCH → DIGITALOCEAN_GIT_BRANCH →
 * GITHUB_REF_NAME → VERCEL_GIT_COMMIT_REF → git CLI.
 *
 * DigitalOcean Dockerfile builds often omit `.git` and leave platform git envs empty; bindable
 * `${web.COMMIT_HASH}` (match `services[].name`) is runtime-only for Dockerfile services. Prefer RUN_TIME `NN_BUILD_*` in the app
 * spec; `start-standalone.mjs` re-runs this script at boot so `nn-build-meta.json` matches (see deploy docs).
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const monorepoRoot = path.join(appRoot, "..");

/** @param {unknown} value */
export function normalizeEnvString(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s || null;
}

/**
 * Safe git invocation — failures never propagate (build must not fail).
 * @param {string} cwd
 * @param {readonly string[]} args e.g. ["rev-parse", "HEAD"]
 * @returns {string | null}
 */
export function safeGitExecSync(args, cwd) {
  try {
    const stdout = execSync(["git", ...args].join(" "), {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 512 * 1024,
    });
    return normalizeEnvString(stdout);
  } catch {
    return null;
  }
}

const COMMIT_PROBES = [
  { envKey: "NN_BUILD_COMMIT", sourceLabel: "nn_build" },
  { envKey: "SOURCE_COMMIT", sourceLabel: "sourceCommitEnv" },
  { envKey: "DIGITALOCEAN_GIT_COMMIT_SHA", sourceLabel: "digitalocean" },
  { envKey: "GITHUB_SHA", sourceLabel: "github" },
  { envKey: "VERCEL_GIT_COMMIT_SHA", sourceLabel: "vercel" },
];

const BRANCH_PROBES = [
  { envKey: "NN_BUILD_BRANCH", sourceLabel: "nn_build" },
  { envKey: "SOURCE_BRANCH", sourceLabel: "sourceCommitEnv" },
  { envKey: "DIGITALOCEAN_GIT_BRANCH", sourceLabel: "digitalocean" },
  { envKey: "GITHUB_REF_NAME", sourceLabel: "github" },
  { envKey: "VERCEL_GIT_COMMIT_REF", sourceLabel: "vercel" },
];

/** @param {string | null | undefined} value */
export function normalizeBranch(value) {
  const n = normalizeEnvString(value);
  if (!n || n === "HEAD") return null;
  return n.replace(/^refs\/heads\//, "").replace(/^origin\//, "").trim() || null;
}

/**
 * @param {Record<string, string | undefined>} env
 * @param {typeof COMMIT_PROBES} probes
 * @param {(value: string | undefined) => string | null} [normalizeValue]
 */
function resolveFromEnvProbes(env, probes, normalizeValue = normalizeEnvString) {
  /** @type {{ provider: string, resolved: boolean, value?: string | null }[]} */
  const diagnostics = [];

  for (const { envKey, sourceLabel } of probes) {
    const raw = env[envKey];
    const normalized = normalizeValue(raw);
    if (normalized) {
      diagnostics.push({ provider: envKey, resolved: true, value: normalized });
      return { value: normalized, sourceLabel, diagnostics };
    }
    diagnostics.push({ provider: envKey, resolved: false, value: null });
  }

  return { value: null, sourceLabel: null, diagnostics };
}

function detectBuildPlatform(env) {
  if (
    normalizeEnvString(env.DIGITALOCEAN_APP_ID) ||
    normalizeEnvString(env.DIGITALOCEAN_GIT_COMMIT_SHA) ||
    env.NN_APP_PLATFORM_BUILD === "true"
  ) {
    return "digitalocean";
  }
  if (env.GITHUB_ACTIONS === "true" || normalizeEnvString(env.GITHUB_SHA)) return "github-actions";
  if (env.VERCEL === "1" || normalizeEnvString(env.VERCEL_GIT_COMMIT_SHA)) return "vercel";
  if (env.CI === "true") return "ci";
  return "local";
}

/**
 * @param {string[]} args
 * @param {string[]} cwds
 * @param {(args: string[], cwd: string) => string | null} execGit
 */
function gitFirstHit(args, cwds, execGit) {
  for (const cwd of cwds) {
    const v = execGit(args, cwd);
    if (v) return { value: v, cwd };
  }
  return { value: null, cwd: null };
}

/**
 * @param {string | null} commitSourceLabel
 * @param {string | null} branchSourceLabel
 */
function effectiveSourceLabel(commitSourceLabel, branchSourceLabel) {
  if (commitSourceLabel) return commitSourceLabel;
  if (branchSourceLabel) return branchSourceLabel;
  return null;
}

/**
 * @param {object} [opts]
 * @param {NodeJS.ProcessEnv} [opts.env]
 * @param {Date} [opts.now]
 * @param {(args: string[]) => string | null | undefined} [opts.git] legacy single-callback git (tests); ignores cwd
 * @param {boolean} [opts.logDiagnostics]
 * @param {(args: string[], cwd: string) => string | null} [opts.gitExecSync] override safe exec (tests)
 */
export function resolveBuildMeta({
  env = process.env,
  git: legacyGit,
  gitExecSync = safeGitExecSync,
  now = new Date(),
  logDiagnostics = true,
} = {}) {
  const log = logDiagnostics ? console.error.bind(console) : () => {};

  const cwds = [...new Set([monorepoRoot, appRoot])];

  const commitEnv = resolveFromEnvProbes(env, COMMIT_PROBES);
  for (const d of commitEnv.diagnostics) {
    log(
      `[write-build-git-meta] ${JSON.stringify({
        scope: "commit",
        provider: d.provider,
        resolved: d.resolved,
        value: d.resolved ? d.value : null,
      })}`,
    );
  }

  let commit = commitEnv.value;
  let commitSourceLabel = commitEnv.sourceLabel;

  if (!commit) {
    if (legacyGit) {
      const g = legacyGit(["rev-parse", "HEAD"]);
      log(
        `[write-build-git-meta] ${JSON.stringify({
          scope: "commit",
          provider: "git-cli(injected)",
          resolved: Boolean(g),
          value: g ?? null,
        })}`,
      );
      if (g) {
        commit = g;
        commitSourceLabel = "git-cli";
      }
    } else {
      for (const cwd of cwds) {
        const g = gitExecSync(["rev-parse", "HEAD"], cwd);
        log(
          `[write-build-git-meta] ${JSON.stringify({
            scope: "commit",
            provider: "git-cli",
            cwd,
            resolved: Boolean(g),
            value: g ?? null,
          })}`,
        );
        if (g) {
          commit = g;
          commitSourceLabel = "git-cli";
          break;
        }
      }
    }
  }

  const branchEnv = resolveFromEnvProbes(env, BRANCH_PROBES, (raw) => normalizeBranch(raw));
  for (const d of branchEnv.diagnostics) {
    log(
      `[write-build-git-meta] ${JSON.stringify({
        scope: "branch",
        provider: d.provider,
        resolved: d.resolved,
        value: d.resolved ? d.value : null,
      })}`,
    );
  }

  let branch = branchEnv.value;
  let branchSourceLabel = branchEnv.sourceLabel;

  if (!branch) {
    if (legacyGit) {
      const g = normalizeBranch(legacyGit(["rev-parse", "--abbrev-ref", "HEAD"]));
      log(
        `[write-build-git-meta] ${JSON.stringify({
          scope: "branch",
          provider: "git-cli(injected)",
          resolved: Boolean(g),
          value: g ?? null,
        })}`,
      );
      if (g) {
        branch = g;
        branchSourceLabel = "git-cli";
      }
    } else {
      for (const cwd of cwds) {
        const raw = gitExecSync(["rev-parse", "--abbrev-ref", "HEAD"], cwd);
        const g = normalizeBranch(raw);
        log(
          `[write-build-git-meta] ${JSON.stringify({
            scope: "branch",
            provider: "git-cli",
            cwd,
            resolved: Boolean(g),
            value: g ?? null,
          })}`,
        );
        if (g) {
          branch = g;
          branchSourceLabel = "git-cli";
          break;
        }
      }
    }
  }

  const source = effectiveSourceLabel(commitSourceLabel, branchSourceLabel);

  log(
    `[write-build-git-meta] ${JSON.stringify({
      scope: "summary",
      commitProvider: commitSourceLabel,
      branchProvider: branchSourceLabel,
      commit,
      branch,
    })}`,
  );

  return {
    commit,
    branch,
    recordedAt: now.toISOString(),
    environment: normalizeEnvString(env.NN_DEPLOY_ENV) || normalizeEnvString(env.NODE_ENV) || null,
    buildPlatform: detectBuildPlatform(env),
    source,
  };
}

function writeBuildMeta() {
  const meta = resolveBuildMeta({ logDiagnostics: true });
  const dest = path.join(appRoot, "public", "nn-build-meta.json");
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, `${JSON.stringify(meta)}\n`, "utf8");
  console.error(`[write-build-git-meta] wrote ${dest} ${JSON.stringify(meta)}`);
}

const resolvedArgv = process.argv[1] ? path.resolve(process.argv[1]) : "";
const isMain = resolvedArgv && fileURLToPath(import.meta.url) === resolvedArgv;
if (isMain) {
  writeBuildMeta();
}
