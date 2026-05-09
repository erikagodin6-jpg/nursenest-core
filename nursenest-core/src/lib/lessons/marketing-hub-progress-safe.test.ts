import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  loadMarketingHubLessonProgressMapWithTimeout,
  MARKETING_HUB_PROGRESS_FETCH_TIMEOUT_MS,
} from "@/lib/lessons/marketing-hub-progress-safe";

describe("marketing-hub-progress-safe", () => {
  test("empty userId skips fetch", async () => {
    const r = await loadMarketingHubLessonProgressMapWithTimeout({
      userId: "",
      pathwayId: "us-rn-nclex-rn",
      lessonSlugs: ["any"],
    });
    assert.deepEqual(r.map, {});
    assert.equal(r.timedOut, false);
  });

  test("empty slug list skips fetch", async () => {
    const r = await loadMarketingHubLessonProgressMapWithTimeout({
      userId: "user-1",
      pathwayId: "us-rn-nclex-rn",
      lessonSlugs: [],
    });
    assert.deepEqual(r.map, {});
    assert.equal(r.timedOut, false);
  });

  test("slow progress fetch yields timedOut + empty map (hub stays renderable)", async () => {
    const r = await loadMarketingHubLessonProgressMapWithTimeout({
      userId: "user-1",
      pathwayId: "us-rn-nclex-rn",
      lessonSlugs: ["lesson-a"],
      timeoutMs: 25,
      progressFetcher: async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { "lesson-a": "completed" as const };
      },
    });
    assert.deepEqual(r.map, {});
    assert.equal(r.timedOut, true);
  });

  test("fast progress fetch returns map without timeout", async () => {
    const r = await loadMarketingHubLessonProgressMapWithTimeout({
      userId: "user-1",
      pathwayId: "us-rn-nclex-rn",
      lessonSlugs: ["lesson-a"],
      timeoutMs: 5_000,
      progressFetcher: async () => ({ "lesson-a": "in_progress" }),
    });
    assert.equal(r.map["lesson-a"], "in_progress");
    assert.equal(r.timedOut, false);
  });

  test("default timeout matches exported constant", () => {
    assert.ok(MARKETING_HUB_PROGRESS_FETCH_TIMEOUT_MS >= 5_000);
  });
});
