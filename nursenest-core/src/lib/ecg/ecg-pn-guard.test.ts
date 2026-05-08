import assert from "node:assert/strict";
import test from "node:test";
import { pnMayAccessEcgLessonSlug } from "@/lib/ecg/ecg-catalog";

test("PN guard blocks advanced slugs even if URL crafted", () => {
  assert.equal(pnMayAccessEcgLessonSlug("acls-rhythm-prioritization"), false);
  assert.equal(pnMayAccessEcgLessonSlug("12-lead-basics"), false);
  assert.equal(pnMayAccessEcgLessonSlug("ventricular-tachycardia"), false);
  assert.equal(pnMayAccessEcgLessonSlug("normal-sinus-rhythm"), true);
});
