import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..", "..", "..");
const AUDIT_SCRIPT = path.join(REPO_ROOT, "scripts", "audit-lesson-clinical-depth.mjs");

describe("lesson clinical depth audit (CLI)", () => {
  it("runs audit script and writes JSON summary with multi-tier scan", () => {
    assert.ok(fs.existsSync(AUDIT_SCRIPT), `missing ${AUDIT_SCRIPT}`);
    const outFile = path.join(os.tmpdir(), `lesson-clinical-depth-test-${process.pid}.json`);
    try {
      execFileSync(process.execPath, [AUDIT_SCRIPT, `--json-out=${outFile}`], {
        cwd: REPO_ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      const parsed = JSON.parse(fs.readFileSync(outFile, "utf8"));
      assert.ok(parsed.summary);
      assert.ok(parsed.summary.scannedLessons >= 2000, "expected bundled scan across RN/PN/NP/allied/new-grad");
      assert.ok(Array.isArray(parsed.rows));
      assert.equal(typeof parsed.summary.criticalCount, "number");
      const tiers = Object.keys(parsed.summary.byTier ?? {});
      assert.ok(tiers.includes("rn"), "expected RN tier in scan");
    } finally {
      try {
        fs.unlinkSync(outFile);
      } catch {
        /* ignore */
      }
    }
  });

  it("supports --tier=rn filter (rows are RN pathway only)", () => {
    const outFile = path.join(os.tmpdir(), `lesson-clinical-depth-tier-rn-${process.pid}.json`);
    try {
      execFileSync(process.execPath, [AUDIT_SCRIPT, "--tier=rn", `--json-out=${outFile}`], {
        cwd: REPO_ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      const parsed = JSON.parse(fs.readFileSync(outFile, "utf8"));
      assert.ok(parsed.summary.scannedLessons >= 500, "expected large RN-only slice");
      for (const row of parsed.rows) {
        assert.equal(row.tier, "rn", `non-RN tier row: ${row.slug} ${row.pathwayId}`);
      }
    } finally {
      try {
        fs.unlinkSync(outFile);
      } catch {
        /* ignore */
      }
    }
  });

  it("optional --enforce gate (set ENFORCE_LESSON_DEPTH=1 in CI when editorial baseline is ready)", () => {
    if (process.env.ENFORCE_LESSON_DEPTH !== "1") return;
    execFileSync(process.execPath, [AUDIT_SCRIPT, "--enforce"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  });
});
