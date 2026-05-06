import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterMarketingLessonPathsForBlogExam } from "@/lib/blog/blog-marketing-lesson-path-tier";

describe("filterMarketingLessonPathsForBlogExam", () => {
  it("removes Canadian RPN lesson paths for NCLEX-RN exam focus", () => {
    const paths = ["/canada/rpn/rex-pn/lessons/sample-lesson", "/us/rn/nclex-rn/lessons/heart-failure-nclex-rn"];
    const out = filterMarketingLessonPathsForBlogExam("NCLEX-RN", paths);
    assert.deepEqual(out, ["/us/rn/nclex-rn/lessons/heart-failure-nclex-rn"]);
  });
});
