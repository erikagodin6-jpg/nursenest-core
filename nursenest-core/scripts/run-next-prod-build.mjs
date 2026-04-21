#!/usr/bin/env node
/**
 * Runs `next build --webpack` with a clean bundler environment.
 *
 * Next.js 16 defaults to **Turbopack** when no bundler is selected (`next/dist/lib/bundler.js`).
 * If the host sets `TURBOPACK` (or related test flags), `parseBundlerArgs` can select Turbopack **even when**
 * the intent is webpack — or it can error when both conflict. Turbopack production builds use
 * `turbopackBuild` and do **not** populate `.next/cache/webpack`, so Heroku/DO `cacheDirectories` for
 * `.next/cache` stays empty and the buildpack logs ".next/cache (not cached - skipping)".
 *
 * This wrapper deletes only bundler-selection env keys, then spawns the Next CLI. Runtime behavior
 * of the app is unchanged (build-time only).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);

const BUNDLER_ENV_KEYS = ["TURBOPACK", "IS_TURBOPACK_TEST", "NEXT_RSPACK", "NEXT_TEST_USE_RSPACK"];

const stripped = [];
for (const key of BUNDLER_ENV_KEYS) {
  if (Object.prototype.hasOwnProperty.call(process.env, key)) {
    stripped.push(`${key}=${String(process.env[key])}`);
    delete process.env[key];
  }
}
if (stripped.length > 0) {
  console.log(
    "[next-prod-build] stripped_bundler_env=" +
      JSON.stringify(stripped) +
      " note=host-injected Turbopack/Rspack flags would skip webpack filesystem cache (.next/cache/webpack)",
  );
} else {
  console.log("[next-prod-build] stripped_bundler_env=[] note=webpack disk cache path should populate under .next/cache/webpack");
}

let nextBin;
try {
  const nextPkg = require.resolve("next/package.json");
  nextBin = path.join(path.dirname(nextPkg), "dist", "bin", "next");
} catch {
  console.error("[next-prod-build] FATAL: could not resolve next/package.json (run npm ci from nursenest-core)");
  process.exit(1);
}

if (!existsSync(nextBin)) {
  console.error(`[next-prod-build] FATAL: Next CLI missing at ${nextBin}`);
  process.exit(1);
}

const r = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(r.status === 0 ? 0 : r.status ?? 1);
