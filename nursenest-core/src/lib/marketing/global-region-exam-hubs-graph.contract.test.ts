import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

test("global-region-exam-hubs does not static-import REGION_CONFIG (locale switch lives in -locale module)", () => {
  const src = readFileSync(join(dir, "global-region-exam-hubs.ts"), "utf8");
  assert.ok(
    !/\bimport\s*\{[^}]*REGION_CONFIG/.test(src),
    "hub-only consumers must not pull full global-regions registry at import time",
  );
});
