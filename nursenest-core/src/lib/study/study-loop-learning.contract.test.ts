import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isStrictKebabTopicSlug, normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";
import {
  indexLessonsByPathwayTopic,
  planExamQuestionStudyLink,
  planFlashcardLessonLink,
  resolveUniqueLessonForTopic,
  type LessonTopicIndexRow,
} from "@/lib/study/study-content-link-plan";
import {
  buildAppFlashcardsTopicHref,
  buildAppLessonsReviewLessonHref,
  createStudyLinkHrefDeduper,
} from "@/lib/learner/app-study-internal-links";

describe("study loop learning contracts", () => {
  it("topic slug repair preserves valid strict kebab slugs", () => {
    assert.equal(isStrictKebabTopicSlug("fluid-balance"), true);
    assert.equal(normalizeTopicSlugInput("Fluid Balance"), "fluid-balance");
    assert.equal(isStrictKebabTopicSlug("Fluid-Balance"), false);
  });

  it("DB-level linking never crosses pathwayId for exam questions", () => {
    const lessons: LessonTopicIndexRow[] = [
      {
        id: "les-a",
        pathwayId: "p-a",
        slug: "lesson-a",
        title: "A",
        topicSlug: "cardio",
        topic: "Cardio",
        locale: "en",
        status: "PUBLISHED",
      },
    ];
    const idx = indexLessonsByPathwayTopic(lessons);
    const q = {
      id: "q1",
      exam: "nclex-rn",
      topic: "cardio",
      studyLinkPathwayId: null,
      studyLinkLessonSlug: null,
    };
    const planOk = planExamQuestionStudyLink("p-a", ["nclex-rn"], q, idx);
    assert.equal(planOk.action, "link");
    if (planOk.action === "link") assert.equal(planOk.lessonSlug, "lesson-a");
    const planWrong = planExamQuestionStudyLink("p-b", ["nclex-rn"], q, idx);
    assert.equal(planWrong.action, "skip");
  });

  it("ambiguous lesson matches are skipped for flashcards", () => {
    const lessons: LessonTopicIndexRow[] = [
      {
        id: "l1",
        pathwayId: "p1",
        slug: "s1",
        title: "T1",
        topicSlug: "t1",
        topic: "T1",
        locale: "en",
        status: "PUBLISHED",
      },
      {
        id: "l2",
        pathwayId: "p1",
        slug: "s2",
        title: "T2",
        topicSlug: "t1",
        topic: "T2",
        locale: "en",
        status: "PUBLISHED",
      },
    ];
    const idx = indexLessonsByPathwayTopic(lessons);
    const plan = planFlashcardLessonLink(
      {
        id: "c1",
        deckPathwayId: "p1",
        lessonId: null,
        categorySlug: "t1",
        categoryTopicCode: null,
      },
      idx,
    );
    assert.equal(plan.action, "ambiguous");
  });

  it("continue-learning CTA preserves pathwayId in href", () => {
    const href = buildAppLessonsReviewLessonHref("ca-rn-nclex-rn", "lesson-one");
    assert.ok(href.includes("pathwayId="));
  });

  it("adaptive remediation link list dedupes hrefs", () => {
    const d = createStudyLinkHrefDeduper();
    const a = buildAppFlashcardsTopicHref("p1", "t1");
    assert.equal(d(a), a);
    assert.equal(d(a), null);
  });

  it("resolveUniqueLessonForTopic picks single published lesson", () => {
    const rows: LessonTopicIndexRow[] = [
      {
        id: "id1",
        pathwayId: "p",
        slug: "slug1",
        title: "",
        topicSlug: "one",
        topic: "",
        locale: "en",
        status: "PUBLISHED",
      },
    ];
    const idx = indexLessonsByPathwayTopic(rows);
    const r = resolveUniqueLessonForTopic("p", "one", idx);
    assert.equal(r.status === "ok" && r.lesson.slug, "slug1", true);
  });
});
