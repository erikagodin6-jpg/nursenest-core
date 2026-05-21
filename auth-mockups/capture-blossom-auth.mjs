#!/usr/bin/env node
/**
 * Export Blossom auth PNG mockups from blossom-auth-premium-gallery.html
 *
 * From repo root:
 *   cd nursenest-core && npx playwright test tests/e2e/preview/blossom-auth.capture.spec.ts --project=chromium
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coreDir = join(__dirname, "..", "nursenest-core");
const spec = "tests/e2e/preview/blossom-auth.capture.spec.ts";

const r = spawnSync(
  "npx",
  ["playwright", "test", spec, "--project=chromium"],
  { cwd: coreDir, stdio: "inherit", shell: true },
);

process.exit(r.status ?? 1);
