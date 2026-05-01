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

function pickCommitFromEnv() {
  for (const k of [
    "GITHUB_SHA",
    "VERCEL_GIT_COMMIT_SHA",
    "SOURCE_VERSION",
    "COMMIT_SHA",
    "NN_GIT_COMMIT_SHA",
  ]) {
    const v = process.env[k]?.trim();
    if (v) return v;
  }
  return null;
}

const commit = git(["rev-parse", "HEAD"]) || pickCommitFromEnv() || null;
const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]) || null;
const meta = {
  commit,
  branch,
  recordedAt: new Date().toISOString(),
};

const dest = path.join(appRoot, "public", "nn-build-meta.json");
mkdirSync(path.dirname(dest), { recursive: true });
writeFileSync(dest, `${JSON.stringify(meta)}\n`, "utf8");
console.error(`[write-build-git-meta] wrote ${dest} ${JSON.stringify(meta)}`);
