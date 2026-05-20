import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyNursingContent, classifyPathwayLessonRecordForHub, classifyStrings } from "@/lib/taxonomy/classifier";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

describe("taxonomy classifier", () => {
  it("prioritizes renal / GU over generic fundamentals-style copy", () => {
    const r = classifyNursingContent({
      title: "fundamentals prioritization acute kidney injury triage",
    });
    assert.equal(r.domain, "CLINICAL");
    assert.equal(r.categoryId, "renal_genitourinary");
  });

  it("classifies pure professional copy into a professional-practice leaf", () => {
    const r = classifyNursingContent({
      title: "Nursing scope of practice and delegation in long-term care",
    });
    assert.equal(r.domain, "PROFESSIONAL_PRACTICE");
    assert.ok(r.categoryId === "delegation_supervision" || r.categoryId === "scope_of_practice");
  });

  it("uses full lesson corpus for hub classification and clinical wins over professional labels", () => {
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
    assert.equal(r.domain, "CLINICAL");
    assert.ok(r.categoryId === "immune_infectious" || r.categoryId === "cardiovascular");
  });

  it("does not treat short renal token `uti` as a hit inside unrelated words (e.g. therapeutic)", () => {
    const r = classifyStrings({
      title: "SBAR therapeutic handoff",
      placementStrictUnique: true,
    });
    assert.equal(r.scores.renal_genitourinary ?? 0, 0);
    assert.equal(r.domain, "PROFESSIONAL_PRACTICE");
    assert.equal(r.category, "communication");
  });
});
