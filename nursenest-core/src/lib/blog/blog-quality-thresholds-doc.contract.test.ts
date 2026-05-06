/**
 * Keeps governance threshold documentation aligned with code (no duplicate numeric tables).
 * @see docs/blog-quality-thresholds.md — ISSUE-008 (SAFE_FOR_AI audit).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..", "..", "..");
const docPath = path.join(packageRoot, "docs", "blog-quality-thresholds.md");

test("blog-quality-thresholds.md points at code and avoids duplicate value tables", () => {
  const text = fs.readFileSync(docPath, "utf8");
  assert.match(text, /blog-quality-score\.ts/, "doc must reference the TypeScript source file");
  assert.match(
    text,
    /single source of truth/i,
    "doc must state single source of truth (prevents drift from duplicated markdown tables)",
  );
  const pipeTableRows = (text.match(/\|[^|\n]+\|[^|\n]+\|/g) ?? []).length;
  assert.ok(
    pipeTableRows === 0,
    `expected no markdown pipe tables (numeric drift); found ${pipeTableRows} row-like matches`,
  );
});
