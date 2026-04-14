import test from "node:test";
import assert from "node:assert/strict";
import { extractBulletLinesFromLessonBody } from "@/lib/lessons/lesson-high-yield-study-fields";

test("extractBulletLinesFromLessonBody pulls bullet lines", () => {
  const body = `Intro line\n\n• **First** point here\n- Second point\n* Third`;
  const lines = extractBulletLinesFromLessonBody(body);
  assert.ok(lines.length >= 2);
  assert.match(lines[0] ?? "", /First/);
});
