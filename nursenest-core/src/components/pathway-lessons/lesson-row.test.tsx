import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonRow } from "./lesson-row";

describe("LessonRow", () => {
  it("paid user sees progress badge with Completed / In progress / Not started", () => {
    const completed = renderToStaticMarkup(
      <LessonRow
        href="/lesson"
        title="Sample"
        progressStatus="completed"
        showProgress
        durationLabel="8 min"
        difficulty="medium"
      />,
    );
    assert.match(completed, /Completed/);
    assert.match(completed, /lesson-row-progress-badge/);

    const open = renderToStaticMarkup(
      <LessonRow
        href="/lesson"
        title="Sample"
        progressStatus="in_progress"
        showProgress
        durationLabel="8 min"
        difficulty="medium"
      />,
    );
    assert.match(open, /In progress/);

    const fresh = renderToStaticMarkup(
      <LessonRow
        href="/lesson"
        title="Sample"
        progressStatus="not_started"
        showProgress
        durationLabel="8 min"
        difficulty="medium"
      />,
    );
    assert.match(fresh, /Not started/);
  });

  it("unpaid visitor does not see paid progress UI", () => {
    const html = renderToStaticMarkup(
      <LessonRow
        href="/lesson"
        title="Sample"
        progressStatus="completed"
        showProgress={false}
        durationLabel="8 min"
        difficulty="medium"
      />,
    );
    assert.doesNotMatch(html, /lesson-row-progress-badge/);
    assert.doesNotMatch(html, /Completed/);
  });
});
