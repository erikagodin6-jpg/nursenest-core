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

/** Combined registry prose must surface core product keywords for marketing QA. */
test("SCREENSHOT_REGISTRY: includes expected learner surface keywords", () => {
  const blob = SCREENSHOT_REGISTRY.map((r) => `${r.label} ${r.description} ${r.alt ?? ""}`).join(
    "\n",
  );
  const lower = blob.toLowerCase();
  assert.match(lower, /lesson/, "expected lesson mention");
  assert.match(lower, /flashcard/, "expected flashcard mention");
  assert.match(lower, /dashboard/, "expected dashboard mention");
  assert.match(lower, /progress|readiness/, "expected progress or readiness mention");
  assert.match(lower, /\bcat\b|adaptive/, "expected CAT or adaptive exam mention");
  assert.match(lower, /ecg|telemetry|rhythm/, "expected ECG / telemetry mention");
});

/** Avoid legacy placeholder language in user-visible carousel metadata. */
test("SCREENSHOT_REGISTRY: rejects legacy / demo placeholder wording", () => {
  const banned =
    /\b(placeholder|lorem\b|todo\b|tbd\b|screenshot demo|demo screenshot|legacy carousel|sample image)\b|(\{\{)|(pages|components)\.[a-z][a-z0-9_.]*\.[a-z]/i;
  for (const r of SCREENSHOT_REGISTRY) {
    for (const field of [r.label, r.description, r.alt ?? ""] as const) {
      assert.ok(
        !banned.test(field),
        `id ${r.id}: metadata must not match placeholder pattern — got: ${field.slice(0, 120)}`,
      );
    }
  }
});

const FORBIDDEN_REGISTRY_MARKETING = [
  /\{\{/,
  /\}\}/,
  /\{\{\s*count\s*\}\}/,
  /\blorem\b/i,
  /\bplaceholder\b/i,
  /\blogacy\b/i,
  /\bTODO\b/i,
  /\bdemo\b/i,
];

test("SCREENSHOT_REGISTRY: copy avoids placeholder / legacy leak patterns", () => {
  for (const r of SCREENSHOT_REGISTRY) {
    const blob = `${r.label}\n${r.description}\n${r.alt ?? ""}`;
    for (const re of FORBIDDEN_REGISTRY_MARKETING) {
      assert.ok(
        !re.test(blob),
        `id ${r.id}: disallowed pattern ${re} in label/description/alt`,
      );
    }
  }
});

test("SCREENSHOT_REGISTRY: mentions core live product surfaces across entries", () => {
  const blob = SCREENSHOT_REGISTRY.map((r) => `${r.label} ${r.description} ${r.alt ?? ""}`).join("\n");
  const checks: Array<{ label: string; ok: boolean }> = [
    { label: "lesson", ok: /lesson/i.test(blob) },
    { label: "flashcard", ok: /flashcard/i.test(blob) },
    { label: "dashboard", ok: /dashboard|study hub/i.test(blob) },
    { label: "CAT", ok: /\bCAT\b/i.test(blob) },
    { label: "progress/report", ok: /progress|report|accuracy/i.test(blob) },
    { label: "practice/questions", ok: /practice|question bank|rationale/i.test(blob) },
    { label: "ECG/telemetry", ok: /ECG|telemetry/i.test(blob) },
  ];
  for (const c of checks) {
    assert.ok(c.ok, `registry bundle should mention ${c.label} for marketing fidelity`);
  }
});
