/**
 * Regression: marketing pathway client boundaries stay thin — no full `PathwayLessonRecord` / `sections[]`
 * on `"use client"` lesson surfaces.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  pickPathwayLessonMarketingRecordChipsSource,
  toPathwayLessonDeferredServerSnapshot,
} from "./marketing-pathway-lesson-client-contract";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");

const MARKETING_CLIENT_LESSON_FILES = [
  "src/components/lessons/pathway-lesson-quick-review.tsx",
  "src/components/lessons/pathway-lesson-actions.tsx",
  "src/components/lessons/pathway-lesson-assessment-experience.tsx",
  "src/components/lessons/pathway-lesson-progress-tracker.tsx",
  "src/components/lessons/pathway-lesson-progress-badge-live.tsx",
  "src/components/lessons/pathway-lesson-quizzes.tsx",
] as const;

describe("toPathwayLessonDeferredServerSnapshot", () => {
  it("drops sections and other heavy fields at runtime", () => {
    const full = {
      slug: "s",
      title: "T",
      topic: "tp",
      topicSlug: "ts",
      bodySystem: "G",
      relatedLessonRefs: [],
      sections: [{ id: "x", heading: "H", kind: "clinical_meaning" as const, body: "SECRET" }],
      seoTitle: "seo",
    } as unknown as PathwayLessonRecord;
    const snap = toPathwayLessonDeferredServerSnapshot(full);
    assert.equal(Object.prototype.hasOwnProperty.call(snap, "sections"), false);
    assert.equal("sections" in snap, false);
    assert.equal(snap.slug, "s");
  });
});

describe("pickPathwayLessonMarketingRecordChipsSource", () => {
  it("returns only chip metadata fields", () => {
    const full = {
      topic: "t",
      bodySystem: "b",
      examRelevance: "high_yield" as const,
      audienceTiers: ["rn" as const],
      countryScope: "us" as const,
      sections: [{ id: "1", heading: "", kind: "clinical_meaning" as const, body: "X" }],
    } as unknown as PathwayLessonRecord;
    const chips = pickPathwayLessonMarketingRecordChipsSource(full);
    assert.equal(Object.prototype.hasOwnProperty.call(chips, "sections"), false);
    assert.equal(chips.topic, "t");
  });
});

describe("marketing lesson client files — no PathwayLessonRecord prop threading", () => {
  it("does not declare lesson: PathwayLessonRecord on client components (grep)", () => {
    for (const rel of MARKETING_CLIENT_LESSON_FILES) {
      const src = readFileSync(join(root, rel), "utf8");
      assert.match(src, /"use client"/);
      assert.ok(
        !/\blesson\s*:\s*PathwayLessonRecord\b/.test(src),
        `${rel} must not accept lesson: PathwayLessonRecord`,
      );
    }
  });

  it("quick review uses contract prop name quickReviewLines", () => {
    const src = readFileSync(join(root, "src/components/lessons/pathway-lesson-quick-review.tsx"), "utf8");
    assert.match(src, /MarketingPathwayLessonQuickReviewClientProps/);
    assert.match(src, /quickReviewLines/);
    assert.ok(!/\bbullets\s*:/.test(src), "legacy bullets prop removed");
  });
});
