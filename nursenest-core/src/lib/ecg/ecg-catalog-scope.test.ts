import assert from "node:assert/strict";
import test from "node:test";
import { ECG_CATALOG, ecgCatalogForSegment, pnMayAccessEcgLessonSlug } from "@/lib/ecg/ecg-catalog";

test("PN catalog excludes advanced modules", () => {
  const pn = ecgCatalogForSegment("pn");
  const slugs = new Set(pn.map((p) => p.slug));
  assert.equal(slugs.has("12-lead-basics"), false);
  assert.equal(slugs.has("ischemia-stemi-patterns"), false);
  assert.equal(slugs.has("electrolytes-ecg-changes"), false);
  assert.equal(slugs.has("qt-prolongation-medications"), false);
  assert.equal(slugs.has("acls-rhythm-prioritization"), false);
  assert.equal(slugs.has("ventricular-tachycardia"), false);
  assert.equal(slugs.has("ventricular-fibrillation"), false);
  assert.equal(slugs.has("heart-blocks"), false);
  assert.equal(slugs.has("paced-rhythms"), false);
  assert.equal(slugs.has("svt"), false);
  assert.equal(slugs.has("normal-sinus-rhythm"), true);
});

test("pnMayAccessEcgLessonSlug matches catalog PN scope", () => {
  assert.equal(pnMayAccessEcgLessonSlug("atrial-fibrillation"), true);
  assert.equal(pnMayAccessEcgLessonSlug("12-lead-basics"), false);
});

test("RN catalog includes advanced topics", () => {
  const rn = ecgCatalogForSegment("rn");
  assert.ok(rn.find((x) => x.slug === "12-lead-basics"));
});

test("catalog size matches curriculum checklist", () => {
  assert.equal(ECG_CATALOG.length, 17);
});
