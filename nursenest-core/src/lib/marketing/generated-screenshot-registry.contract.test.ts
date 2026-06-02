import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  GENERATED_SCREENSHOT_REGISTRY,
  generatedScreenshotInventory,
} from "@/lib/marketing/generated-screenshot-registry";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function publicPathExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  return fs.existsSync(path.join(PUBLIC_DIR, src.slice(1)));
}

test("every generated marketing screenshot path exists on disk", () => {
  for (const record of generatedScreenshotInventory()) {
    assert.ok(
      publicPathExists(record.path),
      `${record.key} should resolve to an existing generated screenshot: ${record.path}`,
    );
  }
});

test("registry uses one canonical path per key (no dual primary/fallback paths)", () => {
  for (const record of generatedScreenshotInventory()) {
    assert.equal(
      record.status,
      "current",
      `${record.key} should be current — wire only existing captures, not missing tier paths`,
    );
  }
});

test("pricing tier value has current generated tier hub screenshots", () => {
  assert.equal(
    GENERATED_SCREENSHOT_REGISTRY.rnMarketingHub.status,
    "current",
  );
  assert.equal(
    GENERATED_SCREENSHOT_REGISTRY.pnMarketingHub.status,
    "current",
  );
  assert.equal(
    GENERATED_SCREENSHOT_REGISTRY.npMarketingHub.status,
    "current",
  );
  assert.equal(
    GENERATED_SCREENSHOT_REGISTRY.alliedMarketingHub.status,
    "current",
  );
  assert.equal(
    GENERATED_SCREENSHOT_REGISTRY.newGradMarketingHub.status,
    "current",
  );
});
