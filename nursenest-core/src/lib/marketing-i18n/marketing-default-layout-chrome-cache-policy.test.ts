/**
 * Contract: default `(marketing)/(default)` chrome must not cache an empty shard merge.
 *
 * A transient startup/i18n failure must not poison the singleton cache forever.
 * The runtime file must:
 * - assign `defaultChromeState.resolved = out` only after confirming `out` has keys
 * - clear the in-flight promise on failure
 * - avoid treating `{}` as a valid resolved chrome bundle
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, "marketing-layout-chrome-messages.server.ts");

function readTarget(): string {
  assert.ok(
    fs.existsSync(target),
    `expected runtime file to exist at ${target}`,
  );

  return fs.readFileSync(target, "utf8");
}

test("default marketing layout chrome only commits resolved cache when bundle is non-empty", () => {
  const src = readTarget();

  const resolvedAssignment = "defaultChromeState.resolved = out";
  const idxResolved = src.indexOf(resolvedAssignment);

  assert.ok(
    idxResolved > 0,
    `expected ${resolvedAssignment} in marketing-layout-chrome-messages.server.ts`,
  );

  const guardWindow = src.slice(Math.max(0, idxResolved - 700), idxResolved + resolvedAssignment.length + 200);

  assert.match(
    guardWindow,
    /Object\.keys\(out\)\.length\s*>\s*0/,
    "defaultChromeState.resolved must only be set after Object.keys(out).length > 0",
  );

  assert.doesNotMatch(
    guardWindow,
    /defaultChromeState\.resolved\s*=\s*out\s*;?\s*(?![\s\S]*Object\.keys\(out\)\.length\s*>\s*0)/,
    "empty chrome output must not be cached as resolved",
  );
});

test("default marketing layout chrome clears in-flight promise after rejection", () => {
  const src = readTarget();

  assert.match(
    src,
    /defaultChromeState\.loading\s*=\s*p/,
    "expected runtime to track in-flight chrome load promise",
  );

  assert.match(
    src,
    /\.catch\([\s\S]*defaultChromeState\.loading\s*=\s*null[\s\S]*throw\s+err[\s\S]*\)/,
    "failed chrome load must clear defaultChromeState.loading and rethrow",
  );
});

test("default marketing layout chrome has an explicit empty-bundle recovery path", () => {
  const src = readTarget();

  assert.match(
    src,
    /Object\.keys\(out\)\.length\s*===?\s*0|Object\.keys\(out\)\.length\s*<\s*1/,
    "runtime should explicitly detect empty merged chrome bundles",
  );

  assert.match(
    src,
    /defaultChromeState\.resolved\s*=\s*null|defaultChromeState\.loading\s*=\s*null/,
    "empty chrome bundle path should avoid leaving poisoned singleton state",
  );
});