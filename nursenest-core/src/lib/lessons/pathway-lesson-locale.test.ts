import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PATHWAY_LESSON_CANONICAL_DB_LOCALE,
  pickPathwayLessonListWarehouseLocale,
} from "@/lib/lessons/pathway-lesson-locale";

describe("pickPathwayLessonListWarehouseLocale", () => {
  it("prefers requested locale when it has published rows", () => {
    assert.equal(
      pickPathwayLessonListWarehouseLocale({
        localeCounts: [
          { locale: "en", count: 50 },
          { locale: "es", count: 3 },
        ],
        requestedLocale: "es",
      }),
      "es",
    );
  });

  it("does not let a tiny en shard hide a dominant non-English corpus (RN hub shrink root cause)", () => {
    assert.equal(
      pickPathwayLessonListWarehouseLocale({
        localeCounts: [
          { locale: "en", count: 1 },
          { locale: "fr", count: 799 },
        ],
        requestedLocale: "en",
      }),
      "fr",
    );
  });

  it("uses English when it is the dominant warehouse", () => {
    assert.equal(
      pickPathwayLessonListWarehouseLocale({
        localeCounts: [
          { locale: "en", count: 400 },
          { locale: "fr", count: 12 },
        ],
        requestedLocale: "de",
      }),
      "en",
    );
  });

  it("when marketing requests en but another locale clearly holds the corpus, list that locale", () => {
    assert.equal(
      pickPathwayLessonListWarehouseLocale({
        localeCounts: [
          { locale: "en", count: 50 },
          { locale: "fr", count: 200 },
        ],
        requestedLocale: "en",
      }),
      "fr",
    );
  });

  it("breaks ties toward canonical English when the viewer has no locale preference", () => {
    assert.equal(
      pickPathwayLessonListWarehouseLocale({
        localeCounts: [
          { locale: "fr", count: 100 },
          { locale: "en", count: 100 },
        ],
        requestedLocale: "de",
      }),
      PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    );
  });
});
