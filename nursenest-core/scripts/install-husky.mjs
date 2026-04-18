import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function isTruthy(value) {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized !== "" && normalized !== "0" && normalized !== "false";
}

function shouldSkipHuskyInstall() {
  return process.env.NODE_ENV === "production" || isTruthy(process.env.CI) || isTruthy(process.env.DIGITALOCEAN_APP_ID);
}

if (shouldSkipHuskyInstall()) {
  console.log("[husky] skipping hook install for production/CI build");
  process.exit(0);
}

let huskyBin;
try {
  huskyBin = require.resolve("husky/bin.js");
} catch {
  console.log("[husky] package not available, skipping hook install");
  process.exit(0);
}

const result = spawnSync(process.execPath, [huskyBin, "nursenest-core/.husky"], {
  cwd: new URL("../..", import.meta.url),
  stdio: "inherit",
});

process.exit(result.status ?? 0);
