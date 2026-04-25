#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const nextOutDir = path.join(packageRoot, ".next");

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? ""));
}

function ensureBuildCacheVersionEnv() {
  if (String(process.env.BUILD_CACHE_VERSION ?? "").trim()) return;

  const fromGit =
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.GITHUB_SHA?.trim() ||
    process.env.CI_COMMIT_SHA?.trim() ||
    process.env.CI_COMMIT_SHORT_SHA?.trim() ||
    process.env.SOURCE_VERSION?.trim() ||
    "";

  process.env.BUILD_CACHE_VERSION = fromGit || `local-${Date.now()}`;

  console.log(
    "[next-prod-build] build_cache_version=" +
      JSON.stringify(process.env.BUILD_CACHE_VERSION.slice(0, 20)),
  );
}

function removeNextOutputDir() {
  if (!existsSync(nextOutDir)) {
    console.log("[next-prod-build] clean_dot_next=skip");
    return;
  }

  rmSync(nextOutDir, { recursive: true, force: true });
  console.log("[next-prod-build] clean_dot_next=ok");
}

function enforceMarketingSkipDbForCompile() {
  process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD = "1";
}

const BUNDLER_ENV_KEYS = ["TURBOPACK", "IS_TURBOPACK_TEST", "NEXT_RSPACK", "NEXT_TEST_USE_RSPACK"];

for (const key of BUNDLER_ENV_KEYS) {
  delete process.env[key];
}

let nextBin;

try {
  const nextPkg = require.resolve("next/package.json");
  nextBin = path.join(path.dirname(nextPkg), "dist", "bin", "next");
} catch {
  console.error("[next-prod-build] FATAL: could not resolve next");
  process.exit(1);
}

if (!existsSync(nextBin)) {
  console.error("[next-prod-build] FATAL: Next CLI missing");
  process.exit(1);
}

ensureBuildCacheVersionEnv();
enforceMarketingSkipDbForCompile();
removeNextOutputDir();

/**
 * 🔥 CRITICAL FIX:
 * REMOVE "--webpack"
 */
const r = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});

if (r.status !== 0) {
  process.exit(r.status ?? 1);
}

process.exit(0);