import assert from "node:assert/strict";
import test from "node:test";
import { isPlausibleMarketingLessonDetailPath } from "@/lib/lessons/marketing-lesson-path-guard";

test("isPlausibleMarketingLessonDetailPath accepts public lesson detail paths", () => {
  assert.equal(isPlausibleMarketingLessonDetailPath("/us/rn/nclex-rn/lessons/fluid-balance"), true);
});

test("isPlausibleMarketingLessonDetailPath rejects private/system, query, hash, hub, and topic routes", () => {
  for (const path of [
    "/app/lessons/private",
    "/admin/lessons/private",
    "/api/lessons/private",
    "/seo/lessons/private",
    "/us/rn/nclex-rn/lessons/fluid-balance?from=blog",
    "/us/rn/nclex-rn/lessons/fluid-balance#top",
    "/us/rn/nclex-rn/lessons",
    "/us/rn/nclex-rn/lessons/topics/cardio",
  ]) {
    assert.equal(isPlausibleMarketingLessonDetailPath(path), false, path);
  }
});
