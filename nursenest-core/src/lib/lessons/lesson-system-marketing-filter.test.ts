import assert from "node:assert/strict";
import test from "node:test";
import type { MarketingHubLessonsListOptions } from "@/lib/exam-pathways/marketing-hub-lessons-page-args";
import { lessonSystemTopicSlugCandidates } from "@/lib/lessons/lesson-system-navigation";

function marketingListOpts(topicSlug: string | null, q: string | null): MarketingHubLessonsListOptions | undefined {
  const topicSlugsIn = topicSlug ? lessonSystemTopicSlugCandidates(topicSlug) : undefined;
  return q && topicSlug
    ? { q, topicSlugsIn: topicSlugsIn?.length ? topicSlugsIn : [topicSlug] }
    : q
      ? { q }
      : topicSlug
        ? { topicSlugsIn: topicSlugsIn?.length ? topicSlugsIn : [topicSlug] }
        : undefined;
}

test("marketing lesson topic filters expand system aliases instead of exact-matching only one slug", () => {
  assert.deepEqual(marketingListOpts("cardiovascular", null), { topicSlugsIn: ["cardiovascular", "cardiac", "cv", "heart"] });
  assert.ok(marketingListOpts("renal", null)?.topicSlugsIn?.includes("renal-and-urinary"));
  assert.ok(marketingListOpts("maternity", null)?.topicSlugsIn?.includes("maternal-and-newborn"));
  assert.ok(marketingListOpts("mental-health", null)?.topicSlugsIn?.includes("mental_health"));
  assert.ok(marketingListOpts("gastrointestinal", "pain")?.topicSlugsIn?.includes("nutrition"));
});
