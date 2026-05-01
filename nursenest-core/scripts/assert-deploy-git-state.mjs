#!/usr/bin/env node
/**
 * Deploy guard: fail when the monorepo git tree is dirty.
 * Detached HEAD is allowed on CI / DigitalOcean App Platform (deploy SHA checkout);
 * for local strictness set `NN_FAIL_ON_DETACHED_HEAD=1`.
 *
 * Skips when `.git` is absent (e.g. Docker build context per root `.dockerignore`).
 * Opt out entirely with `NN_SKIP_DEPLOY_GIT_STATE_CHECK=1`.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const monorepoRoot = path.join(appRoot, "..");

if (process.env.NN_SKIP_DEPLOY_GIT_STATE_CHECK === "1") {
  console.error("[assert-deploy-git-state] skip: NN_SKIP_DEPLOY_GIT_STATE_CHECK=1");
  process.exit(0);
}

const gitDir = path.join(monorepoRoot, ".git");
if (!existsSync(gitDir)) {
  console.error("[assert-deploy-git-state] skip: no .git (e.g. Docker image build context)");
  process.exit(0);
}

function git(args) {
  return spawnSync("git", args, { cwd: monorepoRoot, encoding: "utf8" });
}

const status = git(["status", "--porcelain"]);
if (status.status !== 0) {
  console.error("[assert-deploy-git-state] FATAL: git status failed.");
  process.exit(1);
}
const dirty = (status.stdout ?? "").trim();
if (dirty) {
  console.error(
    "[assert-deploy-git-state] FATAL: working tree is dirty; production builds require a clean git state.\n",
    dirty,
  );
  process.exit(1);
}

const ref = git(["symbolic-ref", "-q", "HEAD"]);
const detached = ref.status !== 0;
if (detached) {
  const onCi =
    Boolean(String(process.env.DIGITALOCEAN_APP_ID ?? "").trim()) ||
    Boolean(String(process.env.GITHUB_ACTIONS ?? "").trim()) ||
    Boolean(String(process.env.CI ?? "").trim()) ||
    Boolean(String(process.env.GITLAB_CI ?? "").trim());

  if (onCi) {
    const head = git(["rev-parse", "HEAD"]);
    console.error(
      `[assert-deploy-git-state] ok: detached HEAD in CI/App Platform (commit=${(head.stdout ?? "").trim()})`,
    );
    process.exit(0);
  }

  if (process.env.NN_FAIL_ON_DETACHED_HEAD === "1") {
    console.error(
      "[assert-deploy-git-state] FATAL: detached HEAD (not CI). Checkout a branch or unset NN_FAIL_ON_DETACHED_HEAD.",
    );
    process.exit(1);
  }
  console.error(
    "[assert-deploy-git-state] warn: detached HEAD outside CI (allowed). Set NN_FAIL_ON_DETACHED_HEAD=1 to hard-fail.",
  );
}

console.error("[assert-deploy-git-state] ok");
