import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRnLessonBlogDuplicateHash,
  buildRnLessonSeoDraft,
  buildRnLessonSeoVariants,
  keywordClusterFromDuplicateHash,
  lessonHasHighQualityBody,
  pathwayLessonPublicPath,
} from "@/lib/blog/rn-lesson-seo-blog-generator";

test("buildRnLessonBlogDuplicateHash is deterministic for title+topicSlug", () => {
  const a = buildRnLessonBlogDuplicateHash("NCLEX Sepsis Questions", "sepsis");
  const b = buildRnLessonBlogDuplicateHash("nclex sepsis questions", "SEPSIS");
  assert.equal(a, b);
  assert.equal(keywordClusterFromDuplicateHash(a).startsWith("rn-lesson-seo-hash:"), true);
});

test("buildRnLessonSeoVariants creates required long-tail trio", () => {
  const out = buildRnLessonSeoVariants("heart failure");
  assert.equal(out.length, 3);
  assert.equal(out[0]?.title, "NCLEX heart failure questions");
  assert.equal(out[1]?.title, "How to understand heart failure nursing");
  assert.equal(out[2]?.title, "NCLEX practice questions heart failure");
});

test("buildRnLessonSeoDraft includes lesson backlink, five practice questions, and free trial CTA", () => {
  const lessonPath = pathwayLessonPublicPath("us-rn-nclex-rn", "heart-failure-basics");
  assert.equal(lessonPath, "/us/rn/nclex-rn/lessons/heart-failure-basics");
  const draft = buildRnLessonSeoDraft({
    lesson: {
      pathwayId: "us-rn-nclex-rn",
      slug: "heart-failure-basics",
      title: "Heart Failure Nursing Care",
      topic: "heart failure",
      topicSlug: "heart-failure",
      bodySystem: "Cardiovascular",
      sections: [{ body: "x" }],
    },
    variant: { intent: "nclex_topic_questions", title: "NCLEX heart failure questions" },
  });
  assert.match(draft.body, /<ol>/);
  const liMatches = draft.body.match(/<li>/g);
  assert.equal(liMatches?.length ?? 0, 5);
  assert.match(draft.body, /Start free trial/i);
  assert.match(draft.body, /\/us\/rn\/nclex-rn\/lessons\/heart-failure-basics/);
});

test("lessonHasHighQualityBody enforces section and word floor", () => {
  const dense = "word ".repeat(260);
  const ok = lessonHasHighQualityBody([{ body: dense }, { body: dense }, { body: dense }], 700);
  const no = lessonHasHighQualityBody([{ body: "brief text" }, { body: dense }, { body: dense }], 700);
  assert.equal(ok, true);
  assert.equal(no, false);
});

