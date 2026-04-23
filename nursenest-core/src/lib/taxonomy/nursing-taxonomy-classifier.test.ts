import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyNursingContent,
  classifyPathwayLessonRecordForHub,
} from "@/lib/taxonomy/nursing-taxonomy-classifier";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

describe("nursing-taxonomy-classifier", () => {
  it("prioritizes renal / GU over generic fundamentals copy", () => {
    const r = classifyNursingContent({
      title: "fundamentals prioritization acute kidney injury triage",
    });
    assert.equal(r.domain, "clinical");
    assert.equal(r.categoryId, "renal-genitourinary");
  });

  it("classifies pure professional copy to professional practice hub", () => {
    const r = classifyNursingContent({
      title: "Nursing scope of practice and delegation in long-term care",
    });
    assert.equal(r.domain, "professional");
    assert.equal(r.categoryId, "professional-practice-ethics");
  });

  it("uses full lesson corpus for hub classification", () => {
    const lesson = {
      title: "Professional communication",
      topic: "Overview",
      topicSlug: "overview",
      bodySystem: "Professional Practice",
      seoDescription: "Sepsis recognition bundles and lactate clearance",
      system: "",
      sections: [{ id: "1", heading: "Clinical", kind: "article" as const, body: "<p>Patient with septic shock and hypotension</p>" }],
    } as Pick<PathwayLessonRecord, "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections">;
    const r = classifyPathwayLessonRecordForHub(lesson);
    assert.equal(r.domain, "clinical");
    assert.ok(r.categoryId !== "professional-practice-ethics");
    assert.ok(r.categoryId === "immune-infectious" || r.categoryId === "cardiovascular");
  });
});
