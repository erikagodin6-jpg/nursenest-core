import test from "node:test";
import assert from "node:assert/strict";
import {
  pathwayLessonMarketingDetailHref,
  pathwayLessonMarketingHubVerifiedCardHref,
} from "@/lib/lessons/pathway-lesson-types";

test("pathwayLessonMarketingHubVerifiedCardHref matches detail href when not degraded", () => {
  const base = "/us/rn/nclex-rn/lessons";
  const lesson = { slug: "acid-base-balance", hubMarketingDegraded: false };
  assert.equal(
    pathwayLessonMarketingHubVerifiedCardHref(base, lesson),
    pathwayLessonMarketingDetailHref(base, lesson.slug),
  );
});

test("pathwayLessonMarketingHubVerifiedCardHref is null when hubMarketingDegraded", () => {
  const base = "/us/rn/nclex-rn/lessons";
  const lesson = { slug: "acid-base-balance", hubMarketingDegraded: true };
  assert.equal(pathwayLessonMarketingHubVerifiedCardHref(base, lesson), null);
});

test("pathwayLessonMarketingHubVerifiedCardHref treats undefined hubMarketingDegraded as linkable", () => {
  const base = "/ca/rn/nclex-rn-ca/lessons";
  const lesson = { slug: "sample-lesson-slug" };
  assert.equal(
    pathwayLessonMarketingHubVerifiedCardHref(base, lesson),
    pathwayLessonMarketingDetailHref(base, "sample-lesson-slug"),
  );
});
