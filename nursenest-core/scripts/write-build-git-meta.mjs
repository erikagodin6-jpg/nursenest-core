#!/usr/bin/env node
/**
 * Writes `public/nn-build-meta.json` for runtime `/api/version` and startup logs.
 * Resolves commit from monorepo `.git` when present; otherwise well-known CI env vars.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const monorepoRoot = path.join(appRoot, "..");

function git(args) {
  const r = spawnSync("git", args, { cwd: monorepoRoot, encoding: "utf8" });
  if (r.status !== 0) return null;
  const o = (r.stdout ?? "").trim();
  return o || null;
}

const commitEnvKeys = [
  "SOURCE_COMMIT",
  "SOURCE_VERSION",
  "DIGITALOCEAN_GIT_COMMIT_SHA",
  "GITHUB_SHA",
  "VERCEL_GIT_COMMIT_SHA",
  "COMMIT_SHA",
  "NN_GIT_COMMIT_SHA",
];

const branchEnvKeys = [
  "SOURCE_BRANCH",
  "DIGITALOCEAN_GIT_BRANCH",
  "GITHUB_REF_NAME",
  "VERCEL_GIT_COMMIT_REF",
  "BRANCH_NAME",
  "NN_GIT_BRANCH",
];

function pickFromEnv(env, keys) {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) return { key, value };
  }
  return { key: null, value: null };
}

function normalizeBranch(value) {
  if (!value || value === "HEAD") return null;
  return value
    .replace(/^refs\/heads\//, "")
    .replace(/^origin\//, "")
    .trim() || null;
}

function detectBuildPlatform(env) {
  if (env.DIGITALOCEAN_APP_ID || env.DIGITALOCEAN_GIT_COMMIT_SHA || env.NN_APP_PLATFORM_BUILD === "true") {
    return "digitalocean";
  }
  if (env.GITHUB_ACTIONS === "true" || env.GITHUB_SHA) return "github-actions";
  if (env.VERCEL === "1" || env.VERCEL_GIT_COMMIT_SHA) return "vercel";
  if (env.CI === "true") return "ci";
  return "local";
}

export function resolveBuildMeta({
  env = process.env,
  git: gitCommand = git,
  now = new Date(),
} = {}) {
  const envCommit = pickFromEnv(env, commitEnvKeys);
  const envBranch = pickFromEnv(env, branchEnvKeys);
  const gitCommit = envCommit.value ? null : gitCommand(["rev-parse", "HEAD"]);
  const gitBranch = envBranch.value ? null : normalizeBranch(gitCommand(["rev-parse", "--abbrev-ref", "HEAD"]));
  const commit = envCommit.value || gitCommit || null;
  const branch = normalizeBranch(envBranch.value) || gitBranch;

  return {
    commit,
    branch,
    recordedAt: now.toISOString(),
    environment: env.NN_DEPLOY_ENV?.trim() || env.NODE_ENV?.trim() || null,
    buildPlatform: detectBuildPlatform(env),
    source: envCommit.key ? `env:${envCommit.key}` : gitCommit ? "git:rev-parse HEAD" : null,
  };
}

function writeBuildMeta() {
  const meta = resolveBuildMeta();
  const dest = path.join(appRoot, "public", "nn-build-meta.json");
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, `${JSON.stringify(meta)}\n`, "utf8");
  console.error(`[write-build-git-meta] wrote ${dest} ${JSON.stringify(meta)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeBuildMeta();
}
