import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const skipPrebuild = /^(1|true|yes)$/i.test(process.env.SKIP_I18N_PREBUILD ?? "");

const marketingSurfaceScript = path.join(packageRoot, "scripts", "validate-marketing-production-surface.mjs");
console.log("[build-prechecks] running validate-marketing-production-surface.mjs (always)");
execFileSync(process.execPath, [marketingSurfaceScript], {
  cwd: packageRoot,
  stdio: "inherit",
});

if (skipPrebuild) {
  console.log("[build-prechecks] skipping heavy i18n merge audits (SKIP_I18N_PREBUILD=1)");
  process.exit(0);
}

for (const scriptName of ["i18n:validate-production", "i18n:validate-chrome"]) {
  console.log(`[build-prechecks] running ${scriptName}`);
  execFileSync(npmCommand, ["run", scriptName], {
    cwd: packageRoot,
    stdio: "inherit",
  });
}
