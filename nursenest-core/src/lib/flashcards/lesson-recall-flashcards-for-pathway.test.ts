import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectLessonRecallFlashcardsForPathway } from "@/lib/flashcards/lesson-recall-flashcards-for-pathway";

describe("collectLessonRecallFlashcardsForPathway", () => {
  it("produces starter cards for Canada RN NCLEX from bundled catalog takeaways / recall", () => {
    const rows = collectLessonRecallFlashcardsForPathway("ca-rn-nclex-rn");
    assert.ok(rows.length > 0, "expected catalog-derived flashcards for CA RN pathway");
    const prefixes = rows.map((r) => r.id.split(":")[0] ?? "");
    assert.ok(prefixes.some((p) => ["lrp", "lrf", "lrc", "ltk", "lta"].includes(p)));
    assert.ok(rows.every((r) => r.lessonHref.startsWith("/") || r.lessonHref.startsWith("http")));
  });
});
