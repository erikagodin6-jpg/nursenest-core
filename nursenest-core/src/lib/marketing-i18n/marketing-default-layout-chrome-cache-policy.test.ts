/**
 * Contract: default `(marketing)/(default)` chrome must not cache an empty shard merge,
 * or a transient startup failure wedges the process until restart (regressed before sync-fill retry).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, "marketing-layout-chrome-messages.server.ts");

test("default marketing layout chrome only commits resolved cache when bundle is non-empty", () => {
  const src = fs.readFileSync(target, "utf8");
  const idxResolved = src.indexOf("defaultChromeState.resolved = out");
  assert.ok(idxResolved > 0, "expected defaultChromeState.resolved = out");
  const windowStart = Math.max(0, idxResolved - 400);
  const prior = src.slice(windowStart, idxResolved);
  assert.match(
    prior,
    /Object\.keys\(out\)\.length > 0/,
    "resolved must only be set when out has keys (empty must not wedge singleton)",
  );
});
