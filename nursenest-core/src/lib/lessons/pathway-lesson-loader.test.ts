/**
 * Loads `pathway-lesson-loader` → i18n overlay modules → `import "server-only"`.
 * Eager stub must run before the loader graph loads (tsx can bypass `NODE_OPTIONS --require` alone).
 * `npm run test:pathway-lessons` still sets `NODE_OPTIONS` for the second batch as a belt-and-suspenders guard.
 *
 * **Bare `node --import tsx --test pathway-lesson-loader.test.ts`:** can still fail with `server-only` if the stub
 * does not load first — that is a test-runner harness constraint, not a signal that premium-normalization or
 * `PathwayLesson` read paths are broken. Prefer `npm run test:pathway-lessons` or run this file only with the stub.
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPathwayLesson } from "./pathway-lesson-loader";

describe("pathway-lesson-loader normalization", () => {
  it("returns five ordered legacy sections for a known catalog lesson", async () => {
    const lesson = await getPathwayLesson("ca-rn-nclex-rn", "fluid-balance-acute-care");
    assert.ok(lesson);
    assert.equal(lesson!.sections.length, 5);
    const kinds = lesson!.sections.map((s) => s.kind);
    assert.deepEqual(kinds, [
      "clinical_meaning",
      "exam_relevance",
      "core_concept",
      "clinical_scenario",
      "takeaways",
    ]);
    for (const s of lesson!.sections) {
      assert.ok(typeof s.body === "string" && s.body.length > 0, `empty body for ${s.kind}`);
    }
    assert.ok(lesson!.previewSectionCount >= 1 && lesson!.previewSectionCount <= lesson!.sections.length);
    assert.ok(lesson!.structuralQuality);
    assert.equal(lesson!.structuralQuality!.structureMode, "legacy");
    assert.equal(lesson!.structuralQuality!.publicComplete, true);
  });

  it("returns undefined for unknown slug", async () => {
    assert.equal(await getPathwayLesson("ca-rn-nclex-rn", "does-not-exist-zzz"), undefined);
  });

  it("injects scoped COPD gold-standard lesson from TS (catalog supplement)", async () => {
    const lesson = await getPathwayLesson("us-rn-nclex-rn", "copd-clinical-judgment-gold");
    assert.ok(lesson);
    assert.ok(lesson!.sections.length >= 10);
    assert.equal(lesson!.structuralQuality?.structureMode, "premium");
    assert.equal(lesson!.structuralQuality?.publicComplete, true);
    assert.match(lesson!.title, /COPD/i);
    assert.equal(lesson!.slug, "copd-clinical-judgment-gold");
    assert.ok((lesson!.preTest?.length ?? 0) >= 3);
  });
});
