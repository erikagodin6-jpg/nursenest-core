import { existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const nextCacheDir = path.join(packageRoot, ".next", "cache");
const nextTracePath = path.join(packageRoot, ".next", "trace");

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? ""));
}

/**
 * Preserve `.next/cache` by default so incremental build caches survive deploys (DigitalOcean
 * `cacheDirectories`, local rebuilds). Deleting it here caused empty cache snapshots on App
 * Platform → "No build cache found" / slower `next build`.
 *
 * Opt in to deleting `.next/cache` with `NN_POST_BUILD_PRUNE_NEXT_CACHE=1` (smaller slug, colder
 * next build).
 *
 * `.next/trace` is build diagnostics only — safe to remove to trim artifact size.
 */
const forcePruneNextCache = truthyEnv("NN_POST_BUILD_PRUNE_NEXT_CACHE");

if (existsSync(nextTracePath)) {
  rmSync(nextTracePath, { recursive: true, force: true });
  console.log("[post-build-prune] removed .next/trace (build diagnostics only)");
}

if (!existsSync(nextCacheDir)) {
  console.log("[post-build-prune] no .next/cache directory present");
  process.exit(0);
}

if (!forcePruneNextCache) {
  console.log(
    "[post-build-prune] preserving .next/cache for incremental builds. Set NN_POST_BUILD_PRUNE_NEXT_CACHE=1 to delete.",
  );
  process.exit(0);
}

rmSync(nextCacheDir, { recursive: true, force: true });
console.log("[post-build-prune] removed .next/cache (NN_POST_BUILD_PRUNE_NEXT_CACHE=1)");
