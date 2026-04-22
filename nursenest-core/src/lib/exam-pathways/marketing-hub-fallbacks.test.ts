import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  EMPTY_QUESTION_SNAPSHOT,
  ZERO_LESSON_COUNT,
  emptyPathwayLessonsPageResult,
} from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";

describe("marketing hub degraded defaults", () => {
  it("EMPTY_QUESTION_SNAPSHOT is a stable unavailable marker", () => {
    assert.equal(EMPTY_QUESTION_SNAPSHOT.status, "unavailable");
  });

  it("ZERO_LESSON_COUNT stays numeric zero", () => {
    assert.equal(ZERO_LESSON_COUNT, 0);
  });

  it("emptyPathwayLessonsPageResult yields safe pagination shape", () => {
    const p = emptyPathwayLessonsPageResult(2, 12);
    assert.equal(p.page, 2);
    assert.equal(p.pageSize, 12);
    assert.equal(p.total, 0);
    assert.deepEqual(p.items, []);
  });
});

describe("formatMarketingMessage missing keys", () => {
  it("returns empty string in production for missing keys (no humanized / CSS-uppercased placeholders)", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      const s = formatMarketingMessage({}, "nav.examStrip.rn", undefined, undefined);
      assert.ok(!s.startsWith("[missing:"));
      assert.equal(s, "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("falls back to English for required marketing nav labels", () => {
    const i18nDir = path.join(process.cwd(), "..", "client", "public", "i18n");
    const english = JSON.parse(readFileSync(path.join(i18nDir, "en.json"), "utf8")) as Record<string, string>;
    const french = JSON.parse(readFileSync(path.join(i18nDir, "fr.json"), "utf8")) as Record<string, string>;
    // Force primary misses so we assert fallback behavior even when `fr.json` later adds these keys.
    const primaryMissingNav = { ...french };
    delete primaryMissingNav["nav.getStarted"];
    delete primaryMissingNav["nav.pathwayHubsAria"];

    assert.equal(
      formatMarketingMessage(primaryMissingNav, "nav.getStarted", undefined, english),
      "Get Started",
    );
    assert.equal(
      formatMarketingMessage(primaryMissingNav, "nav.pathwayHubsAria", undefined, english),
      "Pathway exam hubs",
    );
  });
});
