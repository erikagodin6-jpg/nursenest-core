#!/usr/bin/env node
/**
 * Build-cache diagnostics for Heroku / DigitalOcean App Platform Node buildpack.
 *
 * **heroku-postbuild** (default): runs after `npm install` / cache **restore**, before `NN_POSTBUILD_NEXT_BUILD=1 npm run build`.
 * Ensures `.next/cache` exists so Next.js’s CI probe (`getCacheDir` when `isCI && !hasNextSupport`) does not treat the
 * tree as “uncached” solely because the directory was missing (cold restore / first deploy). Logs `dot_next_cache_entry_count`
 * to distinguish an empty scaffold (`0`) from a restored webpack/swc cache (`>0`).
 *
 * **heroku-cleanup** (`--phase=heroku_cleanup`): runs after the buildpack **saves** `cacheDirectories` and prunes
 * devDependencies — confirms `.next/cache` is still on disk for the slug (sanity check for DO/Heroku ordering).
 *
 * @see https://docs.digitalocean.com/products/app-platform/reference/buildpacks/nodejs/#custom-caching
 */
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const phase = process.argv.includes("--phase=heroku_cleanup") ? "heroku_cleanup" : "heroku_postbuild";

function statHint(absPath) {
  try {
    const s = statSync(absPath);
    return { exists: true, isDirectory: s.isDirectory(), size: s.size, mtimeMs: s.mtimeMs };
  } catch {
    return { exists: false };
  }
}

function cacheDirEntryCount(absPath) {
  if (!existsSync(absPath)) return 0;
  try {
    return readdirSync(absPath).filter((n) => !n.startsWith(".")).length;
  } catch {
    return 0;
  }
}

const cacheDir = path.join(packageRoot, ".next", "cache");
const nextDir = path.join(packageRoot, ".next");
const nm = path.join(packageRoot, "node_modules");

const npmCache = spawnSync(npm, ["config", "get", "cache"], { cwd: packageRoot, encoding: "utf8" });

const preScaffold = phase === "heroku_postbuild" ? statHint(cacheDir) : { exists: false };
const preEntryCount = phase === "heroku_postbuild" ? cacheDirEntryCount(cacheDir) : 0;

if (phase === "heroku_postbuild") {
  // Next.js warns when `.next/cache` is missing in CI; restoring tarball may still skip until the first warm save.
  mkdirSync(cacheDir, { recursive: true });
}

console.log("[build-cache-hints] phase=" + phase + " ts_iso=" + new Date().toISOString());
if (phase === "heroku_cleanup") {
  console.log(
    "[build-cache-hints] cache_snapshot_note=runs after buildpack save-cache + prune; expect dot_next_cache_present=1 when compile succeeded",
  );
} else {
  console.log(
    "[build-cache-hints] cache_snapshot_note=heroku_postbuild runs after cache restore; pre_scaffold_* is before mkdir; dot_next_cache_entry_count after scaffold reflects restore+warmth",
  );
}
console.log(
  "[build-cache-hints] platform=" +
    (String(process.env.DIGITALOCEAN_APP_ID ?? "").trim() ? "digitalocean_app_platform" : "other"),
);
console.log("[build-cache-hints] node_modules_cache_env=" + JSON.stringify(process.env.NODE_MODULES_CACHE ?? ""));
console.log("[build-cache-hints] npm_cache_dir=" + JSON.stringify((npmCache.stdout ?? "").trim()));
console.log("[build-cache-hints] node_modules_present=" + (existsSync(nm) ? "1" : "0"));
console.log("[build-cache-hints] dot_next_present=" + (existsSync(nextDir) ? "1" : "0"));
if (phase === "heroku_postbuild") {
  console.log(
    "[build-cache-hints] pre_scaffold_dot_next_cache_present=" +
      (preScaffold.exists ? "1" : "0") +
      " pre_scaffold_dot_next_cache_entry_count=" +
      String(preEntryCount),
  );
}
const c = statHint(cacheDir);
const entryCount = cacheDirEntryCount(cacheDir);
console.log(
  "[build-cache-hints] dot_next_cache_present=" +
    (c.exists ? "1" : "0") +
    (c.exists && c.isDirectory ? " dot_next_cache_mtime_ms=" + String(Math.floor(c.mtimeMs)) : ""),
);
console.log("[build-cache-hints] dot_next_cache_entry_count=" + String(entryCount));
