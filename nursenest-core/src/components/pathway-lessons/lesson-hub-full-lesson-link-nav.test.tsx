/**
 * Run: `npx tsx --test src/components/pathway-lessons/lesson-hub-full-lesson-link-nav.test.tsx`
 */
import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonHubFullLessonLinkNav } from "./lesson-hub-full-lesson-link-nav";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function row(slug: string, title: string): PathwayLessonRecord {
  return {
    slug,
    title,
    topic: "T",
    topicSlug: "t",
    system: "fundamentals",
    bodySystem: "fundamentals",
    previewSectionCount: 1,
    seoTitle: title,
    seoDescription: "Clinical framing and exam-style rationale for this topic in acute care nursing practice.",
    sections: [],
  };
}

test("LessonHubFullLessonLinkNav emits one crawlable detail href per lesson (sr-only nav)", () => {
  const lessons = Array.from({ length: 25 }, (_, i) => row(`hub-crawl-${i + 1}`, `Similar title ${i + 1}`));
  const html = renderToStaticMarkup(
    <section id="pathway-lesson-library">
      <LessonHubFullLessonLinkNav lessons={lessons} lessonsBasePath="/canada/rn/nclex-rn/lessons" />
    </section>,
  );
  assert.match(html, /id="pathway-lesson-library"/);
  const matches = html.match(/href="[^"]*\/lessons\/hub-crawl-\d+"/g) ?? [];
  assert.equal(matches.length, 25, "expected 25 unique lesson detail hrefs in initial HTML");
});
