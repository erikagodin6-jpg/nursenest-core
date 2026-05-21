#!/usr/bin/env node
/**
 * Heroku / DigitalOcean App Platform invoke `npm run build` after `npm install` and `heroku-postbuild`.
 *
 * DigitalOcean documents `heroku-postbuild` as running **before** prune/cache. Compile is triggered with
 * `NN_POSTBUILD_NEXT_BUILD=1 node scripts/run-buildpack-build.mjs` (see `package.json` `heroku-postbuild`) —
 * **not** `npm run build` inside postbuild — so the buildpack’s follow-up `npm run build` is the only npm
 * lifecycle entry for the `build` script and logs do not show two consecutive `npm run build` banners.
 *
 * **`package.json` `cacheDirectories` only lists `node_modules`** — `.next` is removed at the start of each
 * production compile (`run-next-prod-build.mjs`) so webpack/swc/Data Cache filestore from a prior slug
 * cannot leak across deploys.
 *
 * When **both** `heroku-postbuild` and `build` exist, the Heroku Node buildpack may still run `npm run build`
 * after postbuild; on DigitalOcean that pass skips compile when `DIGITALOCEAN_APP_ID` is set (unless
 * `NN_RUN_BUILDPACK_NEXT_BUILD=1`).
 *
 * Compile is started by spawning `node scripts/run-next-prod-build.mjs` with the same env as `build:compile`
 * (avoid nested `npm run build:compile` from inside the `build` script).
 *
 * Set `NN_RUN_BUILDPACK_NEXT_BUILD=1` on DO to force a second `next build` (debug / parity).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? ""));
}

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

/** Mirrors `package.json` `build:compile` env (keep in sync when that script changes). */
function buildCompileChildEnv() {
  const tmpdirRaw = process.env.TMPDIR;
  const tmpdir = tmpdirRaw != null && String(tmpdirRaw).trim() !== "" ? String(tmpdirRaw).trim() : "/tmp";
  const rawNodeOptions = String(process.env.NODE_OPTIONS ?? "").trim();
  const withoutHeap = rawNodeOptions.replace(/--max-old-space-size=\d+/, "").replace(/\s+/g, " ").trim();
  return {
    ...process.env,
    TMPDIR: tmpdir,
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    RUN_HEAVY_BUILD_TASKS: "false",
    SKIP_I18N_PREBUILD: "1",
    SENTRY_ENABLED: "false",
    BUILD_LOG_MEMORY_USAGE: process.env.BUILD_LOG_MEMORY_USAGE ?? "1",
    NODE_OPTIONS: withoutHeap,
  };
}

const onDigitalOceanAppPlatform = Boolean(String(process.env.DIGITALOCEAN_APP_ID ?? "").trim());
const postbuildCompilePass = truthyEnv("NN_POSTBUILD_NEXT_BUILD");
const forceSecondBuild = truthyEnv("NN_RUN_BUILDPACK_NEXT_BUILD");

console.log(
  `[buildpack-build] gate digitalOcean=${onDigitalOceanAppPlatform ? 1 : 0} postbuild_next_build=${postbuildCompilePass ? 1 : 0} force_second_build=${forceSecondBuild ? 1 : 0}`,
);

if (onDigitalOceanAppPlatform && !postbuildCompilePass && !forceSecondBuild) {
  console.log(
    "[buildpack-build] next_compile_skipped reason=digitalocean_buildpack_followup (compile ran in heroku-postbuild via NN_POSTBUILD_NEXT_BUILD=1 + node scripts/run-buildpack-build.mjs). Set NN_RUN_BUILDPACK_NEXT_BUILD=1 to force compile here.",
  );
  process.exit(0);
}

const runNextProd = path.join(packageRoot, "scripts", "run-next-prod-build.mjs");
console.log(
  `[buildpack-build] next_compile_start pid=${process.pid} postbuild_next_build=${postbuildCompilePass ? 1 : 0} digitalocean=${onDigitalOceanAppPlatform ? 1 : 0} (pathway lesson indexes run inside run-next-prod-build before next unless NN_SKIP_LESSON_INDEX_BUILD)`,
);
const t0 = Date.now();
const r = spawnSync(process.execPath, [runNextProd], {
  cwd: packageRoot,
  stdio: "inherit",
  env: buildCompileChildEnv(),
});
const ms = Date.now() - t0;
const ok = r.status === 0;
console.log(
  `[buildpack-build] next_compile_end ok=${ok ? 1 : 0} status=${r.status ?? "null"} duration_ms=${ms}`,
);
process.exit(ok ? 0 : r.status ?? 1);
