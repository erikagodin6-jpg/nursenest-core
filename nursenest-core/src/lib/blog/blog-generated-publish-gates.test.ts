import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectGeneratedBlogInternalLinkCoverageIssues,
  collectPaywallSafeCtaIssues,
  countApaStyleInTextCitations,
} from "@/lib/blog/blog-generated-publish-gates";

describe("blog-generated-publish-gates", () => {
  it("counts APA-style parenthetical citations with a year", () => {
    const html =
      "<p>(Centers for Disease Control and Prevention, 2024) and (World Health Organization, 2023).</p>";
    assert.equal(countApaStyleInTextCitations(html), 2);
  });

  it("requires paywall-safe CTA fragments", () => {
    const ok = collectPaywallSafeCtaIssues(
      "<p>Want more practice? NurseNest members can review the related lesson, flashcards, and rationale-based questions.</p>",
    );
    assert.deepEqual(ok, []);
    const bad = collectPaywallSafeCtaIssues("<p>Practice more questions today.</p>");
    assert.ok(bad.length > 0);
  });

  it("requires lessons, questions, and flashcards paths among internal links", () => {
    const bad = collectGeneratedBlogInternalLinkCoverageIssues([
      { suggestedPath: "/canada/rn/nclex-rn/lessons", reviewStatus: "active" },
      { suggestedPath: "/canada/rn/nclex-rn/lessons/extra", reviewStatus: "active" },
      { suggestedPath: "/canada/rn/nclex-rn/lessons/more", reviewStatus: "active" },
    ]);
    assert.ok(bad.some((m) => m.includes("questions")));
    assert.ok(bad.some((m) => m.includes("flashcards")));
  });
});
