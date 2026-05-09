/**
 * Governance invariants for CDN marketing screenshots (`screenshot-registry.ts`).
 * Prevents silent drift: duplicate IDs, broken group references, empty labels.
 */
import assert from "node:assert/strict";
import test from "node:test";

import {
  SCREENSHOT_GROUPS,
  SCREENSHOT_REGISTRY,
  type ScreenshotId,
  type ScreenshotRecord,
} from "@/lib/marketing/screenshot-registry";

function collectIds(records: readonly ScreenshotRecord[]): ScreenshotId[] {
  return records.map((r) => r.id);
}

test("SCREENSHOT_REGISTRY: unique ids and contiguous 1..N coverage", () => {
  const ids = collectIds(SCREENSHOT_REGISTRY);
  const unique = new Set(ids);
  assert.equal(unique.size, ids.length, "duplicate screenshot id");

  const sorted = [...ids].sort((a, b) => a - b);
  const expectedLength = sorted.length;
  assert.equal(sorted[0], 1);
  assert.equal(sorted[expectedLength - 1], expectedLength);
  for (let i = 0; i < sorted.length; i++) {
    assert.equal(sorted[i], i + 1, `expected contiguous ids 1..${expectedLength}`);
  }
});

test("SCREENSHOT_REGISTRY: labels and descriptions are non-empty and bounded", () => {
  for (const r of SCREENSHOT_REGISTRY) {
    assert.ok(r.label.trim().length > 0, `id ${r.id}: empty label`);
    assert.ok(r.label.length <= 80, `id ${r.id}: label too long (${r.label.length})`);
    assert.ok(r.description.trim().length > 0, `id ${r.id}: empty description`);
    assert.ok(r.description.length <= 220, `id ${r.id}: description too long`);
    assert.ok((r.alt ?? "").length <= 240, `id ${r.id}: alt too long`);
  }
});

test("SCREENSHOT_GROUPS: every referenced id exists in registry", () => {
  const valid = new Set(collectIds(SCREENSHOT_REGISTRY));
  for (const [name, ids] of Object.entries(SCREENSHOT_GROUPS)) {
    for (const id of ids) {
      assert.ok(valid.has(id), `group "${name}" references missing id ${id}`);
    }
  }
});

test("SCREENSHOT_GROUPS.homepageHero covers every registry id exactly once", () => {
  const hero = [...SCREENSHOT_GROUPS.homepageHero];
  const regIds = collectIds(SCREENSHOT_REGISTRY);
  assert.equal(hero.length, new Set(hero).size, "homepageHero must not contain duplicate ids");
  assert.equal(hero.length, regIds.length, "homepageHero length must match registry count");
  const sortedHero = [...hero].sort((a, b) => a - b);
  const sortedReg = [...regIds].sort((a, b) => a - b);
  assert.deepEqual(sortedHero, sortedReg);
});
