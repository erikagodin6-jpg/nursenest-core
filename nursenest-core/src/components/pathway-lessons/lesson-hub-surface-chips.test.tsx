import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonHubSurfaceChips } from "./lesson-hub-surface-chips";

describe("LessonHubSurfaceChips", () => {
  it("renders quick links for discovery", () => {
    const html = renderToStaticMarkup(
      <LessonHubSurfaceChips
        links={[
          { label: "Practice questions", href: "/us/rn/nclex-rn/questions" },
          { label: "Adaptive CAT", href: "/us/rn/nclex-rn/cat" },
        ]}
      />,
    );
    assert.match(html, /data-testid="lesson-hub-surface-chips"/);
    assert.match(html, /href="\/us\/rn\/nclex-rn\/questions"/);
    assert.match(html, />Practice questions</);
  });
});
