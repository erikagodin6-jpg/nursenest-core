import assert from "node:assert/strict";
import * as React from "react";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";

test("LessonQualityNotice hidden: renders nothing for thin tier (no public warnings)", () => {
  const html = renderToStaticMarkup(<LessonQualityNotice tier="thin" wordCount={281} mode="hidden" />);
  assert.equal(html, "");
  assert.equal(html.includes("shorter"), false);
  assert.equal(html.includes("281"), false);
});

test("LessonQualityNotice staff_qa: internal copy, never public thin-depth phrasing", () => {
  const html = renderToStaticMarkup(<LessonQualityNotice tier="thin" wordCount={281} mode="staff_qa" />);
  assert.equal(html.includes("shorter than"), false);
  assert.equal(html.includes("teaching-depth target"), false);
  assert.equal(html.includes("Internal QA"), true);
  assert.ok(html.includes('data-testid="lesson-quality-notice-internal"'));
});
