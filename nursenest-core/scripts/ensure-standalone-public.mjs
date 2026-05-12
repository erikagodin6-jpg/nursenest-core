#!/usr/bin/env node
/**
 * ensure-standalone-public.mjs
 *
 * Belt-and-suspenders: copies public/i18n (and other required public assets) into every
 * discovered standalone server.js directory so that server-side i18n shard loading works
 * regardless of process.cwd() assumptions in the runtime environment.
 *
 * The Dockerfile already copies `public/` to the package root in the runner stage, so Docker
 * deployments are covered by that COPY instruction. This script adds redundancy for:
 *   - Non-Docker standalone deployments (Railway, bare-metal, CI smoke tests)
 *   - Environments where the standalone server's cwd differs from the package root
 *   - Defensive correctness: shard loader can find files via adjacent path even if cwd is wrong
 *
 * Called by: npm run build:deploy:postbuild (after ensure-standalone-static.mjs)
 */

import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { discoverStandaloneServerJsPaths } from "./verify-standalone-artifact.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

/** Required public asset directories to copy into each standalone server root. */
const PUBLIC_ASSET_DIRS = [
  "i18n", // Marketing i18n shards — required by server-side shard loaders
];

function countFiles(dir) {
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile()) count++;
  }
  return count;
}

function copyPublicAssetToStandaloneRoot(assetName, serverPath) {
  const srcDir = path.join(packageRoot, "public", assetName);
  if (!existsSync(srcDir)) {
    console.warn(
      `[ensure-standalone-public] WARN: source public/${assetName} not found at ${srcDir} — skipping`,
    );
    return { skipped: true };
  }

  const serverDir = path.dirname(serverPath);
  const destPublicDir = path.join(serverDir, "public");
  const destDir = path.join(destPublicDir, assetName);

  mkdirSync(destPublicDir, { recursive: true });

  cpSync(srcDir, destDir, { recursive: true, force: true });

  const srcCount = countFiles(srcDir);
  const destCount = countFiles(destDir);

  if (srcCount !== destCount) {
    throw new Error(
      `[ensure-standalone-public] FATAL: file count mismatch after copy.\n` +
        `  asset: public/${assetName}\n` +
        `  src: ${srcCount} files (${srcDir})\n` +
        `  dest: ${destCount} files (${destDir})\n` +
        `  server: ${serverPath}`,
    );
  }

  return { srcCount, destCount, destDir };
}

function main() {
  const servers = discoverStandaloneServerJsPaths(packageRoot);

  if (servers.length === 0) {
    console.warn(
      "[ensure-standalone-public] no standalone server.js found — skipping public asset copy (run `next build` first)",
    );
    return;
  }

  let totalCopied = 0;

  for (const serverPath of servers) {
    for (const assetName of PUBLIC_ASSET_DIRS) {
      const result = copyPublicAssetToStandaloneRoot(assetName, serverPath);
      if (!result.skipped) {
        totalCopied += result.srcCount ?? 0;
        console.log(
          `[ensure-standalone-public] copied public/${assetName} -> ${result.destDir} (${result.srcCount} files, server=${path.basename(path.dirname(serverPath))})`,
        );
      }
    }
  }

  console.log(
    `[ensure-standalone-public] done — ${totalCopied} total file(s) across ${servers.length} server root(s)`,
  );
}

main();
