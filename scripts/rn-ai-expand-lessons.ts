/**
 * @deprecated Run from nursenest-core:
 *   cd nursenest-core && npx tsx scripts/rn-ai-expand-lessons.ts
 *
 * Shim: forwards to nursenest-core script with correct cwd for @/ imports.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, "../nursenest-core/scripts/rn-ai-expand-lessons.ts");
const pkgCore = path.join(__dirname, "../nursenest-core");
const tsxBin = path.join(pkgCore, "node_modules/.bin/tsx");
const r = spawnSync(tsxBin, [target, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: pkgCore,
  env: process.env,
});
process.exit(r.status === null ? 1 : r.status);
