#!/usr/bin/env node
/**
 * Production-surface regression gate (no running web server required).
 * Runs static marketing JSON checks, robots source contract, theme palette coverage,
 * forbidden visible-copy rules, and public route manifest integrity.
 *
 * Optional HTTP smoke (requires reachable BASE_URL):
 *   PRODUCTION_SURFACE_HTTP=1 BASE_URL=http://127.0.0.1:3000 npm run validate:production-public-html
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runNpmScript(script) {
  console.log(`[validate:production-surface] npm run ${script}`);
  execFileSync(npmCommand, ["run", script], { cwd: pkgRoot, stdio: "inherit" });
}

function runTsxTest(relPath) {
  const abs = path.join(pkgRoot, relPath);
  console.log(`[validate:production-surface] node --test ${relPath}`);
  execFileSync(process.execPath, ["--import", "tsx", "--test", abs], {
    cwd: pkgRoot,
    stdio: "inherit",
  });
}

function main() {
  runNpmScript("validate:marketing-production-surface");

  runTsxTest("src/lib/validation/production-public-route-manifest.contract.test.ts");
  runTsxTest("src/lib/validation/forbidden-production-text.contract.test.ts");
  runTsxTest("src/lib/theme/theme-registry-palette-coverage.contract.test.ts");
  runTsxTest("src/lib/seo/robots-route-source.contract.test.ts");

  if (/^(1|true|yes)$/i.test(String(process.env.PRODUCTION_SURFACE_HTTP ?? "").trim())) {
    runNpmScript("validate:production-public-html");
  } else {
    console.log(
      "[validate:production-surface] skip HTTP HTML smoke (set PRODUCTION_SURFACE_HTTP=1 and BASE_URL to enable `validate:production-public-html`).",
    );
  }

  console.log("[validate:production-surface] OK");
}

main();
