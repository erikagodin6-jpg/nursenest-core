import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeRationaleLessonLinksWithTopicFallback } from "@/lib/questions/merge-rationale-lesson-links";

describe("mergeRationaleLessonLinksWithTopicFallback", () => {
  it("keeps API lesson links when provided", () => {
    const links = mergeRationaleLessonLinksWithTopicFallback(
      [
        {
          kind: "topic_lessons",
          slug: "existing",
          title: "Existing",
          href: "/app/lessons/existing",
          hrefSource: "app",
          ctaKey: "learner.qbank.rationaleLinks.openTopicLessons",
        },
      ],
      "Cardiac",
      "us-rn-nclex-rn",
    );
    assert.equal(links[0]?.href, "/app/lessons/existing");
  });

  it("adds a pathway-aware lesson fallback when only the topic is known", () => {
    const links = mergeRationaleLessonLinksWithTopicFallback([], "Cardiac", "us-rn-nclex-rn");
    assert.equal(links.length, 1);
    assert.equal(links[0]?.href, "/app/lessons?topic=Cardiac&pathwayId=us-rn-nclex-rn");
  });
});
