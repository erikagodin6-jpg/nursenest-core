#!/usr/bin/env node
/**
 * Heroku / DigitalOcean App Platform invoke `npm run build` after `npm install` and `heroku-postbuild`.
 *
 * DigitalOcean documents `heroku-postbuild` as running **before** prune/cache. We run
 * `NN_POSTBUILD_NEXT_BUILD=1 npm run build` there so `next build` creates `.next/cache` for the
 * `cacheDirectories` snapshot.
 *
 * When **both** `heroku-postbuild` and `build` exist, the Heroku Node buildpack runs **only**
 * `heroku-postbuild` (not the `build` script). That `npm run build` chain still runs from inside
 * `heroku-postbuild` above. Local / CI / droplets omit `DIGITALOCEAN_APP_ID` → compile here when invoked.
 *
 * Set `NN_RUN_BUILDPACK_NEXT_BUILD=1` on DO to force a second `next build` (debug / parity).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? ""));
}

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const onDigitalOceanAppPlatform = Boolean(String(process.env.DIGITALOCEAN_APP_ID ?? "").trim());
const postbuildCompilePass = truthyEnv("NN_POSTBUILD_NEXT_BUILD");
const forceSecondBuild = truthyEnv("NN_RUN_BUILDPACK_NEXT_BUILD");

console.log(
  `[buildpack-build] gate digitalOcean=${onDigitalOceanAppPlatform ? 1 : 0} postbuild_next_build=${postbuildCompilePass ? 1 : 0} force_second_build=${forceSecondBuild ? 1 : 0}`,
);

if (onDigitalOceanAppPlatform && !postbuildCompilePass && !forceSecondBuild) {
  console.log(
    "[build] DigitalOcean App Platform: skipping `next build` here (compile ran in heroku-postbuild with NN_POSTBUILD_NEXT_BUILD=1; Heroku buildpack does not invoke this `build` script when heroku-postbuild exists). Set NN_RUN_BUILDPACK_NEXT_BUILD=1 to force compile here.",
  );
  process.exit(0);
}

const t0 = Date.now();
const r = spawnSync(npm, ["run", "build:compile"], { cwd: packageRoot, stdio: "inherit" });
console.log(`[buildpack-build] npm_run_build_compile duration_ms=${Date.now() - t0}`);
process.exit(r.status === 0 ? 0 : r.status ?? 1);
