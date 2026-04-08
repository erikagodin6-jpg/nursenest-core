import assert from "node:assert/strict";
import { test } from "node:test";
import {
  effectiveLessonHref,
  formatLessonRowsForBodyPrompt,
  isAllowedBlogInternalHref,
  lessonRowsToRelatedPaths,
} from "./blog-internal-lesson-links";

test("isAllowedBlogInternalHref rejects app and accepts pathway lessons", () => {
  assert.equal(isAllowedBlogInternalHref("/app/study-plan"), false);
  assert.equal(isAllowedBlogInternalHref("/us/rn/nclex-rn/lessons/fluid-balance"), true);
  assert.equal(isAllowedBlogInternalHref("/canada/rpn/rex-pn/questions"), true);
});

test("effectiveLessonHref respects removal and replacement", () => {
  assert.equal(
    effectiveLessonHref({
      suggestedPath: "/us/rn/nclex-rn/lessons/foo",
      replacementPath: null,
      reviewStatus: "removed",
    }),
    null,
  );
  const rep = effectiveLessonHref({
    suggestedPath: "/us/rn/nclex-rn/lessons/foo",
    replacementPath: "/us/rn/nclex-rn/questions",
    reviewStatus: "active",
  });
  assert.equal(rep, "/us/rn/nclex-rn/questions");
});

test("lessonRowsToRelatedPaths dedupes and aligns country", () => {
  const paths = lessonRowsToRelatedPaths(
    [
      {
        id: "a",
        label: "L",
        suggestedPath: "/us/rn/nclex-rn/lessons/a",
        reviewStatus: "active",
      },
      {
        id: "b",
        label: "L2",
        suggestedPath: "/us/rn/nclex-rn/lessons/a",
        reviewStatus: "active",
      },
    ],
    "unspecified",
  );
  assert.equal(paths.length, 1);
});

test("formatLessonRowsForBodyPrompt skips removed and invalid", () => {
  const s = formatLessonRowsForBodyPrompt([
    {
      id: "1",
      label: "Ok",
      suggestedPath: "/us/rn/nclex-rn/lessons/x",
      reviewStatus: "active",
    },
    {
      id: "2",
      label: "Bad",
      suggestedPath: "/app/nope",
      reviewStatus: "active",
    },
    {
      id: "3",
      label: "Gone",
      suggestedPath: "/us/rn/nclex-rn/lessons/y",
      reviewStatus: "removed",
    },
  ]);
  assert.ok(s.includes("Ok"));
  assert.ok(!s.includes("Bad"));
  assert.ok(!s.includes("Gone"));
});
