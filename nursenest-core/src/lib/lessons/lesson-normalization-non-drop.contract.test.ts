import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCatalogLessonsRaw,
  listCatalogPathwayIdsWithLessonsSync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

describe("lesson normalization — RN / PN / NP / New Grad not silently dropped", () => {
  it("keeps New Grad pathway non-zero renderable when raw exists", () => {
    const pid = "us-rn-new-grad-transition";
    const raw = getCatalogLessonsRaw(pid);
    assert.ok(raw.length > 0);
    const ok = raw.filter((row) => normalizeLesson(row, pid).structuralQuality?.publicComplete).length;
    assert.ok(ok > 0, "expected at least one public-complete New Grad lesson");
  });

  it("marks all bundled CA RN lessons public-complete (no silent hub collapse)", () => {
    const pid = "ca-rn-nclex-rn";
    const raw = getCatalogLessonsRaw(pid);
    let complete = 0;
    for (const row of raw) {
      if (normalizeLesson(row, pid).structuralQuality?.publicComplete) complete += 1;
    }
    assert.equal(complete, raw.length);
  });

  it("lists allied pathways alongside RN hubs in catalog index", () => {
    const ids = listCatalogPathwayIdsWithLessonsSync();
    assert.ok(ids.includes("us-allied-core"));
    assert.ok(ids.includes("ca-allied-core"));
  });
});
