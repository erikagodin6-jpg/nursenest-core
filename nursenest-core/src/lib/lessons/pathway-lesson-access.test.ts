import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { visibleSectionsForLesson } from "./pathway-lesson-visible-sections";

function makeLesson(overrides: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  const sections = Array.from({ length: 5 }, (_, i) => ({
    id: `s${i}`,
    heading: `H${i}`,
    kind: "clinical_meaning" as const,
    body: `body-${i}`,
  }));
  return {
    slug: "x",
    title: "T",
    topic: "tp",
    topicSlug: "tp-slug",
    bodySystem: "G",
    previewSectionCount: 1,
    seoTitle: "seo",
    seoDescription: "desc",
    sections,
    ...overrides,
  };
}

describe("visibleSectionsForLesson", () => {
  it("returns all sections when full access", () => {
    const lesson = makeLesson({});
    assert.equal(visibleSectionsForLesson(lesson, true).length, 5);
  });

  it("returns only preview slice when locked", () => {
    const lesson = makeLesson({ previewSectionCount: 1 });
    const v = visibleSectionsForLesson(lesson, false);
    assert.equal(v.length, 1);
    assert.equal(v[0].body, "body-0");
  });

  it("always returns one section when locked", () => {
    const lesson = makeLesson({ previewSectionCount: 99 });
    assert.equal(visibleSectionsForLesson(lesson, false).length, 1);
  });

  it("caps preview text to safe snippet length", () => {
    const longBody = Array.from({ length: 260 }, (_, i) => `word${i}`).join(" ");
    const lesson = makeLesson({
      sections: [{ id: "s0", heading: "H0", kind: "clinical_meaning", body: longBody }],
    });
    const v = visibleSectionsForLesson(lesson, false);
    assert.equal(v.length, 1);
    assert.equal(v[0].body.endsWith("..."), true);
    assert.equal(v[0].body.split(" ").length, 180);
  });

  it("returns empty when no sections and locked", () => {
    const lesson = makeLesson({ sections: [], previewSectionCount: 1 });
    assert.deepEqual(visibleSectionsForLesson(lesson, false), []);
  });
});
