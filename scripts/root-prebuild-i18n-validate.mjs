#!/usr/bin/env node
/**
 * Root `prebuild` gate after `i18n:compile`.
 *
 * Production deploys must not be blocked by strict multi-locale editorial drift. Strict i18n validation
 * remains available as an explicit quality gate via NN_STRICT_I18N_PREBUILD=1, but the root build path
 * should match App Platform behavior and continue after compile unless strict validation is deliberately requested.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const explicitSkip = /^(1|true|yes)$/i.test(process.env.SKIP_I18N_PREBUILD ?? "");
const strictRequested = /^(1|true|yes)$/i.test(process.env.NN_STRICT_I18N_PREBUILD ?? "");

if (explicitSkip || !strictRequested) {
  console.log(
    "[root-prebuild] strict i18n validation skipped. Set NN_STRICT_I18N_PREBUILD=1 to run npm run i18n:validate:production.",
  );
  process.exit(0);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const r = spawnSync(npm, ["run", "i18n:validate:production"], { cwd: root, stdio: "inherit" });
process.exit(r.status === 0 ? 0 : r.status ?? 1);
