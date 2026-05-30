import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const VALIDATOR = join(ROOT, "scripts/validate-client-server-boundaries.mjs");
const JSON_REPORT = join(ROOT, "reports/client-server-boundary-report.json");
const MD_REPORT = join(ROOT, "reports/server-client-boundary-audit.md");

test("client modules do not reach server-only runtime imports", () => {
  const result = spawnSync(process.execPath, [VALIDATOR, "--scope=all"], {
    cwd: ROOT,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(existsSync(JSON_REPORT), true);
  assert.equal(existsSync(MD_REPORT), true);

  const report = JSON.parse(readFileSync(JSON_REPORT, "utf8"));
  assert.equal(report.scope, "all");
  assert.equal(report.violations.length, 0);
});
