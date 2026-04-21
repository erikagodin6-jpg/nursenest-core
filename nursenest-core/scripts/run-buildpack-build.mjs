#!/usr/bin/env node
/**
 * Heroku / DigitalOcean App Platform invoke `npm run build` after `npm install`.
 * Our real production pipeline runs `next build` once inside `build_command` via
 * `npm run build:deploy` → `build:compile`. Running `next build` here too doubles
 * compile time on App Platform.
 *
 * When `DIGITALOCEAN_APP_ID` is set (injected on DO builds), skip this step unless
 * `NN_RUN_BUILDPACK_NEXT_BUILD=1` forces a compile (debug / parity checks).
 *
 * CI, droplets, and local dev omit `DIGITALOCEAN_APP_ID` → runs `npm run build:compile`.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? ""));
}

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const onDigitalOceanAppPlatform = Boolean(String(process.env.DIGITALOCEAN_APP_ID ?? "").trim());
const forceBuildpackNextBuild = truthyEnv("NN_RUN_BUILDPACK_NEXT_BUILD");

if (onDigitalOceanAppPlatform && !forceBuildpackNextBuild) {
  console.log(
    "[build] DigitalOcean App Platform: skipping duplicate `next build` in buildpack phase (runs once in build_command via build:compile). Set NN_RUN_BUILDPACK_NEXT_BUILD=1 to force build here.",
  );
  process.exit(0);
}

const t0 = Date.now();
const r = spawnSync(npm, ["run", "build:compile"], { cwd: packageRoot, stdio: "inherit" });
console.log(`[buildpack-build] npm_run_build_compile duration_ms=${Date.now() - t0}`);
process.exit(r.status === 0 ? 0 : r.status ?? 1);
