import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingLessonsHubRetryableErrorShell } from "./marketing-lessons-hub-retryable-error-shell";
import { LessonsToolbar } from "./lessons-toolbar";

describe("MarketingLessonsHubRetryableErrorShell (hub verify invariant UX)", () => {
  it("shows the professional load-failure state, not an empty-library message", () => {
    const html = renderToStaticMarkup(
      <MarketingLessonsHubRetryableErrorShell
        title="Lessons"
        subtitle="Browse lessons for NCLEX-RN."
        toolbar={
          <LessonsToolbar
            searchBasePath="/us/rn/nclex-rn/lessons"
            preservedTopicSlug={undefined}
            preservedAlliedProfession={undefined}
          />
        }
        backLabel="Exam overview"
        backHref="/us/rn/nclex-rn"
        crumbs={[{ label: "Home", href: "/" }]}
        schemaItems={[]}
        surfaceChips={[{ label: "Practice questions", href: "/q" }]}
        errorTitle={"We're having trouble loading lessons"}
        errorBody={"This isn't your fault. Something went wrong on our side."}
        retryHref="/us/rn/nclex-rn/lessons"
        secondaryHref="/us/rn/nclex-rn"
        secondaryLabel="Back to exam overview"
        supportHref="/us/contact"
        supportLabel="Contact support"
      />,
    );

    assert.match(html, /data-testid="marketing-hub-load-error"/);
    assert.match(html, /We(&#x27;|')re having trouble loading lessons/);
    assert.match(html, /This isn(&#x27;|')t your fault\. Something went wrong on our side\./);
    assert.match(html, />Retry</);
    assert.match(html, /href="\/us\/contact"/);
    assert.match(html, />Contact support</);
    assert.doesNotMatch(html, /No lessons/i);
    assert.doesNotMatch(html, /0 lesson/i);
    assert.doesNotMatch(html, /lessons in this pathway/i);
    assert.doesNotMatch(html, /prepared_count/i);
  });
});
