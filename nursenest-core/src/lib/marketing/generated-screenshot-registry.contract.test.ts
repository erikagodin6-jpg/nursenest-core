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

test("current generated marketing screenshots exist on disk", () => {
  for (const record of generatedScreenshotInventory()) {
    if (record.status !== "current") continue;
    assert.ok(
      publicPathExists(record.path),
      `${record.key} should resolve to an existing generated screenshot: ${record.path}`,
    );
  }
});

test("all generated screenshot fallbacks resolve on disk", () => {
  for (const record of generatedScreenshotInventory()) {
    assert.ok(
      publicPathExists(record.fallbackPath),
      `${record.key} fallback should resolve on disk: ${record.fallbackPath}`,
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
