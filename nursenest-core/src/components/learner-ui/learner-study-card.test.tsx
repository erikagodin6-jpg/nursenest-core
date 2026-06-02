import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LearnerStudyCard } from "@/components/learner-ui/learner-study-card";

describe("LearnerStudyCard", () => {
  it("default variant renders lv-card from learner design system", () => {
    const html = renderToStaticMarkup(<LearnerStudyCard>Content</LearnerStudyCard>);
    assert.match(html, /\blv-card\b/);
    assert.doesNotMatch(html, /\blv-card--primary\b/);
  });

  it("primary variant stacks lv-card and lv-card--primary", () => {
    const html = renderToStaticMarkup(<LearnerStudyCard variant="primary">Content</LearnerStudyCard>);
    assert.match(html, /\blv-card\b/);
    assert.match(html, /\blv-card--primary\b/);
  });
});
