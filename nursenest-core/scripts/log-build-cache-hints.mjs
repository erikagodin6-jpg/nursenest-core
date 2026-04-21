#!/usr/bin/env node
/**
 * Post-install diagnostics for Heroku / DigitalOcean App Platform Node buildpack.
 * Runs in `heroku-postbuild` (after `npm ci`, before buildpack prune/cache snapshot).
 * No secrets — paths and presence flags only.
 *
 * @see https://docs.digitalocean.com/products/app-platform/reference/buildpacks/nodejs/#custom-caching
 */
import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function statHint(absPath) {
  try {
    const s = statSync(absPath);
    return { exists: true, isDirectory: s.isDirectory(), size: s.size, mtimeMs: s.mtimeMs };
  } catch {
    return { exists: false };
  }
}

const cacheDir = path.join(packageRoot, ".next", "cache");
const nextDir = path.join(packageRoot, ".next");
const nm = path.join(packageRoot, "node_modules");

const npmCache = spawnSync(npm, ["config", "get", "cache"], { cwd: packageRoot, encoding: "utf8" });

console.log("[build-cache-hints] phase=post_install ts_iso=" + new Date().toISOString());
console.log(
  "[build-cache-hints] platform=" +
    (String(process.env.DIGITALOCEAN_APP_ID ?? "").trim() ? "digitalocean_app_platform" : "other"),
);
console.log("[build-cache-hints] node_modules_cache_env=" + JSON.stringify(process.env.NODE_MODULES_CACHE ?? ""));
console.log("[build-cache-hints] npm_cache_dir=" + JSON.stringify((npmCache.stdout ?? "").trim()));
console.log("[build-cache-hints] node_modules_present=" + (existsSync(nm) ? "1" : "0"));
console.log("[build-cache-hints] dot_next_present=" + (existsSync(nextDir) ? "1" : "0"));
const c = statHint(cacheDir);
console.log(
  "[build-cache-hints] dot_next_cache_present=" +
    (c.exists ? "1" : "0") +
    (c.exists && c.isDirectory ? " dot_next_cache_mtime_ms=" + String(Math.floor(c.mtimeMs)) : ""),
);
