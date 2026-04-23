import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  canonicalHubLessonDisplayTitle,
  hubLessonPresentationRank,
  organizeHubLessonsForPresentation,
} from "./pathway-lesson-hub-organize";

function row(partial: Partial<PathwayLessonRecord> & Pick<PathwayLessonRecord, "slug" | "title">): PathwayLessonRecord {
  return {
    topic: "Topic",
    topicSlug: partial.topicSlug ?? "fluid-balance",
    system: "cardiovascular",
    bodySystem: "cardiovascular",
    previewSectionCount: 2,
    seoTitle: partial.seoTitle ?? partial.title,
    seoDescription: "d",
    sections: [],
    examRelevance: partial.examRelevance ?? "core",
    ...partial,
  } as PathwayLessonRecord;
}

describe("pathway-lesson-hub-organize", () => {
  it("dedupes duplicate slugs keeping higher presentation rank", () => {
    const low = row({
      slug: "same-slug",
      title: "HF basics",
      examRelevance: "specialty",
      previewSectionCount: 1,
    });
    const high = row({
      slug: "same-slug",
      title: "HF basics — variant",
      examRelevance: "high_yield",
      previewSectionCount: 5,
    });
    const out = organizeHubLessonsForPresentation([low, high], "us-rn-nclex-rn");
    assert.equal(out.length, 1);
    assert.equal(out[0]!.slug, "same-slug");
    assert.equal(out[0]!.examRelevance, "high_yield");
  });

  it("dedupes different slugs with same topic + normalized learner title", () => {
    const a = row({
      slug: "fluid-balance-a",
      title: "Fluid balance — NCLEX-RN US",
      topicSlug: "fluid-balance",
      examRelevance: "core",
    });
    const b = row({
      slug: "fluid-balance-b",
      title: "Fluid balance (NCLEX-RN)",
      topicSlug: "fluid-balance",
      examRelevance: "high_yield",
    });
    const out = organizeHubLessonsForPresentation([a, b], "us-rn-nclex-rn");
    assert.equal(out.length, 1);
    assert.equal(out[0]!.slug, "fluid-balance-b");
  });

  it("ranks high_yield above specialty for tie-breaking input order", () => {
    const a = row({ slug: "x", title: "A", examRelevance: "high_yield" });
    const b = row({ slug: "y", title: "B", examRelevance: "specialty" });
    assert.ok(hubLessonPresentationRank(a) > hubLessonPresentationRank(b));
  });

  it("canonicalHubLessonDisplayTitle strips pathway noise from seoTitle", () => {
    const lesson = row({
      slug: "z",
      title: "COPD — NCLEX-RN US",
      seoTitle: "COPD — NCLEX-RN US",
    });
    const t = canonicalHubLessonDisplayTitle(lesson);
    assert.ok(!/\bnclex\b/i.test(t) || t.length < lesson.title.length);
  });
});
