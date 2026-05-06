/**
 * Prevent editor backup files (e.g. *.save) from living under `src/` — they are not part of the
 * Next module graph but confuse search, reviews, and duplicate-route audits.
 */
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..");

test("src/ has no *.save editor backup files", () => {
  const out = execSync('find src -name "*.save" 2>/dev/null || true', {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  assert.equal(
    out,
    "",
    `Remove stray *.save files from src/ (git history retains content). Found:\n${out || "(none)"}`,
  );
});
