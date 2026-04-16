/**
 * Remove `.next` before Playwright paid E2E so Turbopack does not reuse a stale instrumentation /
 * perf-log graph (Edge bundle errors + flaky dev server).
 *
 * Safe: only deletes the local build output directory under this package.
 */
const fs = require("node:fs");
const path = require("node:path");

const dir = path.resolve(__dirname, "..", ".next");
if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("[e2e] removed .next for a clean dev-server / instrumentation compile");
}
