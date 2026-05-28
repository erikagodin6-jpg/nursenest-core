import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EcgStructuredLessonList } from "@/components/ecg-module/ecg-structured-lesson-list";
import {
  getEcgStructuredLessons,
  getEcgStructuredLessonStripConfig,
} from "@/lib/ecg-module/ecg-structured-lessons";

test("basic ECG structured lessons render deterministic live strips", () => {
  const html = renderToStaticMarkup(<EcgStructuredLessonList level="basic" />);
  const stripCount = html.match(/data-testid="ecg-live-strip"/g)?.length ?? 0;

  assert.ok(stripCount >= 10, `Expected basic lessons to render ECG strips, found ${stripCount}`);
  assert.match(html, /Normal Sinus Rhythm — (annotated review|independent interpretation)/);
  assert.match(html, /Atrial Fibrillation — (annotated review|independent interpretation)/);
  assert.match(html, /Interactive measurement lab/);
  assert.match(html, /University-level ECG foundations/);
});

test("every basic ECG structured lesson has a deterministic strip config", () => {
  const missing = getEcgStructuredLessons("basic")
    .filter((lesson) => !getEcgStructuredLessonStripConfig(lesson))
    .map((lesson) => lesson.id);

  assert.deepEqual(missing, []);
});
