import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveAdaptiveLoopDataGaps, type AdaptiveLoopContentRecommendation } from "@/lib/learner/adaptive-teaching-loop";

describe("deriveAdaptiveLoopDataGaps", () => {
  it("reports both gaps when payload/image are missing", () => {
    const rows: AdaptiveLoopContentRecommendation[] = [
      {
        kind: "question",
        id: "q1",
        title: "Q1",
        href: "/app/questions?focus=q1",
        topic: "Cardiac",
        subtopic: null,
        strongTeachingPayload: false,
        conceptImageAvailable: false,
        conceptImageUrl: null,
      },
    ];

    const gaps = deriveAdaptiveLoopDataGaps(rows);
    assert.equal(gaps.length, 2);
    assert.ok(gaps.some((g) => g.includes("high-quality teaching payload")));
    assert.ok(gaps.some((g) => g.includes("concept image")));
  });

  it("returns no gaps when either recommendation has payload and image coverage", () => {
    const rows: AdaptiveLoopContentRecommendation[] = [
      {
        kind: "question",
        id: "q1",
        title: "Q1",
        href: "/app/questions?focus=q1",
        topic: "Cardiac",
        subtopic: null,
        strongTeachingPayload: true,
        conceptImageAvailable: false,
        conceptImageUrl: null,
      },
      {
        kind: "lesson",
        id: "l1",
        title: "L1",
        href: "/app/lessons?topic=Cardiac",
        topic: "Cardiac",
        subtopic: null,
        strongTeachingPayload: false,
        conceptImageAvailable: true,
        conceptImageUrl: "https://example.com/i.png",
      },
    ];

    const gaps = deriveAdaptiveLoopDataGaps(rows);
    assert.equal(gaps.length, 0);
  });
});

