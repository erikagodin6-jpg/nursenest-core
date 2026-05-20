/**
 * Run: `node --import tsx --test src/app/api/learner/adaptive-recommendations/route.contract.test.ts`
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("GET /api/learner/adaptive-recommendations is subscriber-gated and non-cacheable", () => {
  const src = readFileSync(join(process.cwd(), "src/app/api/learner/adaptive-recommendations/route.ts"), "utf8");
  assert.match(src, /requireSubscriberSession/);
  assert.match(src, /force-dynamic/);
  assert.match(src, /mergeSubscriberPrivateCacheHeaders/);
  assert.match(src, /isAdaptiveLearningEnabled/);
});
