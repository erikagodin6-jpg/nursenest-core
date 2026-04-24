#!/usr/bin/env node
/**
 * Build-cache diagnostics for Heroku / DigitalOcean App Platform Node buildpack.
 *
 * **heroku-postbuild (first run, default phase):** after `npm install` / cache **restore**, **before** `next build`.
 * Creates `.next/cache` if missing so Next’s `getCacheDir` path exists in CI-ish builders (see `next/dist/build/index.js`).
 * **Note:** `package.json` `cacheDirectories` no longer persists `.next/cache` across deploys; production
 * compile still creates a fresh `.next` under the slug after `run-next-prod-build.mjs` removes the prior tree.
 *
 * **heroku-postbuild_after_compile:** run **after** `next build` in the same `heroku-postbuild` chain — reports real
 * `.next/cache/webpack` / `swc` population (nested file counts). The first run’s `dot_next_cache_entry_count_visible_only`
 * is often `0` on a cold tree; that does **not** mean webpack wrote nothing later.
 *
 * **heroku-cleanup** (`--phase=heroku_cleanup`): after buildpack **save-cache** + prune — confirms `.next/cache` still
 * exists for the slug (ordering / accidental delete check).
 *
 * @see https://docs.digitalocean.com/products/app-platform/reference/buildpacks/nodejs/#custom-caching
 */
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const phaseArg = process.argv.find((a) => a.startsWith("--phase="));
const phase = phaseArg ? phaseArg.slice("--phase=".length) : "heroku_postbuild";

const cacheDir = path.join(packageRoot, ".next", "cache");
const webpackCacheDir = path.join(cacheDir, "webpack");
const swcCacheDir = path.join(cacheDir, "swc");
const nextDir = path.join(packageRoot, ".next");
const nm = path.join(packageRoot, "node_modules");

function statHint(absPath) {
  try {
    const s = statSync(absPath);
    return { exists: true, isDirectory: s.isDirectory(), size: s.size, mtimeMs: s.mtimeMs };
  } catch {
    return { exists: false };
  }
}

/** Direct children of `absPath`, split into hidden vs visible (leading `.`). */
function topLevelSplit(absPath) {
  if (!existsSync(absPath)) {
    return { visible: [], hidden: [], visibleCount: 0, hiddenCount: 0 };
  }
  try {
    const names = readdirSync(absPath);
    const visible = names.filter((n) => !n.startsWith("."));
    const hidden = names.filter((n) => n.startsWith("."));
    return {
      visible,
      hidden,
      visibleCount: visible.length,
      hiddenCount: hidden.length,
    };
  } catch {
    return { visible: [], hidden: [], visibleCount: 0, hiddenCount: 0 };
  }
}

/** Legacy metric: non-hidden top-level entries only (can be 0 while `webpack/` exists if everything were hidden — rare). */
function cacheDirEntryCountVisibleOnly(absPath) {
  return topLevelSplit(absPath).visibleCount;
}

/** Sorted visible (non-dot) names under `absPath`, capped for logs. */
function listVisibleNames(absPath, max) {
  const cap = max ?? 48;
  if (!existsSync(absPath)) return [];
  try {
    return readdirSync(absPath)
      .filter((n) => !n.startsWith("."))
      .sort()
      .slice(0, cap);
  } catch {
    return [];
  }
}

/**
 * Count nested **files** under `absRoot` (BFS), skipping dotfile / dotdir names at any depth.
 * Stops after `maxFiles` files to avoid huge walks on pathological trees.
 */
function countNestedFiles(absRoot, maxFiles) {
  const cap = maxFiles ?? 250_000;
  if (!existsSync(absRoot)) {
    return { files: 0, dirsVisited: 0, approxBytes: 0, truncated: false };
  }
  let files = 0;
  let dirsVisited = 0;
  let approxBytes = 0;
  let truncated = false;
  const stack = [absRoot];
  while (stack.length > 0) {
    const cur = stack.pop();
    let entries;
    try {
      entries = readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      if (ent.name.startsWith(".")) continue;
      const p = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        dirsVisited++;
        stack.push(p);
      } else if (ent.isFile()) {
        files++;
        try {
          approxBytes += statSync(p).size;
        } catch {
          // ignore
        }
        if (files >= cap) {
          truncated = true;
          stack.length = 0;
          break;
        }
      }
    }
  }
  return { files, dirsVisited, approxBytes, truncated };
}

const npmCache = spawnSync(npm, ["config", "get", "cache"], { cwd: packageRoot, encoding: "utf8" });

const isPreCompilePostbuild = phase === "heroku_postbuild";
const isAfterCompile = phase === "heroku_postbuild_after_compile";
const isCleanup = phase === "heroku_cleanup";

if (isPreCompilePostbuild) {
  const preScaffold = statHint(cacheDir);
  const preSplit = topLevelSplit(cacheDir);
  const preEntryCountVisible = preSplit.visibleCount;
  mkdirSync(cacheDir, { recursive: true });

  console.log("[build-cache-hints] phase=" + phase + " ts_iso=" + new Date().toISOString());
  console.log(
    "[build-cache-hints] cache_snapshot_note=before next build: empty or restored .next/cache is normal; use phase=heroku_postbuild_after_compile for post-compile counts",
  );
  console.log(
    "[build-cache-hints] platform=" +
      (String(process.env.DIGITALOCEAN_APP_ID ?? "").trim() ? "digitalocean_app_platform" : "other"),
  );
  console.log("[build-cache-hints] node_modules_cache_env=" + JSON.stringify(process.env.NODE_MODULES_CACHE ?? ""));
  console.log("[build-cache-hints] npm_cache_dir=" + JSON.stringify((npmCache.stdout ?? "").trim()));
  console.log("[build-cache-hints] node_modules_present=" + (existsSync(nm) ? "1" : "0"));
  console.log("[build-cache-hints] dot_next_present=" + (existsSync(nextDir) ? "1" : "0"));
  console.log(
    "[build-cache-hints] pre_scaffold_dot_next_cache_present=" +
      (preScaffold.exists ? "1" : "0") +
      " pre_scaffold_dot_next_cache_top_visible=" +
      String(preEntryCountVisible) +
      " pre_scaffold_dot_next_cache_top_hidden=" +
      String(preSplit.hiddenCount),
  );
  if (preSplit.visible.length > 0) {
    console.log(
      "[build-cache-hints] pre_scaffold_dot_next_cache_top_visible_names=" +
        JSON.stringify(preSplit.visible.slice(0, 24)),
    );
  }
} else {
  console.log("[build-cache-hints] phase=" + phase + " ts_iso=" + new Date().toISOString());
  if (isCleanup) {
    console.log(
      "[build-cache-hints] cache_snapshot_note=after buildpack save-cache + prune; webpack/swc should still exist if compile + cache save succeeded",
    );
  } else if (isAfterCompile) {
    console.log(
      "[build-cache-hints] cache_snapshot_note=immediately after next build (before buildpack cache save); nested file counts reflect real webpack/swc disk cache",
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
}

const c = statHint(cacheDir);
const split = topLevelSplit(cacheDir);
const entryCountVisible = split.visibleCount;
const webpackNested = countNestedFiles(webpackCacheDir);
const swcNested = countNestedFiles(swcCacheDir);

console.log(
  "[build-cache-hints] dot_next_cache_present=" +
    (c.exists ? "1" : "0") +
    (c.exists && c.isDirectory ? " dot_next_cache_mtime_ms=" + String(Math.floor(c.mtimeMs)) : ""),
);
console.log(
  "[build-cache-hints] dot_next_cache_top_visible=" +
    String(entryCountVisible) +
    " dot_next_cache_top_hidden=" +
    String(split.hiddenCount),
);
if (split.visible.length > 0) {
  console.log("[build-cache-hints] dot_next_cache_top_visible_names=" + JSON.stringify(split.visible.slice(0, 32)));
}
console.log(
  "[build-cache-hints] dot_next_cache_level1_visible_sorted=" + JSON.stringify(listVisibleNames(cacheDir, 48)),
);
if (existsSync(webpackCacheDir)) {
  console.log(
    "[build-cache-hints] dot_next_cache_webpack_level1_visible_sorted=" +
      JSON.stringify(listVisibleNames(webpackCacheDir, 48)),
  );
}
if (isAfterCompile || isCleanup) {
  console.log(
    "[build-cache-hints] build_env_turbopack=" +
      JSON.stringify(process.env.TURBOPACK ?? "") +
      " build_env_next_rspack=" +
      JSON.stringify(process.env.NEXT_RSPACK ?? "") +
      " (if Turbopack ran, webpack cache dir often stays empty; build uses scripts/run-next-prod-build.mjs to strip these during compile)",
  );
}
console.log(
  "[build-cache-hints] dot_next_cache_entry_count_visible_only=" +
    String(cacheDirEntryCountVisibleOnly(cacheDir)) +
    " (non-hidden top-level only; prefer nested metrics below)",
);
console.log(
  "[build-cache-hints] dot_next_cache_webpack_present=" +
    (existsSync(webpackCacheDir) ? "1" : "0") +
    " dot_next_cache_webpack_top_visible=" +
    String(topLevelSplit(webpackCacheDir).visibleCount),
);
console.log(
  "[build-cache-hints] dot_next_cache_webpack_nested_files=" +
    String(webpackNested.files) +
    " dot_next_cache_webpack_nested_dirs_visited=" +
    String(webpackNested.dirsVisited) +
    " dot_next_cache_webpack_approx_bytes=" +
    String(webpackNested.approxBytes) +
    " dot_next_cache_webpack_nested_truncated=" +
    (webpackNested.truncated ? "1" : "0"),
);
console.log(
  "[build-cache-hints] dot_next_cache_swc_present=" +
    (existsSync(swcCacheDir) ? "1" : "0") +
    " dot_next_cache_swc_top_visible=" +
    String(topLevelSplit(swcCacheDir).visibleCount),
);
console.log(
  "[build-cache-hints] dot_next_cache_swc_nested_files=" +
    String(swcNested.files) +
    " dot_next_cache_swc_nested_dirs_visited=" +
    String(swcNested.dirsVisited) +
    " dot_next_cache_swc_approx_bytes=" +
    String(swcNested.approxBytes) +
    " dot_next_cache_swc_nested_truncated=" +
    (swcNested.truncated ? "1" : "0"),
);
console.log(
  "[build-cache-hints] dot_next_cache_combined_webpack_swc_approx_bytes=" +
    String(webpackNested.approxBytes + swcNested.approxBytes),
);
